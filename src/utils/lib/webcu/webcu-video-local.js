import { qxGlobalData } from './webcu_global_data.js'

const videoLocal = {
  /**
  * 
  * @param {*本地抓拍，连拍，录像} params 
  * 
  */
  //  本地抓拍
  startLocalSnapshot: (params)=>{
    let id = params.puid + '_' + params.idx
    let playerItem = qxGlobalData.getPlayer(id)
    if(playerItem.videoType === 'video/avc') {
      let video = playerItem.videoDom
      let canvas = document.createElement("canvas");
      // let img = document.createElement("img");
      let ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log(video.width)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log(canvas);
      let imgSrc = canvas.toDataURL();
      const aLink = document.createElement("a");
      aLink.download = `LocalSnapshot-${new Date().getTime()}`;
      aLink.href = imgSrc;
      aLink.dispatchEvent(new MouseEvent("click", {}));
    }else if(playerItem.videoType === 'video/hevc'){
      // todo
      
    }
  },
  // 本地录像

  // 下面是旧版本本地化插件的内容
  // 本地抓拍,连拍
  // startLocalSnap: (params) => {
  //   let query ={
  //     playID: params.playID,
  //     localPath: params.localPath,
  //     count: params.count || 1,
  //     interval: params.interval || 6,
  //     token: params.token,
  //   }
  //   return QxRequest('get',`${cf.plugin_url}localSnapshot`, query);
  // },
  // // 停止本地连拍
  // stopLocalSnapShot:(params) => {
  //   return QxRequest('get',`${cf.plugin_url}cancelLocalSnapshot`, params);
  // },
  // // 本地录像
  // startLocalVideo:(params) => {
  //   let query ={
  //     playID: params.playID,
  //     localPath: params.localPath,
  //     maxFileTime: params.maxFileTime || 300,
  //     token: params.token,
  //   }
  //   return QxRequest('get',`${cf.plugin_url}localRecord`, query);
  // },
  // // 停止本地录像
  // stopLocalVideo:(params) => {
  //   return QxRequest('get',`${cf.plugin_url}cancelLocalRecord`, params);
  // },
}

export { videoLocal }