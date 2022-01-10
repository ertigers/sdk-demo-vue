<template>
  <el-aside>
    <ptz-control></ptz-control>
    <device-control></device-control>
    <device-list></device-list>
    <!-- <el-button @click="login">登录</el-button> -->
  </el-aside>
</template>

<script>
import ptzControl from "./aside/ptz_control.vue";
import deviceControl from "./aside/devide_control.vue";
import deviceList from "./aside/device_list.vue";
export default {
  components: { ptzControl, deviceControl, deviceList },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {},
};
</script>

<style lang='scss' scoped>
</style>