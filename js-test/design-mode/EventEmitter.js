/* 
 * 发布订阅模式
 * 对事件进行分类
 * 触发不同的事件会通知对应对观察者
 * 可以理解为是观察者模式的升级版本，细化了事件粒度
 */
class EventEmitter {
  constructor() {
    this.eventChannel = {}; // 消息中心
  }

  // subscribe
  on(event, callback) {
    this.eventChannel[event] ? this.eventChannel[event].push(callback) : this.eventChannel[event] = [callback]
  }

  // publish
  emit(event, ...args) {
    this.eventChannel[event] && this.eventChannel[event].forEach(callback => callback(...args))
  }

  // remove event
  remove(event) {
    if (this.eventChannel[event]) {
      delete this.eventChannel[event]
    }
  }

  // once event
  once(event, callback) {
    this.on(event, (...args) => {
      callback(...args);
      this.remove(event)
    })
  }
}