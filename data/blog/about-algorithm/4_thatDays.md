---
title: 那些日子
date: Sun Nov 19 2023 16:06:28 GMT+0800 (中国标准时间)
lastmod: 2023/11/19
tags: [day, 巩固]
draft: false
summary: 要想看起来毫不费力,就需要背后用尽全力
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-algorithm/4_那些日子.md
---

## 20240118 周四

### 使用 requestAnimationFrame 实现一个 setinterval

其实也不是很准，因为浏览器 1s 是 60fps，因此 requestAnimationFrame 最快也得 16.6ms 才可以绘制。

```js
function mySetInterval(cb, interval) {
  let start = Date.now()

  function loop() {
    let current = Date.now()
    if (current - start >= interval) {
      // 如果大于间隔，则立马执行
      cb()
      // 并重置start
      start = Date.now()
    }
    // 否则压入回调，待下一次循环
    requestAnimationFrame(loop)
  }

  // 立马压入回调
  requestAnimationFrame(loop)
}
```

但是上面的方法，无法执行小于 16.6ms 的 case，如果需要更加精确，则需要如下：

```js
function mySetInterval(callback, interval) {
  let start = Date.now()
  function run() {
    const current = Date.now()
    if (current - start >= interval) {
      callback()
      start = Date.now()
    }
    // 只是将run加入回调，具体是否执行 callback，还需要 current - start >= interval 说了算
    setTimeout(run, 0) // 使用setTimeout来实现更精确的时间间隔
  }
  setTimeout(run, 0)
}
```

### 原型链相关

- 我们创建的每一个函数都有一个 prototype（原型）属性，被称为显示原型，这个属性是一个指针，指向一个对象（原型对象）。
- 这个对象的好处是，在它上面定义的属性和方法可以由特定类型的所有实例共享。
- 原型对象默认拥有一个 constructor 属性，指向它的构造函数
- JavaScript 中所有的对象都是由它的原型对象继承而来。
- 而原型对象自身也是一个对象，它也有自己的原型对象，这样层层上溯，就形成了一个类似链表的结构，这就是原型链

```js
// JavaScript 是一门基于原型的语言，在软件设计模式中，有一种模式叫做原型模式

function Person() {}

const personA = new Person()

console.log(personA.__proto__) //{ constructor : ƒ Person() }
console.log(personA.__proto__ === Person.prototype) // true)
console.log(Object.getPrototypeOf(personA) === Person.prototype) // true
console.log(personA.__proto__ === Object.getPrototypeOf(personA)) // true

// [[Prototype]] 是在 JavaScript 中实例的特殊隐藏属性，但因为无法直接被访问到，因此可以透过 __proto__ 的访问方法。

// __proto__ 是实例对象上的属性
// prototype 是构造函数上的属性，函数上就有
console.log(personA.__proto__ === Person.prototype) // true)
```

- 在已经创建了实例的情况下重写原型，会切断现有实例与新原型之间的联系
- 如果要重写原型，一定要在重写原型后，再创建实例。

```js
function Person(name) {
  this.name = name
}

// 在重写实例之前创建，p1还是指向 Person 旧实例
let p1 = new Person('小明')
Person.prototype.eat = function () {
  console.log(`${this.name}在吃饭`)
}

// 重写原型
Person.prototype = {
  name: '小明',
  sayHello() {
    console.log(`大家好，我是${this.name}`)
  },
}

p1.eat() // 小明在吃饭，指向的依然旧的
p1.sayHello() // p1.sayHello is not a function
```

重写原型对象，会导致原型对象的 constructor 属性指向 Object ，导致原型链关系混乱，所以我们应该在重写原型对象的时候指定 constructor( 指定后 instanceof 仍然会返回正确的值)

```js
function Person() {}
Person.prototype = {} //重写原型,{}是一个对象实例，对象实例的原型指向的是Object.prototype,而Object.prototype中的constructor指向的是Object
console.log(Person.prototype.constructor === Object) //true

// 单独指定constructor
// 重写原型,在prototype中需要重新指定constructor的值
Person.prototype = {
  constructor: Person,
}
console.log(Person.prototype.constructor === Person) //true
```

```js
// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
Object.create(proto[,propertiesObject])
// proto 新创建对象的原型对象
// propertiesObject 可选。需要传入一个对象，将为新创建的对象添加指定的属性值和对应的属性描述符。

// 手动实现一个Object.create
function create(proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }

  // 1、声明构造函数
  // 2、指定原型对象
  // 3、实例化
  // 4、使用 Object.defineProperties 修饰实例
  // 5、返回最新的实例对象
  function F() {}
  F.prototype = proto;
  const obj = new F();

  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj;
}
```

说说 [] 的原型链 ？

```js
let arr = [1, 2, 3]
console.log(arr.__proto__ === Array.prototype) // true  所有数组都是由Array构造出来
console.log(Array.prototype.__proto__ === Object.prototype) // true  Array构造函数的是由 Object构造出来的。
console.log(Object.prototype.__proto__) // null Objec.prototype 指向的原型对象同样拥有原型，不过它的原型是 null ，而 null 则没有原型
```

实现一个 instanceof 方法

```js
// 我们需要持续检查对象的原型链，看看它是否是 指定构造函数 的实例。
function myInstanceOf(obj, constructor) {
  // constructor 是函数，如果非函数，则报错
  if (typeof constructor !== 'function') {
    throw new Error('Right-hand side of instanceof is not callable')
  }

  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false
  }

  // 获取当前对象的原型
  let proto = Object.getPrototypeOf(obj)
  while (proto !== null) {
    // 如果原型 与 构造函数的原型相等，说明是
    if (proto === constructor.prototype) {
      return true
    }
    // 否则继续获取原型的原型。
    proto = Object.getPrototypeOf(proto)
  }
  // 如果还没结果，则返回false
  return false
}
```

### 拍平一个树状结构

```js
// 写一个函数，将树状结构，解析成拍平的对象
const obj1 = {
  a: {
    b: {
      c: 1,
    },
    bb: 2,
  },
  d: {
    dd: 1,
  },
}

const convertObj = (obj) => {
  // 树形结构
  // 遍历：深度和广度优先遍历
  // 深度用栈，广度有队列
  const res = {}

  const dfs = (data, path) => {
    Object.keys(data).forEach((key) => {
      // 注意：创建一个新的path数组，而不是直接修改原始的path数组。这样可以确保在不同的递归层级中使用不同的path数组，避免共享状态导致的问题
      // path = path.concat(key) ❌
      // path.push(key)  ❌
      const newPath = path.concat(key)
      if (typeof data[key] !== 'object') {
        res[newPath.join('.')] = data[key]
      } else {
        // path.push(key); ❌
        dfs(data[key], newPath)
      }
    })
  }

  dfs(obj, [])
  return res
}
console.log(convertObj(obj1))
// {a.b.c: 1, a.bb: 2, d.dd: 1}
```

## 20240101 周四

```js
// 有这么一个数据结构:
const data = [
  {
    id: '1',
    sub: [
      {
        id: '2',
        sub: [
          {
            id: '3',
            sub: null,
          },
          {
            id: '4',
            sub: [
              {
                id: '6',
                sub: null,
              },
            ],
          },
          {
            id: '5',
            sub: null,
          },
        ],
      },
    ],
  },
  {
    id: '7',
    sub: [
      {
        id: '8',
        sub: [
          {
            id: '9',
            sub: null,
          },
        ],
      },
    ],
  },
  {
    id: '10',
    sub: null,
  },
]

// 现在给定一个id，要求实现一个函数
function findPath(data, id) {}

// 返回给定id在 data 里的路径
// 示例:
// id = "1" => ["1"]
// id = "9" => ["7", "8", "9"]
// id = "100"=> []
// PS: id 全局唯一，无序

// 现在给定一个id，要求实现一个函数
function findPath(data, id) {
  let path = []

  // 深度优先
  function dfs(node, curPath) {
    // 如果找到了，就赋值path
    if (node.id === id) {
      path = curPath.concat(node.id)
    } else if (Array.isArray(node.sub)) {
      // 没找到，则递归遍历子节点
      for (let j = 0; j < node.sub.length; j++) {
        dfs(node.sub[j], curPath.concat(node.id))
      }
    }
  }

  // 遍历
  for (let i = 0; i < data.length; i++) {
    dfs(data[i], []) // 对每个顶层节点都进行深度优先遍历
  }

  return path
}

console.log(findPath(data, '9'))
```

### 实现一个异步加法

- 加法可以直接运行，也就是同步运行，当然也可以异步运行，考察对 promise 以及封装的运用

```js
function asyncAdd(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b)
  }, Math.random() * 1000)
}

// 实现sum函数
async function sum(...args) {
  if (args.length === 1) {
    return args[0]
  } else {
    const mid = Math.floor(args.length / 2)
    const leftSumPromise = sum(...args.slice(0, mid))
    const rightSumPromise = sum(...args.slice(mid))
    const leftSum = await leftSumPromise
    const rightSum = await rightSumPromise
    return new Promise((resolve, reject) => {
      asyncAdd(leftSum, rightSum, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// 调用total函数
async function total() {
  // 注意这里使用的是 await，因此sum函数必须是promise
  const res1 = await sum(1, 2, 3, 4, 5, 6, 4)
  const res2 = await sum(1, 2, 3, 4, 5, 6, 4)
  return [res1, res2]
}
total().then((res) => console.log(res))
```

### 实现一个批量更新的逻辑

- 其实就是一个宏任务里，不停的向内部添加任务，等到宏任务执行结束，再清空
- 一个 queue 队列，一个 timer

```js
// 创建 BatchUpdate 类
class BatchUpdate {
  constructor() {
    this.queue = [] // 用于存储需要批量更新的操作
    this.timer = null // 用于延迟执行更新操作的定时器
  }

  // 将更新操作加入队列
  queueUpdate(operation) {
    this.queue.push(operation)
    // 每次压入一个新任务，都需要去调度，但调度因为有定时器，就不会执行
    this.scheduleUpdate() // 调度更新操作
  }

  // 调度更新操作
  scheduleUpdate() {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flushQueue() // 延迟一段时间后执行更新操作
      }, 0)
    }
  }

  // 执行更新操作
  flushQueue() {
    this.queue.forEach((operation) => {
      operation() // 执行更新操作
    })
    this.queue = [] // 清空队列
    this.timer = null // 重置定时器
  }
}

// 使用 BatchUpdate 类
const batchUpdate = new BatchUpdate()

// 模拟需要批量更新的操作
function updateOperation1() {
  console.log('Update operation 1')
}

function updateOperation2() {
  console.log('Update operation 2')
}

// 将更新操作加入队列
batchUpdate.queueUpdate(updateOperation1)
batchUpdate.queueUpdate(updateOperation2)
```

- 其实就是将所有批量的任务都放在任务队列里，然后每个定时器执行一次清空操作

### 实现一个 watch

- 定义一个 watcher 类，然后每个观察者都会将自己的回调传入，
- 然后数据发生变化后，就会触发对应的回调函数

```js
// 创建 Watcher 类
class Watcher {
  constructor(obj, key, callback) {
    this.obj = obj // 要观察的对象
    this.key = key // 要观察的属性名
    this.callback = callback // 属性变化时的回调函数

    this.value = obj[key] // 保存初始值

    this.observe() // 开始观察属性变化
  }

  observe() {
    // 使用 Object.defineProperty 监听属性变化
    Object.defineProperty(this.obj, this.key, {
      get: () => {
        return this.value
      },
      set: (newValue) => {
        if (newValue !== this.value) {
          this.value = newValue
          this.callback(newValue) // 执行回调函数
        }
      },
    })
  }
}

// 使用 Watcher 类
const data = {
  name: 'Alice',
}

// 创建 Watcher 实例
const watcher = new Watcher(data, 'name', (newVal) => {
  console.log('Name has been changed to: ' + newVal)
})

// 修改属性值
data.name = 'Bob' // 输出 "Name has been changed to: Bob"
```

- 其实就是拦截器，然后触发了 set，然后执行对应的回调即可。

### 实现一个 computed

- 计算属性，其实就是有个缓存

```js
// 创建一个包含计算逻辑的对象
const data = {
  firstName: 'John',
  lastName: 'Doe',
}

// 创建一个缓存对象来存储计算结果
const cache = {}

// 使用 Proxy 对象来实现依赖追踪和缓存
const handler = {
  get: function (target, prop, receiver) {
    // 如果是计算属性
    if (prop === 'fullName') {
      // 如果缓存中有值，直接返回缓存的结果
      if (cache[prop]) {
        return cache[prop]
      }
      // 否则进行计算
      const fullName = target.firstName + ' ' + target.lastName
      // 将计算结果存入缓存
      cache[prop] = fullName
      return fullName
    }
    // 如果是其他属性，直接返回对应的值
    return Reflect.get(target, prop, receiver)
  },
  set: function (target, prop, value, receiver) {
    // 如果是响应式属性发生变化，清空缓存
    if (prop === 'firstName' || prop === 'lastName') {
      cache.fullName = null
    }
    return Reflect.set(target, prop, value, receiver)
  },
}

// 创建代理对象
const reactiveData = new Proxy(data, handler)

// 访问计算属性
console.log(reactiveData.fullName) // 输出 "John Doe"

// 修改响应式属性
reactiveData.firstName = 'Jane'

// 再次访问计算属性
console.log(reactiveData.fullName) // 输出 "Jane Doe"
```

- 其实就是通过一个对象缓存，然后缓存没有，则重新计算
- receiver 参数代表了属性访问的接收者，也就是属性被访问时所在的对象

### 实现一个 Object.is 方法

```js
// 1. NaN在===中是不相等的，而在Object.is中是相等的
// 2. +0和-0在===中是相等的，而在Object.is中是不相等的

Object.is = function (x, y) {
  if (x === y) {
    // 当前情况下，只有一种情况是特殊的，即 +0 -0
    // 如果 x !== 0，则返回true
    // 如果 x === 0，则需要判断+0和-0，则可以直接使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
    // 如果都为0，则使用其倒数
    return x !== 0 || 1 / x === 1 / y
  }

  // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
  // x和y同时为NaN时，返回true，只有NaN时，才会自身不等于自身
  return x !== x && y !== y
}
```

### 实现一个快速排序

```js
function quickSort(arr) {
  if (arr.length < 2) {
    return arr
  }
  const cur = arr[arr.length - 1]
  // 这里其实，就是排除自身而已
  const left = arr.filter((v, idx) => v <= cur && idx !== arr.length - 1)
  const right = arr.filter((v) => v > cur)

  return [...quickSort(left), cur, ...quickSort(right)]
}
console.log(quickSort([3, 6, 2, 4, 1]))
```

### 实现 `add(1)(2)(3)()==6 add(1,2,3)(4)()==10`

```js
unction add(...args) {
  let allArgs = [...args] // 闭包保存
  // 使用 fn() 时，就是记录数据而已
  function fn(...newArgs) {
    allArgs = [...allArgs, ...newArgs]
    return fn
  }

  // 当触发隐式转换时，会执行toString函数
  fn.toString = function() {
    // 没有入参，直接返回
    if (!allArgs.length) {
      return
    }
    // 计算结果
    return allArgs.reduce((sum, cur) => sum + cur)
  }

  // 链式调用
  return fn
}
```

- 其实就是使用的 js 的隐式转换，隐式转换会自动执行其 toString 方法

还可以如下：

```js
// 柯理化，是一个高阶函数
function curry(fn) {
  // 满足一定条件后，执行fn
  let arr = []

  const next = (...args) => {
    arr = arr.concat(args)
    if (!args.length) {
      // 使用call的话，fn函数的入参需要是个数组。
      // 这里注意，call的参数二，本身需要的只是一个元素，但这里，这个元素整体是个数组才可以执行下面的reduce
      return fn.call(null, arr)
    } else {
      return next
    }
  }
  return next
}

//
var add = curry((arr = []) => {
  return arr.reduce((pre, next) => pre + next, 0)
})

add(1)(2)(3, 4)()
```

```js
function fn(...args) {
  if (args.length > 1) {
    let tempVal = 0
    args.forEach((item) => (tempVal += item))
    return tempVal
  } else {
    return (...arg1s) => {
      return fn.apply(this, [...args, ...arg1s])
    }
  }
}
console.log(fn(1, 2), fn(1)(2))
```

### `实现 ab2[cd]1[e] 格式化为 abcdcde 格式`

```js
function decodeString(s) {
  let result = ''
  let num = 0
  let stack = []

  for (let char of s) {
    if (!isNaN(char)) {
      num = num * 10 + parseInt(char)
    } else if (char === '[') {
      // 首先将之前的放入到对战中
      stack.push(result)
      stack.push(num)
      result = ''
      num = 0
    } else if (char === ']') {
      let repeatTimes = stack.pop()
      let prevStr = stack.pop() // 弹出之前的字符串
      result = prevStr + result.repeat(repeatTimes) // 拼接后来的字符串
    } else {
      result += char
    }
  }

  return result
}

// 测试
let input = 'ab2[cd]1[e]'
let output = decodeString(input)
console.log(output) // 输出 abcdcde

// 使用有限状态机
function decodeStringWithFSM(s) {
  let state = 'start'
  let num = 0
  let result = ''

  for (let char of s) {
    if (state === 'start') {
      if (!isNaN(char)) {
        num = num * 10 + parseInt(char)
        state = 'inNumber'
      } else if (char === '[') {
        state = 'inBrackets'
      } else {
        result += char
      }
    } else if (state === 'inNumber') {
      if (!isNaN(char)) {
        num = num * 10 + parseInt(char)
      } else {
        state = 'start'
        result += char.repeat(num)
        num = 0
      }
    } else if (state === 'inBrackets') {
      if (char === ']') {
        state = 'start'
        result += result.repeat(num)
        num = 0
      } else {
        result += char
      }
    }
  }

  return result
}

// 测试
let input = 'ab2[cd]1[e]'
let output = decodeStringWithFSM(input)
console.log(output) // 输出 abcdcde

// 使用正则
function decodeStringWithRegex(s) {
  let regex = /(\d+)\[([a-zA-Z]+)\]/g
  //
  let result = s.replace(regex, (match, count, str) => str.repeat(count))
  return result
}

// 测试
let input = 'ab2[cd]1[e]'
let output = decodeStringWithRegex(input)
console.log(output) // 输出 abcdcde
```

### 深度相等

```js
// 1、deepEqual
// 写一个 deepEqual 函数用来判断两个参数是否相等，使用效果如下：
// a和b可能是原始类型，也可能是复杂对象。不用考虑原型链。

function deepEqual(a, b) {
  const isType = (v) => Object.prototype.toString.call(v).slice(8, -1)

  const _equal = (a, b) => {
    // 类型
    if (isType(a) !== isType(b)) return false

    // 简单数据
    if (!['Object', 'Array'].includes(isType(a))) {
      return a === b
    }

    // 复杂数据
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false

    for (const key of aKeys) {
      return _equal(a[key], b[key])
    }
  }
  return _equal(a, b)
}

deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
deepEqual([1, 2], [1, 2]) // true
deepEqual(Number(1), Number(1)) // true, 注意
deepEqual([1, 2], [1, 2, 3]) // false
deepEqual([1, 2], { 0: 1, 1: 2 }) // false
```

### 然后你觉得除了说在技术上的一些帮助以外，你们对业务的主要的贡献是什么？你们是怎么和你们业务价值观点起来的？

### 常见的框架性能对比网站、

- [benchmark 专注于渲染/更新非常简单的组件树的真实性能](https://stefankrause.net/js-frameworks-benchmark8/table.html)

### 技术选型关注点

作为前端技术领导者，在进行技术选型时，我会考虑以下几个方面：

- 业务需求：首先要深入了解业务需求，包括项目规模、复杂度、预期的用户量、交互方式等。不同的业务需求可能需要不同的技术栈和工具来支持。

- 团队技术栈：考虹团队成员的技术能力和熟悉程度，选择技术栈时要考虑团队的技术栈覆盖面，以确保团队能够高效地开发和维护项目。

- 技术趋势：关注前端技术的发展趋势，包括新的框架、库、工具和标准。选择具有长期支持和活跃社区的技术，以确保项目能够跟上技术发展的步伐。

- 性能和体验：考虑所选技术对项目性能和用户体验的影响。例如，前端框架的性能、页面加载速度、交互流畅性等方面的考量。

- 安全和可维护性：选择的技术栈应具备良好的安全性和可维护性。考虑技术的安全漏洞、更新维护频率、文档和社区支持等方面。

- 成本和效率：评估所选技术对项目开发成本和效率的影响。考虑技术的学习曲线、开发工具、自动化测试支持等方面。

- 实际验证：在进行技术选型之前，可以进行一些原型验证或者小规模试点项目，以评估所选技术在实际项目中的表现。

#### 资源加载 + 运行时性能，分别需要关注哪些指标？

- 加载阶段
- 运行时阶段
- 内存

#### 小程序加载性能，包含容器创建的时间吗？

加载性能是微信小程序开发中非常重要的一个方面。微信小程序的加载性能包括了容器创建的时间。容器创建时间是指微信小程序在用户打开时，需要创建小程序容器的时间。这个过程包括了小程序的初始化、资源加载、以及页面渲染等步骤

要使用微信小程序提供的性能监控工具来收集用户实际加载时间数据，可以按照以下步骤进行：

1. 开启性能监控：在微信小程序的代码中，可以使用 wx.getPerformance()方法来获取性能监控对象。这个方法会返回一个性能监控对象，可以用来记录小程序的性能数据。

2. 记录时间戳：在小程序的合适位置，比如在小程序启动时，可以使用 performance.mark()方法记录一个时间戳，表示开始加载的时间点。例如：performance.mark("startLoading")。

3. 记录加载完成时间：在小程序加载完成时，可以再次使用 performance.mark()方法记录另一个时间戳，表示加载完成的时间点。例如：performance.mark("endLoading")。

4. 计算加载时间：使用 performance.measure()方法来计算两个时间戳之间的时间差，从而得到实际加载时间数据。例如：performance.measure("loadingTime", "startLoading", "endLoading")。

5. 获取性能数据：最后，可以使用 performance.getEntriesByName()方法获取刚刚计算的加载时间数据。例如：let performanceEntries = performance.getEntriesByName("loadingTime")。

### vue3.4

- 解析器速度提高 2 倍并提高 SFC 构建性能

#### 解析器速度提高 2 倍并提高 SFC 构建性能

在 3.4 中，我们完全重写了模板解析器。以前，Vue 使用递归下降解析器，该解析器依赖于许多正则表达式和前瞻搜索。新的解析器使用基于 htmlparser2 中的 tokenizer 的状态机 tokenizer，它仅迭代整个模板字符串一次。结果是解析器对于所有大小的模板来说始终是两倍的速度。

#### AST explorer

AST Explorer 支持多种解析器，包括但不限于以下语言和工具：

- JavaScript：支持的解析器包括 acorn、espree、babel、typescript 等。
- CSS：支持的解析器包括 cssom、csstree、postcss 等。
- HTML：支持的解析器包括 htmlparser2、parse5、@angular/compiler 等。
- GraphQL、Handlebars、Markdown、PHP、Svelte、YAML 等其他语言和工具也都有相应的解析器支持。

### 市面上目前有这种语法转换的工具，大概有哪些

### webpack 插件的钩子有哪些？

webpack 插件机制是 webpack 构建过程中的一个重要组成部分。插件是一个具有 apply 方法的 JavaScript 对象，该方法会被 webpack compiler 调用，从而可以访问整个编译生命周期。插件可以用于执行各种任务，例如资源管理、打包优化、环境变量注入等。

webpack 插件由以下组成：

- 一个 JavaScript 命名函数或 JavaScript 类。
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable')
```

webpack 的插件机制是建立在 Tapable 这个库之上的。Tapable 是 webpack 中用于实现插件系统的核心库，它提供了一种基于事件的插件架构，

在编写自定义插件时，可以注册到 Tapable 提供的一些常用钩子上。以下是一些常用的 Tapable 钩子：

- run：在开始读取记录前触发。
- watchRun：在监听模式下，编译器开始读取记录之前触发。
- beforeRun：在开始读取记录之前触发。
- beforeCompile：在编译器开始编译之前触发。
- compile：在编译器开始编译时触发。
- thisCompilation：在编译器创建新的编译时触发。
- compilation：在编译创建新的编译时触发。
- make：在触发一次编译之前触发。
- afterCompile：在编译器完成编译之后触发。
- emit：在生成资源并输出之前触发。
- afterEmit：在生成资源并输出之后触发。
- done：在完成编译后触发。

```js
class MyCustomPlugin {
  apply(compiler) {
    // 这里可以看到，compiler.hooks对象上挂载了很多不同阶段的hooks，
    // 然后执行对应tap就会注册对应的事件，后续等到对应的时机就会触发
    compiler.hooks.beforeCompile.tap('MyCustomPlugin', () => {
      // 在编译之前执行一些预处理逻辑
      console.log('Before compile: Preparing for compilation...')
    })

    compiler.hooks.compile.tap('MyCustomPlugin', () => {
      // 在编译阶段执行一些编译相关的操作
      console.log('During compile: Compiling the source code...')
    })

    compiler.hooks.emit.tap('MyCustomPlugin', () => {
      // 在输出资源之前执行一些处理逻辑
      console.log('Before emit: Preparing to emit assets...')
    })

    compiler.hooks.done.tap('MyCustomPlugin', () => {
      // 在完成编译后执行一些清理或报告操作
      console.log('After compilation: Cleaning up and reporting...')
    })
  }
}
```

### HTML 模板

内建的 `<template>` 元素用来存储 HTML 模板,浏览器将忽略它的内容，仅检查语法的有效性，但是我们可以在 JavaScript 中访问和使用它来创建其他元素。

### `if (false) { console.log(111) }` 编译时，底层是如何把 false 条件语句里的代码块置为空的

在 JavaScript 中，当代码被编译时，底层会对条件语句进行静态分析，并根据条件的真假来决定是否执行相应的代码块。对于 if (false) { console.log(111) } 这样的代码，由于条件为 false，因此底层会在编译阶段将该代码块置为空，即不会将其中的 console.log(111) 代码包含在最终的编译结果中。

这种静态分析和优化是由 JavaScript 引擎在编译阶段完成的。

JavaScript 在编译时进行静态分析和优化，这是 JavaScript 引擎的重要工作之一。静态分析和优化的过程包括以下几个关键步骤：

1. 词法分析（Lexical Analysis）：JavaScript 引擎首先对代码进行词法分析，将代码分解成词法单元（tokens），例如关键字、标识符、运算符等。这一步骤有助于构建代码的词法结构，为后续的分析和优化奠定基础。

2. 语法分析（Syntax Analysis）：接下来，JavaScript 引擎进行语法分析，将词法单元组织成抽象语法树（Abstract Syntax Tree，AST）。AST 是代码的抽象表示，它反映了代码的结构和逻辑关系，为后续的优化提供了数据结构基础。

3. 优化：在生成 AST 后，JavaScript 引擎会进行各种优化操作，包括但不限于：

   - 常量折叠（Constant Folding）：对常量表达式进行计算，将其结果直接替换到代码中。
   - 无效代码消除（Dead Code Elimination）：识别和移除永远不会执行的代码，例如条件永远为假的代码块。
   - 冗余代码消除（Redundant Code Elimination）：识别和移除冗余的代码，例如多余的变量赋值或无用的计算。
   - 内联函数（Function Inlining）：将函数调用替换为函数体的内容，减少函数调用的开销。
   - 作用域分析（Scope Analysis）：确定变量的作用域和生存周期，以便进行更精确的优化。

这些优化操作旨在提高代码的执行效率、减少不必要的计算和内存消耗，以及简化代码结构。优化后的代码将更加高效、精简，从而提升整体的性能和响应速度。

总的来说，JavaScript 在编译时通过词法分析、语法分析和优化等步骤，对代码进行静态分析和优化，以提高代码的执行效率和性能。

在 AST 阶段，识别永远不会执行的代码通常通过**常量折叠（Constant Folding）和条件判断**来实现。

- 常量折叠是指对常量表达式进行计算，将其结果直接替换到代码中。

常量折叠是通过对表达式进行静态求值来实现的。编译器会对表达式中的常量进行计算，以确定其在编译时就能确定的结果。这种静态求值的过程可以识别出可以在编译时确定结果的表达式，从而进行常量折叠优化。

例如，对于简单的数学表达式 2 + 3 \* 4，编译器可以在编译时对其进行求值，得到结果 14，然后将这个结果直接替换到代码中，从而避免在运行时重复计算。这样的优化可以减少不必要的运行时计算，提高代码的执行效率。

无效代码消除（Dead Code Elimination）是编译器优化过程中的一项重要步骤，它的执行过程通常包括以下几个关键步骤：

1. 常量折叠（Constant Folding）和静态条件判断：在编译器的静态分析阶段，通过对条件表达式进行静态求值，编译器可以确定哪些代码块永远不会被执行。例如，对于条件语句中的常量条件，编译器可以在编译时就确定其结果，从而识别出永远不会执行的代码块。

2. 标记无效代码：一旦编译器确定了哪些代码块是永远不会执行的，它会对这部分代码进行标记，通常使用特定的标识或标记来表示这些代码块是无效的。

3. 从抽象语法树（AST）中移除无效代码：在优化阶段，编译器会基于之前的标记，从抽象语法树（AST）中移除被标记为无效的代码块。这个过程确保了在生成最终的目标代码时，无效的代码不会被包含在其中。

4. 生成优化后的目标代码：经过无效代码消除优化后，编译器将生成优化后的目标代码，其中已经移除了被标记为无效的代码块。这样的优化可以减少目标代码的大小，简化程序结构，并提高程序的执行效率。

其实底层移除无用代码的操作，都是直接操作的 AST，而不是通过正则或其他的。

### shadow dom

Shadow DOM 为封装而生。**它可以让一个组件拥有自己的「影子」DOM 树**，这个 DOM 树不能在主文档中被任意访问，可能拥有局部样式规则，还有其他特性。

对于一些复杂的组件，比如 拖动组件：`<input type="range" />`

浏览器在内部使用 DOM/CSS 来绘制它们。这个 DOM 结构一般来说对我们是隐藏的，但我们可以在开发者工具里面看见它。比如，在 Chrome 里，我们需要打开「**Show user agent shadow DOM」**选项。

你在 #shadow-root 下看到的就是被称为「shadow DOM」的东西。

我们不能使用一般的 JavaScript 调用或者选择器来获取内建 shadow DOM 元素。它们不是常规的子元素，而是一个强大的封装手段。

一个 DOM 元素可以有以下两类 DOM 子树：

- Light tree（光明树） —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在 elements 面板里看到的几乎所有的都是
- Shadow tree（影子树） —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。
- 如果一个元素同时有以上两种子树，那么浏览器只渲染 shadow tree。

```html
<script>
  customElements.define(
    'show-hello',
    class extends HTMLElement {
      connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `<p>
      Hello, ${this.getAttribute('name')}
    </p>`
      }
    }
  )
</script>

<show-hello name="John"></show-hello>
```

- 首先，调用 `elem.attachShadow({mode: …})` 可以创建一个 shadow tree。

- 在每个元素中，我们只能创建一个 shadow root。
- elem 必须是自定义元素，或者是以下元素的其中一个`：「article」、「aside」、「blockquote」、「body」、「div」、「footer」、「h1…h6」、「header」、「main」、「nav」、「p」、「section」或者「span」。其他元素，比如 <img>，不能容纳 shadow tree。`

mode 选项可以设定封装层级。他必须是以下两个值之一：

- 「open」 —— shadow root 可以通过 elem.shadowRoot 访问。任何代码都可以访问 elem 的 shadow tree。
- 「closed」 —— elem.shadowRoot 永远是 null。
- 我们只能通过 attachShadow 返回的指针来访问 shadow DOM（并且可能隐藏在一个 class 中）。浏览器原生的 shadow tree，比如 `<input type="range">`，是封闭的。没有任何方法可以访问它们。
- attachShadow 返回的 shadow root，其实就是 shadow dom 的根节点而已
- `shadowRoot = elem.attachShadow({mode: open|closed})` —— 为 elem 创建 shadow DOM。如果 mode="open"，那么它通过 elem.shadowRoot 属性被访问。

在小程序中，virtualHost 的组件节点无法被 selectComponent 和 getRelationNodes 选中

### 版本比较

- 位数填充成一致，前面补 0
- 然后从高位开始往下比较

### canvas 画布

在 Web 开发中，**Canvas 是 HTML5 提供的一个元素**，通过使用 JavaScript 和 Canvas API，你可以在网页上创建一个画布，并使用 API 提供的方法来绘制和操作图形。

总的来说，画布是一个可编程的矩形区域，允许你使用 Canvas API 在其中绘制图形。它提供了一种强大的方式来创建动态的图形和交互式的应用程序。

底层依然是调用系统的能力去测量，绘制等操作，在应用侧，我们做的更多是封装。

在基础库侧，则完全是透传。

Canvas 底层技术是基于 HTML5 的 2D 上下文规范，通过 JavaScript 编程语言提供了一种在网页上进行图形绘制的能力。

Canvas 本身并不是一个完整的图形引擎，而是一个提供绘图功能的底层技术。

图形引擎是一种更高级的软件框架，用于简化图形应用程序的开发过程，提供更多的功能和工具。图形引擎通常包含了对图形渲染、物理模拟、动画、碰撞检测等方面的支持，并提供了更高层次的抽象和接口，使开发者能够更方便地创建复杂的图形应用。

### cli 命令行

- 可以使用 inquerer，提示获取用户输入的命令
- 也可以通过命令行参数，自动接解析对应的参数
- 解析参数有，执行对应的脚本即可，同时如果有对应的发布通知钩子，直接使用即可。
- 预览
  - 通过 ci.preview 将数据传到后台，同时会生成一个二维码，保存到本地
  - 然后本地读取到这个二维码，然后传到自己的 cdn 服务器，然后得到一个图片连接，然后再展示在

## 动态化

## 20231227 周三

### 盒模型

盒模型由内容框（content box）、内边距框（padding box）、边框框（border box）和外边距框（margin box）组成。

行内元素的盒模型不包括外边距（margin），只包括内容框、内边距框和边框框。

Margin 塌陷的原因主要是由于 CSS 规范中对 margin 的处理方式所导致的。具体来说，当相邻的块级元素的 margin 发生重叠时，它们的 margin 不会简单地相加，而是取它们之间的最大值作为最终的 margin 值。这种处理方式可能会导致意外的布局效果。

为了解决 margin 塌陷的问题，可以采取以下几种办法：

- 使用 padding：在父元素上添加 padding，可以防止子元素的 margin 与父元素的 margin 发生重叠，从而避免 margin 塌陷的问题。
- 使用 border：类似地，添加 border 也可以防止 margin 的重叠，从而避免 margin 塌陷。
- 使用 overflow：在父元素上添加 overflow 属性，例如设置为 hidden 或 auto，也可以防止 margin 的重叠，从而避免 margin 塌陷。
- 使用 display 属性：将父元素的 display 属性设置为 flex 或 inline-block，这样可以创建一个新的块级格式化上下文，从而防止 margin 塌陷。
- 使用 clear 属性：在父元素的末尾添加一个空的块级元素，并为其应用 clear 属性，这可以防止 margin 塌陷。

#### 创建 BFC 的方式

- 使用浮动（float）：将元素设置为浮动，可以创建一个新的 BFC，防止外边距重叠。
- 使用绝对定位（position: absolute 或 position: fixed）：将元素设置为绝对定位，也可以创建一个新的 BFC。
- 使用内联块级元素（display: inline-block）：内联块级元素也可以创建 BFC，防止外边距重叠。
- 使用弹性布局（display: flex 或 display: inline-flex）：弹性布局也会创建一个新的 BFC。

### react hooks

React Hooks 中，闭包被用于跟踪 Hook 的调用位置。当函数组件中使用 Hook 时，React 会在内部创建一个闭包，以便将 Hook 与该函数组件实例相关联。这意味着每个 Hook 都“记住”了它们在函数组件中的调用位置，以及它们与特定函数组件实例相关的状态。

举例来说，当在函数组件中调用 useState Hook 时，React 会使用闭包来“记住”这个调用位置，并将该 Hook 与该函数组件实例相关联。这样，每个函数组件实例都有自己的状态，并且状态的更新不会相互影响。

通过使用闭包，React Hooks 能够确保每个 Hook 都与其在函数组件中的调用位置相关联，从而实现了状态的正确管理和组件的重新渲染。

React Hooks 不可以在条件语句中调用，是因为 React 需要依赖于 Hook 被调用的顺序来正确地管理组件的状态。当 Hook 在条件语句中被调用时，它的调用顺序可能会发生变化，导致 React 无法准确地追踪和管理组件的状态。

举例来说，如果在条件语句中调用 useState Hook，那么在条件满足时会创建一个新的状态，而在条件不满足时则不会创建。这样就会导致 Hook 的调用顺序发生变化，从而影响 React 对组件状态的正确管理。

为了避免这种问题，React 规定 Hooks 必须在函数组件的顶层作用域中被调用，以确保它们的调用顺序在每次渲染时保持一致。这样一来，React 就能够正确地追踪和管理组件的状态，确保状态更新和组件重新渲染的正确性。

React 初始化阶段会构建一个 hook 链表，更新阶段会根据 useState 的执行顺序去遍历链表取值，如果前后执行顺序不一致，就会导致取出的值不对应，所以我们再写 hoos 的时候要确保 Hooks 在每次渲染的时候都保持同样的执行顺序

- react 组件都是函数返回，每次都会重新执行函数
- vue 组件，都有实例存在，后续都需对实例修改，不像 react 重新运行得到新的组件，没有实例就没有自己的状态，就需要用其他方式保存状态，比如 hooks，而钩子的顺序会影响结果，因此顺序一定要保证

### vue 的组合式 api 实现原理

### IntersectionObserver

IntersectionObserver 是一个 JavaScript API，它提供了一种异步观察元素并检测它们何时通过滚动容器的指定点的方法。它的底层原理涉及浏览器的渲染引擎和事件循环机制。

具体来说，IntersectionObserver 通过监听目标元素与其祖先元素（或者页面可见区域，也称为视口）的交叉区域来触发回调函数。这种监听是异步的，不会阻塞主线程，因此对性能的影响较小。

在底层实现上，IntersectionObserver 利用了浏览器的渲染引擎和事件循环机制。当目标元素的交叉区域满足预定义的阈值时，浏览器会触发 IntersectionObserver 的回调函数。这种机制使得开发者能够更有效地响应元素的可见性变化，而无需频繁地监听滚动事件或进行复杂的计算。

总的来说，IntersectionObserver 的底层原理是基于浏览器的渲染引擎和事件循环机制，利用异步监听元素交叉区域的方式来触发回调函数，从而实现对元素可见性变化的监测和处理。

### 设计一个异步事件队列

```js
class AsyncQueue {
  constructor() {
    // 函数实现
  }
  // 事件注册
  tap(name, fn) {
    // 函数实现
  }
  // 事件触发
  exec(name) {
    // 函数实现
  }
}

function fn1(cb) {
  console.log('fn1')
  cb()
}

function fn2(cb) {
  console.log('fn2')
  cb()
}

function fn3(cb) {
  setTimeout(() => {
    console.log('fn3')
    cb()
  }, 2000)
}

function fn4(cb) {
  setTimeout(() => {
    console.log('fn4')
    cb()
  }, 3000)
}

// 创建事件队列
const asyncQueue = new AsyncQueue()
// 注册事件队列
asyncQueue.tap('init', fn1)
asyncQueue.tap('init', fn2)
asyncQueue.tap('init', fn3)
asyncQueue.tap('init', fn4)
// 执行事件队列
asyncQueue.exec('init', () => {
  console.log('执行结束')
})

// 输出
// fn1
// fn2
// fn3 (延迟2秒输出)
// fn4（延迟3秒输出）
// 执行结束

class AsyncQueue {
  constructor() {
    this.map = {}
  }

  tap(name, fn) {
    if (!this.map[name]) {
      this.map[name] = [fn]
    } else {
      this.map[name].push(fn)
    }
  }
  exec(name, cb) {
    const evtQueue = this.map[name]

    if (evtQueue && evtQueue.length) {
      // 定义一个下次执行函数，
      const next = (idx) => {
        if (idx < evtQueue.length) {
          // 将下一个函数，作为回调传入到函数内，等到函数执行完，就会执行对应的回调，从而保证串行
          evtQueue[idx](() => next(idx + 1))
        } else {
          cb()
        }
      }

      next(0)
    } else {
      cb()
    }
  }
}
```

## 20231224 周日

### 实现一个算法 `[1,[2,[3,[4, null]]]] => [4,[3,[2,[1, null]]]]`

```js
// 使用链表方式解决，反转链表
function reverseLinkedList(list) {
  let prev = null
  let current = list

  while (current) {
    let next = current[1]

    current[1] = prev
    prev = current
    current = next
  }
  return prev
}

const originalList = [1, [2, [3, [4, null]]]]
const reversedList = reverseLinkedList(originalList)
console.log(reversedList)
```

```js
function reverseList(list) {
  const stack = []
  let current = list
  while (current !== null) {
    stack.push(current)
    current = current[1]
  }
  // 压入栈中
  console.log(stack)

  let newHead = stack.pop()
  // 定义一个游动指针
  let newCurrent = newHead
  while (stack.length > 0) {
    let nextNode = stack.pop()
    newCurrent[1] = nextNode
    newCurrent = nextNode
  }

  // 最后操作游动指针
  newCurrent[1] = null
  return newHead
}

const originalList = [1, [2, [3, [4, null]]]]
const reversedList = reverseList(originalList)
console.log(reversedList)
```

### 实现一个 lodash 的 get 方法

```js
// 实现一个函数 getData() ，可以获取变量的深层属性对应的值，如果不存在则返回 undefined
// 例如：
const data = {
  a: {
    aa: {
      aaa: 'raaa',
    },
  },
  b: [{}, {}, { bb: 'rbb' }],
}

function getData(obj, path) {
  const keys = path.split('.')

  let res = obj
  for (const key of keys) {
    // 如果传入 toString 这样的原型方法，则 key in res 依然会遍历到
    // if (res && typeof res === 'object' && key in res) { // 注意这里需要判断对象，是对象才会继续往下走
    if (res && typeof res === 'object' && res.hasOwnProperty(key)) {
      res = res[key]
    } else {
      return undefined
    }
  }

  return res
}

console.log(getData(data, 'a.aa.aaa')) // raaa
console.log(getData(data, 'a.aa.aaa.0')) // undefined
console.log(getData(data, 'b.2.bb')) // rbb
console.log(getData(data, 'c.cc.ccc')) // undefined
console.log(getData(data, 'toString')) // undefined
```

### 实现 convert2Tree 方法将下面数组根据 id 和 parentId 转成树状

### 编写一个渲染函数，将对应的 vdom 挂载在对应的节点下

总结：

1. 先不要一步到位，先创建一个元素，然后设置对应的属性
2. 此时处理完本身节点后，判断是否有 children
   1. 如果 children 是数组，则需要递归处理，此时 render 函数的参数 2，也就是父元素，就是刚创建的元素
   2. 如果 children 是其他节点，直接创建对应节点，上面的只创建了 文本节点
3. 最后返回创建的 el 即可

```js
// 上面反复的操作真实的dom，性能不好，也是也没什么问题，因此此时都在内存里，并没有渲染到页面上
function render(vdom, container) {
  // 创建文档片段
  const fragment = document.createDocumentFragment()

  // 创建元素，其实还是在内存中，因此不会涉及页面操作
  function createDOMElement(vnode) {
    const { tagName, props, children } = vnode

    const el = document.createElement(tagName)

    // 设置属性
    if (props) {
      for (const key in props) {
        el.setAttribute(key, props[key])
      }
    }

    // 如果有children，且是数组
    if (Array.isArray(children) && children.length) {
      children.forEach((child) => {
        // const childEl = document.createElement(child.tagName);
        const childEl = createDOMElement(child)

        // 此时父元素是 el
        el.appendChild(childEl)
      })
    } else if (children) {
      // 如果是文本节点
      const childEl = document.createTextNode(children)
      el.appendChild(childEl)
    }

    // 如果没有子元素，则直接返回el
    return el
  }

  const fragmentDom = fragment.appendChild(createDOMElement(vdom))

  // 发现其实没有必要使用 fragment
  container.appendChild(fragmentDom)
}

// 注意这个js必须在 dom 之下执行，放在header里，元素会获取不到
render(vdom, document.getElementById('app'))
```

## 20231212 周二

### 事件循环

```js
setTimeout(function () {
  console.log(1)
}, 0)

new Promise(function executor(resolve) {
  console.log(2)
  for (var i = 0; i < 10000; i++) {
    i == 9999 && resolve()
  }
  console.log(3)
}).then(function () {
  console.log(4)
})

console.log(5)
// 2 3 5 4 1
```

1. 首先执行主线程的任务，同时注册第一个宏任务
2. 然后执行 2 3 ，并注册当前主线程的微任务
3. 然后执行 5，此时主线程都已执行完毕，开始执行本轮的微任务 也就是 4
4. 然后再执行 宏任务

## 20231211 周六

### 骨架屏

vue-skeleton-webpack-plugin 插件是一个用于 Vue.js 项目的 Webpack 插件，它使用了 Puppeteer 库来生成项目的骨架屏。

具体来说，当你使用 vue-skeleton-webpack-plugin 插件时，它会在构建过程中使用 Puppeteer 库来模拟一个无头浏览器（headless browser）。插件会根据你的配置，自动访问你的 Vue.js 应用，并在访问过程中捕获页面的状态和内容。

这个过程中，Puppeteer 会打开一个虚拟的浏览器页面，加载你的应用，并执行你指定的路由或页面操作。插件会捕获页面的 HTML 结构和一些关键样式，并将它们作为骨架屏的基础。

一旦插件捕获到页面的骨架屏内容，它会将这些内容注入到你的 Vue.js 应用中，通常是作为一个预渲染的 HTML 模板。这样，在首次加载你的应用时，用户会首先看到骨架屏，给予他们一个视觉上的反馈，告诉他们应用正在加载。

总结起来，vue-skeleton-webpack-plugin 插件使用 Puppeteer 库来模拟浏览器，捕获 Vue.js 应用页面的状态和内容，并生成骨架屏。这样，用户在应用加载过程中可以看到一个占位的骨架屏，提升用户体验。

其实实际情况是：

- spa 都是单页应用，在运行时获取骨架屏其实就晚了，而 puppeteer 可以在编译阶段，就获取页面的内容，然后绘制
- 但目前没有用到，底层依然是将拿到的骨架屏模版注入到静态的 html 里了
- page-skeleton-webpack-plugin 这个插件用到了 puppeteer，编译时获取动态内容，然后生成对应的骨架屏。但只支持 history 模式，另外就是只对首页骨架屏有效，并没有深度处理单页内部，其他组件的渲染。也就是页面启动后，在获取后端数据时，局部的白屏
-

## 20231209 周五

### CI/CD

- CI：continues integration 持续集成
- CD：continues deployment 持续部署

## 20231208 周四

### gulp

- Gulp 是一个**任务自动化工具**，它可以帮助开发人员定义和执行各种前端开发任务。您可以使用 Gulp 来执行任务如文件复制、文件合并、压缩、编译预处理器（如 Sass、Less）、自动刷新浏览器等。Gulp 使用基于流（stream）的方式处理文件，通过定义一系列任务和管道来处理源文件并生成目标文件。

- **Rollup 是一个 JavaScript 模块打包器，专注于打包 JavaScript 模块**。它支持 ES6 模块和其他模块格式（如 CommonJS、AMD）之间的转换和打包。与传统的打包工具（如 webpack）相比，Rollup 更注重对模块的静态分析和优化，它采用“tree shaking”技术来消除未使用的代码，生成更小、更高效的输出文件。

### docker

Docker 是一种容器化平台，它利用容器技术来实现应用程序的打包、分发和运行。Docker 容器工作原理如下：

1. 编写 Dockerfile：Dockerfile 是一个文本文件，用于定义 Docker 镜像的构建过程。在 Dockerfile 中，你可以指定基础镜像、安装依赖项、复制文件、设置环境变量等。

2. 构建镜像：使用 Docker 命令行工具，运行 docker build 命令来基于 Dockerfile 构建镜像。这将根据 Dockerfile 中的指令执行一系列操作，生成一个包含应用程序和其依赖项的镜像。

3. 运行容器：使用 docker run 命令来基于镜像创建和运行容器。在运行容器时，你可以指定容器的名称、端口映射、环境变量等选项。

4. 容器生命周期管理：一旦容器正在运行，你可以使用 docker ps 命令查看运行中的容器列表，使用 docker stop 命令停止容器的运行，使用 docker start 命令重新启动容器。

5. 容器与主机的通信：容器内的应用程序可以通过网络与主机或其他容器进行通信。你可以使用 docker run 命令的-p 选项来将容器内的端口映射到主机上，使得主机可以通过指定的端口访问容器内的应用程序。

6. 镜像管理：Docker 提供了一系列命令来管理镜像，如 docker pull 用于从仓库中拉取镜像、docker push 用于将镜像推送到仓库、docker images 用于列出本地的镜像列表等。

7. 容器与数据卷：Docker 提供了数据卷功能，用于在容器和主机之间共享数据。数据卷可以通过 docker run 命令的-v 选项或 Docker Compose 中的 volumes 指令来创建和管理。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]


// 在终端中导航到项目根目录，并运行以下命令来构建Docker镜像：
docker build -t simple-node-server .

// 构建完成后，使用以下命令创建和运行一个容器：
docker run -p 3000:3000 -d simple-node-server
```

## 20231206 周三

### 404 并不会触发 XMLHttpRequest 的 onerror 事件

XMLHttpRequest（XHR）对象的 onerror 事件在以下情况下可以触发：

- 网络错误：如果请求无法发送或接收（如断网或请求超时），onerror 事件将触发。
- 跨域错误：如果跨域请求不被服务器接受，也会触发 onerror 事件。这是由于浏览器的同源策略限制，XHR 请求必须遵循同源策略，除非服务器明确允许跨域请求。
  然而，如果 XHR 请求成功发送到服务器并返回响应，即使 HTTP 状态码是 404（资源未找到），onerror 事件不会触发。这是因为 HTTP 状态码在 2xx 范围之外时，XHR 对象并不认为是错误的情况，因此不会触发 onerror 事件。相反，在这种情况下，XHR 对象会触发 onload 事件。

要检测 HTTP 状态码是否为 404，可以使用 status 属性来获取返回的状态码，并在 onload 事件处理程序中检查它。例如：

```js
var xhr = new XMLHttpRequest()
xhr.open('GET', 'http://example.com/nonexistent', true)
xhr.onload = function () {
  if (xhr.status === 404) {
    // 处理404错误
  } else {
    // 请求成功
  }
}
xhr.onerror = function () {
  // 处理网络错误
}
xhr.send()
```

### promise 失败回调

```js
const tasks = [
  () => new Promise((resolve, reject) => reject(new Error('ddd'))),
  () => new Promise((resolve, reject) => reject(2)),
]
Promise.all(tasks)
  .then((res) => console.log('res', res))
  .catch((err) => console.log('err', err))
// 上面的逻辑，并不会执行 error

const tasks = [
  new Promise((resolve, reject) => reject(new Error('ddd'))),
  new Promise((resolve, reject) => reject(2)),
]
Promise.all(tasks)
  .then((res) => console.log('res', res))
  .catch((err) => console.log('err', err))
```

## 20231203 周三

### React、Vue3、Vue2 的 Diff 算法对比

[更多参考](https://juejin.cn/post/7116141318853623839#heading-18)

#### 相同点

- 只有使用了虚拟 DOM 的这些框架，在进行更新 Diff 对比的时候，都是优先处理简单的场景，再处理复杂的场景。
-
- React 中是先处理左边部分，左边部分处理不了，再进行复杂部分的处理；
- Vue2 则先进行首尾、首首、尾尾部分的处理，然后再进行中间复杂部分的处理；
- Vue3 则先处理首尾部分，然后再处理中间复杂部分，
  - Vue2 和 Vue3 最大的区别就是在处理中间复杂部分使用了最长递增子序列算法找出稳定序列的部分。

在处理老节点部分，都需要把节点处理 key - value 的 Map 数据结构，方便在往后的比对中可以快速通过节点的 key 取到对应的节点。同样在比对两个新老节点是否相同时，key 是否相同也是非常重要的判断标准。所以不管是 React, 还是 Vue，在写动态列表的时候，都需要设置一个唯一值 key，这样在 diff 算法处理的时候性能才最大化。

#### 不同点

对静态节点的处理不一样。

- 由于 Vue 是通过 template 模版进行编译的，所以在编译的时候可以很好对静态节点进行分析然后进行打补丁标记，然后在 Diff 的时候，Vue2 是判断如果是静态节点则跳过过循环对比，
-
- 而 Vue3 则是把整个静态节点进行提升处理，Diff 的时候是不过进入循环的，所以 Vue3 比 Vue2 的 Diff 性能更高效。
-
- 而 React 因为是通过 JSX 进行编译的，是无法进行静态节点分析的，所以 React 在对静态节点处理这一块是要逊色的
  - 在 React 中使用 JSX 语法进行编写，最终会通过 Babel 等工具将 JSX 转译为对应的 React.createElement() 函数调用。这个过程是在运行时进行的，而不是在构建时。由于 JSX 的转译发生在运行时，React 在编译阶段无法获取到完整的组件结构，无法进行像 Vue 那样的静态分析和优化。JSX 无法在编译时进行优化，所以 React 性能优化就集中在运行时进行处理，比如 fiber 架构，就是为了处理性能优化的问题

Vue2 和 Vue3 的比对和更新是同步进行的，这个跟 React15 是相同的，就是在比对的过程中，如果发现了那些节点需要移动或者更新或删除，是立即执行的，也就是 React 中常讲的不可中断的更新，如果比对量过大的话，就会造成卡顿，所以 React16 起就更改为了比对和更新是异步进行的，所以 React16 以后的 Diff 是可以中断，Diff 和任务调度都是在内存中进行的，所以即便中断了，用户也不会知道。

另外 Vue2 和 Vue3 都使用了双端对比算法，而 React 的 Fiber 由于是单向链表的结构，所以在 React 不设置由右向左的链表之前，都无法实现双端对比。那么双端对比目前 React 的 Diff 算法要好吗？接下来我们来看看一个例子，看看它分别在 React、Vue2、Vue3 中的是怎么处理的。

比如说我们现在有以下两组新老节点：
老：A, B, C, D
新：D, A, B, C

那么我们可以看到，新老两组节点唯一的不同点就是，D 节点在新的节点中跑到开头去了，像这种情况：

- React 是从左向右进行比对的，在上述这种情况，React 需要把 A, B, C 三个节点分别移动到 D 节点的后面。
-
- Vue2 在进行老节点的结尾与新节点的开始比对的时候，就发现这两个节点是相同的，所以直接把老节点结尾的 D 移动到新节点开头就行了，剩下的就只进行老节点的开始与新节点的开始进行比对，就可以发现它们的位置并没有发生变化，不需要进行移动。
-
- Vue3 是没有了 Vue2 的新老首尾节点进行比较，只是从两组节点的开头和结尾进行比较，然后往中间靠拢，那么 Vue3 在进行新老节点的开始和结尾比对的时候，都没有比对成功，接下来就进行中间部分的比较，先把老节点处理成 key - value 的 Map 数据结构，然后又使用最长递增子序列算法找出其中的稳定序列部分，也就是：A, B, C，然再对新节点进行循环比对，然后就会发现新节点的 A, B, C 都在稳定序列部分，不需要进行移动，然就只对 D，进行移动即可。
- 最后上述的例子在 Vue2 和 Vue3 中都只需要移动一个节点就可以完成 Diff 算法比对，而 React 在这种极端例子中则没办法进行很好的优化，需要进行多次节点移动操作。

### 为什么 Vue 中不需要使用 Fiber

1. 第一，首先时间分片是为了解决 CPU 进行大量计算的问题，因为 React 本身架构的问题，在默认的情况下更新会进行过多的计算，就算使用 React 提供的性能优化 API，进行设置，也会因为开发者本身的问题，依然可能存在过多计算的问题。

2. 第二，而 Vue 通过响应式依赖跟踪，在默认的情况下可以做到只进行组件树级别的更新计算，而默认下 React 是做不到的（据说 React 已经在进行这方面的优化工作了），再者 Vue 是通过 template 进行编译的，可以在编译的时候进行非常好的性能优化，比如对静态节点进行静态节点提升的优化处理，而通过 JSX 进行编译的 React 是做不到的。

3. 第三，React 为了解决更新的时候进行过多计算的问题引入了时间分片，但同时又带来了额外的计算开销，就是任务协调的计算，虽然 React 也使用最小堆等的算法进行优化，但相对 Vue 还是多了额外的性能开销，因为 Vue 没有时间分片，所以没有这方面的性能担忧。

4. 第四，根据研究表明，人类的肉眼对 100 毫秒以内的时间并不敏感，所以时间分片只对于处理超过 100 毫秒以上的计算才有很好的收益，而 Vue 的更新计算是很少出现 100 毫秒以上的计算的，所以 Vue 引入时间分片的收益并不划算。

### vue3 diff 算法

- 在 vue2 的基础上增加了 类似 react 的 map，
- 另外就是使用最长递增子序列

### react diff 算法

React 不能通过**双端对比进行 Diff 算法优化是因为目前 Fiber 上没有设置反向链表**，而且想知道就目前这种方案能持续多久，如果目前这种模式不理想的话，那么也可以增加双端对比算法。

fiber 可以中断，并继续连起来工作，那是因为 fiber 是一个单链表结果，链表肯定知道前后都是谁，所以可以知道当前 父节点和孩子节点等信息

那么 React 是将对应组件怎么生成一个 Fiber 链表数据的呢？

组件在经过 JSX 的编译之后，初始化的时候会生成成一个类似于 React 15 或者 Vue 那种虚拟 DOM 的数据结构。然后创建一个叫 fiberRoot 的 Fiber 节点，然后开始从 fiberRoot 这个根 Fiber 开始进行协调，生成一棵 Fiber 树，这个棵树被称为：workInProgress Fiber 树

在组件状态数据发生变更的时候，会根据最新的状态数据先会生成新的虚拟 DOM，再去构建一棵新的 workInProgress Fiber 树 ，而在重新协调构建新的 Fiber 树的过程也就是 React Diff 发生的地方。接下来，我们就看看 React Diff 算法是怎么样的。

- react diff 的过程，首先数据变化后，会生成对应的 vdom 数组结构的数据，然后循环遍历这个数组，去老的 fiber 节点树里查找
- 如果两个节点相同则创**建一个新的 Fiber 节点并复用一些老 Fiber 节点的信息**，比如真实 DOM，并给这个新的 Fiber 节点打上一个 Update 的标记，代表这个节点需要更新即可
- 如果经过第一轮比对，新节点还存在未比对的，则继续循环查找。
  - 先将剩下未比对的老 Fiber 节点全部处理成一个 老 Fiber 的 key 或老 Fiber 的 index 为 key，Fiber 节点为 value 的 Map 中，这样就可以，以 O(1) 复杂度，
  - 然后再遍历剩下的虚拟 dom 数组，去 map 里找，找到就暂存一个值，同时删除 map 里的数据，然后再通过暂存的数据复用老 fiber 节点里的数据
  - 这样一直的搞下去。

### vue2 tree-diff 算法

[参考](https://juejin.cn/post/7114177684434845727)

两棵树做 diff，复杂度是 O(n^3) 的，因为每个节点都要去和另一棵树的全部节点对比一次，这就是 n 了，如果找到有变化的节点，执行插入、删除、修改也是 n 的复杂度。所有的节点都是这样，再乘以 n，所以是 O(n _ n _ n) 的复杂度

所以前端框架的 diff 约定了两种处理原则：**只做同层的对比，type 变了就不再对比子节点。**

因为 dom 节点做跨层级移动的情况还是比较少的，一般情况下都是同一层级的 dom 的增删改。这样只要遍历一遍，对比一下 type 就行了，是 O(n) 的复杂度

vue2 中现根据 key 是否相等，来判断是否为同一个节点

```js
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  )
}
```

简单 diff

```js
const oldChildren = n1.children
const newChildren = n2.children

let lastIndex = 0
// 遍历新的 children
for (let i = 0; i < newChildren.length; i++) {
    const newVNode = newChildren[i]
    let j = 0
    let find = false
    // 遍历旧的 children
    for (j; j < oldChildren.length; j++) {
      const oldVNode = oldChildren[j]
      // 如果找到了具有相同 key 值的两个节点，则调用 patch 函数更新
      if (newVNode.key === oldVNode.key) {
        find = true
        patch(oldVNode, newVNode, container)

        处理移动...

        break //跳出循环，处理下一个节点
      }
   }
   // 没有找到就是新增了
   if (!find) {
      const prevVNode = newChildren[i - 1]
      let anchor = null
      if (prevVNode) {
        anchor = prevVNode.el.nextSibling
      } else {
        anchor = container.firstChild
      }
      patch(null, newVNode, container, anchor)
   }
}
```

#### 总结

- 单向，简单 diff
  - 遍历新的节点，然后再老的节点里查找是否有，双重循环，如果有，则执行 patch(更新节点的属性，重新设置事件监听器)，然后执行移动操作
  - 如果没有，则执行新增操作，在指定的位置上。
  - ABCDE -> EABCD 的话，从左到右，挨个对比，就需要移动 ABCD 4 次，肯定是低效的
    - 在旧节点列表里查找时，findIndex 的 j，如果小于 lastIndex（新节点最后的索引），则需要移动，如果 j 大于 lastIndex 说明不需要移动，将 lastIndex = j
    - lastIndex 可以理解为 最终新节点的索引，想象下，原地移除等于某个值的算法，从 0 开始，记录有效值；但上面把 lastIndex = j，会不会产生不连续的情况啊？
  - 遍历完新节点，如果老节点，还有值，则删除，因为元素移动，其实就是相当于把旧的给删除了
- 双端 diff，就解决了上面的单向 diff
  - 头头、头尾、尾头、尾尾
  - 尾头，命中，直接操作，将尾部的移到最开始，从而完成 diff
    - 先 path
    - 然后 insert(oldEndVNode.el, container, oldStartVNode.el)，也就把 ABCDE -> EABCD 了
  - 相对于单向 diff，这里大大提高了效率。
  - 然后如果双端都没有可以复用的元素，则开始在剩余的旧节点里找，找到了就 patch，移动，同时将 `oldChildren[idxInOld] = undefined`，因为这里不是两端，两端移动依然是连续的数组，这里是中间，所以需要保证顺序
  - 然后这样操作完，如果新节点还有剩余，则批量新增，如果老节点还有剩余则批量删除

```js
// A B C D E

// E A B C D

while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 头头
    patch(oldStartVNode, newStartVNode, container)
    oldStartVNode = oldChildren[++oldStartIdx]
    newStartVNode = newChildren[++newStartIdx]
  } else if (oldEndVNode.key === newEndVNode.key) {
    //尾尾
    patch(oldEndVNode, newEndVNode, container)
    oldEndVNode = oldChildren[--oldEndIdx]
    newEndVNode = newChildren[--newEndIdx]
  } else if (oldStartVNode.key === newEndVNode.key) {
    //头尾，需要移动
    patch(oldStartVNode, newEndVNode, container)
    insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)

    oldStartVNode = oldChildren[++oldStartIdx]
    newEndVNode = newChildren[--newEndIdx]
  } else if (oldEndVNode.key === newStartVNode.key) {
    //尾头，需要移动
    patch(oldEndVNode, newStartVNode, container)
    insert(oldEndVNode.el, container, oldStartVNode.el)

    oldEndVNode = oldChildren[--oldEndIdx]
    newStartVNode = newChildren[++newStartIdx]
  } else {
    // 头尾没有找到可复用的节点
  }
}
```

### 并发请求，如何使用最后一个

- 思路一：发送请求时，将时间戳传给后端，然后同时用一个 lastStartTime 记录，最后一次发送的时间，然后与响应里的作对比
- 思路二：思路一需要服务端支持，不方便，还可以直接判断是否与最后的一个 lastStartTime 请求一致，仅使用一致的，其他的舍弃，这样有个缺点，有可能这次请求会失败。
- 思路三：增加缓存，如下

```js
let lastResponseToStartTime = 0
let lastResponseCache
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
async function fetchData() {
  const startTime = Date.now()

  // 模拟请求
  // const res = new Promise((resolve) => {
  //   setTimeout(() => resolve('xxx'), 2000)
  // })
  await sleep(1000)
  const res = Math.random()

  // 响应后，
  if (startTime < lastResponseToStartTime && lastResponseCache) {
    return lastResponseCache
  } else {
    // 第一轮，假如发出去三个请求，任意一个响应回来后，比如第二个回来，则赋值给 lastResponseToStartTime
    // 同时舍弃 所有比 lastResponseToStartTime 小的值，也就是说舍弃最早的请求，
    // 如果此时第三个请求的响应回来了，startTime 肯定是 大于 lastResponseToStartTime，所以，继续使用新的res
    // 从而保证了，只使用最有一个请求
    lastResponseToStartTime = startTime
    console.log('startTime', startTime)
    lastResponseCache = res
  }
}
fetchData()
fetchData()
fetchData()
fetchData()
```

## 20231205 周二

### shadow dom 与 web components

Shadow DOM 是 Web Components 的核心技术之一，它为 Web Components 提供了一种隔离和封装 HTML、CSS 和 JavaScript 的机制。因此，可以说 Shadow DOM 是 Web Components 的一部分，它们是相互关联的概念，但并不完全相同。

Shadow DOM 是 Web Components 中的一个重要概念，它通过创建一个与主文档 DOM 树分隔的影子 DOM 树，将组件的样式和结构封装在组件内部。

- Shadow DOM 技术用于封装和隔离组件的样式和结构，使其与外部环境相互隔离。
- Custom Elements 技术用于定义和使用自定义 HTML 元素，使其成为可复用的组件。
- Shadow DOM 和 Custom Elements 可以结合使用，通过在自定义元素中使用 Shadow DOM，实现对组件的样式和结构的封装和隔离。

**可以将 Shadow DOM 看作是提供隔离和封装能力的技术，而 Custom Elements 则是用于定义和使用组件的技术**。它们相互配合，为 Web Components 提供了强大的功能。

### 微前端框架

#### qiankun 是如何实现样式隔离的？

比如 single-spa，它做的就是监听路由变化，路由切换的时候加载、卸载注册的应用的代码。

只不过 single-spa 的入口是一个 js 文件，需要代码里手动指定要加载啥 js、css 等，不方便维护。

第一个就是入口，改为了 html 作为入口，解析 html，从中分析 js、css，然后再加载，这个是 import-html-entry 这个包实现的。

加载之后呢？

自然是放容器里运行呀。

这个容器 single-spa 也没做，qiankun 做了。

它是把 js 代码包裹了一层 function，然后再把内部的 window 用 Proxy 包一层，这样内部的代码就被完全隔离了，这样就实现了一个 JS 沙箱。
这部分代码在 import-html-entry 里，也就是加载后的 js 就被包裹了一层：如下

```js
;(function (window, self, xxx) {
  with (window) {
  }
}.bind(window.proxy))
```

with 是 JavaScript 中的一个语法结构，用于简化对对象属性和方法的访问。使用 with 语法，可以在一段代码块内省略对象名称，直接访问对象的属性和方法。

```js
const person = {
  name: 'Alice',
  age: 30,
  greet() {
    console.log(`Hello, ${this.name}!`)
  },
}

// 使用 with 语法访问 person 对象的属性和方法
with (person) {
  console.log(name) // 输出: Alice
  console.log(age) // 输出: 30
  greet() // 输出: Hello, Alice!
}
```

这是 qiankun 的 JS 沙箱实现方案，其他的微前端方式实现沙箱可能用 iframe、web components 等方式。

**css modules 和 scoped css** 差不多，都能实现组件级别样式隔离，能设置子组件和全局样式。只是实现方式不同，导致了使用起来也有差异。
不管是 css modules 还是 scoped css 都比 qiankun 自带的样式隔离方案好用的多，那为什么微前端框架还要实现样式隔离呢？直接让应用自己去用 css modules 或者 scoped css 不就行了？

微前端就是在路由变化的时候，加载对应应用的代码，并在容器内跑起来。
qiankun、wujie、micro-app 的区别主要还是实现容器（或者叫沙箱）上有区别，比如 qiankun 是 function + proxy + with，micro-app 是 web components，而 wujie 是 web components 和 iframe。
流程都是差不多的。
qiankun 做了样式隔离，有 shadow dom 和 scoped 两种方案，但都有问题：

shadow dom 自带样式隔离，但是 shadow dom 内的样式和外界互不影响，导致挂在弹窗的样式会加不上。父应用也没法设置子应用的样式。
scoped 的方案是给选择器加了一个 data-qiankun='应用名' 的选择器，这样父应用能设置子应用样式，这样能隔离样式，但是同样有挂在 body 的弹窗样式设置不上的问题，因为 qiankun 的 scoped 不支持全局样式

而 react 和 vue 项目本身都会用 scoped css 或者 css modules 的组件级别样式隔离方案，这俩方案都支持传递样式给子元素、设置全局样式等，只是实现和使用方式不同。
现在的 vue、react 项目基本都做了组件样式隔离了，有点全局样式也是可控的，真没必要用 qiankun 的那个。

### 多个浏览器 tab 如何通信

- 使用 LocalStorage 或 SessionStorage：LocalStorage 和 SessionStorage 是浏览器提供的 Web Storage API，用于在浏览器的不同标签页之间存储数据。你可以在一个标签页中将数据存储在 LocalStorage 或 SessionStorage 中，然后在其他标签页中读取这些数据来实现通信。

- 使用 Broadcast Channel API：Broadcast Channel API 允许不同的标签页在同一浏览器中进行通信。你可以在一个标签页中创建一个 Broadcast Channel，然后在其他标签页中监听该频道，并发送消息到频道中。这样，所有订阅该频道的标签页都能接收到消息。

- 使用 SharedWorker：SharedWorker 是一种特殊的 Web Worker，可以在多个浏览器标签页之间共享上下文。你可以创建一个 SharedWorker，并在多个标签页中共享该 Worker。标签页可以通过与 SharedWorker 进行通信来实现数据交换和消息传递。

- 使用 Server-Sent Events (SSE)：Server-Sent Events 是一种基于 HTTP 的单向通信机制，可以使服务器向浏览器推送事件。你可以在一个标签页中通过 SSE 连接订阅服务器发送的事件，并在其他标签页中接收这些事件。

- 使用 WebSocket：WebSocket 是一种全双工的通信协议，提供了实时、双向的通信能力。你可以在不同标签页中通过 WebSocket 连接到同一个服务器，并在标签页之间进行实时通信。

### 浏览器缓存机制

### 写一个插件全局替换样式

```js
const postcss = require('postcss')

module.exports = postcss.plugin('addPrefix', function (options) {
  return function (root) {
    root.walkRules(function (rule) {
      rule.selectors = rule.selectors.map(function (selector) {
        return options.prefix + ' ' + selector
      })
    })
  }
})

// 使用
const AddPrefixPlugin = require('./addPrefixPlugin')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  AddPrefixPlugin({
                    prefix: '.my-prefix',
                  }),
                ],
              },
            },
          },
        ],
      },
    ],
  },
}
```

### 写过 webpack 插件

插件的工作原理依赖于 Webpack 的插件系统和构建流程。Webpack 构建过程中的不同阶段和事件都提供了对应的钩子，插件可以根据需要监听和处理这些钩子，以实现定制化的功能。

```js
class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑；
    compiler.hooks.emit.tap('HelloPlugin', (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数；
    })

    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知webpack，才会进入下一个处理流程。
    compiler.plugin('emit', function (compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行
      callback()
    })
  }
}

module.exports = HelloPlugin
```

### 分包如何优化，或者说性能如何优化的

### 小程序与普通页面的区别

- 快速的加载
- 更强大的能力
- 原生的体验
- 易用且安全的微信数据开放
- 高效和简单的开发

### 大数溢出如何处理

在 js 中，大数溢出的范围是 在 JavaScript 中，使用 Number 类型表示的数字有一个上限，即 Number.MAX_SAFE_INTEGER。这个值是 2 的 53 次方减 1，约为 9007199254740991。超过这个值的整数将无法被准确表示，可能会导致精度丢失。

然而，如果你需要处理更大的整数，JavaScript 提供了 BigInt 类型来解决大数溢出的问题。BigInt 类型可以表示任意大小的整数，不会受到 Number 类型的限制。你可以使用 BigInt 类型来进行大数运算，而不会丢失精度。

在浏览器里拿到的时候，就已经晚了，需要后端处理。但是前端非得处理的话，可以写个函数，或者用 bigInt

- 平时发送请求时，都是前端库做的转换处理，比如 res.json()，将后台的 json 字符串转换了，导致了 里面的数字溢出了，其实可以拿到 res 时，用 res.text()，等当成字符串处理就不会丢失了
- 而浏览器的 content-type 只是辅助浏览器去解析对应的资源，比如点击一个下载链接，此时浏览器需要展示它，所以做了解析处理，同样，发请求时，浏览器并不会处理，都是业务侧自己处理，也就是网络库处理的

### 打家劫舍 II

在 打家劫舍 I 的基础上，II 收尾不能相连，因此需要消除这种 case

- 只需要处理前 n-1 项，或者 1 - n 项就可以消除这种 case

```js
const rob = (nums) => {
  const len = nums.length
  if (!len) return 0
  if (len === 1) return nums[0]
  if (len === 2) return Math.max(nums[0], nums[1])

  return Math.max(robRange(nums, 0, len - 2), robRange(nums, 1, len - 1))
}

const robRange = (nums, start, end) => {
  // 利用遍历，和 中间缓存，得到后面的值
  let first = nums[start]
  let second = Math.max(nums[start], nums[start + 1])

  // 遍历指定的数据，然后得到最大值，从start 开始，这里需要等于 len
  for (let i = start + 2; i <= end; i++) {
    temp = second // 先把这一项暂存，因为后面要产生新的值，会覆盖他
    // 其实这里的 nums[i-2] 就是 first, nums[i-1] 就是second
    // second = Math.max(nums[i-2]+nums[i], nums[i-1])
    second = Math.max(first + nums[i], second)
    first = temp
  }

  return second
}
```

### 打家劫舍 I

```js
// 打家劫舍1
const rob1 = (moneys) => {
  // dp[i] 偷到第几家的最大值
  // 动态方程：dp[i] = dp[i-1] + num  dp[i-1]
  const len = moneys.length
  let dp = Array(len).fill(0)

  if (!len) return 0
  if (len === 1) return moneys[0] // 这里不能返回 dp[0]，因为需要返回第一项

  dp[0] = moneys[0]
  dp[1] = Math.max(moneys[0], moneys[1])

  for (let i = 2; i < len; i++) {
    // dp[i-1] + moneys[i] 这里应该是 dp[i-2] + moneys[i]，因为不能相邻
    dp[i] = Math.max(dp[i - 2] + moneys[i], dp[i - 1])
  }

  return dp[len - 1]
}
```

## 20231204 周一

### 实现串行打印

```js
async function sequentialCalls(arr) {
  const runTask = (num) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(num)
        resolve()
      }, num * 1000)
    })
  }

  for (const num of arr) {
    await runTask(num)
  }
}
sequentialCalls([1, 3, 2]) // 分别几秒后打印
```

### 实现 promise.all

```js
const myPromise = function (ps) {
  return new Promise((resolve, reject) => {
    const res = []
    let count = 0
    for (let i = 0; i < ps.length; i++) {
      ps[i]
        .then((val) => {
          count++
          res[i] = val
          if (count === ps.length) {
            resolve(res)
          }
        })
        .catch((err) => reject(err))
    }
  })
}

const tasks = [
  new Promise((resolve) => setTimeout(resolve(1), 1000)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve, reject) => reject('err')),
]

myPromise(tasks).then((res) => console.log('res', res))
```

## 20231203 周日

### ?? 是一个逻辑运算符，称为 Nullish Coalescing Operator（空值合并运算符

```js
a ?? b // 只有当 a 是 null 或者 undefined 时才会返回 b
a || b // a 是假值，都会返回 b
```

### 接雨水

```js
var trap = function (height) {
  let left = 0
  let right = height.length - 1

  // 记录左右两侧柱子的最大高度
  let maxLeft = 0
  let maxRight = 0

  // 结果
  let res = 0

  // 循环，当左指针小于右指针
  while (left < right) {
    // 分别对比左右指针的高度，只有低的柱子才可能有水
    if (height[left] < height[right]) {
      // 只有低的才会存水，大于的，则没法存水
      if (maxLeft < height[left]) {
        maxLeft = height[left]
      } else {
        // 比最大高度高，则存水
        res += maxLeft - height[left]
      }
      left++
    } else {
      if (maxRight < height[right]) {
        maxRight = height[right]
      } else {
        res += maxRight - height[right]
      }
      right--
    }
  }

  return res
}
```

### 最长递增子序列

```js
// 最长递增子序列
// 使用动态规划，
var lengthOfLIS = function (nums) {
  // 1、明确定义：dp[i] 表示 第i项时，递增子序列的最长长度
  // 2、状态转移方程：dp[i] = Math.max(dp[j]) + 1，而j的范围是 0 =< j < i
  // 在计算 dp[i] dp[i] 之前，我们已经计算出dp[0...i-1] 了，只需要找出最大值即可
  let dp = Array(nums.length).fill(1)
  let res = 1

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    res = Math.max(res, dp[i])
  }
  return res
}
```

### 最长连续递增序列

```js
var findLengthOfLCIS = function (nums) {
  if (nums.length === 0) {
    return 0
  }

  let maxLen = 1
  let curLen = 1

  // 遍历，然后后面比前面的大，则当前长度增加
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      curLen++
    } else {
      // 否则，取出最大值
      maxLen = Math.max(maxLen, curLen)
      curLen = 1 // 重新赋值
    }
  }

  return Math.max(maxLen, curLen)
}
```

### 128. 最长连续序列

```js
var longestConsecutive = function (nums) {
  // 思路，通过set去重，然后遍历，找起点
  // 怎么找起点呢，通过最后一位开始找
  const set = new Set(nums)
  let max = 0

  for (let i = 0; i < nums.length; i++) {
    // 如果当前数字的前一位不在set里，说明当前数字是新的递增序列的起点
    // 注意是前一位
    if (!set.has(nums[i] - 1)) {
      // 既然是起点，则开始累加
      let curLen = 1
      let curNum = nums[i]

      // 以起点开始，向后累加
      while (set.has(curNum + 1)) {
        curLen++
        curNum++
      }

      // 循环结束，返回最终的结果
      max = Math.max(max, curLen)
    }
  }
  return max
}
```

### 无重复的最长子串

```js
var lengthOfLongestSubstring = function (s) {
  let right = 0
  let str = ''
  let max = 0

  // 不能等于length
  while (right < s.length) {
    if (str.indexOf(s[right]) === -1) {
      str += s[right]
      right++
      max = Math.max(str.length, max)
    } else {
      str = str.slice(1)
    }
  }
  return max
}
```

### 判断回文链表 II

可以删除一个字符，然后再判断是否为回文字符串

```js
function isPalindrome(str, l, r) {
  while (l < r) {
    //对撞指针不断判断两边的数字是否相等
    if (str[l] != str[r]) {
      return false
    }
    l++
    r--
  }
  return true
}

var validPalindrome = function (s) {
  let l = 0,
    r = s.length - 1

  while (l < r) {
    if (s[l] !== s[r]) {
      //左右指针不一样 还有一次机会，左指针向前一步或者右指针向后一步继续验证
      return isPalindrome(s, l + 1, r) || isPalindrome(s, l, r - 1)
    }
    l++
    r--
  }
  return true
}
```

### 判断回文链表

```js
var isPalindrome = function (head) {
  let res = ''
  while (head) {
    res += head.val
    head = head.next
  }
  // 利用双指针，循环字符串，前后对比
  for (let i = 0, j = res.length - 1; i < j; i++, j--) {
    if (res[i] !== res[j]) {
      return false
    }
  }
  return true
}

// 除了上面的常规操作，还可以递归到最后，然后再与左侧挨个对比
var isPalindrome = function (head) {
  let left = head

  const travrse = (right) => {
    if (!right) return true // 到头了，就返回true
    let res = travrse(right.next)
    // 执行到下面一行，说明已经到最右侧了
    res = res && right.val === left.val
    left = left.next
    return res
  }
  // 传入head，然后递归到最右侧，然后再与左侧相对比
  return travrse(head)
}
```

### x 的平方根

```js
// 二分法，判断
var mySqrt = function (x) {
  let left = 0
  let right = x

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (mid * mid === x) {
      return x
    } else if (mid * mid < x) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return right // 最后左边界可能超过，但right可能不会超过，项目要求的也是小值，因此返回right
}
```

### 求数的 n 次方

```js
// 递归调用 myPow 的次数为 log(n)。因此，总的时间复杂度可以表示为 O(log(n))
var myPow = function (x, n) {
  // 下面注释的逻辑，仅仅支持正数
  // let res = x
  // while(n--) {
  //     res = res * x
  // }
  // return res

  if (n === 0) return 1 // 任何数的0次方都是1
  if (n < 0) return 1 / myPow(x, -n) // 负数需要取倒数

  if (n % 2) return x * myPow(x, n - 1) // 奇数时，x的n次方 = x*x的n-1次方

  return myPow(x * x, n / 2) //n是偶数，使用分治，一分为二，等于x*x 的n/2次方; x 的平方 乘以 x的n/2 就是x的n次方
}

// 迭代法，复杂度仍然为 O(log(n))
var myPow = function (x, n) {
  if (n === 0) return 1
  if (n < 0) {
    x = 1 / x
    n = -n
  }

  let res = 1
  while (n > 0) {
    if (n % 2) {
      // 奇数
      res *= x
    }
    // 偶数时，累积 x
    x *= x
    n = Math.floor(n / 2)
  }

  return res
}
```

## 20231201 周五

### 未来 js 的方向

- js 执行的少
  - 砍掉虚拟 dom，服务端渲染，rsc
- js 执行的快
  - 加载快
  - 执行快
- 抽象，向上层抽象。

### vue3 与 vue2 的区别

- 数据劫持方式不同
- 根节点数量不同
  - vue3 可以支持多个根节点，是因为编译时，会动态判断，如果是多节点，则会通过 fragment 包括下。
  - Vue 2.x 的编译器在处理模板时使用了一种虚拟 DOM（Virtual DOM）的算法，该算法需要一个根节点作为整个模板的入口
- componstion Api
- 生命周期的变化
  - setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地去定义
- suspense 异步组件
  - 允许程序在等待异步组件加载完成前渲染兜底的内容，
  - 需在模板中声明，并包括两个命名插槽：default 和 fallback。Suspense 确保加载完异步内容时显示默认插槽，并将 fallback 插槽用作加载状态。
- Teleport
  - Teleport 组件可将部分 DOM 移动到 Vue app 之外的位置。比如项目中常见的 Dialog 弹窗
- 虚拟 DOM
  - Vue3 相比于 Vue2 虚拟 DOM 上增加 patchFlag 字段，意思就是更加精细化的判断是哪部分数据发生了变化，进而只改对应部分，比如文本内容，样式等
  - 静态提升，对于不需要更新的 vnode，会做静态提升，只会生成一次，后续直接使用
- 事件缓存
  - cacheHandler 在第一次渲染后缓存我们的事件，vue2 中我们写的@click="onClick"也是被当作动态属性，diff 的时候也要对比。但我们知道它不会变化，比如变成@click="onClick2"，绑定别的值。
  - 在 vue3 中，如果事件是不会变化的，会将 onClick 缓存起来（跟静态提升达到的效果类似），该节点也不会被标记上 PatchFlag（也就是无需更新的节点）
- Diff 算法优化
  - patchFlag 帮助 diff 时区分静态节点，以及不同类型的动态节点
  - Block 其实就相当于普通的虚拟节点加了个 dynamicChildren 属性，能够收集节点本身和它所有子节点中的动态节点。当需要更新 Block 中的子节点时，只要对 dynamicChildren 存放的动态子节点进行更新就可以了。
- 按需编译、打包优化 tree-shaking
  - 将 nextTick、transition 等等，都独立出来了
- custom renderer api
  - 之前 vue2 的时候，渲染函数是与 vue2 强耦合的，对于渲染到其他平台不太友好，现在则单独封装，直接魔改即可。也就 高度模块化的
  - createRenderer 就是用来创建自定义渲染器的函数
- typescript 支持
- 轻松识别组件重新渲染原因，renderTriggered
- v-if v-for 优先级
  - 在 vue2 中，最好不要把 v-if 和 v-for 同时用在一个元素上，这样会带来性能的浪费(每次都要先渲染才会进行条件判断)
  - 在 vue3 中，v-if 优先于 v-for 生效

```js
// patchFlags 字段类型列举
export const enum PatchFlags {
  TEXT = 1,   // 动态文本内容
  CLASS = 1 << 1,   // 动态类名
  STYLE = 1 << 2,   // 动态样式
  PROPS = 1 << 3,   // 动态属性，不包含类名和样式
  FULL_PROPS = 1 << 4,   // 具有动态 key 属性，当 key 改变，需要进行完整的 diff 比较
  HYDRATE_EVENTS = 1 << 5,   // 带有监听事件的节点
  STABLE_FRAGMENT = 1 << 6,   // 不会改变子节点顺序的 fragment
  KEYED_FRAGMENT = 1 << 7,   // 带有 key 属性的 fragment 或部分子节点
  UNKEYED_FRAGMENT = 1 << 8,   // 子节点没有 key 的fragment
  NEED_PATCH = 1 << 9,   // 只会进行非 props 的比较
  DYNAMIC_SLOTS = 1 << 10,   // 动态的插槽
  HOISTED = -1,   // 静态节点，diff阶段忽略其子节点
  BAIL = -2   // 代表 diff 应该结束
}


// 生命周期
beforeCreate  -> setup()	开始创建组件之前，创建的是data和method
created       -> setup()
beforeMount   -> onBeforeMount	组件挂载到节点上之前执行的函数。
mounted       -> onMounted	组件挂载完成后执行的函数
beforeUpdate  -> onBeforeUpdate	组件更新之前执行的函数。
updated       -> onUpdated	组件更新完成之后执行的函数。
beforeDestroy -> onBeforeUnmount	组件挂载到节点上之前执行的函数。
destroyed     -> onUnmounted	组件卸载之前执行的函数。
activated     -> onActivated	组件卸载完成后执行的函数
deactivated   -> onDeactivated  在组件切换中老组件消失的时候执行
```

#### vue 与 react 的 diff 算法区别

- vue 对比节点。当节点元素相同，但是 classname 不同，认为是不同类型的元素，删除重建，而 react 认为是同类型节点，只是修改节点属性。
- vue 的列表对比，采用的是两端到中间比对的方式，而 react 采用的是从左到右依次对比的方式。当一个集合只是把最后一个节点移到了第一个，react 会把前面的节点依次移动，而 vue 只会把最后一个节点移到第一个。总体上，vue 的方式比较高效。

- [为什么 React 的 Diff 算法不采用 Vue 的双端对比算法？](https://juejin.cn/post/7116141318853623839)
- [根据大崔哥的 mini-vue 来理解 vue3 中的 diff 算法](https://juejin.cn/post/7045976871116210213)

React 不能通过双端对比进行 Diff 算法优化是因为目前 Fiber 上没有设置反向链表，而且想知道就目前这种方案能持续多久，如果目前这种模式不理想的话，那么也可以增加双端对比算法。

#### react diff 算法

1. 第一轮，从左向右新老节点进行比对查找能复用的旧节点，如果有新老节点比对不成功的，则停止这一轮的比对，并记录了停止的位置。
2. 如果第一轮比对，能把所有的新节点都比对完毕，则删除旧节点还没进行比对的节点。
3. 如果第一轮的比对，没能将所有的新节点都比对完毕，则继续从第一轮比对停止的位置继续开始循环新节点，拿每一个新节点去老节点里面进行查找，有匹配成功的则复用，没匹配成功的则在协调位置的时候打上 Placement 的标记。
4. 在所有新节点比对完毕之后，检查还有没有没进行复用的旧节点，如果有，则全部删除。
5. 也是使用分层比较

#### vue diff 算法

1. 如果新节点有子节点而老节点没有子节点，则判断老节点是否有文本内容，如果有就清空老节点的文本内容，然后为其新增子节点。
2. 如果新节点没有子节点而老节点有子节点，则先删除老节点的子节点，然后设置文本内容。
3. 如果新节点没有子节点，老节点也没有子节点，则进行文本的比对，然后设置文本内容。
4. 如果新节点有子节点，老节点也有子节点，则进行新老子节点的比对，然后进行新增、移动、删除的操作，这也就是传说中的 diff 算法发生的地方。

比对新老两个虚拟 DOM，就是通过循环，每循环到一个新节点，就去老节点列表里面找到和当前新节点相同的旧节点。如果在旧节点列表中找不到，说明当前节点是需要新增的节点，我们就需要进行创建节点并插入视图的操作；如果找到了，就做更新操作；如果找到的旧节点与新节点位置不同，则需要移动节点等。

其中为了快速查找到节点，Vue2 的 diff 算法设置了 4 种优化策略，分别是：

1. 老数组的开始与新数组的开始
2. 老数组的结尾与新数组的结尾
3. 老数组的开始与新数组的结尾
4. 老数组的结尾与新数组的开始

通过这 4 种快捷的查找方式，我们就不需要循环来查找了，只有当以上 4 种方式都查找不到的时候，再进行循环查找。

#### vue3 diff 算法

##### 第一轮，常见情况的比对

首先从左往右进行比对，如果是相同的就进行更新比对，如果不相同则停止比对，并且记录停止的下标。
再从右往左进行比对，如果是相同的就进行更新比对，如果不相同也停止比对，也进行记录停止的下标。
通过这样左右进行比对，最后就可以把真正复杂部分进行范围锁定了。
左右比对完之后，如果新节点已经比对完了，老节点列表还存在节点未比对，则删除老节点列表上的未比对的节点，如果老节点已经比对完了，新节点列表还存在未比对的节点则进行创建。

##### 第二轮，复杂情况的比对

如果新节点未比对完，老节点也未比对完，则进行最后最复杂的处理。
先把剩下的新节点处理成节点的 key 为 key, 节点下标为 value 的 Map；
接着初始化一个长度为剩下未比对的新节点的长度的数组 newIndexToOldIndexMap，初始化每个数组的下标的默认值为 0。
再循环剩下的旧节点，通过旧节点的 key 去刚刚创建的 Map 中查找，看看旧节点有没有在新节点中，如果旧节点没有 key 则需要通过循环剩下的新节点进行查找。
如果旧节点在新节点中没找到，则说明该旧节点需要进行删除。
如果找到了，则把找到的新节点的下标对应存储到上述的数组 newIndexToOldIndexMap 中，然后更新比对匹配到的新老节点。
把所有的旧节点比对完成后，就会得到一个刚刚收集的新节点的下标数组，然后对这个新节点的下标数组进行进行最长递增子序列查找得到一个最长递增子序列的下标数据。
然后再进行循环左右对比完之后剩余新节点的下标，然后判断循环的下标是否被上述的数组 newIndexToOldIndexMap 进行收集了，如果没被收集到则说明这个新节点需要进行创建，如果已经被收集了则判断该循环的下标是否在上面计算得到的最长递增子序列中，如果不在则需要对该循环节点进行移动操作。

```js
var lengthOfLIS = function (nums) {
  // 1、dp[i]的定义：dp[i]表示以nums[i]结尾的最长递增子序列的长度，递增肯定要大于最后一个
  // 2、定义状态转移方程：
  // 2.1 位置i的最长升序子序列等于j从0到i-1各个位置的最长升序子序列 + 1 的最大值。
  // 2.2 所以：if (nums[i] > nums[j]) dp[i] = max(dp[i], dp[j] + 1);
  // 3、dp[i]的初始化，每一个i，对应的dp[i]（即最长递增子序列）起始大小至少都是1.
  // 4、确定遍历顺序：dp[i] 是有0到i-1各个位置的最长递增子序列 推导而来，那么遍历i一定是从前向后遍历。
  // 5、举例推导dp数组

  let dp = Array(nums.length).fill(1) // 长度至少都是1
  let res = 1

  for (let i = 1; i < nums.length; i++) {
    // 外层每遍历一个数字，内层就需要遍历一遍，然后才能得到最大值
    for (let j = 0; j < i; j++) {
      // let j = i - 1
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    res = Math.max(res, dp[i])
  }
  return res
}
```

#### diff 算法区别

Vue 3.x 与 Vue 2.x 在 diff 算法上有很大的不同。Vue 3.0 采用了基于 Proxy 的响应式系统，重写了虚拟 DOM 的内部实现，相对于 Vue 2.x 的 diff 算法，有以下不同之处：

- Vue 2 使用的是基于递归的双指针的 diff 算法，而 Vue 3 使用的是基于数组的动态规划的 diff 算法。Vue 3 的算法效率更高，因为它使用了一些优化技巧，例如按需更新、静态标记等。
- Vue 2 的 diff 算法会对整个组件树进行完整的遍历和比较，而 Vue 3 的 diff 算法会跳过静态子树的比较，只对动态节点进行更新。这减少了不必要的比较操作，提高了性能。
- Vue 2 的 diff 算法对于列表渲染（v-for）时的元素重新排序会比较低效，需要通过给每个元素设置唯一的 key 来提高性能。而 Vue 3 的 diff 算法在列表渲染时，通过跟踪元素的移动，可以更好地处理元素的重新排序，无需设置 key。
- Vue 3 的 diff 算法对于静态节点的处理更加高效，静态节点只会在首次渲染时被处理，后续更新时会直接跳过比较和更新操作，减少了不必要的计算。

1. 静态提升和组合：Vue 2.x 中静态节点会在更新时重复比较，但在 Vue 3.0 中，静态节点会被静态提升并缓存，大幅减少了比较时间。另外，Vue 3.0 借鉴了 React 的 fragments 技术，可以通过 createBlock() 函数将多个子元素组成一组返回，避免了不必要的包装和渲染。
2. 源码卷积：Vue 3.0 是使用模块化源代码，尤其是在虚拟 DOM 中，将所有功能都分装为 create 函数，优化了组件的运行时速度。
   支持 HOC：对于复杂组件，Vue 3.0 可以通过 defineComponent 和 withDirectives 等方法支持 HOC 装饰器和指令功能，让组件变得更加灵活、可复用性更高。
3. 支持 HOC：对于复杂组件，Vue 3.0 可以通过 defineComponent 和 withDirectives 等方法支持 HOC 装饰器和指令功能，让组件变得更加灵活、可复用性更高。
4. vue 3.x 在更新时采用了双缓存技术并优化了虚拟 DOM 的实现原理，相较于 Vue 2.x 的 diff 算法，更新的效率和性能都有很大的提高。

在 Vue 3 的 diff 算法中，它通过跟踪元素的移动来确定元素的重新排序，而不依赖于设置 key。当列表发生重排时，Vue 3 会根据元素的身份（identity）来判断元素的移动方式，从而避免了不必要的元素销毁和重新创建的操作，提高了性能。

这种改进是通过 PatchFlag（补丁标记）和动态指令提供的优化机制实现的。PatchFlag 记录了每个节点的状态，包括是否需要更新、是否需要移动等信息，从而使得 Vue 3 在进行 diff 操作时能够更精确地判断节点的变化，避免了不必要的操作。

需要注意的是，在某些特殊情况下，仍然可能需要设置 key，例如在使用相同的数据集进行多个列表渲染时，或者需要确保列表项的状态保持一致。但是一般情况下，在 Vue 3 中，不再强制要求设置 key 来提高列表渲染的性能，因为新的 diff 算法已经能够更好地处理元素的重新排序。

### 前端框架

所有框架目前的发展方向都是减少客户端 js 代码、减少 js 运行时间。

不管是放到服务端也好、放到编译时也好、抑或是像 signal 这样 fine grained reactivity 也好，都是为了这一个目标努力

- 目前市场出现的 solid.js，svelte 等等都是为了减少 js 代码，减少 js 的运行时间，比如干掉 vdom，干掉 diff
- 但还可以通过 rsc（react-server-component）、ssr（server side rendering）、ssg(static site generation)、isg()

RSC（React Server Component）：

- RSC 使得服务端和客户端（浏览器）可以协同渲染 React 应用程序，从而实现了部分组件在服务端或客户端两者之间的渲染
- RSC 是 React 生态系统中的一项实验性功能，用于在服务器上呈现 React 组件。
  - 服务器组件可以专注于获取数据和渲染内容。数据都在后台，所以会更快
    - 目的是实现更好的任务分工，让服务器先处理它擅长的事情，然后将剩余任务交给浏览器完成。这样一来，服务器需要传输的内容就减少了，
  - 客户端组件可以专注于状态交互。
  - [更多参考](https://juejin.cn/post/7220061751399170103)
  - [React Server Component 从理念到原理](https://www.51cto.com/article/757841.html)
- RSC 允许在服务器上运行 React 组件，并将其渲染为 HTML，然后将 HTML 发送给客户端进行交互。
- RSC 的目标是提供更好的性能和可维护性，通过在服务器上运行组件逻辑，可以减少网络传输和客户端计算负载。
- 更快的页面加载、更小的 JavaScript 打包大小以及更好的用户体验

SSR（Server-Side Rendering）：

- SSR 是一种将 React 或其他前端框架的组件在服务器上进行渲染，并将渲染结果作为 HTML 发送给客户端的技术。
  - RSC 与 SSR 则都是后端「运行时方案」。也就是说，他们都是前端发起请求后，后端对请求的实时响应。根据请求参数不同，可以作出不同响应。
  - 类似于 SSG，SSR 的输出产物是 HTML，浏览器可以直接解析
  - RSC 会流式输出一种「类 JSON」的数据结构，由前端的 React 相关插件解析
- SSR 的特点是在服务端动态生成完整的 HTML，包括组件内容和初始状态，然后将其发送给客户端。
- SSR 可以提供更好的首次加载性能和搜索引擎优化（SEO），但在每次请求时都需要动态渲染 HTML，可能会增加服务器负载。

SSG（Static Site Generation）：

- SSG 是一种在构建时（而不是在运行时）生成静态 HTML 文件的技术。
- SSG 的特点是在构建过程中预先生成页面的 HTML，将其保存为静态文件，然后在客户端请求时直接提供静态 HTML。
- SSG 可以提供非常快速的加载速度，因为每个页面都是预先生成的，并且不需要服务器进行动态渲染。
  但是，SSG 对于那些包含实时数据或频繁更新的页面可能不太适用，因为它们需要重新构建整个站点才能更新内容。

ISG（Incremental Static Generation）：

- ISG 是一种结合了 SSG 和动态渲染的技术，它允许在构建时生成静态 HTML，并在运行时根据需要增量地更新页面内容。
- ISG 的特点是将一部分页面预先生成为静态 HTML，同时保留一些部分在运行时进行动态渲染。
- 当客户端请求页面时，ISG 可以立即提供静态 HTML，然后在后台异步生成和缓存其他部分的内容，实现增量更新。
- ISG 可以提供更好的性能和用户体验，同时也保留了部分动态内容的灵活性。

Next.js 是一个广泛使用 ISG（Incremental Static Generation）技术的框架。Next.js 是一个基于 React 的前端框架，它提供了强大的静态站点生成功能，允许在构建时生成静态 HTML，并在需要时进行增量更新。

Next.js 提供了一个名为 "getStaticProps" 的特殊函数，用于在构建时获取数据并生成静态 HTML 页面。这样，部分页面的内容可以在构建时预先生成为静态 HTML，而其他部分可以在运行时根据需要进行增量更新。

通过 Next.js 的 ISG 功能，可以实现以下场景：

部分页面内容是静态的，可以在构建时预先生成为静态 HTML。
部分页面内容是动态的，需要在客户端请求时进行渲染。
Next.js 还提供了其他一些优秀的功能，如自动代码分割、服务端渲染（SSR）以及客户端路由等，使得构建现代化、高性能的 Web 应用变得更加方便和高效。

除了上面的一些，其实还有 实现孤岛架构的全栈框架主要是 Astro 与 Qwik

#### vue

Vue.js 使用了一种称为“响应式依赖追踪”的机制来实现响应式更新。
在组件初始化时，Vue.js 会在数据属性上使用 Object.defineProperty 进行劫持，为每个属性创建一个依赖追踪器（Dep）。
当数据属性被读取时，Vue.js 会将当前依赖（如组件的渲染函数）与该属性的依赖追踪器建立关联。
当数据属性发生变化时，Vue.js 会通知相关的依赖，触发相应的更新。

#### react

在 React 中，依赖收集和更新页面的过程是通过 React 的调和（reconciliation）和 diff 算法来实现的。下面是一个简单的描述：

依赖收集：

- 在组件渲染过程中，React 会跟踪组件中使用的状态（如 state 和 props）以及其他上下文（如 context）的读取操作。
- 当组件读取了某个状态或上下文时，React 会将该状态或上下文与当前组件建立关联，形成一个依赖关系。
- React 使用一种称为 "Fiber" 的数据结构来表示组件树，并在 Fiber 节点中记录这些依赖关系。

数据变化和更新页面：

- 当组件中的状态或上下文发生变化时，React 会触发重新渲染过程。
- 在重新渲染过程中，React 会通过比较新旧状态或上下文的值来确定是否需要更新组件。
- React 使用 diff 算法来比较新旧 Fiber 树的差异，并找出需要进行更新的部分。
- 通过 diff 算法，React 可以高效地确定需要添加、移动或删除的 DOM 元素，并生成相应的更新操作。
- 一旦确定了需要更新的部分，React 会根据更新操作对 DOM 进行相应的操作，将页面更新为最新的状态。

需要注意的是，React 并不直接对每个状态或上下文的变化进行监听，而是在组件重新渲染时，通过对新旧状态或上下文的比较，来确定是否需要更新页面。这种基于比较的更新方式可以提高性能，避免了频繁的监听和回调操作。

此外，React 还提供了一些优化手段，如 shouldComponentUpdate、React.memo 和 React.useMemo 等，来帮助开发者更好地控制组件的更新过程，避免不必要的渲染。

- 基于虚拟 DOM（Virtual DOM）实现高效的 UI 更新
- React 使用虚拟 DOM（Virtual DOM）和一种称为协调（Reconciliation）的算法来实现响应式更新。当数据发生变化时，React 会创建一个新的虚拟 DOM 树与之前的虚拟 DOM 树进行比较，找出差异。

然后，React 仅更新发生变化的部分，将这些变化批量应用到实际的 DOM 中，以提高性能

总结：

- react 是使用 setState 来主动通知框架，现在需要更新，然后再根据核心的 view=fn(state) 公式，把发生状态变化的组件及它的 props 发生变化的子组件重新执行一遍，形成新的 vdom，然后才是 diff 之类的
- 这样的效果就是，每次数据发生变更，都需要重新生成对应组件的 vdom
- 相比于 svelte 的 singal 方式，是在编译时，就已经精细化的确定的待更新的范围，后续仅仅更新指定区域即可。

1、svelte 编译时就知道有哪些状态
2、svelte 编译时就知道每个状态对应哪个节点
3、svelte 编译时就知道每个状态何时改变

所以编译器是不是可以针对每个状态的变化，生成更新对应依赖这个状态的节点的代码？
是不是可以在每个状态发生改变的地方下一行插一个语句来触发更新？

#### anglar

#### svelte

Svelte 是一个组件框架，类似于 React 或 Vue，但有一个重要的区别。传统框架允许你编写声明性状态驱动的代码，但有一个缺点：浏览器必须做额外的工作来将这些声明性结构转换为 DOM 操作，使用虚拟 DOM diffing 等技术，这些技术会占用你的帧预算并给垃圾收集器带来负担。

相反，Svelte 在构建时运行，将您的组件转换为高效的命令式代码，以外科手术方式更新 DOM。查看编译后的代码，发现很多都是直接操作 dom。

- Svelte 是一个编译型的前端框架，将组件转换为高效、可复用的纯 JavaScript 代码。
- 在构建时将组件转换为原生的 JavaScript 代码，不需要在运行时进行框架解析和虚拟 DOM 操作。
- 生成的代码体积小、运行快速，适用于对性能要求较高的应用。

```js
// 使用 signal
import { createSignal, onCleanup } from 'svelte';

// 使用 signal 声明一个响应式变量
const [count, setCount] = createSignal(0);

// 定义一个自动更新的计时器
const interval = setInterval(() => {
  setCount(count() + 1);
}, 1000);

// 当组件销毁时清除计时器
onCleanup(() => {
  clearInterval(interval);
});

// Svelte 组件模板
<script>
  export let count;
</script>

<h1>Count: {count}</h1>
```

下面是不使用 singal

```js
import { reactive, onCleanup } from 'svelte';

// 创建一个普通的 reactive 对象
const state = reactive({
  count: 0,
});

// 定义一个自动更新的计时器
const interval = setInterval(() => {
  state.count += 1;
}, 1000);

// 当组件销毁时清除计时器
onCleanup(() => {
  clearInterval(interval);
});

// Svelte 组件模板
<script>
  export let count;
</script>

<h1>Count: {state.count}</h1>
```

这两个示例代码展示了使用 signal 和不使用 signal 的方式来实现一个计时器。使用 signal 可以更显式地声明依赖关系，并且在更新时只更新变化的部分。而不使用 signal 则是一种更传统的响应式方式，直接修改属性值来触发更新。

#### solid.js

- 无虚拟 DOM：与传统的虚拟 DOM 不同，Solid.js 采用了一种叫做“fine-grained reactivity”的方法。它使用细粒度的响应追踪和直接的 DOM 更新，以减少不必要的开销，提高渲染性能。
- 响应式：Solid.js 支持响应式编程，通过追踪数据的依赖关系，实现了高效的重新渲染机制。只有发生变化的部分会被更新，从而提供了更好的性能。

- Solid.js 使用了一种称为“细粒度响应追踪”的方法来实现响应式更新。
- Solid.js 通过追踪 JavaScript 表达式中的数据依赖关系，而不是追踪整个组件树的变化。
- 当数据发生变化时，Solid.js 可以精确地确定哪些表达式依赖于该数据，并仅更新相关的部分。
- Solid.js 采用直接的 DOM 更新方式，而不使用虚拟 DOM，以减少不必要的开销，提高渲染性能。

### 跨端方案

早期 H5 和 Hybrid 方案的本质是，利用客户端 App 的内置浏览器（也就是 webview）功能，通过开发前端的 H5 页面满足跨平台需求。比如 PhoneGap cordova ionic

#### weex

Weex 采用了一种将组件树转换为原生控件的方式进行渲染。在运行时，Weex 的渲染引擎会解析组件树，并通过与底层的原生渲染引擎进行通信，将组件映射为对应的原生控件。

Weex 的渲染原理中，底层的原生渲染引擎负责实际的 UI 渲染工作，Weex 的渲染引擎充当一个中间层，负责转发指令和数据更新等操作。

和目前小程序很像

你可以把 weex-vue-framework 框架当成被改造的 Vue.js。语法和内部机制都是一样的，只不过 Vue.js 最终创建的是 DOM 元素，而 weex-vue-framework 则是向原生端发送渲染指令，最终渲染生成的是原生组件。

1. 前端开发可以写熟悉 vue 语法的单文件，然后打包成出来一份 dist —— JS Bundle，然后部署到服务器上
2. 客户端打开某一个页面，通过网络下载 JS Bundle，然后在客户端本地执行该 JS Bundle
3. 客户端提供了 JS 的执行引擎(JSCore)用于执行远程加载到 JS Bundle
   JS 执行引擎执行 JS Bundle，和浏览器的过程类似，JS Bundle 的代码被执行，生成 VNode 树进行 patch，找出最小操作 DOM 节点的操作，把对 DOM 节点的操作转变为 Native DOM API, 调用 WXBridge 进行通信
4. WXBridge 将渲染指令分发到 native（Andorid、iOS）渲染引擎，由 native 渲染引擎完成最终的页面渲染

在执行 patch 之前的过程都是 Web 和 Weex 通用的，后面的流程就不一样了，因为客户端没有对 DOM 增删改查的 API，所以这些更新的操作，需要经过 weex-vue-framework 的处理，统统映射为客户端的 Native DOM API

weex 终端的执行引擎在执行到 Native DOM API 后，WXBridge 将 Native DOM API 转化为 Platform API

Platform API 是 Weex SDK 中原生模块提供的,不是 js 中方法，也不是浏览器中的接口，是 Weex 封装的一系列方法。

#### react native

使用 React 来创建 Android 和 iOS 的原生应用

React Native 使用了一种桥接机制（Bridge），它的作用是将 React 组件映射到对应的原生控件。这意味着 React Native 应用的界面并非完全由原生控件构成，而是在原生应用中嵌入了一个特殊的视图层，该视图层负责处理 React 组件的渲染和交互。

当 React 组件需要在屏幕上显示时，React Native 的桥接机制会将组件的描述信息传递给原生层。原生层根据这些描述信息，去创建对应的原生控件，并将这些控件放置在正确的位置上，形成了组件在屏幕上的可见部分。

#### flutter

Flutter 使用自绘引擎进行渲染，也称为 Skia 渲染引擎。它通过使用自定义的渲染引擎，绕过了原生平台的 UI 组件，直接在屏幕上绘制 UI。

Flutter 的自绘引擎使用 Skia 图形库进行绘制，将所有的 UI 组件都抽象为绘制指令，并通过硬件加速来实现高性能的图形渲染。

Weex 和 Flutter 在性能方面有所不同。**Weex 的渲染引擎需要与原生渲染引擎进行通信，可能会引入一定的性能开销**。而 Flutter 的自绘引擎能够直接操作底层图形库，具有较高的渲染性能。

### 编译型语言

- rust
  - 类似 c++，可直接操作底层，更快，没运行环境，gc 需要手动维护
  - Rust 速度惊人且内存利用率极高。由于没有运行时和垃圾回收，它能够胜任对性能要求特别高的服务，可以在嵌入式设备上运行，还能轻松和其他语言集成。
    - 高性能：rust 没有运行环境，指的是 rust 编译后生成的二进制文件不依赖于任何运行时环境，而 js 则需要运行时环境。
    - 可靠性：Rust 引入了所有权系统和借用检查器，生命周期等机制。这些机制使编译器能够在编译期间进行静态分析，确保没有数据竞争和内存访问错误。通过在编译时处理内存管理，Rust 可以避免动态运行时的开销和垃圾回收带来的性能损失。
- go
  - esbuild
  - 是一门静态类型的编程语言，具有简洁的语法风格。它采用垃圾回收机制来管理内存，提供了协程（goroutine）和通道（channel）等原语来实现并发编程。

### 构建工具

- webpack
  - 插件，loader
- vite
  - 在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。
  - **直接使用原生模块**：使用 ES 模块原生模块，将模块的依赖关系推迟到浏览器运行时，使得启动阶段很快
  - 预构建：vite 会使用 esbuild 预构建那些第三方包，首次访问某个模块时，将该模块独立地构建为一个包，并缓存起来
  - 按需编译：Vite 只编译那些被当前页面所需要的模块，这是因为它依赖于浏览器的 ES 模块加载能力，将模块的依赖关系推迟到了浏览器运行时
    - 这样，当浏览器请求一个模块时，Vite 可以根据实际需要，仅构建该模块及其相关的依赖模块，而无需重新构建整个项目
    - 而 webpack 将所有模块打包成一个或多个捆绑包，以便在浏览器中加载，无法实现精确的按需编译
  - 缓存：将编译好的资源缓存起来
  - HMR：只替换变更的地方，最小化改动。
  - 为什么生产环境依然需要打包
    - 尽管原生 ESM 现在得到了广泛支持，但由于**嵌套导入会导致额外的网络往返**，
    - 在**生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）**，毕竟原生模块，还是需要编译的。
  - 为什么不用 esbuild 打包
    - Vite 目前的插件 API 与使用 esbuild 作为打包器并不兼容
    - Rollup 已经开始着手改进性能，在 v4 中将其解析器切换到 SWC。就可以在 Vite 中取代 Rollup 和 esbuild，显著提高构建性能，并消除开发和构建之间的不一致性
    - SWC 通过利用 Rust 语言的优势和并行处理技术，实现了出色的编译性能，可以取代 babel，侧重于编译器，而 esbuild 是打包器。
- rollup
- parcel
- esbuild
  - go
- respack
  - rust
- swc
  - rust

## 20231130 周四

### 找出数组中不同的值

```js
function findDifferentValues(arr1, arr2) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  const diff = []

  for (const value of set1) {
    if (!set2.has(value)) {
      diff.push(value)
    }
  }

  for (const value of set2) {
    if (!set1.has(value)) {
      diff.push(value)
    }
  }

  return diff
}

const difference = (arr1, arr2) => {
  const map = {}
  const res = []
  arr1.forEach((v) => (map[v] = v))

  arr2.forEach((v) => {
    if (map[v] === void 0) {
      res.push(v)
    } else {
      delete map[v]
    }
  })
  return res.concat(Object.values(map))
}
difference([2, 1], [2, 3]) // [3, 1]

const difference = (arr1, arr2) => {
  const map = {}
  arr1.forEach((v) => (map[v] = v))

  return arr2.reduce((acc, cur) => {
    if (map[cur] === void 0) {
      acc.push(cur)
    } else {
      // 删除多余的
      delete map[cur]
    }
    console.log('djch acc', acc)
    // 拼接之前的，然后再去重
    return [...new Set(acc.concat(Object.values(map)))]
  }, [])
}
difference([2, 1], [2, 3])

const difference = (arr1, arr2) => {
  const map = {}
  arr1.forEach((v) => (map[v] = v))

  arr2.forEach((v) => {
    if (map[v] === void 0) {
      map[v] = v
    } else {
      delete map[v]
    }
  })
  return Object.values(map)
}
difference([2, 1], [2, 3]) // [1, 3]
```

### 作用域

```js
function bar() {
  console.log(myName)
}
function foo() {
  var myName = '极客邦'
  bar()
}
var myName = '极客时间'
foo() // 极客时间
```

其实在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer。当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找。我们把这个**通过作用域查找变量的链条叫做作用域链，切记切记：作用域链的顺序与执行栈的顺序不一定相同**

作用域链：通过作用域查找变量的链条，而作用域可以理解为执行上下文。但和调用栈的顺序还不相同

**那这个作用域链的顺序是由什么确定的呢**？

答案是：词法作用域，词法作用域就是指作用域是由代码中**函数声明的位置**来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。而词法作用域是代码阶段就决定好的，和函数是在哪调用的没有关系。

因此上面 bar 函数虽然在 foo 函数内部调用的，**但 bar 定义在全局，因此依然去全局执行上下文的变量环境中去找 myName。**

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包。

### 变量提升

```js
showName()
var showName = function () {
  console.log(2)
}
function showName() {
  console.log(1)
}
```

### 堆栈溢出

因为 V8 并不是一个完整的系统，所以在执行时，它的一部分基础环境是由宿主提供的，这包括了全局执行上下文、事件循环系统，堆空间和栈空间。除了需要宿主提供的一些基础环境之外，V8 自身会提供 JavaScript 的核心功能和垃圾回收系统。

宿主环境在启动过程中，会构造堆空间，用来存放一些对象数据，还会构造栈空间，用来存放原生数据。由于堆空间中的数据不是线性存储的，所以堆空间可以存放很多数据，**但是读取的速度会比较慢，而栈空间是连续的，所以栈空间中的查找速度非常快，但是要在内存中找到一块连续的区域却显得有点难度，于是所有的程序都限制栈空间的大小，这就是我们经常容易出现栈溢出的一个主要原因。**

```js
function getStackDepth() {
  let depth = 0

  function recursiveCall() {
    depth++
    recursiveCall()
  }

  try {
    recursiveCall()
  } catch (error) {
    // 捕获堆栈溢出错误
    // 在这里可以根据需要进行处理
  }

  return depth
}

const stackDepth = getStackDepth()
console.log('Stack depth:', stackDepth) // 9177 这个东西不是一定的，在node环境深度为：10514
```

## 20231128 周二

### 设计一个全栈系统需要考虑哪些

- 架构设计：确定系统的整体架构，包括前端与后端之间的通信方式和数据传输格式。常见的选择包括 RESTful API、GraphQL 等。确保前后端之间的接口设计合理、清晰，并能够满足系统需求。

- 数据流管理：选择合适的状态管理方案，例如 Vue 中的 Vuex，用于管理前端应用程序的状态和数据流。考虑前端与后端之间的数据交互，如何将后端返回的数据同步到前端的状态管理中，以及如何将前端的用户操作发送给后端进行处理。

- 接口设计：设计后端的 API 接口，定义请求和响应的数据结构、参数验证、错误处理等。确保接口设计符合 RESTful 原则或其他约定，并能够满足前端的数据需求。

- 安全性：确保系统的安全性，包括前端与后端的身份验证和授权机制，防止潜在的安全漏洞和攻击。使用适当的安全性措施，如 HTTPS、跨站脚本攻击（XSS）防护、跨站请求伪造（CSRF）防护等。

- 性能优化：考虑系统的性能优化，包括前端的加载速度、渲染性能以及后端的响应时间和吞吐量。使用合适的技术和工具，如前端的代码压缩、缓存机制、懒加载等，后端的数据库索引、缓存、异步处理等。

- 日志和监控：配置适当的日志记录和监控系统，用于收集系统的运行日志和性能指标。这样可以方便排查问题、监控系统运行状态，并及时发现和解决潜在的异常情况。

- 部署和运维：考虑系统的部署和运维流程，包括前端的打包和发布、后端的部署和扩展。选择合适的部署方式，如容器化部署（如 Docker）、自动化部署工具（如 Jenkins）等，以便更高效地进行系统的部署和维护。

- 测试和质量保证：建立适当的测试策略和流程，包括单元测试、集成测试、端到端测试等，以确保系统的质量和稳定性。使用合适的测试工具和框架，如 Jest、Mocha 等，进行全面的测试覆盖。

### 微前端、微服务

- 微前端：微前端是一种类似于微服务的架构，是一种由独立交付的多个前端应用组成整体的架构风格，将前端应用分解成一些更小、更简单的能够独立开发、测试、部署的应用，而在用户看来仍然是内聚的单个产品。有一个基座应用（主应用），来管理各个子应用的加载和卸载。
- 是一种后端架构模式，将一个大型应用程序拆分为一组小型、自治的服务，每个服务独立运行、部署和扩展。每个服务负责特定的业务功能，可以由独立的团队开发和维护，使用适合其需求的编程语言和技术栈。微服务通过解耦和自治的服务架构，提高了系统的可扩展性、灵活性和可维护性。微服务之间通过 API 进行通信，可以使用轻量级的通信协议（如 HTTP、REST）或消息队列等方式。
- Serverless（无服务器）是一种云计算架构模式，它使开发者能够构建和运行应用程序而无需管理底层的服务器基础设施。在传统的服务器模型中，开发者需要自行配置、管理和扩展服务器。而在 Serverless 模型中，云服务提供商负责管理底层的服务器资源，开发者只需关注应用程序的业务逻辑。

  - 事件驱动：Serverless 应用程序是通过事件触发的，例如 HTTP 请求、消息队列、数据库变更等。开发者编写函数（Function）来处理这些事件，并将函数上传到云平台，云平台会在事件发生时自动执行函数。
  - 弹性扩展：Serverless 平台根据事件的负载自动进行弹性扩展，根据需要分配和释放资源，使应用程序能够适应不同的负载情况。
  - 付费模型：
  - 服务管理：云服务提供商负责管理底层的服务器基础设施，包括服务器的配置、部署、监控和日志记录等，开发者只需专注于应用程序的开发。

- 为什么不是 iframe
  - iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。
  - 但最大的问题，同样也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。
    - url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
    - UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
    - 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果
    - 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

### 实现一个简易的模版引擎

顾名思义，其实就是解析模版而已

```js
function render(template, data) {
  const regex = /{{\s*([a-zA-Z0-9_.]+)\s*}}/g
  return template.replace(regex, (match, key) => {
    const keys = key.split('.')
    let value = data
    for (let k of keys) {
      value = value[k]
    }
    return value !== undefined ? value : match
  })
}

const template = 'Hello, {{ name }}! Today is {{ date.month }} {{ date.day }}.'

const data = {
  name: 'John Doe',
  date: {
    month: 'September',
    day: 28,
  },
}

const result = render(template, data)
console.log(result)
// 输出: "Hello, John Doe! Today is September 28."
```

### 发布订阅

```js
// 发布订阅
class MyEvtEmitter {
  constructor() {
    this.map = new Map()
  }

  // 添加事件
  on(key, fn) {
    // 之前存在过，就压入
    if (this.map.has(key)) {
      this.map.get(key).push(fn)
    } else {
      this.map.set(key, [fn])
    }
  }

  // 触发事件
  emit(key) {
    if (!this.map.has(key)) {
      return '事件未定义'
    }

    this.map.get(key).forEach((fn) => fn())
  }

  del(key) {
    this.map.has(key) && this.map.delete(key)
  }

  once(key, fn) {
    const _fn = () => {
      // 执行完，就移除对应事件
      fn()
      this.del(key)
    }
    this.on(key, _fn)
  }
}
```

### `console.log(1<2<3)`

- 1 < 2 返回 true
- true < 3 进行比较时，又会转化为 1 < 3 最后返回 true

### 写一个 lodash 的 get 方法

```js
const myGet = (obj, str, defaultValue) => {
  // str 肯定是字符串
  if (str === void 0) return obj

  return str.split('.').reduce((acc, cur) => {
    return acc[cur] ? acc[cur] : defaultValue || ''
  }, obj)
}

function myGet1(obj, path, defaultValue) {
  // 判断是数组还是
  const keys = Array.isArray(path) ? path : path.split('.')
  let result = obj

  // 遍历数组
  for (let key of keys) {
    // 如果
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return defaultValue
    }
  }

  return result
}

// myGet({a: { b: 1 }}, 'a.b')
myGet1({ a: { b: 1 } }, 'a.b')
```

## 20231124 周五

### 有序数组的平方

```js
var sortedSquares = function (nums) {
  // 利用双指针
  let left = 0
  let right = nums.length - 1

  // 然后生成一个空数组，作为结果数组
  let res = Array(nums.length).fill(0)
  let k = nums.length - 1

  while (left <= right) {
    let a = nums[left] * nums[left]
    let b = nums[right] * nums[right]

    if (a < b) {
      // 将最大的放在最右侧，因为负负得正，最大值肯定在两侧
      // 另外注意，需要新增一个指针和数组，作为最终操作的，不要使用left、right、nums等，防止干扰
      res[k--] = b
      right--
    } else {
      res[k--] = a
      left++
    }
  }
  return res
}
```

### 翻转字符串

- 每隔 2k 项，翻转前 k 项

```js
var reverseStr = function (s, k) {
  // 思路：仔细审题，其实就是，将字符串分割成每2k为一组，然后翻转这一组中的前k项
  // 因此，只需要在for循环上做文章即可

  let len = s.length
  // 不要直接操作字符串，
  let resArr = s.split('')
  for (let i = 0; i < len; i += 2 * k) {
    // 找出最右侧边界
    let l = i
    let r = i + k - 1 > len ? len : i + k - 1

    while (l < r) {
      ;[resArr[l], resArr[r]] = [resArr[r], resArr[l]]
      l++
      r--
    }
  }
  return resArr.join('')
}
```

### 手写一个 new 运算符

- new 运算符是实例化一个函数，然后得到一个实例
  - 创建一个对象
  - 让对象的原型等于函数的原型
  - 执行函数
  - 判断返回值

```js
function Foo() {
  console.log('foo')
}
Foo.prototype.sayHi = () => console.log('hi')

let o = new Foo()

// 等价于
function myNew() {
  // var o = Object.create(null);   //1、新建空对象，这里不要使用这个，因为会断掉一些链接
  var o = new Object() //1、新建空对象
  o.__proto__ = Foo.prototype //2、建立连接
  let returnVal = Foo.call(o) //3、执行
  if (typeof returnVal === 'object') {
    //4、判断返回值
    return returnVal
  }
  return o
}
```

### js 中 this 的指向

```js
// 因为在ES5中，全局变量是挂载在顶层对象（浏览器是window）中
var name = 'window'
var doSth = function () {
  console.log(this.name)
}
doSth() // window

// let没有给顶层对象中（浏览器是window）添加属性，window.name2和window.doSth都是undefined。
let name1 = 'window'
let doSth = function () {
  console.log(this === window)
  console.log(this.name1)
}
doSth() // true，undefined
```

### 大数字相乘

```js
var multiply = function (num1, num2) {
  // 如果没有这个判断，会超时
  if (num1 === '0' || num2 === '0') {
    return '0'
  }
  // 字符串相加的话，只需要进一次位，相乘则可能进位多次。。。
  // 两个数相乘，最大位数是 m + n
  // 倒序遍历两个数,

  const len1 = num1.length
  const len2 = num2.length
  const res = Array(len1 + len2).fill(0)

  // 这里其实是双层循环，拿一个数分别乘以另外一个数字的全部位
  for (let i = len1 - 1; i >= 0; i--) {
    const a = +num1[i]
    for (let j = len2 - 1; j >= 0; j--) {
      const b = +num2[j]
      const multi = a * b // 字符串相乘，直接变成数组
      const sum = res[i + j + 1] + multi //

      res[i + j + 1] = sum % 10
      // 数组的每一项，可以是多个位数
      // 注意这里是 res[i + j] = res[i + j] + sum / 10 | 0
      res[i + j] += (sum / 10) | 0
    }
  }
  // 去除头部0
  while (!res[0]) res.shift()

  return res.length ? res.join('') : '0'
}
```

### 大数字相加

```js
// 两个大数相加
var addStrings = function (num1, num2) {
    let result = '';
    let i = num1.length - 1, j = num2.length - 1, carry = 0;

    while (i >= 0 || j >= 0) {
        let n1 = i >= 0 ? +num1[i] : 0;
        let n2 = j >= 0 ? +num2[j] : 0;
        const temp = n1 + n2 + carry;
        // 🔥注意这里：与0按位或，产生的效果是把小数部分干掉了
        // 其实本质是 在位操作符 | 在执行之前会将浮点数 xxx 转换为32位 🔥带符号整数🔥 。转换过程中，整数部分保持不变，小数部分被截断。
        // 而后面的0就是一个陪衬，相比与 Math.floor 是向下取整，二者的含义不一样
        carry = temp / 10 | 0;
        result = `${temp % 10}${result}`;
        i--; j--;
    }
    // 处理最后一个进位
    if (carry === 1) result = `1${result}`;

    return result;
};

// 关于进制转化 ：小数部分可以通过乘以 2 并提取整数部分的方式逐步转换为二进制
0.58 * 2 = 1.16   // 整数部分为 1
0.16 * 2 = 0.32   // 整数部分为 0
0.32 * 2 = 0.64   // 整数部分为 0
0.64 * 2 = 1.28   // 整数部分为 1
0.28 * 2 = 0.56   // 整数部分为 0
0.56 * 2 = 1.12   // 整数部分为 1

// 重复上述步骤，直到小数部分为 0，或者达到所需的精度。在这个例子中，我们可以选择保留小数点后面的位数。
// 因此，`0.58` 的二进制表示为 `0.1001011001...`（无限循环）。


// 下面是转换为 32 位有符号整数的过程：

// 将数的绝对值转换为二进制表示形式，保留最低的 32 位。如果二进制表示超过 32 位，则截断高位。
// 如果原始数为负数，则对其二进制表示形式取反（按位取反）。
// 对取反后的二进制数进行加 1 操作。

// 在 JavaScript 中，进行位运算 | 时，会将操作数转换为 32 位有符号整数（Signed 32-bit Integer）。这是因为位运算符在操作数之前会将操作数转换为 32 位有符号整数，然后对这些整数执行位运算。
//
// 对于 111 / 10 这个表达式的结果是 11.1，但当应用位运算 | 0 时，JavaScript 引擎会将 11.1 转换为 32 位有符号整数。

// 转换过程如下：

// 将 11.1 的绝对值转换为二进制表示形式，得到 1011.00011001100110011001100110011。
// 截断高位，只保留最低的 32 位，得到 00000000000000000000000000001011。
// 这是一个正数，所以无需取反。
// 结果就是转换为 32 位有符号整数后的表示形式，即 00000000000000000000000000001011，对应的十进制数是 11。
```

### 什么是闭包？

```js
// 函数内部创建的函数以及该函数能够访问的外部函数作用域中的变量的组合
```

### NaN null

```js
// 在基础库里，在经过bridge时会序列化导致 NaN 变为了，字符串的 'null'
JSON.stringify(NaN) // 'null'
JSON.parse(JSON.stringify(NaN)) // null

// 而组件在处理props时，又会根据type类型做处理
val === null ? '' : String(val)
```

### IIFE (Immediately Invoked Function Expressions)

```js
// function foo(){ }()  // 会报错，会被解析成函数定义和 () 而调用有没有具体的函数名

// 在执行时，函数表达式 (function foo(){ }) 被立即调用，函数名 foo 在函数外部是不可见的
// 🔥 foo执行完就会立即释放
// 由于自执行函数在定义时就被立即调用，它的主要目的通常是为了创建一个局部作用域，以避免变量污染全局命名空间
;(function foo() {})()(function foo() {})()
```

### a == 1 && a == 2 && a ==3

```js
// 可以使用代理，也可以使用对象的valueOf方法
var a = {
  value: [1, 2, 3],
  // valueOf() 方法。该方法在进行隐式类型转换时被调用
  valueOf: this.value.shift(),
}

// 比较 a == 1。由于 a 是一个对象，而 1 是一个数字，JavaScript 会尝试将对象 a 转换为一个原始值进行比较。这时会调用 a 的 valueOf() 方法
console.log(a == 1 && a == 2 && a == 3) // true
```

### 编写一个函数，解析一个树状结构里的值

```js
var arr = [1, [2, 3, [4, 5, [6, 6]]]]

const formatArr = (data) => {
  const flatArr = data.flat(Infinity)
  const noRepeatArr = [...new Set(flatArr)]
  return noRepeatArr.sort((a, b) => b - a)
}

const formatArrV1 = (data) => {
  // 针对数组做序列化，会自动拍平，注意是String，不是JSON.stringify
  // const flatArr = JSON.stringify(data) // '[1,[2,3,[4,5,[6,6]]]]'
  // String([1,[2,3,[4,5]]]) => '1,2,3,4,5'
  const flatArr = String(data)
    .split(',')
    .map((v) => +v)
  const noRepeatArr = flatArr.filter((v, idx, arr) => idx === arr.indexOf(v))
  return noRepeatArr.sort((a, b) => b - a)
}

console.log(formatArr(arr))
```

### 编写一个函数，解析嵌套对象里的值

```js
var obj = {
  'a.b.c': 1,
  'a.d.e': 2,
}
// 最后输出
var result = {
  a: {
    b: { c: 1 },
    d: { e: 2 },
  },
}

// 思路，关键点在于如何将新生成的对象，挂载到之前的属性上
var obj = { 'a.b.c': 1, 'a.c.d': 2 }
function formatObj(data) {
  let res = {}

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const keyArr = key.split('.')

      // 因为res是最终结果，需要一个动态指针，类似链表里，一个head不动，然后操作一个游动指针
      let tempRes = res

      // 需要判断最后一个值，
      keyArr.forEach((k, idx) => {
        // 如果是最后一个，则赋值
        if (idx === keyArr.length - 1) {
          tempRes[k] = data[key]
        } else {
          // 此时需要新建对象，不需要复制
          tempRes[k] = tempRes[k] || {}
          // 指针移动，因为下一个的值，肯定是挂载在 tempRes[k] 的
          tempRes = tempRes[k]
        }
      })
    }
  }
  return res
}
console.log(formatObj(obj))
```

## 20231123 周四

### 事件循环队列

- 注意主线程，比如各个生命周期的执行，即使 onLoad 里有 await 函数，也不会阻断 onShow 的执行 如下
  - 因为内部的任务可以理解为当前主线程的宏任务或者微任务，只会阻断当前生命周期内部的逻辑
  - 那这样的话，页面初始化，按理说不应该渲染的慢啊？？？
- 微任务注册是有顺序的，如果前一个微任务没有执行，则它接下来的那个微任务肯定也不会注册

```js
onLoad()
onShow()
```

### promiseLimit

思路：

1. 一个函数负责往里面添加执行函数
2. 另外一个函数，负责执行具体的任务

```js
const promiseLimit = (ps, limit) => {
  const res = []
  let runing = 0
  let idx = 0
  let len = ps.length

  return new Promise((resolve, reject) => {
    const runTask = (p, index) => {
      runing++
      console.log('正在执行的数量', runing)
      p()
        .then((v) => {
          runing--
          res[index] = v

          // 任务执行完，继续触发walk
          walk()
        })
        .catch((err) => reject(err))
    }

    const walk = () => {
      // 如果正在执行的小于limit，且已经执行的总数小于 len
      while (runing < limit && idx < len) {
        runTask(ps[idx], idx)
        idx++
      }
      // 如果执行完，则resolove
      if (!runing) resolve(res)
    }
    walk()
  })
}
```

## 20231122 周三

### 合并乱序区间

### 手动实现一个 vue 的数据劫持

思路：其实就是递归 + Object.defineProperty 或者 proxy

```js
const observe = (obj) => {
  // 只针对对象做响应式拦截
  if (!obj || typeof obj !== 'object') return

  // 遍历对象属性
  Object.keys(obj).forEach((key) => {
    let val = obj[key]

    // 递归处理
    observe(val)

    // 处理具体值
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举
      configurable: true, // 可修改
      get() {
        console.log('访问属性', key, '值为', val)
        return val
      },
      set(newVal) {
        if (newVal === val) return
        console.log('设置属性', key, '新值为', newVal)
        val = newVal
      },
    })
  })
}

var obj = {
  a: 1,
  b: { c: 'cc', d: 3 },
}
observe(obj)
obj.a //

// 使用Proxy
const observeProxy = (obj) => {
  // 其实就是针对一个对象，做一个配置化的处理
  return new Proxy(obj, {
    get(target, key) {
      console.log('访问属性', key, '值为', target[key])
      if (key in target) {
        return target[key]
      }
    },
    set(target, key, val) {
      target[key] = val
      console.log('设置属性', key, '值为', target[key])
      return true // 必须返回true
    },
    deleteProperty(target, key) {
      console.log('删除属性', key)
      delete target[key]
      return true // 必须返回true
    },
  })
}
var newObj = observeProxy(obj)
newObj.a
```

- Proxy
  - 功能更强大，可以拦截更多的操作，包括属性读取、属性设置、属性删除、函数调用等
  - 直接代理整个对象，而不是每个属性，可以动态处理添加和删除的属性
  - 代理对象，还可以拦截对象的方法调用和构造函数调用
  - 缺点：兼容性、性能开销稍高
- Object.defineProperty
  - 兼容性好
  - 精细化控制，具体每个属性的可枚举、可配置、可写等
  - 只针对已存在的属性
  - 无法拦截整个对象

### 原生实现 ajax

思路：利用 promise，封装 XMLHttpRequest 方法

### 判断二叉树是否为对称二叉树

- 思路：成对压入堆栈，注意顺序，然后再成对弹出，判断

```js
var isSymmetric = function (root) {
  if (!root) return true

  const stack = [root.left, root.right]
  while (stack.length) {
    const right = stack.pop()
    const left = stack.pop()

    // 如果二者都没有，则继续
    if (!right && !left) {
      continue
    }
    if (!right || !left) {
      return false
    }
    if (right.val !== left.val) {
      return false
    }

    // 成对压入堆栈，注意顺序，不需要考虑有没有值
    stack.push(left.left, right.right)
    stack.push(left.right, right.left)
  }
  return true
}
```

### 数组常见方法

```js
// 拍平，转数字，去重，排序
var arr = [1, 3, [3, 4, [3, 4]]]
const res = arr
  .toString()
  .split(',')
  .map((item) => +item)
  .filter((item, idx, arr) => idx === arr.indexOf(item))
  .sort((a, b) => b - a)
console.log(res) // [4, 3, 1]

// 拍平数组
const nestedArray = [1, [2, [3, 4]]]
const flattenedArray = nestedArray.flat() // [1, 2, [3, 4]]  默认深度一
const flattenedArray = nestedArray.flat(Infinity) // 大于则自动最深

// reduce
const numbers = [1, 2, 3, 4, 5, [1, 3]]

const flattenV1 = (arr) => {
  return arr.reduce((res, ele) => {
    return res.concat(Array.isArray(ele) ? flattenV1(ele) : ele)
  }, [])
}
console.log(flattenV1(numbers))

// 利用递归
const flatArray = (arr, res = []) => {
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      // 注意这里，是将res传入
      flatArray(item, res)
    } else {
      res.push(item)
    }
  })
  return res
}

// 利用迭代
function flattenArrayIterative(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      result.unshift(next)
    }
  }
  return result
}
```

### 动态规划

#### 斐波那契数列

```js
var fib = function (n) {
  // 动态规划
  // 1、定义dp：dp[i]表示第i项的斐波那契数
  // 2、定义公式：dp[i] = dp[i-1] + dp[i-2]
  // 3、确定遍历顺序：从小到大
  // 4、初始化：dp = [0, 1]
  // 5、推导

  const dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}
```

#### 爬楼器

爬到第一层楼梯有一种方法，爬到二层楼梯有两种方法。

那么第一层楼梯再跨两步就到第三层 ，第二层楼梯再跨一步就到第三层。

所以到第三层楼梯的状态可以由第二层楼梯 和 到第一层楼梯状态推导出来，那么就可以想到动态规划了。

```js
var climbStairs = function (n) {
  // dp[i] 为第 i 阶楼梯有多少种方法爬到楼顶
  // dp[i] = dp[i - 1] + dp[i - 2]
  let dp = [1, 2]
  for (let i = 2; i < n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n - 1]
}
```

### 贪心

#### 跳跃游戏

其实跳几步无所谓，关键在于可跳的覆盖范围，是否能达到终点。

贪心算法局部最优解：每次取最大跳跃步数（取最大覆盖范围），整体最优解：最后得到整体最大覆盖范围，看是否能到终点。

局部最优推出全局最优，找不出反例，试试贪心！

因此每次移动都更新最大覆盖范围即可。

```js
var canJump = function (nums) {
  // 更新最大跳跃范围即可
  let cover = 0 // 定义可覆盖范围
  // 下面循环的变量不对，应该是cover的长度，因为只有cover你才可以到达
  // for (let i = 0; i <= nums.length; i++) {
  for (let i = 0; i <= cover; i++) {
    cover = Math.max(i + nums[i], cover)
    if (cover >= nums.length - 1) {
      return true
    }
  }
  return false
}
```

### 回溯

- for 循环，相当于横向选择，选择同一层的元素
  - 每次从集合中选取元素，可选择的范围随着选择的进行而收缩，调整可选择的范围。
  - 而如何通过标识缩小范围内，就是通过 索引 index
- 而回溯就是纵向选择，二者结合后，就可以遍历整个树
- 回溯法就是解决这种 k 层 for 循环嵌套的问题。

```js
for (int i = startIndex; i <= n; i++) { // 控制树的横向遍历
    path.push_back(i);         // 处理节点
    backtracking(n, k, i + 1); // 递归：控制树的纵向遍历，注意下一层搜索要从i+1开始，也就缩小了范围
    path.pop_back();           // 回溯，撤销处理的节点
}
```

## 20231121 周二

### 二叉树

#### 二叉树的所有路径

```js
function binaryTreePaths(root) {
  if (!root) return []
  const res = [],
    stack = [root],
    paths = ['']

  while (stack.length) {
    // 节点和path是成对存在
    const node = stack.pop() // 从栈顶弹出
    const path = paths.pop() // 始终只有同时弹出一个节点，因此路径与之匹配

    // 如果左右子节点都没有，则返回
    if (!node.left && !node.right) {
      path += node.val // 最后一个不需要拼接 -> 了
      paths.push(path)
      continue // 继续下一个
    }

    // 如果有左右节点，则压入，这里不区分顺序
    if (node.left) {
      stack.push(node.left)
      paths.push(path)
    }
    if (node.right) {
      stack.push(node.right)
      paths.push(path)
    }
  }
  return res
}
```

### hash 表

#### 求两个数组的交集

```js
var intersection = function (nums1, nums2) {
  let map = {}
  const res = []

  nums1.forEach((num) => {
    map[num] = true
  })

  nums2.forEach((num) => {
    if (map[num]) {
      res.push(num)
    }
  })

  return res.filter((item, idx) => idx === res.indexOf(item))
}
```

#### 三数之和

```js
var threeSum = function (nums) {
  const res = []
  nums.sort((a, b) => a - b)
  let len = nums.length

  for (let i = 0; i < len; i++) {
    let left = i + 1
    let right = len - 1

    // 去重第一个
    if (i > 0 && nums[i] === nums[i - 1]) continue

    // 开始遍历左右指针
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]])

        // 只有和等于0了，说明才开始执行下面的
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--

        left++
        right--
      } else if (sum > 0) {
        right--
      } else {
        left++
      }
    }
  }

  return res
}
```

## 20231119 周日

### 回溯

#### 组合总数

> 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。

```js
var combinationSum = function (candidates, target) {
  // 组合问题，也是使用回溯，而回溯就是回来替换多层循环

  function backtrack(path, sum, start) {
    // 满足条件，这里注意，看之前错误的提交记录
    // if (sum === target) { 这样不行，因为大于的也需要返回
    if (sum >= target) {
      sum === target && res.push(path.slice())
      return
    }

    // 目前算法可以统计出全部的，但是有重复的 [[2,2,3],[2,3,2],[3,2,2],[7]]
    // 如何去重呢？去重的话，还是需要个start索引。。。
    // for循环，每个循环都是从0开始，因为可以重复，这里的重复不是在这里配置，而是backtrack的入参3是i，从而实现的重复，如果是i+1，则就是不重复的
    // 这其实依然是一个集合，然后组合问题，此时就需要使用start索引，如果是多个集合，比如拨号键组合，就不需要索引
    for (let i = start; i < candidates.length; i++) {
      // 如果已经大于target就不再压入了
      if (sum > target) break
      path.push(candidates[i])
      sum += candidates[i]
      backtrack(path, sum, i)
      sum -= candidates[i]
      path.pop()
    }
  }

  const res = []
  backtrack([], 0, 0)
  return res
}
```

#### 全排列

```js
var permute = function (nums) {
  const res = []
  const used = new Set() // 需要将这个used放在最外层，而不是内部
  backtrack([])
  return res

  function backtrack(path) {
    if (path.length === nums.length) {
      res.push(path.slice())
      return
    }

    // 放在内部，只能去除同层上的重复，但是无法去除同一个树枝上的数据
    // const used = new Set() // 需要将这个used放在最外层，而不是内部
    // 每一次都是从0开始遍历
    for (let i = 0; i < nums.length; i++) {
      if (used.has(nums[i])) continue

      used.add(nums[i])
      path.push(nums[i])
      backtrack(path.slice())
      path.pop()
      used.delete(nums[i])
    }
  }
}
```

### 二叉树

#### 最大宽度

- 利用索引
- 层序遍历，索引

```js
function widthOfBinaryTree(root) {
  if (root === null) {
    return 0
  }

  let maxWidth = 0
  const queue = [{ node: root, index: 0 }]

  while (queue.length > 0) {
    const levelSize = queue.length
    let leftmostIndex = queue[0].index
    const currentWidth = queue[queue.length - 1].index - leftmostIndex + 1
    maxWidth = Math.max(maxWidth, currentWidth)

    for (let i = 0; i < levelSize; i++) {
      const { node, index } = queue.shift()

      if (node.left) {
        queue.push({ node: node.left, index: 2 * index })
      }

      if (node.right) {
        queue.push({ node: node.right, index: 2 * index + 1 })
      }
    }
  }

  return maxWidth
}
```

#### 最小深度

```js
var minDepth = function (root) {
  // 最小深度
  if (!root) return 0
  const queue = [root]

  let minHeight = 0

  while (queue.length) {
    const len = queue.length
    minHeight++

    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      // 层序遍历，队列，如果左右节点都没有值，则就是最小
      if (!node.left && !node.right) {
        return minHeight
      }
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
  }
  return minHeight
}
```

#### 最大深度

```js
var maxDepth = function (root) {
  if (!root) return 0
  const queue = [root]

  let height = 0
  while (queue.length) {
    const len = queue.length
    height++

    // 这里面的循环有必要，因为len是之前记录的一层的长度，是不变的
    for (let i = 0; i < len; i++) {
      const node = queue.shift()
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
  }
  return height
}
```

#### 翻转二叉树

```js
var invertTree = function (root) {
  if (!root) return root
  const queue = [root]

  while (queue.length) {
    const node = queue.shift()
    // 左右子节点交换即可，然后继续插入字节点
    ;[node.left, node.right] = [node.right, node.left]

    node.left && queue.push(node.left)
    node.right && queue.push(node.right)
  }
  return root
}
```

#### 层序遍历

```js
var levelOrder = function (root) {
  const res = []
  const queue = []

  root && queue.push(root)

  while (queue.length) {
    const len = queue.length // 当前层的数量
    const curLevel = []

    // 遍历
    for (let i = 0; i < len; i++) {
      const node = queue.shift() // 弹出队列最前面的
      curLevel.push(node.val)
      // 将当前节点的子节点放在队列里
      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
    // 一个for循环结束，表示一层已经遍历完，需要一层一层的返回
    res.push(curLevel)
  }

  return res
}
```

#### 中序遍历

```js
var inorderTraversal = (root) => {
  const res = [] // 结果
  const stack = [] // 二叉树遍历，利用深度优先

  root && stack.push(root) // stack = [root] 也行，就是需要let声明

  while (stack.length) {
    // 1/其实就是使用栈来遍历整个二叉树
    const node = stack.pop()

    // 3、开始处理之前放在里面的数据
    // 其实此时
    // console.log(stack)
    if (!node) {
      res.push(stack.pop().val)
      continue
    }

    // 2、将遍历的所有节点都放在栈里
    // 中序：左中右 -》右中左
    node.right && stack.push(node.right)
    stack.push(node)
    stack.push(null)
    node.left && stack.push(node.left)
  }

  return res
}
```

### hash 表

#### 三数之和

```js
var threeSum = function (nums) {
  nums.sort((a, b) => a - b)

  // 这里也可以返回，排序后，如果第一个都大于0，则直接返回，不能直接 nums[0] 因为有可能有负值
  if (nums[0] > 0) return []

  const len = nums.length
  const res = []

  for (let i = 0; i < len; i++) {
    let left = i + 1
    let right = len - 1

    // 如果不对第一个数去重，则会出现  [[-1,-1,2],[-1,0,1],[-1,0,1]] 情况
    if (nums[i] === nums[i - 1]) continue

    // 一个i，就需要对应一次 left，right的循环
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (sum == 0) {
        res.push([nums[i], nums[left], nums[right]])

        // 去重，与下面b位置无关，left++只是走到了下一个重复的位置而已
        // 要不停的去重，而不是只去重一次，不能使用if，而应该使用while
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--

        // b：当前找到一个了，那就得继续往下走
        left++
        right--
      } else if (sum > 0) {
        right--
      } else {
        left++
      }
    }
  }

  return res
}
```

### 链表

#### 合并链表

```js
var mergeTwoLists = function (list1, list2) {
  let res = new ListNode(-1)
  let p = res // p指针是移动的，
  let p1 = list1
  let p2 = list2

  // 如果两个指针都有值，则对比
  while (p1 && p2) {
    if (p1.val > p2.val) {
      // 将小值赋值，同时向下移动指针
      // 注意赋值的是下一个
      // p = p2
      p.next = p2
      p2 = p2.next
    } else {
      p.next = p1
      p1 = p1.next
    }
    // 最后移动p指针
    p = p.next
  }

  // 上面循环完以后，将剩余的链表继续挂上去，挂上去使用的p.next，而不是p = p1
  // 因为 p = p1 相当于指针移动到p1
  p1 && (p.next = p1)
  p2 && (p.next = p2)

  // 此时p位于新建链表的中间某个位置，需要返回res.next，以为内
  return res.next
}
```

#### 链表求和

```js
var addTwoNumbers = function (l1, l2) {
  // 因为两个链表的头结点都是最小值开始，因此可以直接遍历累加
  // 因为遍历两个链表后，还需要生成一个新的链表，因此需要针对新链表定义head、tail尾
  let head = null
  let tail = null
  let carry = 0 // 进位

  while (l1 || l2) {
    // 取两个链表的值
    const n1 = l1 ? l1.val : 0
    const n2 = l2 ? l2.val : 0
    const sum = n1 + n2 + carry

    if (!head) {
      // 如果没有头结点，则需要新建节点
      head = new ListNode(sum % 10)
      tail = head
    } else {
      // 此时已经有链表了，则需要追加，每追加一个，都需要新建节点
      tail.next = new ListNode(sum % 10)
      // 移动tail指针
      tail = tail.next
    }
    carry = Math.floor(sum / 10)

    // 移动两个链表的指针
    l1 && (l1 = l1.next)
    l2 && (l2 = l2.next)
  }
  // 循环结束，再判断进位即可
  carry && (tail.next = new ListNode(carry))

  return head
}
```

#### 环形链表 II

```js
var detectCycle = function (head) {
  const hasCircle = (head) => {
    let fast = (slow = head)

    while (fast && fast.next) {
      fast = fast.next.next
      slow = slow.next
      if (fast === slow) {
        mixed = slow
        return true
      }
    }
    return false
  }

  let mixed = null
  let start = head

  if (!hasCircle(head)) {
    return null
  } else {
    // 如果二者不等，则一直循环
    while (mixed !== start) {
      start = start.next
      mixed = mixed.next
    }
    return mixed
  }
}
```

#### 删除链表中倒数第 n 个节点

```js
var removeNthFromEnd = function (head, n) {
  let newHead = new ListNode(0, head)

  // 虚拟头节点
  let fast = newHead
  let slow = newHead

  // 快指针先走n步，这里需要等于n
  for (let i = 0; i <= n; i++) {
    fast = fast.next
  }

  // 然后快慢指针一块走
  while (fast) {
    fast = fast.next
    slow = slow.next
  }

  slow.next = slow.next.next

  return newHead.next
}
```

#### 翻转链表

```js
var reverseList = function (head) {
  let prev = null
  let cur = head
  // 1 -> 2 -> 3
  while (cur) {
    // 比如 cur为1， 则暂存 2
    const temp = cur.next
    cur.next = prev // 上面都存起来了，所以这里直接操作

    // 继续移动prev
    // 想象下：prev cur next 三者的关系，因此如果想继续进行，则需要左移
    prev = cur
    cur = temp
  }
  return prev
}
```

#### 移除链表中等于某个值的节点

```js
var removeElements = function (head, val) {
  // 头结点也可能等于 val，因此需要统一手法，因为删除头结点的操作不方便
  let virtual = new ListNode(0, head)

  let temp = virtual // 游走指针

  while (temp.next) {
    if (temp.next.val === val) {
      temp.next = temp.next.next
    } else {
      temp = temp.next
    }
  }
  return virtual.next
}
```

### 数组

#### [27]移除元素

> 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。

```js
var removeElement = function (nums, val) {
  // 利用两个指针
  // 一个指针存储有效的值，一个指针在前面走
  let left = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[left++] = nums[i]
    }
  }
  // 因为只要求新长度，left就是，其实后面还有冗余的
  return left
}
```

#### [35]插入位置

```js
var searchInsert = function (nums, target) {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {
    const mid = parseInt((left + right) / 2)
    // 比查找某个数字在数组的位置，要多一些逻辑
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] > target) {
      // 当大于目标值时，理论上right - 1，但此时要找插入的位置，因此就是mid
      right = mid - 1
    } else {
      // 此时target大于中位数的值，左侧一半都没有用
      left = mid + 1
    }
  }
  // 如果不在数组中，则如此：nums[pos-1]<target<num[pos]
  // 也就是 right + 1
  return right + 1
}
```

#### [704]二分查找

> 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

```js
var search = function (nums, target) {
  let left = 0
  let right = nums.length - 1

  // 这里需要 小于等于
  while (left <= right) {
    const mid = parseInt((left + right) / 2)

    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] > target) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  return -1
}
```

#### 买卖股票的最佳时机

```js
var maxProfit = function (prices) {
  // 假如第 0 天买入，第 3 天卖出，那么利润为：prices[3] - prices[0]。

  // 相当于(prices[3] - prices[2]) + (prices[2] - prices[1]) + (prices[1] - prices[0])。

  // 此时就是把利润分解为每天为单位的维度，而不是从 0 天到第 3 天整体去考虑！

  // 那么根据 prices 可以得到每天的利润序列：(prices[i] - prices[i - 1]).....(prices[1] - prices[0])。

  // 因此，只需要统计正数即可
  let res = 0

  for (let i = 1; i < prices.length; i++) {
    const val = prices[i] - prices[i - 1]
    if (val > 0) {
      res += val
    }
  }
  return res
}
```

#### 合并两个有序数组

```js
var merge = function (nums1, m, nums2, n) {
  let len1 = m - 1 // 两个数组有序的最后一个值
  let len2 = n - 1
  let len = m + n - 1 // 最终数组的长度

  // 其实就是两个数组比较，然后将比较的新值放在最后
  while (len1 >= 0 && len2 >= 0) {
    nums1[len--] = nums1[len1] > nums2[len2] ? nums1[len1--] : nums2[len2--]
  }
  // 一遍循环完，要么剩余 nums2没插入进去，此时m已经遍历完了，也就是一定到索引0的位置了，因此从0开始
  // 要么就是nums2插入完了，执行下面的也无所谓
  nums1.splice(0, len2 + 1, ...nums2.slice(0, len2 + 1))
  return nums1
}
```

### 字符串

#### [344]翻转字符串

```js
var reverseString = function (s) {
  let len = s.length

  let left = 0
  let right = len - 1

  while (left <= right) {
    ;[s[left], s[right]] = [s[right], s[left]]
    left++
    right--
  }
  return s
}
```

#### [1047]删除字符串中相邻的字符

```js
var removeDuplicates = function (s) {
  const stack = []
  for (const char of s) {
    // 每次对比一个，如果相同就弹出，这里不需要while循环
    if (stack[stack.length - 1] === char) {
      stack.pop()
    } else {
      stack.push(char)
    }
  }
  return stack.join('')
}
```

#### [3]无重复的最长子串

```js
var lengthOfLongestSubstring = function (s) {
  let max = 0
  let str = ''

  for (let i = 0; i < s.length; i++) {
    const idx = str.indexOf(s[i])
    // 如果重复了，就从下一位开始截取
    // dvdy -》dv -> dv d idx 为0，需要从v开始截取
    if (idx !== -1) {
      str = str.slice(idx + 1)
    }
    str += s[i]
    max = Math.max(str.length, max)
  }
  return max
}

// 用指针，用指针的话，就可以避免上面i一直在执行的问题
var lengthOfLongestSubstring = function (s) {
  let right = 0
  let max = 0
  let str = ''

  // 这里还不能 = s.length，因为索引就到length
  while (right < s.length) {
    if (str.indexOf(s[right]) === -1) {
      str += s[right]
      right++
      max = Math.max(max, str.length)
    } else {
      // 同时字符串，还需要去掉第一个，因为必定是第一个开始相同
      str = str.slice(1)
    }
  }
  return max
}
```

### 常规算法

#### promiseLimit

```js
const promiseLimit = (ps, limit) => {
  // 异步编程，肯定需要promise
  return new Promise((resolve, reject) => {
    let running = 0
    let idx = 0
    let results = []

    // runTask 辅助函数：执行具体的异步任务
    const runTask = (task) => {
      running++
      console.log('运行中的数量：', running)
      // task本身是promise，所以直接then
      task()
        .then((res) => {
          // 到这里一个任务就结束了
          running--
          results.push(res)
          // 然后开启新的任务
          walk()
        })
        .catch((err) => reject(err))
    }

    // 主函数，执行入口
    const walk = () => {
      // 正在运行的数量小于limit，则持续压入
      while (running < limit && idx < ps.length) {
        runTask(ps[idx])
        idx++
      }
      // while循环结束后，如果running为0，说明已经全部结束
      if (!running) resolve(results)
    }
    walk()
  })
}

const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
  () => new Promise((resolve) => setTimeout(() => resolve(4), 4000)),
  () => new Promise((resolve) => setTimeout(() => resolve(5), 5000)),
  () => new Promise((resolve) => setTimeout(() => resolve(6), 6000)),
]

promiseLimit(tasks, 2)
  .then((results) => {
    console.log(results)
  })
  .catch((error) => {
    console.error(error)
  })
```

#### 继承

##### 1、 原型链继承

父类的实例，作为子类的原型对象

```js
function Parent() {
  this.name = 'parent'
}
Parent.prototype.sayHi = function () {
  console.log('hi')
}

function Child() {
  this.name = 'child'
  this.age = 12
}

Child.prototype = new Parent()

var child = new Child()

console.log(child.name, child.age) // parent 12
child.sayHi() // hi

child.name = 'child'
console.log(child.name) // child
console.log(new Parent().name) // child

// 包含引用类型值的原型属性会被所有实例共享
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {}

//inherit from SuperType
SubType.prototype = new SuperType()

var instance1 = new SubType()

instance1.colors.push('black')
console.log(instance1.colors) //"red,blue,green,black"

var instance2 = new SubType()
console.log(instance2.colors) //"red,blue,green,black"
```

特点：

- 父类引用类型，会被子类实例继承，容易造成修改的相互影响
- 没办法传参数

##### 2、 借用构造函数继承

```js
function Parent() {
  this.arr = [1, 2, 3]
}
function Child() {
  Parent.call(this)
}

var child1 = new Child()
child1.arr.push('4')
console.log(child1.arr) // [1,2,3,4]

var child2 = new Child()
console.log(child2.arr) // [1,2,3]
```

上面的代码，引用类型，不会再在所有实例间共享了

那参数呢？

```js
function Parent(name = 'parent default') {
  this.name = name
}
function Child(name) {
  Parent.call(this, name)
  this.age = 18
}

var child1 = new Child()
console.log(child1.name) // parent default

var child2 = new Child('son')
console.log(child2.name) // son
```

##### 3、组合继承

将**原型链继承和借用构造函数继承**，组合到一块

```js
function Parent(name) {
  this.name = name
  this.arr = [1, 2, 3]
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.sayAge = function () {
  console.log(this.age)
}

var c1 = new Child('c1', 20)
c1.arr.push(4)

console.log(c1.arr) // [1,2,3,4]
c1.sayAge() // 20
c1.sayName() // c1

var c2 = new Child('c2', 22)

console.log(c2.arr) // [1,2,3,4]
c2.sayAge() // 22
c2.sayName() // c2
```

##### 4、原型式继承

通过创建一个临时的中间对象， 将该对象作为新创建对象的原型，实现继承

- 定义一个空函数 F，设置 F.prototype = obj，然后返回 new F()

```js
function createObj(obj) {
  function F() {}
  // 和原型链式相比，这里直接使用的obj，而不是 新实例
  F.prototype = obj
  return new F()
}
var person = {
  name: 'p1',
  friends: [1, 2, 3],
}
var p1 = createObj(person)
console.log(p1.name) // p1
p1.friends.push(4)
console.log(p1.friends) // [1,2,3,4]

var p2 = createObj(person)
console.log(p2.name) // p1
console.log(p2.friends) // [1,2,3,4]
```

##### 5、寄生式继承

其实就是使用 Object.create 创建一个对象，然后再操作对象，可以理解为寄生在 Object.create 里

```js
function createObj(proto) {
  var obj = Object.create(proto)
  // 为对象添加函数，会由于不能做到函数复用而降低效率
  obj.greet = function () {
    console.log('hello')
  }
  return obj
}
var parent = {
  name: 'Parent',
  sayHello: function () {
    console.log('Hello')
  },
}

var child = createObj(parent)
console.log(child.name) // 输出：'Parent'
```

##### 6、组合式继承

组合式是：借用构造函数式 + 寄生式

```js
function Parent(name) {
  this.name = name
}

Parent.prototype.sayHello = function () {
  console.log('Hello, I am ' + this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

Child.prototype.sayAge = function () {
  console.log('I am ' + this.age + ' years old')
}

var child = new Child('Alice', 10)
console.log(child.name) // 输出：'Alice'
child.sayHello() // 输出：'Hello, I am Alice'
child.sayAge() // 输出：'I am 10 years old'
```

##### 7、寄生组合式继承

- 其实就是 借用构造函数 + 原型式 + 寄生式

```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype) // 创建对象
  prototype.constructor = subType // 增强对象
  subType.prototype = prototype // 指定对象
}

function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
  alert(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)

  this.age = age
}

inheritPrototype(SubType, SuperType)

SubType.prototype.sayAge = function () {
  alert(this.age)
}

var instance1 = new SubType('Nicholas', 29)
instance1.colors.push('black')
alert(instance1.colors) //"red,blue,green,black"
instance1.sayName() //"Nicholas";
instance1.sayAge() //29

var instance2 = new SubType('Greg', 27)
alert(instance2.colors) //"red,blue,green"
instance2.sayName() //"Greg";
instance2.sayAge() //27
```

#### bind、call、apply 实现

手动实现 apply，我们要知道 apply ，就是修改 this 指向，然后立即执行函数罢了

- 而如何修改 this 指向呢？ 对象调用就 ok，
- 注意在使用 this 时，箭头函数务必要注意

```js
// 实现apply
Function.prototype.myApply = function (ctx, args) {
  ctx = ctx || window

  const uuid = Symbol()
  ctx[uuid] = this // 这里把this，也就是后续的函数，挂载在一个属性上，类似 ctx.fn = this
  // const args = [...arguments].slice(1)[0] // apply的参数二是个数组，也可以手动截取

  // 调用 // 注意：这里函数的入参 ...args 这样写，目的是为了拉齐，原生的apply，虽然不知道原生底层如何实现
  const res = ctx[uuid](...args)
  // 删除多余属性
  delete ctx[uuid]

  // 返回结果
  return res
}

// 注意：这里函数的入参 ...arr 这样写，目的是为了拉齐，原生的apply，虽然不知道原生底层如何实现
function greet(...arr) {
  // ...arr 相当于将多个参数，放在数组arr里
  // console.log(arr) // 打印数组
  console.log('hello', this.name, arr.join(' '))
}

var obj = { name: 'test' }

console.log(greet.apply(obj, ['hi apply', 'hello'])) // hello test hi apply hello
console.log(greet.myApply(obj, ['hi myapply', 'hello'])) // hello test hi myapply hello

// 实现 call
Function.prototype.myCall = function (ctx) {
  ctx = ctx || window

  // 第一项是 ctx，第二项才是 call 的入参
  const args = [...arguments].slice(1)

  const uuid = Symbol() // 防止重复
  ctx[uuid] = this // 指向未来的函数

  const res = ctx[uuid](...args)
  delete ctx[uuid]
  return res
}

var obj = { name: 'obj' }
function greet(args) {
  console.log('hello', this.name, args.join(' '))
}

greet.myCall(obj, ['hello', 'mycall']) // hello obj hello mycall
greet.call(obj, ['hello', 'call']) // hello obj hello call

// 实现bind
Function.prototype.mybind = function (ctx) {
  ctx = ctx || window

  const uuid = Symbol()
  ctx[uuid] = this

  const args = [...arguments].slice(1)

  return function (...args1) {
    const res = ctx[uuid](...args1, ...args)
    delete ctx[uuid]
    return res
  }
}

var obj = { name: 'bind' }

function greet(...args) {
  console.log('hi', this.name, args.join(' '))
}

var myGreet = greet.bind(obj, 'outer', 'haha')
myGreet()

var myGreet1 = greet.mybind(obj, 'outer', 'haha')
myGreet1()
```

#### 深拷贝

- 思路，其实就是遍历对象，然后递归拷贝
- 需要处理特殊数据类型

```js
const originalObj1 = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
  nu: null,
  undf: undefined,
  reg: /\d/g,
  arr: [1, 2],
  fn: () => console.log('fn'),
  date: new Date(),
  symbol: Symbol(), // 不是构造函数，不能用 new
}

const deepClone = (target) => {
  const wMap = new WeakMap()

  const isType = (v) => Object.prototype.toString.call(v).slice(8, -1) //
  // '[object Undefined]'  '[object String]'  正向第8个（包含）开始，然后 -1倒数第一个不包含

  // 需要递归
  const _deep = (obj) => {
    // 时间类型
    if (isType(obj) === 'Date') {
      return new Date(obj)
    }

    // 如果不是数组或者对象，直接返回
    if (!['Array', 'Object'].includes(isType(obj))) {
      return obj
    }

    // 如果是对象，则开始处理对象
    const res = Array.isArray(obj) ? [] : Object.create(null)

    // 以对象本身作为key，然后res作为val，防止循环引用
    if (wMap.has(obj)) {
      return wMap.get(obj)
    }
    wMap.set(obj, res) // 否则就存入map

    // 遍历对象，递归拷贝
    Object.keys(obj).forEach((key) => {
      if (res[key]) return // 如果已经复制，直接返回
      res[key] = _deep(obj[key]) // 递归拷贝
    })

    // 最后返回
    return res
  }

  return _deep(target)
}

const originalObj2 = deepClone(originalObj1)

console.log(originalObj2.address === originalObj1.address) // false
```

#### 节流

思路：

- 如果立即执行的话，不需要像防抖那样用 flag
- 如果没有剩余时间，则立即执行，同时清空 timer
- 如果有剩余时间，且没有定时器，则新建定时器

```js
const throttle = (fn, duration = 300) => {
  let timer = null
  let lastTime = 0

  return function (...args) {
    let currentTime = Date.now()
    let restTime = duration - (currentTime - lastTime)

    // 如果没有剩余时间，则立即执行，同时清除定时器
    if (restTime <= 0) {
      clearTimeout(timer) // 可以防止定时器泄露
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

window.addEventListener(
  'resize',
  throttleImmediate(() => {
    console.log('节流')
  }, 1000)
)
```

#### 防抖

思路：

1. 返回函数
2. 再次触发，清空定时器，并延迟

```js
// 简单的
function debounce(fn, interval = 300) {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, interval)
  }
}
const fun = () => console.log(1111)
window.addEventListener(
  'resize',
  debounce(() => console.log(1111), 1000)
)
window.addEventListener('resize', debounce(fun, 1000))
```

上面的只是普通的防抖，还可以立即执行

```js
// 带立即执行的
function debounceImmediate(fn, interval = 300, immediate = true) {
  let timer = null
  return () => {
    clearTimeout(timer)
    if (immediate) {
      // 如果立即执行，则清除定时器，并执行
      immediate = false
      fn.apply(null)
    } else {
      timer = setTimeout(() => {
        fn.apply(null)
        immediate = true
      }, interval)
    }
  }
}

const fun2 = () => console.log(2222)
window.addEventListener('resize', debounceImmediate(fun2, 1000))
```
