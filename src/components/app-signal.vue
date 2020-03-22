<template>
  <button
    @click="toggleSignal"
    class="signal"
    :class="{ '-active': active }"
  >
    <img src="../assets/img/aufzeigen.png">
  </button>
</template>

<style lang="scss">
.signal {
  display: inline-block;
  margin-top: 1rem;
  border-radius: 0.25rem;
  background: #dedede;
  padding: 0.5rem;

  img {
    display: inline-block;
    background: transparent;
  }

  &:hover {
    background: #ccc;
  }

  &.-active {
    background: rgba(255, 165, 0, 0.4);
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

