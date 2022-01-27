<template>
  <el-col
    :span="12"
    class="videobox"
    :class="{ active: currentWindow == windowIndex, playing: playID }"
    style="height:50%"
  >
    <div @click="changeCurrentWindow">
      <video
        :ref="'videobox' + windowIndex"
        :id="'videobox' + windowIndex"
      ></video>
      <i class="close el-icon-close" @click.stop="stopVideo"></i>
      <div class="tools" v-if="playID">
        <span :title="camera.Name">{{ camera.Name + statusText }}</span>
        <div class="controls" v-if="playState == 2">
          <!-- <div title="3d" class="d3d"></div> -->
          <div
            title="本地连拍"
            class="bdlp"
            @click="startMultipleLocalSnap"
          ></div>
          <div
            :title="LocalVideo.state ? '关闭本地录像' : '启动本地录像'"
            class="bdlx"
            :class="{ active: LocalVideo.state }"
            @click="handleLocalVideo"
          ></div>
          <div title="本地抓拍" class="bdzp" @click="startLocalSnap"></div>
          <div
            :title="sgStorage.state ? '关闭前端录像' : '启动前端录像'"
            class="qdlx"
            :class="{ active: sgStorage.state }"
            v-if="checkRes('SG')"
            @click="handleSGStorage"
          ></div>
          <div
            title="前端抓拍"
            class="qdzp"
            v-if="checkRes('SG')"
            @click="startSGSnapshot"
          ></div>
          <div
            :title="ydlx.state ? '关闭云录像' : '启动云录像'"
            class="ydlx"
            :class="{ active: ydlx.state }"
            v-if="checkRes('SG')"
            @click="handleCloudStorage(0)"
          ></div>
          <div
            title="云抓拍"
            class="ydzp"
            v-if="checkRes('SG')"
            @click="startCloudSnapshot"
          ></div>
          <div
            title="云连拍"
            class="ylp"
            :class="{ active: ylp.state }"
            v-if="checkRes('SG')"
            @click="handleCloudStorage(1)"
          ></div>
          <div
            :title="playAudioState ? '关闭伴音' : '打开伴音'"
            class="audio"
            :class="{ active: playAudioState }"
            v-if="checkRes('IA')"
            @click="handlePlayAudio"
          ></div>
          <div
            :title="talk.state ? '关闭对讲' : '启动对讲'"
            class="talk"
            v-if="checkRes('OA')"
            :class="{ active: talk.state }"
            @click="handleTalk"
          ></div>
          <div
            :title="call.state ? '关闭喊话' : '启动喊话'"
            class="call el-icon-microphone"
            :class="{ active: call.state }"
            v-if="checkRes('OA')"
            @click="handleCall"
          ></div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import flv from "flv.js";
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    // 窗口索引
    windowIndex: {
      type: [Number, String],
    },
    // 当前选中的窗口
    currentWindow: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      // playID: "",
      flvPlayer: null,
      // device: null,
      // camera: null,
      playState: 2,
      statusText: "",
      ylp: {
        state: false,
        id: "",
      }, //云连拍
      ydlx: {
        state: false,
        id: "",
      }, //云录像
      playAudioState: false, //伴音状态
      call: {
        state: false,
        playID: "",
      }, //喊话状态
      talk: {
        state: false,
        playID: "",
      }, //对讲状态
      sgStorage: {
        state: false,
        playID: "",
      }, //前端录像
      LocalVideo: {
        state: false,
        playID: "",
      },
    };
  },
  computed: {
    deviceResList() {
      return this.$store.state.device.deviceResList;
    },
    ...mapGetters({
      checkPlayState: "playvideo/checkPlayState",
      getCurrentWindowState: "playvideo/getCurrentWindowState",
    }),
    playID() {
      // console.log(this.getCurrentWindowState)
      let playID = null;
      let { playing, playInfo } = this.checkPlayState({
        windowIndex: this.windowIndex,
      });
      if (playing) {
        playID = playInfo.playID;
      }
      return playID;
    },
    camera() {
      let camera = null;
      let { playing, playInfo } = this.checkPlayState({
        windowIndex: this.windowIndex,
      });
      if (playing) {
        camera = playInfo.camera;
      }
      return camera;
    },
    device() {
      let device = null;
      let { playing, playInfo } = this.checkPlayState({
        windowIndex: this.windowIndex,
      });
      if (playing) {
        device = playInfo.device;
      }
      return device;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    let self = this;

    // 存储dom窗口
    let windowDom = self.$refs["videobox" + self.windowIndex];
    self.$store.commit("playvideo/setWindowDomMap", {
      windowIndex: self.windowIndex,
      windowDom: windowDom,
    });

    // self.$bus.$on("playVideo", (data) => {
    //   let { type, playID, camera, device } = data;
    //   // 判断当前摄像头是否在播放
    //   // if (self.playID && self.device && self.camera) {
    //   //   if (self.camera.puid == camera.puid && self.camera.Idx == camera.Idx) {
    //   //     // 当前摄像头正在播放
    //   //     self.$emit("currentWindowChange",self.windowIndex);
    //   //   }
    //   // }
    //   if (self.currentWindow == self.windowIndex) {
    //     self.camera = camera;
    //     self.device = device;
    //     let url = "http://172.22.72.1:9585/stream2.flv?playID=" + playID;
    //     if (self.playID) {
    //       self.stopVideo();
    //     }
    //     self.playVideo({ url, playID });
    //   }
    // });

    // 摄像头双击接收播放视频通知
    self.$bus.$on("startPlayVideo", async (node) => {
      let puid = node.data.puid;
      let idx = node.data.Idx;
      let stream = "0";
      let camera = node.data;
      let device = node.parent.data;
      if (self.windowIndex != self.currentWindow) return;
      let { playing, playInfo } = self.checkPlayState({
        camera: node.data,
      });
      // 判断摄像头是否在播放
      if (playing) {
        self.$store.commit("playvideo/setCurrentWindow", {
          index: playInfo.playWindow,
        });
        return;
      }
      // 判断当前选中的窗口是否在播放
      if (self.getCurrentWindowState.playing) {
        await self.stopVideo();
      }
      self.startPlayVideo({ puid, idx, stream, camera, device });
    });

    // 播放事件的通知
    self.$bus.$on("playEvent", (data) => {
      let { status, playID, statusText } = data;
      if (self.playID && self.playID == playID) {
        self.playState = status;
        console.log(data);
        self.statusText = statusText;
      }
    });
    self.$bus.$on("stopVideo", ({ playID }) => {
      if (playID == self.playID) {
        self.stopVideo(playID);
      }
    });
  },
  destroyed() {
    if (this.playID) {
      this.stopVideo();
    }
  },
  methods: {
    async startPlayVideo({ puid, idx, stream, camera, device }) {
      let token = this.$store.state.token;
      this.statusText = "正在连接";
      let url = `/icvs2/stream.flv?puid=${puid}&idx=${idx}&stream=${stream}&token=${token}`;   // 服务端的host
      let self = this;
      console.log(url);
      self.flvPlayer = flv.createPlayer(
        {
          type: "flv",
          url: url,
          isLive: true,
          hasAudio: false,
        },
        {
          enableWorker: false,
          autoCleanupSourceBuffer: true, //清理缓冲区
          enableStashBuffer: false,
          stashInitialSize: 128, // 减少首桢显示等待时长
          statisticsInfoReportInterval: 600,
        }
      );
      let ele = self.$refs["videobox" + self.windowIndex];
      console.log(ele);
      self.flvPlayer.attachMediaElement(ele);
      self.flvPlayer.load();
      setTimeout(() => {
        self.flvPlayer.play();
        let play = {
          playWindow: self.windowIndex,
          puid: camera.puid,
          idx: camera.Idx,
          name: camera.Name,
          camera: camera,
          device: device,
        };
        console.log(play);
        self.$store.commit("playvideo/addPlayInfo", { play });
      }, 200);
    },
    // 获取播放ID
    async getPlayId({ puid, idx, stream }) {
      let self = this;
      return this.$api("getPlayVideoId", { puid, idx, stream }).then(
        async (rv) => {
          let playID = null;
          let type = null;
          if (rv.msg == "OK") {
            playID = rv.playID;
            type = rv.type;
          } else {
            self.$message.warning(rv);
          }
          console.log(playID);
          return { playID };
        }
      );
    },
    // 播放视频
    async playVideo({ url, playID, camera, device }) {
      let self = this;
      console.log(url);
      self.flvPlayer = flv.createPlayer(
        {
          type: "flv",
          url: url,
          isLive: true,
          hasAudio: false,
        },
        {
          enableWorker: false,
          autoCleanupSourceBuffer: true, //清理缓冲区
          enableStashBuffer: false,
          stashInitialSize: 128, // 减少首桢显示等待时长
          statisticsInfoReportInterval: 600,
        }
      );
      let ele = self.$refs["videobox" + self.windowIndex];
      console.log(ele);
      self.flvPlayer.attachMediaElement(ele);
      self.flvPlayer.load();
      setTimeout(() => {
        self.flvPlayer.play();
        // self.playID = playID;
        let play = {
          playWindow: self.windowIndex,
          playID,
          puid: camera.puid,
          idx: camera.Idx,
          name: camera.Name,
          camera: camera,
          device: device,
        };
        console.log(play);
        self.$store.commit("playvideo/addPlayInfo", { play });
      }, 200);
    },
    // 关闭视频
    async stopVideo(playID) {
      let self = this;
      self.$api("stoptStream", { playID: self.playID }).then((rv) => {
        if (rv.msg == "OK") {
          self.flvPlayer.unload();
          self.flvPlayer.detachMediaElement();
          self.flvPlayer.destroy();

          let play = {
            playWindow: self.windowIndex,
            playID: self.playID,
            puid: self.camera.puid,
            idx: self.camera.Idx,
            name: self.camera.Name,
          };
          self.$store.commit("playvideo/delPlayInfo", { play });

          self.clearData();
        } else {
          self.$message.warning(rv);
        }
      });
      // }
    },
    // 清空当前播放信息
    clearData() {
      let self = this;
      // self.playID = null;
      self.flvPlayer = null;
      // self.device = null;
      // self.camera = null;
    },
    changeCurrentWindow() {
      this.$emit("changeCurrentWindow", this.windowIndex);
    },
    // 判断摄像头设备的资源类型
    checkRes(resType) {
      let self = this;
      let result = false;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      if (playing) {
        let resList = playInfo.device.children;
        if (resList) {
          result = resList.some((res) => res.Type == resType);
        }
      }
      return result;
    },
    // 云抓拍
    startCloudSnapshot() {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = {
        puid: playInfo.puid,
        idx: playInfo.idx,
        stream: 0,
      };
      self.$api("startCloudSnapshot", params).then((rv) => {
        if (!rv.errcode) {
          self.$message.success("抓拍成功");
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 处理 云连拍，云录像
    handleCloudStorage(type) {
      let self = this;
      if (type == 0) {
        // 云录像
        if (self.ydlx.state) {
          // 停止云录像
          self.stopCloudStorage(type);
        } else {
          // 开始云录像
          self.startCloudStorage(type);
        }
      }
      if (type == 1) {
        // 云连拍
        if (self.ylp.state) {
          // 停止云连拍
          self.stopCloudStorage(type);
        } else {
          // 开始云连拍
          self.startCloudStorage(type);
        }
      }
    },
    // 开始云存储(云连拍，云录像)
    startCloudStorage(type) {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      // 云连拍为连拍间隔，单位秒、录像为文件时长，单位分钟
      let fileLength = type == 0 ? 15 : 1;
      let params = {
        puid: playInfo.puid,
        idx: playInfo.idx,
        duration: 5,
        reserveDay: 30,
        fileLength: fileLength,
        type: type, //0为云录像，1为云连拍
      };
      self.$api("startCloudStorage", params).then((rv) => {
        if (rv.Error == "0") {
          let ID = rv.Param.ID;
          if (type == 0) {
            self.ydlx.state = true;
            self.ydlx.id = ID;
          }
          if (type == 1) {
            self.ylp.state = true;
            self.ylp.id = ID;
          }
          console.log(self.ylp);
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 停止云存储(云连拍，云录像)
    stopCloudStorage(type) {
      let self = this;
      let id = "";
      if (type == 0) id = self.ydlx.id;
      if (type == 1) id = self.ylp.id;

      let params = {
        id: id,
      };
      self.$api("stopCloudStorage", params).then((rv) => {
        if (!rv.errcode) {
          if (type == 0) {
            self.ydlx.state = false;
            self.ydlx.id = "";
          } else {
            self.ylp.state = false;
            self.ylp.id = "";
          }
        }
      });
    },
    // 处理伴音
    handlePlayAudio() {
      let self = this;
      //1：启用，0：关闭
      let enable = 1;
      if (self.playAudioState) {
        // 关闭伴音
        enable = 0;
      } else {
        // 开启伴音
        enable = 1;
      }
      self.enablePlayAudio(enable);
    },
    //  开启，关闭伴音
    enablePlayAudio(enable) {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = {
        playID: playInfo.playID,
        enable: enable,
      };
      self.$api("enablePlayAudio", params).then((rv) => {
        if (rv.msg == "OK") {
          self.playAudioState = enable;
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 对讲
    handleTalk() {
      let self = this;
      if (self.talk.state) {
        // 停止对讲
        self.stoptStream("talk");
      } else {
        // 启动对讲
        self.startTalk();
      }
    },
    // 开始对讲
    startTalk() {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = { puid: playInfo.puid };
      self.$api("startTalk", params).then((rv) => {
        if (!rv.errcode) {
          self.talk.state = true;
          self.talk.playID = rv.playID;
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 喊话
    handleCall() {
      let self = this;
      if (self.call.state) {
        // 停止喊话
        self.stoptStream("call");
      } else {
        // 启动喊话
        self.startCall();
      }
    },
    // 开始喊话
    startCall() {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = { puid: playInfo.puid };
      self.$api("startCall", params).then((rv) => {
        if (!rv.errcode) {
          self.call.state = true;
          self.call.playID = rv.playID;
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 停止对讲，停止喊话
    stoptStream(type) {
      let self = this;
      let playID = self[type].playID;
      let params = { playID };
      self.$api("stoptStream", params).then((rv) => {
        if (rv.msg == "OK") {
          self[type].state = false;
          self[type].playID = "";
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 开始前端抓拍
    startSGSnapshot() {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = { puid: playInfo.puid, idx: playInfo.idx };
      self.$api("startSGSnapshot", params).then((rv) => {
        if (!rv.errcode) {
          self.$message.success("抓拍成功");
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 前端录像
    handleSGStorage() {
      let self = this;
      if (self.sgStorage.state) {
        // 停止前端录像
        self.stopSGStorage();
      } else {
        // 启动前端录像
        self.startSGStorage();
      }
    },
    // 启动前端录像
    startSGStorage() {
      let self = this;
      let { playing, playInfo } = self.checkPlayState({
        windowIndex: self.windowIndex,
      });
      let params = {
        puid: playInfo.puid,
        IVIdx: playInfo.idx,
        duration: 5,
      };
      self.$api("startSGStorage", params).then((rv) => {
        self.sgStorage.state = true;
        // self.sgStorage.playID = rv.playID;
      });
    },
    // 停止前端录像
    stopSGStorage() {
      let self = this;
      let params = {
        playID: self.sgStorage.playID,
      };
      self.$api("stopSGStorage", params).then((rv) => {
        self.sgStorage.state = false;
        // self.sgStorage.playID = rv.playID;
      });
    },

    // 本地抓拍
    startLocalSnap() {
      let self = this;
      let name = new Date().getTime();
      let params = {
        playID: self.playID,
        count: 1,
        // localPath: "F:\\work\\深圳防疫平台二期\\ShenzhenFangYi\\test.jpg", //本地文件路径
        // localPath: `E:\\testImg\\${name}.jpg`, //本地文件路径
        localPath: `E:\\图片\\${name}.jpg`, //本地文件路径
      };
      self.$api("startLocalSnap", params).then((rv) => {
        if (rv.msg == "OK") {
          self.$message.success("抓拍成功");
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 本地连拍
    startMultipleLocalSnap() {
      let self = this;
      let name = new Date().getTime();
      let params = {
        playID: self.playID,
        count: 5,
        // localPath: "", //本地文件路径
        localPath: `E:\\图片\\${name}.jpg`, //本地文件路径
      };
      self.$api("startLocalSnap", params).then((rv) => {
        if (rv.msg == "OK") {
          self.$message.success("正在连拍");
        } else {
          self.$message.warning(rv);
        }
      });
    },
    // 停止本地连拍
    stopLocalSnapShot() {
      let self = this;
      let params = {
        playID: self.playID,
      };
      self.$api("stopLocalSnapShot", params).then((rv) => {});
    },
    // 本地录像
    handleLocalVideo() {
      let self = this;
      if (self.LocalVideo.state) {
        // 停止本地录像
        self.stopLocalVideo();
      } else {
        // 启动本地录像
        self.startLocalVideo();
      }
    },
    // 启动本地录像
    startLocalVideo() {
      let self = this;
      let name = new Date().getTime();
      let params = {
        playID: self.playID,
        // localPath: "F:\\work\\深圳防疫平台二期\\ShenzhenFangYi\\test.mp4", //本地文件路径，如果文件后缀可以为.mp4或者为.avi
        localPath: `E:\\图片\\${name}.mp4`, //本地文件路径，如果文件后缀可以为.mp4或者为.avi
        maxFileTime: 900, //文件最大长度，单位秒，到了这个长度就换文件
      };
      self.$api("startLocalVideo", params).then((rv) => {
        self.LocalVideo.state = true;
        // self.LocalVideo.playID = rv.Param.ID;
      });
    },
    // 停止本地录像
    stopLocalVideo() {
      let self = this;
      let params = {
        playID: self.playID,
      };
      self.$api("stopLocalVideo", params).then((rv) => {
        self.LocalVideo.state = false;
      });
    },
    //
  },
};
</script>

<style lang='scss' scoped>
.videobox {
  position: relative;
  height: 50%;
  border: solid 1px #333;

  &.active {
    border: solid 1px #fff;
  }

  video {
    width: 100%;
    height: 100%;
  }

  > div {
    height: 100%;
  }

  .close {
    display: none;
    position: absolute;
    right: 5px;
    top: 5px;

    &:hover {
      cursor: pointer;
    }
  }

  &.playing:hover,
  &.playing.active {
    i.close {
      display: block;
    }
  }

  .tools {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;

    > span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .controls {
      display: flex;

      > div {
        width: 20px;
        height: 20px;
        background-size: 100%;
        background-position: center;
        margin: 0 1px;

        &:hover {
          cursor: pointer;
        }
      }

      $tools-list: d3d, audio, bdlp, bdlx, bdzp, qdlx, qdzp, talk, ydlx,
        ydzp, ylp;

      @for $i from 1 through length($tools-list) {
        $name: nth($tools-list, $i);

        .#{$name} {
          background-image: url("~@/assets/icons/video-tools-#{$name}.png");

          &.active {
            background-image: url("~@/assets/icons/video-tools-#{$name}-active.png");
          }
        }
      }

      .call {
        line-height: 20px;
        font-size: 16px;
        text-align: center;

        &.active {
          color: #01ff0f;
        }
      }
    }
  }
}
</style>