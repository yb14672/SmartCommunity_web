import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex)
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName]=value.default
  modules[moduleName].namespaced = true;   //打开命名空间
  return modules
}, {})
export default new Vuex.Store({
  modules,
  state: {

  },
  mutations: {
    setCollapsed(state,value){
    },
  },
  actions: {
    getUserdata({commit}){
    },
  },
})
