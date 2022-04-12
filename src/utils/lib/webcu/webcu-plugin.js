import { cf } from "../config.js";
import { qxGlobalData } from "./webcu_global_data.js"

let ws;
 
let callback  // 请求类型的数据交互
let callback2 = qxGlobalData.callback  // 播放视频实时状态

const plugin = {
  // 登录插件版本
  async loginPlugin(token) {
    return new Promise((resolve)=>{
      // 连接ws
      let url = cf.plugin_ws_url + "?token=" + token;
      ws = new WebSocket(url);
      ws.onopen = async ()=>{
        // 注册服务
        let callBack = (data)=>{
          if(data.cmdID === 'registerServer') {
            resolve(data)
          }
        }
        callback = callBack
        let query =  {
          type: "req",
          transID: 101,
          cmdID: "registerServer",
          params: {
            uri: `http://${cf.server_host}`
          }
        }
        ws.send(JSON.stringify(query))
      }
      ws.onmessage = (evt) => {
        let res = JSON.parse(evt.data)
        // 播放视频状态
        if(callback2 && res.type === 'nty') {
          let result = {
            type: 'playEvent',
            data: {
              status: res.param.Status,
              palyId: res.param.playID,
            }
          }
          callback2(result)
        }
        // 请求返回值
        if(callback && res.type === 'rsp') {
          callback(res)
          callback = ''
        }
      };
      ws.onclose = ()=> {
        let params = {
          type: 'WsClose',
        }
        callback && callback(params)
      };
      ws.onerror = function () {
        let params = {
          type: 'WsError',
        }
        callback && callback(params)
      };      
    })
  },

  // 请求视频播放
  getPlayID(data) {
    return new Promise((resolve)=>{
      let currentCallBack = (data)=>{
        if(data.cmdID === 'startVideo') {
          resolve(data)
        }
      }
      if (callback) resolve({msg:'操作失败~'})
      callback = currentCallBack
      let query = {
        type: "req",
        transID: 101,
        cmdID: "startVideo",
        params :{
          puid: data.puid,
          resIdx: data.idx,
          resType: "IV"  // 选填
        }
      }
      ws.send(JSON.stringify(query))
    })
  },

  // 停止播放
  stopVideo(playID) {
    return new Promise((resolve)=>{
      let currentCallBack = (data)=>{
        if(data.cmdID === 'stopPlay') {
          resolve(data)
        }
      }
      if (callback) resolve({msg:'操作失败~'})
      callback = currentCallBack
      let query = {
        type: "req",
        transID: 101,
        cmdID: "stopPlay",
        params :{
          playID: playID,
        }
      }
      ws.send(JSON.stringify(query))
    })
  },

  // 请求喊话
  startCallPlugin(puid) {
    return new Promise((resolve)=>{
      let currentCallBack = (data)=>{
        if(data.cmdID === 'startCall') {
          resolve(data)
        }
      }
      if (callback) resolve({msg:'操作失败~'})
      callback = currentCallBack
      let query = {
        type: "req",
        transID: 101,
        cmdID: "startCall",
        params :{
          puid: puid,
        }
      }
      ws.send(JSON.stringify(query))
    })
  },
  
  // 请求对讲
  startTalkPlugin(puid) {
    return new Promise((resolve)=>{
      let currentCallBack = (data)=>{
        if(data.cmdID === 'startTalk') {
          resolve(data)
        }
      }
      if (callback) resolve({msg:'操作失败~'})
      callback = currentCallBack
      let query = {
        type: "req",
        transID: 101,
        cmdID: "startTalk",
        params :{
          puid: puid,
        }
      }
      ws.send(JSON.stringify(query))
    })
  },
    
  // 伴音
  enablePlayAudioPlugin(playerData) {
    return new Promise((resolve)=>{
      let currentCallBack = (data)=>{
        if(data.cmdID === 'enablePlayAudio') {
          resolve(data)
        }
      }
      if (callback) resolve({msg:'操作失败~'})
      callback = currentCallBack
      let query = {
        type: "req",
        transID: 101,
        cmdID: "EnablePlayAudio",
        params :{
          playID: playerData.playID,
          enable: playerData.enable
        }
      }
      ws.send(JSON.stringify(query))
    })
  },
};

export { plugin };
