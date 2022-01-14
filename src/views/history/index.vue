<template>
  <div class="container" @mouseleave="mouseleave">hhhhhhhhhhhhhhhhhhhh</div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    mouseleave() {
      console.log('11111111111');
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
}
</style>
