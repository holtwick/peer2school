<template>
  <y-whiteboard ref="whiteboard"></y-whiteboard>
</template>

<style lang="scss"></style>

<script>
import { defineWhiteboard } from 'y-webcomponents'
import { sync } from '../state'

defineWhiteboard()

export default {
  name: 'app-whiteboard',
  components: {},
  data() {
    return {}
  },
  methods: {},
  async mounted() {
    this.$refs.whiteboard.setState({ type: sync.whiteboard })
  },
}
</script>

