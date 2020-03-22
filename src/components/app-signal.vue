<template>
  <div class="signal" :class="{ '-active': active }">
    <button @click="toggleSignal">
      <img src="../assets/img/aufzeigen.png">
    </button>
  </div>
</template>

<style lang="scss">
.signal {
  margin-top: 1rem;

  &.-active {
    background: orange;
  }
}
</style>

<script>
import { toggleSignal } from '../state'

export default {
  name: 'app-signal',
  computed: {
    active() {
      return this.state.signals[this.state.peerID] === true
    },
  },
  methods: {
    toggleSignal() {
      toggleSignal()
    },
  },
  async mounted() {
  },
}
</script>

