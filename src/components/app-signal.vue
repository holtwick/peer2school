<template>
  <div class="signal" :class="{ '-active': active }">
    <button v-if="!state.teacher" @click="toggleSignal" type="submit">
      <img src="../assets/img/aufzeigen.png">
    </button>
    <div v-else>
      Signals
      {{state.signals}}
      {{state.profiles}}
    </div>
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

