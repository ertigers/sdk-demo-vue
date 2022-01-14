<template>
  <div style="position: absolute; left: 150px;z-index:99">
    <el-button @click="dialogVisible = true">登录平台</el-button>
    <el-dialog :visible.sync="dialogVisible" title="登录" :modal-append-to-body="false">
      <el-form label-width="80px" :model="form">
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="form.port"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="form.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="epid">
          <el-input v-model="form.epid"></el-input>
        </el-form-item>
        <el-form-item label="透过网闸">
          <el-input v-model="form.fixaddr" placeholder="1:透过网闸，0:不透过"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login">登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { api } from "../api";
export default {
  components: {},
  data() {
    return {
      form: {
        address: "47.96.224.81",
        port: 9988,
        user: "admin",
        password: "",
        epid: "system",
        fixaddr: 0,
      },
      dialogVisible: false,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    login() {
      let self = this;
      this.$api("login", self.form)
        .then((rv) => {
          if (rv.msg == "OK") {
            let token = rv.token;
            self.token = token;
            self.$store.commit("setToken", token);
            self.dialogVisible = false;
          } else {
            self.$message.warning(rv.msg);
          }
        })
        .finally(() => {
          self.$store.dispatch("device/startFetchDevice");
          self.initWebSocket();
        });
    },
    initWebSocket() {
      let self = this;
      let wsUrl = "ws://127.0.0.1:9585?token=" + this.token;
      let webSocket = new WebSocket(wsUrl);
      webSocket.onmessage = function (e) {
        if (e.data) {
          let data = self.$x2js.xml2js(e.data);
          self.handleEvent(data);
        }
      };
      webSocket.onclose = function () {
        console.warning("ws closed");
      };
      webSocket.onopen = function () {
        console.log("ws connected");
      };
      // 连接发生错误的回调方法
      webSocket.onerror = function () {
        console.error("ws connected error");
      };
    },
    handleEvent(data) {
      let self = this;
      let type = data.M.Type;
      let status = data.M.Status;
      let playID = data.M.PlayID;

      if (type === "PlayEvent") {
        let statusText = "";
        if (status === "1") {
          statusText = "连接中~";
        }
        if (status === "2") {
          // statusText = "播放中~";
        }
        if (status === "3") {
          statusText = "播放完成~";
        }
        if (status === "4") {
          statusText = "播放失败~";
        }
        self.$bus.$emit("playEvent", { status, playID, statusText });
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