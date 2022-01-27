import cf from '@/utils/config-sdk.js';
console.log(cf);

// 本地插件
const plugin_host = '127.0.0.1:9585'
const plugin_url = `http://${plugin_host}/icvs2/`;
const plugin_ws_url = `ws://${plugin_host}/`

// 服务端
const server_host = cf.server_host;
const server_url = `/icvs2/`;           // 根路由
const server_all_url = `http://${server_host}/icvs2/`;  // 播放flv视频使用
const server_ws_url = `ws://${server_host}/`;         // 连接ws

export { plugin_url, plugin_ws_url, server_url, server_all_url, server_ws_url }