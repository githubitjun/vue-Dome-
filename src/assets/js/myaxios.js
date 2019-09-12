
import Vue from 'vue'
import axios from 'axios'


var myaxios ={}
myaxios.install = function(Vue){
    //统一设置请求的 API
    axios.defaults.baseURL='http://localhost:8888/api/private/v1/'
    // 设置一个请求拦截器
    axios.interceptors.request.use(config=>{
        //这里是一个回调函数,这个函数会在请求发送之前执行,这个 axios 的所有的参数 都已经放在了 config 中
        if (config.url!=='login') {
            // 统一 token 
            // axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            //应该将 token 添加到 config中
            config.headers.common['Authorization'] = window.localStorage.getItem('token')
        }
        return config
    })
    Vue.prototype.$http = axios
}
//将对象暴露出去
export default myaxios