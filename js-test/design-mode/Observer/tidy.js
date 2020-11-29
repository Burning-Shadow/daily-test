// const fs = require('fs');

/* 
 * 观察者设计模式
 * 不对事件进行分类，有事件时会默认通知所有观察者
 */

class Observer {
  constructor() {
    this.list = [];
  }

  subscribe(observer) {
    this.list.push(observer)
  }

  notifyAll(value) {
    this.list.forEach(observe => observe(value))
  }
}

// 观察者
const observer = new Observer();
observer.subscribe(value => {
  console.log("第一个观察者，接收到的值为:");
  console.log(value)
});
observer.subscribe(value => {
  console.log("第二个观察者，接收到的值为");
  console.log(value)
});

// fs.readFile("test.txt", (err, data) => {
//   if(err) return;
//   observer.notifyAll(data.toString())
// });

setTimeout(() => {
  observer.notifyAll('hello world');
}, 1000);