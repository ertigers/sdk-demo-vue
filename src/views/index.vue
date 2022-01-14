<template>
  <div class="home">
    <Header />
    <router-view />
  </div>
</template>

<script lang="js">
import Header from "../components/Header.vue";
export default {
  name: "",
  components: {
    Header,
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>