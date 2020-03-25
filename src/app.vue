<template>
  <app-main class="app"/>
</template>

<script>
import AppMain from './components/app-main'

export default {
  name: 'App',
  components: {
    AppMain,
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
