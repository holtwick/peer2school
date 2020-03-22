import paper from 'paper'
import { UUID } from '../../../lib/uuid'

export const createLayer = (id) => {
  if (!id) id = UUID()
  let layer = new paper.Layer({
    name: id,
  })
  paper.project.addLayer(layer)
  return layer
}
