<template>
  <div class="point" :class="{ '-active': active }">
    <button v-if="!state.teacher" @click="pointOut" type="submit">
      <img src="../assets/img/aufzeigen.png">
    </button>
    <div v-else>
      Signals
      {{state.signals}}
    </div>
  </div>
</template>

<style lang="scss">
.point {
  margin-top: 1rem;

  &.-active {
    background: orange;
  }
}
</style>

<script>
import { sendPointOut } from '../state'

export default {
  name: 'app-signal',
  data() {
    return {
      active: false,
    }
  },
  methods: {
    pointOut() {
      this.active = !this.active
      sendPointOut(this.active)
    },
  },
  async mounted() {
  },
}
</script>

