<template>
  <div class="students">
    <div
      class="student"
      v-for="student of students"
      :key="student.id"
      :class="{ '-active': student.active }"
      @click="doShowStudent(student.id, false)"
      title="Click to show student to the class"
    >
      {{ student.name }}
      <i data-f7-icon="videocam_circle_fill" class="video-info"></i>
      <!--      <button @click="doShowStudent(student.id, true)">wb</button>-->
    </div>
  </div>
</template>

<style lang="scss">
.students {
  margin-bottom: 1rem;

  .student {
    font-size: 0.8rem;
    cursor: pointer;

    .video-info {
      opacity: 0;
    }

    &:hover {
      color: blue;

      .video-info {
        opacity: 1;
      }
    }

    &:before {
      display: inline-block;
      content: ' ';
      height: 0.5rem;
      width: 0.5rem;
      background: gray;
      border-radius: 1rem;
      margin-right: 0.25rem;
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

    &.-active {
      font-weight: bold;

      &:before {
        background: red;
        animation: blink 1000ms infinite;
      }
    }
  }
}
</style>

<script>
import { setStudent } from '../state'

export default {
  name: 'app-students',
  data() {
    return {}
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
    doShowStudent(peerID, allowWhiteboard) {
      setStudent(peerID, allowWhiteboard)
    },
  },
  async mounted() {
  },
}
</script>

