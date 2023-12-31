---
title: '关于mpx的那些点'
date: Sat Sep 02 2023 22:08:10 GMT+0800 (中国标准时间)
lastmod: '2023-09-02'
tags: ['关于mpx的那些点']
draft: false
summary: '关于mpx的那些点'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-mini/3_关于mpx的那些点
---

## 介绍

在项目开发中，我们使用的是 mpx 框架，公司自研并开源的一套框架。

mpx 框架作为上层框架，使用类似 vue 的开发范式编程，支持多端输出，比如 wx、ali、dd、h5 等

目前业界主流的小程序框架主要有 WePY，mpvue 和 Taro，这三者都是**将其他的语法规范转译为小程序语法规范，我们称其为转译型框架**。不同于上述三者，Mpx 是一款**基于小程序语法规范的增强型框架，我们使用 Vue 中优秀的语法特性增强了小程序**，而不是让用户直接使用 vue 语法来开发小程序，之所以采用这种设计主要是基于如下考虑：

- 转译型框架无法支持源框架的所有语法特性(如 Vue 模板中的动态特性或 React 中动态生成的 jsx)，用户在使用源框架语法进行开发时可能会遇到不可预期的错误，具有不确定性

  - 意思就是你使用一套 DSL（Domain-specific language）语言编写，然后编译时，再转换其他语言的 DSL。

- 小程序本身的技术规范在不断地更新进步，许多新的技术规范在转译型框架中无法支持或需要很高的支持成本，而对于增强型框架来说只要新的技术规范不与增强特性冲突，就能够直接支持
  - 相当于我们依然使用你们的语言，只是我们增强了你。

相当于语法依然是遵循小程序的语法，虽然部分地方编写方式不同，那是因为我们增强了它，后会再通过各种 loader 或者 plugin 去处理这些部分，进而完全兼容各个平台的小程序

- Mpx 框架是一种小程序增强型框架，它并不直接进行代码的转译，通过构建工具解析和转换 Mpx 特定的语法和扩展，生成原生小程序代码。
- 转译性框架：转译性框架首先将开发者编写的代码解析成抽象语法树（AST），然后针对各个平台，再通过转换和适配转化为各个平台的代码，从而实现跨端，比如 uniapp，taro

## 关于 mpx 的那些点

下面是一些在开发中，沉淀的一些感觉很棒的点子。

## 动态加载

目前在主流的小程序框架当中，从方案设计上来说主要分为以 Taro/Kbone 为代表的重运行时框架，以 Mpx 为代表的重编译型框架。对于重运行时框架而言，在逻辑 -> 视图渲染的流程当中所采用的核心的方案基本都一致：基于小程序的 template 模版递归渲染。

对于重运行时小程序框架而言，DSL 层可以使用主流的 Vue/React 框架，在这些框架内都有一套核心的 vDom Tree 设计，它由一系列的 VNode 节点所组成，在这些框架搭建的应用当中，页面最小的粒度是一个 Component。对于一个由 vDom Tree 去驱动渲染的应用来说，Vnode 描述了组件初始化所需要的 props 数据，父子组件直接的通讯约定（eventName、eventHandler）等等，每个 VNode 都会驱动对应的 Component 实例化、节点挂载、视图渲染等工作。

那么在小程序的环境当中(小程序本身就是一套框架)又怎么可以去运行时另外一个上层 web 框架呢？

这里比较核心的一个点就是上层框架产出的 vDom Tree 可以驱动小程序的 template 模板进行递归渲染。在渲染阶段，在纯 web 场景下一个应用通过 vDom Tree 去驱动渲染，最终还是由浏览器提供的基础 DOM 节点来进行渲染(例如 div、p、span 等)，在小程序环境下就是由小程序提供的基础节点来进行渲染(例如 view、text 等)。

在小程序环境中使用上层 web 框架，组件系统统一由上层 web 框架去接管，包括组件的生命周期，父子组件通讯，事件处理等，但是对于小程序自身而言自己也提供了一套自定义组件的机制，组件系统统一交由小程序自身去接管，他们之间的运行流畅机制差异性非常大。 --- 这里对吗？组件系统统一由上层 web 框架去接管 ，说的是 mpx 框架的运行原理？？

那么既然上层的 DSL 编译出来后的目标代码是小程序的代码组织格式，那么是否可以断定
这些动态化渲染的页面/组件当中是没有使用上层框架的运行时，以及在组件系统当中也就完全使用的小程序的组件系统，而非上层框架提供的组件系统，此外对于页面/组件而言，生命周期也是交由小程序的组件系统来接管？

所以在整个的动态化方案当中，整个组件系统的构建并非依托于原生小程序的自定义组件的机制，而是在运行时有单独的逻辑去维护了组件系统。

此外这里说下原生的小程序对于模板的处理流程，**对于一个页面/组件的模板内容是由一个单独的 wxml 文件来承载，当我们通过真机来预览小程序，微信小程序开发者工具会完成构建打包上传，wxml 的文本内容会经由一个 wx-compiler 编译工具(wcc)处理为一个高阶函数，在小程序实际运行过程当中，这个高阶函数会被注入到小程序的渲染线程当中。这个高阶函数可根据传入的相关页面/组件路径去获取对应的 Render Function，当 Render Function 接受到从逻辑层传过来的数据后即可执行并得到页面/组件的 vDom Tree**。

递归渲染的流程不管是什么框架基本的流程都类似：构建 vdom tree 的过程中，只要找到自定义组件，首先去实例化这个组件实例（对于组件实例的渲染来说，影响初始化渲染包含 2 部分：props 和自身状态数据），然后接下来进行这个组件的递归渲染流程，最终去完成整个应用的初始化。

上层框架是指进行小程序开发的时候源码可以直接使用 Vue/React 进行开发（例如 Taro、Kbone）。它们这样做的核心的关键点之一是利用了这些上层框架自身构建 vDom Tree 的能力，而 vDom Tree 是对整个 视图+逻辑 的抽象，它与平台无关。（同时小程序的渲染线程也利用了 vDom Tree 这种抽象能力）

小程序目前采用双线程的设计，逻辑层只执行 js code，Template 模板是交由渲染线程处理的（其实在小程序编译构建的时候，和 vue template 类似，小程序的 template 也都是被处理为了 render Function，然后在渲染线程去执行）

虽然这些运行时框架(Taro/Kbone)引入了 Vue、React 作为 runtime 的一部分，但是这些代码也只能在逻辑层去执行，也就是构建的 vDom Tree 是在逻辑层的，这个时候还不完成视图层最终的渲染。

对于小程序而言，提供了模板递归的能力，也就是通过 setData 可以把数据传给视图层的 template，这样也就可以把逻辑层构建好的 vDom Tree 直接传给视图层去完成最终的渲染流程。

（这也是原生小程序和这种小程序运行时框架不同的点之一，原生小程序自身也会构建 vdom Tree，只不过是在视图层去构建的，运行时框架是在逻辑层构建，然后 setData 传递给视图层，这也是为什么说**运行时框架比原生小程序**的性能差的关键点之一。）

## 运行时增强原理

### 为什么微信不允许在 created 生命周期使用 setData？

setData 可能伴随着 props 的传递，**而 created 生命周期触发时，组件与组件的结构关系并未组成，无法保证 props 的正确传递，仅能修改当前调用 setData 的组件实例的 data 值**，所以最早的 setData 时机推荐是 attached，其中一个原因就是此时组件与组件之间的树形结构已经组建完毕。

1. 在小程序页面构造阶段会创建两颗组件树（分别位于逻辑层与视图层），两侧的自定义组件节点会通过一个 nodeId 形成绑定，而逻辑层 created 触发时，还没有申请节点 ID 形成绑定，所以逻辑层的 created - setData 虽然能够改变 逻辑层的组件 data，却不能改变 视图层组件的 data，因为此时视图层根本还没有收到创建树的消息，也就没有与之相对应的组件实例。
2. 同样也是页面构造阶段，传递每一个自定义组件的 data 是一个消耗巨大的工作，所以不管是微信还是星河，都是采用传递 组件模版 与 节点 id 的做法来形成两个树的对应关系，视图层的首次 data 的值均由模版中提取，这种设计的性能优势是明显的。。。
3. 由于 2 的设计和安全考虑，视图层是不会执行任何的组件生命周期的。

### 那么 attached 的为什么可以合法调用 setData？

注意，这里不是代表自定义组件进入了视图层或者挂载了真实的 DOM，而是 进入页面节点树，这里的树其实指的是逻辑层的树（VirtualTree）！所以这个声明周期触发的时候，视图层对应的 DOM 一定没有渲染

那么凭什么 attached 就能通过 setData 上视图呢？原因是 attached 之前，已经完成了 节点 Id 的申请，构造页面的消息队列是有序的，绑定 id 的消息会早于 attached 中可能含有的 setData 消息。

实际可以认为 detached 触发时，组件实例并没有被完全释放掉，而是从节点树中删除，并切断了节点与节点之间的关系。如果后续没有其他地方引用该组件实例，实例会被垃圾搜集器释放（GC）。

星河此处目前未完全对齐微信，在 detached 触发时，我们会销毁掉实例上的内外部引用。所以在星河中，如果组件的 detached 已经触发过了，您不应继续通过外部访问它（虽然微信是可以这样做，但存在内存泄漏的隐患）。

所以可以这么认为，我们在使用 Behavior 时，实际上就是编写了一个没有模版的组件，可供其他组件合并，达到逻辑复用的目的。

### 响应式

- 接管 setData：基于 mobx，封装一套 vuex 规范的 store 数据管理系统
  - 多实例、多 module 等等都支持
  - 现在还支持 pinia
- 渲染性能：
  - setData 频次：只在每个 tick 中操作 setData，减少频次
  - setData 大小：只设置变化的数据，模版编译成 render 函数时，记录了之前模版中使用的数据路径，每次 setData 都会 diff，仅将变化的数据进行 setData

```js
// 手动实现每个tick，执行逻辑
// 思路：一个flag标识当次tick是否结束，如果没有结束，则一直压入任务
let setDataQueue = []
let isPending = false
function enqueSetData(data) {
  setDataQueue.push(data)

  // 没有正在处理，则直接执行
  if (!isPending) {
    isPending = true
    setTimout(flushSetDataQueue, 0) // 在下一个tick开始时执行 setData
  }
}
function flushSetDataQueue() {
  const data = setDataQueue.shift() // 获取第一个

  if (data) {
    wx.setData(data, () => {
      flushSetDataQueue() // 递归
    })
  } else {
    isPending = false // 队列已经清空
  }
}
```

## 关于分包配置

下面是微信原生分包数据结构：

```json
{
  "pages": ["pages/index", "pages/logs"],
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/cat", "pages/dog"]
    },
    {
      "root": "packageB", // 分包根目录
      "name": "pack2", // 分包别名，分包预下载时可以使用
      "pages": [
        // 分包页面路径，相对于分包根目录
        "pages/apple",
        "pages/banana"
      ],
      "independent": true // 分包是否是独立分包，独立分包是一种特殊类型的分包，可以独立于主包和其他分包运行。单独进入独立分包可不下载主包
    }
  ]
}
```

- mpx 支持多种分包策略，虽然底层都是转为微信的分包策略，但上层给了业务更多的自由度
- 比如 packages 方式，该方式旨在业务侧可以根据业务模块划分分包，同时支持 npm 包方式；是否分包，取决于是否配置 root

```html
<!-- @file src/app.mpx -->
<script type="application/json">
  {
    "pages": ["./pages/index/index"],
    "packages": ["{npmPackage || relativePathToPackage}/index"]
  }
</script>

<!-- @file src/packages/index.mpx
注意确保页面路径的唯一性 -->
<script type="application/json">
  {
    "pages": ["./pages/other/other", "./pages/other/other2"]
  }
</script>

<!-- 输出如下： -->
{ "pages": [ "pages/index/index", "pages/other/other", "pages/other/other2" ] }
```

如果设置分包的话，则如下：

```html
<!-- @file src/app.mpx -->
<script type="application/json">
  {
    "pages": ["./pages/index/index"],
    "packages": ["{npmPackage || relativePathToPackage}/index?root=test"]
  }
</script>

<!-- @file src/packages/index.mpx (子包的入口文件) -->
<script type="application/json">
  {
    "pages": ["./pages/other/other", "./pages/other/other2"]
  }
</script>

<!-- 输出 -->
{ "pages": [ "pages/index/index" ], "subPackages": [ { "root": "test", "pages": [
"pages/other/other", "pages/other/other2" ] } ] }
```

### 别名路径

微信小程序页面的路径就是项目的目录结构，有时候想多个路径映射到某个路径上，如下：

其实就是将 `@xxx/a/b/c` 这个目录的文件，映射到 `pages/a` 这个路径，最后用户打开的路径就是：`pages/a`，这样就很大程度上扩充了项目结构的自由度。

```js

{
    root: 'test',
    pages: [
        {
        'src':'@xxx/a/b/c',
        'path':'pages/a'
        },
    ]
}
```

## 关于分包预加载

分包预下载，其实就是进入到 A 页面时，去下载 B 分包，从而再后续打开 B 分包页面时，可以更快。

- 对于独立分包，可以预下载主包
- 分包预下载，目前仅支持配置方式使用，暂不支持调用 Api 使用
- 同一个分包中的 A,B 等多个页面享有共同的预下载大小限额 2M，限额会在工具中打包时校验。
- 预下载分包行为在进入某个页面时触发，通过在 app.json 增加 preloadRule 配置来控制。
- 当小程序启动时，预加载配置中指定的页面或组件的代码和资源会被下载。这些资源会被下载到本地的缓存中，以供后续使用。
  - 这里要区别 require.async 分包异步化，是在运行时动态加载模块。

```json
{
  "pages": ["pages/index"],
  "subpackages": [
    {
      "root": "important",
      "pages": ["index"]
    },
    {
      "root": "sub1",
      "pages": ["index"]
    },
    {
      "name": "hello",
      "root": "path/to",
      "pages": ["index"]
    },
    {
      "root": "sub3",
      "pages": ["index"]
    },
    {
      "root": "indep",
      "pages": ["index"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index": {
      "network": "all", // 在指定网络下预下载，可选值为：wifi: 仅wifi下预下载 和 all 所有网络
      "packages": ["important"] // 进入页面后预下载分包的 root 或 name。__APP__ 表示主包。
    },
    "sub1/index": {
      "packages": ["hello", "sub3"]
    },
    "sub3/index": {
      "packages": ["path/to"]
    },
    "indep/index": {
      "packages": ["__APP__"]
    }
  }
}
```

## 分包异步化

相比于分包预加载，是发生在小程序启动时，就下载了相关的资源并缓存到本地。而 `require.async` 则是在运行时，动态的根据需要加载对应模块。

而分包异步化，还分两种类型：

- 组件分包异步化，配合使用 componentPlaceholder
- js 分包异步化
- mpx 又针对 wx 平台，增加了 store 的分包异步化，如下：

在 Mpx 中如果想要跨分包异步引用 Store 代码，分为三个步骤

1. 页面或父组件在 created 钩子加载异步 Store
2. 异步 Store 加载完成后再渲染使用异步 Store 的组件
3. 子组件在框架内部生命周期 BEFORECREATE 钩子中动态注入 computed 和 methods

```html
<!--pages/index/index.mpx-->
<template>
  <store-list wx:if="{{showStoreList}}"></store-list>
</template>

<script>
  import { createPage } from '@mpxjs/core'
  createPage({
    data: {
      showStoreList: false,
    },
    created() {
      require.async('../subpackages/sub2/store?root=sub2').then((store) => {
        getApp().asyncStore.sub2 = store.default
        // 当异步 Store 加载完成后再渲染使用异步 Store 的组件
        this.showStoreList = true
      })
    },
  })
</script>

<!-- 子组件:store-list -->
<script>
  import { createComponent, BEFORECREATE } from '@mpxjs/core'
  createComponent({
    // 在 BEFORECREATE 钩子中动态注入 options
    [BEFORECREATE]() {
      // 获取异步 Store实例
      const subStore = getApp().asyncStore.sub2
      // computed 中 mapState、mapGetters 替换为 mapStateToInstance、mapGettersToInstance，最后一个参数必须传当前 component 实例 this
      subStore.mapStateToInstance(['pagename'], this)
      subStore.mapGettersToInstance(['pageDataGetter'], this)
      // methods 中 mapActions、mapMutations 替换为 mapMutationsToInstance、mapActionsToInstance，最后一个参数必须传当前 component 实例 this
      subStore.mapMutationsToInstance(['updatePageData'], this)
      subStore.mapActionsToInstance(['updatePageName'], this)
    },
  })
</script>
```

**注意：**这里使用了新的钩子，同时还需要 提前下载 store，这里就是为了在实例创建早期，执行响应式数据绑定时，能拿到 store 数据，从而实现数据响应式监听。

### require.async 原理

```js
function requireAsync(modulePath, successCallback, errorCallback, timeout) {
  var script = document.createElement('script')
  script.src = modulePath

  var timer = setTimeout(function () {
    // 超时处理逻辑
    errorCallback(new Error('Module loading timed out!'))
  }, timeout)

  script.onload = function () {
    clearTimeout(timer)
    successCallback()
  }

  script.onerror = function () {
    clearTimeout(timer)
    errorCallback(new Error('Failed to load module!'))
    showErrorMessage('Failed to load module!')
  }

  document.head.appendChild(script)
}

function showErrorMessage(message) {
  // 在页面上显示错误提示
  var errorElement = document.createElement('div')
  errorElement.innerText = message
  document.body.appendChild(errorElement)
}

// 示例用法
requireAsync(
  'path/to/module.js',
  function () {
    console.log('Module loaded!')
  },
  function (error) {
    console.error(error.message)
  },
  5000 // 设置超时时间为5秒
)
```

实际使用中，可能还需要考虑模块的依赖关系管理、加载顺序控制等方面的问题。

## 按需注入和用时注入

在小程序启动的过程中，除了代码包下载以外，代码注入也是一个主要的耗时环节。注入代码量的大小与内存占用与注入耗时正相关。

利用「按需注入」和「用时注入」的特性，可以优化代码注入环节的耗时和内存占用。

### 按需注入

通常情况下，在小程序启动时，启动页面依赖的所有代码包（主包、分包、插件包、扩展库等）的所有 JS 代码会全部合并注入，包括其他未访问的页面以及未用到自定义组件，同时所有页面和自定义组件的 JS 代码会被立刻执行。这造成很多没有使用的代码在小程序运行环境中注入执行，影响注入耗时和内存占用。

启用按需注入后，页面 JSON 配置中定义的所有组件和 app.json 中 usingComponents 配置的全局自定义组件，都会被视为页面的依赖并进行注入和加载。

```js
{
  "lazyCodeLoading": "requiredComponents"
}

```

### 用时注入

到真正用时才注入，在已经指定 lazyCodeLoading 为 requiredComponents 的情况下，为自定义组件配置 **占位组件**，组件就会自动被视为用时注入组件，等到占位组件渲染完，就开始注入，注入结束也就意味着占位组件已被完全替换。

## 输出 h5 项目

- 默认输出一个单页应用，如果想分模块输出，则可以配置
  - [编译构建](https://mpxjs.cn/api/compile.html#async)
