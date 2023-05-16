---
title: '服务器相关'
date: Tue May 16 2023 18:29:56 GMT+0800 (中国标准时间)
lastmod: '2023-05-15'
tags: ['服务器', 'node']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/server
---

## nodejs

```js
if (typeof window !== 'undefined') {
  console.log('浏览器环境')
} else if (typeof process !== 'undefined') {
  console.log('node环境')
}
```

### 多进程

1. 使用 child_process 模块：Node 提供了 child_process 模块，可以通过该模块创建子进程。可以使用 spawn()、exec()、execFile()、fork()等方法来创建子进程，并通过进程间通信来实现多进程。
2. 使用 cluster 模块：Node 提供了 cluster 模块，可以通过该模块实现多进程。cluster 模块可以自动将一个 Node 进程复制多次，并通过进程间通信来实现多进程。
3. 使用第三方模块：Node 社区有很多第三方模块可以实现多进程，如 pm2、forever 等。

```js
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

// 主进程 克隆子进程
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  // 然后每个子进程，都共享8000端口
  // 其实这里也实现了负载均衡。
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('hello world\n')
    })
    .listen(8000)

  console.log(`Worker ${process.pid} started`)
}
```

在这个例子中，我们首先判断当前进程是否为主进程（master），如果是主进程，就使用 cluster.fork()方法创建多个子进程（workers），

每个子进程都会监听同一个端口 8000，当有请求到来时，会被分配到其中一个子进程处理。如果某个子进程崩溃了，cluster 模块会自动重启该进程。

如果当前进程不是主进程，就创建一个 HTTP 服务器，监听端口 8000，处理来自客户端的请求。

这样，我们就可以使用 cluster 模块实现 Node.js 的**负载均衡和高可用性。**
