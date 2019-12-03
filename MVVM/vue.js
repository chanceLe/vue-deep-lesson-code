class Compiler{
	constructor(el,vm){
		// 判断el属性  是不是 一个元素, 如果不是就获取
		this.el  = this.isElementNode(el)?el:document.querySelector(el);
		// console.log(this.el);
		
		
		this.vm = vm;
		
		// 把当前节点放到内存中
		let fragment = this.node2fragment(this.el);
		// console.log(fragment,"fragment")
		
		// 把节点中的内容进行替换
		
		// 用数据编译模板
		this.compile(fragment)
		
		// 把结果再塞到页面中
		this.el.appendChild(fragment);
		
	}
	
	isDirective(attrName){
		return attrName.startsWith('v-');
	}
	// 编译元素的
	compileElement(node){
		let attributes = node.attributes;
		[...attributes].forEach(attr=>{
			let {name,value:expr} = attr;
			// console.log(name,value,"attr");
			// 判断是不是指令
			if(this.isDirective(name)){
				let [,directive] = name.split("-");
				
				let [directiveName,eventName] =  directive.split(":");  //v-on:click
				CompileUtils[directiveName](node,expr,this.vm, eventName);
			}
		})
	}
	
	// 编译文本的 
	compileText(node){
		let content = node.textContent;
		// console.log(content)
		if(/\{\{(.+?)\}\}/.test(content)){
			console.log(content,"文本"); //找到所有文本
			CompileUtils['text'](node,content,this.vm);
		}
	}
	
	// 用来编译内存中的dom节点   核心编译方法
	compile(node){
		let childNodes = node.childNodes; 
		[...childNodes].forEach(child=>{
			if(this.isElementNode(child)){
				this.compileElement(child);
				// console.log("element",child);
				// 如果是元素  需要再次编译子节点
				this.compile(child);
			}else{
				this.compileText(child);
				// console.log("text",child)
			}
		})
		// console.log(childNodes)
	}
	
	
	// 把节点移动到内存中
	node2fragment(node){
		// 创建一个文档碎片 
		let fragment = document.createDocumentFragment();
		let firstChild;
		while(firstChild = node.firstChild){
			// appendChild 具有移动性
			fragment.appendChild(firstChild);
		}
		return fragment;
	}
	isElementNode(node){  //是不是元素节点
		return node.nodeType === 1;
	}
}

CompileUtils = {
	// 根据表达式取到对应的数据
	getVal(vm,expr){
		return expr.split(".").reduce((data,current)=>{
			return data[current];
		},vm.$data)
	},
	
	// 设置值
	setValue(vm,expr,value){
		expr.split(".").reduce((data,current,index,arr)=>{
			if(index == arr.length-1){
				data[current] = value;
			}
			return data[current];
		},vm.$data)
	},
	// 解析v-model指令
	model(node,expr,vm){  //node是节点  expr 是表达式 vm是实例
		// 给输入框赋予value   node.value = xxx
		let fn = this.updater['modelUpdater'];
		
		// 给输入框加一个观察者,如果数据更新了 会触发此方法,会拿新值给输入框赋值
		new Watcher(vm,expr,(newVal)=>{
			fn(node,newVal);
		});
		
		node.addEventListener('input',(e)=>{
			let value = e.target.value;  //获取用户输入的内容
			this.setValue(vm,expr,value);
		})
		let value = this.getVal(vm,expr); 
		fn(node,value);
	},
	html(node,expr,vm){
		let fn = this.updater['htmlUpdater'];
		
		// 给输入框加一个观察者,如果数据更新了 会触发此方法,会拿新值给输入框赋值
		new Watcher(vm,expr,(newVal)=>{
			fn(node,newVal);
		});
		let value = this.getVal(vm,expr); 
		fn(node,value);
	},
	
	on(node,expr,vm,eventName){ //expr  就是 change
		node.addEventListener(eventName,(e)=>{
			vm[expr].call(vm,e);  //这里需要把  methods 绑定到 vm上
		})
	},
	
	getContentValue(vm,expr){
		// 遍历表达式 将内容重新替换成完整的内容
		return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
			return this.getVal(vm,args[1]);
		})
	},
	text(node,expr,vm){
		let fn = this.updater['textUpdater'];
		let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
			
			// 给表达式每个{{}}  都加上观察者
			new Watcher(vm,args[1],()=>{
				fn(node,this.getContentValue(vm,expr)); //返回一个全的字符串
			})
			return this.getVal(vm,args[1]);
		});
		fn(node,content);
	},
	updater:{
		// 把数据插入到节点中
		modelUpdater(node,value){
			node.value = value;
		},
		htmlUpdater(node,value){  //xss攻击
			node.innerHTML = value;
		},
		//处理文本节点
		textUpdater(node,value){
			node.textContent = value;
		}
	},
	
	
}

// 实现数据劫持的功能
class Observer{
	constructor(data){
		console.log(data);
		this.observe(data);
	}
	observe(data){
		if(data && typeof data == "object"){
			// 如果是对象
			for(let key in data){
				this.defineReactive(data,key,data[key]);
			}
		}
	}
	
	defineReactive(obj,key,value){
		this.observe(value);
		let dep = new Dep(); //给每个属性都加上 发布订阅的功能
		Object.defineProperty(obj,key,{
			get(){
				
				// 创建watcher时 会取到对应的内容, 并且把watcher放到了全局上
				Dep.target && dep.subs.push(Dep.target);
				return value;
			},
			set:(newVal)=>{
				if(newVal != value){
					this.observe(newVal);
					value = newVal;
					dep.notify();
				}	
			}
		})
	}
}

// 观察者 (发布订阅)
class Dep{
	constructor() {
	    this.subs = [];  //存放所有的watcher
	}
	// 订阅
	addSub(watcher){  //添加watcher
		this.subs.push(watcher);
	}
	// 发布
	notify(){
		this.subs.forEach(watcher=>watcher.update());
	}
	
}
class Watcher{
	constructor(vm,expr,cb){
		this.vm  = vm;
		this.expr = expr;
		this.cb = cb;
		// 默认先存放一个老值
		this.oldValue = this.get();
	}
	
	get(){
		Dep.target = this;  //先把自己放在Dep.target上
		
		// 取值,把这个观察者和数据关联起来
		let value = CompileUtils.getVal(this.vm,this.expr);
		Dep.target = null;  //不取消, 任何值取值  都会添加 watcher
		return value;
	}
	update(){  //更新操作,数据变化后 会调用观察者的update方法
		let newVal = CompileUtils.getVal(this.vm,this.expr);
		if(newVal !== this.oldValue){
			this.cb(newVal);
		}
	}
}

class Vue{
	constructor(options){
		this.$el = options.el;
		this.$data = options.data;
		
		let computed = options.computed;
		
		let methods = options.methods;
		
		// 这个根元素 存在编译模板
		if(this.$el){ 
			
			// 把数据全部转化成用Object.defineProperty来定义.
			new  Observer(this.$data);
			
		
			// 计算属性
			for(let key in computed){  //有依赖关系
				Object.defineProperty(this.$data,key,{
					get:() => {
						return computed[key].call(this);
					}
				})
			}
			
			
			// 绑定到vm上 进行代理 
			for(let key in methods){
				Object.defineProperty(this,key,{
					get(){
						return methods[key];
					}
				})
			}
			
			//把数据获取操作  vm上的取值操作 都代理到 vm.$data
			this.proxyVm(this.$data);
			
			console.log(this.$data,"$data")
			new Compiler(this.$el,this);
		}
	}
	// 实现可以通过vm取到对应的data中的值
	proxyVm(data){
		for(let key in data){
			Object.defineProperty(this,key,{
				get(){
					return data[key];  //进行转化操作
				},
				set(newVal){  //设置代理方法
					data[key] = newVal;
				}
			})
		}
	}
}