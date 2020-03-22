<template>
  <app-teacher v-if="state.teacher" class="app"/>
  <app-student v-else class="app"/>
</template>

<script>
import AppStudent from './components/app-student'
import AppTeacher from './components/app-teacher'

export default {
  name: 'App',
  components: {
    AppStudent,
    AppTeacher,
  },
}
</script>

<style lang="scss">
@import "css/index";

.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
