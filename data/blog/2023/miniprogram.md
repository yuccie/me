---
title: '小程序'
date: Tue May 09 2023 22:06:10 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['小程序', '从入门到放弃']
draft: false
summary: '重读小程序'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/miniprogram
---

## 背景

小程序，一种不用安装即可使用的应用程序

其实底层原理就是，就是通过将 小程序语言 通过编译器，编译成 js 和 css，然后注入到客户端提供的容器里执行而已。

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

## 3、架构篇-事件系统设计

## 3、逻辑层语法及生命周期设计

## 3、架构篇-小程序路由设计

## 3、基础库-底层基础库解包

## 3、基础库-逻辑层基础库 WAService 结构分析

## 3、拓展篇-小程序第三方库框架设计原理

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路

## 3、架构篇-wxml 标签语言的设计思路
