import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome'
import Hello from '../components/Hello'
import Login from '../components/Login.vue'
import User from '../components/user/User'
import Home from '../components/Home.vue'
import Profile from "../components/user/Profile"
import Menu from "../components/system/Menu"
import Role from "../components/system/Role"
import Dict from "../components/system/dict/Index"
import DataData from "../components/system/dict/Data"
import Dept from '../components/system/Dept'
import Post from '../components/system/Post'
import AuthRole from "@/components/user/AuthRole";
import OperLog from "../components/monitor/operlog/Operlog";
import LoginInfo from "@/components/monitor/LoginInfo/LoginInfo";
import Community from "@/components/property/Community";
import Unit from "@/components/community/Unit";

Vue.use(Router)

const router = new Router({
    routes: [
        {path: '/', name: 'Hello', component: Hello},
        {path: '/login', component: Login},
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {path: '/welcome', component: Welcome},
                {path: '/system/user', component: User},
                {path: '/system/user-auth/role/:userId(\\d+)', component: AuthRole},
                {path: '/user/profile', component: Profile},
                {path: '/system/role', component: Role},
                {path: '/system/menu', component: Menu},
                {path: '/system/dept', component: Dept},
                {path: '/system/post', component: Post},
                {path: '/system/dict', component: Dict},
                {path: '/dict/type/data/:dictId(\\d+)', component: DataData},
                {path: '/system/user-auth/role/:userId(\\d+)', component: AuthRole},
                {path: '/system/log/logininfor', component: LoginInfo},
                {path: '/system/log/operlog' , component: OperLog},
                {path: '/community/community',component: Community},
                {path:'/community/unit',component:Unit}
            ]
        },
        {
            path: "*",
            name: "NotFound",
            component: () => import("@/views/error/e404.vue"),
        }, {
            path: "/500",
            name: "ServerError",
            component: () => import("@/views/error/e500.vue"),
        }
    ]
})

//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next();
    }
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr)
        return next('/login');
    next();
})

export default router
