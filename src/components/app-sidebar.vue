<template>
  <div class="bg-gray-200 shadow p-3 overflow auto h-screen">
    <form class="flex rounded p-3 bg-white shadow mb-3" @submit.prevent.stop="setUsername">
      <input class="flex-grow border-gray-200 border p-2 bg-gray-200 border rounded shadow-inner mr-3"
             type="text"
             v-model="username"
             placeholder="Name" />
      <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow text-white"
              type="submit">
        <font-awesome-icon icon="save" />
      </button>
    </form>
    <app-video :stream="state.stream" :visible="true" class="rounded my-2 shadow"/>
    <div class="overflow-auto bg-white rounded px-4 my-3 shadow" v-if="state.status.length">
      <ul class="list-reset">
        <div class="flex flex-wrap -mx-2" v-if="!state.teacher">
          <li class="my-2 w-1/2 px-1" v-for="peer in state.status">
            <div class="rounded shadow relative overflow-hidden">
              <div class="absolute pin-b border-t border-blue-600 bg-blue-500 text-white bottom-0 w-full truncate px-1 text-center" v-if="state.teacherStreams.find(s => s === peer.remote)">{{ getPeerNameBySenderId(peer.remote) }}</div>
              <app-video v-if="state.teacherStreams.find(s => s === peer.remote)"
                      :key="peer.remote"
                      :stream="peer.peer.stream"
                      :visible="true" class="rounded my-2 shadow"/>
              <app-video v-else :key="peer.remote" :stream="peer.peer.stream" :visible="false" class="peer"/>
            </div>
          </li>
        </div>
        <div class="flex flex-wrap -mx-2" v-else>
          <li class="my-2 w-1/2 px-1" v-for="peer in state.status">
            <div class="rounded shadow relative overflow-hidden">
              <div class="absolute pin-b border-t border-blue-600 bg-blue-500 text-white bottom-0 w-full truncate px-1 text-center">{{ getPeerNameBySenderId(peer.remote) }}</div>
              <app-video :key="peer.remote" :stream="peer.peer.stream" :visible="true" class="peer"/>
            </div>
          </li>
        </div>
      </ul>
    </div>
    <app-peer-list/>
    <slot></slot>
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
import AppVideo from './app-video'
import {getPeerNameBySenderId, setPeerName} from '../state';
import AppPeerList from './app-peer-list';

export default {
  name: 'app-sidebar',
  components: {
    AppPeerList,
    AppChat,
    AppVideo,
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    getPeerNameBySenderId(senderId) {
      return getPeerNameBySenderId(senderId);
    },
    setUsername() {
      setPeerName(this.username);
    }
  },
  async mounted() {
  },
}
</script>

