import { QxRequest } from "../request.js";
import { qxGlobalData } from "./webcu_global_data.js"
import { xml2json } from "../utils/x2js.js";
import { cf } from "../config.js"

const common = {
  // 登录服务端
  login: async (params, callback) => {
    let serverHost = ''
    // 先判定生产环境还是开发环境，
    try {
      if(process.env.NODE_ENV=="production"){
        // 生产环境 
        serverHost = window.location.host
      }else{ // 开发环境
        if(!params.serverHost) return { code:-1, msg:'未传入服务端host' }
        serverHost = params.serverHost
      }
    }catch {
      // 原生js,无法查询到process
      if(!params.serverHost) return { code:-1, msg:'未传入服务端host' }
      serverHost = params.serverHost
    }
    cf.hostInit(serverHost)
    let res = await QxRequest("post", `${cf.server_url}login`, params);
    if (res.msg === "OK") {
      qxGlobalData.token = res.token
      qxGlobalData.callback = callback
      // 连接ws
      let url = cf.server_ws_url + "?token=" + res.token;
      let ws = new WebSocket(url);
      ws.onmessage = (evt) => {
        if (typeof evt === "object" && evt.data && callback) {
          let msg = xml2json(evt.data).M;
          // callback(msg)
          // 第一类事件(插件处理的)
          if (msg._Type === "PlayEvent") {  // 视频播放状态
            let params = {
              type: 'playEvent',
              data: {
                status: msg._Status,
                palyId: msg._PlayID,
              }
            }
            callback(params)
          }
          if(msg._Type === "DownlaodEvent") {  // 视频下载状态
            let params = {
              type: 'downlaodEvent',
              data: {
                status: msg._Status,
                downloadID: msg._DownloadID,
                progress: msg._Progress,
              }
            }
            callback(params)
          }
          // 第二类事件(ICVS平台返回的)
          let event = msg.E || null;
          if (event) {
            if (event._ID === "E_CU_Online") {  // 用户上线
              let params = {
                type: 'userOnline',
                data: {
                  UserID: event.Desc._UserID,
                  EPID: event.Desc._EPID
                }
              }
              callback(params)
            } else if (event._ID === "E_CU_Offline") {  // 用户下线
              let params = {
                type: 'userOffline',
                data: {
                  UserID: event.Desc._UserID,
                  EPID: event.Desc._EPID
                }
              }
              callback(params)
            } else if (event._ID === "E_PU_Online") {   // 设备上线
              let params = {
                type: 'deviceOnline',
                data: {
                  Name: event.Src._Name,
                  Type: event.Src._Type,
                  Idx: event.Src._Idx,
                  Desc: event.Src._Desc,
                }
              }
              callback(params)
            } else if (event._ID === "E_PU_Offline") {   // 设备下线
              let params = {
                type: 'deviceOffline',
                data: {
                  Name: event.Src._Name,
                  Type: event.Src._Type,
                  Idx: event.Src._Idx,
                  Desc: event.Src._Desc,
                }
              }
              callback(params)
            }else if (event._ID === "E_GS_GPSDataUpdate") {   // gps信息更新
              // let params = {
              //   type: 'gpsDataUpdate',
              //   data: {
              //   }
              // }
              // callback(params)
            }
             else if (event._ID === "PlayNtf") {
              console.log("playNtf");
              console.log(event);
            }
          }
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
    }
    return res;
  },

  // 获取设备列表
  getDeviceList: (params) => {
    return QxRequest("get", `${cf.server_url}CAS/C_CAS_QueryPUIDSets`, params);
  },

  // 获取单个设备列表子资源
  getDeviceByPuid: (params) => {
    return QxRequest("get", `${cf.server_url}C_CAS_QueryPUIDRes`, params);
  },

  // 播放前确认播放视频的格式
  getPlayVideoType: async (params) => {
    // puid是把puid与idx拼在一起
    let id = params.puid + '-' + params.idx
    let result = qxGlobalData.getPlayType(id)
    let res
    if(result) {
      res = { mime:result.type }
    }else {
      res = await QxRequest("get", `${cf.server_url}IV/videoCodecType`, params);
      qxGlobalData.setPlayType(id,res.mime)
    }
    return res
  },

  // 获取播放ID
  getPlayVideoId: (params) => {
    return QxRequest("get", `${cf.plugin_url}video/startVideo2`, params);
  },

};

export { common };
