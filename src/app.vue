<template>
  <div id="app">
    <app-main></app-main>
  </div>
</template>

<script>

import AppMain from './components/app-main'

export default {
  name: 'App',
  components: { AppMain },
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
