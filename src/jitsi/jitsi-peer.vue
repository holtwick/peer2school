<template>
  <div class="peer" :class="{'-active': active}" @click="$emit('click')">
    <jitsi-video
      :stream="stream || state.streams[id]"
      :audioStream="stream ? null : state.audioStreams[id]"
      class="video"
    />
    <div class="peer-footer" v-if="slotted">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
@import "../css/variables";

.peer {
  color: white;
  /*background: #333;*/
  width: 100%;
  max-height: 20rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  /*border-radius: 0.25rem;*/
  // border: 0.0625rem solid #333;

  &.-active {
    border-radius: 0.25rem;
    box-shadow: 0 0 0 $px-2 rgba(0, 126, 217, 0.76);
  }

  &:hover {
    opacity: 0.8;
  }

  .video {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .peer-footer {
    color: white;
    background: #333;
    margin-top: 0.0625rem;
    text-align: center;
    padding: 0.25rem;
    white-space: nowrap;
    border-radius: 0 0 0.25rem 0.25rem;
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
import JitsiVideo from './jitsi-video'

export default {
  name: 'jitsi-peer',
  components: { JitsiVideo },
  props: {
    id: {
      type: String,
      default: null,
    },
    stream: {
      type: MediaStream | Object,
      default: null,
    },
    audioStream: {
      type: MediaStream | Object,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    slotted() {
      return this.$slots?.default?.[0] != null
    },
  },
  methods: {},
  async mounted() {
  },
}
</script>

