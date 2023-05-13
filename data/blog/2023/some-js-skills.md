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

## 时间循环

### 宏任务和微任务

在 JavaScript 中，宏任务和微任务是异步编程中的两个重要概念。

宏任务（macro-task）通常是指由浏览器或 Node.js 引擎提供的任务，例如 setTimeout、setInterval、I/O 操作、DOM 事件等。宏任务会被放入任务队列中，等待执行。

微任务（micro-task）通常是指由 JavaScript 引擎提供的任务，例如 Promise、process.nextTick 等。微任务会被放入微任务队列中，等待执行。
