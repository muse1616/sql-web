import Vue from 'vue'

import App from './App.vue'


// 引入路由
import router from './router'
// 引入element-ui
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入axios
import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:3000/server/api/';

// token拦截器
axios.interceptors.request.use(config => {
  // 在请求头增加token
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 最后必须返回config
  return config;
});

// 挂载原型对象
Vue.prototype.$http = axios



Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')