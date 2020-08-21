const path = require('path');

function resolve(dir) {
  return path.join(__dirname, './', dir);
}

module.exports = {
  productionSourceMap: false,//不生成map文件
  lintOnSave: false,
  publicPath: '/traffic/',
  chainWebpack: (config) => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  },
  devServer: {
    // proxy: 'http://192.168.3.12:8087',
    // proxy: {
    //   '/admin': {
    //     target: 'http://192.168.3.12:8087',//后端接口地址
    //     changeOrigin: true,//是否允许跨越
    //     // pathRewrite: {
    //     //   '^/': '/',//重写,
    //     // }
    //   }
    // }
  }
};
