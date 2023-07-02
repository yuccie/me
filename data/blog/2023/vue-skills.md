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

## new Vue 都发生了什么

1. new Vue(opts) 首先会接收传入的 opts 数据
2. 开始执行初始化的操作，初始化生命周期、组件事件，初始化渲染方法等，同时先定义 各种方法，`$set，$get，$forceUpdate`等等
3. 然后执行 beforeCrate 钩子，再初始化 data，然后执行 crated
4. 最后是 `$mount`，
   1. `$mount` 又分很多步，首先根据选项模版或者 html 生成渲染函数，这个过程还会转成 AST，同时做依赖搜集以及各种静态分析等等
   2. 然后开始执行渲染组件函数，函数内部会再次判断是否有渲染函数，根据需要提示当前是 runtime-only 版本与否，或者没找到对应的模版或渲染函数
   3. 满足条件后，执行 beforeMount 钩子，然后定义 updateComponent 方法
      1. 该方法的主要目的是利用渲染函数生成虚拟 dom，再通过 patch（就是\_update 方法），生成真正的 dom
   4. 然后开始执行 `new Watcher(vm, updateComponent, xxx) `
      1. 实例化 watcher 之后，当数据发生变化时，会再次触发 updateComponent
      2. 而第一次时，直接就根据数据生成了最终的 dom，同时将虚拟 dom 保存在内存中，下次数据发生变更时，会再次生成虚拟 dom 并比对
      3. 只生成变化的部分。
5. 最后执行 mounted 生命周期钩子

## vue2 vs vue3

- 性能提升：Vue3 的虚拟 DOM 重写了渲染和补丁算法，在渲染和更新组件时，比 Vue2 更快。
- Composition API：Vue3 新增了 Composition API，可以让代码更好地组织和复用，同时也更易于测试和维护。
- 更好的 TypeScript 支持：Vue3 的 TypeScript 支持更加完善，可以提供更好的类型检查和自动补全等功能。
- 更好的 Tree-shaking 支持：Vue3 可以更好地支持 Tree-shaking，可以在构建时自动剔除未使用的代码，减小包的体积。
- 更小的包体积：Vue3 的包体积比 Vue2 更小，同时也提供了更好的按需加载支持。
- 更好的响应式系统：Vue3 的响应式系统比 Vue2 更强大，可以支持更多类型的响应式数据，并且在性能上也有所提升。
- 更好的插件系统：Vue3 的插件系统比 Vue2 更加灵活，可以更好地支持第三方插件的开发和集成。

## 虚拟 dom

虚拟 DOM （Virtual DOM ）这个概念相信大家都不陌生，从 React 到 Vue ，虚拟 DOM 为这两个框架都带来了跨平台的能力（React-Native 和 Weex）

实际上它只是一层对真实 DOM 的抽象，以 JavaScript 对象 (VNode 节点) 作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上

> 很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种 GUI

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

- 首次进入组件时：`beforeRouteEnter > beforeCreate > created> mounted > activated > ... ... > beforeRouteLeave > deactivated`
- 再次进入组件时：`beforeRouteEnter >activated > ... ... > beforeRouteLeave > deactivated`

### next-tick

ue.js 中的 nextTick 方法是在下一个 DOM 更新周期之后执行回调函数的一种方法。在 Vue.js 中，每次数据变化都会重新渲染 DOM，但是这个过程不是同步的，而是异步的。也就是说，当数据变化时，Vue.js 并不会立即更新 DOM，而是将这个更新操作放到一个队列中，等待下一个 DOM 更新周期再执行。

手动实现一个 nextTick

```js
// 异步执行回调函数
function nextTick(callback) {
  // 将回调函数推入回调函数队列
  callbacks.push(callback)
  // 如果当前不处于执行回调函数的状态，则异步执行回调函数
  if (!pending) {
    pending = true
    // 通过 Promise.resolve().then() 进行异步调用
    Promise.resolve().then(flushCallbacks)
  }
}

// 用于存储回调函数的队列
let callbacks = []
// 标识是否正在执行回调函数
let pending = false

// 执行回调函数
function flushCallbacks() {
  // 拷贝一份回调函数队列
  const copies = callbacks.slice(0)
  // 清空原始的回调函数队列
  callbacks.length = 0
  // 依次执行回调函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
  // 标记为正在执行回调函数
  pending = false
}
```

### 指令

### 过滤器

在编译阶段通过 parseFilters 将过滤器编译成函数调用（串联过滤器则是一个嵌套的函数调用，前一个过滤器执行的结果是后一个过滤器函数的参数）

## tree-diff 算法

diff 算法是一种通过同层的树节点进行比较的高效算法

其有两个特点：

- 比较只会在同层级进行, 不会跨层级比较
- 在 diff 比较的过程中，循环从两边向中间比较

### key 的作用

```vue
<!-- 利用key -->
<ul>
    <li v-for="item in items" :key="item.id">...</li>
</ul>

<!-- 利用new Date -->
<Comp :key="+new Date()" />
```

当我们在使用 v-for 时，需要给单元加上 key

- 如果不用 key，Vue 会采用就地复地原则：最小化 element 的移动，并且会尝试尽最大程度在同适当的地方对相同类型的 element，做 patch 或者 reuse。
- 如果使用了 key，Vue 会根据 keys 的顺序记录 element，曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed

设置 key 可以提高大多数情况下的渲染效率，减少更新次数，如下说明：

```html
<body>
  <div id="demo">
    <p v-for="item in items" :key="item">{{item}}</p>
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
    // 创建实例
    const app = new Vue({
      el: '#demo',
      data: { items: ['a', 'b', 'c', 'd', 'e'] },
      mounted() {
        setTimeout(() => {
          this.items.splice(2, 0, 'f') //
        }, 2000)
      },
    })
  </script>
</body>
```

```js
// a b c d e
// a b f c d e
```

- 如果不使用 key，则会原地用之前相同节点类型的元素，也就是复用前 5 个，但需要修改 c d e 三个的值，同时还需插入一个 e
- 如果使用 key，则 abcde 均复用，值也不变，仅仅是在 c 之前插入一个值而已
- 相比不使用 key，后者大大降低了对 dom 的操作，提高了效率。

#### 设置 key 值一定能提高 diff 效率吗？

> 当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素

这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出，其实也就是简单的，不怎么变化的列表。

建议尽可能在使用 v-for 时提供 key，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升

在 react 中其实也是，但对于简单的列表，其实原地复用，修改 innerText 可以更加高效，而有了 key 反而需要移动，开销更加大一些。

### patch 算法

1. 当数据发生改变时，订阅者 watcher 就会调用 patch 给真实的 DOM 打补丁，传入的参数就是新旧 Vnode
2. 通过 isSameVnode 进行判断，相同则调用 patchVnode 方法,patchVnode 做了以下操作：
3. 找到对应的真实 dom，称为 el
4. 如果都有都有文本节点且不相等，将 el 文本节点设置为 Vnode 的文本节点
5. 如果 oldVnode 有子节点而 VNode 没有，则删除 el 子节点
6. 如果 oldVnode 没有子节点而 VNode 有，则将 VNode 的子节点真实化后添加到 el
7. 如果两者都有子节点，则执行 updateChildren 函数比较子节点
8. updateChildren 主要做了以下操作：
9. 设置新旧 VNode 的头尾指针
10. 新旧头尾指针进行比较，循环向中间靠拢，
11. 根据情况调用 patchVnode 进行 patch 重复流程、调用 createElem 创建一个新节点，从哈希表寻找 key 一致的 VNode 节点再分情况操作

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

### Vue3 setup 和 vue2 data 区别

Vue3 中使用了一个新的 API setup 来替代 Vue2 中的 data 选项。setup 函数是一个新的组件选项，它是在组件内部执行的，用于设置组件的初始状态、计算属性、方法等。

Vue3 中的 setup 函数与 Vue2 中的 data 选项有以下区别：

- setup 函数是一个普通函数，而 data 选项是一个对象。
- setup 函数需要返回一个对象，这个对象包含组件的状态、计算属性、方法等。而 data 选项中直接定义的属性就是组件的状态。
- 在 setup 函数中，可以使用 Vue3 提供的新 API，如 ref、reactive、computed 等，来创建响应式数据。而在 Vue2 中，需要使用 data 函数来创建响应式数据。
- setup 函数中的变量和方法可以在模板中直接使用，不需要通过 this 来访问。而在 Vue2 中，需要通过 this 来访问组件的状态和方法。
- setup 函数中的代码会在组件实例创建之前执行，因此在 setup 函数中无法访问组件实例的生命周期钩子和属性。而- 在 Vue2 中，data 选项中的代码是在组件实例创建之后执行的，因此可以访问组件实例的生命周期钩子和属性。

总的来说，setup 函数是 Vue3 中用于设置组件初始状态和计算属性的主要方式，它比 Vue2 中的 data 选项更加灵活和强大。

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
// 观察者 Dep 主要用来存放`Watcher`观察者对象的，其实就是个数组，然后有一些方法，简单实现如下：
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

### vue.observable

```js
import Vue from 'vue
// 创建state对象，使用observable让state对象可响应
export let state = Vue.observable({
  name: '张三',
  'age': 38
})

export function observe (value: any, asRootData: ?boolean): Observer | void {

  let ob: Observer | void
  // 判断是否存在__ob__响应式属性
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 实例化Observer响应式对象
    ob = new Observer(value)
  }

  return ob
}

export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data

    constructor (value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods)
            } else {
                copyAugment(value, arrayMethods, arrayKeys)
            }
            this.observeArray(value)
        } else {
            // 实例化对象是一个对象，进入walk方法
            this.walk(value)
        }
}

walk (obj: Object) {
    const keys = Object.keys(obj)
    // 遍历key，通过defineReactive创建响应式对象
    for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
    }
}

export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  // 接下来调用Object.defineProperty()给对象定义响应式属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 对观察者watchers进行通知,state就成了全局响应式对象
      dep.notify()
    }
  })
}
```

总结：

- 整个的路线其实就是递归的去执行函数响应式

### 数组等响应式

Vue2 对数组的常用方法进行了改写，具体实现方式是通过**重写数组的原型对象，将这些方法进行了改造，在这些方法中添加了更新视图的逻辑**。

其实就是，重写原型方法，里面包装原始的调用，然后再增加 更新页面的逻辑

```js
const originalProto = Array.prototype
const arrayProto = Object.create(originalProto)[
  ('push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort')
].forEach((method) => {
  arrayProto[method] = function () {
    originalProto[method].apply(this.arguments)
    dep.notice()
  }
})
```

### ref vs reactive

Vue3 中，ref 和 reactive 都是响应式数据处理的方式。

ref 是一个函数，它可以将一个普通的 JavaScript 数据转化为可响应的数据，返回一个具有 value 属性的对象。ref 适用于处理简单数据类型，如数字、字符串等。

reactive 是一个函数，它可以将一个普通的 JavaScript 对象转化为可响应的对象，返回一个代理对象。reactive 适用于处理复杂的数据类型，如对象、数组等。

ref 和 reactive 的区别在于，

- ref 返回的是一个包含 value 属性的对象，而 reactive 返回的是一个代理对象。
- ref 返回的对象只能通过 .value 属性来访问和修改值，而 reactive 返回的代理对象可以直接访问和修改对象的属性。

```js
import { ref, reactive } from 'vue'

const count = ref(0)
const obj = reactive({ name: 'Tom', age: 18 })

console.log(count.value) // 0
console.log(obj.name) // 'Tom'

count.value = count.value + 1
obj.name = 'Jerry'

console.log(count.value) // 1
console.log(obj.name) // 'Jerry'
```

**手动实现 reactive，其实就是用 proxy 实现的包装**

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const value = Reflect.get(target, key)
      console.log(`get ${key}: ${value}`)
      return value
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value)
      console.log(`set ${key}: ${value}`)
      return result
    },
  })
}
```

**手动实现 ref**

```js
function ref(initialValue) {
  let value = initialValue
  let subscribers = []

  function notify() {
    subscribers.forEach((subscriber) => subscriber(value))
  }

  function set(newValue) {
    value = newValue
    notify()
  }

  function subscribe(subscriber) {
    subscribers.push(subscriber)
  }

  return {
    get value() {
      return value
    },
    set value(newValue) {
      set(newValue)
    },
    subscribe,
  }
}
```

上面的代码定义了一个 ref 函数，它返回一个对象，其中包含一个 value 属性和一个 subscribe 方法。value 属性用来存储引用的值，subscribe 方法用来订阅 value 属性的变化。

下面是一个示例，展示如何使用 ref 函数：

```js
javascript
const count = ref(0)

count.subscribe((value) => {
  console.log(`count: ${value}`)
})

count.value = 1 // count: 1
count.value = 2 // count: 2
```

上面的代码创建了一个名为 count 的 ref 对象，初始值为 0。然后，订阅了 count 对象的变化，并在控制台输出了变化后的值。最后，通过修改 count 对象的 value 属性来触发变化。

## 数据管理

Vuex、Redux 和 Mobx 都是状态管理库，用于管理应用程序的状态。它们都有以下相同点：

1. 都是用于管理应用程序的状态。
2. 都使用单一数据源。
3. 都使用纯函数来更新状态。
4. 都可以通过中间件来扩展功能。

它们的不同点如下：

1. Vuex 是专门为 Vue.js 设计的状态管理库，而 Redux 和 Mobx 可以与任何 JavaScript 框架一起使用。
2. Vuex 使用 Vue.js 的响应式系统来更新状态。Redux 和 Mobx 则需要**手动订阅状态变化**。
3. Redux 强调不可变性，即状态不应该被直接修改，而是应该通过纯函数来生成新的状态，其实每次都是浅拷贝一份。Vuex 和 Mobx 则没有这样的限制。
4. Mobx 使用装饰器来简化状态管理，而 Redux 和 Vuex 则没有这样的功能。
5. Redux 和 Vuex 都有一个严格的状态管理机制，所有的状态变更都需要通过特定的 Action 来触发。Mobx 则没有这样的机制。

总之，Vuex、Redux 和 Mobx 都是优秀的状态管理库，具有不同的特点和优势。选择哪一个取决于你的应用程序需要什么样的状态管理机制。

### 观察者模式与发布订阅模式

发布订阅和观察者模式都是用于解决对象之间的通信问题，但它们之间有以下区别：

1. 发布订阅模式中，发布者和订阅者之间有一个中间的消息队列，发布者把消息放入队列中，订阅者从队列中获取消息。而观察者模式中，观察者直接订阅主题，主题发生变化时直接通知观察者。

2. 发布订阅模式中，发布者和订阅者之间没有直接关联，发布者只需要知道消息队列，订阅者只需要知道消息队列和订阅的消息类型。而观察者模式中，主题和观察者之间有直接关联，主题需要知道观察者，并且观察者需要注册到主题中。

3. 发布订阅模式中，发布者可以发布多种类型的消息，订阅者可以订阅多种类型的消息。而观察者模式中，主题只能发布一种类型的消息，观察者只能订阅该类型的消息。

4. 发布订阅模式中，发布者和订阅者之间可以存在多对多的关系，一个发布者可以有多个订阅者，一个订阅者可以订阅多个发布者。而观察者模式中，主题和观察者之间是一对多的关系，一个主题可以有多个观察者。

总的来说，**发布订阅模式更加灵活，适用于多对多的场景，而观察者模式更加简单，适用于一对多的场景**。

因此：

- vue 是发布订阅模式
- 而 redux 和 mobx 是观察者模式

#### 发布订阅模式

```js
class PubSub {
  constructor() {
    this.events = {}
  }

  subscribe(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  unsubscribe(event, listener) {
    if (!this.events[event]) {
      return
    }
    const index = this.events[event].indexOf(listener)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  publish(event, data) {
    if (!this.events[event]) {
      return
    }
    this.events[event].forEach((listener) => {
      listener(data !== undefined ? data : {})
    })
  }
}

const pubsub = new PubSub()

// 订阅事件
const listener1 = (data) => console.log(`listener1 received data: ${data}`)
pubsub.subscribe('event1', listener1)

// 发布事件
pubsub.publish('event1', { message: 'hello world' })

// 取消订阅
pubsub.unsubscribe('event1', listener1)
```

- 发布订阅，是多种类型的事件，而观察者模式只是其中的一个子集，也就某一类事件

#### 观察者模式

```js
class Subject {
  constructor() {
    this.observers = []
  }
  // 不区分事件类型，直接压入，因为观察者就是针对某一类事情进行观察
  addObserver(observer) {
    this.observers.push(observer)
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  notifyObservers(data) {
    this.observers.forEach((observer) => {
      observer.update(data)
    })
  }
}

class Observer {
  update(data) {
    console.log(`Received data: ${data}`)
  }
}

// Usage:
const subject = new Subject()

const observer1 = new Observer()
const observer2 = new Observer()

// 添加多个对同一类事情的观察者
subject.addObserver(observer1)
subject.addObserver(observer2)

// 通知观察者
subject.notifyObservers('Hello world!')

subject.removeObserver(observer1)

subject.notifyObservers('Goodbye!')
```

### vuex 手动实现一个

Vuex 是一个状态管理库，用于管理 Vue.js 应用程序中的所有组件的状态。它使用了一种称为“单向数据流”的模式

```js
class Store {
  constructor(options) {
    this.state = options.state || {}
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
    this.getters = options.getters || {}
  }

  commit(type, payload) {
    const mutation = this.mutations[type]
    mutation(this.state, payload)
  }

  dispatch(type, payload) {
    const action = this.actions[type]
    return action({ commit: this.commit, state: this.state }, payload)
  }
}

// State
class State {
  constructor(data) {
    this.data = data
  }
}

// Mutations
class Mutations {
  add(state, payload) {
    // 操作state.data
  }

  remove(state, payload) {
    // 操作state.data
  }
}

class Actions {
  add({ commit }, payload) {
    setTimeout(() => {
      commit('add', payload)
    }, 1000)
  }

  remove({ commit }, payload) {
    setTimeout(() => {
      commit('remove', payload)
    }, 1000)
  }
}

class Getters {
  count(state) {
    return state.data.length
  }

  list(state) {
    return state.data
  }
}

// 实例化store
const store = new Store({
  state: new State({
    data: ['item1', 'item2', 'item3'],
  }),
  mutations: new Mutations(),
  actions: new Actions(),
  getters: new Getters(),
})

// 使用vuex
new Vue({
  el: '#app',
  store,
  computed: {
    count() {
      return this.$store.getters.count
    },
    list() {
      return this.$store.getters.list
    },
  },
  methods: {
    addItem() {
      this.$store.dispatch('add', 'item4')
    },
    removeItem(item) {
      this.$store.dispatch('remove', item)
    },
  },
})
```

### redux 手动实现一个

```js
// 参数1是reducer，是具体执行器，类似mutation
// 参数2是初始化的数据
function createStore(reducer, initialState) {
  let state = initialState
  const listeners = []

  function getState() {
    return state
  }

  //
  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  // 添加订阅者
  function subscribe(listener) {
    listeners.push(listener)
    // 同时返回接触订阅的方法
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  return {
    getState,
    dispatch,
    subscribe,
  }
}

// 针对不同的操作类型，执行的具体操作
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      }
    default:
      return state
  }
}

// 使用，
const store = createStore(reducer, { count: 0 })

console.log(store.getState()) // { count: 0 }

// 执行具体的操作，内部根据type找到对应的操作，然后操作state
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState()) // { count: 1 }

// 添加一个订阅者
const unsubscribe = store.subscribe(() => {
  console.log(store.getState())
})

// 执行加减
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })

// 取消订阅
unsubscribe()

// 再执行逻辑时，虽然执行，但是并不会再打印了日志
store.dispatch({ type: 'DECREMENT' })
```

总结：

- 数据都需要手动去监听和移除，相比 vue 麻烦了不少
- 但是可以更精细化管理，

### mobx 手动实现一个

```js
class Mobx {
  constructor() {
    this.observers = new Set() // 用 Set 存储所有观察者
  }

  addObserver(observer) {
    this.observers.add(observer)
  }

  removeObserver(observer) {
    this.observers.delete(observer)
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer()
    }
  }
}

class ObservableValue extends Mobx {
  constructor(value) {
    super()
    this.value = value
  }

  get() {
    this.addObserver(() => console.log(`Value changed to ${this.value}`))
    return this.value
  }

  set(value) {
    this.value = value
    this.notifyObservers()
  }
}

// 观察者模式：观察具体的数据
const observableValue = new ObservableValue(10)

// 获取数据，会触发get，同时添加 观察者
console.log(observableValue.get()) // Value changed to 10, 10

// 设置数据，会触发set，然后通知所有 观察者
observableValue.set(20) // Value changed to 20
console.log(observableValue.get()) // Value changed to 20, 20
```
