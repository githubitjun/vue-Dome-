import Vue from 'vue'
import Router from 'vue-router'

var Login=()=> import( '../components/login/login.vue')
var Home=()=>  import( '../components/home/home.vue')
var Users=()=> import( '../components/users/users.vue')
var Rights=()=> import( '../components/rights/rights.vue')
var Roles=()=> import( '../components/roles/roles.vue')
var Categories=()=> import( '../components/categories/categories.vue')
var Goods=()=> import( '../components/goods/goods.vue')
var GoodsAdd=()=> import( '../components/goodsAdd/goodsAdd.vue')
var Orders=()=> import( '../components/orders/orders.vue')
var Reports=()=> import( '../components/reports/reports.vue')

//引入 message 
import {Message} from 'element-ui'
Vue.use(Router)

var router = new  Router({
  routes: [
    {path:'/',redirect:'/home'},
    // {path:'/',redirect:{name:'home'}}, //重定向
    {path:'/login',name:'login',component:Login},
    {path:'/home',name:'home',component:Home,
    children:[
      {path:'/users',name:'users',component:Users}, //用户列表
      {path:'/rights',name:'rights',component:Rights},  //权限列表
      {path:'/roles',name:'roles',component:Roles},  //角色列表
      {path:'/categories',name:'categories',component:Categories},  //商品分类
      {path:'/goods',name:'goods',component:Goods},  //商品列表
      {path:'/goods/add',name:'goodsadd',component:GoodsAdd},  //添加商品页面
      {path:'/orders',name:'orders',component:Orders},  //订单管理
      {path:'/reports',name:'reports',component:Reports},  //数据报表
    ]},
  ]
})

//添加一个人路由守卫
router.beforeEach((to,from,next)=>{
    //完成登录逻辑
    //只要请求的路由不是 login 就需要进行登录验证
    if (to.path != '/login') {
        if (!window.localStorage.getItem('token')) {
          Message({
            type:'error',
            message:'你还没有登录'
          })
          router.push('/login')
          return
        }
    }
    next()
})


export default router
