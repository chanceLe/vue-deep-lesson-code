import axios from 'axios';
// axios.default.baseUrl = "http://localhost:3000";


export  const  getTreeList = () =>{
	return axios.get('http://localhost:3000/getTreeList');
}