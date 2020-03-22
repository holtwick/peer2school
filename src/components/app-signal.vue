<template>
  <div class="signal" :class="{ '-active': active }">
    <button v-if="!state.teacher" @click="toggleSignal" type="submit">
      <img src="../assets/img/aufzeigen.png">
    </button>
    <div v-else>
      <div class="student"
           v-for="student of students"
           :key="student.key"
           :class="{ '-active': student.active }"
      >
        {{ student.name }}
      </div>
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

.student {
  font-size: 0.8rem;

  &:before {
    content: '-'
  }

  &.-active:before {
    content: '+'
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
  computed: {
    students() {
      return this.state.peers.map(id => {
        return {
          id,
          name: this.state.profiles[id]?.name || 'Unnamed',
          active: this.state.signals[id] === true,
        }
      })
    },
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

