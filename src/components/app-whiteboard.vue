<template>
  <div class="whiteboard hstack" ref="whiteboard">
    <canvas
      width="4000"
      height="3000"
      ref="canvas"
      class="-fit"
      :class="{
        '-teacher': state.teacher,
        '-editable': editable
      }"
      @mousedown="drawStart"
      @touchstart="touchStart"
      @mouseleave="clearCurrPath"
      @mouseup="clearCurrPath"
      @touchcancel="clearCurrPath"
      @touchend="clearCurrPath"
      @mousemove="moveDraw"
      @touchmove="touchMove"
    />
    <div class="tools" v-if="editable">
      <button
        v-for="c in colorPresets"
        class="color"
        :class="{'-active': c === color}"
        :style="`background: ${c}`"
        @click="color = c"
      />
      <button
        class="tool"
        @click="doTrash">
        <i data-f7-icon="trash"></i>
      </button>
      <button
        class="tool"
        @click="doUndo">
        <i data-f7-icon="arrow_uturn_left"></i>
      </button>
      <button
        class="tool"
        @click="doRedo">
        <i data-f7-icon="arrow_uturn_right"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.whiteboard {
  position: relative;
  display: block;
  touch-action: none;

  &.-editable {
    cursor: crosshair;
  }

  canvas {
    width: 100%;
    align-self: start;

    &.-teacher {
      background-image: radial-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px);
      background-position: 0 0;
      background-size: 2% 2%;

      // Grid
      /*background-image: -webkit-repeating-radial-gradient(center center, rgba(0, 0, 0, .2), rgba(0, 0, 0, .2) 1px, transparent 1px, transparent 100%);*/
      /*background-size: 2% 2%;*/
    }
  }

  .tools {
    /*position: absolute;*/
    /*top: 1rem;*/
    /*right: 1rem;*/

    padding: 1rem;

    .color, .tool {
      display: block;
      border-radius: 2rem;
      height: 2rem;
      width: 2rem;
      margin-bottom: 0.5rem;
      opacity: 0.25;
      transition: opacity 100ms;

      &:hover {
        opacity: 0.9;
      }

      &.-active {
        opacity: 1;
      }
    }

    .tool {
      background: #666;
      color: white;
    }
  }
}

</style>

<script>
import * as Y from 'yjs'
import { assert } from '../lib/assert'
import { sync, whiteboardUndoManager } from '../state'

const log = require('debug')('app:app-whiteboard')

let currPath = null

export default {
  name: 'app-whiteboard',
  components: {},
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      color: 'black',
      colorPresets: [
        'black',
        'red',
        'green',
        'blue',
      ],
    }
  },
  methods: {
    calculateCoordinateFromEvent(event) {
      const canvasRect = this.$refs.canvas.getBoundingClientRect()
      const point = {
        x: (event.clientX - canvasRect.left) / canvasRect.width,
        y: (event.clientY - canvasRect.top) / canvasRect.height,
      }
      // log('calculateCoordinateFromEvent', point)
      return point
    },
    drawStart(event) {
      if (!this.editable) return false
      // log('drawStart')
      if (sync.whiteboard && (event.target == null || event.target.nodeName === 'CANVAS')) {
        const drawElement = new Y.Map()
        drawElement.set('color', this.color)
        drawElement.set('type', 'path')
        drawElement.set('coordinate', this.calculateCoordinateFromEvent(event))
        currPath = new Y.Array()
        drawElement.set('path', currPath)
        // log('push', drawElement)
        sync.whiteboard.push([drawElement])
      }
      return false
    },
    clearCurrPath() {
      // log('clearCurrPath')
      currPath = null
      return false
    },
    moveDraw(event) {
      if (!this.editable) return false
      if (event.target == null || event.target.nodeName === 'CANVAS') {
        if (currPath !== null) {
          // log('moveDraw')
          currPath.push([this.calculateCoordinateFromEvent(event)])
        }
      }
      return false
    },
    touchStart(event) {
      if (event.touches.length === 1) {
        this.drawStart(event.touches[0], this.$el)
      }
      return false
    },
    touchMove(event, el) {
      if (event.touches.length === 1) {
        this.moveDraw(event.touches[0], el)
      }
      return false
    },
    onStateChange() {
      // log('onStateChange')
      const drawingCanvas = this.$refs.canvas
      const ctx = drawingCanvas.getContext('2d')
      const yDrawingContent = sync.whiteboard

      assert('syncobj', yDrawingContent)

      const requestAnimationFrame = window.requestAnimationFrame || setTimeout

      let needToRedraw = true

      const draw = () => {
        // log('draw', needToRedraw)
        if (needToRedraw) {
          needToRedraw = false
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          const width = ctx.canvas.width
          const height = ctx.canvas.height
          yDrawingContent.forEach(drawElement => {
            if (drawElement.get('type') === 'path') {
              const coordinate = (drawElement.get('coordinate'))
              const color = (drawElement.get('color'))
              const path = (drawElement.get('path'))
              if (path) {
                ctx.beginPath()
                ctx.lineWidth = 5
                ctx.lineJoin = ctx.lineCap = 'round'
                // ctx.shadowBlur = 2
                // ctx.shadowColor = color
                ctx.beginPath()
                ctx.moveTo(coordinate.x * width, coordinate.y * height)
                ctx.strokeStyle = color
                let lastPoint = coordinate
                path.forEach(c => {
                  // @todo this can be optimized by considering the previous coordinates too
                  const pointBetween = {
                    x: (c.x + lastPoint.x) / 2,
                    y: (c.y + lastPoint.y) / 2,
                  }
                  ctx.quadraticCurveTo(lastPoint.x * width, lastPoint.y * height, pointBetween.x * width, pointBetween.y * height)
                  lastPoint = c
                })
                ctx.lineTo(lastPoint.x * width, lastPoint.y * height)
                ctx.stroke()
              }
            }
          })
        }
      }
      const requestDrawAnimationFrame = () => {
        // log('requestDrawAnimationFrame')
        needToRedraw = true
        requestAnimationFrame(draw)
      }
      yDrawingContent.observeDeep(requestDrawAnimationFrame)
      // internal.unregisterYDraw = () => yDrawingContent.unobserveDeep(requestDrawAnimationFrame)
      requestDrawAnimationFrame()
    },
    doTrash() {
      sync.whiteboard.delete(0, sync.whiteboard.length)
    },
    doUndo() {
      whiteboardUndoManager.undo()
    },
    doRedo() {
      whiteboardUndoManager.redo()
    },
  },
  async mounted() {
    // log('mounted')
    this.onStateChange()
    // sync.whiteboard.observeDeep(event => {
    //   log('change in whiteboard')
    //   this.onStateChange()
    // })
  },
}
</script>
