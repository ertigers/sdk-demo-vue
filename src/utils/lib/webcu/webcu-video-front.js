import { QxRequest } from '../request.js'
import { cf } from "../config.js";

const videoFront = {
  /**
  * 
  * @param {*前端抓拍，连拍，录像} params 
  * 
  */
  // 开始前端抓拍
  startSGSnapshot: (params) => {
    return QxRequest('get', `${cf.server_url}SG/C_SG_StartSnapshot`, params);
  },

  // 开始前端录像
  startSGVideo: (params)=>{
    let query = {
      puid: params.puid,
      IVIdx: params.idx || 0,
      duration: params.duration,
    }
    return QxRequest('post', `${cf.server_url}SG/C_SG_StartRecord`, query);
  },

  // 停止前端录像
  stopSGVideo: (params)=>{
    params.IVIdx = params.idx || 0
    return QxRequest('post', `${cf.server_url}SG/C_SG_StopRecord`, params);
  },
  
  // 查询前端文件（录像，抓拍，录音）
  getDeviceFile: (params) => {
    return QxRequest('get', `${cf.server_url}SG/C_SG_QueryRecordFiles`, params);
  },
}

export { videoFront }