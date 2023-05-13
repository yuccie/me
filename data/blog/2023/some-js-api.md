---
title: 'js中那些强大的api'
date: Sat May 13 2023 20:48:27 GMT+0800 (中国标准时间)
lastmod: '2023-05-13'
tags: ['eval']
draft: false
summary: '在js中，那些强大的api'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/some-js-api
---

## eval()方法

大概也是整个`ECMAScript`语言中最强大的一个方法：`eval()`。

`eval()`方法**就像是一个完整的`ECMAScript`解析器**，它只接受一个参数，即要执行的`ECMAScript（或JavaScript）`字符串。

```js
eval('alert("hi")')
// 等价于
alert('hi')
```

当解析器发现代码中调用`eval()`方法时，**它会将传入的参数当作实际的`ECMAScript`语句来解析，然后把执行结果插入到原位置。通过`eval()`执行的代码被认为是包含该次调用的执行环境的一部分，因此被执行的代码具有与该执行环境相同的作用域链。这意味着通过`eval()`执行的代码可以引用在包含环境中定义的变量，**举个例子：

```js
var msg = 'hello world'
eval('alert(msg)') // "hello world"
```

在 eval()中创建的任何变量或函数都不会被提升，因为在解析代码的时候，它们被包含在一个字符串中；它们只在 eval()执行的时候创建。

严格模式下，在外部访问不到 eval()中创建的任何变量或函数，因此前面的例子都会导致错误。同样，在严格模式下，为 eval 赋值也会导致错误：

```js
'use strict'
eval = 'hi' //causes error
```

- 使用 eval 和 Function 构造函数是非常昂贵的操作，因为每次他们都会调用**脚本引擎将源代码转换成可执行代码**。
- 应该避免使用 eval，不安全，非常耗性能（2 次，一次解析成 js 语句，一次执行）。
