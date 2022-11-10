import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/zhiyu";
import { getDicts } from "@/utils/data";
//动态背景
import VueParticles from 'vue-particles'
//图片裁剪
import { VueCropper } from 'vue-cropper';
//滑块验证
import SlideVerify from 'vue-monoplasty-slide-verify';
//图标选择器
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
//树状选择器
import Treeselect from '@riophae/vue-treeselect'
//日期处理
import moment from '../node_modules/moment/moment.js';

//element Ui
import "./plugins/element"
import './plugins/element.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//图标选择器
Vue.use(iconPicker);
//粒子效果
Vue.use(VueParticles)
//将图片裁剪全局挂载
Vue.component('VueCropper',VueCropper);
//滑块验证
Vue.use(SlideVerify);
//树状选择器
Vue.use(Treeselect)

Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD hh:mm:ss';
  return moment(value).format(formatString);
});

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
//接口前缀
axios.defaults.baseURL = 'http://localhost:8080/'
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.token = window.sessionStorage.getItem("token")
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
