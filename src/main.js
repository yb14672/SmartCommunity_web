import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//图标选择器
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
//滑块验证
import SlideVerify from 'vue-monoplasty-slide-verify';
//动态背景
import VueParticles from 'vue-particles'
//树形选择器组件
import Treeselect from '@riophae/vue-treeselect'
//图片裁剪
import { VueCropper } from 'vue-cropper';


//树形选择器样式
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import "./plugins/element"
import './plugins/element.js'

//将树形选择器全局挂载
// Vue.use(Treeselect)
//背景动态粒子
Vue.use(VueParticles)
//将图片裁剪全局挂载
Vue.component('VueCropper',VueCropper);
//全局挂载图标选择器
Vue.use(iconPicker);
//滑块验证
Vue.use(SlideVerify);
//接口前缀
axios.defaults.baseURL = 'http://localhost:8080/'
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.token = window.sessionStorage.getItem("token")
  return config
})

//全局挂载axios为$http
Vue.prototype.$http = axios
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
