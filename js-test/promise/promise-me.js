function Promise(executor) {
  const _self = this;
  _self.status = 'PENDING';
  _self.value = undefined;
  _self.onResolveArr = [];
  _self.onRejectArr = [];

  function resolve(value) {
    if (_self.status === 'PENDING') {
      console.log("resolve")
      _self.value = value;
      _self.status = 'FULFILLED';
      _self.onResolveArr.forEach(fn => {
        console.log(fn)
        fn()
      });
    }
  }

  function reject(value) {
    if (_self.status === 'PENDING') {
      _self.value = value;
      _self.status = 'REJECTED';
      _self.onRejectArr.forEach(fn => fn());
    }
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    console.warn(e);
  }
}

Promise.__proto__.FULFILLED = 'FULFILLED';
Promise.__proto__.REJECTED = 'REJECTED';
Promise.__proto__.PENDING = 'PENDING';

Promise.prototype.then = function (onFulfilled, onRejected) {
  const _self = this;
  // console.log(_self);

  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : (error) => {
    throw error
  };

  if (_self.status === 'FULFILLED') {
    return new Promise((resolve, reject) => {
      try {
        const s = onFulfilled(_self.value);
        if (s instanceof Promise) {
          s.then(resolve, reject);
        }
        resolve(s);
      } catch (err) {
        reject(err);
      }
    })
  }
  if (_self.status === 'REJECTED') {
    return new Promise((resolve, reject) => {
      try {
        const f = onRejected(_self.value);
        if (f instanceof Promise) {
          f.then(resolve, reject);
        }
        reject(f);
      } catch (err) {
        reject(err);
      }
    })
  }
  if (_self.status === 'PENDING') {
    return new Promise(function (resolve, reject) {
      _self.onResolveArr.push(function () {
        try {
          // const p = onFulfilled(_self.value);
          console.log('p instanceof Promise ? >>>>>> ', p instanceof Promise);
          if (p instanceof Promise) {
            p.then(resolve, reject);
          } else {
            resolve(p);
          }
        } catch (err) {
          reject(err);
        }
      });

      _self.onRejectArr.push(function () {
        try {
          // const p = onRejected(_self.value);
          if (p instanceof Promise) {
            p.then(resolve, reject);
          } else {
            reject(p)
          }
        } catch (err) {
          reject(err);
        }
      })
    })
  }
}

function delay1(resolve, reject) {
  setTimeout(() => {
    console.log(resolve);
    console.log(reject);
    resolve(111);
  }, 2000);
}

let p = new Promise(delay1)
  .then((value) => {
    console.log('第一次打印 value ', value);
    return value + 1
  }).then((value) => {
    console.log('第二次打印 value ', value + 1);
  })

// const promise = new Promise((resolve, reject) => {
//     // throw new Error('出错了')
//     console.log(1)
//     setTimeout(() => {
//         console.log(4)
//         resolve(6)
//         console.log(5)
//     })
//     console.log(2)
// })
// .then(
//     value => {
//         console.log(value, 'value')
//         return new Promise(resolve => {
//             resolve(new Promise(resolve3 => {
//                 resolve3(7)
//             }))
//         })
//     },
//     reason => {
//         console.log(reason, 'reason')
//     })
// .then(
//     value => {
//         console.log(value, 'vvvvvvvvvvvv')
//     }, reason => {
//         console.log(reason)
//     })
// console.log(3)