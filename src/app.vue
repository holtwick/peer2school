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

.debug {
  position: fixed;
  width: 2rem;
  height: 2rem;
  bottom: 1rem;
  right: 1rem;
  background-color: red;
  overflow: hidden;
  border: 0.5rem red solid;
  z-index: 99999;

  .debug-content {
    display: none;
    padding: 1rem;
  }

  &:hover,
  &:active,
  &.-show {
    top: 1rem;
    left: 1rem;
    width: auto; // calc(100% - 2rem);
    height: auto; // calc(100% - 2rem);
    bottom: 1rem;
    right: 1rem;
    overflow: auto;
    background: white;

    .debug-content {
      display: block;
    }
  }
}

</style>
