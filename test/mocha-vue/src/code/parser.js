export  let parser = (str) => {
	let obj = {};
	str.replace(/([^&=]*)=([^&=]*)/g,function(){
		obj[arguments[1]] = arguments[2];
	});
	return obj;
}

export let stringify = (obj) => {
	let arr = [];
	for(let key in obj){
		arr.push(`${key}=${obj[key]}`);
	}
	return arr.join("&");
}
/*
前端测试的时候
1.会自测,不会保留测试代码,测试代码会混在源码中
2.
*/