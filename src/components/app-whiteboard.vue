<template>
  <div class="whiteboard" ref="whiteboard">
    <canvas
      width="2000"
      height="2000"
      ref="canvas"
      @mousedown="drawStart"
      @touchstart="touchStart"
      @mouseleave="clearCurrPath"
      @mouseup="clearCurrPath"
      @touchcancel="clearCurrPath"
      @touchend="clearCurrPath"
      @mousemove="moveDraw"
      @touchmove="touchMove"
    />
  </div>
</template>

<script>
import * as Y from 'yjs'
import { assert } from '../lib/assert'
import { sync } from '../state'

const log = require('debug')('app:app-whiteboard')

let currPath = null

export default {
  name: 'app-whiteboard',
  components: {},
  data() {
    return {}
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
    drawStart(coord) {
      // log('drawStart')
      if (sync.whiteboard && (coord.target == null || coord.target.nodeName === 'CANVAS')) {
        const drawElement = new Y.Map()
        drawElement.set('color', '#333')
        drawElement.set('type', 'path')
        drawElement.set('coordinate', this.calculateCoordinateFromEvent(coord))
        currPath = new Y.Array()
        drawElement.set('path', currPath)
        log('push', drawElement)
        sync.whiteboard.push([drawElement])
      }
      return false
    },
    clearCurrPath() {
      // log('clearCurrPath')
      currPath = null
      return false
    },
    moveDraw(coord) {
      if (coord.target == null || coord.target.nodeName === 'CANVAS') {
        if (currPath !== null) {
          // log('moveDraw')
          currPath.push([this.calculateCoordinateFromEvent(coord)])
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
      log('onStateChange')
      const drawingCanvas = this.$refs.canvas
      const ctx = drawingCanvas.getContext('2d')
      const yDrawingContent = sync.whiteboard

      assert('syncobj', yDrawingContent)

      const requestAnimationFrame = window.requestAnimationFrame || setTimeout

      let needToRedraw = true

      const draw = () => {
        log('draw', needToRedraw)
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
        log('requestDrawAnimationFrame')
        needToRedraw = true
        requestAnimationFrame(draw)
      }
      yDrawingContent.observeDeep(requestDrawAnimationFrame)
      // internal.unregisterYDraw = () => yDrawingContent.unobserveDeep(requestDrawAnimationFrame)
      requestDrawAnimationFrame()
    },
  },
  async mounted() {
    log('mounted')
    this.onStateChange()
    // sync.whiteboard.observeDeep(event => {
    //   log('change in whiteboard')
    //   this.onStateChange()
    // })
  },
}
</script>

<style lang="scss">
:host, .whiteboard {
  position: relative;
  display: block;
  touch-action: none;
}

canvas {
  width: 100%;

  // Grid
  // background-image: -webkit-repeating-radial-gradient(center center, rgba(0, 0, 0, .2), rgba(0, 0, 0, .2) 1px, transparent 1px, transparent 100%);
  // background-size: 1rem 1rem;
}

</style>
