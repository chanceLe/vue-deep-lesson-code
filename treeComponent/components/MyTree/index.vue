<template>
	 <el-tree
	 
	 :data="allData"
	 default-expand-all
	 :expand-on-click-node="false"
	 :render-content="render"
	 > 
	 </el-tree>
</template>

<script>
	import _ from 'lodash';
	export default {
		name:'MyTree',
		props:{
			data:{
				type:Array,
				default: ()=> []
			},
			fileDrop:Array,
			directoryDrop:Array,
			delete:Function
		},
		data(){
			return {
				allData:[]
			}
		},
		watch:{
			data(){  //数据更新了  需要重新渲染
				this.transformData();
			}
		},
		mounted() {
			
			
		},
		methods:{
			isParent(data){
				return data.type === 'parent';
			},
			handleRename(data){  //重命名
				
			},
			remove(id){
				let list = _.cloneDeep(this.data);
				list = list.filter(item=> item.id !== id);
				this.$emit("update:data",list);
				this.$message({
				  type: 'success',
				  message: '删除成功!'
				});
			},
			handleRemove(data){  //删除
				 this.$confirm(`此操作将永久删除该文件,${data.name} ,是否继续?`, '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							
							//做个钩子  调取用户的删除方法
							// 如果用户传了 delete方法 
							this.delete && this.delete(data.id).then(()=>{
								this.remove(data.id);
							});
				          // this.$message({
				          //   type: 'success',
				          //   message: '删除成功!'
				          // });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			
			handleCommand(data,value){
				console.log(value,"value")
				if(value === "rn"){
					this.handleRename(data)
				}else if(value === "rm"){
					this.handleRemove(data)
				}
			},
			render(h,{node,data,store}){
				console.log(data.type,"data")
				let list  = this.isParent(data)? this.directoryDrop : this.fileDrop;
				console.log(list,"list")
				return (<div style="width:100%">
				{
					this.isParent(data)?
					node.expanded ? <i class="el-icon-folder-opened"></i>: <i class="el-icon-folder"></i>	:
					<i class="el-icon-document"></i>
				}
					{data.name}
					<el-dropdown  placement="bottom-start" trigger="click"  on-command={this.handleCommand.bind(this,data)}>
					  <span class="el-dropdown-link">
						<i class="el-icon-arrow-down el-icon--right"></i>
					  </span>
					  <el-dropdown-menu slot="dropdown">
					  {list.map(item => <el-dropdown-item command={item.text}>{item.value}</el-dropdown-item>)}
					  </el-dropdown-menu>
					</el-dropdown>
				</div>)
			},
			transformData(){
				// 需要根据数据进行克隆，操作克隆后的数据
				let allData = _.cloneDeep(this.data)
				// 目的是防止在子组件中操作父组件的数据
				
				let treeMapList =  allData.reduce((memo,current)=>{
					current.label = current.name;
					memo[current["id"]] = current;
					return memo;
				},{})
				
				let  result = allData.reduce((arr,current)=>{
					let  pid = current.pid;
					let parent = treeMapList[pid];
					if(parent){
						parent.children?parent.children.push(current):parent.children = [current];
					}else if(pid === 0){
						arr.push(current);
					}
					return arr;
				},[])
				this.allData = result;
			}
		}
	}
</script>

<style>
	.el-tree{
		width: 50%
	}
	.el-dropdown{
		float: right;
	}


</style>
