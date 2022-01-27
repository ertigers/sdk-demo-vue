<template>
  <div class="ptz-control">
    <div class="ptz">
      <h4>旋转云平台</h4>
      <el-row>
        <el-button type="primary" @mousedown="ptzControl('up')" @mouseup="ptzControl('stop')">上</el-button>
        <el-button type="primary" @mousedown="ptzControl('down')" @mouseup="ptzControl('stop')">下</el-button>
        <el-button type="primary" @mousedown="ptzControl('left')" @mouseup="ptzControl('stop')">左</el-button>
        <el-button type="primary" @mousedown="ptzControl('right')" @mouseup="ptzControl('stop')">右</el-button>
      </el-row>
      <h4>设备控制</h4>
      <el-row>
        <el-button type="primary" @mousedown="ptzControl('zoomin')" @mouseup="ptzControl('stopzoom')">放大图像</el-button>
        <el-button type="primary" @mousedown="ptzControl('zoomout')" @mouseup="ptzControl('stopzoom')">缩小图像</el-button>
        <el-button type="primary" @mousedown="ptzControl('near')" @mouseup="ptzControl('stopfocus')">拉近焦点</el-button>
        <el-button type="primary" @mousedown="ptzControl('faraway')" @mouseup="ptzControl('stopfocus')">推远焦点</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" @mousedown="ptzControl('augment')" @mouseup="ptzControl('stopaperture')">增大光圈</el-button>
        <el-button type="primary" @mousedown="ptzControl('minish')" @mouseup="ptzControl('stopaperture')">缩小光圈</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import RepeatClick from "element-ui/src/directives/repeat-click";
import { mapGetters } from "vuex";
export default {
  components: {},
  directives: {
    repeatClick: RepeatClick,
  },
  data() {
    return {
      // 云台控制
      speed: 50,
      ptzDisabled: false,
    };
  },
  computed: {
    ...mapGetters({
      getCurrentWindowState: "playvideo/getCurrentWindowState",
    }),
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    increase() {
      if (this.speed < 100 && !this.ptzDisabled) {
        this.speed++;
      }
    },
    decrease() {
      if (this.speed > 0 && !this.ptzDisabled) {
        this.speed--;
      }
    },

    // 云台操作（13个指令）
    ptzControl(control) {
      console.log(control);
      let { playing, playInfo } = this.getCurrentWindowState;
      console.log(playing, playInfo);
      if (playing && !this.ptzDisabled) {
        let { puid, idx } = playInfo;
        let params = {
          puid,
          idx,
          control,
        };
        this.$api("ptzControl", params).then(() => {});
      }
    },
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},

  activated() {},
};
</script>

<style lang='scss' scoped>
// 云台控制
.ptz-control {
  .ptz {
    h4 {
      margin-bottom: 10px;
    }
    .el-row {
      display: flex;
      margin-bottom: 16px;
      .el-button {
        width: 100px;
      }
    }
  }
}
</style>