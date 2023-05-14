---
title: 'Vue的那些技术点'
date: Sat May 13 2023 23:13:13 GMT+0800 (中国标准时间)
lastmod: '2023-05-13'
tags: ['vue', 'MVVM', 'spa']
draft: false
summary: '渐进式 JavaScript 框架'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/vue-skills
---

## vue 与 react 的异同

- 组件化方式不同：Vue 使用模板语法，React 使用 JSX 语法。
- 数据绑定方式不同：Vue 使用双向数据绑定，React 使用单向数据流。
- 状态管理方式不同：Vue 使用 Vuex 进行状态管理，React 使用 Redux 进行状态管理。
- 生命周期不同：Vue 的生命周期函数较为简单，React 的生命周期函数较为复杂。
- 渲染方式不同：Vue 使用虚拟 DOM 和模板编译，React 使用虚拟 DOM 和 JSX 编译。
- 代码组织方式不同：Vue 倾向于将 HTML、CSS 和 JavaScript 放在同一个文件中，React 倾向于将它们分开并使用单独的文件。

总的来说，Vue 更加易学易用，适合小型项目和团队，而 React 更加灵活和可扩展，适合大型项目和团队。

## vue2 vs vue3

- 性能提升：Vue3 的虚拟 DOM 重写了渲染和补丁算法，在渲染和更新组件时，比 Vue2 更快。
- Composition API：Vue3 新增了 Composition API，可以让代码更好地组织和复用，同时也更易于测试和维护。
- 更好的 TypeScript 支持：Vue3 的 TypeScript 支持更加完善，可以提供更好的类型检查和自动补全等功能。
- 更好的 Tree-shaking 支持：Vue3 可以更好地支持 Tree-shaking，可以在构建时自动剔除未使用的代码，减小包的体积。
- 更小的包体积：Vue3 的包体积比 Vue2 更小，同时也提供了更好的按需加载支持。
- 更好的响应式系统：Vue3 的响应式系统比 Vue2 更强大，可以支持更多类型的响应式数据，并且在性能上也有所提升。
- 更好的插件系统：Vue3 的插件系统比 Vue2 更加灵活，可以更好地支持第三方插件的开发和集成。

## 路由原理

Vue 的路由原理是基于浏览器的 History API 或者 Hash API 实现的。Vue Router 通过监听浏览器的 URL 变化来动态地渲染不同的组件。

### Histroy

History API 允许 JavaScript 动态地修改**浏览器的历史记录，而不需要刷新页面**。它包含以下方法：

- pushState(stateObj, title, URL)：将一个新的历史记录项添加到历史记录堆栈中。
- replaceState(stateObj, title, URL)：用新的历史记录项替换当前历史记录项。
- go(num)：在历史记录堆栈中向前或向后移动指定数量的步骤。
- back()：向后移动一个步骤。
- forward()：向前移动一个步骤。

这些方法都会触发 popstate 事件，可以通过监听该事件来处理历史记录的变化。

而 History API 则可以通过修改 URL 的路径来实现相同的功能，但是需要服务器端的支持，主要让服务器在未匹配到指定页面时，重定向到首页，从而再次进入 vue 的路由管理

### Hash API

Hash API 则是通过修改 URL 的哈希值来修改历史记录。它包含以下方法：

- window.location.hash：获取当前 URL 的哈希值。
- window.onhashchange：监听 URL 哈希值的变化。
- window.location.hash = newHash：修改当前 URL 的哈希值。

Hash API 可以用于实现单页应用程序的路由功能，但是它的缺点是哈希值会被发送到服务器端，可能会影响 SEO。

## 组件相关

### keep-alive

keep-alive 的原理是通过在组件的钩子函数中添加逻辑，对缓存的组件实例进行管理。

具体来说，**当 keep-alive 包裹的组件被销毁时，它并不会立即销毁缓存的组件实例，而是将其缓存起来。当下次再次渲染该组件时，会优先从缓存中获取组件实例，而不是重新创建一个新的实例**。这样就可以避免重复渲染和销毁，提高页面性能。

- 在 keep-alive 中，还可以通过设置 include 和 exclude 属性来控制哪些组件需要缓存，哪些不需要缓存。
- 同时，还可以通过 max 属性来设置最大缓存数量，超过该数量时，最早缓存的组件实例将被销毁。

### next-tick

ue.js 中的 nextTick 方法是在下一个 DOM 更新周期之后执行回调函数的一种方法。在 Vue.js 中，每次数据变化都会重新渲染 DOM，但是这个过程不是同步的，而是异步的。也就是说，当数据变化时，Vue.js 并不会立即更新 DOM，而是将这个更新操作放到一个队列中，等待下一个 DOM 更新周期再执行。

## tree-diff 算法

### patch 算法

patch 的核心 是 diff 算法，而 diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，想象节点树为一个类似二叉树的结构。

```js
function patch(oldVnode, vnode, parentElm) {
  if (!oldVnode) {
    addVnodes(parentElm, null, vnode, 0, vnode.length - 1)
  } else if (!vnode) {
    removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1)
  } else {
    if (sameVnode(oldVNode, vnode)) {
      patchVnode(oldVNode, vnode)
    } else {
      removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1)
      addVnodes(parentElm, null, vnode, 0, vnode.length - 1)
    }
  }
}
```

1. oldVnode（老 VNode 节点）不存在的时候，相当于新增
2. 在 vnode（新 VNode 节点）不存在的时候，相当于要把老的节点删除
3. 如果新老都存在，判断是否属于相同节点
   1. 如果是，则执行 patchNode 比对节点
   2. 如果不是，则删除老的，增加新的

那什么样的节点是 sameNodes 呢?

```js
function sameVnode() {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    !!a.data === !!b.data &&
    sameInputType(a, b)
  )
}

function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  let i
  // 🔥 注意下面的语法：从 data 属性中获取它们的 attrs 属性，再从 attrs 属性中获取 type 属性值
  // 直接 a.data?.attrs?.type 不就好了。。。
  const typeA = (i = a.data) && (i = i.attrs) && i.type
  const typeB = (i = b.data) && (i = i.attrs) && i.type
  return typeA === typeB
}
```

sameVnode 其实很简单，只有当 key、 tag、 isComment（是否为注释节点）、 data 同时定义（或不定义），同时满足当标签类型为 input 的时候 type 相同（某些浏览器不支持动态修改`<input>`类型，所以他们被视为不同类型）即可。

#### patchVnode

```js
function patchVnode(oldVnode, vnode) {
  if (oldVnode === vnode) {
    return
  }

  if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
    vnode.elm = oldVnode.elm
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  const elm = (vnode.elm = oldVnode.elm)
  const oldCh = oldVnode.children
  const ch = vnode.children

  if (vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  } else {
    if (oldCh && ch && oldCh !== ch) {
      updateChildren(elm, oldCh, ch)
    } else if (ch) {
      if (oldVnode.text) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1)
    } else if (oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      nodeOps.setTextContent(elm, '')
    }
  }
}
```

1. 新老 VNode 节点相同的情况下，直接 return
2. 当新老 VNode 节点都是 isStatic（静态的），并且 key 相同时，直接复用老节点
3. 当新 VNode 节点是文本节点的时候，直接用 setTextContent 来设置 text，这里的 nodeOps 是一个适配层，根据不同平台提供不同的操作平台 DOM 的方法，实现跨平台。
4. 当新 VNode 节点是非文本节点当时候，需要分几种情况。
   1. oldCh 与 ch 都存在且不相同时，使用 updateChildren 函数来更新子节点，这个后面重点讲。
   2. 如果只有 ch 存在的时候，如果老节点是文本节点则先将节点的文本清除，然后将 ch 批量插入插入到节点 elm 下。
   3. 同理当只有 oldch 存在时，说明需要将老节点通过 removeVnodes 全部清除
   4. 最后一种情况是当只有老节点是文本节点的时候，清除其节点文本内容。

这里第三步，为啥要判断是否为文本节点呢？？？

#### updateChildren

```js
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, elmToMove, refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      let elmToMove = oldCh[idxInOld]
      if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null
      if (!idxInOld) {
        createElm(newStartVnode, parentElm)
        newStartVnode = newCh[++newStartIdx]
      } else {
        elmToMove = oldCh[idxInOld]
        if (sameVnode(elmToMove, newStartVnode)) {
          patchVnode(elmToMove, newStartVnode)
          oldCh[idxInOld] = undefined
          nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          createElm(newStartVnode, parentElm)
          newStartVnode = newCh[++newStartIdx]
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    refElm = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

首先我们定义 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 分别是新老两个 VNode 的两边的索引，同时 oldStartVnode、newStartVnode、oldEndVnode 以及 newEndVnode 分别指向这几个索引对应的 VNode 节点。

接下来是一个 while 循环，在这过程中，oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 会逐渐向中间靠拢。 `while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) `

首先当 oldStartVnode 或者 oldEndVnode 不存在的时候，oldStartIdx 与 oldEndIdx 继续向中间靠拢，并更新对应的 oldStartVnode 与 oldEndVnode 的指向

接下来这一块，是将 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 两两比对的过程，一共会出现 2\*2=4 种情况。

最后是当以上情况都不符合的时候，这种情况怎么处理呢？

1. 首先定义一些变量，包括旧节点的起始、结束索引、新节点的起始、结束索引，以及对应的节点对象等。
2. 然后使用 while 循环，对新旧节点进行比较。在比较过程中，根据节点是否存在，以及节点是否相同，进行相应的更新操作。具体如下：
3. 🔥 如果旧节点的起始节点不存在，则将旧节点的起始节点指向下一个节点。
4. 🔥 如果旧节点的结束节点不存在，则将旧节点的结束节点指向上一个节点。
5. 🔥🔥 如果旧节点的起始节点和新节点的起始节点相同，则进行 patchVnode 更新操作，并将旧节点和新节点的起始索引分别加 1。
6. 🔥🔥 如果旧节点的结束节点和新节点的结束节点相同，则进行 patchVnode 更新操作，并将旧节点和新节点的结束索引分别减 1。
7. 🔥🔥 如果旧节点的起始节点和新节点的结束节点相同，则进行 patchVnode 更新操作，并将旧节点的起始节点插入到新节点的结束节点之后，然后将旧节点和新节点的起始索引分别加 1 和减 1。
8. 🔥🔥 如果旧节点的结束节点和新节点的起始节点相同，则进行 patchVnode 更新操作，并将旧节点的结束节点插入到旧节点的起始节点之前，然后将旧节点和新节点的结束索引分别减 1 和加 1。
9. 🔥🔥🔥 如果以上情况都不满足，则需要判断新节点是否有 key 值。如果没有，则说明是新节点，需要创建新的 DOM 元素并插入到父节点中。如果有 key 值，则需要查找旧节点中是否有相同 key 值的节点。如果有，则进行 patchVnode 更新操作，并将旧节点数组中对应位置的元素设为 undefined，然后将该节点插入到旧节点的起始节点之前。如果没有，则说明是新节点，需要创建新的 DOM 元素并插入到父节点中。
10. 最后，如果旧节点的起始索引大于旧节点的结束索引，则说明旧节点中有一些节点需要被删除，需要调用 removeVnodes 方法进行删除操作。如果新节点的起始索引大于新节点的结束索引，则说明新节点中有一些节点需要被添加，需要调用 addVnodes 方法进行添加操作。

## 响应式

### Object.defineProperty

**简单版本：**

```js
function cb() {
  // 渲染视图
  console.log('视图更新啦')
}

// 这里将Object.defineProperty用函数包装起来，其实也是防止堆栈溢出的方式
// 即函数内作用域私有化变量
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter() {
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      cb(newVal)
    },
  })
}

function observer(value) {
  if (!value || typeof value !== 'object') {
    return
  }

  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key])
  })
}

class Vue {
  constructor(options) {
    this._data = options.data // 获取data
    observer(this._data) // 数据响应化
  }
}

// 因此当下面修改test时，就会触发回调函数cb
let o = new Vue({
  data: {
    test: 'I am test.',
  },
})

o._data.test = 'hello,world.' /* 视图更新啦～ */
```

其实 `observer` 在实例化 vue 或者页面、组件时，都会触发，相当于设置监听事件，然后当修改 `o._data.test` 时，就会触发页面渲染，就会触发 cb

但是上面并没有收集依赖，也没有添加 watcher

**完善版本**

```js
// 订阅者 Dep 主要用来存放`Watcher`观察者对象的，其实就是个数组，然后有一些方法，简单实现如下：
class Dep {
  constructor(){
    // 用来存放watcher对象的数组
    this.subs = [];
  },

  addSub(sub){
    // 添加watcher
    this.subs.push(sub);
  },

  notify(){
    // 通知所有watcher对象更新视图
    this.subs.forEach(sub => {
      // update方法是watcher自己的
      sub.update()
    })
  }
}

// 观察者
class Watcher {
  constructor() {
    // 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到
    // 其实就是watcher对象本身
    Dep.target = this;
  },

  // 更新视图的方法
  update(){
    console.log('视图更新啦');
  }
}

function observer(value) {
  if (!value || typeof value !== "object") {
    return;
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  });
}

function defineReactive(obj, key, val) {
  /* 一个Dep类对象 */
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target);
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
    }
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    // 添加监听和拦截，但get及set里的逻辑，并没有走
    observer(this._data);
    // 新建一个Watcher观察者对象，实例化时，就会设置Dep.target会指向这个实例化的 watcher 实例
    new Watcher();
    // 在这里模拟render的过程，为了触发test属性的get函数
    console.log("render~", this._data.test);
  }
}
```

### 数组等响应式

Vue2 对数组的常用方法进行了改写，具体实现方式是通过**重写数组的原型对象，将这些方法进行了改造，在这些方法中添加了更新视图的逻辑**。

其实就是，重写原型方法，里面包装原始的调用，然后再增加 更新页面的逻辑
