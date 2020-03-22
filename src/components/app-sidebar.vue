<template>
  <div class="vstack sidebar bg-gray-200 shadow p-3">
      <form class="flex rounded p-3 bg-white shadow mb-3" @submit.prevent.stop="setUsername">
        <input class="flex-grow border-gray-200 border p-2 bg-gray-200 border rounded shadow-inner mr-3"
               type="text"
               v-model="username"
               placeholder="Name" />
        <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow text-white"
                type="submit">
          <font-awesome-icon icon="hand-point-up" />
        </button>
      </form>
    <app-video :stream="state.stream" class="rounded my-2 shadow"/>
    <div class="overflow-auto bg-white rounded px-4 my-3 shadow" v-if="state.status.length">
      <ul class="flex flex-wrap -mx-2 list-reset">
        <li class="my-2 w-1/2 px-1 " v-for="peer in state.status" :key="peer.remote">
          <div class="rounded shadow relative overflow-hidden">
            <app-video :key="peer.remote" :stream="peer.peer.stream"/>
            <div class="absolute pin-b border-t border-blue-600 bg-blue-500 text-white bottom-0 w-full truncate px-1 text-center">
              {{ getPeerNameBySenderId(peer.remote) }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <slot></slot>
    <br />
    <app-chat/>
  </div>
</template>

<script>
import AppChat from './app-chat'
import AppVideo from './app-video'
import {getPeerNameBySenderId, setPeerName} from '../state';

export default {
  name: 'app-sidebar',
  components: {
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

