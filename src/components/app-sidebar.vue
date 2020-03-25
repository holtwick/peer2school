<template>
  <div class="vstack sidebar">

    <div>
      <div v-if="!state.teacher" title="Teacher">
        <app-video
          v-if="!state.teacher && state.teacherStream"
          :stream="state.teacherStream"
          class="peer peer-teacher"
        />
        <div v-else class="peer peer-teacher peer-placeholder -content-placeholder">
          <i data-f7-icon="rectangle_stack_person_crop"></i>
        </div>
      </div>

      {{ state.info.studentID }}
      <div v-if="state.info.studentID">
        <app-video
          :id="state.info.studentID"
          class="peer peer-student"
        />
      </div>

      <div @click="editProfile" title="This is you :)">
        <app-video
          :stream="state.stream"
          class="peer peer-self"
        />
      </div>
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

  .btn {
    border-radius: 0.25rem;
    background: green;
    color: white;
    padding: 0.5rem;
    display: block;
    width: 100%;
  }

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
import { createLinkForRoom, shareLink } from '../lib/share'
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
    doShare() {
      shareLink(createLinkForRoom(this.state.room))
    }
  },
  async mounted() {
  },
}
</script>

