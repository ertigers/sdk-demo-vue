<template>
  <el-tabs v-model="activeName" class="device-control">
    <el-tab-pane label="预置位" name="yzw">
      <yzw></yzw>
    </el-tab-pane>
    <!-- <el-tab-pane label="视频巡航" name="spxh"><spxh></spxh></el-tab-pane>
    <el-tab-pane label="辅助设备" name="fzsb"><fzsb></fzsb></el-tab-pane> -->
  </el-tabs>
</template>

<script>
import yzw from "./device_control/yzw.vue";
import spxh from "./device_control/spxh.vue";
import fzsb from "./device_control/fzsb.vue";
export default {
  components: { yzw, spxh, fzsb },
  data() {
    return {
      activeName: "yzw",
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