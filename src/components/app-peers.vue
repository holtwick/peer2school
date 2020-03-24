<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="hstack">
    <app-sidebar/>
    <app-whiteboard class="-fit" :editable="state.teacher"/>
  </div>
</template>

<style lang="scss">
</style>

<script>
import AppSidebar from './app-sidebar'
import AppWhiteboard from './app-whiteboard'

export default {
  name: 'app-peers',
  components: {
    AppSidebar,
    AppWhiteboard,
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

