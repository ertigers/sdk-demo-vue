import { QxRequest } from '../request.js'
import { cf } from "../config.js"

const download = {
    /**
     * 
     * @param {*下载} params 
     * 
     */
    // 下载云文件
    downloadCloudFile: (params) => {
        return QxRequest('get', `${cf.server_url}CSS/C_CSS_DownloadFile`, params);
    },
    // 下载前端文件
    downloadDeviceFile: (params) => {
        return QxRequest('get', `${cf.server_url}SG/C_SG_DownLoadFile_PushMode`, params);
    },
    // 下载前端文件
    localDownloadDeviceFile: (params) => {
        return QxRequest('get', `${base_url}downloadDeviceFile2`, params);
    },

    // 下载视频文件/icvs/misc/recordStreamFile
    recordStreamFile: (params) => {
        return QxRequest('get', `${cf.server_url}misc/recordStreamFile`, params);
    },
    //启动云录像/icvs/misc/recordStream 启动流录像
    recordStream: (params) => {
        return QxRequest('post', `${cf.server_url}misc/recordStream`, params);
    },
    //查询录像状态/icvs/misc/recordStatus 查询流录像状态
    recordStatus: (params) => {
        return QxRequest('get', `${cf.server_url}misc/recordStatus`, params);
    },


    // 暂停下载
    setPuaseDownload: (params) => {
        return QxRequest('get', `${cf.plugin_url}puaseDownload2`, params);
    },

    // 恢复下载
    setRestoreDownload: (params) => {
        return QxRequest('get', `${cf.plugin_url}restoreDownload2`, params);
    },

    // 停止下载
    setStopDownload: (params) => {
        return QxRequest('get', `${cf.plugin_url}stopDownload2`, params);
    },

}

export { download }