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

sameVnode 其实很简单，只有当 key、 tag、 isComment（是否为注释节点）、 data 同时定义（或不定义），同时满足当标签类型为 input 的时候 type 相同（某些浏览器不支持动态修改<input>类型，所以他们被视为不同类型）即可。

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
