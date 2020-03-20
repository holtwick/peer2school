export class Emitter {

  subscribers = {}

  emit(key, info) {
    let subscribers = this.subscribers[key] || []
    for (let fn of subscribers) {
      fn(info)
    }
  }

  on(key, fn) {
    let subscribers = this.subscribers[key] || []
    subscribers.push(fn)
    this.subscribers[key] = subscribers
  }

}
