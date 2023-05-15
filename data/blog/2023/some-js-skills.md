---
title: 'js中的那些技术点'
date: Sat May 13 2023 23:13:13 GMT+0800 (中国标准时间)
lastmod: '2023-05-13'
tags: ['js']
draft: false
summary: '哪些js中的技能点'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/some-js-skills
---

## 变量提升

### 函数与变量

```js
var a = 1
function a() {}
console.log(a)

// 提升后的效果如下（伪代码）：
// var a 被函数覆盖
function a() {}
a = 1 // 重新赋值
console.log(a) // 1
```

```js
console.log(a)
var a = 1
function a() {}

// 提升后的效果
// var a 被函数覆盖
function a() {}
console.log(a) // 打印函数
a = 1
```

## 事件循环

### 宏任务和微任务

在 JavaScript 中，宏任务和微任务是异步编程中的两个重要概念。

- 宏任务（macro-task）通常是指由浏览器或 Node.js 引擎提供的任务，例如 setTimeout、setInterval、I/O 操作、DOM 事件等。宏任务会被放入任务队列中，等待执行。
- 微任务（micro-task）通常是指由 JavaScript 引擎提供的任务，例如 Promise、process.nextTick 等。微任务会被放入微任务队列中，等待执行。

页面中的大部分任务都是在主线程上执行的，这些任务包括了：

- 渲染事件（如解析 DOM、计算布局、绘制）；
- 用户交互事件（如鼠标点击、滚动页面、放大缩小等）；
- JavaScript 脚本执行事件；
- 网络请求完成、文件读写完成事件。

为了协调这些任务有条不紊地在主线程上执行，页面进程引入了消息队列和事件循环机制，渲染进程内部会维护多个消息队列，比如延迟执行队列和普通的消息队列。然后主线程采用一个 for 循环，不断地从这些任务队列中取出任务并执行任务。我们把这些消息队列中的任务称为**宏任务**。

宏任务可以满足我们大部分的日常需求，不过如果有对时间精度要求较高或者优先级更高的需求，宏任务就难以胜任了。

页面的渲染事件、各种 IO 的完成事件、执行 JavaScript 脚本的事件、用户交互的事件等都随时有可能被添加到消息队列中，而且添加事件是由系统操作的，JavaScript 代码不能准确掌控任务要添加到队列中的位置，控制不了任务在消息队列中的位置，所以很难控制开始执行任务的时间。

## Promise

### 原理

Promise 是 JavaScript 中一种**处理异步操作的方式，它的原理是基于异步操作的状态机**包含三种状态：pending（等待中）、fulfilled（已成功）、rejected（已失败）。

当 Promise 对象的状态改变时，会触发相应的回调函数。

## SDK

### sdk 验签

签名，其实一般都是通过一些算法，生成的信息摘要，然后再加密得到。

1. 获取需要验签的数据和签名（通常是字符串或者二进制数据）。
2. 获取公钥（也可以是证书或者密钥对），通常是从服务器获取。
3. 将公钥转换为可以被 js 使用的格式，通常是将公钥转换为 PEM 格式或者 DER 格式。
4. 使用 js 的加密库（如 CryptoJS）将数据进行哈希或者加密操作，得到一个哈希值或者加密后的数据。
5. 将哈希值或者加密后的数据与签名进行比对，如果一致，则验签通过，否则验签失败。
6. 对于某些特殊的验签算法，可能还需要对签名进行解密或者解压缩操作，以得到原始的哈希值或者数据。

需要注意的是，在 JS 中进行验签操作需要保证数据的安全性，避免数据泄露或者被篡改。因此，建议使用 HTTPS 协议传输数据，使用 SSL/TLS 等安全协议保护数据传输过程中的安全性。同时，也需要保证服务器提供的公钥是可信的，避免被恶意篡改。

### 公钥转换

将公钥转换为 JS 可使用的格式需要将公钥进行编码。常用的编码格式有 DER 和 PEM 。以下是将 DER 编码的公钥转换为 JS 可使用的格式的步骤：

1. 将 DER 编码的公钥转换为 Uint8Array 类型。
2. 将 Uint8Array 类型的公钥进行 Base64 编码。
3. 构造 JS 可使用的公钥格式，例如：

```js
const publicKey = '-----BEGIN PUBLIC KEY-----\n' + base64PublicKey + '\n-----END PUBLIC KEY-----'
```

其中，**base64PublicKey 即为第 2 步中得到的 Base64 编码，注意，上图不就是我们常见的公钥形式吗**。

4. 将公钥字符串传入 JS 加密库中使用。

注意：如果公钥已经是 PEM 格式的，则无需进行转换，直接使用即可。

### DER 和 PEM

DER (Distinguished Encoding Rules) 和 PEM (Privacy-Enhanced Mail) 是两种常见的编码格式。

DER 是一种二进制格式，用于表示 X.509 数字证书、公钥、私钥和其他证书相关的数据。它是一种较为紧凑的编码格式，适用于网络传输和存储。DER 编码不包括任何头部或尾部信息，因此它的大小比 PEM 格式小。

PEM 是一种基于 ASCII 码的编码格式，常用于表示证书、公钥、私钥和其他数据。PEM 格式使用 -----BEGIN 和 -----END 开头和结尾的标记来标识数据类型，以及 BASE64 编码来表示数据。PEM 编码可以包含多个数据块，每个数据块可以包含多个行，每行的长度通常不超过 64 个字符。

手动实现一个 DER 和 PEM 公钥的相互转化

```js
// 公钥、原格式和目标格式。
// 公钥应该是一个Buffer对象，原格式和目标格式可以是"DER"或"PEM"
function convertPublicKey(publicKey, fromFormat, toFormat) {
  // 将DER格式的公钥转换为PEM格式
  if (fromFormat === 'DER' && toFormat === 'PEM') {
    const base64DERKey = publicKey.toString('base64')
    const pemKey = `-----BEGIN PUBLIC KEY-----\n${base64DERKey.replace(
      /(.{64})/g,
      '$1\n'
    )}\n-----END PUBLIC KEY-----\n`
    return pemKey
  }

  // 将PEM格式的公钥转换为DER格式
  if (fromFormat === 'PEM' && toFormat === 'DER') {
    const base64PEMKey = publicKey
      .toString()
      .split('\n')
      .filter((line) => !line.includes('BEGIN') && !line.includes('END'))
      .join('')
    const derKey = Buffer.from(base64PEMKey, 'base64')
    return derKey
  }

  // 如果格式不匹配，返回null
  return null
}
```

**注意：**上面的 toString 方法，可以传入 'base64' 入参。。。这个 toString 和字符串转换的那个不一样。。。这是 Buffer 对象上的方法

Buffer 对象的 toString 方法用于将 Buffer 对象转换为字符串。

该方法有两个参数：encoding 和 start。

- encoding 参数指定了字符串的编码格式，默认为 utf8。
- start 参数指定了从哪个位置开始转换，默认为 0。

```js
const buf = Buffer.from('hello world', 'utf8')
const str = buf.toString()
console.log(str) // 输出：hello world

const str = buf.toString('base64', 2)
console.log(str) // 输出：bGVsbG8gd29ybGQ=
```

## 时间循环

## 时间循环

## 时间循环

## 时间循环

## 时间循环

## 时间循环

## 时间循环

## 时间循环
