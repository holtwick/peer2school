<template>
  <div class="hstack">
    <canvas class="-fit" id="whiteboard" resize></canvas>
    <div class="">
      <mainPanel></mainPanel>
      <historyPanel></historyPanel>
    </div>
  </div>
</template>

<script>
import paper from 'paper'
import HistoryPanel from './panel/HistoryPanel'
import MainPanel from './panel/MainPanel'

export default {
  components: {
    mainPanel: MainPanel,
    historyPanel: HistoryPanel,
  },
  created() {
    paper.install(window)
  },
  mounted() {
    paper.setup('whiteboard')
  },
}
</script>


<style lang="scss">
canvas {
  /*height: 100vh;*/
  /*width: 100%;*/
  /*background: red;*/
}
</style>
