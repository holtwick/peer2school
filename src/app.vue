<template>
  <span v-if="state.teacher">
    <app-teacher id="app" class="app"/>
  </span>
  <span v-else>
    <app-main id="app" class="app"/>
  </span>
</template>

<script>

import AppMain from './components/app-main'
import AppTeacher from './components/app-teacher'


export default {
  name: 'App',
  components: { AppMain, AppTeacher },
}
</script>

<style lang="scss">
@import "css/index";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
