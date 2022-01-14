<template>
  <div class="header-wrapper">
    <header>
      <div class="menu-wrapper">
        <router-link to="/real" active-class="selected">实时视频</router-link>
        <router-link to="/history" active-class="selected">历史视频</router-link>
        <router-link to="/elemap" active-class="selected">电子地图</router-link>
        <!-- <router-link to="/login" active-class="selected">登录</router-link> -->
      </div>
    </header>
  </div>
</template>

<script >
export default {
  name: "Header",
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
  }
}
</style>