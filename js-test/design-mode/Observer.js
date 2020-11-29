/* 
 * 观察者设计模式
 * 不对事件进行分类，有事件时会默认通知所有观察者
 */

class Observer {
  constructor() {
    this.observerList = [];
  }

  subscribe(observer) {
    this.observerList.push(observer)
  }

  notifyAll(value) {
    this.observerList.forEach(observe => observe(value))
  }
}