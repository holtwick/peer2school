import paper from 'paper'
import { DrawAction } from '../action'
import history from '../history'
import { store } from '../paperStore'
import { createLayer } from '../shared'

let local = {
  path: null,
  group: null,
}


function onMouseDown(event) {
  let layer = createLayer()
  local.path = new paper.Path()
  local.path.strokeColor = store.toolArgs.color
  local.path.strokeWidth = store.toolArgs.size
  local.path.add(event.point)

  local.group = new paper.Group({
    children: [local.path],
    layer: layer,
  })
  local.group.addChild(new paper.Shape.Ellipse({
    layer: layer,
    center: event.point,
    strokeColor: store.toolArgs.color,
    fillColor: store.toolArgs.color,
    radius: store.toolArgs.size / 2,
  }))
  layer.addChild(local.group)
}

function onMouseDrag(event) {
  if (!local.path) return
  local.path.add(event.point)
  local.path.selected = true
}


function onMouseUp(event) {

  local.path.add(event.point)
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
  local.group = null
}

export const tool = new paper.Tool()
tool.onMouseDown = onMouseDown
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp
