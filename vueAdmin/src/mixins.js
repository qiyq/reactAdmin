/**
 * mixin
 */

const noop = function () {
};
const expressionCache = (function () {
  const cahce = {};
  return {
    get(exp) {
      return cahce[`$exp_${exp}`];
    },
    put(exp, val) {
      cahce[`$exp_${exp}`] = val;
    },
  };
}());

function parseExpression(exp) {
  // 去掉前后空字符
  exp = exp.trim();
  if (exp.indexOf('[') == 0) {
    throw 'express start with [ not supported yet';
  }

  const hit = expressionCache.get(exp);
  if (hit) {
    return hit;
  }
  // 存放解析之后的结果
  const res = {
    exp,
  };
  // 每个exp表达式的解析结果中必须有get方法
  res.get = makeGetterFn(`scope.${exp}`);
  expressionCache.put(exp, res);
  return res;
}

function makeGetterFn(body) {
  try {
    // scope是函数的参数；body是方法体。将此方法赋值给表达式的get方法，就可以方便的拿到表达式的值
    return new Function('scope', `return ${body};`);
  } catch (e) {
    return noop;
  }
}

export default function (vue) {
  /**
   * 添加简单的 keypath 获取 实例值方法
   * @param  {string} key vue实例中data 属性的 keypath - 'a.b.c', 暂不支持以 [] 开头的表达式
   * @return {string|object}
   */
  vue.prototype.$get = function (key) {
    // 解析表达式，并返回一个包含get方法的对象。
    const res = parseExpression(key);
    if (res) {
      // 这里不能保证在执行get时不报错，因此需要放入try/catch中
      try {
        // get方法接收一个参数作为它的参数
        return res.get.call(this, this);
      } catch (e) {
      }
    }
  };
  vue.mixin({
    methods: {
      $tom(t) {
        if (!t) return '';
        let m = Math.floor(t / 60);
        m < 10 && (m = '0' + m);
        return m + ':' + (t % 60 / 100).toFixed(2)
          .slice(-2);
      },
      $forward(path, opts, replace) {
        // 默认使用vue-router
        if (!replace) {
          return this.$router.push(Object.assign({ path }, opts));
        }
        this.$router.replace(Object.assign({ path }, opts));
      },
      $redirect(url, replace) {
        // 默认使用location
        if (replace) {
          location.replace(url);
        } else {
          location.href = url;
        }
      },
      dialogClose(name) {
        if ((typeof name === 'string') && !this[name]) return;
        Object.assign(this[name], this.$options.data()[name]);
      },
      $resetSearchData(name='searchObj') {
        if ((typeof name === 'string') && !this[name]) return;
        const tempTotalCount = this[name].hasOwnProperty('totalCount') && this[name].totalCount;
        Object.assign(this[name], this.$options.data()[name]);
        this[name].hasOwnProperty('totalCount') && (this[name].totalCount = tempTotalCount);
      },
      // 重置data数据
      $resetData(name) {
        if ((typeof name === 'string') && !this[name]) return;
        Object.assign(this[name], this.$options.data()[name]);
      },
      dialogOpen(dialog = true, table = true) {
        this.$nextTick(() => {
          if (dialog) {
            if (this.dialogScroll) {
              this.dialogScroll.update();
            } else {
              this.dialogScroll = new this.$scroll('.el-dialog__body');
            }
          }
          if (table) {
            if (this.tscroll) {
              this.tscroll.update();
            } else if (document.querySelector('.el-dialog__body .el-table .el-table__body-wrapper')) {
              this.tscroll = new this.$scroll('.el-dialog__body .el-table .el-table__body-wrapper');
            }
          }
        });
      },
      // 默认一周
      $startTime() {
        return this.$getYmd(new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), true, true);
      },
      $endTime() {
        return this.$getYmd(new Date(), true);
      },
      // 用于处理特殊时间间隔  时间限制
      $change(start, end, type, limit) {
        const self = this;
        let day = 7;
        if (limit) {
          day = limit;
        }
        if (type === 'end') {
          if (self.searchObj[end] === null) {
            this.pickerOptions1 = {
              disabledDate(time) {
                return false;
              },
            };
          } else {
            this.pickerOptions1 = {
              disabledDate(time) {
                return time.getTime() < (new Date(self.searchObj[end]).getTime() - 24 * 60 * 60 * day * 1000)
                  || time.getTime() > new Date(self.searchObj[end]).getTime();
              },
            };
          }
          this.$data.searchObj[end] = this.$getYmd(this.$data.searchObj[end], true);
        }
        if (type === 'start') {
          if (self.searchObj[start] === null) {
            this.pickerOptions2 = {
              disabledDate(time) {
                return false;
              },
            };
          } else {
            this.$data.pickerOptions2 = {
              disabledDate(time) {
                return time.getTime() > (new Date(self.searchObj[start]).getTime() + 24 * 60 * 60 * (day - 1) * 1000)
                  || time.getTime() < new Date(self.searchObj[start]).getTime();
              },
            };
          }
          this.searchObj[start] = this.$getYmd(this.searchObj[start], true, true);
        }
      },
      $dateFormat(time, fmt = 'yyyy-MM-dd hh:mm:ss') {
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
      },
      $getYmd(time, isLong, isStart = false, normal = false) {
        if (time instanceof Date) {
          const date = time;
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = `0${month}`;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = `0${strDate}`;
          }
          const currentdate = `${date.getFullYear()}-${month}-${strDate}`;
          if (isLong) {
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            m = (m >= 1 && m <= 9) ? `0${m}` : m;
            h = (h >= 1 && h <= 9) ? `0${h}` : h;
            s = (s >= 1 && s <= 9) ? `0${s}` : s;
            if (normal) return `${currentdate} ${h}:${m}:${s}`;
            if (isStart) {
              return `${currentdate} ` + '00' + ':' + '00' + ':' + '00';
            }
            return `${currentdate} ` + '23' + ':' + '59' + ':' + '59';
          }
          return currentdate;
        }
        return time;
      },
      // 表单验证
      formValidate(el) {
        return new Promise((resolve, reject) => {
          this.$refs[el].validate((valid) => {
            resolve(valid);
          });
        });
      },
      $simpleAssign(target, source) {
        for (const key in target) {
          if (source.hasOwnProperty(key) && source[key] !== '') {
            target[key] = source[key];
          }
        }
        return target;
      },
      $filterData(id, arr = []) {
        id = parseInt(id, 10);
        if (id && arr.length) {
          return arr.filter(item => item.id === id)[0].name;
        } else {
          return '';
        }
      },
      $filterArrData(idStr, arr = []) {
        if (idStr && arr.length) {
          idStr = idStr.split(',');
          let arrTemp = [];
          idStr.forEach(ids => {
            if (ids !== '999') {
              arrTemp.push(arr.filter(item => item.id === parseInt(ids, 10))[0].name);
            }
          });
          return arrTemp.join(',');
        } else {
          return '';
        }

      },
    },
  });
}
