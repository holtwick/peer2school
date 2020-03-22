<template>
  <div class="point" :class="{ '-active': active }">
    <button v-if="!state.teacher" @click="pointOut" type="submit">
      <img src="../assets/img/aufzeigen.png" ref="pointPic">
    </button>
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
  name: 'app-pointout',
  data() {
    return {
      active: false,
    }
  },
  methods: {
    pointOut() {
      let pic = this.$refs.pointPic
      if (!this.active) {
        pic.style.backgroundColor = 'orange'
        this.active = true
      } else {
        pic.style.backgroundColor = ''
        this.active = false
      }
      sendPointOut(this.active)
    },
  },
  async mounted() {
  },
}
</script>

