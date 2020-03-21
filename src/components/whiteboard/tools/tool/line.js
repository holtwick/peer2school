import paper from 'paper'
import { DrawAction } from '../action'
import history from '../history'
import { store } from '../paperStore'
import { createLayer } from '../shared'

let local = {
  path: null,
}


function onMouseDrag(event) {
  if (local.path) {
    local.path.remove()
  }
  local.path = new paper.Path.Line({
    from: event.downPoint,
    to: event.point,
    strokeColor: 'black',
  })
  local.path.strokeColor = store.shapeArgs.color
  local.path.strokeWidth = store.shapeArgs.size
}

function onMouseUp() {
  let layer = createLayer()
  layer.addChild(local.path)

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
  local.path = null
}


export const tool = new paper.Tool()
tool.onMouseDrag = onMouseDrag
tool.onMouseUp = onMouseUp
