<template>
  <div class="vstack sidebar">

    <div>peer.school</div>

    <div>
      <div v-if="!state.teacher">
        <app-video
          v-if="!state.teacher && state.teacherStream"
          :stream="state.teacherStream"
          class="peer peer-teacher"
        />
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

