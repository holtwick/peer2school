<template>
  <div class="vstack sidebar text">
    <!--        <app-video v-for="peer in state.peers" :key="peer" :id="peer" class="peer"/>-->

    <!--    <form @submit.prevent.stop="setUsername" class="account-wrapper">-->
    <!--      <input type="text" v-model="username" placeholder="Name" />-->
    <!--      <input type="submit" value="Save"/>-->
    <!--    </form>-->
    <!--    <br />-->

    <div v-if="!state.teacher">
      <app-video v-if="!state.teacher && state.teacherStream"
                 :stream="state.teacherStream"
                 class="peer peer-teacher"/>
    </div>

    <div>
      <app-video :stream="state.stream" class="peer peer-self"/>
    </div>

    <!--    <hr />-->
    <!--    <ul class="other-streams">-->
    <!--      <div v-if="!state.teacher">-->
    <!--        <li v-for="peer in state.status">-->
    <!--          <div v-if="state.teacherStreams.find(s => s === peer.remote)" class="peer-name">{{ getPeerNameBySenderId(peer.remote) }}</div>-->
    <!--          <app-video v-if="state.teacherStreams.find(s => s === peer.remote)" :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>-->
    <!--          <app-video v-else :key="peer.remote" :stream="peer.peer.stream" :visible="false" class="peer"/>-->
    <!--        </li>-->
    <!--      </div>-->
    <!--      <div v-else>-->
    <!--        <li v-for="peer in state.status">-->
    <!--          <div class="peer-name">{{ getPeerNameBySenderId(peer.remote) }}</div>-->
    <!--          <app-video :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>-->
    <!--        </li>-->
    <!--      </div>-->
    <!--    </ul>-->
    <!--    <br />-->
    <!--    <app-peer-list/>-->

    <slot></slot>
    <br/>
    <app-chat/>
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
import AppChat from './app-chat'
import AppPeerList from './app-peer-list'
import AppVideo from './app-video'

const log = require('debug')('app:app-sidebar')

export default {
  name: 'app-sidebar',
  components: {
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
    // getPeerNameBySenderId(senderId) {
    //   // return getPeerNameBySenderId(senderId);
    // },
    // setUsername() {
    //   // setPeerName(this.username);
    // },
  },
  async mounted() {
  },
}
</script>

