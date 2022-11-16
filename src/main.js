import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//动态背景
import VueParticles from 'vue-particles'
//图片裁剪
import { VueCropper } from 'vue-cropper';
//面包屑导航
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
//滑块验证
import SlideVerify from 'vue-monoplasty-slide-verify';
//图标选择器
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
//树状选择器
import Treeselect from '@riophae/vue-treeselect'
//日期处理
import moment from '../node_modules/moment/moment.js';
// 字典标签组件
import DictTag from '@/components/DictTag'
//element Ui
import "./plugins/element"
import './plugins/element.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//工具类
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/zhiyu";
import { getDicts } from "@/utils/data";

//图标选择器
Vue.use(iconPicker);
//粒子效果
Vue.use(VueParticles)
//滑块验证
Vue.use(SlideVerify);
//树状选择器
Vue.use(Treeselect)


// 将图片裁剪全局挂载
Vue.component('VueCropper',VueCropper);
// 面包屑
Vue.component('breadcrumb',Breadcrumb);
// 字典标签
Vue.component('DictTag', DictTag)


Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
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

Vue.prototype.$http = axios
Vue.config.productionTip = false
//接口前缀
axios.defaults.baseURL = 'http://localhost:8080/'
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.token = window.sessionStorage.getItem("token")
  return config
})

const myInterceptor = axios.interceptors.response.use(res => {
  // console.log("myInterceptor",res)
  let code='';
  if(res.data.meta==undefined){
    if(res.meta==undefined){
      if(res.status==undefined){
        code=200
      }else{
        code=res.status
      }
    }else{
      code=res.meta.errorCode
    }
  }else{
    code=res.data.meta.errorCode
  }
  // console.log(code,res);
  if(code !==undefined && code === 2013 || code === 2014){
    //移除拦截器
    axios.interceptors.request.eject(myInterceptor);
    // 从 sessionStorage 删除所有保存的数据
    window.sessionStorage.clear();
    localStorage.setItem("msg",res.data.meta.errorMsg)
    window.location.reload();
  }else{
    localStorage.clear()
    return res
  }
//这里是响应成功执行的代码
}, function axiosRetryInterceptor(err) {
  console.log(err)
//这里是响应失败执行的代码
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
