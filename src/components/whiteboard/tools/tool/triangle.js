import paper from 'paper'
import store from '../../store/store'
import { DrawAction } from '../action'
import history from '../history'
import { createLayer } from '../shared'

let local = {
  path: null,
  center: null,
  layer: null,
}

function onMouseDown(event) {
  local.layer = createLayer()
  local.center = event.point
}

function onMouseDrag(event) {
  if (local.path) {
    local.path.remove()
  }
  local.path = new paper.Path.RegularPolygon(local.center, 3, Math.sqrt((event.point.x - local.center.x) * (event.point.x - local.center.x) + (event.point.y - local.center.y) * (event.point.y - local.center.y)))
  local.path.strokeColor = store.getters.shapeArgs.color
  local.path.strokeWidth = store.getters.shapeArgs.size
}

function onMouseUp() {
  local.layer.addChild(local.path)
  const action = new DrawAction({
    layer: local.path.layer.name,
    tool: store.getters.tool,
    points: local.path.segments.map(seg => {
      return {
        x: seg._point._x,
        y: seg._point._y,
      }
    }),
  })
  history.add(action)
  local.path = null
}

export const tool = new paper.Tool()
tool.onMouseDown = onMouseDown
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp
