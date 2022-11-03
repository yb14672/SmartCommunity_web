import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome'
import Login from '../components/Login.vue'
import Users from '../components/user/Users'
import Home from '../components/Home.vue'
import Person from "../components/user/Person"

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
        { path: '/users', component: Users },
        {path: '/person',component:Person},
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
