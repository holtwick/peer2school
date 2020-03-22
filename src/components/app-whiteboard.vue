<template>
  <y-whiteboard ref="whiteboard"></y-whiteboard>
</template>

<style lang="scss"></style>

<script>
import { defineWhiteboard } from 'y-webcomponents'
import { sync } from '../state'

defineWhiteboard()

export default {
  name: 'app-whiteboard',
  components: {},
  data() {
    return {}
  },
  methods: {},
  async mounted() {
    this.$refs.whiteboard.setState({ type: sync.whiteboard })
    //   let drawingCanvas = this.$refs.canvas
    //   const ctx = /** @type {CanvasRenderingContext2D} */ (drawingCanvas.getContext('2d'))
    //   const yDrawingContent = sync.whiteboard
    //
    //   const requestAnimationFrame = window.requestAnimationFrame || setTimeout
    //
    //   let needToRedraw = true
    //
    //   /**
    //    * Draw the canvas
    //    */
    //   const draw = () => {
    //     if (needToRedraw) {
    //       needToRedraw = false
    //       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //       const width = ctx.canvas.width
    //       const height = ctx.canvas.height
    //       yDrawingContent.forEach(drawElement => {
    //         if (drawElement.get('type') === 'path') {
    //           const coordinate = /** @type {Coordinate} */ (drawElement.get('coordinate'))
    //           const color = /** @type {string} */ (drawElement.get('color'))
    //           const path = /** @type {Y.Array<Coordinate>} */ (drawElement.get('path'))
    //           if (path) {
    //             ctx.beginPath()
    //             ctx.lineWidth = 5
    //             ctx.lineJoin = ctx.lineCap = 'round'
    //             ctx.shadowBlur = 2
    //             ctx.shadowColor = color
    //             ctx.beginPath()
    //             ctx.moveTo(coordinate.x * width, coordinate.y * height)
    //             ctx.strokeStyle = color
    //             let lastPoint = coordinate
    //             path.forEach(c => {
    //               // @todo this can be optimized by considering the previous coordinates too
    //               const pointBetween = {
    //                 x: (c.x + lastPoint.x) / 2,
    //                 y: (c.y + lastPoint.y) / 2,
    //               }
    //               ctx.quadraticCurveTo(lastPoint.x * width, lastPoint.y * height, pointBetween.x * width, pointBetween.y * height)
    //               lastPoint = c
    //             })
    //             ctx.lineTo(lastPoint.x * width, lastPoint.y * height)
    //             ctx.stroke()
    //           }
    //         }
    //       })
    //     }
    //   }
    //   const requestDrawAnimationFrame = () => {
    //     needToRedraw = true
    //     requestAnimationFrame(draw)
    //   }
    //   yDrawingContent.observeDeep(requestDrawAnimationFrame)
    //   el._internal.unregisterYDraw = () => yDrawingContent.unobserveDeep(requestDrawAnimationFrame)
    //   requestDrawAnimationFrame()
    //
    //   /**
    //    * @param {string} color
    //    */
    //   const createColorChanger = color => () => {
    //     drawingMenubarActionColor.style.backgroundColor = color
    //     el._internal.currentColor = color
    //   }
    //
    //   const cBlack = createColorChanger('#333')
    //   const cOrange = createColorChanger('#ffbc42')
    //   const cBlue = createColorChanger('#30bced')
    //   const cGreen = createColorChanger('#6eeb83')
    //   const cClear = () => {
    //     yDrawingContent.delete(0, yDrawingContent.length)
    //     drawingMenubarCheckbox.checked = false
    //   }
    //
    //   const menuBlack = /** @type {HTMLElement} */ (dom.querySelector(shadow, '#drawer-menubar-colors-black'))
    //   const menuOrange = /** @type {HTMLElement} */ (dom.querySelector(shadow, '#drawer-menubar-colors-orange'))
    //   const menuBlue = /** @type {HTMLElement} */ (dom.querySelector(shadow, '#drawer-menubar-colors-blue'))
    //   const menuGreen = /** @type {HTMLElement} */ (dom.querySelector(shadow, '#drawer-menubar-colors-green'))
    //
    //   menuBlack.addEventListener('click', cBlack)
    //   menuOrange.addEventListener('click', cOrange)
    //   menuBlue.addEventListener('click', cBlue)
    //   menuGreen.addEventListener('click', cGreen)
    //   drawingMenubarActionClear.addEventListener('click', cClear)
    //
    //   if (el._internal.unregister) {
    //     el._internal.unregister()
    //   }
    //   el._internal.unregister = () => {
    //     menuBlack.removeEventListener('click', cBlack)
    //     menuOrange.removeEventListener('click', cOrange)
    //     menuBlue.removeEventListener('click', cBlue)
    //     menuGreen.removeEventListener('click', cGreen)
    //     drawingMenubarActionClear.removeEventListener('click', cClear)
    //   }
    // },

  },
}
</script>

