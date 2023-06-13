---
title: 'Vue3的那些技术点'
date: Tue Jun 13 2023 10:17:09 GMT+0800 (中国标准时间)
lastmod: '2023-06-13'
tags: ['vue3', 'MVVM', 'spa']
draft: false
summary: '渐进式 JavaScript 框架'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/vue-skills-v3
---

## vue3 新特性

### 响应式

在 vue2 中，数据劫持是通过 Object.defineProperty，这个 API 有一些缺陷，并不能检测对象属性的添加和删除

相比之下，vue3 是通过 proxy 监听整个对象，那么对于删除还是监听当然也能监听到

~~同时 Proxy 并不能监听到内部深层次的对象变化，而 Vue3 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归~~ 这句话对吗？Proxy 可以监听深层次的对象啊

上面的话也对，因为 proxy 代理，虽然可以代理对整个对象的操作，但是深层次的修改，需要特殊处理才行

```js
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      return res
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
})
// 1.获取
state.foo // ok
// 2.设置已存在属性
state.foo = 'fooooooo' // ok
// 3.设置不存在属性
state.dong = 'dong' // ok
// 4.删除属性
delete state.dong // ok

// 再测试嵌套对象情况，这时候发现就不那么 OK 了
const state = reactive({
  bar: { a: 1 },
})

// 设置嵌套对象属性，这里的修改只能监听到bar，无法作用到a上
state.bar.a = 10 // no ok

// 此时需要
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      // 再加一层
      return isObject(res) ? reactive(res) : res
    },
  })
  return observed
}
```

### 优化

- 编译阶段
  - diff 算法优化，标记静态节点，diff 数量减少
  - 静态提升，渲染函数无需多次生成静态内容，只需一次并保存即可
  - 事件监听缓存，之前绑定的事件，其实都是动态绑定，都需要去追踪其变化
    - 现在，直接将对应的事件缓存，其实就是组件重建后，事件从缓存里取，避免每次重新注册，减少不必要的事件处理开销
    - 默认是开启的
  - ssr 优化，对于大段的静态内容，提供 createStaticVNode 创建静态 node，会直接 innerHtml，避免很多中间创建对象等等环节
- 源码体积
  - 使用 tree-shaking，仅仅打包用到的 API，同时干掉很多很多不常用的 api，比如`过滤器，$on，$destroy`
- 响应式系统
  - vue2 中采用 defineProperty 来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加 getter 和 setter，实现响应式
  - vue3 采用 proxy 重写了响应式系统，因为 proxy 可以对整个对象进行监听，所以不需要深度遍历

### option API 与 composition API

- 在逻辑组织和逻辑复用方面，Composition API 是优于 Options API
- 因为 Composition API 几乎是函数，会有更好的类型推断。
- Composition API 对 tree-shaking 友好，代码也更容易压缩
- Composition API 中见不到 this 的使用，减少了 this 指向不明的情况
- 如果是小型组件，可以继续使用 Options API，也是十分友好的

### Tree shaking

是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫 Dead code elimination

在 Vue2 中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是 Vue 实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到

```js
import Vue from 'vue'
Vue.nextTick(() => {})
```

而 Vue3 源码引入 tree shaking 特性，将全局 API 进行分块。如果您不使用其某些功能，它们将不会包含在您的基础包中

```js
import { nextTick, observable } from 'vue'
nextTick(() => {})
```

这是因为 Vue 组件的模板和组件实例的逻辑是动态绑定的。在编译阶段，Vue 2 的模板编译器无法静态分析模板中的绑定和指令，因此无法确定哪些组件属性会被使用，以及如何进行摇树优化。

另外，Vue 2 中的组件属性和方法通常是通过 this 上下文进行访问，而 this 对象的属性访问是无法静态分析的。这意味着捆绑工具（如 Webpack）无法确定哪些属性会被使用，因此无法安全地进行摇树优化。

为了解决这个问题，Vue 3 引入了基于编译时的静态分析和优化。Vue 3 中的组件使用了更现代的编译器，可以在编译阶段静态分析模板和组件的使用情况，从而实现更好的 tree shaking 效果。因此，Vue 3 对于摇树优化提供了更好的支持。

总结来说，Vue 2 中由于运行时的动态特性，tree shaking 的效果受限。而 Vue 3 利用编译时的静态分析和优化，能够更好地进行 tree shaking，从而减小最终生成的生产代码的体积。
