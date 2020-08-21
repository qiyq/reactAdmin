import upload from './components/upload';
import region from './components/region';
import multiUpload from './components/multiUpload';

export default {
  install(Vue) {
    // 注册 components
    Vue.component('upload', upload);
    Vue.component('region', region);
    Vue.component('multiUpload', multiUpload);
  },
};
