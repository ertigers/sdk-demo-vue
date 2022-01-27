module.exports = {
  devServer: {
    open: true,
    host: "172.22.93.1",
    port: 8080,
    https: false,
    //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {
      //配置跨域
      "/icvs2": {
        target: "http://172.22.93.1:9581/icvs2/", //这里后台的地址模拟的;应该填写你们真实的后台接口
        ws: true,
        changOrigin: true, //允许跨域
        pathRewrite: {
          "^/icvs2": "", //请求的时候使用这个api就可以
        },
      },
    },
  },
};
