<template>
  <el-tabs v-model="activeName" class="ptz-container">
    <el-tab-pane label="云台控制" name="yt">
      <ptz></ptz>
    </el-tab-pane>
    <!-- <el-tab-pane label="报警控制" name="bj"><alarm></alarm></el-tab-pane> -->
  </el-tabs>
</template>

<script>
import ptz from "./ptz_control/ptz.vue";
import alarm from "./ptz_control/alarm.vue";
export default {
  components: { ptz, alarm },
  data() {
    return {
      activeName: "yt",
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