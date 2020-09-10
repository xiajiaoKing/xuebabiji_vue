<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import "./assets/css/main.css";
  @import "./assets/css/color-dark.css";     /*深色主题*/
  @import "./assets/css/button.css";
</style>
