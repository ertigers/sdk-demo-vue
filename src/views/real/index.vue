<template>
  <div class="video-container">
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
  },
  methods: {
    changeCurrentWindow(index) {
      this.$store.commit("playvideo/setCurrentWindow", { index });
    },
  },
};
</script>

<style scoped lang="scss">
.video-container {
  flex: 1;
  display: flex;
  background-color: #0e181a;
  aside {
    width: 470px;
    padding: 20px;
    /deep/ .el-tabs {
      .el-tabs__nav-wrap {
        .el-tabs__active-bar {
          display: none;
        }
        &::after {
          display: none;
        }
      }
      .el-tabs__nav {
        .el-tabs__item {
          height: 26px;
          line-height: 26px;
          padding-left: 20px;
          padding-right: 20px;
          background-color: rgba(0, 163, 255, 0.2);
          border-radius: 4px;
          color: #fff;
          font-size: 12px;
          margin-right: 10px;

          &.is-active {
            background-color: rgba(0, 163, 255, 1);
          }
        }
      }
      .el-tabs__content {
        background-color: rgba(0, 158, 255, 0.0823529);
        .el-tab-pane {
          height: 100%;
        }
      }
    }

    /* 云台控制，预置位 */
    .tab-container1 {
      height: 300px;
      /deep/ .el-tabs__content {
        height: 260px;
      }
    }
    // 设备列表
    .tab-container2 {
      height: 520px;
      margin-top: 20px;
      /deep/ .el-tabs__content {
        height: calc(100% - 40px);
      }
    }

  }
  main {
    flex: 1;
  }
  // 视频窗口
  .video-layout {
    height: 100%;
    .el-row {
      height: 100%;
    }
  }
}
</style>
