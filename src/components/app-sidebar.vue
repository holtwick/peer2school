<template>
  <div class="vstack sidebar text">
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

    <slot></slot>
    <br/>
    <app-chat/>
    <app-signal/>
  </div>
</template>

<style lang="scss">
.other-streams {
  margin: 0 !important;

  li {
    list-style-type: none;
    margin: 0;

    div.peer-name {
      background: #ffffff;
      width: 100%;
      text-align: center;
    }

    video.peer {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      margin-bottom: 0;
    }
  }
}

.account-wrapper {
  input {
    float: left;

    &[type="text"] {
      width: 70%;
      margin-right: 3%;
    }

    &[type="submit"] {
      width: 27%;
    }
  }
}

.sidebar {
  width: 20%;
  min-width: 8rem;
  background: #eee;
  padding: 1rem;
}
</style>

<script>
import { setProfileName } from '../state'
import AppChat from './app-chat'
import AppPeerList from './app-peer-list'
import AppSignal from './app-signal'
import AppVideo from './app-video'

const log = require('debug')('app:app-sidebar')

export default {
  name: 'app-sidebar',
  components: {
    AppSignal,
    AppPeerList,
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

