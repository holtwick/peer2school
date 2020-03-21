import paper from 'paper'
import store from '../../store/store'
import { DrawAction } from '../action'
import history from '../history'
import { createLayer } from '../shared'

let local = {
  path: null,
  group: null,
}

function onMouseDown(event) {
  let layer = createLayer()

  local.path = new paper.Path()
  local.path.strokeColor = store.getters.eraserArgs.color
  local.path.strokeWidth = store.getters.eraserArgs.size

  local.path.add(event.point)

  local.group = new paper.Group({
    children: [local.path],
    layer: layer,
  })
  local.group.addChild(new paper.Shape.Ellipse({
    layer: layer,
    center: event.point,
    fillColor: store.getters.eraserArgs.color,
    radius: store.getters.eraserArgs.size / 2,
  }))
  layer.addChild(local.group)
}

function onMouseDrag(event) {
  if (!local.path) return
  local.path.add(event.point)
}

function onMouseUp(event) {
  local.path.add(event.point)
  local.path.simplify()
  const action = new DrawAction({
    layer: local.path.layer.name,
    tool: {
      color: store.getters.tool.color,
      size: store.getters.tool.size,
    },
    points: local.path.segments.map(seg => {
      return {
        x: seg._point._x,
        y: seg._point._y,
      }
    }),
  })
  local.path = null
  local.group = null
  history.add(action)
}


export const tool = new paper.Tool()
tool.onMouseDown = onMouseDown
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp
