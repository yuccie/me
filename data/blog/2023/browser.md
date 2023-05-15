---
title: '浏览器相关'
date: Sun May 14 2023 18:46:37 GMT+0800 (中国标准时间)
lastmod: '2023-05-14'
tags: ['浏览器']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/browser
---

## 输入 url 到页面显示，都发生了什么

1. 当用户在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容，还是请求的 URL，进而处理拼装成对应的 URL 格式。（按下回车后，浏览器给当前页面一次执行 beforeunload 事件的机会，意味着你可以在页面退出前做些什么）
2. 浏览器进程会通过进程间通信（IPC）把 拼装好的 URL 请求发送至网络进程，网络进程首先查找本地是否有缓存(这里缓存可以理解为资源和域名缓存等)，有则直接返回，没有则进行 DNS 解析获取 ip，如果是 https 则还需要建立 TLS 连接。
3. 浏览器构建请求头(头和行)，发送给服务器，服务器解析请求头，然后返回响应头，网络进程收到响应头便开始解析，需要根据 code 码做适当处理，比如 301，302 等重定向的，就会获取 Location 字段，重新发起请求。还会根据响应头里的`content-type:application/octet-stream;charset=UTF-8`来判断是下载还是普通页面。下载的话就直接交给下载管理器，同时该 URL 的导航过程也就结束了。如果是页面，因为页面是在渲染进程里，所以下一步就是准备渲染进程
4. 默认情况下，Chrome 会为每个标签页分配一个渲染进程，但一个站点(相同协议和根域名，比同源要求低)下的页面一般共用一个渲染进程，准备好了渲染进程，但现在页面资源还在网络进程那，所以下一步就需要提交文档。
5. 所谓提交文档，就是指浏览器进程将网络进程接收到的 HTML 数据提交给渲染进程（其实浏览器收到网络进程的响应头后，就给渲染进程发消息，说你要准备渲染页面啦，渲染进程收到消息就会与网络进程建立连接来获取页面数据，等页面数据传输完毕后，会告诉浏览器主进程，主进程收到确认提交消息后就会更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新 Web 页面）
6. 一旦主进程收到确认提交消息后，渲染进程就开始页面解析及子资源加载了。
7. 解析 HTML 文件：浏览器首先会从网络中获取 HTML 文件，然后解析该文件，构建一棵 DOM 树。
8. 解析 CSS 文件：浏览器会根据 HTML 中的 link 和 style 标签获取 CSS 文件，然后解析该文件，构建一棵 CSSOM 树。
9. 构建渲染树：浏览器会将 DOM 树和 CSSOM 树合并成一棵渲染树，渲染树只包含需要显示的节点和样式信息。
10. 布局：浏览器会根据渲染树中每个节点的大小、位置等信息，计算出每个节点在屏幕上的准确位置。
11. 绘制：浏览器会遍历渲染树，将每个节点绘制出来，生成位图。
12. 合成：浏览器会将位图合成为一张完整的页面，然后将该页面显示在屏幕上
13. 而一旦页面生成完成，渲染进程会发消息给主进程，然后浏览器主进程就会停止标签图标的加载动画。

## navigator.sendBeacon()

该方法可用于通过 HTTP POST 将少量数据 异步 传输到 Web 服务器。

它主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如：XMLHttpRequest）发送分析数据的一些问题。

### 历史原因

这个方法主要用于满足统计和诊断代码的需要，这些代码通常尝试在卸载（unload）文档之前向 Web 服务器发送数据。过早的发送数据可能导致错过收集数据的机会。

然而，对于开发者来说保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在 unload 事件处理器中产生的异步 XMLHttpRequest。

过去，为了解决这个问题，统计和诊断代码通常要在

- 发起一个同步 XMLHttpRequest 来发送数据。
- 创建一个 `<img>` 元素并设置 src，大部分用户代理会延迟卸载（unload）文档以加载图像。
- 创建一个几秒的 no-op 循环。

上述的所有方法都会迫使用户代理延迟卸载文档，并使得下一个导航出现的更晚。下一个页面对于这种较差的载入表现无能为力。

这就是 sendBeacon() 方法存在的意义。使用 sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，这意味着：

- 数据发送是可靠的。
- 数据异步传输。
- 不影响下一导航的载入。

## Fetch

```js
// 通过 abortController 手动设置一个 取消器
const controller = new AbortController()
const signal = controller.signal

const timeout = setTimeout(() => controller.abort(), 5000)

fetch('https://example.com/data', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error))
  .finally(() => clearTimeout(timeout))
```

## 请求取消

XHR 取消请求的原理是通过调用 XHR 对象的 abort()方法来取消正在进行的请求。

在调用 abort()方法后，XHR 对象会立即停止请求，并触发 XHR 对象的 onreadystatechange 事件的 readyState 属性的值为 4 和 status 属性的值为 0。同时，XHR 对象的 responseText 和 responseXML 属性也会变为 null。

需要注意的是，**如果请求已经被发送到服务器并且服务器已经开始处理请求**，那么不能取消该请求。在这种情况下，可以使用超时设置来中止请求。

使用超时设置可以取消请求是因为**超时设置可以限制请求的响应时间，如果在规定时间内没有收到服务器的响应**，就会认为请求失败并取消请求。这样可以避免请求一直处于等待状态，浪费资源，并且可以提高程序的健壮性和可靠性。

在底层，当我们调用 XHR 对象的 abort() 方法时，浏览器会向服务器发送一个带有特殊标记的请求，告诉服务器取消当前请求。服务器在接收到这个请求后，会尝试停止正在进行的操作并返回一个响应。

需要注意的是，XHR 请求是异步的，也就是说，当我们调用 abort() 方法时，请求可能已经被服务器处理并返回了响应。在这种情况下，我们仍然可以取消请求，但是我们无法阻止服务器返回的响应。

在浏览器端，使用 XMLHttpRequest 对象发送的请求是基于 HTTP 协议的，因此在发送请求前，浏览器会先建立 TCP 连接，这个过程是需要占用网络带宽的。因此，即使使用 xhr.abort 取消请求，TCP 连接仍然会被建立，网络带宽也会被占用。

原生 abort 取消 和 超时取消的不完全相同

### AbortController

注意：AbortController 是一个实验性的 API，可能不被所有浏览器支持。建议在使用之前先检查浏览器是否支持该 API。

AbortController 是一个用于控制异步操作的 API，它可以用来取消 Promise、fetch 等异步操作。其**底层工作原理是基于一个 AbortSignal 对象来实现的，AbortSignal 对象包含一个 aborted 属性，用于标识当前异步操作是否已被取消**。

当 AbortController.abort()方法被调用时，它会将 AbortSignal 对象的 aborted 属性设置为 true，从而通知异步操作需要被取消。异步操作可以通过监听 AbortSignal 对象的 abort 事件来响应取消请求。

```js
const controller = new AbortController()
const signal = controller.signal

fetch(url, { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('fetch aborted')
    } else {
      console.log('fetch error', error)
    }
  })

// 在需要取消请求的地方调用
controller.abort()
```

### axios 里的取消

```js
const source = axios.CancelToken.source()

axios
  .get('/api/some-resource', {
    cancelToken: source.token,
  })
  .then((response) => {
    console.log('请求成功', response.data)
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log('请求被取消', error.message)
    } else {
      console.log('请求失败', error.message)
    }
  })

// 在需要取消请求的地方调用
source.cancel('请求被取消')
```
