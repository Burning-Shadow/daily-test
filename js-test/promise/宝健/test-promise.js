const STATUS = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
}

class MyPromise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    // 存储回调函数
    this.succList = [];

    try {
      console.log(executor.toString());
      executor(this.resolve);
    } catch (err) {
      throw err;
    }
  }

  // 订阅
  then = (fn) => {
    console.log(fn.toString());
    this.succList.push(fn);
  }

  // 状态改变后的操作
  static resolve = (value) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.RESOLVED;
      this.succList.forEach(fn => fn(value));
    }
  }
}

const p = new MyPromise((res, rej) => {
  setTimeout(() => {
    res('1111');
  }, 2000);
})
p.then(value => {
  console.log('徐宝健');
  console.log(value)
});

const p2 = Promise.resolve('1');