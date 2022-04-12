<template>
  <div class="presetpos">
    <ul>
      <li
        v-for="yzw of yzwList.length ? yzwList : 255"
        :key="yzw.index"
        :class="{ active: yzw.index == PresetPosIndex }"
        @click="PresetPosIndex = yzw.index"
      >
        <span>{{ yzwList.length ? yzw.name : "预置位" + yzw }}</span>
        <div class="tools">
          <i
            class="el-icon-s-operation set"
            title="设置预置位"
            @click="setPresetPos(yzw.index)"
          ></i>
          <i
            class="el-icon-position goto"
            title="前往预置位"
            @click="moveToPresetPos"
          ></i>
        </div>
      </li>
    </ul>
    <div class="control" title="正在开发">
      <i class="refresh" name="刷新"></i>
      <i class="down" name="下移" @click="movedown"></i>
      <i class="up" name="上移" @click="moveUp"></i>
      <i class="set" name="置顶"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      yzwList: [],
      PresetPosIndex: 0,
      currentCamera: null,
    };
  },
  computed: {
    ...mapGetters({
      getCurrentWindowState: "playvideo/getCurrentWindowState",
    }),
    currentWindow() {
      return this.$store.state.playvideo.currentWindow;
    },
  },
  watch: {
    currentWindow() {
      let { playing, playInfo } = this.getCurrentWindowState;
      if (playing) {
        let puid = playInfo.puid;
        let idx = playInfo.idx;

        this.getPresetPosList(puid, idx);
      } else {
        this.yzwList = [];
        for (let index = 1; index < 256; index++) {
          let obj = {
            index: index,
            name: "预置位" + index,
          };
          this.yzwList.push(obj);
        }
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    let self = this;
    self.$bus.$on("treeNodeClick", (data) => {
      console.log(data);
      self.currentCamera = data;
      if (data.treeType == "res") {
        let puid = data.puid;
        let idx = data.Idx;
        self.getPresetPosList(puid, idx);
      }
    });
  },
  methods: {
    // 查询预置位
    getPresetPosList(puid, idx) {
      let self = this;
      // let { playing, playInfo } = self.getCurrentWindowState;
      // console.log(self.getCurrentWindowState);
      let params = {
        puid: puid,
        idx: idx,
      };
      self.yzwList = [];
      for (let index = 1; index < 256; index++) {
        let obj = {
          index: index,
          name: "预置位" + index,
        };
        self.yzwList.push(obj);
      }
      this.$webcu2plugin.getPresetPosList(params).then((rv)=>{
        console.log(rv);
        if (rv.code == 0) {
          if (rv.rows) {
            self.yzwList = rv.rows;
            if (self.yzwList.length && self.yzwList.length < 255) {
              let count = 255 - self.yzwList.length;
              let containIndex = self.yzwList.map((y) => y._Idx);
              let list = [];
              for (
                let i = self.yzwList.length + 1;
                i < self.yzwList.length + count + 1;
                i++
              ) {
                if (containIndex.includes(i.toString())) continue;
                let o = {
                  _Idx: i,
                  _Name: "预置位" + i,
                };
                list.push(o);
              }
              console;
              self.yzwList = self.yzwList.concat(list);
            }
            self.yzwList.forEach((yzw) => {
              yzw.index = yzw._Idx;
              yzw.name = yzw._Name;
            });
            console.log(self.yzwList);
          }
        }
      });
    },
    // 设置预置位
    setPresetPos(presetPos) {
      let self = this;
      let params = {
        puid: self.currentCamera.puid,
        idx: self.currentCamera.Idx,
        presetPos: presetPos,
      };
      if (!self.getCurrentWindowState.playing) return;
      this.$webcu2plugin.setPresetPos(params).then((rv)=>{
        console.log(rv);
      });
    },
    // 前往预置位
    moveToPresetPos() {
      let self = this;
      let params = {
        puid: self.currentCamera.puid,
        idx: self.currentCamera.Idx,
        presetPos: self.PresetPosIndex,
      };
      console.log(params);
      if (!self.getCurrentWindowState.playing) return;
      this.$webcu2plugin.moveToPresetPos(params).then((rv)=>{
        console.log(rv);
      });
    },
    // 前往原始预置位
    gotoOriginalPresetPos() {
      let params = {
        puid: "",
        idx: "",
      };
      this.$webcu2plugin.gotoOriginalPresetPos(params).then((rv)=>{
        console.log(rv);
      });
    },
    moveUp() {},
    movedown() {},
    //
  },
};
</script>

<style lang='scss' scoped>
// 预置位
.presetpos {
  height: 164px;
  padding-top: 5px;

  ul {
    height: 100%;
    overflow-y: scroll;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      line-height: 2;
      padding-left: 20px;

      span {
        .set {
        }
      }

      .tools {
        i {
          margin: 0 2px;

          &:hover {
            cursor: pointer;
            color: #00a2fe;
          }
        }
      }

      &.active {
        background: rgba(145, 145, 145, 0.4);
      }
    }
  }

  .control {
    height: 32px;
    background-color: rgba(0, 158, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: flex-end;

    i {
      width: 20px;
      height: 20px;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 15px;

      &:hover {
        cursor: pointer;
      }

      $control-list: refresh, down, up, set;

      @for $i from 1 through length($control-list) {
        $name: nth($control-list, $i);

        &.#{$name} {
          background-image: url("~@/assets/icons/yzw_#{$name}.svg");
        }
      }
    }
  }
}
</style>