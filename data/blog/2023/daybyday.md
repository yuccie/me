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

## 202308

### 20230818 防抖节流

#### 防抖

- 持续触发，最后一次生效
- 入参是函数
- **返回也必须是函数，因为返回值需要在页面调用**，因此下方不对

```js
const debounce = (fn, interval) => {
  let timer = null
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(fn, interval)
}
```

正确答案：

```js
const debounce = (fn, interval = 300) => {
  let timer = null
  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(fn, interval)
  }
}
```

如何立即执行一次呢？

- 立即执行就和定时器没有关系了
- 然后需要在定时器里，将 immediate 重置

```js
const debounce = (fn, interval = 300, immediate = true) => {
  let timer = null
  return function (...args) {
    if (immediate) {
      fn.apply(this, args)
      immediate = false
    } else {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        immediate = true
      }, interval)
    }
  }
}
```

#### 节流

- 指定间隔定时执行
- 返回函数
- 如果正在运行，则停止

```js
const throttle = (fn, interval = 300, immediate = true) => {
  let isRun = false
  return function (...args) {
    if (!isRun) {
      isRun = true
      setTimeout(() => {
        fn.apply(this, args)
        isRun = false
      }, interval)
    }
  }
}
```

如果需要立即执行呢？

```js
const throttle = (fn, interval = 300, immediate = true) => {
  let isRun = false

  return function (...args) {
    if (!isRun) {
      if (immediate) {
        isRun = true
        immediate = false
        fn.apply(this, args)
        isRun = false
        // immediate = true // 这个置为false后，就不能再重置回来
      } else {
        isRun = true
        setTimout(() => {
          fn.apply(this, args)
          isRun = false
          immediate = true
        }, interval)
      }
    }
  }
}
```

但是上面的有点问题，就是立即执行后，需要清空定时器，不然会立即执行完，再次执行定时器

```js
const throttle = (fn, interval = 300, immediate = true) => {
  let isRun = false
  let timer = null
  return function (...args) {
    if (!isRun) {
      if (immediate) {
        immediate = false
        isRun = true
        clearTimeout(timer) // 都立即执行了，需要清除定时器
        fn.apply(this, args)
        isRun = false
      } else {
        isRun = true
        timer = setTimeout(() => {
          fn.apply(this, args)
          isRun = false
          // 理论上这里添加 immediate = true 可以保证后续继续立即执行
          // 但是添加完后，可能立即出发immediate的逻辑，导致快速执行两次
        }, interval)
      }
    }
  }
}
```

上面的还有 bug，只有第一次是立即执行，之后就不是了。。。使用标志位不太好兜底，需要用计时器

```js
const throttle = (fn, duration = 300) => {
  let timer = null
  let lastTime = 0

  return function (...args) {
    let currentTime = Date.now()
    let restTime = duration - (currentTime - lastTime)

    // 如果没有剩余时间，则立即执行，同时清除定时器
    if (restTime <= 0) {
      clearTimeout(timer)
      timer = null
      fn.apply(this, args)
      lastTime = currentTime // lastTime是上次执行的时间，因此这里这样赋值
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
        lastTime = Date.now()
      }, restTime)
    }
  }
}
```

### 20230817 布局

#### 两栏布局

- 浮动布局
- flex 布局

```html
<!-- 1、使用 float 左浮左边栏
2、右边模块使用 margin-left 撑出内容块做内容展示
3、为父级元素添加 BFC，防止下方元素飞到上方内容 -->
<style>
  .box {
    /* 添加BFC */
    overflow: hidden;
  }

  .left {
    float: left;
    width: 200px;
    background-color: gray;
    height: 400px;
  }

  .right {
    margin-left: 210px;
    background-color: lightgray;
    height: 200px;
  }
</style>
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```

```html
<!-- 1、flex 容器的一个默认属性值: align-items: stretch;
2、这个属性导致了列等高的效果。 为了让两个盒子高度自动，需要设置: align-items: flex-start -->

<style>
  .box {
    display: flex;
  }

  .left {
    width: 100px;
  }

  .right {
    flex: 1;
  }
</style>
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```

#### 三栏布局

实现三栏布局中间自适应的布局方式有：

- 两边使用 float，中间使用 margin
- 两边使用 absolute，中间使用 margin
- 两边使用 float 和负 margin
- flex 实现
- grid 网格布局

### 20230817 遍历对象

```js
const obj = {
  c: 'c',
  2: '2',
  1: '1',
  a: 'a',
  5: '5',
  4: '4',
  '5k': '5k',
  '4k': '4k',
}
const objString = JSON.stringify(obj)
console.log(JSON.stringify(obj)) // {"1":"1","2":"2","4":"4","5":"5","c":"c","a":"a","5k":"5k","4k":"4k"}
console.log(JSON.parse(objString)) // {1: '1', 2: '2', 4: '4', 5: '5', c: 'c', a: 'a', 5k: '5k', 4k: '4k'}

console.log(Object.keys(obj)) // ['1', '2', '4', '5', 'c', 'a', '5k', '4k']

for (const item in obj) {
  console.log(item)
  // '1', '2', '4', '5', 'c', 'a', '5k', '4k'
}
```

- 序列化时，对象 key 的顺序会发生变化，根本原因对象在内存中存储并不是有序的，而无序只是浏览器各厂商实现的一套规则
  - 比如 数字按大小排序，字符串则按先后顺序
    - '3', '1' 这种 Number 后为纯数字的，依然按数字处理，处理完后还是 1、3 排序
    - '3k', '1k'，这种 Number 后不是纯数字的，则按字符串，也就是定义的先后顺序排列
  - 普通对象里，key 为 2，和 key 为'2' 是一个值，后面的覆盖前面的。
- JSON.stringify、Object.keys 得到的 key 顺序是一致的。
- for in 遍历对象顺序也是同上
- 而 forEach 是数组的方法，数组遍历肯定是有序的，只是 在 forEach 前执行了 Object.keys 把顺序变化了。

for of 可以保证顺序怎么解释？

- for of 无法遍历普通对象，只能遍历可迭代对象
- 那如果将普通对象转为可迭代对象呢？

```js
const obj = {
  c: 'c',
  2: '2',
  1: '1',
  a: 'a',
  5: '5',
  4: '4',
  '5k': '5k',
  '4k': '4k',
  [Symbol.iterator]: function* () {
    const keys = Object.keys(this)
    for (const key of keys) {
      yield { key, value: this[key] }
    }
  },
}

for (const entry of obj) {
  console.log(entry.key)
  // '1', '2', '4', '5', 'c', 'a', '5k', '4k'
}
```

原来保证顺序的前提，依然是通过 Objec.keys 实现了排序。。。

而对于可迭代对象，天然的具有顺序

- 在底层，Map 对象内部使用红黑树（Red-Black Tree）数据结构来存储键值对。红黑树是一种自平衡二叉搜索树，它具有良好的插入、删除和查找性能，并且可以保持键的有序性。
- 当你使用 Map 的 set() 方法添加键值对时，它会根据键的大小顺序自动进行插入，并保持红黑树的平衡性。这就是为什么在遍历 Map 对象时，键值对会按照键的顺序进行输出。
- 而普通对象（Object）是无序的

```js
var myMap = new Map()
myMap.set('2', '2')
myMap.set('1', '1')

for (const t of myMap) {
  console.log(t)
  // ['2', '2']
  // ['1', '1']
}

for (const [key, value] of myMap) {
  console.log(`Key: ${key}, Value: ${value}`)
  // Key: 2, Value: 2
  // Key: 1, Value: 1
}
```

### 20230816 code 编码

- 早期使用 ASCII 码
- 后来是 Unicode，而 utf-8 是可变长度编码，为 Unicode 的实现方式之一，有利于数据压缩，但需要更多的计算和处理时间

从对应的字符得到对应的 unicode 码

- str.charCodeAt(0)
- str.codePointAt(0) // 支持大于四字节

将 unicde 码转为字符串

- String.fromCharCode(72) // 'H'

进制转换

- ParseInt 只是根据指定的 radix 进制数，**识别字符串中对应进制的数据**而已，默认 10。如果不是对应进制，则停止识别
- toString
  - 对于字符串类型，原样返回
  - 对于数字类型，可以接受一个进制数，进而做到进制转换
  - 对于数组，toString()方法将数组中的每个元素转换为字符串，并用逗号分隔
  - 对于对象类型，toString()方法默认返回"[object Object]"。
  - 🔥🔥 如果想要自定义 toString()方法的返回值，可以在对象中定义一个 toString()方法
  - null，undefined 直接报错

decodeURI 与 decodeURIComponent

- 底层原理是一样的，只是转换的字符数量不同而已
- encodeURI 转换的字符数量是 encodeURIComponent 的子集

```js
// 多次编码，再解码到最开始的状态
const formatCode = (str) => {
  while (decodeURIComponent(str) !== str) {
    str = decodeURIComponent(str)
  }
  return str
}
```

Base64 格式可以追溯到早期电子邮件的通信协议上，由于当时只有 ASCII 吗，如何将所有二进制数据转换为 ASCII 码呢

- 将原来 3 个 8 位字节转为 4 个 6 位字节，然后将 6 位字节就可以转为 ASCII 码了
- 因为编码变长了，所以 base64 数据量也增加原来的 1/3

JSON.stringfy

- 如果一个对象具有 toJSON，那么它会被 JSON.stringify 调用。
- let json = JSON.stringify(value[, replacer, space])，
  - replacer 要编码的属性数组或映射函数，如果指定数组，则只编码指定的内容
  - space 还可以是字符串代替空格
- 将对象转换为 JSON。
- JSON 是语言无关的纯数据规范，因此一些特定于 JavaScript 的对象属性会被 JSON.stringify 跳过。如函数、symbol，undefined

```js
let room = {
  number: 23,
}

let meetup = {
  title: 'Conference',
  date: new Date(Date.UTC(2017, 0, 1)),
  room,
}

alert(JSON.stringify(meetup))
/*
  {
    "title":"Conference",
    "date":"2017-01-01T00:00:00.000Z",  // (1)
    "room": {"number":23}               // (2)
  }
*/
```

在这儿我们可以看到 date (1) 变成了一个字符串。这是因为所有日期都有一个内建的 toJSON 方法来返回这种类型的字符串。

现在让我们为对象 room 添加一个自定义的 toJSON：

```js
let room = {
  number: 23,
  toJSON() {
    return this.number
  },
}

let meetup = {
  title: 'Conference',
  room,
}

alert(JSON.stringify(room)) // 23

alert(JSON.stringify(meetup))
/*
  {
    "title":"Conference",
    "room": 23
  }
*/
```

### 20230815 拦截器递归栈溢出

```js
const state = { a: 11 }
Object.defineProperty(state, 'a', {
  get() {
    return state.a
  },
  set(newVal) {
    state.a = newVal
  },
})
```

上面代码会出现一个问题，因为在 get 和 set 中都尝试访问 state.a，这将导致无限循环的调用，最终导致栈溢出错误。这是因为 get 和 set 的内部实现实际上在访问 state.a 时再次触发 get 和 set，从而形成递归调用。**这里的 get 和 set 都会递归触发**

正确的做法是，在 get 和 set 中使用一个新的变量来存储值，而不是直接访问 state.a，以避免递归调用。

```js
const state = { _a: 11 }

Object.defineProperty(state, 'a', {
  get() {
    return state._a
  },
  set(newVal) {
    state._a = newVal
  },
})

// 对于对象
Object.defineProperty(state, 'fromStation', {
  get() {
    return state._fromStation
  },
  set(val) {
    console.log('djch set ', val)
    state._fromStation = val
  },
})
```

当然还可以使用 proxy

```js
import state from 'xxx/index'
import { createStore } from '@mpxjs/core'

const isObject = (data) => Object.prototype.toString.call(data).slice(8, -1) === 'Object'

function reactive(obj) {
  if (!isObject(obj)) {
    return obj
  }

  const proxyObj = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      const tempRes = isObject(res) ? reactive(res) : res
      // if (key === 'xxxModel') {
      //   console.log('djch get ', res)
      // }
      if (key === 'xxxStation') {
        console.log('djch get xxxStation', res)
      }
      return tempRes
      // return res
    },
    set(target, key, val, receiver) {
      const res = Reflect.set(target, key, val, receiver)
      // if (key === 'xxxModel') {
      //   console.log('djch set xxxModel', val)
      // }
      if (key === 'xxxStation') {
        console.log('djch set xxxStation', val)
      }
      return res
    },
  })

  return proxyObj
}
const tempState = reactive(state)

export default createStore({
  state: tempState,
})
```

- 务必注意，要想 store 里响应式，不能直接赋值，需要使用对应 mutations
- 不要在 watch 里，再次更新 store 里的数据，会持续触发
- 不要在 get 和 set 里直接访问某个对象，这样会触发递归调用，导致堆栈溢出

### 20230814

```js
const arr = [1, 2, 3, 4]
const arr1 = arr.reduce((acc, cur) => [...acc, cur + +acc.slice(-1)], [])
// [1, 3, 6, 10]
```

```js
const addDaysToDate = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

addDaysToDate('2020-10-15', 10) // '2020-10-25'
addDaysToDate('2020-10-15', -10) // '2020-10-05'
```

### 20230814 请求取消

1. 建 XMLHttpRequest 对象： 在发起网络请求前，首先需要创建一个 XMLHttpRequest 对象。这个对象可以用来设置请求的参数、发送请求以及处理响应。
2. 发送请求： 调用 xhr.send() 方法开始发送请求。这时，浏览器会建立一个与服务器的连接，并发送请求。
3. 监测取消状态： 在 XMLHttpRequest 对象中，有一个名为 readyState 的属性，它表示请求的当前状态。当请求被取消时，readyState 会变为 4（已完成）。
4. 调用 xhr.abort()： 当你调用 xhr.abort() 方法时，浏览器会中断与服务器的连接。此时，readyState 会变为 4，并且 status 会变为 0。
5. 触发事件： 在取消请求时，会触发 readystatechange 事件。你可以通过监听这个事件来捕获取消操作。
6. 清理资源： 浏览器会立即关闭连接并释放相关资源，以便其他操作或请求。

需要注意的是，虽然 xhr.abort() 可以中断请求，但这只会中断连接，并不会保证服务器端已经停止处理请求。服务器可能已经处理了部分请求，因此在实际应用中，可能需要在前端和后端都进行相应的处理，以避免因取消请求而导致的异常情况。

```js
// Step 1：创建一个控制器（controller）：
let controller = new AbortController()
// 它具有单个方法 abort()，和单个属性 signal。
// 当 abort() 被调用时：
//    abort 事件就会在 controller.signal 上触发
//    controller.signal.aborted 属性变为 true。
// 任何对 abort() 调用感兴趣的人，都可以在 controller.signal 上设置监听器来对其进行跟踪。
let signal = controller.signal

// 当 controller.abort() 被调用时触发
signal.addEventListener('abort', () => alert('abort!'))

controller.abort() // 中止！

alert(signal.aborted) // true
```

```js
// Step 2：将 signal 属性传递给 fetch 选项：
let controller = new AbortController()
fetch(url, {
  signal: controller.signal,
})
// fetch 方法知道如何与 AbortController 一起使用，它会监听 signal 上的 abort。

// Step 3：调用 controller.abort() 来中止：
controller.abort()
```

完整实例：

```js
// 1 秒后中止
let controller = new AbortController()
setTimeout(() => controller.abort(), 0)

try {
  let response = await fetch('https://www.baidu.com', {
    signal: controller.signal,
  })
} catch (err) {
  if (err.name == 'AbortError') {
    // handle abort()
    alert('Aborted!')
  } else {
    throw err
  }
}
```

- 原理其实就是，通过一个类，暴露出一个 singal，abort，然后请求实例底层都会监听这个事件，监听到后处理与服务器之间的联系，同时清空请求在浏览器侧的内存及带宽等。
- 在微信小程序测，则需要微信提供的 api 才可以，目前微信开放社区很多反应，ide 没问题，但是真机上不行。

```js
const requestTask = wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: '',
  },
  header: {
    'content-type': 'application/json',
  },
  success(res) {
    console.log(res.data)
  },
})
requestTask.abort() // 取消请求任务
```

### 20230811 深浅拷贝

```js
// 版本一：
// Object.prototype.toString 方法不能调用再call
// const isObject = val => Object.prototype.toString().call(val).slice(8, -1) === 'Object'

const isObject = (val) => Object.prototype.toString.call(val).slice(8, -1) === 'Object'

const deepClone = (target) => {
  const res = Object.create(null)

  Object.keys(target).forEach((key) => {
    if (isObject(target[key])) {
      res[key] = deepClone(target[key])
    } else {
      res[key] = target[key]
    }
  })

  return res
}

const originalObj = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
}
const result1 = deepClone(originalObj)
// {
//     "name": "John",
//     "age": 30,
//     "address": {
//         "city": "New York",
//         "country": "USA"
//     }
// }

// 如果是数组和其他数据类型呢？
const originalObj1 = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
  arr: [1, 2],
  fn: () => console.log('fn'),
  date: new Date(),
  symbol: Symbol(), // 不是构造函数，不能用 new
}

const res1 = deepClone(originalObj1) // 在浏览器里其实可以看到并使用对应的date，fn，symbol等，但复制出来后就没有了
// 虽然可以看到 fn，date，symbol，但他们并不是深拷贝，而是浅拷贝
// res1.fn === originalObj1.fn // true
// 右键复制对象时，对象中的函数和 Date 格式的数据无法直接复制是因为浏览器在执行对象的字符串化操作（将对象转换为字符串以便复制）时，会默认忽略函数和 Date 对象。这是为了避免复制对象时出现不必要的复杂性和安全性问题。
// {
//     "name": "John",
//     "age": 30,
//     "address": {
//         "city": "New York",
//         "country": "USA"
//     },
//     "arr": [
//         1,
//         2
//     ],
//     "date": "2023-08-11T00:56:53.525Z"
// }
```

上面的深拷贝无法兼容数组和其他数据类型

```js
function cloneDeep(target) {
  const wMap = new WeakMap()

  const isType = val => Object.prototype.toString.call(val).slice(8, -1)

  const _deep = data => {
    // 对于时间格式的，可以重新生成一个新的时间对象
    if (data instanceof Date) {
      return new Date(data.getTime());
    }

    // 非数组和对象，直接返回要克隆的对象
    !['Array', 'Object'].includes(isType(data)) return data

    // 如果对象已经使用过了，则直接返回
    if (wMap.has(data)) return wMap.get(data);

    // 判断是数组还是对象
    const res = isType(data) === 'Array' ? [] : Object.create(null)

    // 将目标对象存起来
    wMap.set(data, res)

    Object.keys(data).forEach(key => {
      if (res[key]) return
      res[key] = _deep(data[key])
    })
    return res
  }

  return _deep(target)
}
```

- 深拷贝其实一般针对的是 Object，Array，像 fn，symbol 等指针本身就一份，所以即使深拷贝也是相同的，但 Date 可以再次生成一个新的时间对象，从而实现深拷贝。
- [深拷贝的 playground](https://playcode.io/lodash)

### 20230810 ref() vs reative()

> reactive() 只适用于对象 (包括数组和内置类型，如 Map 和 Set)。而另一个 API ref() 则可以接受任何值类型。ref 会返回一个包裹对象，并在 .value 属性下暴露内部值。

为什么要使用 ref，因为在标准的 JavaScript 中，检测普通变量的访问或修改是行不通的。然而，我们可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。

该 .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。从概念上讲，你可以将 ref 看作是一个像这样的对象：

```js
// 伪代码，不是真正的实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  },
}
```

另一个 ref 的好处是，与普通变量不同，你可以将 ref 对象 传递给函数，同时保留对最新值和响应式连接的访问。当将复杂的逻辑重构为可重用的代码时，这将非常有用。

当将普通变量传递给函数时，函数内部无法直接访问和修改普通变量的最新值。普通变量的传递是按值传递的，函数内部对传递的变量进行修改不会影响原始变量的值。

如果你将数据包装为 ref 对象，并将 ref 对象传递给函数，函数内部就可以直接访问 ref 对象的 .value 属性来获取最新的值。这样，无论何时调用函数，它都可以自动获取到最新的值，并且对值的修改也会保持响应式连接。

- 在 js 里使用 ref 定义的变量，必须使用 .value 属性，在模版里不需要使用 .value
- 一般原始类型的数据使用 ref，复杂数据类型使用 reactive 函数。

### 20230810 拦截器

当你使用 Object.defineProperty 对某个属性进行拦截时，会覆盖 Vue 框架对该属性的 Object.defineProperty 拦截，从而可能导致一些问题，包括 Vue 的 watch 失效。

```js
const isObject = (data) => Object.prototype.toString.call(data).slice(8, -1) === 'Object'

function reactive(obj) {
  if (typeof obj !== 'object' && obj !== null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      // 如果是深层嵌套则需要在这里继续
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    },
  })
  return observed
}

const state = reactive({
  foo: 'foo',
  bar: { a: 1 },
})

// 1.获取
state.foo // ok
// 2.设置已存在属性
state.foo = 'fooooooo' // ok
// 3.设置不存在属性
state.dong = 'dong' // ok
// 4.删除属性
delete state.dong // ok
```

- 需要返回整个对象

### 20230809 小程序分包

在构建小程序分包项目时，构建会输出一个或多个分包。每个使用分包小程序必定含有一个主包。

- 所谓的主包，即放置默认启动页面/TabBar 页面，以及一些所有分包都需用到公共资源/JS 脚本；其实也就是 app.json 里 pages 下的文件以及其内部引用的文件。
- 而分包则是根据开发者的配置进行划分。

在小程序启动时，默认会下载主包并启动主包内页面，当用户进入分包内某个页面时，客户端会把对应分包下载下来，下载完成后再进行展示。

**打包原则**

- 声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到主包中
- 主包也可以有自己的 pages，即最外层的 pages 字段。
- subpackage 的根目录不能是另外一个 subpackage 内的子目录
- tabBar 页面必须在主包内

**引用原则**

- packageA 无法 require packageB JS 文件，但可以 require 主包、packageA 内的 JS 文件；使用 分包异步化 时不受此条限制
- packageA 无法 import packageB 的 template，但可以 require 主包、packageA 内的 template
- packageA 无法使用 packageB 的资源，但可以使用主包、packageA 内的资源

总结起来，微信小程序的分包之间默认是不能直接引用资源的，但可以使用全局注册和引用机制来间接引用主包或根包中注册的资源。

### 20230809 Eslint

ESLint 是一款开放源代码的 JavaScript lint 工具，用于识别和报告在 JavaScript 代码中发现的模式，让你可以修正代码并遵循你的代码约定。**ESLint 使用一个解析器将你的代码转换成一个抽象语法树 (AST)，然后在该树上运行一系列规则，以标识和报告潜在问题。**

如果你想查看 ESLint 解析器（例如，espree 或 babel-eslint）解析后的代码，你可能想要查看生成的 AST。有几个工具可以帮助你做到这一点，包括：

- [AST Explorer](https://astexplorer.net/): 这是一个在线工具，你可以在其中粘贴你的代码，然后选择你的解析器（例如，ESLint、Babel-ESLint 或 @typescript-eslint/parser），以查看生成的 AST。
- 使用 @babel/parser：你可以安装并使用 @babel/parser 在你的代码中生成 AST。下面是一个示例代码：

```js
const parser = require('@babel/parser')
const fs = require('fs')

const code = fs.readFileSync('your-file.js', 'utf-8')
const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] })

console.log(JSON.stringify(ast, null, 2)) // Pretty print the AST
```

```js
// 下一行注释
// eslint-disable-next-line
console.log('这行代码将被 ESLint 忽略')
console.log('这行代码不会被 ESLint 忽略')

// 多行注释

/* eslint-disable */
console.log('This line will be ignored by ESLint')
console.log('So will this line')
/* eslint-enable */
console.log('This line will be checked by ESLint again')

// 整个文件注释
/* eslint-disable-next-line */
console.log('This line will be ignored by ESLint')
console.log('So will this line')
```

综上：

- eslint 会首先使用 parser 解析器，将源码解析成对应的 AST，解析器有很多种，不同的解析器支持的功能不同
- 如果源码中有注释内容，也会一并解析成对应的 ast，然后 eslint 再根据对应的规则去匹配
- 如果 parser 阶段就报错了，通常使用注释是无法解决的，因为注释生效阶段是 parser 之后。
- ESLint 的解析器和规则引擎是其核心组件，用于解析 JavaScript 代码并应用规则进行静态代码分析。

## 202307

### 20230728 接雨水 & 去除相邻重复的字符

#### 接雨水

想象有一排高低不同的柱子，如果柱子之间有矮的柱子，则可以存水。那一共可以接多少雨水？

```js
function trap(heights) {
  let left = 0
  let right = heights.length - 1
  let maxLeft = 0
  let maxRight = 0
  let results = 0

  while (left < right) {
    // 如果左侧的比右侧的小，则先统计小值，从小到大
    if (heights[left] < heights[right]) {
      if (heights[left] > maxLeft) {
        maxLeft = heights[left]
      } else {
        // 想象这一排柱子的两头分别有堵墙
        results += maxLeft - heights[left]
      }
      left++
    } else {
      if (heights[right] > maxRight) {
        maxRight = heights[right]
      } else {
        results += maxRight - heights[right]
      }
      right--
    }
  }
  return results
}
const heights = [2, 1, 2]
console.log(trap(heights)) // 1
```

#### 去除相邻重复的字符

1. 遍历字符串，如果当前一个与前一个相同，则删除当前、

```js
// abbbbad
function delRepeat(strs) {
  const stacks = []
  for (let i = 0; i < strs.length; i++) {
    if (stacks.length && stacks[stacks.length - 1] === strs[i]) {
      stacks.pop()
    } else {
      stacks.push(strs[i])
    }
  }
  return stacks.join('')
}
delRepeat('abbbbad') // d
```

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

```js
const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')
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
