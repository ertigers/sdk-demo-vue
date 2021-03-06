import { QxRequest } from '../request.js'
import { cf } from '../config.js'
import { qxGlobalData } from './webcu_global_data.js'
const eleMap = {
    /**
     * 
     * @param {*电子地图} params 
     * 
     */

    // 订阅GPS信息
    subscriptionGps: (params) => {
        //let token = params.token;
        let token = qxGlobalData.token;
        let epid = params.epid || '';
        let puid = params.puid || "";
        let idx = params.idx || 0;
        let xml = '<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="' + epid + '"><Res Type="ST" Idx="' + idx + '" OptID="C_GS_SubscribeGPSData"><Param></Param></Res></C><OSets><Res OType="201" OID="' + puid + '" Type="GPS" Idx="' + idx + '"></Res></OSets></M>'
        let url = cf.plugin_url + 'RawRequest?dstType=33&token=' + token;
        let params1 = { xml }
        return QxRequest('POST', url, params1)
    },

    // 查询设备最新GPS-当前定位
    // getPuidLastGps: (params) => {
    //     //let token = params.token;
    //     let token = qxGlobalData.token;
    //     let puid = params.puid || [];
    //     let epid = params.epid || '';
    //     let Osets = "<OSets>";
    //     Osets += '<Res OType="201" OID="' + puid + '" Type="GPS" Idx="0"></Res>';
    //     Osets += "</OSets>";
    //     let xml = '<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="' + epid + '"><Res Type="ST" Idx="0" OptID="C_GS_QueryLastGPSData"><Param></Param></Res></C>' + Osets + '</M>'
    //     let url = cf.plugin_url + 'RawRequest?dstType=33&dstID=""&token=' + token;
    //     let params1 = { xml }
    //     return QxRequest('POST', url, params1)
    // },
    /// icvs2 / GPS / C_GS_QueryLastGPSData
    getPuidLastGps: (params) => {
        return QxRequest('post', `${cf.server_url}GPS/C_GS_QueryLastGPSData`, params);
    },
    // 查询历史GPS信息
    /// icvs2 / GPS / C_GS_QueryHistoryGPSData
    getPuidHistoryGps: (params) => {
        return QxRequest('get', `${cf.server_url}GPS/C_GS_QueryHistoryGPSData`, params);
    }
    // getPuidHistoryGps: (params) => {
    //     //let token = params.token;
    //     let token = qxGlobalData.token;
    //     let offset = params.offset || 0;
    //     let count = params.count || 100;
    //     let begin = params.begin;
    //     let end = params.end;
    //     let puid = params.puid;
    //     let epid = params.epid || '';
    //     let Osets = "<OSets>";
    //     Osets += '<Res OType="201" OID="' + puid + '" Type="ST" Idx="0"></Res>';
    //     Osets += "</OSets>";
    //     let xml = '<?xml version="1.0" encoding="UTF-8"?><M Type="ComReq"><C Type="C" EPID="' + epid + '"><Res Type="ST" Idx="0" OptID="C_GS_QueryHistoryGPSData"><Param  Offset="' + offset + '" Count="' + count + '" Begin="' + begin + '" End="' + end + '"></Param></Res></C>' + Osets + '</M>'
    //     let url = cf.plugin_url + 'RawRequest?dstType=33&dstID=""&token=' + token;
    //     let params1 = { xml }
    //     return QxRequest('POST', url, params1)
    // }
}

export { eleMap }