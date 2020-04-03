<template>
  <div class="vstack sidebar">

    <div v-if="state.useJitsi">
      <app-jitsi></app-jitsi>
    </div>

    <div v-else>
      <app-peer v-if="!state.teacher" :id="state.info.teacherID">
        {{ teacherName }}
      </app-peer>

      <app-peer v-if="state.info.studentID && state.info.studentID !== state.peerID" :id="state.info.studentID" @click="stopVideo">
        {{ studentName }}
        <i v-if="state.teacher" data-f7-icon="person_crop_circle_fill_badge_xmark"></i>
      </app-peer>

      <app-peer :stream="state.stream" @click="editProfile" :active="state.peerID && state.info.studentID === state.peerID">
        {{ name }}
        <i v-if="!hasName" data-f7-icon="pencil"></i>
      </app-peer>
    </div>

    <app-students v-if="state.teacher"/>

    <app-chat class="-fit"/>

    <app-signal v-if="!state.teacher"/>

    <div v-if="state.teacher" class="share">
      <sea-modal :active.sync="active" close :title="l.share.title">
        <app-share></app-share>
      </sea-modal>
      <button @click="active = true" class="btn">
        <i data-f7-icon="square_arrow_up"></i>
        {{ l.share_button }}
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
import { LOCAL_NAME } from '../config'
import { getLocal } from '../lib/local'
import { createLinkForRoom, shareLink } from '../lib/share'
import { setProfileName, setStudent } from '../state'
import SeaButton from '../ui/sea-button'
import SeaModal from '../ui/sea-modal'
import AppChat from './app-chat'
import AppJitsi from './app-jitsi'
import AppPeer from './app-peer'
import AppShare from './app-share'
import AppSignal from './app-signal'
import AppStudents from './app-students'
import AppVideo from './app-video'

const log = require('debug')('app:app-sidebar')

export default {
  name: 'app-sidebar',
  components: {
    AppShare,
    SeaModal,
    SeaButton,
    AppJitsi,
    AppPeer,
    AppStudents,
    AppSignal,
    AppChat,
    AppVideo,
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    hasName() {
      return this.state.profiles[this.state.peerID]?.name != null || getLocal(LOCAL_NAME) != null
    },
    name() {
      return this.state.profiles[this.state.peerID]?.name || getLocal(LOCAL_NAME) || this.l.set_name
    },
    teacherName() {
      return this.state.profiles[this.state.info.teacherID]?.name || this.l.teacher
    },
    studentName() {
      return this.state.profiles[this.state.info.studentID]?.name || this.l.student
    },
  },
  methods: {
    editProfile() {
      let name = prompt(this.l.what_name, this.hasName ? this.name : '')
      if (name) {
        setProfileName(name)
      }
    },
    doShare() {
      shareLink(createLinkForRoom(this.state.room))
    },
    stopVideo() {
      if (this.state.teacher) {
        setStudent()
      }
    },
  },
  async mounted() {
  },
}
</script>

