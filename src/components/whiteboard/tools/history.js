class History {

  constructor(limit) {
    this.limit = limit
    this.clear()
  }

  add(action) {
    if (this.history.length >= this.limit || this.current === this.history.length - 1) {
      this.history.shift()
    }
    this.history.push(action)
    this.current = this.history.length
  }

  undo() {
    if (this.current > 0) {
      this.history[--this.current].unexec()
    }
  }

  redo() {
    if (this.history.length > this.current) {
      this.history[this.current++].exec()
    }
  }

  clear() {
    this.history = []
    this.current = 0
  }

}

// Default size 20
export default new History(20)
