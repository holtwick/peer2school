<template>
  <div class="chat rounded p-3 bg-white shadow">
    <div class="flex flex-wrap">
      <form class="flex-grow lg:mr-3" @submit.prevent.stop="doSend">
        <input class="w-full border-gray-200 border p-2 bg-gray-200 border rounded shadow-inner"
               placeholder="Nachricht senden"
               v-model="message">
      </form>

      <button class="no-shrink px-3 py-1 rounded shadow-lg hover:shadow text-white ml-auto mt-2 lg:mt-0"
              @click="pointOut"
              type="submit"
              :class="[pointsOut ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700']"
      >
        <font-awesome-icon icon="hand-point-up" />
      </button>
    </div>

    <div class="h-32 overflow-y-auto">
      <div class="my-2 flex" v-for="msg in messages">
        <div class="rounded bg-gray-200 shadow-xs px-1 mr-2 self-start">{{ getPeerNameBySenderId(msg.sender) }}:</div> <div class="w-full">{{msg.msg}}</div>
      </div>
      <div v-if="!this.state.chat.length">Noch keine Nachrichten</div>
    </div>
  </div>
</template>

<script>
import {sendChatMessage, getPeerNameBySenderId, sendPointOutInfo} from '../state'

export default {
  name: 'app-chat',
  data() {
    return {
      pointsOut: false,
      message: ''
    }
  },
  computed: {
    messages (){
      return [...this.state.chat].reverse();
    }
  },
  methods: {
    getPeerNameBySenderId(senderId) {
      return getPeerNameBySenderId(senderId);
    },
    doSend() {
      sendChatMessage(this.message)
      this.message = ''
    },
    pointOut() {
      let pic = this.$refs.pointPic
      this.pointsOut = !this.pointsOut;

      sendPointOutInfo(this.pointsOutState)
    },
  },
  async mounted() {

  },
}
</script>

