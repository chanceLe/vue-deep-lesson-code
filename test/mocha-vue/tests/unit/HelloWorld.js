import HelloWorld from'@/components/HelloWorld';
import {expect} from 'chai';
import Vue  from 'vue';

import {mount}  from '@vue/test-utils';


// 该方法手动挂载  比较复杂
describe('HelloWorld',()=>{
	it("传递属性后能否正常显示结果",()=>{  //测试组件的ui效果是否和预期一致
		// 原生自己测试vue
		// extend方法可以根据实例创建出一个类
		let Contructor = Vue.extend(HelloWorld);
		// 把组件进行挂载
		// vm.$el  //mocha测试的时候集成了 jsdom
		let  vm = new Contructor({
			propsData:{
				msg:'hello'
			}
		}).$mount();
		
		expect(vm.$el.querySelector('h1').innerHTML).to.be.contain('hello') 
	})
})


// 使用vue带的 测试库  @vue/test-utils
describe('helloWorldTest',()=>{
	it("测试HelloWorld组件",()=>{
		let  wrapper = mount(HelloWorld,{
			propsData:{
				msg:'hello'
			}
		});
		// wrapper.setProps({msg:'hello'})  //也可以用这种方式传递属性参数
		expect(wrapper.find('h1').text()).to.be.contain("hello")
	})
})