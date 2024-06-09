---
title: class类的使用
date: Mon Jan 15 2024 23:16:52 GMT+0800 (中国标准时间)
lastmod: 2024/1/15
tags: [class, 静态, 实例]
draft: false
summary: class 类的使用
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-js-base/0_class类的使用.md
---

## class 类

```js
class Diff {
  constructor() {
    this.data = { a: 1 }
  }
  static getData() {
    console.log(this.data)
  }
}

console.log(Diff.getData())
```

上面的代码有问题。在静态方法中使用 this 关键字是不允许的，因为静态方法不属于任何实例。

```js
class Diff {
  constructor() {
    this.data = { a: 1 }
  }
  static getData() {
    // 可以使用静态属性
    console.log(Diff.data)
  }
}

console.log(Diff.getData())
```

- 静态方法中不能使用 this 关键字，是因为静态方法不属于任何实例。
- this 关键字用于引用当前对象的实例，而静态方法是属于类本身的，不依赖于任何实例。
- 静态方法和静态变量是面向对象编程中的概念，用于描述类的行为和属性。

```js
class MyClass {
  // 定义静态变量
  static myStaticVariable = 123

  // 定义静态方法
  static myStaticMethod() {
    return 'Hello from static method'
  }

  // 定义实例方法
  myInstanceMethod() {
    return 'Hello from instance method'
  }
}

// 访问静态变量
console.log(MyClass.myStaticVariable) // 输出: 123

// 调用静态方法
console.log(MyClass.myStaticMethod()) // 输出: Hello from static method

// 创建类的实例
const myObj = new MyClass()

// 调用实例方法
console.log(myObj.myInstanceMethod()) // 输出: Hello from instance method
```
