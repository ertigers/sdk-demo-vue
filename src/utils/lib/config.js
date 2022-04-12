const cf = {
  // 本地插件
  plugin_host: '127.0.0.1:9585',
  plugin_url: `http://127.0.0.1:9585/icvs2/`,
  plugin_ws_url: `ws://127.0.0.1:9585/`,

  // plugin_host: '172.22.91.1:9585',
  // plugin_url: `http://172.22.91.1:9585/icvs2/`,
  // plugin_ws_url: `ws://172.22.91.1:9585/`,
  
  // plugin_host: '172.22.172.100:9585',
  // plugin_url: `http://172.22.172.100:9585/icvs2/`,
  // plugin_ws_url: `ws://172.22.172.100:9585/`,
  // 服务端
  server_host:'',

  server_url: `/icvs2/`,
  server_ws_url:'',         

  server_url2:'',   // 喊话对讲的服务端去调用q2http的接口
  server_ws_url2:'',  // 喊话对讲q2http的ws

  hostInit(serverHost) {
    this.server_host = serverHost

    this.server_ws_url = `ws://${serverHost}/`,

    this.server_url2 = `http://${serverHost}/icvs2/`,
    this.server_ws_url2 = `ws://${serverHost}/wss`
  }
}

export { cf } 