// Copyright (c) 2020 Dirk Holtwick. All rights reserved. https://holtwick.de/copyright

// Inspied by https://github.com/diamondio/better-queue

import { UUID } from '../uuid'

const log = require('debug')('mq')

export function now() {
  return performance.now() || new Date().getTime() // ms
}

export function immediate(fn) {
  if (typeof setImmediate !== 'undefined') {
    setImmediate(fn)
  } else {
    setTimeout(fn, 0)
  }
}

export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))
export const nextTick = _ => new Promise(resolve => setTimeout(resolve, 0))

export class TaskHandler {

  _tasks = []
  _name
  _fn
  _waitFn
  _delayTimer

  // Options
  defer = 0
  debounce = 0
  persist = false
  latest = false
  batch = 1

  filter = null
  sort = null
  merge = null

  queue = null

  constructor(name, fn, {
    queue = null,
    defer = 0,
    debounce = 0,
    persist = false,
    latest = false,
    batch = 1,
    filter = null,
    sort = null,
    merge = null,
  } = {}) {
    this._name = name

    this._fn = async (task) => { // , backChannel?
      // log(`Task for ${name} starts.`)
      let error, result
      task.started = now()
      try {
        result = fn(task.info)
        if (result instanceof Promise) {
          result = await result
        }
      } catch (err) {
        error = err
        log('Execution error', err)
      }
      task.ended = now()
      log(`*** Task for ${name} finished. ${(task.started - task.added).toFixed(2)}ms until start. ${(task.ended - task.started).toFixed(2)}ms execution time. Info=${result}, error=${error}`)
      this.remove(task.id)

      this.response(task, result, error)
    }

    this.queue = queue
    this.defer = defer
    this.debounce = debounce
    this.persist = persist
    this.latest = latest
    this.batch = batch
    this.filter = filter
    this.sort = sort
    this.merge = merge

    this._restore()
  }

  response(task, info, error) {
    if (task.response && this.queue) {
      log('task response', task)
      this.queue.emit(task.response, {
        info,
        error,
      })
    }
  }

  isEmpty() {
    const empty = this._tasks.filter(task => task.started == null).length <= 0
    // log('isEmpty', empty)
    return empty
  }

  remove(taskID) {
    let index = this._tasks.findIndex(task => task.id === taskID)
    if (index !== -1) this._tasks.slice(index, 1)
  }

  async _performNext() {
    log('perform next')
    const max = Math.max(1, this.batch)

    let currentTasks = (
      this._tasks
        .filter(task => task.ended == null)
        .slice(0, max)
        .map(task => this._fn(task))) // error handling
    log('current tasks', currentTasks)
    await Promise.all(currentTasks)

    this._delayTimer = null
    if (!this.isEmpty()) {
      log('perform enqueued for next batch')
      this._delayTimer = setTimeout(() => this._performNext(), this.debounce)
    } else {
      log('perform finished, now empty')
      if (this._waitFn) {
        this._waitFn()
        this._waitFn = null
      }
    }
  }

  // combine? merge?
  // distinct? removeSame?

  async force() {
    clearTimeout(this._delayTimer)
    this.batch = 99999 // todo
    await this._performNext()
  }

  _persist() {
    if (this.persist) {
      localStorage.setItem(`mq-handler-${name}`, JSON.stringify(this._tasks, null, 2))
    }
  }

  _restore() {
    if (this.persist) {
      try {
        this._tasks = JSON.parse(localStorage.getItem(`mq-handler-${name}`))
      } catch (err) {
        console.error('Exception:', err)
      }
    }
  }

  // pendingTasks() {
  //   return this._
  // }

  add(info, { id = UUID(), ...props } = {}) {
    const wasEmpty = this.isEmpty()

    let task = {
      ...props,
      id,
      info,
      added: now(),
    }

    this._tasks.push(task)

    if (this.latest) {
      this._tasks = [task] // skip .started
    } else {
      let filterFn = this.filter
      if (filterFn) {
        let tasks = []
        for (let task of this._tasks) {
          if (!task.started && !filterFn(task.info)) continue
          tasks.push(task)
        }
        this._tasks = tasks //  this._tasks.filter(task => filterFn(task.info))
      }
      // const mergeFn = this.merge
      // if (mergeFn) {
      //   let prev
      //   let tasks = []
      //   for(let task of this._tasks) {
      //     if (!task.started) {
      //
      //     }
      //   }
      //   this._tasks = this._tasks.reduce()
      // }
    }

    log(`added to ${this._name}: ${info}`)
    if (wasEmpty) {
      immediate(() => this._performNext())
    }
    return task
  }

  wait() {
    if (this.isEmpty()) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      this._waitFn = resolve
    })
  }

  // pause
  // resume

  destroy() {
    this.queue = null // circular reference
  }

}

export class TaskQueue {

  _name
  _handlers = {}

  constructor({ name = UUID() } = {}) {
    this._name = name
  }

  on(name, fn, opt) {
    log('task handler', name, window)
    let handler = new TaskHandler(name, fn, {
      ...opt,
      queue: this,
    })
    this._handlers[name] = handler
    return handler
  }

  off(name) {
    this._handlers[name]?.destroy()
    this._handlers[name] = null
  }

  once(name, fn) {
    this.on(name, info => {
      this.off(name)
      fn(info)
    })
  }

  // Returns the Task if handler was available
  _emit(name, info, props = {}) {
    log('task emit', name, window)
    let handler = this._handlers[name]
    if (handler) {
      return handler.add(info, props)
    }
    log(`No handler found for ${name}`)
  }

  emit(name, info, props) {
    return this._emit(name, info, props)
  }

  fetch(name, info) {
    return new Promise((resolve, reject) => {
      const id = UUID()
      const response = `--${name}-${id}`
      this.once(response, ({ info, error }) => {
        log('response', info, error)
        if (error) reject(error)
        else resolve(info)
      })
      this.emit(name, info, { response })
    })
  }

  handler(name) {
    return this._handlers[name]
  }

  async wait(name = null) {
    if (!name) {
      return Promise.all(Object.keys(this._handlers).map(name => this.wait(name)))
    }
    let handler = this.handler(name)
    if (handler) {
      await handler.wait(name)
    }
  }

}

export class ChannelTaskQueue extends TaskQueue {

  _channel

  constructor(channel) {
    super()
    this._channel = channel
    log('Subscribe', this._name, this._channel._name)
    this._channel.subscribe(({ name, info, props }) => {
      log('Message via channel', name, info, this._name, Object.keys(this._handlers))
      this._emit(name, info, props)
    })
  }

  emit(name, info, props) {
    log('Publish on channel', name, info, this._name, this._channel._name) // , Object.keys(this._handlers))
    this._channel.publish({ name, info, props })
  }

}
