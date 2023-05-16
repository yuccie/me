---
title: 'react相关'
date: Mon May 15 2023 23:12:58 GMT+0800 (中国标准时间)
lastmod: '2023-05-15'
tags: ['react', 'hooks']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/react-skills
---

## hooks

### Fiber

React 中的 Fiber 架构是一种新的实现方式，用于替换旧的 Reconciler 架构。Fiber 架构的目的是提高 React 的性能和可维护性，同时也提供了更多的灵活性。

Fiber 架构的核心是一个轻量级的、可中断的、可恢复的任务调度器。在 Fiber 架构中，React 将渲染过程分解成一系列的小任务，然后按照优先级顺序调度这些任务。每个任务都是一个 Fiber 节点，它包含了组件的状态、子节点信息和一些其他的元数据。

当 React 开始渲染一个组件时，它会创建一个 Fiber 节点，并将其添加到调度队列中。然后 React 会从队列中取出一个优先级最高的 Fiber 节点，并执行它的任务。当这个任务执行完成后，React 会根据任务的执行结果更新组件的状态，并创建或更新子节点的 Fiber 节点。然后 React 会将这些子节点的 Fiber 节点添加到调度队列中，等待下一次执行。

Fiber 架构还提供了一种新的机制来处理异步渲染，即通过将任务分成多个时间片来实现。这样可以在不阻塞主线程的情况下，将渲染任务分散到多个时间片中执行，从而提高应用的响应性。

总之，Fiber 架构是 React 的一种新的实现方式，它提供了更高的性能和可维护性，并且支持异步渲染。

### 底层原理

React hooks 的底层实现是基于 React Fiber 的。

React Fiber 是 React 的新的协调引擎，它的目标是提高 React 的性能和灵活性。

React Hooks 是基于 React Fiber 的新特性，它允许我们在函数组件中使用状态和生命周期方法，从而使函数组件具有类组件的能力。

React Hooks 的实现基于 Fiber 节点的链表结构，它们可以在组件渲染期间被添加、删除或更新。当组件被更新时，React 会通过 Fiber 节点的链表来决定哪些组件需要重新渲染，并根据需要调用相应的 hook 函数。

手动实现一个 hooks
思路：

1. 一般 hooks 有一个入参，用来初始化
2. 返回一个数组，数组的前一项是 值，后一项是 设置值的函数，同时还会重新渲染
3. 如下示例：

```js
function useState(initialValue) {
  let value = initialValue

  const setState = (newValue) => {
    value = newValue
    render() // 重新渲染组件
  }

  return [value, setState]
}
```

### useRef 和 useState

useRef 和 useState 都是 React 的钩子函数，但它们的作用不同。

- useRef
  - useRef 返回一个可变的 ref 对象，该对象可以在组件的整个生命周期中保持不变。
  - useRef 通常用于保存 DOM 节点的引用或其他任何需要在组件之间共享的值。
- useState 返回一个状态值和一个更新函数，该状态值可以在组件的整个生命周期中被更新。
  - useState 通常用于保存组件内部的状态。

简而言之，**useRef 用于保存不需要触发重新渲染的值，而 useState 用于保存需要触发重新渲染的值。**
