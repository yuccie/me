---
title: 'js模块系统'
date: Sun May 14 2023 14:47:25 GMT+0800 (中国标准时间)
lastmod: '2023-05-14'
tags: ['模块系统', 'ES6', 'AMD', 'Commonjs', 'UMD', '静态编译']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/js-modules
---

## commonjs amd、umd、Es6 模块

- commonjs 主要用在服务端，同步加载
- amd，主要用在浏览器，异步加载
- umd，其实就是几个 if else 兼容 common、amd、直接挂载在全局对象上

```js
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // 支持 AMD，使用define定义模块，然后使用 require加载模块
    define(['jquery'], factory)
  } else if (typeof exports === 'object' && typeof module === 'object') {
    // 支持 CommonJS
    module.exports = factory(require('jquery'))
  } else {
    // 全局变量
    root.MyModule = factory(root.jQuery)
  }
})(typeof window !== 'undefined' ? window : this, function ($) {
  // 模块代码
  var MyModule = {
    // ...
  }
  return MyModule
})
```

在这个示例中，我们定义了一个立即执行函数，该函数接受两个参数：

- root: 一个表示全局对象的参数，在浏览器中为 window 对象，在 Node.js 中为 global 对象。
- factory: 一个表示模块工厂函数的参数，用于生成模块的实例。

### 静态加载与运行时加载

- 静态加载：ES6

  - 在 ES6 的模块中，一般都是把 import xxx 放在顶部，意味着这些语句的位置和数量在编译时就确定好了，不受到程序运行时的影响
  - 因此既然不受影响，那编译时就可以将这些模块打包到一个文件中，然后再运行时直接加载这些文件，常见的有 ES6 模块和 Webpack 等打包工具
  - 在静态分析时，编译器会分析模块之间的依赖关系，并生成一个模块依赖图。在运行时，只需要按照模块依赖图的顺序加载和执行模块，就可以保证模块的依赖关系被正确解析。
  - ES6 模块中的 import 和 export 语句必须出现在模块的顶层作用域中，不能嵌套在其他语句中。
    - 这是因为在**静态分析模块依赖关系时，编译器需要确定模块的导入和导出情况**，如果 import 和 export 语句嵌套在其他语句中，就无法确定模块的依赖关系。

- 运行时加载：commonJs、amd

  - 在 CommonJS 中，模块的依赖关系是通过 require() 函数实现的，即在模块内部使用 require() 函数引入其他模块；而在 AMD 中，模块的依赖关系是在 define() 函数中通过依赖列表声明的。
  - 在 CommonJS 中，模块的导入和导出是通过 require() 和 module.exports 对象实现的。当一个模块被引入时，Node.js 会根据路径从磁盘读取该模块的代码，并在当前上下文中执行该模块的代码。在执行时，require() 函数会返回导出对象的引用，然后通过该引用来访问模块的导出内容。由于模块的加载和解析是在运行时进行的，因此无法在编译时静态分析模块的依赖关系。
  - 在 AMD 中，模块的导入和导出是通过 define() 和 require() 函数实现的。在定义一个模块时，需要使用 define() 函数来指定依赖列表和导出内容。而在引入一个模块时，需要使用 require() 函数来指定依赖列表和回调函数，在回调函数中访问模块的导出内容。由于依赖列表和导出内容是在运行时动态生成的，因此无法在编译时静态分析模块的依赖关系。

  总之，CommonJS 和 AMD 之所以不能使用静态加载，是因为**它们的模块定义和依赖关系是在运行时动态生成**的，而不是在编译时静态分析的。如果需要使用静态加载，可以考虑使用 ES6 模块或类似的静态加载方案。

  ### 优缺点

  - 运行时加载是在代码运行时根据需要动态加载模块。当需要使用某个模块时，程序会从磁盘或网络上加载该模块，并在当前上下文中执行该模块的代码。这种方式的优点是灵活性强，可以根据实际情况动态加载模块，但是加载速度较慢，需要等待模块加载完成后才能执行后续代码。
    - 常见的运行时加载方式包括 CommonJS 和 AMD 等模块化方案。
  - 如果模块的依赖关系比较稳定，可以选择静态加载方式，从而提高应用的性能；如果模块的依赖关系比较复杂，或者需要动态加载模块，可以选择运行时加载方式，从而提高应用的灵活性。
  - 优化性能：由于模块的依赖关系已经在编译时确定，因此可以采用一些优化策略来提高应用的性能。例如，可以将所有的模块打包到一个文件中，减少网络请求次数；还可以使用 Tree Shaking 技术，去除没有被使用的代码，减少文件大小。

## SystemJs

SystemJS 是一个在浏览器中实现 ES6 模块加载和动态加载的库。

它支持加载 CommonJS、AMD、UMD 和 ES6 模块，并提供了一些便捷的 API 来加载和管理模块。

SystemJS 的原理可以简单概括为以下几个步骤：

1. 解析模块名：当用户使用 SystemJS 加载一个模块时，SystemJS 首先需要解析模块名。它会根据模块名来确定模块的类型和位置，并将其转换为标准的 URL 地址。
2. 加载模块：SystemJS 会通过 XMLHttpRequest 对象加载模块，并将其转换为 JavaScript 代码。在加载模块时，SystemJS 会检查模块类型，并根据不同的类型采用不同的加载方式。
   1. 例如，对于 ES6 模块，SystemJS 会将其转换为 System.register 格式的模块。
   2.
3. 解析依赖关系：当模块加载完成后，SystemJS 会解析模块内部的依赖关系，并将依赖关系转换为标准的 URL 地址。然后，它会递归加载和解析所有的依赖模块，并按照依赖关系的顺序对它们进行初始化。
4. 初始化模块：当所有的依赖模块都加载和解析完成后，SystemJS 会初始化当前模块。在初始化模块时，SystemJS 会执行模块代码，并将模块的导出内容保存到一个模块实例对象中。然后，它会将模块实例对象注册到 SystemJS 的模块注册表中，以便其他模块可以使用它。
5. 动态加载模块：SystemJS 还支持动态加载模块。当用户需要动态加载一个模块时，可以使用 SystemJS 的 System.import() 方法来加载和初始化模块。在加载和初始化模块时，SystemJS 会执行和上面类似的步骤，以确保模块能够正确地加载和初始化。

总之，SystemJS 的原理是通过解析模块名、加载模块、解析依赖关系、初始化模块和动态加载模块等步骤来实现 ES6 模块加载和动态加载的功能。SystemJS 提供了一些便捷的 API 来加载和管理模块，并且支持多种模块格式，可以在浏览器中轻松实现模块化开发。

## single-spa

single-spa 是一种前端微服务架构，底层使用了 systemjs 作为其模块加载器。它的主要思想是将应用程序拆分成多个小型的子应用，并且每个子应用都可以独立开发、独立部署、独立运行，从而实现应用程序的模块化、可重用性和可扩展性。single-spa 的运行原理主要包括以下几个方面：

- 应用注册：在 single-spa 中，每个子应用都需要先进行注册，将其名称、路由、启动函数等信息注册到 single-spa 中。这样，当用户访问不同的路由时，single-spa 就可以根据路由信息动态地加载和卸载相应的子应用。
- 路由匹配：当用户访问不同的路由时，single-spa 会根据当前路由信息进行匹配，确定要加载哪个子应用。路由匹配过程包括路由解析、路由匹配、路由加载等多个阶段，通过使用 single-spa 提供的路由配置和路由函数，可以很方便地实现路由匹配功能。
- 应用加载：当确定要加载哪个子应用时，single-spa 会根据子应用的配置信息，使用异步加载技术（例如 SystemJS 或 Webpack）动态地加载子应用的 JavaScript 代码。在加载完成后，single-spa 会调用子应用的启动函数，并将其挂载到当前页面中。
- 应用卸载：当用户切换到其他路由或关闭页面时，single-spa 会自动卸载当前路由下的子应用。卸载过程包括调用子应用的卸载函数、移除子应用的 DOM 元素等操作，以确保页面的干净卸载。

总之，single-spa 的运行原理主要包括应用注册、路由匹配、应用加载和应用卸载等多个阶段。通过使用 single-spa 提供的 API 和工具，可以很方便地实现前端微服务架构，提高应用程序的可重用性、可扩展性和可维护性。

### 样式隔离

在 single-spa 中，每个子应用都是独立的 JavaScript 代码，因此子应用之间的样式可能会产生冲突。为了解决这个问题，single-spa 提供了样式隔离的机制，可以确保每个子应用的样式只作用于当前子应用的 DOM 元素，不会影响其他子应用的样式。

单独处理样式通常需要以下几个步骤：

- 使用 CSS Modules 或 CSS-in-JS 等技术：这些技术可以将 CSS 样式表中的类名进行编译，生成唯一的类名，并将其与 DOM 元素关联起来。这样，即使子应用之间使用相同的类名，也不会产生冲突，因为每个子应用使用的类名都是唯一的。
- 将样式表添加到 DOM 中：当子应用被加载时，需要将其对应的样式表添加到当前页面的 DOM 中。可以通过使用单独的 style 元素、CSS Modules 或 CSS-in-JS 等技术来实现。
- 将样式表从 DOM 中移除：当子应用被卸载时，需要将其对应的样式表从当前页面的 DOM 中移除。这样可以避免样式表产生垃圾，并且确保页面干净卸载。
- 处理全局样式：有些样式可能是全局共享的，例如字体、颜色、布局等。可以将这些样式定义为单独的样式表或 CSS-in-JS 组件，并将其添加到所有子应用中。

总之，在 single-spa 中实现样式隔离需要使用一些特殊的技术和工具，例如 CSS Modules、CSS-in-JS 等，并且需要在应用加载和卸载时进行样式表的添加和移除操作。这样可以确保每个子应用的样式只作用于当前子应用的 DOM 元素，不会影响其他子应用的样式。

### CSS Modules 、 CSS-in-JS 、 scoped 、

CSS Modules 和 CSS-in-JS 是两种常见的样式隔离技术，可以将 CSS 样式表中的类名进行编译，生成唯一的类名，并将其与 DOM 元素关联起来。下面是一些使用 CSS Modules 或 CSS-in-JS 的例子：

- CSS Modules：在 React 中使用 CSS Modules，可以通过将样式文件命名为 style.module.css 或 style.module.scss，来启用 CSS Modules 功能。
  - 这样，CSS 样式表中定义的类名会被编译成唯一的类名，例如 style**header\_**3jwHI，并且可以在组件中通过 import styles from './style.module.css' 的方式来使用样式。
- CSS-in-JS：在 React 中使用 CSS-in-JS 技术，可以使用一些第三方库，例如 styled-components、emotion、JSS 等。这些库允许在 JavaScript 代码中直接编写 CSS 样式，例如 const Title = styled.h1，并且可以使用 props、变量等动态计算样式。
- Vue.js 中的 scoped 样式：在 Vue.js 中，可以使用 scoped 特性来实现样式隔离。使用 scoped 特性时，组件中的样式只会作用于当前组件的 DOM 元素，而不会影响其他组件。例如 `<style scoped>/* styles */</style>`。
- Angular 中的组件样式：在 Angular 中，每个组件都有自己的样式表，可以通过在组件的 @Component 装饰器中设置 styleUrls 属性来引入样式表。组件样式表中定义的类名只会作用于当前组件的 DOM 元素，不会影响其他组件。

总之，CSS Modules 和 CSS-in-JS 是两种常见的样式隔离技术，可以通过将 CSS 样式表中的类名进行编译，生成唯一的类名，并将其与 DOM 元素关联起来，从而实现样式隔离的效果。在不同的前端框架中，可以使用不同的技术和工具来实现样式隔离。

```js
import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
`

function App() {
  return (
    <Container>
      <Title>Hello, World!</Title>
    </Container>
  )
}

export default App
```

在这个示例中，我们使用了 @emotion/styled 库来实现 CSS-in-JS 功能。通过 styled 函数，我们可以创建一个样式化组件，例如 const Container = styled.div。在样式中，我们可以编写常规的 CSS 样式，例如 width: 200px、background-color: #f0f0f0 等。此外，我们还可以创建嵌套的样式组件，例如 const Title = styled.h1，并在组件中使用这些样式。

最终，我们可以在组件中使用这些样式，例如 `<Container><Title>Hello, World!</Title></Container>`。在这个示例中，我们创建了一个居中对齐的容器组件，内部包含一个标题组件。标题组件的样式通过嵌套样式组件的方式进行设置。

需要注意的是，在使用 CSS-in-JS 技术时，不同的库可能有不同的语法和使用方式。上述示例中使用的是 @emotion/styled 库，如果使用其他库，可能需要进行不同的配置和使用方式。

## 其他微服务（微前端）框架

### qiankun

#### 加载过程

1. 主应用加载微应用配置文件
   - 主应用会通过网络请求加载微应用的配置文件，该配置文件包含了微应用的基本信息，如名称、入口文件、路由等。
2. 主应用加载微应用的入口文件
   - 主应用会根据配置文件中的入口文件路径，通过网络请求加载微应用的入口文件。
3. 微应用注册
   - 主应用会利用 Qiankun 提供的 API 将微应用注册到框架中，该 API 会返回一个 Promise 对象，表示微应用注册成功或失败。
4. 微应用生命周期钩子函数执行
   - 在微应用注册成功后，框架会根据微应用的生命周期钩子函数执行相应的操作，如应用启动前的初始化操作、应用启动后的数据加载等。
5. 微应用渲染到主应用中
   - 微应用的入口文件会被加载到主应用中，并渲染到指定的 DOM 节点中，从而完成微应用的显示。
6. 微应用之间的通信
   - 微应用之间可以通过框架提供的 API 进行通信，如发送消息、接收消息等。
7. 微应用卸载
   - 当微应用不需要再使用时，主应用可以通过框架提供的 API 将微应用从框架中卸载，释放资源。

#### 生命周期

1. beforeLoad：在应用加载之前触发，可以在此处进行一些初始化操作。
2. beforeMount：在应用挂载之前触发，可以在此处进行一些初始化操作。
3. afterMount：在应用挂载之后触发，可以在此处进行一些 DOM 操作。
4. beforeUnmount：在应用卸载之前触发，可以在此处进行一些清理操作。
5. afterUnmount：在应用卸载之后触发，可以在此处进行一些清理操作。
6. beforeUpdate：在应用更新之前触发，可以在此处进行一些预处理操作。
7. afterUpdate：在应用更新之后触发，可以在此处进行一些 DOM 操作。

#### 样式隔离

- 可以通过 loader 直接在全局注入，在原来的样式上统一添加前缀

#### 通信过程

在 Qiankun 微应用之前，微前端应用之间的通信通常采用以下几种方式：

1. 基于 URL 参数传递数据：通过 URL 参数传递数据是一种简单的方式，但是只适用于传递少量的数据，且不太安全。
2. 基于全局变量传递数据：将数据存储在全局变量中，其他微应用通过访问全局变量来获取数据。这种方式比较简单，但是容易发生全局变量污染和命名冲突等问题。
3. 基于事件总线传递数据：通过事件总线来传递数据，可以解决全局变量污染和命名冲突等问题，但是需要手动管理事件的订阅和取消订阅，同时也需要考虑事件的命名冲突问题。

而 Qiankun 微应用则提供了一种更加高效的通信方式，即使用应用间通信（Application Communication，简称 AppComm）机制。这种机制基于浏览器的自定义事件（CustomEvent）实现，通过在父应用中定义 AppComm 事件，并在子应用中监听该事件来实现应用之间的通信。

底层原理：

1. 父应用定义 AppComm 事件：父应用通过调用 Qiankun 提供的 emit 方法来定义 AppComm 事件，同时指定子应用的名称和数据等信息。
2. 子应用监听 AppComm 事件：子应用通过调用 Qiankun 提供的 on 方法来监听 AppComm 事件，并在事件回调函数中获取父应用传递的数据。
3. 子应用发送消息给父应用：子应用通过调用 Qiankun 提供的 send 方法来向父应用发送消息，同时指定消息类型和数据等信息。
4. 父应用监听子应用消息：父应用通过调用 Qiankun 提供的 onGlobalStateChange 方法来监听子应用发送的消息，同时在回调函数中处理消息。

通过这种方式，Qiankun 微应用可以实现高效、安全、可靠的应用间通信，从而更好地支持微前端架构的实现。

#### 手动实现 CustomEvent

```js
class CustomEvent {
  constructor() {
    this.listeners = new Map()
  }

  addEventListener(name, callback) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, [])
    }
    this.listeners.get(name).push(callback)
  }

  removeEventListener(name, callback) {
    if (!this.listeners.has(name)) {
      return
    }
    const callbacks = this.listeners.get(name)
    const index = callbacks.indexOf(callback)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  dispatchEvent(event) {
    if (!this.listeners.has(event.type)) {
      return
    }
    const callbacks = this.listeners.get(event.type)
    callbacks.forEach((callback) => {
      callback.call(this, event)
    })
  }
}

const customEvent = new CustomEvent()

function handleEvent(event) {
  console.log(`Event ${event.type} is triggered!`)
}

customEvent.addEventListener('click', handleEvent)
customEvent.dispatchEvent(new Event('click')) // Output: Event click is triggered!

customEvent.removeEventListener('click', handleEvent)
customEvent.dispatchEvent(new Event('click')) // No output
```

### 其他微服务框架

除了 qiankun，还有以下几个微前端框架：

1. Single-SPA：一个比较受欢迎的微前端框架，它提供了一种将多个单页应用程序集成到一个页面中的简单方法。
2. Piral：一个基于 React 的微前端框架，它提供了一个插件化的架构，可以轻松地将多个应用程序集成到一个页面中。
3. Luigi：一个基于 JavaScript 的微前端框架，它提供了一个可扩展的架构，可以轻松地将多个应用程序集成到一个页面中。
4. OpenComponents：一个基于 React 的微前端框架，它提供了一种将多个组件集成到一个页面中的简单方法。

这些微前端框架都有自己的特点和优势，可以根据具体需求选择合适的框架。

- iframe
- 联邦模块
- [腾讯的 hel](https://github.com/Tencent/hel)
- [字节的 grafish](https://www.garfishjs.org/)

#### iframe 缺点

[微前端架构设计](https://www.garfishjs.org/blog)

- 内存占用大：使用 Iframe 会大幅增加内存和计算资源，因为 iframe 内所承载的页面需要一个全新并且完整的文档环境
- 上下文不同：Iframe 与上层应用并非同一个文档上下文导致
  - 事件冒泡不穿透到主文档树上，焦点在子应用时，事件无法传递上一个文档流
    - 主应用劫持快捷键操作
    - 事件无法冒泡顶层，针对整个应用统一处理失效
  - 跳转路径无法与上层文档同步，刷新丢失路由状态
  - Iframe 内元素会被限制在文档树中，视窗宽高限制问题
  - Iframe 登录态无法共享，子应用需要重新登录
  - Iframe 在禁用三方 cookie 时，iframe 平台服务不可用
  - Iframe 应用加载失败，内容发生错误主应用无法感知
  - 难以计算出 iframe 作为页面一部分时的性能情况
- 无法预加载缓存 iframe 内容
- 无法共享基础库进一步减少包体积
- 事件通信繁琐且限制多

**尽管难以将 Iframe 作为微前端应用的加载器，但是却可以参考其设计思想，**一个传统的 Iframe 加载文档的能力可以分为四层：文档的加载能力、HTML 的渲染、执行 JavaScript、隔离样式和 JavaScript 运行环境。

### 联邦模块

模块联邦可以在多个 webpack 编译产物之间共享模块、依赖、页面甚至应用，通过全局变量的组合，还可以在不同模块之前进行数据的获取，让跨应用间做到模块共享真正的插拔式的便捷使用。

比如 a 应用如果想使用 b 应用中 table 的组件，通过模块联邦可以直接在 a 中进行 import('b/table')非常的方便。

- 每个应用块都是一个独立的构建，这些构建都将编译成容器。
- 容器可以被其他应用或者其他容器应用。
- 一个被引用得容器或称为 remote，引用者被称为 host，remote 暴露模块给 host，host 则可以使用这些暴露的模块，这些模块被称为 remote 模块。

chunk 就是打包后的代码块。
chunk 是 webpack 打包过程中，一堆 module 的集合，我们知道 webpack 的打包是从一个入口文件开始，也可以说是入口模块，入口模块引用这其他模块，模块再引用模，webpack 通过引用关系逐个打包模块，这些 module 就形成了一个 chunk。

chunk 的加载操作通常是通过调用 import() 实现的，但也支持像 require.ensure 或 require([...]) 之类的旧语法。

webpack 在构建过程中，会以 entry 配置项对应的入口文件为起点，收集整个应用中需要的所有模块，建立模块之间的依赖关系，生成一个模块依赖图。然后再将这个模块依赖图，切分为多个 chunk，输出到 output 配置项指定的位置。

Module Federation 最后构建内容，main-chunk 和 async chunk。其中， main-chunk 为入口文件(通常为 index.js) 所在的 chunk，内部包含 runtime 模块、index 入口模块、第三方依赖模块(如 react、react-dom、antd 等)和内部组件模块(如 com-1、com-2 等)；async-chunk 为异步 chunk，内部包含需要异步加载(懒加载)的模块。

打包代码中，webpack_require.l 是一个方法，用于加载 async-chunk。webpack_require.l 会根据 async-chunk 对应的 url，通过动态添加 script 的方式，获取 async-chunk 对应的 js 文件，然后执行。

执行入口模块 - index 对应的代码时，1. 如果遇到懒加载模块，通过 webpack_modules.l 方法获取对应的 async-chunk 并执行，然后获取相应的输出。

联邦模块的底层原理是基于 Webpack 的功能和特性实现的，涉及到 Webpack 的模块系统、代码分割、动态导入等机制。

总结：

- 联邦模块，更像是是 npm 包，或者组件共享
