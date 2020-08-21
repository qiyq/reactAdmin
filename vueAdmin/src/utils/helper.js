/**
 * 检验对象是否为function
 * @param {*any} func 验证对象
 */
export function isFunc(func) {
  return typeof func === 'function';
}

/**
 *
 * @param {*function} fn 待转换函数
 * @param {*number} arity  参数个数
 * @param {*array} a 参数
 */
export function convertToFP(fn, arity, a) {
  a = a || [];

  if (a.length >= arity) {
    return fn.apply(null, a.slice(0, arity)
      .reverse());
  }

  return function () {
    const args = Array.prototype.slice.call(arguments);
    return convertToFP(fn, arity, a.concat(args));
  };
}

/**
 * compose functions
 * var f = compose(add1)(mult2)(square)(negate)();
 * @param {*function} f
 */
export const compose = function compose(f) {
  const queue = f ? [f] : [];
  const fn = function fn(g) {
    if (arguments.length) {
      queue.push(g);
      return fn;
    }
    return function () {
      let args = Array.prototype.slice.call(arguments);
      queue.forEach(function (func) {
        args = [func.apply(this, args)];
      });
      return args[0];
    };
  };
  return fn;
};

/**
 * 通过promise 实现简单的 chain
 * @param {*any} task
 */
export const chain = function (task) {
  return Promise.resolve(task);
};

/**
 * 将所有的未空字符的字段替换未null
 * @param {Object} obj
 */
export const emptyStringToNull = (obj) => {
  Object.keys(obj)
    .forEach((key) => {
      if (obj[key] === '') obj[key] = null;
    });
};

export const pad = (val, n) => (Array(n)
  .join(0) + val).slice(-n);
