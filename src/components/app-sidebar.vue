<template>
  <div class="vstack sidebar">

    <!--    <div>peer.school</div>-->

    <div>
      <div v-if="!state.teacher">
        <app-video
          v-if="!state.teacher && state.teacherStream"
          :stream="state.teacherStream"
          class="peer peer-teacher"
        />
        <div v-else class="peer peer-teacher peer-placeholder -content-placeholder">
          <i data-f7-icon="person"></i>
        </div>
      </div>

      <div @click="editProfile">
        <app-video
          :stream="state.stream"
          class="peer peer-self"
        />
      </div>
    </div>

    <app-students v-if="state.teacher"/>

    <app-chat class="-fit"/>

    <app-signal v-if="!state.teacher"/>

  </div>
</template>

<style lang="scss">
.sidebar {
  max-width: 20%;
  width: 16rem;
  background: #eee;
  padding: 1rem;

  .peer {
    background: #333;
    width: 100%;
    max-height: 20rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
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
import { setProfileName } from '../state'
import AppChat from './app-chat'
import AppSignal from './app-signal'
import AppStudents from './app-students'
import AppVideo from './app-video'

const log = require('debug')('app:app-sidebar')

export default {
  name: 'app-sidebar',
  components: {
    AppStudents,
    AppSignal,
    AppChat,
    AppVideo,
  },
  data() {
    return {
      username: '',
    }
  },
  methods: {
    editProfile() {
      let name = prompt('Wie heißt du?')
      if (name) {
        setProfileName(name)
      }
    },
  },
  async mounted() {
  },
}
</script>

