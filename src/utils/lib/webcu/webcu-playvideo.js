import { cf } from "../config.js"
import { common } from './webcu-common.js';
import { qxGlobalData } from './webcu_global_data.js'
import { WebGLDisplayer } from '../utils/webgldisplay.js'
import { plugin } from './webcu-plugin.js'
import { historyPlay } from './webcu-history-play.js'
import  flvjs  from '../utils/flv.js'
// import  '../utils/flv.js'

const playvideo = {
    // 播放视频-传入参数，只播放H.264视频
    play: async(params) => {
        let token = qxGlobalData.token
        let { videoType, puid, idx, videoWrapperDom } = params
        const baseValue = {
            videoID: puid + '_' + idx,
            puid,
            idx,
            url: "",
            videoType,
            playID: "",
            callID: "",
            talkID: "",
            pictureID: "",
            videoWrapperDom,
            videoDom: '',
        };
        console.log(baseValue);
        if (videoType === "video/avc") {
            let url = `/icvs2/stream.flv?puid=${puid}&idx=${idx}&stream=0&token=${token}`;
            baseValue.url = url;
            let res = await playvideoFlv(baseValue)
            baseValue.flvPlayer = res
            qxGlobalData.addPlayer(baseValue)
            console.log(qxGlobalData.playerList);
            return { msg: 'OK' }
        } else if (videoType === "video/hevc") {
            console.log('接入H.265流程');
            let query = { puid, idx }
            let res1 = await plugin.loginPlugin(token)
            console.log(res1);
            let res2 = await plugin.getPlayID(query)
            console.log(res2);
            baseValue.playID = res2.playID
            let url = cf.plugin_ws_url + "stream.yuv?playID=" + baseValue.playID;
            baseValue.url = url;
            let res3 = await playvideoYuv(baseValue)
            console.log(res3);
            baseValue.videoPlayer = res3.videoPlayer
            baseValue.reader = res3.reader
            baseValue.ws = res3.ws
            qxGlobalData.addPlayer(baseValue)
            return { msg: 'OK' }
        } else { // 按照流程播放，先确定播放视频的格式
            let params = {
                puid,
                idx,
                stream: 0,
                resType: 'IV',
            }
            let data = await common.getPlayVideoType(params);
            if (data) baseValue.videoType = data.mime
            if (baseValue.videoType === "video/avc") { // h264
                let url = `/icvs2/stream.flv?puid=${puid}&idx=${idx}&stream=0&token=${token}`;
                baseValue.url = url;
                let res = await playvideoFlv(baseValue)
                baseValue.flvPlayer = res
                qxGlobalData.addPlayer(baseValue)
                console.log(qxGlobalData.playerList);
                return { msg: 'OK' }
            } else if (baseValue.videoType === "video/hevc") { // h265,如果需要播放h265格式的视频，需要安装插件，没有需求则忽略
                console.log('接入H.265流程');
                let query = { puid, idx }
                let res1 = await plugin.loginPlugin(token)
                console.log(res1);
                let res2 = await plugin.getPlayID(query)
                console.log(res2);
                baseValue.playID = res2.playID
                let url = cf.plugin_ws_url + "stream.yuv?playID=" + baseValue.playID;
                baseValue.url = url;
                let res3 = await playvideoYuv(baseValue)
                console.log(res3);
                baseValue.videoPlayer = res3.videoPlayer
                baseValue.reader = res3.reader
                baseValue.ws = res3.ws
                qxGlobalData.addPlayer(baseValue)
                return { msg: 'OK' }
            } else {
                console.log("选择播放类型参数错误");
            }
        }
    },
    stop: async(params) => {
        console.log(qxGlobalData.playerList);
        let id = params.puid + "_" + params.idx
        let playerItem = qxGlobalData.getPlayer(id)
        if (playerItem.videoType === 'video/avc') {
            playerItem.flvPlayer && playerItem.flvPlayer.unload();
            playerItem.flvPlayer && playerItem.flvPlayer.detachMediaElement();
            playerItem.flvPlayer && playerItem.flvPlayer.destroy();
            qxGlobalData.delPlayer(id)
        } else if (playerItem.videoType === 'video/hevc') {
            let ID = playerItem.playID;
            await plugin.stopVideo(ID)
            playerItem.ws.close();
            playerItem.ws = null;
            playerItem.reader = null;
            playerItem.videoPlayer = null;
            qxGlobalData.delPlayer(id)
        }
        return { msg: 'OK' }
    },
    playHistory: async(params) => {
        let token = qxGlobalData.token
        let { videoType, puid, idx, videoWrapperDom } = params
        const baseValue = {
            videoID: puid + '_' + idx,
            puid,
            idx,
            url: "",
            videoType,
            playID: "",
            callID: "",
            talkID: "",
            pictureID: "",
            videoWrapperDom,
            videoDom: '',
        };
        console.log(baseValue);
        if (videoType === "video/avc") {
            let url;
            if (params.storageType == 'CSS') {
                //http://${_cf.server_host}&stream=${params.stream}&durationSecond=${params.durationSecond}
                url = `/icvs2/${params.storageType}/VODFile.flv?id=${params.id}&puid=${params.puid}&path=${params.path + params.name}&start=0&&resType="IV"&token=${token}`;
            } else {
                url = `/icvs2/${params.storageType}/VODFile.flv?puid=${params.puid}&path=${params.path + params.name}&start=0&idx=${params.idx}&resType="IV"&token=${token}`;
            }

            baseValue.url = url;
            let res = await playvideoFlv(baseValue)
            baseValue.flvPlayer = res
            qxGlobalData.addPlayer(baseValue)
            console.log(qxGlobalData.playerList);
            return { msg: 'OK' }
        } else if (videoType === "video/hevc") {
            console.log('接入H.265流程');
            let query = { puid, idx }
            let res1 = await plugin.loginPlugin(token)
            console.log(res1);
            let res2
            if (params.storageType == 'CSS') {
                query = {
                    id: params.id,
                    path: params.path + params.name,
                    idx: idx,
                    puid: puid,
                    stream: 0,
                    resType: "IV",
                    start: 0,
                    token,
                };
                res2 = await historyPlay.getVodCloudFile(query);
                //res2 = await historyPlay.getVodCloudFileToken(query);
            } else if (params.storageType == 'SG') {
                query = {
                    puid: puid,
                    idx: idx,
                    path: params.path + params.name,
                    startTime: 0,
                    token,
                };
                res2 = await historyPlay.getVodDeviceFile(query);
                //res2 = await historyPlay.getVodDeviceToken(query);
            } else {
                res2 = await plugin.getPlayID(query)
            }
            console.log(res2);
            baseValue.playID = res2.playID
            let url = cf.plugin_ws_url + "stream.yuv?playID=" + baseValue.playID;
            baseValue.url = url;
            let res3 = await playvideoYuv(baseValue)
            console.log(res3);
            baseValue.videoPlayer = res3.videoPlayer
            baseValue.reader = res3.reader
            baseValue.ws = res3.ws
            qxGlobalData.addPlayer(baseValue)
            return { msg: 'OK' }
        } else { // 按照流程播放，先确定播放视频的格式
            let params = {
                puid,
                idx,
                stream: 0,
                resType: 'IV',
            }
            let data = await common.getPlayVideoType(params);
            if (data) baseValue.videoType = data.mime
            if (baseValue.videoType === "video/avc") { // h264
                let url;
                if (params.storageType == 'CSS') {
                    //http://${_cf.server_host}&stream=${params.stream}&durationSecond=${params.durationSecond}
                    url = `/icvs2/${params.storageType}/VODFile.flv?id=${params.id}&puid=${params.puid}&path=${params.path + params.name}&start=0&&resType="IV"&token=${token}`;
                } else {
                    url = `/icvs2/${params.storageType}/VODFile.flv?puid=${params.puid}&path=${params.path + params.name}&start=0&idx=${params.idx}&resType="IV"&token=${token}`;
                }

                baseValue.url = url;
                let res = await playvideoFlv(baseValue)
                baseValue.flvPlayer = res
                qxGlobalData.addPlayer(baseValue)
                console.log(qxGlobalData.playerList);
                return { msg: 'OK' }
            } else if (baseValue.videoType === "video/hevc") { // h265,如果需要播放h265格式的视频，需要安装插件，没有需求则忽略
                console.log('接入H.265流程');
                let query = { puid, idx }
                let res1 = await plugin.loginPlugin(token)
                console.log(res1);
                let res2
                if (params.storageType == 'CSS') {
                    query = {
                        id: params.id,
                        path: params.path + params.name,
                        idx: idx,
                        puid: puid,
                        stream: 0,
                        resType: "IV",
                        start: 0,
                        token,
                    };
                    res2 = await historyPlay.getVodCloudFile(query);
                    //res2 = await historyPlay.getVodCloudFileToken(query);
                } else if (params.storageType == 'SG') {
                    query = {
                        puid: puid,
                        idx: idx,
                        path: params.path + params.name,
                        startTime: 0,
                        token,
                    };
                    res2 = await historyPlay.getVodDeviceFile(query);
                    //res2 = await historyPlay.getVodDeviceToken(query);
                } else {
                    res2 = await plugin.getPlayID(query)
                }
                console.log(res2);
                baseValue.playID = res2.playID
                let url = cf.plugin_ws_url + "stream.yuv?playID=" + baseValue.playID;
                baseValue.url = url;
                let res3 = await playvideoYuv(baseValue)
                console.log(res3);
                baseValue.videoPlayer = res3.videoPlayer
                baseValue.reader = res3.reader
                baseValue.ws = res3.ws
                qxGlobalData.addPlayer(baseValue)
                return { msg: 'OK' }
            } else {
                console.log("选择播放类型参数错误");
            }
        }
    },
    stopHistory: async(params) => {
        console.log(qxGlobalData.playerList);
        let id = params.path + "_" + params.name
        let playerItem = qxGlobalData.getPlayer(id)
        if (playerItem.videoType === 'video/avc') {
            playerItem.flvPlayer && playerItem.flvPlayer.unload();
            playerItem.flvPlayer && playerItem.flvPlayer.detachMediaElement();
            playerItem.flvPlayer && playerItem.flvPlayer.destroy();
            qxGlobalData.delPlayer(id)
        } else if (playerItem.videoType === 'video/hevc') {
            let ID = playerItem.playID;
            await plugin.stopVideo(ID)
            playerItem.ws.close();
            playerItem.ws = null;
            playerItem.reader = null;
            playerItem.videoPlayer = null;
            qxGlobalData.delPlayer(id)
        }
        return { msg: 'OK' }
    },
};

// 播放H264
function playvideoFlv(baseValue) {
    return new Promise((resolve) => {
        let { videoWrapperDom, videoType, videoID, url } = baseValue
        console.log(baseValue);
        // 创建dom
        let videoDom = createVideoDom({ videoType, videoID, videoWrapperDom })
        console.log(videoDom);
        if (!videoDom) return
        baseValue.videoDom = videoDom
        videoWrapperDom.append(videoDom)

        let flvPlayer = flvjs.createPlayer({
            type: "flv",
            url,
            isLive: true,
            hasAudio: true,
        }, {
            enableWorker: false,
            autoCleanupSourceBuffer: true, //清理缓冲区
            enableStashBuffer: false,
            stashInitialSize: 128, // 减少首桢显示等待时长
            statisticsInfoReportInterval: 600,
        });
        flvPlayer.attachMediaElement(videoDom);
        flvPlayer.load();
        setTimeout(() => {
            flvPlayer.play();
        }, 100);

        // 对象监听
        flvPlayer.on("scriptdata_arrived", (e) => {
            console.log(e.onMetaData.audiochannels);
            if (e.onMetaData.audiochannels) {
                console.log("音频视频播放成功");
                baseValue.soundStatus = 1;
                resolve(flvPlayer)
            } else {
                console.log("切换至无音频流");

                // 关闭有音频的视频-销毁
                console.log(flvPlayer);
                flvPlayer && flvPlayer.unload();
                flvPlayer && flvPlayer.detachMediaElement();
                flvPlayer && flvPlayer.destroy();
                flvPlayer = null

                // 新建新的
                setTimeout(()=>{
                    baseValue.soundStatus = 0;
                    baseValue.videoDom.muted = true;
                    let flvPlayer = flvjs.createPlayer({
                        type: "flv",
                        url,
                        isLive: true,
                        hasAudio: false,
                    }, {
                        enableWorker: false,
                        autoCleanupSourceBuffer: true, //清理缓冲区
                        enableStashBuffer: false,
                        stashInitialSize: 128, // 减少首桢显示等待时长
                        statisticsInfoReportInterval: 600,
                    });
                    flvPlayer.attachMediaElement(videoDom);
                    flvPlayer.load();
                    setTimeout(() => {
                        flvPlayer.play();
                    }, 100);
                    flvPlayer.on("scriptdata_arrived", () => {
                        console.log('无音频播放成功');
                        resolve(flvPlayer)
                    });
                    flvPlayer.on("error", () => {
                        console.log("播放出现错误");
                    });                    
                },120)
            }
        });
        flvPlayer.on("error", () => {
            console.log("播放出现错误");
        });
    })

}

// 播放H265
function playvideoYuv(baseValue) {
    return new Promise((resolve) => {
        let { videoWrapperDom, videoType, videoID, url } = baseValue
        console.log(baseValue);
        // 创建dom
        let videoDom = createVideoDom({ videoType, videoID, videoWrapperDom })
        console.log(videoDom);
        if (!videoDom) return
        baseValue.videoDom = videoDom
        videoWrapperDom.append(videoDom)
            // 新建ws
        let videoPlayer = new WebGLDisplayer(videoDom);
        let reader = new FileReader();
        let buf = null;
        // let version = null;
        let width = null;
        let nwidth = null;
        let height = null;
        let nheight = null;
        // let length = null;
        let data = null;
        reader.onload = function() {
            buf = new Uint8Array(this.result);
            // version = buf.slice(0, 4);
            width = buf.slice(4, 6);
            nwidth = width[1] << 8;
            nwidth += width[0];
            height = buf.slice(6, 8);
            nheight = height[1] << 8;
            nheight += height[0];
            // length = buf.slice(8, 12);
            data = buf.slice(12);
            videoPlayer.renderImg(nwidth, nheight, data);
        };
        console.log(url);
        let ws = new WebSocket(url);
        ws.onopen = function() {
            // 播放成功，加入数组
            resolve({ videoPlayer, reader, ws })
        };
        ws.onmessage = function(data) {
            reader.readAsArrayBuffer(data.data);
        };
        ws.onclose = function() {};
        ws.onerror = function() {};
    })

}

// 创建video和canvas DOM
function createVideoDom(params) {
    let videoType = params.videoType
    let videoId = params.videoID;
    let height = params.videoWrapperDom.offsetHeight;
    let width = params.videoWrapperDom.offsetWidth;

    let videoDom
    if (videoType === "video/avc") {
        videoDom = document.createElement("video");
        videoDom.id = videoId;
        videoDom.width = width;
        videoDom.height = height;
        videoDom.style.width = "100%";
        videoDom.controls = false;
        videoDom.ontimeupdate = (e) => { // 播放延迟处理
            var bf = e.srcElement.buffered;
            var currentTime = e.srcElement.currentTime;
            if (bf.length > 0) {
                let end = bf.end(0);
                if (end - currentTime > 1.5) {
                    e.srcElement.currentTime = end - 0.1;
                }
            }
        }
    } else if (videoType === "video/hevc") {
        videoDom = document.createElement("canvas");
        videoDom.id = videoId;
        videoDom.width = width;
        videoDom.height = height;
    }
    return videoDom
}

export { playvideo };