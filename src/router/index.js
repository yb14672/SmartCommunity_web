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
import Operlog from "@/components/monitor/operlog/Operlog";
import LoginInfo from "@/components/monitor/LoginInfo/LoginInfo";
import Community from "@/components/community/Community";
import Building from "../components/community/Building";
import Unit from "@/components/community/Unit";
import Room from "@/components/community/Room";
import OwnerRoom from "@/components/community/owner/OwnerRoom";
import Owner from "../components/community/owner/Owner";
import Swagger from "@/views/tool/swagger/index";
import Visitor from "@/components/community/Visitor";
import InterAction from "@/components/community/interaction/index";
import Repair from "../components/community/repair/Repair";
import Suggest from "../components/community/suggest/Suggest";
import park from "@/components/community/park/Park";
import Server from "../components/server/index";
import ParkOwner from "@/components/community/park/ParkOwner";
import ParkInfo from "@/components/community/park/ParkInfo";
import HomeIndex from "../views/indexs/index.vue";
import Redis from "@/components/server/redis";
import Druid from "@/components/server/druid";

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
        {path: '/welcome', component: HomeIndex},
        {path: '/system/user', component: User},
        {path: '/system/user-auth/role/:userId(\\d+)', component: AuthRole},
        {path: '/user/profile', component: Profile},
        {path: '/system/role', component: Role},
        {path: '/system/menu', component: Menu},
        {path: '/system/dept', component: Dept},
        {path: '/system/post', component: Post},
        {path: '/system/dict', component: Dict},
        {path: '/dict/type/data/:dictId(\\d+)', component: DataData},
        {path: '/system/log/operlog', component: Operlog},
        {path: '/system/log/logininfor', component: LoginInfo},
        {path: '/community/community', component: Community},
        {path: '/community/building', component: Building},
        {path: '/community/unit', component: Unit},
        {path: '/community/room', component: Room},
        {path: '/tool/swagger', component: Swagger},
        {path: '/bing/ownerRoom', component: OwnerRoom},
        {path: '/bing/owner', component: Owner},
        {path: '/interaction/interaction', component: InterAction},
        {path: '/visitor/visitor', component: Visitor},
        {path: '/repair/repair', component: Repair},
        {path: '/suggest/suggest', component: Suggest},
        {path: '/Park/park', component: park},
        {path: '/monitor/server', component: Server},
        {path: '/monitor/cache', component: Redis},
        {path: '/monitor/druid', component: Druid},
        {path: '/park/parkOwner', component: ParkOwner},
        {path: '/community/parkInfo', component: ParkInfo},
      ]
    },
    {
      path: "/404",
      name: "NotFound",
      component: () => import("@/views/error/404.vue"),
    }, {
      path: "/500",
      name: "ServerError",
      component: () => import("@/views/error/500.vue"),
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
  //未找到路由
  if (!to.matched.length) {
    //判断是否有token
    if (tokenStr) {
      next("/404");
    } else {
      //如果没有token，说明还没有登录过
      next('/login');
    }
    next(true);
  }

  if (!tokenStr)
    return next('/login');
  next();
})

export default router
