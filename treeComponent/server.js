let express = require("express");

let app = express();

app.use((req,res,next)=>{
	res.header("Access-Control-Allow-Origin",'*');  //允许所有源跨域
	if(req.method === "OPTIONS"){  //如果是option请求 就干掉
		return res.send();
	}
	next();
})

app.get("/getTreeList",(req,res)=>{
	res.json({
		code:0,
		data: {
			parent:[
				{name:'文件夹1',pid:0,id:1},
				{name:'文件夹2',pid:0,id:2},
				{name:'文件夹3',pid:0,id:3},
				{name:'文件夹1-1',pid:1,id:4},
				{name:'文件夹2-1',pid:2,id:5}
			],
			child:[
				{name:'文件夹1',pid:1,id:10001},
				{name:'文件夹2',pid:1,id:10002},
				{name:'文件夹2-1',pid:2,id:10003},
				{name:'文件夹2-2',pid:2,id:10004},
				{name:'文件夹1-1-1',pid:4,id:10005},
				{name:'文件夹2-1-1',pid:5,id:10006}
			]
		}
	})
});

app.listen(3000);