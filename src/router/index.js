import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome'
import Login from '../components/Login.vue'
import Users from '../components/user/Users'
import Home from '../components/Home.vue'
import Person from "../components/user/Person"
import Menu from "../components/system/Menu"
import Role from "../components/system/Role"
import Data from "../components/system/dict/index";

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/system/user', component: Users },
        { path: '/system/menu', component: Menu },
        { path: '/system/role', component: Role },
        {path: '/user/profile',component:Person},
        {path:'/system/dict/',component:Data}
      ]
    }
  ]
})

// //挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login')
//     return next();
//
//   //获取token
//   const tokenStr = window.sessionStorage.getItem('token');
//
//   if (!tokenStr)
//     return next('/login');
//
//   next();
//
// })

export default router
