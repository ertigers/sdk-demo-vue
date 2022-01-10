<template>
  <el-tabs v-model="activeName" class="device-wrap">
    <el-tab-pane label="设备列表" name="device"><device></device> </el-tab-pane>
    <!-- <el-tab-pane label="视频分组" name="deviceGroup"
      ><device-group></device-group
    ></el-tab-pane> -->
    <!-- <el-tab-pane label="视频轮巡" name="spxh"><splx></splx></el-tab-pane> -->
  </el-tabs>
</template>

<script>
import device from "./device_list/device.vue";
import deviceGroup from "./device_list/device_group.vue";
import splx from "./device_list/splx.vue";
export default {
  components: { device, deviceGroup, splx },
  data() {
    return {
      activeName: "device",
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},

  activated() {},
};
</script>

<style lang='scss' scoped>
</style>