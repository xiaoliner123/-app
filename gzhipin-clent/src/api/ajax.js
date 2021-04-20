/*能发送ajax请求的函数模块
返回的是promise数据
*/
import axios from 'axios'

export default function ajax(url,data={},type='GET'){
    if(type==='GET'){//发送个体请求
        let paramStr = ''
        Object.keys(data).forEach(key =>{
            paramStr += key + '=' + data[key] + '&'
        })//得到username，password值的数组
        if(paramStr){
            paramStr = paramStr.substring(0,paramStr.length-1)
        }
        return axios.get(url+'?'+paramStr)
    }else{//发送post请求
        return axios.post(url,data)
    }
}