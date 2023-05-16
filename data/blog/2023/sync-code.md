---
title: '异步编程相关'
date: Tue May 16 2023 21:06:06 GMT+0800 (中国标准时间)
lastmod: '2023-05-16'
tags: ['异步编程', 'Promise', 'Rxjs']
draft: false
summary: '异步编程的最高境界，就是不用关心它是不是异步。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/sync-code
---

## 介绍

异步编程是一种编程方式，其中代码可以在等待某些操作完成时继续执行其他操作，而不必等待该操作完成。

在异步编程中，操作通常是非阻塞的，这意味着它们不会阻塞应用程序的主线程。

异步编程通常用于处理网络请求、数据库查询、文件读写等长时间运行的操作，以提高应用程序的性能和响应能力。

常见的异步编程方法包括回调函数、Promise、async/await 等。

## 进程与线程

### 进程

**一个进程就是一个程序的运行实例**。

详细解释就是，启动一个程序的时候，操作系统会为该程序创建一块内存，用来存放代码、运行中的数据和一个执行任务的主线程，我们把这样的一个运行环境叫进程。

### 主线程

主线程是**指程序启动后默认的线程，负责执行程序的主要逻辑和任务。**

在主线程中，所有的代码都是顺序执行的，直到遇到需要等待的操作（如用户输入、网络请求等）时，主线程会暂停执行，等待操作完成后再继续往下执行。

除了主线程，程序中还可以创建其他的子线程。子线程与主线程并行执行，可以同时完成多个任务，从而提高程序的效率和响应速度。在多线程编程中，通常会将一些耗时的操作放在子线程中执行，以避免阻塞主线程的运行。

## 事件循环

每个**渲染进程都有一个主线程，并且主线程非常繁忙，既要处理 DOM，又要计算样式，还要处理布局，同时还需要处理 JavaScript 任务以及各种输入事件**。

要让这么多不同类型的任务在主线程中有条不紊地执行，这就需要一个系统来统筹调度这些任务，既处理之前添加的任务，又要有条不紊处理后续添加的事件，而这个系统就是事件循环系统

而事件循环系统处理的事件就来自 消息队列（或任务队列），来自同一个线程或者其他线程，或者进程里的任务。

通常我们把**消息队列中的任务称为宏任务，每个宏任务中都包含了一个微任务队列**，在执行宏任务的过程中，如果 DOM 有变化，那么就会将该变化添加到微任务列表中，这样就不会影响到宏任务的继续执行，也解决了微任务执行效率的问题（比如页面需要及时更新）。

### 宏任务

页面中的大部分任务都是在主线程上执行的，这些任务包括了：

- 渲染事件（如解析 DOM、计算布局、绘制）；
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
- JavaScript 脚本执行事件；
- 网络请求完成、文件读写完成事件。

为了协调这些任务有条不紊地在主线程上执行，页面进程引入了消息队列和事件循环机制，渲染进程内部会维护多个消息队列，比如延迟执行队列和普通的消息队列。然后主线程采用一个 for 循环，不断地从这些任务队列中取出任务并执行任务。我们把这些消息队列中的任务称为**宏任务**。

宏任务可以满足我们大部分的日常需求，不过如果有对时间精度要求较高的需求，宏任务就难以胜任了。页面的渲染事件、各种 IO 的完成事件、执行 JavaScript 脚本的事件、用户交互的事件等都随时有可能被添加到消息队列中，而且添加事件是由系统操作的，JavaScript 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在消息队列中的位置，所以很难控制开始执行任务的时间。

### 微任务

一些优先级较高，不能等到下一轮事件循环就需要执行的任务，比如 Promise、process.nextTick、MutationObserver 监听 dom 变化的回调任务等

在每次 DOM 节点发生变化的时候，渲染引擎将变化记录封装成微任务，并将微任务添加进当前的微任务队列中。这样当执行到检查点的时候，V8 引擎就会按照顺序执行微任务了。

- 通过**异步**操作解决了同步操作的**性能问题**
- 通过**微任务**解决了**实时性的问题**

## Promise

学习一门新技术，最好的方式是先了解这门技术是如何诞生的，以及它所解决的问题是什么。**而 Promise 解决的是异步编码风格的问题**。

在单线程架构下，要想不阻断主线程的逻辑，回调函数无疑是一个解决办法。。。但是，这种异步回调的方式，影响了我们的编码方式，而且代码逻辑不连续及回调地狱（后面的请求依赖于前面的请求），因此解决思路：**消灭嵌套调用，合并多个任务的错误处理**。

- Promise 通过 回调函数延迟绑定和回调函数返回值穿透 的技术，解决了循环嵌套。
- Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被 onReject 函数处理或 catch 语句捕获为止。具备了这样“冒泡”的特性后，就不需要在每个 Promise 对象中单独捕获异常了

### 手动实现一个 promise

```js
// 结构一需满足
// 1. new Promise(executor)中参数executor(执行器)是函数，且自动执行，
// 2. 执行器可执行resolve或者reject，且都是函数
class Promise {
  // 构造器
  constructor(executor) {
    // 成功
    let resolve = () => {}
    // 失败
    let reject = () => {}
    // 立即执行
    executor(resolve, reject)
  }
}

// 结构二需满足
// 1. 三种状态(state)：pending、fulfilled、rejected
// 2. pending为初态，可转化为fulfilled（成功态）和rejected（失败态）
// 3. 成功后，不可再转为其他状态，且必须有一个不可改变的值（value）
// 4. 失败后，不可再转为其他状态，且必须有一个不可改变的原因（reason）
// 5. resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
// 6. reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
// 7. 若是executor函数报错 直接执行reject();
class Promise {
  constructor(executor) {
    // 初始态
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined

    let resolve = (value) => {
      // 只有pending可变为其他
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
}

// 结构三需满足
// 1. 具有then方法，且then方法有两个参数onFulfilled,onRejected
// 2. 当状态是fulfilled，执行onFulfilled，传入value
// 3. 当状态是rejected，执行onRejected，传入reason
// 4. 如果onFulfilled，onRejected是函数，分别在对应状态改变后执行，
//    value或reason依次作为他们的第一个参数
class Promise {
  constructor(executor) {
    // 初始态
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined

    let resolve = (value) => {
      // 只有pending可变为其他
      if (this.state === 'pending') {
        // 修改状态
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
  }
}

// 测试一把
var p = new Promise((resolve, reject) => {
  console.log('start')
  resolve('msg')
})

p.then(
  (val) => {
    console.log(val)
  },
  (reason) => {
    console.log(reason)
  }
)

console.log('end')
// start msg end ❌ 这个结果不正确，应该为：start end msg

// 结构四需满足
// 结构三对于同步代码没有问题，但是异步则不行
// 1. 若处在pendding时就调用then，需将对应的回调存到各自数组
// 2. 当状态改变后，再执行数组中存的回调
// 3. 一个promise可以有多个并列的then(不是链式)
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放法数组
    this.onRejectedCallbacks = []
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    // 和非pending态比，只是没有执行的函数而已
    if (this.state === 'pending') {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

// 结构四需满足
// 结构三对于同步代码没有问题，但是异步则不行
// 1. 若处在pendding时就调用then，需将对应的回调存到各自数组
// 2. 当状态改变后，再执行数组中存的回调
// 3. 一个promise可以有多个并列的then(不是链式)
class Promise2 {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放法数组
    this.onRejectedCallbacks = []
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    // 和非pending态比，只是没有执行的函数而已
    if (this.state === 'pending') {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

// 结构五需满足
// 1. 满足链式new Promise().then().then()
// 1-1. 第一个then可返回一个promise，并传递给下一个then
// 1-2. 第一个then还可返回一个普通值，并传递给下一个then

// 2. 判断第一个then的返回值(这里用x代替)
// 2-1. 首先，要看x是不是promise。
// 2-2. 如果是promise，则取它的结果，作为新的promise2成功的结果
// 2-3. 如果是普通值，直接作为promise2成功的结果
// 2-4. 所以要比较x和promise2
// 2-5. resolvePromise的参数有promise2（默认返回的promise）、x（我们自己return的对象）、resolve、reject
// 2-6. resolve和reject是promise2的
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 注意x来自这里
        let x = onFulfilled(this.value)
        // resolvePromise函数，处理x和默认的promise2
        resolvePromise(promise2, x, resolve, reject)
      }
      if (this.state === 'rejected') {
        let x = onRejected(this.reason)
        resolvePromise(promise2, x, resolve, reject)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
    })
    // 返回promise，完成链式
    return promise2
  }
}

// resolvePromise函数
// 规范规定一段代码，让不同的promise代码互相套用，这就是resolvePromise
// 1. 如果 x === promise2，则是会造成循环引用，自己等待自己完成，则报“循环引用”错误
// 2. 判断x
// 2-1. x 不能是null
// 2-2. x 是普通值 直接resolve(x)
// 2-3. x 是对象或者函数（包括promise），let then = x.then
// 2-4. 如果取then报错，则走reject()
// 2-5. 如果then是个函数，则用call执行then，第一个参数是this，后面是成功的回调和失败的回调
// 2-6. 如果成功的回调还是pormise，就递归继续解析
// 2-7. 成功和失败只能调用一个 所以设定一个called来防止多次调用
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  // 防止多次调用
  let called
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        // 就让then执行 第一个参数是this 后面是成功的回调 和 失败的回调
        then.call(
          x,
          (y) => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject)
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            reject(err) // 失败了就失败了
          }
        )
      } else {
        resolve(x) // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return
      called = true
      // 取then出错了那就不要在继续执行了
      reject(e)
    }
  } else {
    resolve(x)
  }
}

// 结构六，其他问题
// 1. 规范规定onFulfilled,onRejected都是可选参数，如果他们不是函数，必须被忽略
// 1-1. onFulfilled返回一个普通的值，成功时直接等于 value => value
// 1-2. onRejected返回一个普通的值，失败时如果直接等于 value => value，
//      则会跑到下一个then中的onFulfilled中，所以直接扔出一个错误reason => throw err
// 2. 规范规定onFulfilled或onRejected不能同步被调用，必须异步调用。
// 2-1. 我们就用setTimeout解决异步问题
// 2-2. 如果onFulfilled或onRejected报错，则直接返回reject()
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err
          }
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        // 异步
        setTimeout(() => {
          // 如果报错
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    // 返回promise，完成链式
    return promise2
  }
}
```

## async/await

### 生成器 及 协程

ES6 中提出一个叫生成器（Generator）的概念，执行生成器函数，会返回迭代器对象（Iterator），这个迭代器对象可以通过 next() 遍历函数内部的每一个状态。

生成器函数是一个带星号函数，而且是可以暂停执行和恢复执行的。

```js
function* genDemo() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

// 通过执行生成器返回 迭代器对象 gen 💥
var gen = genDemo()

// 💥 迭代器对象通过调用next()方法，遍历下一个内部状态。。。
gen.next()
// { value: "hello", done: false }

gen.next()
// { value: "world", done: false }

gen.next()
// { value: "ending", done: true }

gen.next()
// { value: undefined, done: true }
```

生成器函数的具体使用方式：

1. 在生成器函数内部执行一段代码，如果遇到 yield 关键字，那么 JavaScript 引擎将**返回关键字后面的内容给外部，并暂停该函数的执行**。
2. 外部函数可以通过 next 方法恢复函数的执行。

**那函数为何为暂停和恢复呢**？原因就在于协程，协程是一种比线程更加轻量级的存在。你可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程，比如当前执行的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体现在 A 协程暂停执行，B 协程恢复执行；

正如一个进程可以拥有多个线程一样，一个线程也可以拥有多个协程。最重要的是，**协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源**。

则根据上面代码看出协程的执行顺序：

1. 通过调用生成器函数 genDemo 来创建一个协程 gen，创建之后，gen 协程并没有立即执行。
2. 要让 gen 协程执行，需要通过调用 gen.next。
3. 当协程正在执行的时候，可以通过 yield 关键字来暂停 gen 协程的执行，并返回主要信息给父协程。
4. 如果协程在执行期间，遇到了 return 关键字，那么 JavaScript 引擎会结束当前协程，并将 return 后面的内容返回给父协程。

**注意：**

1. gen 协程和父协程是在主线程上交互执行的，并不是并发执行的，它们之间的切换是通过 yield 和 gen.next 来配合完成的。
2. 当在 gen 协程中调用了 yield 方法时，JavaScript 引擎会保存 gen 协程当前的调用栈信息，并恢复父协程的调用栈信息。同样，当在父协程中执行 gen.next 时，JavaScript 引擎会保存父协程的调用栈信息，并恢复 gen 协程的调用栈信息。

**其实在 js 中，生成器只是协程的一种具体实现方式，协程还能运用在更多的场合**

### 手动实现 async/await

```js
// 实现async
function myAsync(fn) {
  return function () {
    return new Promise((resolve, reject) => {
      const gen = fn.apply(this, arguments)

      function step(key, arg) {
        let result
        try {
          result = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        const { value, done } = result
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(
            (val) => step('next', val),
            (err) => step('throw', err)
          )
        }
      }

      step('next')
    })
  }
}

// 实现 await
function myAwait(promise) {
  return promise.then((result) => {
    if (result instanceof Error) {
      throw result
    } else {
      return result
    }
  })
}

// 使用：
function* myGenerator() {
  const result1 = yield myAwait(fetch('http://example.com/1'))
  const result2 = yield myAwait(fetch(`http://example.com/2/${result1}`))
  return result2
}

const myAsyncFunction = myAsync(myGenerator)

myAsyncFunction().then((result) => {
  console.log(result)
})
```

综上：

- async/await 基于生成器和 promise 实现，往底层说就是微任务和协程应用
- 而上面实现的 myAsync 函数也可以理解为 执行器函数
  - 我们把**执行生成器的代码封装成一个函数，并把这个执行生成器代码的函数称为执行器**（可参考著名的 co 框架）

### 官方的封装

根据 MDN 定义，async 是一个通过**异步执行**并**隐式返回 Promise 作**为结果的函数。

```js
async function foo() {
  return 2
}
console.log(foo()) // Promise {<resolved>: 2}
```

await 的行为：

```js
async function foo() {
  console.log(1)
  let a = await 100
  console.log(a)
  console.log(2)
}

console.log(0)
foo()
console.log(3)
// 0 1 3 100 2

async function foo() {
  console.log(1)
  // 注意await里面会执行
  let a = await console.log(4)
  console.log(a)
  console.log(2)
}
console.log(0)
foo()
console.log(3)
// 0 1 4 3 undefined 2
```

执行顺序：

1. 首先，执行 console.log(0)这个语句，打印出来 0。
2. 紧接着就是执行 foo 函数，由于 foo 函数是被 async 标记过的，所以当进入该函数的时候，JavaScript 引擎会保存当前的调用栈等信息，然后执行 foo 函数中的 console.log(1)语句，并打印出 1。
3. 当执行到 await 100 时，会默认创建一个 Promise 对象，代码如下：

```js
let promise_ = new Promise((resolve,reject){
  resolve(100)
})
```

在这个 promise* 对象创建的过程中，我们可以看到在 executor 函数中调用了 resolve 函数，JavaScript 引擎会将该任务提交给微任务队列。 4. 然后 JavaScript 引擎会暂停当前协程的执行，将主线程的控制权转交给父协程执行，同时会将 promise* 对象返回给父协程。**这时候父协程要做的一件事是调用 promise\_.then 来监控 promise 状态的改变**。 5. 接下来继续执行父协程的流程，这里我们执行 console.log(3)，并打印出来 3。随后**父协程将执行结束，在结束之前，会进入微任务的检查点**，然后执行微任务队列，微任务队列中有 resolve(100)的任务等待执行，然后执行，并触发 promise\_.then 中的回调函数，该回调函数被激活以后，会将主线程的控制权交给 foo 函数的协程，并同时将 value 值传给该协程。 6. foo 协程激活之后，会把刚才的 value 值赋给了变量 a，然后 foo 协程继续执行后续语句，执行完成之后，将控制权归还给父协程。

## Rxjs

Rxjs 是一个响应式编程库，它的底层原理是基于观察者模式和迭代器模式的。它提供了一系列操作符，可以帮助我们处理数据流，如 map、filter、reduce 等等。

在 Rxjs 中，我们可以使用 Observable 对象来表示一个数据流，它可以发出多个值，也可以在发出值时抛出错误或者完成。我们可以使用 subscribe 方法来订阅这个 Observable 对象，从而获取它发出的值。

Rxjs 还提供了一些操作符，可以对 Observable 对象进行转换、过滤、合并等操作。例如，map 操作符可以对 Observable 对象中的每个值进行转换，filter 操作符可以过滤掉 Observable 对象中不符合条件的值。

```js
import { from } from 'rxjs'
import { map, filter } from 'rxjs/operators'

// 创建一个Observable对象
const numbers = from([1, 2, 3, 4, 5])

// 使用map操作符对Observable对象中的值进行平方操作
const squaredNumbers = numbers.pipe(map((x) => x * x))

// 使用filter操作符过滤掉Observable对象中不是偶数的值
const evenNumbers = squaredNumbers.pipe(filter((x) => x % 2 === 0))

// 订阅evenNumbers，获取它发出的值
evenNumbers.subscribe((x) => console.log(x))
```

在上面的示例中，我们使用 from 方法创建了一个 Observable 对象，它包含了一个数组中的值。

然后，我们使用 map 操作符对 Observable 对象中的每个值进行平方操作，再使用 filter 操作符过滤掉不是偶数的值。

最后，我们通过 subscribe 方法来订阅这个 Observable 对象，从而获取它发出的值。
