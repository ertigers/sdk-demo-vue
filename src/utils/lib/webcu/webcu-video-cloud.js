import { QxRequest } from '../request.js'
import { plugin_url } from '../config'

const videoCloud = {
  /**
  * 
  * @param {*云抓拍，连拍，录像} params 
  * 
  */
  // 开始云抓拍
  startCloudSnapshot: (params) => {
    return QxRequest('post',`${plugin_url}CSS/C_CSS_StartManualSnapshot`, params);
  },

  // 开始云存储(云连拍，云录像)
  startCloudStorage: (params) => {
    return QxRequest('post',`${plugin_url}CSS/C_CSS_StartManualStorage`, params);
  },

  // 停止云存储（云录像，云连拍）
  stopCloudStorage: (params) => {
    return QxRequest('post',`${plugin_url}CSS/C_CSS_StopManualStorage`, params);
  },

  // 查询云文件（云录像，云抓拍）
  getCloudFile: (params) => {
    return QxRequest('get',`${plugin_url}CSS/C_CSS_QueryStorageFiles`, params);
  },


}

export { videoCloud }