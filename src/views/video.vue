<template>
  <el-container class="video-container">
    <aside-content></aside-content>
    <login></login>
    <video-layout> </video-layout>
  </el-container>
</template>

<script>
import asideContent from "../components/aside.vue";
import videoLayout from "../components/video_layout.vue";
import login from "./login.vue"
export default {
  components: { asideContent, videoLayout,login },
  data() {
    return {
      token: "",
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    window.vue = this;
    this.login();
  },
  methods: {
    login() {
      let params = {
        address: "47.96.224.81",
        port: 9988,
        user: "admin",
        password: "",
        epid: "system",
        fixaddr: 0,
      };
      this.$api("login", params,this.eventCallback)
        .then((rv) => {
          console.log(rv);
          if (rv.msg == "OK") {
            let token = rv.token;
            this.token = token;
            this.$store.commit("setToken", token);  // token存储到vuex中
            this.$store.dispatch("device/startFetchDevice");
          } else {
            this.$message.warning(rv.msg);
          }
        })
    },
    eventCallback(params) {
      console.log(params);
      if(params.type === 'playEvent') {  // 播放视频的状态
        let { status,playID,statusText } = params.data
        this.$bus.$emit("playEvent", { status, playID, statusText });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>