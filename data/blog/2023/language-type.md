---
title: '语言类型'
date: Sun May 14 2023 14:47:25 GMT+0800 (中国标准时间)
lastmod: '2023-05-14'
tags: ['TS', 'rust', 'go']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/language-type
---

## ts

TS（TypeScript）是一种由微软开发的编程语言，它是 JavaScript 的一个超集，提供了更强的类型检查和更丰富的面向对象编程特性。以下是 TS 的特点及优势：

- 强类型检查：TS 提供了静态类型检查，可以在编译时检查类型错误，避免了在运行时发生类型错误的情况，提高了代码的可靠性和稳定性。
- 更好的 IDE 支持：TS 提供了更好的 IDE 支持，包括代码补全、代码重构等功能，可以提高开发效率和代码质量。
- 更丰富的面向对象编程特性：TS 支持类、接口、泛型等面向对象编程特性，可以让开发者更方便地组织和管理代码。
- 更好的可维护性和可读性：TS 的类型声明可以让代码更易于阅读和维护，同时也可以提高代码的可读性和可维护性。
- 更好的可扩展性：TS 的模块化支持可以让开发者更方便地组织和管理代码，同时也可以提高代码的可扩展性。
- 更好的代码重用性：TS 的泛型支持可以让开发者更方便地编写可重用的代码，同时也可以提高代码的灵活性和可扩展性。

### ts 的编译过程

1. 词法分析：将代码分解成一个个的词法单元（tokens），比如关键字、变量名、操作符等。这个过程被称为词法分析或者扫描（Scanning）。
2. 语法分析：将词法单元组合成语法树（AST），也就是将代码转换成一棵树形结构。这个过程被称为语法分析或者解析（Parsing）。
   1. 它检查源代码是否符合语法规则，侧重语言特性的语法
3. 语义分析：对语法树进行分析，检查代码是否符合语言规范，比如变量是否被声明、是否赋值等。这个过程被称为语义分析。
   1. 检查程序是否按照语义规则构造，**语义分析阶段，它会进行更深层次的分析**，包括变量类型推导、类型检查、类型转换等
   2. 因此语法和语义，侧重点不太一样
4. 转换为 JavaScript：将 TypeScript 代码转换为 JavaScript 代码。这个过程被称为编译（Compilation）。
5. 输出 JavaScript：将编译后的 JavaScript 代码输出到文件中，或者直接在浏览器中执行。

### 泛型

泛型其实就是类型的函数。

帮助我们编写**更加灵活和可重用**的代码，提高了代码的可读性和安全性。

```js
// 我们通过 K extends keyof T 确保参数 key 一定是对象中含有的键，这样就不会发生运行时错误。
// 这是一个类型安全的解决方案，与简单调用 let value = obj[key]; 不同。
function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]
}

// 使用泛型前
function identity (value: Number) : Number {
  return value;
}
console.log(identity(1)) // 1


// 使用泛型后，其实就是加个<T>，同时将T这个类型，传递给入参和返回结果
function identity<T> (value: T) : T {
  return value;
}

// <T> 内部的 T 被称为类型变量，它是我们希望传递给 identity 函数的类型占位符，
// 同时它被分配给 value 参数用来代替它的类型：此时 T 充当的是类型，而不是特定的 Number 类型。
console.log(identity<Number>(1)) // 1
```

### 映射类型

1. Partial：将所有属性变为可选属性
2. Required：将所有属性变为必选属性
3. Readonly：将所有属性变为只读属性
4. Pick：从给定类型中选取部分属性
5. Record：将一个类型中的所有属性转换为另一个类型的属性
6. Exclude：从一个类型中排除另一个类型的属性
7. Extract：从一个类型中提取另一个类型的属性
8. Omit：从给定类型中删除指定属性

自己实现 ReturnType<T>：

```js
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

- `T` 是一个函数类型
- `(...args: any[]) => infer R` 是一个函数类型，其中 `infer R` 表示从函数返回值中推断出 `R` 类型
- `? R : never` 是一个条件类型，表示如果可以推断出返回值类型 `R`，则返回 `R`，否则返回 `never`。
