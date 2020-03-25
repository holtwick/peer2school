<template>
  <div class="vstack sidebar">

    <div>

      <app-peer
        v-if="!state.teacher"
        :id="state.info.teacherID"
      >
        {{ teacherName }}
      </app-peer>

      <app-peer
        :stream="state.stream"
        class="peer peer-student"
        title="You"
      >
        <button @click="editProfile">
          {{ name }}
          <i v-if="!hasName" data-f7-icon="pencil"></i>
        </button>
      </app-peer>

      <!--      <div v-if="!state.teacher" title="Teacher">-->
      <!--        <app-video-->
      <!--          v-if="!state.teacher && state.teacherStream"-->
      <!--          :stream="state.teacherStream"-->
      <!--          class="peer peer-teacher"-->
      <!--        />-->
      <!--        <div v-else class="peer peer-teacher peer-placeholder -content-placeholder">-->
      <!--          <i data-f7-icon="rectangle_stack_person_crop"></i>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      {{ state.info.studentID }}-->
      <!--      <div v-for="p in state.peers">-->
      <!--        <app-video-->
      <!--          :stream="state.streams[p]"-->
      <!--          class="peer peer-student"-->
      <!--        />-->
      <!--      </div>-->

      <!--      <div @click="editProfile" title="This is you :)">-->
      <!--        <app-video-->
      <!--          :stream="state.stream"-->
      <!--          class="peer peer-self"-->
      <!--        />-->
      <!--      </div>-->
    </div>

    <app-students v-if="state.teacher"/>

    <app-chat class="-fit"/>

    <app-signal v-if="!state.teacher"/>

    <div v-if="state.teacher" class="share">
      <button @click="doShare" class="btn">
        <i data-f7-icon="square_arrow_up"></i>
        Share with students
      </button>
    </div>

  </div>
</template>

<style lang="scss">
.sidebar {
  max-width: 20%;
  width: 16rem;
  background: #eee;
  padding: 1rem;
  margin: 1rem;
  box-shadow: rgba(15, 15, 15, 0.2) 0 9px 24px;;

  .btn {
    border-radius: 0.25rem;
    background: green;
    color: white;
    padding: 0.5rem;
    display: block;
    width: 100%;
  }
}
</style>

<script>
import { createLinkForRoom, shareLink } from '../lib/share'
import { setProfileName } from '../state'
import AppChat from './app-chat'
import AppPeer from './app-peer'
import AppSignal from './app-signal'
import AppStudents from './app-students'
import AppVideo from './app-video'

const log = require('debug')('app:app-sidebar')

export default {
  name: 'app-sidebar',
  components: {
    AppPeer,
    AppStudents,
    AppSignal,
    AppChat,
    AppVideo,
  },
  data() {
    return {}
  },
  computed: {
    hasName() {
      return this.state.profiles[this.state.peerID]?.name != null
    },
    name() {
      return this.state.profiles[this.state.peerID]?.name || 'Set your name'
    },
    teacherName() {
      return this.state.profiles[this.state.info.teacherID]?.name || 'Teacher'
    },
  },
  methods: {
    editProfile() {
      let name = prompt('What\'s your name?')
      if (name) {
        setProfileName(name)
      }
    },
    doShare() {
      shareLink(createLinkForRoom(this.state.room))
    },
  },
  async mounted() {
  },
}
</script>

