<template>
  <div class="device">
    <el-scrollbar>
      <el-tree
        ref="deviceTree"
        :data="deviceList"
        :props="defaultProps"
        node-key="id"
        highlight-current
        :filter-node-method="filterTreeNode"
        @node-click="treeNodeClick"
        :default-expanded-keys="defaultExpandedKeys"
        lazy
        :load="loadNode"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
          style="width: calc(100% - 50px); height: 100%"
          @dblclick="handleNodeDBClick(node)"
          :class="{ offline: !checkNodeState(node) }"
        >
          <qx-icon :size="20" :icon="checkSourceType(node)"></qx-icon>
          <span style="width: 80%; overflow: hidden" :title="node.label">{{
            node.label
          }}</span>
          <span v-if="data.treeType == 'root'"
            >({{ onlineNum }}/{{ allNum }})</span
          >
          <!-- <span v-if="data.treeType == 'root'"
            >({{ getDeviceStatistics().online }}/{{ getDeviceStatistics().total }})</span
          > -->
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import qxIcon from "./qx_icon.vue";
import { mapGetters } from "vuex";
export default {
  components: { qxIcon },
  data() {
    return {
      activeName: "device",
      deviceTree: [],
      defaultProps: {
        children: "children",
        label: "Name",
        isLeaf: "leaf",
      },
      defaultExpandedKeys: [],
      onlineNum: 0,
      allNum: 0,
      currentNode: null,
      currentTreeNodeId: "",
    };
  },
  computed: {
    ...mapGetters({
      checkPlayState: "playvideo/checkPlayState",
      getCurrentWindowState: "playvideo/getCurrentWindowState",
    }),
    deviceList() {
      return this.$store.state.device.deviceList;
    },
    currentWindow() {
      this.$store.state.playvideo.currentWindow;
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    loadNode(node, resolve) {
      console.log(node);
      if (node.level === 0) {
        return resolve(node.data);
      }
      if (node.data.$ && !node.data.Idx) {
        this.fetchRes(node.data, resolve);
      }
    },
    // 查询子资源
    fetchRes(data, resolve) {
      this.$webcu2plugin.getDeviceByPuid({ puid: data.$ }).then((rv)=>{
        if (rv.Res) {
          let camera = [];
          for (let r of rv.Res) {
            let res = {
              puid: rv.PUID,
              res: rv.Res,
            };
            this.$store.commit("device/addRes", res);
            if (r.Type == "IV") {
              r.leaf = true;
              r.puid = rv.PUID;
              r.treeType = "res";
              camera.push(r);
            }
          }
          resolve(camera);
        } else {
          resolve([]);
        }
      })
    },
    filterTreeNode(value, data, node) {
      if (!value) return true;
      return data.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      // if (data.treeType && data.treeType == "device") {
      //   // 设备
      //   if (data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
      //     this.filterDeviceList.push(data);
      //     return true;
      //   }
      // } else {
      //   // 子资源
      //   return this.filterDeviceList.find((dv) => {
      //     return dv.puid == data.puid;
      //   });
      // }
    },
    treeNodeClick(data) {
      this.$bus.$emit("treeNodeClick", data);
    },
    // 摄像头双击
    handleNodeDBClick(node) {
      console.log(node);
      let self = this;
      if (node.data.Type != "IV" && node.data.Usable != "1") return;
      self.$bus.$emit("startPlayVideo", node);
    },
 
    // 判断设备子资源图标
    checkSourceType(node) {
      let self = this;
      let type = node.data.Type;
      let state = self.checkNodeState(node);
      let current = false;

      if (
        (self.currentTreeNodeId && self.currentTreeNodeId == node.data.id) ||
        (!self.currentTreeNodeId &&
          self.currentNode &&
          self.currentNode.data &&
          self.currentNode.data.id == node.data.id)
      ) {
        current = true;
      } else {
        current = false;
      }
      if (node.data.id == "root") {
        return "root";
      }
      //  if (self.currentTreeNodeId == node.data.id) {
      //   return "camera_current";
      // }
      if (node.data.treeType == "device") {
        // 设备
        return state
          ? current
            ? "device_current"
            : "device_online"
          : "device_offline";
      } else if (node.data.treeType == "res") {
        // 子资源
        switch (type) {
          case "IV":
            return state
              ? current
                ? "camera_usable"
                : "camera_usable"
              : "camera_unusable";
            break;
        }
      }
    },
    // 判断设备是否在线/子资源是否可用
    checkNodeState(node) {
      if (node.data.treeType && node.data.treeType == "device") {
        if (node.data.treeType == "root" || node.data.treeType == "root") {
          return true;
        }
        // 设备
        return node.data.OnlineFlag == 1;
      } else {
        // 子资源
        if (node.parent.data.OnlineFlag == 1) {
          return node.data.Usable == 1;
        } else {
          return false;
        }
      }
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
/deep/ {
  .el-input {
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #fff;
    }

    .el-input__icon {
      line-height: 32px;
    }
  }

  .el-scrollbar {
    height: 100%;
  }

  .el-tree {
    margin-top: 10px;
    background-color: transparent;
    margin-top: 10px;

    .el-tree-node__content:hover {
      background-color: transparent;
    }

    .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent;
    }

    .el-tree-node.is-current > .el-tree-node__content {
      background-color: transparent;
    }
  }
}
.device {
  height: 100%;
}
</style>