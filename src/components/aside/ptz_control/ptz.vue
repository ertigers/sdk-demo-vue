<template>
  <div class="ptz-control">
    <div class="ptz">
      <div
        class="up"
        :class="{ disabled: ptzDisabled }"
        @mousedown="ptzControl('up', $event)"
      ></div>
      <div
        class="right"
        :class="{ disabled: ptzDisabled }"
        @mousedown="ptzControl('right', $event)"
      ></div>
      <div
        class="down"
        :class="{ disabled: ptzDisabled }"
        @mousedown="ptzControl('down', $event)"
      ></div>
      <div
        class="left"
        :class="{ disabled: ptzDisabled }"
        @mousedown="ptzControl('left', $event)"
      ></div>
      <div
        class="center el-icon-unlock"
        :class="[ptzDisabled ? 'el-icon-lock' : 'el-icon-unlock']"
        @click="ptzDisabled = !ptzDisabled"
      ></div>
    </div>
    <div class="camera-control">
      <div class="camera">
        <div class="unit">
          <div class="btns">
            <i
              class="el-icon-plus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('zoomin', $event)"
            ></i>
            <i
              class="el-icon-minus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('zoomout', $event)"
            ></i>
          </div>
          <span>缩放</span>
        </div>
        <div class="unit">
          <div class="btns">
            <i
              class="el-icon-plus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('augment', $event)"
            ></i>
            <i
              class="el-icon-minus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('minish', $event)"
            ></i>
          </div>
          <span>光圈</span>
        </div>
        <div class="unit">
          <div class="btns">
            <i
              class="el-icon-plus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('focusnear', $event)"
            ></i>
            <i
              class="el-icon-minus"
              :class="{ disabled: ptzDisabled }"
              @mousedown="ptzControl('focusfar', $event)"
            ></i>
          </div>
          <span>焦距</span>
        </div>
      </div>
      <div class="speed">
        <span>速度</span>
        <i
          class="el-icon-plus"
          :class="{ disabled: ptzDisabled }"
          v-repeat-click="increase"
        ></i>
        <el-slider v-model="speed" :disabled="ptzDisabled"></el-slider>
        <i
          class="el-icon-minus"
          :class="{ disabled: ptzDisabled }"
          v-repeat-click="decrease"
        ></i>
      </div>
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
    ptzControl(control, e) {
      let self = this;
      let { playing, playInfo } = self.getCurrentWindowState;
      console.log(playing, playInfo);
      if (playing && !self.ptzDisabled) {
        let { puid, idx } = playInfo;
        let params = {
          puid,
          idx,
          control,
          speed: self.speed,
        };
        self.$api("ptzControl", params).then(() => {});

        const stopControl = function () {
          let ctr = "";
          if (["up", "right", "down", "left"].includes(control)) {
            ctr = "stop";
          }
          if (["zoomin", "zoomout"].includes(control)) {
            ctr = "stopzoom";
          }
          if (["focusfar", "focusnear"].includes(control)) {
            ctr = "stopfocus";
          }
          if (["augment", "minish"].includes(control)) {
            ctr = "stopaperture";
          }
          params.control = ctr;
          self.$api("ptzControl", params).then((rv) => {});
        };

        e.target.onmouseout = function () {
          stopControl();
          document.onmouseup = null;
        };
        document.onmouseup = function () {
          stopControl();
          e.target.onmouseout = null;
        };
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
</style>