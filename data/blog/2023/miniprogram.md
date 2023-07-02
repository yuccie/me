---
title: '小程序整体轮廓'
date: Tue May 09 2023 22:06:10 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['小程序', '掘金小册']
draft: false
summary: '重读小程序'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/miniprogram
---

# 其他小程序

- 知识体系的重要性，

## 小程序流程

1. 通过搜索或者链接打开小程序
   1. 链接或者搜索里本身里有打开小程序的方式
   2. 在内部跳转，一般是通过伪协议跳转
2. 首先客户端会初始化，小程序的容器，包含 jsCore，webview 引擎，并加载小程序运行时文件、业务代码代码入口文件等
   1. 实现加载再初始化呢，还是反过来？
   2. 开始加载初始化文件，都是哪些文件呢？
      1. 加载基础库逻辑层运行时文件，小程序业务的入口文件等
3. 加载完，开始注册运行时以及业务代码模块、事件等，注册完告知端，小程序运行时代码已经就位
4. 端执行一系列逻辑后，会再告诉逻辑层，现在可以开始初始化小程序了，然后逻辑层监听到事件，就开始执行前面注册的模块
   1. 这里就是实例化小程序，createApp，然后执行 onLaunch 等生命周期
5. 然后执行到一定阶段后，就需要告知端，接下来要开始渲染页面了，请端给我初始化 webview 了
6. 端收到信号后，从缓存里取 webview 或者新建，并传递启动参数
   1. 在端初始化时，其实已经缓存了 webview 等，
   2. 其实就是打开一个缓存的 webview，并把启动的入参传过去
7. webview 打开后，会加载视图层的运行时模块，并注册对应的模块或者事件
   1. 这里包含基础库，还包含业务入口的视图层文件
8. 因为刚开始打开只是启动页面，同时模块也只是入口文件，然后逻辑层就开始递归加载子组件并处理路由
   1. 这里为何又是逻辑层呢？
9. 当端将所有子组件的资源都处理就位后，就告知视图层，开始渲染页面
   1. 所有？那也就是说，页面很大时，页面加载慢那是肯定的，因为子组件先渲染？
10. 视图层又告知逻辑层渲染开始
    1. 逻辑层就开始初始化页面数据、事件、生命周期等等
    2. 然后开始利用渲染函数构建虚拟 dom，并生成一系列的任务快照
    3. 然后将这些任务快照 emit 到视图层
    4. 最后触发 onLoad，onShow 等生命周期，此时逻辑都还在逻辑层，因此肯定是拿不到 dom 元素的
11. 然后视图层接收到信号，开始遍历任务快照
    1. 若有问题则渲染失败
    2. 若没有问题，视图层则开始创建虚拟 dom、并生成真正的 dom 树
12. 最后挂载在 el 元素上。

## 页面初始化

1. 端初始化，包含 js 引擎和 webview 容器

## 页面重载 reload 流程

1. 点击端提供的 reload 按钮，重新触发页面加载
2. 重新加载 page-frame 视图层模版，加载完暴露 webviewReady 事件，同时会向逻辑层发送 initReadyForPrerender 事件， 此时会触发 webview 拦截，相当于端拦截的
3. 端拦截后，告知逻辑层现在执行 reload 事件，逻辑层的拦截堆栈是：视图层发送 initReadyForPrerender 事件后，会将视图层的 webviewId 带过来，此时为 1，同时触发\_\_appRouteTriggerFn、onAppRouteTrigger、addView、TreeManager.create(viewId)、OperationFlow 等一系列逻辑，然后里面涉及到的 setDataListener 都会绑定到这个 webviewId 上
4. 然后 reload 事件具体逻辑，会找到当前页面堆栈里 webviewId 与 reload 传过来一致的页面，并执行其 unload、destroy 事件，同时删除之前的内存节点信息：`delete pageInfoMap[node.webViewId];`
5.

# 背景

小程序，一种不用安装即可使用的应用程序

其实底层原理就是，就是通过将 小程序语言 通过编译器，编译成 js 和 css，然后注入到客户端提供的容器里执行而已。

**总结：该篇文章是学习掘金里一个小册的结果，整体感觉，有收获但不是很多。推荐新手阅读，想深入研究小程序底层的，不建议。**

## 1、小程序的诞生

在继客户端、hybrid H5、公众/服务号等之后，手机端可以承载用户的方式就来到了小程序，而小程序的优势

- 不需要单独下载 App
- 人人都有微信，搜索即用
- 体验比 Hybrid H5 流畅
- 更丰富的功能
- 等等

[小程序技术发展史（官方）](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0004a2ef9b8f803b0086831c75140a)

## 2、双线程模型

- 小程序的双线程架构设计?
- 双线程对比单线程的优势在哪里?
- 传统 h5 开发环境有什么弊端?
- Native 层在双线程架构中起到怎样的作用?
- 如何解决传统 h5 的安全管控问题?

小程序的架构模型有别与传统 web 单线程架构，小程序为双线程架构。

微信小程序的渲染层与逻辑层分别由两个线程管理，一个逻辑层可以对应多个视图层。

- 渲染层的界面使用 webview 进行渲染，而 webview 其实就是浏览器而已，由客户端提供。
- 逻辑层采用 JSCore 运行 JavaScript 代码，可以理解为底层有一个大的 js 执行环境，一般是 V8 或者 JSCore，亦或者其他 js 引擎的魔改版。

iframe 为页面中嵌入页面的方式，有别于 webview 嵌入原生应用的概念，这里需要注意一下。

WebView 是一种在应用程序中嵌入网页内容的组件，可以让应用程序显示网页以及处理网页中的事件。它是一种将原生应用程序和 Web 技术结合起来的方法，可以实现更加复杂和灵活的功能。WebView 可以用来显示 HTML、CSS 和 JavaScript 编写的网页，也可以用来加载本地的 HTML 文件。在 Android 中，WebView 是一个由 Android 内置的 WebKit 引擎实现的组件。在 iOS 中，WebView 是一个由 WebKit 引擎实现的组件。

- 那么为什么要做多个 webview 呢？
  - 为了更加接近原生应用 APP 的用户体验，在小程序中，可以侧滑看到两个页面，这就是多 webview 带来的好处。相比 SPA 项目，体验更好。
- 执行效率
  - 相比传统的单线程，渲染和 js 执行都在一个 webview 里执行，加载资源、执行、渲染都会互相抢占资源，因此效率就低；而双线程就很明显，执行效率更高，系统 Crash 的概率更低。
  - 客户端直接注入 sdk、基础库等等，相比页面自己加载效率更高
- 更强大的能力
  - 微信客户端提供强大的能力支持，比如缓存、请求转发、Native 组件渲染等
- 更加安全
  - 使用 web 开发时，利用 JavaScript 脚本随意地跳转网页或者改变界面上的任意 DOM。
  - 封禁这些能力肯定不太现实，因此直接创造一个 js 沙箱，里面不提供任何浏览器相关的接口能力
  - webworker 可以实现 js 沙箱，但不好去管理所有的小程序页面。

> 沙箱：JavaScript 沙箱是一种安全机制，用于限制 JavaScript 代码的访问权限，以防止恶意代码从浏览器中窃取或修改敏感信息。
> 其实底层，就是一个自执行函数，函数内部能访问到的就是传进去的变量，而像 document 等就没有传进去，而且全局的 js 执行环境也没有这些变量。

## 3、架构篇-wxml 标签语言的设计思路

- WXML 语法解读?
- WXML 语法设计思路?
- WXSS 语法概念?

网页编程一般采用的是 HTML + CSS + JS 的组合，其中 HTML 是用来描述当前这个页面的结构，CSS 用来描述页面的样子，JS 通常是用来处理这个页面和用户的交互。

### wxml

前面我们知道，微信为了安全、更强大能力、html 标签众多等，抛弃传统浏览器的那套编写代码方式，转而自研一套，但这一套依然是运行在浏览器里，可以理解为：用满足浏览器的语法，创建一套新的代码组织体系。

在小程序中，wxml 就想当于之前的 html

```html
<view class="bootstrap-wrapper" style="{{wrapperStyle}}"
  ><view class="loading-wrapper"></view
></view>
```

上面的 view 标签，其实就是一个组件，只不过是内置，也就是官方实现的。而负责管理和组织这些组件的是 Exparser 系统，Exparser 框架会将上述结构转换为下面这个样子

```html
<wx-view class="bootstrap-wrapper" style="{{wrapperStyle}}"
  ><wx-view class="loading-wrapper"></wx-view
></wx-view>
```

之所以这样，是因为 wxml 的底层技术就是模拟 WebComponents 实现的，而 [WebComponents 的规范](https://www.webcomponents.org/introduction) 中，自定义元素的名称中必须包含连接词。

但微信并没有直接使用 WebComponents，而是参考并自己实现了一套。

Exparser 是微信小程序的组件组织框架，内置在小程序基础库中，为小程序的各种组件提供基础的支持。小程序内的所有组件，包括内置组件和自定义组件，都由 Exparser 组织管理。

Exparser 的组件模型与 WebComponents 标准中的 Shadow DOM 高度相似。Exparser 会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的 Shadow DOM 实现

### wxss (WeiXin Style Sheets)

wxss 是一套样式语言，用于描述 WXML 的组件样式，WXSS 虽然具有 CSS 大部分的特性，但是小程序在 WXSS 也做了一些扩充和修改，比如很明显看到的 rpx

WXSS 在底层支持新的尺寸单位 rpx (responsive pixel)，让我们可以免去换算的烦恼，只要交给小程序底层来换算即可，由于换算采用的浮点数运算，所以运算结果会和预期结果有一点点偏差。

- wxss 支持几乎所有的 css 语法
- WXSS 是为了配套渲染 WXML 的，平台也抛去了移动端浏览器的兼容问题

## 4、架构篇-渲染层文件结构分析及 webview 结构设计

- 寻找渲染线程文件?
- webview 容器设计?
- 渲染层文件解析?

前面说的渲染层、逻辑层，下面我们只管的看下：

- 微信开发者工具的结构：微信开发者工具 -> 调试 -> 调试微信开发者工具，打开的页面和浏览器的 devtool 可以说一模一样了。
- 渲染层：在上一步打开的 devtools 里 -> Elements -> webview 标签就是渲染层
  - 在 console 里：document.getElementsByTagName('webview') 查看所有 webview
  - 这些 webview 里主要是：业务视图层的 webview，业务逻辑层 webview，调试器的 webview、编辑区的 webview
    - 业务视图层的 webview，其实就是小程序的一个个页面，
    - 打开视图层的 devtools：document.getElementsByTagName('webview')[0].showDevTools(true, null)，这个 devtools 就是小程序页面了
    - 看到的标签都是 wx-xxx 了，正是上一节我们讲到的 Exparser 编译后的样子
    - 但仔细看，整个页面的结构，依然是 html
  - 原来 ide 界面上，不同的模块都是不同的 webview 渲染出来的呢。

## 5、架构篇-快速渲染设计原理之 PageFrame

- 小程序如何做到快速打开新页面?
- 小程序快速渲染流程原理?
- webview-pageFrame 设计原理?
  - 模版 + 插槽替换

在我们寻找渲染层的时候，找到了个奇怪的 webview，路径里有 pageframe 字样，这个 webview 其实就是一个用来新渲染 webview 的模板。

也就是说，微信会缓存一个页面模版，后续新打开页面时，直接打开，提高渲染效率。 - 这个模版里直接注入了一些基本的配置，比如 WAWebview.js、deviceinfo.js 等 - 同时还通过 `<!-- wxappcode -->` 这样的占位符，后续直接注入相关代码。 - eval(setCssToHead....)。

总之，页面切换时会直接使用缓存好的模版，然后直接加载相应编译好后的 js 和 css 资源

编译器 -> wxml -> js 和 css，此时还是渲染函数 -> 注入到模版后，执行一系列操作，渲染函数 -> 虚拟 dom -> Exparser 的组件系统 -> document.body 挂载在页面上。

## 6、架构篇-小程序组件系统 Exparser 设计原理

- WebComponent 原理？
- Custom Element 原理？
- ShadowDOM 思想？
- Exparser 原理？

### WebComponent

WebComponent 汉语直译过来第一感觉是 web 组件的意思，但是它只是一套规则、一套 API。

你可以通过这些 API 创建自定义的新的组件，并且组件是可以重复使用的，封装好的组件可以在网页和 Web 应用程序中进行使用。

我们常用 React、vue 写组件，其实 WebComponent 就是原生 js 方式的写组件方式。

HTML（HyperText Markup Language）超文本标记语言

创建一个自定义组件：my-component，如下

```html
<template id="my-component-template">
  <style>
    /* 样式代码 */
  </style>
  <div>
    <p>hello webcomponents</p>
  </div>
</template>

<script>
  class MyComponent extends HTMLElement {
    constructor() {
      super()
      const template = document.getElementById('my-component-template')
      const templateContent = template.content
      const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(
        templateContent.cloneNode(true)
      )
    }
  }
  customElements.define('my-component', MyComponent)
</script>
```

使用：

```html
<my-component></my-component>
```

- 组件内，html、css、js 都有，是不是很像 vue 的组件
- 标签内的节点进行操作必须通过 templateElem.content 操作，因为 templateElem.content 他不正常，而是一个 DocumentFragment 节点，里面才是真正的结构
- 支持 slot
- 支持 props 等
- WebComponent 允许内部代码隐藏起来，这叫做 Shadow DOM，也叫影子树
  - 影子树的根节点，我们称之为 shadow root 或影子根。
  - 影子树的父节点，其实也就是宿主，叫 shadow host
  - 但有些元素不能作为宿主，比如`img、button、input、textarea、select、radio、checkbox，video`
    - 其实他们本身就是 shadow dom，比如 video 里的播放、暂停都是哪来的
    - 如何查看他们呢：打开控制台 -> setting -> 勾选：Show user agent shadow DOM 即可，展开 video 标签，即可看到：#shadow-root
    - 因为他们本身已有有主了，所以不能再作为别人的主。
- Shadow DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中

说到事件，就不得不提一下事件冒泡。我们知道自定义组件树是一颗隐藏起来的树，但是内部的事件冒泡是可以一层层冒上去的，

### Exparser 框架原理

Exparser 是微信小程序的组件组织框架，内置在小程序基础库中，为小程序提供各种各样的组件支撑。内置组件和自定义组件都有 Exparser 组织管理。

Exparser 的组件模型与 WebComponents 标准中的 Shadow DOM 高度相似。Exparser 会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的 Shadow DOM 实现。Exparser 的主要特点包括以下几点：

- 基于 Shadow DOM 模型：模型上与 WebComponents 的 Shadow DOM 高度相似，但不依赖浏览器的原生支持，也没有其他依赖库；实现时，还针对性地增加了其他 API 以支持小程序组件编程。
- 可在纯 JS 环境中运行：这意味着逻辑层也具有一定的组件树组织能力。
- 高效轻量：性能表现好，在组件实例极多的环境下表现尤其优异，同时代码尺寸也较小。

在理解了 WebComponent 的概念之后，再理解 Exparser 就会变得简单。就有了一些可以与之对照的一些概念，比如 Shadow DOM 模型，属性、事件绑定、slot 等等。并且拥有了与 WebComponent 一样的优秀表现。

在 Exparser 的组件模型中，组件的节点树称为 Shadow Tree，即组件内部的实现；最终拼接成的页面节点树被称为 Composed Tree，即将页面所有组件节点树合成之后的树

小程序中，所有节点树相关的操作都依赖于 Exparser，包括 WXML 到页面最终节点树的构建、createSelectorQuery 调用和自定义组件特性等。

### 组件间通信

不同组件实例间的通信有 WXML 属性值传递、事件系统、selectComponent 和 relations 等方式。其中，WXML 属性值传递是从父组件向子组件的基本通信方式，而事件系统是从子组件向父组件的基本通信方式。

Exparser 的事件系统完全模仿 Shadow DOM 的事件系统。在通常的理解中，事件可以分为冒泡事件和非冒泡事件，但在 Shadow DOM 体系中，冒泡事件还可以划分为在 Shadow Tree 上冒泡的事件和在 Composed Tree 上冒泡的事件。如果在 Shadow Tree 上冒泡，则冒泡只会经过这个组件 Shadow Tree 上的节点，这样可以有效控制事件冒泡经过的范围。

```html
<!-- button组件 -->
<label><slot></slot></label>
<input />
```

```html
<!-- 使用button组件 -->
<view>
  <input-with-label>
    <button />
  </input-with-label>
</view>
```

用上面的例子来说，当在 button 上触发一个事件时：

- 如果事件是非冒泡的，那只能在 button 上监听到事件。
- 如果事件是在 Shadow Tree 上冒泡的，那 button 、 input-with-label 、view 可以依次监听到事件。
  - 因此如果在 Shaodw Tree 上，相当于将其打包算一个
- 如果事件是在 Composed Tree 上冒泡的，那 button 、 slot 、label 、 input-with-label 、 view 可以依次监听到事件。

在自定义组件中使用 triggerEvent 触发事件时，可以指定事件的 bubbles、composed 和 capturePhase 属性，用于标注事件的冒泡性质。

```js
this.triggerEvent(
  'custom',
  {},
  {
    bubbles: true, // 默认false，不冒泡
    composed: true, // 默认false，事件只在shadow dom内部消化，若true，则可以穿透到外层
    capturePhase: false, // capturePhase属性表示事件是否在捕获阶段触发，默认为false，即在冒泡阶段触发。
    // 如果设置为true，则事件会在捕获阶段先被触发，然后再冒泡到当前组件。注意，如果设置了capturePhase为true，则bubbles属性必须为true才能生效。
  }
)
```

小程序基础库自身也会通过这套事件系统提供一些用户事件，如 tap、touchstart 和 form 组件的 submit 等。其中，tap 等用户触摸引发的事件是在 Composed Tree 上的冒泡事件，其他事件大多是非冒泡事件。

## 7、架构篇-WXSS 编译原理及动态适配设计

- WXSS 语法解析
- WXSS 编译原理
- WXSS 动态适配设计

WXSS (WeiXin Style Sheets)是一套样式语言，用于描述 WXML 的组件样式。 WXSS 用来决定 WXML 的组件应该怎么显示。

与 CSS 相比，WXSS 扩展的特性有：尺寸单位和样式导入两个方面，我们最为熟悉的就是尺寸单位 rpx。

### rpx

rpx （responsive pixel）直译为：响应像素。

曾经我们为了做一些响应式的布局，引入 REM，VW 等，或者工程化之后使用 px2remvw，而小程序的适配方案则为 rpx

那 wxss 整个生效的过程如何？

1. wxss 需要经过 wcsc 编译才可以被 webview 所识别
   1. 在开发者工具控制台，选择 top ，输入 help() 打开帮助选项卡
   2. 输入第八条命令：openVendor()，此时会打开一个文件目录
   3. 找到里面的 wcsc 脚本，拷贝到一个目录里，目前不在这个目录里，可以在 ide 的包文件里搜索 wcsc
   4. 比如这样 `./wcsc -js index.wxss >> wxss.js` 将一个 wxss 文件转换为 js 文件，
   5. index.wxss 文件会先通过 WCSC 可执行程序文件编译成 js 文件。并不是直接编译成 css 文件。
2. 生成的 js 文件，通过文件加载注入到页面中，并通过 eval 函数执行里面的逻辑
   1. 首先会获取设备信息 checkDeviceWidth
   2. 然后通过 setCssToHead 注入到页面里，在函数内部会将之前 rpx 单位的样式处理成 css
      1. 然后编译器还会将之前 rpx 单位的标注格式化成其他的格式
   3. 最后通过在 head 里加入 style 标签，实现样式的插入

```css
.test {
  width: 10rpx;
  height: 20vh;
}
```

通过编译器编译后，生成的 js 文件：

```js
var BASE_DEVICE_WIDTH = 750
var isIOS = navigator.userAgent.match('iPhone')
var deviceWidth = window.screen.width || 375
var deviceDPR = window.devicePixelRatio || 2
var checkDeviceWidth =
  window.__checkDeviceWidth__ ||
  function () {
    var newDeviceWidth = window.screen.width || 375
    var newDeviceDPR = window.devicePixelRatio || 2
    var newDeviceHeight = window.screen.height || 375
    if (window.screen.orientation && /^landscape/.test(window.screen.orientation.type || ''))
      newDeviceWidth = newDeviceHeight
    if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
      deviceWidth = newDeviceWidth
      deviceDPR = newDeviceDPR
    }
  }
checkDeviceWidth()
var eps = 1e-4
var transformRPX =
  window.__transformRpx__ ||
  function (number, newDeviceWidth) {
    if (number === 0) return 0
    number = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth)
    number = Math.floor(number + eps)
    if (number === 0) {
      if (deviceDPR === 1 || !isIOS) {
        return 1
      } else {
        return 0.5
      }
    }
    return number
  }
var setCssToHead = function (file, _xcInvalid, info) {
  var Ca = {}
  var css_id
  var info = info || {}

  function makeup(file, opt) {
    var _n = typeof file === 'number'
    if (_n && Ca.hasOwnProperty(file)) return ''
    if (_n) Ca[file] = 1
    var ex = _n ? _C[file] : file
    var res = ''
    for (var i = ex.length - 1; i >= 0; i--) {
      var content = ex[i]
      if (typeof content === 'object') {
        var op = content[0]
        if (op == 0) res = transformRPX(content[1], opt.deviceWidth) + 'px' + res
        else if (op == 1) res = opt.suffix + res
        else if (op == 2) res = makeup(content[1], opt) + res
      } else res = content + res
    }
    return res
  }
  var rewritor = function (suffix, opt, style) {
    opt = opt || {}
    suffix = suffix || ''
    opt.suffix = suffix
    if (opt.allowIllegalSelector != undefined && _xcInvalid != undefined) {
      if (opt.allowIllegalSelector) console.warn('For developer:' + _xcInvalid)
      else {
        console.error(_xcInvalid + 'This wxss file is ignored.')
        return
      }
    }
    Ca = {}
    css = makeup(file, opt)
    if (!style) {
      var head = document.head || document.getElementsByTagName('head')[0]
      window.__rpxRecalculatingFuncs__ = window.__rpxRecalculatingFuncs__ || []
      style = document.createElement('style')
      style.type = 'text/css'
      style.setAttribute('wxss:path', info.path)
      head.appendChild(style)
      window.__rpxRecalculatingFuncs__.push(function (size) {
        opt.deviceWidth = size.width
        rewritor(suffix, opt, style)
      })
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      if (style.childNodes.length == 0) style.appendChild(document.createTextNode(css))
      else style.childNodes[0].nodeValue = css
    }
  }
  return rewritor
}
// 发现把rpx单位的内容，格式化成了 width: ", [0, 10], " 这样的数据格式
setCssToHead(['.', [1], 'test { width: ', [0, 10], '; height: 20vh; }\n'])(
  typeof __wxAppSuffixCode__ == 'undefined' ? undefined : __wxAppSuffixCode__
)
```

## 8、架构篇-VirtualDOM 渲染流程

与上面的过程一样，找到 wcc ，然后可以执行 `./wcc --help` 查看使用说明

```bash
./wcc -help

# Wechat WXML Compiler, version v0.5vv_20200413_syb_scopedata
# Usage: ./wcc [-d] [-o OUTPUT] [-xc XComponentDefine] [-om XComponentDefine] [-cb [callback.js...]] [-ll XCPath] <FILES... | -s <SINGLE_FILE>
#   Options:
#   -d: output code for debug
#   -o: output destination (default stdout)
#  -xc: output simplified code for custom component
#  -cc: output compelete code for custom component
#   -s: read from stdin
#  -ds: insert debug wxs info
#  -cb: add life cycle callback
#  -ll: compile in lazy load mode
```

然后构建一个 wxml 文件，然后执行 `./wcc -d test.wxml >> test.js` 得到编译后的文件，结构如下

```js
var $gwxc
var $gaic = {}
$gwx = function (path, global) {
  // xxx
}
```

- 整体代码结构就是一个函数，函数名称为$gwx。它的作用是生成虚拟 dom 树，用于渲染真实节点。
- 里面还有很多其他的函数

```js
function _n(tag) {
  $gwxc++
  // 判断dom节点数量
  if ($gwxc >= 16000) {
    throw "Dom limit exceeded, please check if there's any mistake you've made."
  }
  return { tag: 'wx-' + tag, attr: {}, children: [], n: [], raw: {}, generics: {} }
}
```

而 $gwx 函数是逻辑层的文件，后续会通过 script 注入到页面，同时 $gwx 的参数一，其实就是页面路径，传入页面路径后，就会得到对应页面的渲染函数。

而 $gwx 执行完后，会得到一个 generateFunc，而 generateFunc 执行后，就得到了对应页面的虚拟 dom，一个简单的用来描述页面节点的对象。

之所以返回 generateFunc 函数，其实是因为页面很多数据都是动态的，需要后续传入才可以。

## 9、架构篇-通讯系统设计

小程序底层，其实就是双线程通信，逻辑层与视图层，通过 Native 中转实现通信。

- iOS 是利用了 WKWebView 的提供 messageHandlers 特性，
- 而在安卓则是往 WebView 的 window 对象注入一个原生方法，最终会封装成 WeiXinJSBridge 这样一个兼容层。
- 在微信开发者工具中则是使用了 websocket 进行了封装。

## 10、架构篇-事件系统设计

- web 普通事件原理
- 小程序事件系统源码解读
- 小程序线程通讯协议

什么是事件？

- 事件是视图层到逻辑层的通讯方式。
- 事件可以将用户的行为反馈到逻辑层进行处理。
- 事件可以绑定在组件上，当达到触发事件，就会执行逻辑层中对应的事件处理函数。
- 事件对象可以携带额外信息，如 id, dataset, touches。

❓ 在小程序架构中 WXML 在视图线程进行渲染，.js 文件在逻辑线程进行解析运行。并不在一个线程。他们之间是如何进行绑定的呢？

比较浅显的理解就是类型 vue 一样的双向绑定。

`$gwx -> generateFunc`函数执行后，得到对应的虚拟 dom，然后虚拟 dom 里有 `attr` 属性，这里面有绑定事情的一些信息，那是如何传递到逻辑层的呢？

底层基础库中解析 virtualDOM 函数 applyProperties 会惊醒 attr 属性解析，包含事件解析。其中会 forIn 循环去遍历 virtualDOM 中的 attr 属性。然后执行 e 函数。这里可知 e 函数的参数及为 attr 对象中的属性名称 key。

e 函数中有很多的 if，是用来判断特殊的属性名称的，我们绑定的 tap 事件键值对是 bindtap: bindTextTap，key 也就是 bindtap，事件绑定的前缀有很多比如 bind、catch，看到第 10 行左右的 if 中用正则 if (n = e.match(/^(capture-)?(mut-)?(bind|catch):?(.+)$/))判断 attr 中的属性名是否为事件属性。如果是事件属性的话执行 E 函数，并且转换为 exparser 组件系统中的 attr 属性名称 exparser:info-attr-。

可以看到 E 函数中首先通过 addListener 方法进行了事件绑定，这个方法也是封装自我们熟知的 window.addEventListener，只不过 tap 与原生 click 方法之间有一层映射关系。addListener 的事件触发的回调函数中组装了函数的 event 信息值，并且触发了 sendData 方法，方法标记为 SYNC_EVENT_NAME.WX_EVENT，在源码中值为 11。

上面的过程就是事件绑定过程，都在视图层完成。而事件触发的过程如何呢？

小程序的事件都是和 js 原生事件相互转换的，小程序的 tap 事件底层是由 web 的 mouseup 事件转换来的，小程序 tap 事件的触发分为几个过程，首先底层实现是用 web 的 mouseup 事件触发了 tap 事件，底层为 window 绑定捕获阶段的 mouseup 事件。

然后触发 mouseup 事件的原生监听方法，然后执行一系列逻辑，最后触发目标元素的 exparser 事件，通过 exparser.Event.dispatchEvent 方法，执行这个方法就会走 exparser 事件系统的流程。

## 11、架构篇-逻辑层语法及生命周期设计

- .js 语法结构
- 数据在线程之间如何传递
- 小程序生命周期设计

data 是页面第一次渲染使用的初始数据。页面加载的时候，data 将会以 JSON 字符串形式由逻辑层传至渲染层。

- onLoad(Object query) 页面加载时触发，一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
- onShow() 页面显示/切入前台时触发
- onHide() 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
- onReady() 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
- onUnload() 页面卸载时触发。如 wx.redirectTo 或 wx.navigateBack 到其他页面时。

- wx.navigateTo 方式是创建新的 webview，并且展示新的 webview，当前 webview 进入 Hide 状态，这时，并未进行页面卸载。
- wx.redirectTo 以及 wx.navigateBack 是通过更新自身 webview 进行页面转换的，所以当前页面会进行卸载操作，并且重新生成新页面。所以两个页面都会进入完整生命周期序列。

## 12、架构篇-小程序路由设计

- 小程序路由设计
- webview 与路由栈

在渲染层中可以看到这一段代码，具体位置在 generateFuncReady 函数前面 `History.pushState('', '', 'http://127.0.0.1:37434/__pageframe__/pages/index/index');`

首先触发路由的行为是可以从渲染层发出，也可以从逻辑层发出。在渲染层中用户可以通过点击回退按钮，或者回退上一页的手势等机制触发。

在逻辑层中发出的信号有打开新页面 navigateTo、重定向 redirectTo、页面返回 navigateBack 等，开发者通过官网提供的 API 触发。

无论是渲染层用户触发的行为，还是逻辑层 API 触发的行为，这个行为都会被发送到 Native 层，有 Native 层统一控制路由。

下面总结一下在小程序场景中路由变化相对应的栈变化：

- 小程序初始化的时候需要推入首页，新页面入栈。
- 打开新页面对应 navigateTo，新页面入栈
- 页面重定向 redirectTo，当前页面出栈，而后新页面入栈。
- 页面回退 navigateBack，页面一直出栈，到达指定页面停止。
- Tab 切换 switchTab，页面全部出栈，只留下新的 Tab 页面。
- 重新加载 reLaunch，页面全部出栈，只留下新的页面。

最后附带一下官网注意事项：

- navigateTo, redirectTo 只能打开非 tabBar 页面。
- switchTab 只能打开 tabBar 页面。
- reLaunch 可以打开任意页面。
- 页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。
- 调用页面路由带的参数可以在目标页面的 onLoad 中获取。

## 13、基础库-底层基础库解包

1. 打开控制台，选择 top，输入 help()
2. openVendor()
3. 那些文件就是基础库包了，包的格式是.wxvpkg。
4. wxappUnpacker 解包
5. js-beautify 美化

## 14、基础库-逻辑层基础库 WAService 结构分析

- 渲染层基础库源码解析
- Exparser 系统源码解析。

- Foundation 是基础模块。
  - 我们可以从其中看到里面包含了一些 api，有 EventEmitter 事件的发布订阅，配置的 Ready 事件，基础库 Ready 事件，Bridge Ready 事件，env、global 环境变量。
- Report 模块
- Virtual Dom 模块

## 15、基础库-逻辑层基础库 WAService 结构分析

- 逻辑层基础库源码解析
  - AppEngine 模块
    - 提供了 App、Page、Component、Behavior、getApp、getCurrentPages 等框架的基本对外接口
  - Exparser 模块
    - 组件系统提供了框架底层的能力，如实例化组件，数据变化监听，View 层与逻辑层的交互等
  - virtualDOM 模块
    - **virtualDOM**连接着**appServiceEngine**和 exparser

## 16、拓展篇-小程序第三方库框架设计原理

- 小程序框架都有哪些
- 框架之间的原理有什么不同
- 具体实现方式是怎样的

什么是预编译的框架呢？还记得我们讲解 WXSS 的时候，WXSS 的文件会编译成 js 再执行。像这种执行前就进行编译的手段就叫做预编译。

- 这种框架就是预编译框架。wepy、taro 就是这样的框架。
