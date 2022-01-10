// 本地插件
const base_ip = '127.0.0.1:9585'

const base_url = `http://${base_ip}/icvs2/`;

const websocket_url = `ws://${base_ip}/`

// 接口错误码
const errorCode = {
  'NONET': -2,    // 网络错误或者请求终止（无插件，网络，平台信息错误）
  'FAILED': -1,   // 失败
  'SUCCESS': 0,   // 成功
}


export { base_url, websocket_url, errorCode }