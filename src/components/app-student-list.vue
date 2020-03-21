<template>
  <div class="studentList" style="float: right">
    <h3>Student List</h3>
    <div v-for="student in this.pointingUp">{{ student }}</div>
  </div>
</template>

<style lang="scss"></style>

<script>
import { sendChatMessage } from "../state";

export default {
  name: "app-student-list",
  data() {
    return {
      pointingUp: []
    };
  },
  methods: {
    doSend() {
      sendChatMessage(this.message);
      this.message = "";
    },
    pointOut() {}
  },
  watch: {
    "state.chat": function(val) {
      const { msg, sender } = val[val.length - 1];
      if (msg == "*Zeigt auf!*") this.pointingUp.push(sender);
      else if (msg == "*Zeigt nicht mehr auf!*")
        this.pointingUp = this.pointingUp.filter(elem => elem != sender);
    }
  },
  async mounted() {}
};
</script>

