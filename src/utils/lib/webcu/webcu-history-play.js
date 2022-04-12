import { QxRequest } from '../request.js'
import { qxGlobalData } from "./webcu_global_data.js"
import { cf } from "../config.js"

const historyPlay = {
    /**
     * 
     * @param {*播放历史视频} params 
     * 
     */
    // 点播前端文件
    getVodDeviceFile: (params) => {
        return QxRequest('get', `${cf.plugin_url}vodDeviceFile2`, params);
    },

    //前端文件token
    getVodDeviceToken: (params) => {
        return QxRequest('get', `${cf.server_url}SG/C_SG_VODFile_PushMode`, params);
    },

    // 点播云文件
    getVodCloudFile: (params) => {
        return QxRequest('get', `${cf.plugin_url}vodCloudFile2`, params);
    },
    //点播265 getVodCloudFile265
    getVodCloudFile265: (params) => {
        return QxRequest('get', `${cf.server_url}stream2.flv`, params);
    },
    //云文件token
    // getVodCloudFileToken: (params) => {
    //   return QxRequest('get', `${cf.plugin_url}vodCloudFile2`, params);
    // },
    getVodCloudFileToken: (params) => {
        return QxRequest('get', `${cf.server_url}CSS/C_CSS_VODFile`, params);
    },
    //获得视频的类型
    /// icvs / iv / videoCodecTypeByToken
    getVideoCodecTypeByToken: async(params) => {
        let id = params.Token
        let result = qxGlobalData.getPlayType(id)
        let res
        if (result) {
            res = { mime: result.type }
        } else {
            res = await QxRequest('get', `${cf.server_url}iv/videoCodecTypeByToken`, params);
            qxGlobalData.setPlayType(id, res.mime)
        }
        return res
    },

    // 暂停点播(云，前端)
    setPuaseVod: (params) => {
        return QxRequest('get', `${cf.plugin_url}puaseVod2`, params);
    },

    // 恢复点播(云，前端)
    setRestoreVod: (params) => {
        return QxRequest('get', `${cf.plugin_url}restoreVod2`, params);
    },

    // 设置点播速度(云，前端)
    setSpeedVod: (params) => {
        return QxRequest('get', `${cf.plugin_url}setVodSpeed2`, params);
    },

    // 设置点播位置(云，前端)
    setOffsetVod: (params) => {
        return QxRequest('get', `${cf.plugin_url}setVodOffset2`, params);
    },
}

export { historyPlay }