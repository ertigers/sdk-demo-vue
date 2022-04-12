import { QxRequest } from '../request.js'
import { cf } from "../config.js";

const videoCloud = {
  /**
  * 
  * @param {*云抓拍，连拍，录像} params 
  * 
  */
  // 开始云抓拍
  startCloudSnapshot: (params) => {
    return QxRequest('post',`${cf.server_url}CSS/C_CSS_StartManualSnapshot`, params);
  },

  // 开始云存储(云连拍)
  startCloudImage:(params) =>{
    params.type = 1
    params.fileLength = params.fileLength || 5
    params.reserveDay = params.reserveDay || 30
    params.duration = params.duration || 5
    return QxRequest('post',`${cf.server_url}CSS/C_CSS_StartManualStorage`, params);
  },

  // 开始云存储(云录像)
  startCloudVideo: (params) => {
    params.type = 0
    params.fileLength = params.fileLength || 15
    params.reserveDay = params.reserveDay || 30
    params.duration = params.duration || 5
    return QxRequest('post',`${cf.server_url}CSS/C_CSS_StartManualStorage`, params);
  },
  
  // 开始云存储
  // startCloudStorage: (params) => {
  //   return QxRequest('post',`${cf.server_url}CSS/C_CSS_StartManualStorage`, params);
  // },

  // 停止云存储（云录像）
  stopCloudStorage: (params) => {
    return QxRequest('post',`${cf.server_url}CSS/C_CSS_StopManualStorage`, params);
  },

  // 查询云文件（云录像，云抓拍）
  getCloudFile: (params) => {
    return QxRequest('get', `${cf.server_url}CSS/C_CSS_QueryStorageFiles`, params);
  },

}

export { videoCloud }