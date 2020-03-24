<template>
  <div class="hstack">
    <canvas class="-fit" id="whiteboard" resize></canvas>
    <div class="anchor">
      <mainPanel></mainPanel>
      <historyPanel></historyPanel>
    </div>
  </div>
</template>

<script>
import paper from 'paper'
import 'vue-slider-component/theme/default.css'
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
.anchor {
  position: relative;
  width: 0;
}

canvas {
  /*height: 100vh;*/
  /*width: 100%;*/
  /*background: red;*/
}
</style>
