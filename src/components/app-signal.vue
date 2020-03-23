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
  padding-top: 1.5rem;

  img {
    display: inline-block;
    background: transparent;
    transition: transform 250ms;
  }

  &:hover {
    background: #ccc;

    img {
      transform: translateY(-0.5rem);
    }
  }

  @keyframes signal {
    from {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1rem);
    }
    to {
      transform: translateY(0);
    }
  }


  &.-active {
    background: rgba(54, 202, 76, 0.4);

    img {
      animation: signal 1000ms infinite;
    }
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

