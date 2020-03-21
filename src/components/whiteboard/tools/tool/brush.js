import paper from 'paper'
import { DrawAction } from '../action'
import history from '../history'
import { store } from '../paperStore'
import { createLayer } from '../shared'

let local = {
  path: null,
}

function onMouseDown() {
  let layer = createLayer()
  local.path = new paper.Path()
  let rgb = hexToRgb(store.toolArgs.color || '#000000')
  local.path.fillColor = `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`
  layer.addChild(local.path)
}

function onMouseDrag(event) {
  if (!local.path) return
  var step = event.delta
  step.x *= store.toolArgs.size / 2.8
  step.y *= store.toolArgs.size / 2.8
  step.angle += 90

  var top = event.middlePoint.add(step)
  var bottom = event.middlePoint.subtract(step)
  local.path.selected = true
  local.path.add(top)
  local.path.insert(0, bottom)
}


function onMouseUp() {
  local.path.simplify()
  const action = new DrawAction({
    layer: local.path.layer.name,
    tool: store.tool,
    points: local.path.segments.map(seg => {
      return {
        x: seg._point._x,
        y: seg._point._y,
      }
    }),
  })
  history.add(action)
  local.path.selected = false
  local.path = null
}

export const tool = new paper.Tool()
tool.minDistance = 7
tool.maxDistance = 7
tool.onMouseDown = onMouseDown
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}
