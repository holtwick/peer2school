<!-- Copyright (c) 2019 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright -->

<template>
  <div class="hstack">
    <app-sidebar></app-sidebar>
    <app-whiteboard class="-fit"></app-whiteboard>
  </div>
</template>

<style lang="scss">

.peer {
  background: #333;
  width: 100%;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

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

