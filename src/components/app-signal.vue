<template>
  <div class="signal" :class="{ '-active': active }">
    <button @click="toggleSignal" type="submit">
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
import { setSignal } from '../state'

export default {
  name: 'app-signal',
  data() {
    return {
      active: false,
    }
  },

  methods: {
    toggleSignal() {
      this.active = !this.active
      setSignal(this.active)
    },
  },
  async mounted() {
  },
}
</script>

