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

## 运行时增强原理

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
