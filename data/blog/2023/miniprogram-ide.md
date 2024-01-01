---
title: '小程序IDE'
date: Tue May 09 2023 21:27:04 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['小程序', 'IDE']
draft: false
summary: '一个将代码编辑、调试、构建和云开发等功能集成在一起，提供给开发者一个高效、便捷的集成开发环境'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/miniprogram-ide
---

## 背景

在开发小程序时，我们经常需要调试，而调试小程序就需要用到 IDE .

## 技术栈

- Electron
- React

## 小程序 IDE 架构

小程序 IDE（Integrated Development Environment）一个集成开发环境，主要有以下几个模块组成。

- 模拟器：主要使用 iframe 模拟
- 编辑器：小程序 IDE 采用了类似于 Sublime Text 的编辑器，支持代码高亮、自动补全、语法检查等功能。
- 调试器：小程序 IDE 通过与微信开发者工具的集成，提供了丰富的调试功能，包括实时预览、页面调试、网络请求跟踪等。
- 构建工具：小程序 IDE 采用了类似于 webpack 的构建工具，将开发者编写的代码打包成小程序可以运行的代码。
- 云开发：小程序 IDE 提供了云开发功能，可以在 IDE 中访问云数据库、云函数等云服务。

## 底层原理

Electron 是一个跨平台的框架，它结合了 Chromium 和 Node.js，它允许开发者使用 Web 技术（如 HTML、CSS 和 JavaScript）来构建桌面应用程序。它的底层原理主要包括以下几个方面：

1. Chromium：Electron 底层采用了 Chromium 浏览器作为其渲染引擎，这意味着它可以支持最新的 Web 技术和标准，包括 HTML5、CSS3、ES6 等。
2. Node.js：Electron 同时也集成了 Node.js，这使得开发者可以在应用程序中使用 Node.js 的模块和 API，例如文件系统、网络、进程管理等。这也使得开发者可以使用 JavaScript 来编写服务器端代码和客户端代码。
3. Electron API：Electron 提供了一系列的 API，这些 API 可以让开发者访问底层的操作系统资源，例如文件系统、网络、系统通知、剪贴板等。这些 API 可以让开发者在应用程序中实现更多的功能。
4. Native Modules：Electron 允许开发者编写原生的 C++ 模块，并将其集成到应用程序中。这些原生模块可以访问操作系统底层的资源，例如硬件设备、系统调用等。这使得开发者可以编写高性能的代码，并且可以访问操作系统底层的资源。

总的来说，Electron 的底层原理主要是基于 Chromium 和 Node.js，通过提供一系列的 API 和原生模块，让开发者可以使用 Web 技术来构建跨平台的桌面应用程序。

NW.js：也是一款开源框架，由 Intel 开发，支持使用 Web 技术构建桌面应用程序，包括 HTML、CSS 和 JavaScript。

Node 的事件循环与浏览器的事件循环有明显不同，Chromium 既然是 Chrome 的实验版，自然与浏览器实现相同。
Node 的事件循环基于 libuv 实现，而 Chromium 基于 message bump 实现。主线程只能同时运行一个事件循环，因此需要将两个完全不同的事件循环整合起来。

有两种解决方案:

- 使用 libuv 实现 message bump 将 Chromium 集成到 Node.js
- 将 Node.js 集成到 Chromium

Electron 最初的方案是第一种，使用 libuv 实现 message bump，但不同的 OS 系统 GUI 事件循环差异很大，例如 mac 为 NSRunLoop，Linux 为 glib，实现过程特别复杂，资源消耗和延迟问题也无法得到有效解决，最终放弃了第一种方案。

Electron 第二次尝试使用小间隔的定时器来轮询 GUI 事件循环，但此方案 CPU 占用高，并且 GUI 响应速度慢。

后来 libuv 引入了 backend_fd 概念，backend_fd 轮询事件循环的文件描述符，因此 Electron 通过轮询 backend_fd 来得到 libuv 的新事件实现 Node.js 与 Chromium 事件循环的融合(第二种方案)。

## 通信

### IPC（Inter process Communication）

IPC（Inter-Process Communication，进程间通信）是指在多个进程之间传递数据或者信号的机制。在操作系统中，**进程之间是相互独立的，彼此之间不能直接访问对方的内存空间**，所以需要使用 IPC 机制来实现数据的传递和协调。

在小程序底层双线程模型里，属于 IPC 通信吗？也算？

### Electron 里的 IPC 通信

在 Electron 中，主进程和渲染进程之间可以通过 IPC（Inter process Communication 进程间通信）机制进行通信。IPC 是 Electron 内置的一种通信方式，可以让不同进程之间进行数据交换和函数调用。

实现步骤：

1. 在主进程中，使用 ipcMain 模块注册一个事件监听器，监听渲染进程发送过来的消息。
2. 在渲染进程中，使用 ipcRenderer 模块向主进程发送消息。
3. 主进程接收到消息后，可以进行相应的处理，并通过 event.sender.send 方法向渲染进程回复消息。
4. 渲染进程可以使用 ipcRenderer 模块监听主进程回复的消息。

```js
// 主进程
const { ipcMain } = require('electron')

ipcMain.on('message-from-renderer', (event, data) => {
  console.log(data) // 输出渲染进程发送过来的消息
  event.sender.send('message-from-main', 'Hello from main process!')
})

// 渲染进程
const { ipcRenderer } = require('electron')

ipcRenderer.send('message-from-renderer', 'Hello from renderer process!')

// 监听主进程回复的消息
ipcRenderer.on('message-from-main', (event, data) => {
  console.log(data) // 输出主进程回复的消息
})
```

除了 IPC 通信，Electron 还提供了其他的通信方式，比如使用 remote 模块在渲染进程中调用主进程的方法，或者使用 Electron 的远程调试功能进行调试。

它的原理是通过 IPC(进程间通信) 通道实现的。当渲染进程调用 remote 模块时，它会通过 IPC 通道向主进程发送请求，并等待主进程返回结果。主进程接收到请求后，执行相应的方法，并将结果通过 IPC 通道返回给渲染进程。

注意，remote 模块只能访问主进程中已经暴露出来的模块和方法，如果想访问其他模块或方法，需要在主进程中先进行相应的暴露操作。

### webscoket 通信

WebSocket 是一种**基于 TCP 协议**的实时通信协议，它允许客户端和服务器之间进行双向通信。

WebSocket 通过建立一条持久化的连接，使得客户端和服务器可以实时地交换数据，而不需要像 HTTP 协议一样每次请求都需要重新建立连接。

WebSocket 的原理是通**过 HTTP 协议建立连接，然后升级到 WebSocket 协议**。客户端发送一个 HTTP 请求，请求头中包含 Upgrade 字段，值为 WebSocket。服务器收到请求后，如果**支持 WebSocket 协议，就会返回一个状态码 101 Switching Protocols**，表示已经成功升级到 WebSocket 协议。客户端和服务器之间的通信就可以使用 WebSocket 协议进行了。

WebSocket 的优点是实时性好，传输效率高，支持双向通信，可以用于实现在线聊天、游戏、实时监控等应用。缺点是需要服务器支持 WebSocket 协议，而且在某些环境下可能会受到防火墙的限制。

示例：一个短暂的 websocket 服务

服务端代码片段：

```js
const http = require('http')
const ws = require('ws')

const wss = new ws.Server({ noServer: true })

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end()
    return
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end()
    return
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect)
}

function onConnect(ws) {
  ws.on('message', function (message) {
    message = message.toString()
    let name = message.match(/([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]+)$/gu) || 'Guest'
    ws.send(`Hello from server, ${name}!`)

    setTimeout(() => ws.close(1000, 'Bye!'), 5000)
  })
}

if (!module.parent) {
  http.createServer(accept).listen(8080)
} else {
  exports.accept = accept
}
```

客户端代码片段：

```js
let socket = new WebSocket('wss://javascript.info/article/websocket/demo/hello')

socket.onopen = function (e) {
  alert('[open] Connection established')
  alert('Sending to server')
  socket.send('My name is John')
}

socket.onmessage = function (event) {
  alert(`[message] Data received from server: ${event.data}`)
}

socket.onclose = function (event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
  } else {
    // 例如服务器进程被杀死或网络中断
    // 在这种情况下，event.code 通常为 1006
    alert('[close] Connection died')
  }
}

socket.onerror = function (error) {
  alert(`[error] ${error.message}`)
}
```

所以你看到的事件顺序为：open → message → close。

这是由 new WebSocket("wss://javascript.info/chat") 发出的请求的浏览器 header 示例。

```
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```

- Origin —— 客户端页面的源，例如 https://javascript.info。**WebSocket 对象是原生支持跨源的**。没有特殊的 header 或其他限制。旧的服务器无法处理 WebSocket，因此不存在兼容性问题。但 **Origin header 很重要，因为它允许服务器决定是否使用 WebSocket 与该网站通信。\*\*
- Connection: Upgrade —— 表示客户端想要更改协议。
- Upgrade: websocket —— 请求的协议是 “websocket”。想要更改的协议是 webscoket
- Sec-WebSocket-Key —— 浏览器随机生成的安全密钥。
- Sec-WebSocket-Version —— WebSocket 协议版本，当前为 13。

**注意：**：我们不能使用 XMLHttpRequest 或 fetch 来进行这种 HTTP 请求，因为不允许 JavaScript 设置这些 header。

如果服务器同意切换为 WebSocket 协议，服务器应该返回响应码 101：

- 101 Switching Protocols
- Upgrade: websocket
- Connection: Upgrade
- Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=

这里 Sec-WebSocket-Accept 是 Sec-WebSocket-Key 使用特殊的算法重新编码的。浏览器使用它来确保响应与请求相对应。

然后，使用 WebSocket 协议传输数据，我们很快就会看到它的结构（“frames”）。它根本不是 HTTP。

#### socket

WebSocket 是一种高级的应用层协议，建立在 TCP 连接之上，提供了实时、双向的通信能力，适用于实时性要求较高的场景。而 Socket 是一种底层的网络通信协议，可以在不同的网络层和传输层协议上运行，提供了双向通信的能力，适用于各种通信场景。WebSocket 可以看作是一种特殊的 Socket 实现，它在传输层上使用了 HTTP 协议进行握手，并提供了更高级的接口和功能，使得实时通信更便捷。

### 数据传输

WebSocket 通信由 “frames”（即数据片段）组成，可以从任何一方发送，并且有以下几种类型：

- “text frames” —— 包含各方发送给彼此的文本数据。
- “binary data frames” —— 包含各方发送给彼此的二进制数据。
- “ping/pong frames” 被用于检查从服务器发送的连接，浏览器会自动响应它们。
- 还有 “connection close frame” 以及其他服务 frames。

在浏览器里，我们仅直接使用文本或二进制 frames。

- WebSocket .send() 方法可以发送文本或二进制数据。
- socket.send(body) 调用允许 body 是字符串或二进制格式，包括 Blob，ArrayBuffer 等。不需要额外的设置：直接发送它们就可以了。

当我们收到数据时，文本总是以字符串形式呈现。而对于二进制数据，我们可以在 Blob 和 ArrayBuffer 格式之间进行选择。

它是由 socket.binaryType 属性设置的，默认为 "blob"，因此二进制数据通常以 Blob 对象呈现。

Blob 是高级的二进制对象，它直接与 `<a>，<img>` 及其他标签集成在一起，因此，默认以 Blob 格式是一个明智的选择。但是对于二进制处理，要访问单个数据字节，我们可以将其改为 "arraybuffer"：

```js
socket.binaryType = 'arraybuffer'
socket.onmessage = (event) => {
  // event.data 可以是文本（如果是文本），也可以是 arraybuffer（如果是二进制数据）
}
```

总结：

- websocket 底层依然基于 tcp，
- 建立连接时，依然是通过 http，只不过需要升级
- 有个专门的 socket.io 的库，可以在服务端，也可以在客户端使用
- connection 字段表示接口想要的操作，比如 upgrade 表示想要升级
- Upgrade 字段表示要升级的内容，比如 websocket，表示要升级为 websocket 协议

### server sent event

相比 websocket 是双向的， `server sent events` 是单向的，仅能传输文本、且只能服务器向客户端推送、而且是常规的 http 协议。

优势还有：

- 自动重连。
- 支持跨域

我们需要从服务器接收一个数据流：可能是聊天消息或者市场价格等。这正是 EventSource 所擅长的。它还支持自动重新连接，而在 WebSocket 中这个功能需要我们手动实现。此外，它是一个普通的旧的 HTTP，不是一个新协议。

比如展示一个股票系统

```html
<!DOCTYPE html>
<script>
  let eventSource

  function start() {
    // when "Start" button pressed
    if (!window.EventSource) {
      // IE or an old browser
      alert("The browser doesn't support EventSource.")
      return
    }

    eventSource = new EventSource('digits')

    eventSource.onopen = function (e) {
      log('Event: open')
    }

    eventSource.onerror = function (e) {
      log('Event: error')
      if (this.readyState == EventSource.CONNECTING) {
        log(`Reconnecting (readyState=${this.readyState})...`)
      } else {
        log('Error has occured.')
      }
    }

    eventSource.addEventListener('bye', function (e) {
      log('Event: bye, data: ' + e.data)
    })

    eventSource.onmessage = function (e) {
      log('Event: message, data: ' + e.data)
    }
  }

  function stop() {
    // when "Stop" button pressed
    eventSource.close()
    log('eventSource.close()')
  }

  function log(msg) {
    logElem.innerHTML += msg + '<br>'
    document.documentElement.scrollTop = 99999999
  }
</script>

<button onclick="start()">Start</button> Press the "Start" to begin.
<div id="logElem" style="margin: 6px 0"></div>

<button onclick="stop()">Stop</button> "Stop" to finish.
```

```js
let http = require('http')
let url = require('url')
let querystring = require('querystring')
let static = require('node-static')
let fileServer = new static.Server('.')

function onDigits(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
  })

  let i = 0

  let timer = setInterval(write, 1000)
  write()

  function write() {
    i++

    if (i == 4) {
      res.write('event: bye\ndata: bye-bye\n\n')
      clearInterval(timer)
      res.end()
      return
    }

    res.write('data: ' + i + '\n\n')
  }
}

function accept(req, res) {
  if (req.url == '/digits') {
    onDigits(req, res)
    return
  }

  fileServer.serve(req, res)
}

if (!module.parent) {
  http.createServer(accept).listen(8080)
} else {
  exports.accept = accept
}
```

### webRTC

WebRTC（Web Real-Time Communication）是一种用于在 Web 浏览器之间进行实时通信的开放源代码项目。它的原理涉及多种技术和协议，包括网络传输、媒体流处理和安全性。

WebRTC 的原理包括以下几个关键方面：

- 媒体捕获和流处理：WebRTC 允许浏览器捕获音频和视频流，并对其进行处理。这包括使用 Web APIs（如 getUserMedia）从摄像头和麦克风中捕获媒体流，并对媒体流进行编解码、媒体格式转换等处理。

- 实时传输协议：WebRTC 使用实时传输协议（Real-Time Protocol，简称 RTP）来传输音频和视频数据。RTP 是一种标准的实时传输协议，用于在网络上传输实时数据流。

- 网络传输：WebRTC 使用用户数据报协议（User Datagram Protocol，简称 UDP）或传输控制协议（Transmission Control Protocol，简称 TCP）来在网络上传输媒体数据。UDP 通常用于实时通信，因为它提供了更低的延迟，而 TCP 则提供了更可靠的数据传输。

- NAT 穿透：WebRTC 使用 ICE（Interactive Connectivity Establishment）框架来解决网络地址转换（Network Address Translation，简称 NAT）和防火墙等网络障碍对实时通信的影响。ICE 允许浏览器找到最佳的网络路径，以确保通信的顺利进行。

- 安全性：WebRTC 通过使用加密技术（如传输层安全性协议，TLS）来保护通信内容的安全性和隐私。

总的来说，WebRTC 的原理是通过浏览器提供的 API 和协议，实现了在 Web 应用程序中进行实时音视频通信的功能。这使得开发者可以轻松地构建具有实时通信能力的 Web 应用，如视频会议、语音通话和实时数据传输等。
