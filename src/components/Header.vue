<template>
  <div class="header-wrapper">
    <header>
      <div class="menu-wrapper">
        <router-link to="/real" active-class="selected">实时视频</router-link>
        <router-link to="/history" active-class="selected">历史视频</router-link>
        <router-link to="/elemap" active-class="selected">电子地图</router-link>
      </div>
      <div class="btn-login" @click="dialogVisible=true">登录设置</div>
    </header>
    <el-dialog :visible.sync="dialogVisible" title="登录设置" :modal-append-to-body="false">
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
        <el-button type="primary" @click="setLoginData">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
import { setStorage, getStorage } from "../utils/helper"
export default {
  name: "Header",
  data() {
    return {
      form: {
        address: "47.96.224.81",
        port: 9988,
        user: "admin",
        password: "",
        epid: "system",
        fixaddr: 0,
        serverHost:'172.22.93.1:9581'
      },
      dialogVisible: false,
    };
  },
  mounted() {
    this.loginDataInit()
    this.autoLogin()
  },
  methods: {
    // 登录数据初始化
    loginDataInit() {
      let loginData = getStorage('loginData')
      if(loginData) {
        this.form = loginData
      }
    },
    // 自动登录
    autoLogin() {
      let params = JSON.parse(JSON.stringify(this.form))
      console.log(params)
      this.$webcu2plugin.login(params,this.eventCallback).then((rv)=>{
        console.log(rv);
        if (rv.msg == "OK") {
          let token = rv.token;
          this.token = token;
          this.$store.commit("setToken", token); // token存储到vuex中
          this.$store.dispatch("device/startFetchDevice");
        } else {
          this.$message.warning(rv.msg);
        }
      })
    },
    // ws回调函数
    eventCallback(params) {
      console.log(params);
      if (params.type === "playEvent") {
        // 播放视频的状态
        let { status, playID, statusText } = params.data;
        this.$bus.$emit("playEvent", { status, playID, statusText });
      }
    },
    // 设置登录参数
    setLoginData() {
      setStorage('loginData',this.form)
      this.dialogVisible = false
      this.autoLogin()
    }
  }
};
</script>

<style scoped lang="scss">
.header-wrapper {
  height: 50px;
  border: none;
  background-color: rgb(0, 88, 129);
  header {
    height: 50px;
    min-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 100px;
    .menu-wrapper {
      a {
        display: inline-block;
        width: 100px;
        padding: 13px 0;
        color: white;
        font-weight: 600;
        border-bottom: 2px transparent solid;
        text-align: center;
        span:nth-child(1){
          margin-right: 2px;
          transition: all 0.5s ease-in-out;
        }
      }
      a:hover {
        border-bottom: 2px #FF981A solid;
        text-decoration: none;
        span:nth-child(1) {
          color: #FF981A;
          margin-right: 20px;
          transition: all 0.5s ease-in-out;
        }
      }
      .selected {
        border-bottom: 2px #FF981A solid;
        span:nth-child(1) {
          color: #FF981A;
          margin-right: 20px;
          transition: all 0.5s ease-in-out;
        }
      }
    }
    .btn-login {
      margin-left: auto;
      cursor: pointer;
    }
    .btn-login:hover {
      color: #FF981A;
    }
  }
}
</style>