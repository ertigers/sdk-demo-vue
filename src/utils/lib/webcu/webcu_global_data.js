const qxGlobalData = {   // 播放一次视频后获取到了视频格式，存起来。
  token:'',
  callback:'',  // 插件登录，做到和q2http一致

  playTypeList:[],
  // 查询当前视频有没有已保存的视频格式。
  getPlayType(id) {
    let PlayItem = this.playTypeList.find((item)=>{
      return item.id == id
    })
    if(PlayItem &&  PlayItem.type && PlayItem.type != 'unknown' ) {
      return PlayItem
    }else { 
      return
    }
  },
  setPlayType(id,type) {
    let PlayItem = this.getPlayType(id)
    if(PlayItem) {
      PlayItem.type = type
    }else {
      let obj = { id, type }
      this.playTypeList.push(obj)
    }
  },

  // 播放视频List
  playerList: [],

  getPlayer(id) {
    let index = this.playerList.findIndex((item)=>{
      return item.videoID === id
    })
    if(index > -1) { // 有数据
      return this.playerList[index]
    }else {
      return undefined
    }
  },

  addPlayer(player) {
    let oldPlayer = this.getPlayer()
    if(oldPlayer) {
      oldPlayer = player
    }else{
      this.playerList.push(player)
    }
  },

  delPlayer(id) {
    let index = this.playerList.findIndex((item)=>{
      return item.videoID === id
    })
    if(index > -1) {
      this.playerList.splice(index,1)
    }
  },
}

export { qxGlobalData }