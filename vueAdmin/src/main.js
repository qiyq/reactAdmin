import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import dataV from '@jiaminghi/data-view'
import _ from 'lodash';
import store from './store';
import InstallComponents from './components';
import api from './api';
import './assets/icons';
import './assets/font/iconfont/iconfont';
import './plugins/element.js';
import './plugins/filter.js';
import mixin from './mixins';
import Scrollbar from 'perfect-scrollbar';
import 'normalize.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './assets/font/iconfont/iconfont.css'; //iconfont图标

// 组件注册
Vue.use(InstallComponents);
Vue.use(dataV);
Vue.config.productionTip = process.env.NODE_ENV !== 'production';
Vue.prototype.$axios = axios;
Vue.prototype.$_ = _;
Vue.prototype.$scroll = Scrollbar;
Vue.prototype.$baseURL = process.env.NODE_ENV === 'development' ? 'http://182.150.63.48:18086' : 'http://182.150.63.48:18086';
// Vue.prototype.$baseURL = process.env.NODE_ENV === 'development' ? 'https://api.jyaqbz.cn:28087' : 'https://api.jyaqbz.cn:28087'; //正式
Vue.prototype.$model = api;

mixin(Vue);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
