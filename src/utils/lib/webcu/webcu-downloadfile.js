import { download } from '../webcu/webcu-download.js'
import { historyPlay } from '../webcu/webcu-history-play.js'
import { plugin } from './webcu-plugin.js'
//import { cf } from "../config.js"
const downloadfile = {
    //云存储下载
    downloadCloudFile: async(params) => {
        if (params.downloadType == 0) {
            let typeMap = {
                0: ".mp4",
                1: ".jpg",
                2: ".WAV",
            };

            let fileType = params.fileType
            let data, paramsStream, url
                // timeSpanSecond 表示录像持续秒数, 默认为300, 即如果在录像过程中没有调用停止录像, 则录像在300秒后自动停止
                // retentionMinutes 表示录像文件保留分钟, 默认5, 即从录像结束算起, 5 分钟后删除录像
                // abandon_audio 0

            let index = params.Name.indexOf(".");
            let fileName = params.Name.substring(0, index) + typeMap[fileType];
            if (fileType === "0") {
                let paramsVideoToken = {
                    id: params.id,
                    path: params.Path + params.Name,
                    idx: params.idx,
                    stream: 0,
                    resType: "IV",
                    puid: params.puid,
                    start: 0,
                    token
                };
                paramsStream = {
                    abandon_audio: 0,
                    timeSpanSecond: params.End - params.Begin,
                    retentionMinutes: 20
                }
                paramsStream = Object.assign(paramsStream, await videoToken(paramsVideoToken));
                data = await download.recordStream(paramsStream)
                await isProgress(data.fileId)
                url = `/icvs2/misc/recordStreamFile?fileId=${data.fileId}`
            } else {
                url = `/icvs2/CSS/C_CSS_DownloadFile?id=${params.ID}&path=${params.Path + params.Name}&token=${token}`;
            }
            const aLink = document.createElement("a");
            aLink.download = fileName;
            aLink.href = url;
            aLink.dispatchEvent(new MouseEvent("click", {}));
        } else {
            plugin.loginPlugin(params.token)
        }

    },
    //前端存储下载
    downloadDeviceFile: async(params) => {
        if (params.downloadType == 0) {
            let typeMap = {
                0: ".mp4",
                1: ".jpg",
                2: ".WAV",
            };
            let data, paramsStream, url
            let fileType = params.fileType
            let index = params.Name.indexOf(".");
            let fileName = params.Name.substring(0, index) + typeMap[fileType];
            if (fileType === "0") {
                let paramsVideoToken = {
                    puid: params.puid,
                    startTime: 0,
                    path: params.Path + params.Name,
                    idx: params.idx,
                    token
                };
                // timeSpanSecond 表示录像持续秒数, 默认为300, 即如果在录像过程中没有调用停止录像, 则录像在300秒后自动停止
                // retentionMinutes 表示录像文件保留分钟, 默认5, 即从录像结束算起, 5 分钟后删除录像
                // abandon_audio 0
                paramsStream = {
                    abandon_audio: 0,
                    timeSpanSecond: params.End - params.Begin,
                    retentionMinutes: 20
                }
                paramsStream = Object.assign(paramsStream, await videoToken(paramsVideoToken));
                data = await download.recordStream(paramsStream)
                await isProgress(data.fileId)
                url = `/icvs2/misc/recordStreamFile?fileId=${data.fileId}`
            } else {
                //http://${cf.server_host}
                url = `/icvs2/SG/C_SG_DownLoadFile_PushMode?puid=${params.puid}&path=${params.Path + params.Name}&token=${token}`;
            }
            const aLink = document.createElement("a");
            aLink.download = fileName;
            aLink.href = url;
            aLink.dispatchEvent(new MouseEvent("click", {}));
        } else {
            plugin.loginPlugin(params.token)
        }

    },
}


function isProgress(fileId) {
    let result
    let timer
    return new Promise((resolve) => {
        timer = setInterval(async() => {
            result = await download.recordStatus({
                fileId: fileId
            })

            if (result && result.status != 'In Progress') {
                clearInterval(timer)
                resolve("OK")
            } else {

            }
        }, 2000)
    })
}
//获取视频token
async function videoToken(params) {
    let res;
    if (local === "0") {
        //云存储视频token
        res = await historyPlay.getVodCloudFileToken(params);
    } else if (local === "1") {
        //前端存储视频token
        res = await historyPlay.getVodDeviceToken(params);
    }
    // console.log(1);
    let videoCodecTypeByToken = {
        IP: res.IP,
        Port: res.Port,
        Token: res.Token,
    };
    //paramObj.videoCodecTypeByToken = videoCodecTypeByToken;
    return videoCodecTypeByToken

    // let params265 = {
    //     IP: res.IP,
    //     Port: res.Port,
    //     Token: token,
    // };
}

export { downloadfile }