<template>
  <el-main>
    <div class="video-layout">
      <el-row>
        <video-box
          v-for="index of 4"
          :key="index"
          :window-index="index"
          @changeCurrentWindow="changeCurrentWindow"
          :current-window="currentWindow"
        ></video-box>
        <!-- @contextmenu.prevent.native="contextmenu($event, index)" -->
      </el-row>
    </div>
    <div class="contextmenu" ref="contextmenu" v-show="contextmenu_visible">
      <el-button type="text">关闭视频</el-button>
      <el-button type="text">test</el-button>
    </div>
  </el-main>
</template>

<script>
import videoBox from "./video_layout/video_box.vue";
export default {
  components: { videoBox },
  data() {
    return {
      contextmenu_visible: false,
    };
  },
  computed: {
    currentWindow() {
      return this.$store.state.playvideo.currentWindow;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    // 右键菜单显示
    contextmenu($event, key) {
      let self = this;
      let e = $event;
      // if (!self.checkWindowState(key).isPlay) {
      //   return;
      // }
      // self.contextmenuNumber = key;
      // self.activeWindow = key;

      self.contextmenu_visible = true;
      setTimeout(() => {
        let contextmenu = document.querySelector(".contextmenu");
        let contextmenuHeight = contextmenu.offsetHeight;
        let contextmenuWidth = contextmenu.offsetWidth;
        let innerHeight = window.innerHeight;
        let innerWidth = window.innerWidth;
        let asideWidth = 470;

        if (innerHeight - e.clientY > contextmenuHeight) {
          contextmenu.style.top = e.clientY + "px";
        } else {
          contextmenu.style.top = innerHeight - contextmenuHeight + "px";
        }
        if (e.clientX + contextmenuWidth > innerWidth) {
          contextmenu.style.left =
            innerWidth - asideWidth - contextmenuWidth + "px";
        } else {
          contextmenu.style.left = e.clientX - asideWidth + "px";
        }
      }, 50);
      document.addEventListener("click", (e) => {
        self.contextmenu_visible = false;
      });
    },
    changeCurrentWindow(index) {
      this.$store.commit("playvideo/setCurrentWindow", { index });
    },

    //
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},

  activated() {},
};
</script>

<style lang='scss' scoped>
</style>