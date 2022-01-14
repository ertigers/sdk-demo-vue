<template>
  <div class="icon">
    <img
      :src="icons[icon]"
      :style="{ width: size + 'px', height: size + 'px' }"
    />
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "QxIcon",
  props: {
    icon: {
      type: String,
      default: "device_online",
    },
    size: {
      type: Number,
      default: 32,
    },
  },
  data: () => {
    return {
      icons: {
        device_online: require("../assets/icons/device_online.svg"), //设备在线
        device_offline: require("../assets/icons/device_offline.svg"), //设备离线
        camera_usable: require("../assets/icons/camera_usable.svg"), //摄像头可用
        camera_unusable: require("../assets/icons/camera_unusable.svg"), //摄像头不可用
      },
    };
  },
  mounted() {
    
  },
};
</script>
<style scoped lang="scss">
.icon {
  img {
    margin-right: 10px;
  }
}
</style>
