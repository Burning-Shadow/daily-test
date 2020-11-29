const STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

const resolvePromise = (promise2, x, resolve, reject) => {
  // 1)不能引用同一个对象 可能会造成死循环
  if (promise2 === x) {
    return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]----'));
  }

  let called; // promise的实现可能有多个，但都要遵循promise a+规范，我们自己写的这个promise用不上called,但是为了遵循规范才加上这个控制的，因为别人写的promise可能会有多次调用的情况。
  // 2)判断x的类型，如果x是对象或者函数，说明x有可能是一个promise，否则就不可能是promise
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    // 有可能是promise promise要有then方法
    try {
      // 因为then方法有可能是getter来定义的, 取then时有风险，所以要放在try...catch...中
      // 别人写的promise可能是这样的
      // Object.defineProperty(promise, 'then', {
      // 	get() {
      // 		throw new Error();
      // 	}
      // })
      let then = x.then;
      if (typeof then === 'function') { // 只能认为他是promise了
        // x.then(()=>{}, ()=>{}); 不要这么写，以防以下写法造成报错， 而且也可以防止多次取值
        // let obj = {
        // 	a: 1,
        // 	get then() {
        // 		if (this.a++ == 2) {
        // 			throw new Error();
        // 		}
        // 		console.log(1);
        // 	}
        // }
        // obj.then;
        // obj.then

        // 如果x是一个promise那么在new的时候executor就立即执行了，就会执行他的resolve，那么数据就会传递到他的then中
        then.call(x, y => { // 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject); // resolve, reject都是promise2的
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // {a: 1, then: 1} 
        resolve(x);
      }
    } catch (e) { // 取then出错了 有可能在错误中又调用了该promise的成功或则失败
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      // 判断value的值
      if (value instanceof Promise) {
        value.then(resolve, reject); //resolve和reject都是当前promise的， 递归解析直到是普通值, 这里的resolve,reject都取的到，因为resolve的执行是在这两个函数执行之后，这里递归是防止value也是一个promise
        return;
      }

      if (this.status === STATUS.PENDING) {
        this.value = value;
        this.status = STATUS.RESOLVED;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }

    const reject = reason => {
      // 判断value的值
      if (value instanceof Promise) {
        value.then(resolve, reject); //resolve和reject都是当前promise的， 递归解析直到是普通值, 这里的resolve,reject都取的到，因为resolve的执行是在这两个函数执行之后，这里递归是防止value也是一个promise
        return;
      }

      if (this.status === STATUS.PENDING) {
        this.value = reason;
        this.status = STATUS.REJECTED;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  static resolve(p) {
    if (p instanceof MyPromise) {
      return p.then()
    }
    return new MyPromise((resolve, reject) => {
      resolve(p)
    })
  }

  static reject(p) {
    if (p instanceof MyPromise) {
      return p.catch()
    }
    return new MyPromise((resolve, reject) => {
      reject(p)
    })
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      try {
        let count = 0,
          len = promises.length,
          value = [];
        for (let promise of promises) {
          MyPromise.resolve(promise).then(v => {
            count++;
            value.push(v);
            if (count === len) {
              resolve(value)
            }
          })
        }
      } catch (e) {
        reject(e)
      }
    });
  }
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      try {
        for (let promise of promises) {
          MyPromise.resolve(promise).then(resolve)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  catch (onRejected) {
    return this.then(void 666, onRejected)
  }

  then = (onResolved, onRejected) => {
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.RESOLVED) {
        // 若状态已变为成功则执行promise
        // 使用宏任务把代码放在一下次执行,这样就可以取到promise2,用作resolvePromise的参数
        setTimeout(() => {
          try {
            const x = onResolved(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            console.log(e);
            reject(e);
          }
        }, 0);
      }

      if (this.status === STATUS.REJECTED) {
        onRejected(this.value);
        setTimeout(() => {
          try {
            const x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === STATUS.PENDING) {
        // 这时候executor肯定是有异步逻辑
        // 面向切面编程
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);

        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }
}

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('xxx');
  }, 2000);
});
// 发布订阅模式应对异步 支持一个promise可以then多次
promise.then((res) => {
  console.log('成功的结果1', res);
}).then(res => {
  console.log('aaaaa');
});


// let promise = new Promise((resolve, reject) => {
// 	resolve('hello');
// });

// let promise2 = promise.then(() => {
// 	return promise2;
// });
// promise2.then(() => {}, (err) => {
// 	console.error(err);
// });

const p = new Promise((resolve, reject) => {
  console.log(1)
  resolve(new Promise((resolve, reject) => {
    console.log(2);
    resolve('hello');
  })).then(res => {
    console.log(res);
  });
});


// promise.then((res) => { 
// 	console.log('成功的结果2', res);
// }, (error) => { 
// 	console.log(error);
// });