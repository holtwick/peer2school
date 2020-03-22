<template>
  <div class="vstack sidebar">
    <div>
      <div v-if="!state.teacher">
        <app-video v-if="!state.teacher && state.teacherStream"
                   :stream="state.teacherStream"
                   class="peer peer-teacher"/>
      </div>

      <div @click="editProfile">
        <app-video
          :stream="state.stream"
          class="peer peer-self"
        />
      </div>
    </div>

    <div class="-scrollable -fit">
      students
      <app-students v-if="state.teacher"/>
      chat
      <app-chat/>
      <app-signal v-if="!state.teacher"/>

      {{state}}
    </div>

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
  computed: {
    teacherStream() {
      log('teacherstream')
      try {
        log('xxddd00', this.state.peers)
        let peer = this.state.peers[this.state.info.teacherID]
        log('teacher', peer)
        return peer.stream
      } catch (e) {

      }
    },
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

