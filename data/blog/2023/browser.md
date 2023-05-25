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

## 浏览器架构

- 浏览器进程：主要负责用户交互、子进程管理和文件储存等功能。
- 网络进程：是面向渲染进程和浏览器进程等提供网络下载功能。
- 渲染进程：的主要职责是把从网络下载的 HTML、JavaScript、CSS、图片等资源解析为可以显示和交互的页面。因为渲染进程所有的内容都是通过网络获取的，会存在一些恶意代码利用浏览器漏洞对系统进行攻击，所以运行在渲染进程里面的代码是不被信任的。这也是为什么 Chrome 会让渲染进程运行在安全沙箱里，就是为了保证系统的安全。
- GPU 进程，GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。
- 插件进程，主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响。

渲染进程有个主线程，DOM 解析，样式计算，执行 JavaScript，执行垃圾回收等等操作都是在这个主线程上执行的，没有所谓的渲染引擎线程和 js 引擎线程的概念，你可以把渲染和执行 JavaScript 是一种功能，如果要执行这些功能的话，需要在一个线程上执行，在 chrome 中，他们都是执行在渲染进程的主线程上。

正是因为他们都是执行在同一个线程之上的，所以同一时刻只能运行一个功能，也就是我们常说 js 执行与渲染互斥。

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

## cookie vs token

### Cookie

- 名称：cookie 的名称，用于标识不同的 cookie。
- 值：cookie 的值，存储在客户端和服务器之间的数据。
- 域 domain：cookie 所属的域名，限制了 cookie 的作用域。
- 路径 path：cookie 的作用路径，限制了 cookie 的访问范围。
- 过期时间 Exparies：cookie 的过期时间，指定了 cookie 的有效期。
  - Expires 的单位是 GMT 时间，而 max-age 的单位是秒。
- 安全标志 secure：指示是否仅通过 HTTPS 协议发送 cookie。
- HttpOnly 标志：指示浏览器是否允许客户端 JavaScript 代码访问 cookie。
- sameSite：SameSite 属性是一种用于控制浏览器是否发送跨站点 Cookie 的机制。它有三个值：Strict、Lax 和 None。Strict 表示只有在当前网站的网页中才能发送 Cookie，Lax 表示在某些情况下可以发送 Cookie，None 表示可以在任何情况下发送 Cookie。这样可以防止某些恶意网站利用 Cookie 进行攻击。
- partition key：Partition key 是一种在分布式系统中用于分割数据的机制。在 Cookie 中，Partition key 可以用于将 Cookie 分割成多个部分，每个部分可以存储在不同的服务器上。这样可以提高 Cookie 的可靠性和性能。
  - 在 cookie 中，Partition key 通常是指一个唯一的标识符，用于将 cookie 存储在特定的分区中。这个标识符可以是任何东西，比如用户 ID、会话 ID 或其他唯一的标识符。当 cookie 被写入分布式系统时，系统会根据 Partition key 将其分配到特定的分区中，这样就可以快速地查找和访问该 cookie。这种分区策略可以提高系统的性能和可伸缩性，因为它允许系统在不同的节点上并行处理不同的数据分区。
- priority: Priority 是一种用于设置 Cookie 的优先级的机制。在 Cookie 中，Priority 可以用于指定 Cookie 的重要性，以便浏览器在处理 Cookie 时优先处理重要的 Cookie。这样可以提高 Cookie 的处理效率和用户体验。其实同时存在多个 cookie，可以优先发送指定优先级的；zhi

### JWT 是什么：

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在网络应用间传递信息的一种基于 JSON 的标准。JWT 通常由三部分组成：头部、载荷和签名。JWT 一般用于身份验证和授权。

总之，JWT 是一种安全、可靠、灵活和可扩展的身份验证和授权机制，广泛应用于 Web 应用程序和移动应用程序等领域中。

### Cookie 与 Token 的区别：

- Cookie 是存储在客户端的数据，而 Token 是存储在服务端的数据。
- Cookie 的安全性较低，容易被窃取或伪造，而 Token 的安全性较高。
- Cookie 只能存储少量数据，而 Token 可以存储更多的数据。
- Cookie 的过期时间可以在客户端被修改，而 Token 的过期时间只能在服务端被修改。
- Cookie 需要浏览器支持，并且在跨域请求时需要设置跨域访问，而 Token 不需要浏览器支持，也不需要设置跨域访问。

## 跨域

### cors

CORS（Cross-Origin Resource Sharing）是一种浏览器的安全机制，用于限制跨域访问。在默认情况下，浏览器不允许跨域访问其他域名下的资源，但是可以通过配置 CORS 来允许跨域访问。

CORS 跨域配置有两种方式：服务器端配置和客户端配置。

服务器端配置：

在响应头中添加 Access-Control-Allow-Origin 字段，表示允许跨域访问的域名，可以使用通配符 \* 表示允许所有域名跨域访问。例如：

Access-Control-Allow-Origin: \*
在响应头中添加 Access-Control-Allow-Methods 字段，表示允许跨域访问的 HTTP 方法，例如：

Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
在响应头中添加 Access-Control-Allow-Headers 字段，表示允许跨域访问的 HTTP 头部信息，例如：

Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
如果需要发送 Cookie 等认证信息，需要在响应头中添加 Access-Control-Allow-Credentials 字段，并将其设置为 true，例如：
Access-Control-Allow-Credentials: true

客户端配置：

在发送跨域请求时，需要在请求头中添加 Origin 字段，表示当前请求来自哪个域名。例如：

Origin: http://example.com
如果需要发送认证信息，需要将 withCredentials 属性设置为 true，例如：

xhr.withCredentials = true;
以上是 CORS 跨域的基本配置方式，具体实现还需要根据不同的服务器语言和框架进行相应的配置。

注意：Access-Control-Allow-Origin 的域名后面不能添加斜杠（/），因为它是指定允许跨域请求的源，而不是指定具体的路径。如果添加斜杠，就会限制只能从该域名下的某个路径发起跨域请求，而不是整个域名都可以跨域访问。

### jsonp

jsonp 是一种跨域解决方法，它利用了浏览器允许跨域请求资源的特性。

客户端代码实现：

```javascript
function jsonp(url, callback) {
  const script = document.createElement('script')
  const callbackName = 'jsonpCallback' + Math.floor(Math.random() * 100000)
  script.src = url + '?callback=' + callbackName

  // 定义回调函数
  window[callbackName] = function (data) {
    delete window[callbackName]
    document.body.removeChild(script)
    callback(data)
  }

  // 脚本添加到页面后就会自动下载服务端代码，下载完，作为js执行，这时就会找到window[callbackName]定义的函数。
  document.body.appendChild(script)
}
```

服务端代码实现：

```javascript
const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  // 从前端url获取回调函数的名字
  const query = url.parse(req.url, true).query
  const callbackName = query.callback

  // 将回调函数名字和后端的数据，通过序列化后，作为整体发给前端
  const data = { message: 'Hello World!' }
  const jsonp = callbackName + '(' + JSON.stringify(data) + ')'

  // 注意文件类型设置为js
  res.setHeader('Content-Type', 'application/javascript')
  res.end(jsonp)
})
```

使用例子：

```javascript
jsonp('http://localhost:3000', (data) => {
  // 这里等到下载完数据后
  console.log(data.message) // 输出：Hello World!
})
```

- 注意，服务端设置的 contenttype 是 js
- 服务端将拼接 jsonp = callbackName + '(' + JSON.stringify(data) + ')' 作为整体返回给前端

## 缓存

浏览器缓存是指在浏览器中存储已经请求过的资源（如图片、CSS、JavaScript 文件等）的一种机制。

这样，当用户再次访问同一页面时，浏览器可以直接从缓存中读取资源，而不需要再次请求服务器，从而提高页面加载速度和减少网络流量。

浏览器缓存可以分为两种类型：**强缓存和协商缓存**。

在 http1.0 时代，给客户端设定缓存方式可通过两个字段——Pragma 和 Expires 来规范。Pragma 是用来禁用缓存的，因此 Expires（-1 或 0 则是不缓存）就是用来开启缓存的，如果二者同时存在，则起作用的是 Pragma

`Expires`是 http1.0 的产物，值为服务器返回该请求结果缓存的到期时间，绝对时间，若身处不同时区则不准确，因此 http1.1 出现了`Cache-control`，二者同时存在时`Cache-control`优先级高，是控制浏览器和其他中间缓存如何缓存各个响应以及缓存多久。有以下几种取值(多个取值可以逗号分隔)：

1. public 所有内容都将被缓存（客户端和代理服务器都可缓存）,即使标识显示不可缓存，也可以缓存
2. private 所有内容只有对应的单个用户可以缓存，Cache-Control 的默认取值，例如，用户的浏览器可以缓存包含用户私人信息的 HTML 网页，但 CDN 却不能缓存。
3. no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定，即每次通过标识(如 ETag)先与服务器确认缓存是否变化，如果没有变化则可以继续使用。
4. no-store：直接禁止浏览器以及所有中间代理缓存任何版本的响应
5. max-age=xxx (xxx is numeric)：缓存内容将在 xxx 秒后失效

当二者同时存在 Cache-control 优先级高。no-cache 和 no-store 的区别是前者会缓存，但每次请求时依然先拿到缓存，只是不做验证，然后请求服务器，服务器来决定是否用缓存。

**优先级：** Pragma > Cache-control > Expires

协商缓存是指在缓存时间过期后，浏览器会向服务器发送请求，服务器会根据请求中的 If-Modified-Since 和 If-None-Match 字段判断资源是否有更新，如果没有更新，服务器会返回 304 状态码，告诉浏览器可以从本地缓存中读取资源。协商缓存可以通过设置 HTTP 响应头中的 Last-Modified 和 ETag 字段来实现。

在 Chrome 的 devtools 中勾选 Disable cache 选项，发送的请求会去掉 If-Modified-Since 这个 Header。同时设置 Cache-Control:no-cache Pragma:no-cache，每次请求均为 200，也就不走缓存了。

浏览器在缓存资源时，通常会根据资源大小、类型、访问频率等因素来决定是存储在磁盘（disk）还是内存（memory）中。较小的资源通常会存储在内存中，以提高访问速度，而较大的资源则会存储在磁盘中，以节省内存空间。

### ETag 能解决什么问题？

- Last-Modified 标注的最后修改只能精确到秒级，如果某些文件在 1 秒钟以内，被修改多次的话，它将不能准确标注文件的新鲜度；
- 某些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，但 Last-Modified 却改变了，导致文件没法使用缓存，因此不能说打开了，修改时间就发生了变化
- 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形。
  优先级：ETag 优先级比 Last-Modified 高，同时存在时会以 ETag 为准。

nginx 中 etag 由响应头的 Last-Modified 与 Content-Length 表示为十六进制组合而成。Last-Modified 是由一个 unix timestamp 表示，则意味着它只能作用于秒级的改变。

### 如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改？

ETag 是一个标识符，用于标识服务器上的资源，ETag 值也可以在不修改资源内容的情况下被更改，例如服务器更改了**存储资源的方式或服务器更改了资源的元数据**。因此，ETag 值的改变并不一定意味着文件内容一定已经更改。

## 跨 tab 通信

1. 使用 localStorage 或 sessionStorage：可以在一个 tab 页中存储数据，在另一个 tab 页中读取数据，从而实现通信。但是需要注意的是，这种方式只能传递字符串类型的数据。
2. 使用 Broadcast Channel API：可以创建一个广播通道，多个 tab 页可以通过该通道进行通信。但是需要注意的是，Broadcast Channel API 需要浏览器支持，目前不是所有浏览器都支持。
3. 使用 SharedWorker：可以创建一个共享的后台线程，多个 tab 页可以通过该线程进行通信。但是需要注意的是，SharedWorker 需要浏览器支持，目前不是所有浏览器都支持。
4. 使用 postMessage API：可以在不同的 tab 页之间发送消息，从而实现通信。但是需要注意的是，postMessage API 需要在两个 tab 页中都进行调用，且需要确保两个 tab 页之间的安全性。

```js
// A 页面
var message = 'Hello, Page B!'
window.postMessage(message, '*') // 发给所有窗口

// B 页面
window.addEventListener('message', function (event) {
  console.log('收到了消息', event.data)
})
```

## performance

Performance 是浏览器提供的一个 API，用于测量网页的性能表现。以下是使用 Performance 的步骤：

- 使用 window.performance 对象来访问 Performance API。
- 使用 performance.timing 属性来获取网页的加载时间信息，包括 DNS 解析时间、TCP 连接时间、页面加载时间等等。
- 使用 performance.navigation 属性来获取网页的导航信息，包括重定向次数、是否使用了缓存等等。
- 使用 performance.memory 属性来获取浏览器内存使用情况。
- 使用 performance.mark()和 performance.measure()方法来记录自定义的性能指标，比如某个函数的执行时间。
- 使用 performance.now()方法来获取当前时间戳，用于计算某个操作的执行时间。
- 使用 performance.clearMarks()和 performance.clearMeasures()方法来清除自定义性能指标的记录。

### 如何使用 performance

```js
// 获取Performance对象
var perf =
  window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance

// 确保浏览器支持Performance API
if (perf) {
  // 获取各个阶段的性能指标
  var timing = perf.timing

  // 计算页面各个阶段的加载时长
  var redirectTime = timing.redirectEnd - timing.redirectStart // 重定向耗时
  var dnsTime = timing.domainLookupEnd - timing.domainLookupStart // DNS查询耗时
  var tcpTime = timing.connectEnd - timing.connectStart // TCP连接耗时
  var requestTime = timing.responseStart - timing.requestStart // 请求耗时
  var responseTime = timing.responseEnd - timing.responseStart // 响应耗时
  var domTime = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart // DOMContentLoaded事件耗时
  var onLoadTime = timing.loadEventEnd - timing.loadEventStart // onLoad事件耗时

  // 输出各个阶段的性能指标
  console.log('重定向耗时：' + redirectTime + 'ms')
  console.log('DNS查询耗时：' + dnsTime + 'ms')
  console.log('TCP连接耗时：' + tcpTime + 'ms')
  console.log('请求耗时：' + requestTime + 'ms')
  console.log('响应耗时：' + responseTime + 'ms')
  console.log('DOMContentLoaded事件耗时：' + domTime + 'ms')
  console.log('onLoad事件耗时：' + onLoadTime + 'ms')
}
```

## 预取和预加载

- prefetch：浏览器在加载完当前页面后，会在后台提前加载下一个页面的资源。因此，prefetch 发生在当前页面加载完成后，但下一个页面还没有开始加载时。
  - This is done by adding a prefetch attribute to the HTML link tag, which tells the browser to download the resource in the background while the user is still browsing the pag
- preload：浏览器在加载当前页面时，会提前加载该页面需要的资源。因此，preload 发生在当前页面加载时。
  - 这是通过在 HTML 链接标签中添加 preload 属性来完成的，该属性告诉浏览器优先下载这些资源而不是页面上的其他资源

因此，preload 发生在 prefetch 之前。
