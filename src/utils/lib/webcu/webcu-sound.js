import { QxRequest } from "../request.js";
import { cf } from "../config.js";
import { qxGlobalData } from './webcu_global_data.js'
import { plugin } from './webcu-plugin.js'
import "../utils/talk.js"


const sound = {
  // 开始喊话
  startCall: async (params) => {
    let id = params.puid + "_" + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    if(playerItem.videoType === "video/hevc") {  // H.265开始喊话
      await plugin.startCallPlugin(params.puid)
      return ({msg:'OK'})
    }else {
      return new Promise((resolve)=>{
        let callback = (msg)=>{
          if(msg.type === 'startCall_success') {
            resolve({msg:'OK'})
          }
        }
        let q2http_url = cf.server_url2
        let websocket_url = cf.server_ws_url2
        let { puid, idx } = params
        let token = qxGlobalData.token
        let name = params.puid + "_" + params.idx
        QXstartCall(q2http_url, websocket_url, token, puid, idx, name, callback)        
      })
    }
  },

  // 停止喊话
  stopCall: (params)=>{
    let id = params.puid + "_" + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    if(playerItem.videoType === "video/hevc") {   // H.265停止喊话
      return QxRequest("get", `${cf.plugin_url}stopPlay2`, params);
    }else {
      let name = params.puid + "_" + params.idx || '';
      return QXstopCall(name)
    }
  },

  // 开始对讲
  startTalk: async (params) => {
    let id = params.puid + "_" + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    if(playerItem.videoType === "video/hevc") {   // H.265开始对讲
      await plugin.startTalkPlugin(params.puid)
      return ({msg:'OK'})
    }else {
      return new Promise((resolve)=>{
        let callback = (msg)=>{
          if(msg.type === 'startTalk_success') {
            resolve({msg:'OK'})
          }
        }
        let q2http_url = cf.server_url2
        let websocket_url = cf.server_ws_url2
        let { puid, idx } = params
        let token = qxGlobalData.token
        let name = params.puid + "_" + params.idx
        return QXstartTalk(q2http_url, websocket_url, token, puid, idx, name, callback)
      })
    }
  },


  // 停止对讲 
  stopTalk: (params)=>{
    let id = params.puid + "_" + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    if(playerItem.videoType === "video/hevc") {   // H.265停止对讲 
      return QxRequest("get", `${cf.plugin_url}stopPlay2`, params);
    }else {
      let q2http_url = cf.server_url2
      let { puid, idx } = params
      let name = params.puid + "_" + params.idx || '';
      return QXstopTalk(q2http_url, puid, idx, name )
    }
  },


  // 伴音
  enablePlayAudio: async (params) => {
    let id = params.puid + "_" + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    console.log(playerItem);
    if(playerItem.videoType === "video/hevc") {   // H.265伴音
      let query = {
        playID: playerItem.playID,
        enable: params.enable
      }
      await plugin.enablePlayAudioPlugin(query)
      return ({msg:'OK'})
    }else {
      if(playerItem.soundStatus === 1) {
        if(params.enable) {
          playerItem.videoDom.muted = false;
          return ({msg:'OK'})          
        }else {
          playerItem.videoDom.muted = true;
          return ({msg:'OK'})          
        }
      }else {
        return ({msg:'该设备不支持伴音功能~'})
      }
    }
  },
};

export { sound };