<template>
  <div class="peer">
    <app-video
      :stream="state.streams[id]"
    />
    <div class="peer-footer">{{id}}</div>
  </div>
</template>

<style lang="scss">
.peer {
  color: white;
  background: #333;
  width: 100%;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  // border: 0.0625rem solid #333;

  .peer-footer {
    text-align: center;
    padding: 0.25rem;
    white-space: nowrap;
  }

  @keyframes blink {
    from {
      opacity: 1.0;
    }
    50% {
      opacity: 0.5;
    }
    to {
      opacity: 1.0;
    }
  }

  .peer-placeholder {
    min-height: 6rem;

    i {
      font-size: 4rem;
      color: white;
      animation: blink 1000ms infinite;
    }

  }
}
</style>

<script>
import AppVideo from './app-video'

export default {
  name: 'app-peer',
  components: { AppVideo },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {}
  },
  methods: {},
  async mounted() {
  },
}
</script>

