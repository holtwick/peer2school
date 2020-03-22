import paper from 'paper'
import { createLayer } from './shared'

export class DrawAction {

  constructor(args) {
    this._args = args
  }

  exec() {
    if (!paper.project.layers[this._args.layer]) {
      createLayer(this._args.layer)
    }
    if (this.removed) {
      return paper.project.layers[this._args.layer].addChildren(this.removed)
    }
  }

  unexec() {
    this.removed = paper.project.layers[this._args.layer].removeChildren()
  }

  toJSON() {
    return this._args
  }

}
