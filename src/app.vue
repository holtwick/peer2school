<template>
  <app-main id="app" class="app"/>
</template>

<script>

import AppMain from './components/app-main'

export default {
  name: 'App',
  components: { AppMain },
}
</script>

<style lang="scss">
@import "css/index";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
