---
title: '每天一个知识点'
date: Wed Jul 12 2023 09:20:03 GMT+0800 (中国标准时间)
lastmod: '2023-07-12'
tags: ['知识点', '手写']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/daybyday
---

- 每日一题：https://github.com/yuccie/30-seconds-of-code

## 202307

### 20230725

#### 将 rgb 转为 16 进制

- rgb 格式：rgb(255, 121, 245)
- 16 进制：00ff00

2\*\*8 为 256，rgb 的色值是十进制的，挨个从十进制转为 16 进制，然后拼接也行

- parseInt(string, radix) 可以转？parseInt 可以根据 radix 来识别并提取 string 里的数据，比如 2 进制，则只能识别 0-1；
  - **parseInt 更多的是提取指定格式的有效数据**
- toString 可以用在字符串、数字、数组、对象上
  - 数字.toString(radix) 可以将数字转为指定进制的字符串

```js
function rgbToHex(r, g, b) {
  let rString = r.toString(16)
  let gString = g.toString(16)
  let bString = b.toString(16)
  // (0).toString(16) => '0' 位数不够，需要拼凑
  // slice(start, end) 参数1是开始，参数2是结束，参数2默认是结尾
  rString = `0${rString}`.slice(-2)
  gString = `0${gString}`.slice(-2)
  bString = `0${bString}`.slice(-2)
  return `${rString}${gString}${bString}`
}
```

上面方法啰嗦，是先转换，然后再拼接，也可以先拼接一次性转换

```js
function rgbToHex(r, g, b) {
  // 想象下16进制的数据，r应该在最左侧，所以左移16位，g应该在中间，左移8位，然后再按位与得到对应的数值
  // 1 左移一位 ，也就是从1变成了2，因为位运算都是2进制，左移3位，就变成了8
  let rgbStr = ((r << 16) | (g << 8) | b).toString(16)

  // return `0x` + rgbStr.padStart(6, 0)
  return `0x` + `000000${rgbStr}`.slice(-6)
}
rgbToHex(0, 255, 0)
```

### 20230724 事件循环的时序

- 后续可以画个图，drawio【❌】

```js
// 睡眠函数
// 阻断js线程一段时间，然后接着执行
// const sleep = time => Promise.resolve(setTimeout())

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

async function testSleep() {
  console.time('runtime：')
  console.log('1')
  await sleep(2000)
  console.log('2')
  console.timeEnd('runtime：')
}
testSleep()
console.log('开始')
// 1 -》开始 -》两秒后打印2，然后-》runtime: 2004.83984375 ms
```

- 睡眠函数并没有阻断 '开始' 的打印，因为其添加的是事件循环的下一个 nextTick
- 然后 await 会产生一个微任务，从而阻断函数体内的逻辑，但该任务是放在当前宏任务队列的末尾

```js
function testQueue() {
  // part1
  Promise.resolve().then(() => {
    console.log('Promise1')
    setTimeout(() => {
      console.log('setTimeout2')
    }, 0)
    Promise.resolve().then(() => {
      console.log('Promise3')
    })
  })

  // part2
  console.log('begin')

  // part3
  setTimeout(() => {
    console.log('setTimeout1')
    Promise.resolve().then(() => {
      console.log('Promise2')
    })
  }, 0)

  // part4
  setTimeout(() => {
    console.log('s1')
    Promise.resolve().then(() => {
      console.log('p2')
    })
  }, 0)
}

testQueue()
```

1. 函数从上向下执行，先从大的范围来看，一共生成了四个任务，
   1. 第一个，是 then 里的所有部分，生成第一个微任务
   2. 第二个，part 2 同步代码，主线程
   3. 第三个宏任务是 part3
   4. 第四个宏任务是 part4
2. 先执行主线程里的同步任务，也就是 part2
3. 然后执行微任务，也就是 Promise1，然后又注册了一个宏任务 setTimeout，并产生一个微任务，此时已经没有同步代码执行了，继续执行该微任务 Promise3
4. 微任务执行完，开始执行宏任务，也就是 setTimeout1，然后再执行对应的微任务也就是 Promise2
5. 然后再是宏任务，也就是 s1，再是微任务 p2，最后是最后注册的 setTimeout2

```js
console.log('start script') // 主001

setTimeout(() => console.log('setTimeout'), 0) // 宏001

new Promise((resolve) => {
  console.log('promise 1') // 主002
  resolve()
})
  .then(() => {
    // 首先注册 promise 2，此时 promise 2不执行的话
    // promise 3 是不会注册的。
    console.log('promise 2') // 微001
  })
  .then(() => {
    console.log('promise 3') // 微003
  })

Promise.resolve().then(() => console.log('promise 4')) // 微002

console.log('script end') // 主003
```

```js
async function async1() {
  console.log('async1 start')
  // await 这一行里面的逻辑，如果不是promise，则会自动Promise.resolve(console.log("async2"))
  await async2()
  // await下面的代码，相当于与上方promise.then()里的逻辑
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')

/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
```

总结：

- 代码分类：主线程的同步代码，事件循环里的宏任务和微任务
- 首先将同步代码全部执行完毕
- 然后执行一个宏任务，再执行其对应的全部微任务
- await 同一行的逻辑，其实可以理解为 Promise.resolve 包装下即可，若是 promise 则无所谓，若不是则包装下
- 然后 await 下面的逻辑，则是上面 await 产生 promise.then 里的回调。
- 任务注册也是一个一个的注册，只有当前微任务执行完，才会注册下一个微任务，但注册的事件都是排队才能注册

### 20230712 生命周期

#### 小程序生命周期

生命周期，在应用或者组件的整个生命周期过程中，不同时期对外暴露的钩子，其实就是对外暴露一个回调函数

**应用程序的生命周期**

- onLaunch 监听小程序实例初始化，全局只触发一次
- onShow 从后台切换到前台
- onHide 从前台切换到后台
- onError 发生脚本或 api 错误都会进来
- onUnhandledRejection 监听到小程序示例有未处理的 promise reject 错误
- onPageNotFound 小程序要打开的页面不存在
- onThemeChange 监听到主题发生变化

> 创建小程序时，App() 必须在 app.js 中调用，必须调用且只能调用一次。不然会出现无法预期的后果。

QA:

- 切换到前台和后台，是打开小程序和关闭小程序吗？还是长按切换？在 app 内部又是如何表现？
- 不管是实例，还是页面，还是组件，都有个构造函数，然后入参就是对应页面、组件、实例的配置，包含生命周期

**页面的生命周期**

- onLoad 页面初次加载，只是执行钩子，页面元素并没有创建
- onShow 监听页面显示
- onReady 监听页面初次渲染完成
- onHide 监听页面隐藏
- onUnload 监听页面卸载

- onShareAppMessage 分享

**组件的生命周期**

- created 组件实例刚刚被创建时，此时无法使用 setData
- attached 组件实例进入到页面节点树时，用于处理组件初始化相关的逻辑
- ready 组件布局完成时，处理组件渲染完成后的逻辑，例如获取 DOM 节点、执行页面操作，以及与其他组件进行交互等。当组件的页面节点树完成渲染，即组件的所有子组件也都渲染完毕后，ready 生命周期会被触发。
- moved 组件实例被移动到节点树其他的位置
- detached 组件实例从节点树移除时
- lifetimes 组件的生命周期也可以在这里定义，优先级比外层高
  - created 组件实例刚刚被创建时，此时无法使用 setData
  - attached 组件实例进入到页面节点树时
  - ready 组件布局完成时
  - moved 组件实例被移动到节点树其他的位置
  - detached 组件实例从节点树移除时
  - error 当组件方法抛出错误时发生
- pageLifetimes 组件所在页面的生命周期声明对象
  - show 组件所在页面被展示时执行
  - hide 组件所在页面被隐藏时执行
  - resize 组件所在的页面尺寸变化时执行
  - routeDone 组件所在页面路由动画完成时执行

> 自定义 tabBar 的 pageLifetime 不会触发。
