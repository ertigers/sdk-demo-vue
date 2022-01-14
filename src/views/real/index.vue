<template>
  <div class="container video-container">
    <aside>
      <el-tabs class="tab-container1">
        <el-tab-pane label="云台控制">
          <PtzControl></PtzControl>
        </el-tab-pane>
        <el-tab-pane label="预置位">
          <PresetPos></PresetPos>
        </el-tab-pane>
      </el-tabs>
      <el-tabs class="tab-container2">
        <el-tab-pane label="设备列表">
          <DeviceList></DeviceList>
        </el-tab-pane>
      </el-tabs>
    </aside>
    <main class="video-layout">
      <el-row>
        <VideoBox
          v-for="index of 4"
          :key="index"
          :window-index="index"
          @changeCurrentWindow="changeCurrentWindow"
          :current-window="currentWindow"
        ></VideoBox>
      </el-row>
    </main>
  </div>
</template>

<script>
import PtzControl from "../../components/PtzControl.vue";
import PresetPos from "../../components/PresetPos.vue";
import DeviceList from "../../components/DeviceList.vue";
import VideoBox from "../../components/VideoBox.vue";

export default {
  components: { PtzControl, PresetPos, DeviceList, VideoBox },
  data() {
    return {
      token: "",
    };
  },
  computed: {
    currentWindow() {
      return this.$store.state.playvideo.currentWindow;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.login();
  },
  methods: {
    login() {
      let params = {
        address: "47.96.224.81",
        port: 9988,
        user: "admin",
        password: "",
        epid: "system",
        fixaddr: 0,
      };
      this.$api("login", params, this.eventCallback).then((rv) => {
        console.log(rv);
        if (rv.msg == "OK") {
          let token = rv.token;
          this.token = token;
          this.$store.commit("setToken", token); // token存储到vuex中
          this.$store.dispatch("device/startFetchDevice");
        } else {
          this.$message.warning(rv.msg);
        }
      });
    },
    eventCallback(params) {
      console.log(params);
      if (params.type === "playEvent") {
        // 播放视频的状态
        let { status, playID, statusText } = params.data;
        this.$bus.$emit("playEvent", { status, playID, statusText });
      }
    },
    changeCurrentWindow(index) {
      this.$store.commit("playvideo/setCurrentWindow", { index });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  flex: 1;
  display: flex;
  aside {
    width: 470px;
    height: 100%;
    padding: 20px;
  }
  main {
    flex: 1;
  }
}
</style>
