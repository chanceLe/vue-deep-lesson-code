<template>
	<div>
		<MyTree :data.sync="data"
		:fileDrop="fileDrop"
		:directoryDrop="directoryDrop"
		:delete="handleDelete"
		></MyTree> 
		<!--  v-if="data.length" -->
	</div>
</template>

<script>
	import MyTree from './components/MyTree/index.vue'
	import  { getTreeList }  from './api.js';
	export  default {
		name:'App',
		data(){
			return {
				data:[],
				fileDrop:[
					{text:'rm',value:'删除文件'},
				],
				directoryDrop:[
					{text:'rn',value:'修改名字'},
					{text:'rm',value:'删除文件夹'}
				]
			}
		},
		components:{
			MyTree:MyTree,
		},
		methods:{
			handleDelete(id){ //这个方法必须返回一个  promise
			return new Promise((resolve,reject)=>{
				setTimeout(()=>{
					resolve();
				},3000)
			})
				
			}
		},
		async mounted(){
			let res = await getTreeList();
			let data =  res.data.data;
			data.parent.forEach(p=> p.type = "parent")
			this.data = [...data.child,...data.parent];
		}
	}
</script>

<style>
</style>
