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

## JSX

### JSX 是如何转换为 页面的

```html
<div>
  < img src="avatar.png" className="profile" />
  <Hello />
</div>
```

转换为：

在转化过程中，babel 在编译时会判断 JSX 中组件的首字母：

- 当首字母为小写时，其被认定为原生 DOM 标签，createElement 的第一个变量被编译为字符串
- 当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象

```js
React.createElement(
  'div',
  null,
  React.createElement('img', {
    src: 'avatar.png',
    className: 'profile',
  }),
  React.createElement(Hello, null)
)
```

`React.createElement` 会根据传入的标签类型 type，标签属性 props 及若干子元素 children 等等，生成对应的**虚拟 dom 对象**

**虚拟 DOM 会通过 ReactDOM.render 进行渲染成真实 DOM**，当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 diff 算法进行高效的更新

```js
function render(vnode, container) {
  console.log('vnode', vnode) // 虚拟DOM对象
  // vnode _> node
  const node = createNode(vnode, container)
  container.appendChild(node)
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
  let node = null
  const { type, props } = vnode
  if (type === TEXT) {
    node = document.createTextNode('')
  } else if (typeof type === 'string') {
    node = document.createElement(type)
  } else if (typeof type === 'function') {
    node = type.isReactComponent
      ? updateClassComponent(vnode, parentNode)
      : updateFunctionComponent(vnode, parentNode)
  } else {
    node = document.createDocumentFragment()
  }
  reconcileChildren(props.children, node)
  updateNode(node, props)
  return node
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (Array.isArray(child)) {
      for (let j = 0; j < child.length; j++) {
        render(child[j], node)
      }
    } else {
      render(child, node)
    }
  }
}
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter((k) => k !== 'children')
    .forEach((k) => {
      if (k.slice(0, 2) === 'on') {
        let eventName = k.slice(2).toLocaleLowerCase()
        node.addEventListener(eventName, nextVal[k])
      } else {
        node[k] = nextVal[k]
      }
    })
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
  const { type, props } = vnode
  let vvnode = type(props)
  const node = createNode(vvnode, parentNode)
  return node
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
  const { type, props } = vnode
  let cmp = new type(props)
  const vvnode = cmp.render()
  const node = createNode(vvnode, parentNode)
  return node
}
export default {
  render,
}
```

## hooks

### 为什么产生 hooks

- **状态逻辑复用困难**：在类组件中，如果多个组件需要共享某些状态逻辑，需要使用高阶组件或渲染属性等方式进行封装，导致代码冗长、难以维护。
- 组件之间逻辑复用问题：组件之间的逻辑复用可以通过高阶组件、render props 等方式实现，但是这些方法也会带来一些问题，比如代码复杂度高、组件之间的耦合度高等
- 组件复杂度增加：随着组件功能的增加，类组件中的生命周期函数和状态逻辑变得越来越复杂，难以理解和维护。
- this 指针问题：在类组件中，this 指针的行为容易让人困惑，尤其是在事件处理函数中。
- 生命周期问题：在 React 之前，我们需要使用生命周期函数来处理组件的状态更新、副作用等逻辑。但是生命周期函数的使用过程中，存在一些问题，比如很难复用、容易出现复杂的生命周期函数嵌套等。React Hook 可以让我们在不使用生命周期函数的情况下，轻松地处理组件的状态更新、副作用等逻辑。

总之，React Hook 可以让我们更加方便地实现状态逻辑复用、组件之间的逻辑复用、处理组件的状态更新、副作用等逻辑，从而提高代码的可读性、可维护性和可测试性。

React Hook 可以减少组件的渲染次数，是因为它可以让组件在不需要重新渲染时，跳过 render 函数的执行，比如使用 useMemo，useCallback，只有依赖项发生变化，才会重新计算或者重新创建函数，从而避免不必要的函数创建和渲染。

### 如何减少不必要的渲染

1. 使用 PureComponent 或 shouldComponentUpdate：PureComponent 是 React 提供的一个优化性能的组件，它会自动对比 props 和 state 的变化，如果没有变化就不会触发 render 方法。如果没有使用 PureComponent，可以在自定义组件中实现 shouldComponentUpdate 方法，手动判断 props 和 state 是否变化，如果没有变化也返回 false，避免不必要的 render。
2. 使用 React.memo：React.memo 是一个高阶组件，它可以缓存组件的渲染结果，只有在 props 发生变化时才重新渲染组件。可以将需要优化的组件包裹在 React.memo 中，避免不必要的 render。
3. 将组件拆分成更小的组件：如果一个组件包含多个子组件，而只有其中一个子组件的 props 发生变化，那么整个父组件也会重新。可以将这个父组件拆分成更小的组件，避免不必要的 render。
4. 避免在 render 方法中使用对象字面量：在 render 方法中使用对象字面量会导致每次 render 都创建一个新的对象，这会影响性能。可以在组件的构造函数或 componentDidMount 方法中创建对象，并将其保存在组件的 state 中，避免不必要的对象创建。
5. 使用函数式组件：函数式组件没有 state，只有 props，因此它的渲染结果只与 props 相关，不会受到 state 的影响。如果一个组件没有 state，可以将其改写为函数式组件，避免不必要的 render。

总之，避免不必要的 render 是提高 React 应用性能的重要手段，可以通过 PureComponent、shouldComponentUpdate、React.memo、组件拆分、避免对象字面量等方法来实现。

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

### useState 和 useReducer

useState 和 useReducer 都是 React Hooks，用于在函数组件中管理组件的状态。它们的区别在于：

1. useState 只能管理单个状态，而 useReducer 可以管理多个状态；
2. useState 适合简单的状态管理，useReducer 适合复杂的状态管理；
3. useState 的状态更新是基于新的状态值进行的，而 useReducer 的状态更新是基于旧的状态值进行的，可以根据旧的状态值和 action 计算出新的状态值。

简而言之，useState 适合管理简单的状态，而 useReducer 适合管理复杂的状态，或者需要根据旧状态值计算新状态值的情况。

## 组件间通信

React 组件间通信可以通过以下几种方式实现：

1. Props：通过父组件向子组件传递数据或方法，子组件通过 props 接收数据或方法。父组件可以通过修改 props 的值来控制子组件的行为。
2. Context：通过 React 的 Context API 可以实现跨组件层级的数据共享。可以在祖先组件中创建一个 Context，然后在子孙组件中通过 Consumer 或 useContext 获取 Context 的值。
3. Redux：Redux 是一个状态管理库，它可以帮助我们管理整个应用的状态。通过在组件中使用 connect 函数连接到 Redux 的 store，就可以实现组件与 store 之间的通信。
4. EventBus：EventBus 是一种事件总线，可以让组件之间通过事件来进行通信。可以在某个组件中定义一个 EventBus，然后在其他组件中订阅或触发事件。
5. Refs：通过 Refs 可以获取到组件的引用，从而可以直接调用组件的方法或访问组件的属性。可以在父组件中创建一个 Ref，然后将其传递给子组件，在子组件中可以通过 this.props.refName 获取到 Ref。

### useContext

在 React 中，useContext 是一个 Hooks 函数，用于在函数组件中使用上下文（Context）。

```js
import React, { useContext } from 'react'

// 可以初始化任何数据，MyContext是作为组件存在的。。。
const MyContext = React.createContext('default')

function ParentComponent() {
  return (
    // 也可以自定义向下传的数据，比如此处的value
    <MyContext.Provider value="hello">
      <ChildComponent />
    </MyContext.Provider>
  )
}

function ChildComponent() {
  // 子组件获取传递的值。
  const value = useContext(MyContext)
  return <div>{value}</div>
}
```

因此，整体的感觉是，react 的 useContext 相当于 vue 中 provide 和 injected

## 路由

- 改变 url 且浏览器不向服务器发送请求
- 在不刷新页面的前提下动态改变浏览器地址栏中的 URL 地址

```js
import React from 'react'
import {
  BrowserRouter as Router,
  // HashRouter as Router
  Switch,
  Route,
} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Backend from './pages/Backend'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/backend" component={Backend} />
      <Route path="/admin" component={Admin} />
      <Route path="/" component={Home} />
    </Router>
  )
}

export default App
```

### hashRouter

改变 hash 值并不会导致浏览器向服务器发送请求，浏览器不发出请求，也就不会刷新页面

hash 值改变，触发全局 window 对象上的 hashchange 事件。所以 hash 模式路由就是利用 hashchange 事件监听 URL 的变化，从而进行 DOM 操作来模拟页面跳转

HashRouter 包裹了整应用，

通过 window.addEventListener('hashChange',callback)监听 hash 值的变化，并传递给其嵌套的组件

然后通过 context 将 location 数据往后代组件传递，如下：

```js
import React, { Component } from 'react'
import { Provider } from './context'
// 该组件下Api提供给子组件使用
class HashRouter extends Component {
  constructor() {
    super()
    this.state = {
      location: {
        pathname: window.location.hash.slice(1) || '/',
      },
    }
  }
  // url路径变化 改变location
  componentDidMount() {
    window.location.hash = window.location.hash || '/'
    window.addEventListener('hashchange', () => {
      this.setState(
        {
          location: {
            ...this.state.location,
            pathname: window.location.hash.slice(1) || '/',
          },
        },
        () => console.log(this.state.location)
      )
    })
  }
  render() {
    let value = {
      location: this.state.location,
    }
    return <Provider value={value}>{this.props.children}</Provider>
  }
}

export default HashRouter
```

那底层的 Route 是如何消费的呢？如下，其实就是获取到 provider 里的数据，然后匹配当前组件路由进行返回

```jsx
import React, { Component } from 'react'
import { Consumer } from './context'
const { pathToRegexp } = require('path-to-regexp')
class Route extends Component {
  render() {
    return (
      <Consumer>
        {(state) => {
          console.log(state)
          let { path, component: Component } = this.props
          let pathname = state.location.pathname
          let reg = pathToRegexp(path, [], { end: false })
          // 判断当前path是否包含pathname
          if (pathname.match(reg)) {
            return <Component></Component>
          }
          return null
        }}
      </Consumer>
    )
  }
}
export default Route
```
