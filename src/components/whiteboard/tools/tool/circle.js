import paper from 'paper'
import { DrawAction } from '../action'
import history from '../history'
import { store } from '../paperStore'
import { createLayer } from '../shared'

let local = {
  path: null,
  center: null,
}

function onMouseDown(event) {

  let layer = createLayer()
  local.path = new paper.Shape.Circle({
    center: event.point,
    strokeColor: store.shapeArgs.color,
    strokeWidth: store.shapeArgs.size,
  })
  layer.addChild(local.path)
  local.center = event.point
}

function onMouseDrag(event) {
  if (!local.path) return
  local.path.radius = Math.sqrt((event.point.x - local.center.x) * (event.point.x - local.center.x) + (event.point.y - local.center.y) * (event.point.y - local.center.y))
}


function onMouseUp() {
  const action = new DrawAction({
    layer: local.path.layer.name,
    tool: store.tool,
    center: local.center,
    radius: local.path.radius,
  })
  local.path = null
  history.add(action)
}

export const tool = new paper.Tool()
tool.onMouseDown = onMouseDown
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp
