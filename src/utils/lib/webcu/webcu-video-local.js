import { QxRequest } from '../request.js'
import { plugin_url } from '../config'

const videoLocal = {
  /**
  * 
  * @param {*本地抓拍，连拍，录像} params 
  * 
  */
  // 本地抓拍,连拍
  startLocalSnap: (params) => {
    let query ={
      playID: params.playID,
      localPath: params.localPath,
      count: params.count || 1,
      interval: params.interval || 6,
      token: params.token,
    }
    return QxRequest('get',`${plugin_url}localSnapshot`, query);
  },
  // 停止本地连拍
  stopLocalSnapShot:(params) => {
    return QxRequest('get',`${plugin_url}cancelLocalSnapshot`, params);
  },
  // 本地录像
  startLocalVideo:(params) => {
    let query ={
      playID: params.playID,
      localPath: params.localPath,
      maxFileTime: params.maxFileTime || 300,
      token: params.token,
    }
    return QxRequest('get',`${plugin_url}localRecord`, query);
  },
  // 停止本地录像
  stopLocalVideo:(params) => {
    return QxRequest('get',`${plugin_url}cancelLocalRecord`, params);
  },
}

export { videoLocal }