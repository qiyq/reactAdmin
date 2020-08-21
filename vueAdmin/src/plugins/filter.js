import Vue from 'vue';

Vue.filter('gender', function (value) {
  if (value === '' || value === undefined) return '';
  return ['女', '男'][value];
});
Vue.filter('filterNull', function (value) {
  if (value === '' || value === undefined || value === null) return '';
  return value;
});
Vue.filter('visible', function (value) {
  if (value === '' || value === undefined) return '';
  return ['正常', '停用'][value];
});
Vue.filter('articleTemplateType', function (value, arr) {
  if (value === null || value === '' || value === undefined || arr.length === 0 || !Array.isArray(arr)) return '';
  return arr.filter(item => item.id === value)[0].name;
});
Vue.filter('returnZero', function (value) {
  if (value === '' || value === undefined || value === null) return 0;
  return value;
});
Vue.filter('diskDate', function (value) {
  if (value === '' || value === undefined) return '';
  return (value / 1024 / 1024).toFixed(2);
});
Vue.filter('entrType', function (value) {
  if (value === '' || value === undefined) return '';
  return ['企业', '个人'][value - 1];
});
Vue.filter('isNo', function (value) {
  if (value === '' || value === undefined) return '';
  if (value) {
    return '是';
  } else {
    return '否';
  }
});
Vue.filter('filterData', function (id, arr = []) {
  id = parseInt(id, 10);
  if (id && arr.length) {
    return arr.filter(item => item.id === id)[0].name;
  } else {
    return '';
  }
});
Vue.filter('dateFormat', function (time, fmt = 'yyyy-MM-dd') {
  let _this;
  if (!time) return '';
  if (time instanceof Date) {
    _this = time;
  } else {
    _this = new Date(time);
  }

  const o = {
    'M+': _this.getMonth() + 1, // 月份
    'd+': _this.getDate(), // 日
    'h+': _this.getHours(), // 小时
    'm+': _this.getMinutes(), // 分
    's+': _this.getSeconds(), // 秒
    'q+': Math.floor((_this.getMonth() + 3) / 3), // 季度
    S: _this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${_this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
});
