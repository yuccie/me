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

## 执行上下文

JavaScript 的执行上下文是描述 JavaScript 代码在运行时环境中执行的抽象概念。它是一个对象，其中包含了 JavaScript 代码执行所需的所有信息，例如变量、函数、参数、作用域链等。

JavaScript 中的每个函数都有自己的执行上下文，而全局代码在 JavaScript 引擎启动时创建了一个全局执行上下文。

当 JavaScript 代码被执行时，JavaScript 引擎会创建一个执行上下文堆栈（Execution Context Stack）。每次调用函数时，都会创建一个新的执行上下文，并将其推入堆栈的顶部。当函数执行完毕后，它的执行上下文会从堆栈中弹出，执行上下文堆栈会回到上一个执行上下文。

JavaScript 执行上下文包含的信息有：

1. 变量对象（Variable Object）：存储所有的局部变量、函数声明和函数参数，以及全局变量（在全局执行上下文中）。
2. 作用域链（Scope Chain）：在执行上下文中，它是一个指向当前执行上下文的变量对象和上层执行上下文的作用域链的指针列表。
3. this 指针：指向当前执行上下文的对象。

当 JavaScript 引擎执行代码时，它会根据执行上下文堆栈中的当前执行上下文来确定当前代码的作用域和变量。这就是为什么函数内部可以访问外部变量，但外部不能访问函数内部变量的原因。

### 词法作用域

JavaScript 中的词法作用域是指变量和函数的作用域是在代码编写时静态确定的。换句话说，词法作用域是由代码中变量和函数定义的位置决定的，与代码的执行顺序无关。

```js
var a = 1

function foo() {
  var b = 2
  console.log(a + b)
}

function bar() {
  var b = 3
  console.log(a + b)
}

foo() // 输出3
bar() // 输出4
```

### 作用域链

当 JavaScript 代码执行时，它会先在当前作用域中查找变量和函数。如果找不到，则会向上一级作用域继续查找，直到找到为止。这种查找方式被称为作用域链。

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

## 编程范式

### 函数柯理化

函数柯里化是一种将一个接受多个参数的函数转变为一系列只接受单一参数的函数的技术。

其原理是将一个接收多个参数的函数转化为一个只接收一个参数的函数，并返回一个新的函数，新的函数接收剩余的参数，最终返回结果。

底层实现可以采用闭包和递归的方式实现。具体实现如下：

```js
// 入参是原始函数
function curry(fn) {
  return function curried(...args) {
    // 如果新函数的入参数量达到原始函数的长度，则直接执行
    // fn.length 是形参的个数
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      // 否则，继续返回函数，并拼接参数
      return function (...arg1) {
        return curried.apply(this, args.concat(arg1))
      }
    }
  }
}
```

这里使用了闭包，将原始函数 fn 保存在外部函数 curry 的作用域中。

当调用 curry 函数时，返回一个内部函数 curried，该函数接收一个参数...args，如果参数个数大于等于原始函数 fn 的参数个数，则直接调用原始函数 fn 并返回结果，

否则返回一个新的函数，该函数接收剩余的参数...args2，并将 args 和 args2 合并后递归调用 curried 函数，直到参数个数足够调用原始函数 fn。

```js
// 求和
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

// 问候
function greet(greeting, name) {
  return ${greeting}, ${name}!;
}

const curriedGreet = curry(greet);

console.log(curriedGreet('Hello')('John')); // Hello, John!
console.log(curriedGreet('Hi', 'Mary')); // Hi, Mary!
```

#### 柯理化产生的原因

柯里化的产生源于函数式编程的思想，它是**一种将多个参数的函数转换为一系列只接受一个参数的函数的技术**。**柯里化的主要目的是简化函数的调用方式和提高代码的可读性和可维护性。**

在函数式编程中，函数被视为一等公民，它们可以像其他数据类型一样被传递和操作。因此，将一个多参数的函数转换为一系列只接受一个参数的函数，可以更方便地将函数传递给其他函数或者组合函数。此外，柯里化还可以降低函数的耦合度，使得代码更易于测试和重构。

因此，柯里化是函数式编程中一个非常重要的概念，它可以帮助我们更好地理解和应用函数式编程的思想。

柯里化的主要目的是简化函数的调用方式和提高代码的可读性和可维护性。 下面是一个代码示例，演示这种简化效果？

假设有一个函数 add，用于计算两个数字的和：

```js
function add(x, y) {
  return x + y
}
```

通过柯里化，可以将这个函数转换为接受一个参数的函数，返回一个函数，该函数接受第二个参数并返回结果。这样，我们可以使用更简单的方式调用 add 函数：

```js
function add(x) {
  return function (y) {
    return x + y
  }
}

// 调用方式
add(2)(3) // 5
```

这种方式将函数调用拆分为多个步骤，使代码更易读和维护。此外，这种方式还允许我们部分应用函数，即预先设置一些参数并返回一个新的函数，以便稍后调用。例如：

```js
const addTwo = add(2)
addTwo(3) // 5
addTwo(4) // 6
```

### AOP（Aspect-Oriented Programming）

AOP（Aspect-Oriented Programming）编程是一种编程范式，它可以在不修改原有代码的情况下，通过切面（Aspect）的方式来增强程序的功能。

AOP 的核心思想是将程序的关注点（Concern）分离出来，通过切面来实现这些关注点的功能，从而实现代码的解耦和复用。

在 JavaScript 中，AOP 编程通常通过拦截器（Interceptor）或者装饰器（Decorator）来实现。

拦截器是一种能够在函数执行前、执行后或者抛出异常时拦截函数调用的机制，通过拦截器可以实现日志记录、性能统计、安全检查等功能。装饰器则是一种能够在函数或者类上添加额外功能的机制，通过装饰器可以实现缓存、权限控制、错误处理等功能。

AOP 编程在 JavaScript 中的应用非常广泛，比如在 React 中使用装饰器来实现高阶组件（HOC）、在 Node.js 中使用拦截器来实现中间件等。

> AOP（面向切面编程）是一种编程范式，与函数式编程不同。AOP 是一种通过将横切关注点（如日志记录和事务管理）从主业务逻辑中分离出来，以便更好地管理和维护代码的技术。AOP 使用特定的技术和工具，如切面、连接点、通知和切点等，来实现这种分离。虽然 AOP 和函数式编程都与面向对象编程不同，但它们又各自有不同的特点和应用场景。

实现 AOP 编程的几种方式：

- 使用装饰器模式：在函数或方法执行前后添加额外的逻辑。可以使用 ES6 中的装饰器语法来实现。
- 使用函数柯里化：将原函数拆分为多个小函数，每个小函数执行一个特定的逻辑，然后再将这些小函数组合起来。
- 使用代理模式：通过代理对象来包装原对象，从而在方法执行前后添加额外的逻辑。可以使用 ES6 中的 Proxy 对象来实现。
- 使用切面编程框架：如 Aspect.js，它是一个基于 JavaScript 的切面编程框架，可以通过添加注解来实现 AOP。

#### 使用装饰器：

```js
function log(target, name, descriptor) {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log(`Calling function ${name} with arguments: ${args}`)
    const result = original.apply(this, args)
    console.log(`Function ${name} returned: ${result}`)
    return result
  }
  return descriptor
}

class Calculator {
  @log
  add(a, b) {
    return a + b
  }
}

const calculator = new Calculator()
console.log(calculator.add(2, 3)) // Calling function add with arguments: 2,3
// Function add returned: 5
// 5
```

在上面的示例中，我们定义了一个名为 log 的装饰器函数，它接收三个参数：目标对象、目标函数的名称和描述符对象。我们使用 descriptor.value 来获取原始函数，并将其替换为一个新的函数，该函数在调用原始函数之前和之后输出日志。最后，我们返回修改后的描述符对象。

然后，我们在 Calculator 类的 add 方法上应用了@log 装饰器。当我们调用 add 方法时，会自动打印日志。

#### 使用 Proxy 代理

```js
function withLog(fn) {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      console.log(`[${fn.name}] start`)
      const start = performance.now()
      const result = target.apply(thisArg, args)
      const end = performance.now()
      console.log(`[${fn.name}] end, time: ${end - start}ms`)
      return result
    },
  })
}

class MyClass {
  myMethod() {
    // do something
  }
}

const myObj = new MyClass()
myObj.myMethod = withLog(myObj.myMethod)
```

#### 函数柯理化实现

利用函数柯里化，我们可以将 AOP 逻辑封装成一个高阶函数，返回一个新函数，用于执行原函数并添加 AOP 逻辑。

```js
function withLog(fn) {
  return function (...args) {
    console.log(`[${fn.name}] start`)
    const start = performance.now()
    const result = fn.apply(this, args)
    const end = performance.now()
    console.log(`[${fn.name}] end, time: ${end - start}ms`)
    return result
  }
}

class MyClass {
  myMethod() {
    // do something
  }
}

const myObj = new MyClass()
myObj.myMethod = withLog(myObj.myMethod)
```

## 函数

### 箭头函数

```js
// 1、箭头函数没有prototype(原型)，所以箭头函数本身没有this
let a = () => {};
a.prototype; // undefined

// 2、箭头函数的this指向在定义的时候继承自外层第一个普通函数的this。
var a;
var barObj = { msg: 'barObj' };
var fooObj = { msg: 'fooObj' };

function foo() { a() }
function bar() {
  a = () => console.log(this.msg)
}

bar.call(barObj); // barObj 先执行，定义箭头函数 a，此时 a 就绑定到 barObj 了

foo.call(fooObj); // barObj 然后再执行foo，即使想再次绑定this，但是 a 的指向已经不变了，这里只是执行而已

// 🔥 被继承的普通函数的this指向改变，箭头函数的this指向会跟着改变(因此想修改箭头函数的this指向，可以修改外层)
// 🔥 箭头函数的this指向定义时所在的外层第一个普通函数，跟使用位置没有关系。

// 3、直接修改箭头函数的this指向无效
let fnObj = { msg: '尝试直接修改箭头函数的this指向' };
function foo() {
  a.call(fnObj); // 利用call直接修改，无效
}
foo(); // 依然是 barObj


// 4、箭头函数外层没有普通函数，严格模式和非严格模式下它的this都会指向window(全局对象)
var arrowFn1 = () => {
  // 'use strict'
  console.log(this);
}
arrowFn1(); // window


// 但需要普通函数在是否严格模式下的this指向
function foo() {
  "use strict";
  // 此时函数体处于严格模式下，会被绑定到undefined
  console.log(this.a);
}
var a = 2;
foo();      // TypeError: Cannot read property 'a' of undefined


// 5、箭头函数的arguments
// 5-1、如果箭头函数的this指向window(全局对象)使用arguments会报错，未声明arguments。
let b = () => {
  console.log(arguments);
};
b(1, 2, 3, 4); // Uncaught ReferenceError: arguments is not defined


// 5-2、如果箭头函数的this指向普通函数时,它的argumens继承于该普通函数。
function bar() {
  console.log(arguments); // 1

  bb(1.1);
  function bb() {
    console.log(arguments);            // 1.1
    let a = () => {
      console.log(arguments, 'arrow'); // 1.1 arrow
    };
    a(2); // 这里传入的参数无效，因为arguments继承于外层的普通函数
  }
}
bar(1);

// 6、使用new调用箭头函数会报错
let Foo = () => {};
let b = new Foo();   // Foo is not a constructor

// 7、箭头函数不支持new.target
// es6引入新属性，new.target属性，普通函数如果通过new调用，new.target会返回该函数的引用。
function Foo() {
  console.log(new.target)
}
new Foo();  // Foo {}

let Bar = () => {
  console.log(new.target); // new.target expression is not allowed here
}
Bar();

// 7-1、箭头函数的this指向普通函数，它的new.target就是指向该普通函数的引用。
new Bar();
function Bar() {
  let a = () => {
    console.log(new.target); // Bar {}
  };
  a();
}

// 8、箭头函数不支持重复名字的函数参数
function func1(a, a) {
  console.log(a, arguments); // 2 [1,2]
}
func1(1, 2);

var func2 = (a,a) => {
  console.log(a);      // Duplicate parameter name not allowed in this context
};
func2(1, 2);
```

项目中经常有下面的写法：

```js
const obj = {
  array: [1, 2, 3],
  sum: () => {
    // 外层没有普通函数this会指向全局对象
    return this.array.push('全局对象下没有array，这里会报错') // 找不到push方法
  },
}
obj.sum()

// 只需
const obj = {
  array: [1, 2, 3],
  sum() {
    return this.array.push('全局对象下没有array，这里会ok')
  },
}
obj.sum() // 普通函数中的this指向调用该函数的对象，执行 obj.sum() 后，sum内部的 this 就指向了 obj
```

- 箭头函数是由 name 属性的

## 数组

### 数组去重

```js
// 方式一
const arr = [1, 2, 2, 3, 3, 4, 5, 5]
const uniqueArr = [...new Set(arr)]
console.log(uniqueArr) // [1, 2, 3, 4, 5]

// 方式二
const arr = [1, 2, 2, 3, 3, 4, 5, 5]
// 只取第一次出现的数据
const uniqueArr = arr.filter((item, index, array) => array.indexOf(item) === index)
console.log(uniqueArr) // [1, 2, 3, 4, 5]

// 方式三
const arr = [1, 2, 2, 3, 3, 4, 5, 5]
const uniqueArr = arr.reduce((prev, curr) => (prev.includes(curr) ? prev : [...prev, curr]), [])
console.log(uniqueArr) // [1, 2, 3, 4, 5]

// 方式四
const arr = [1, 2, 2, 3, 3, 4, 5, 5]
const uniqueArr = []
for (let i = 0; i < arr.length; i++) {
  if (uniqueArr.indexOf(arr[i]) === -1) {
    uniqueArr.push(arr[i])
  }
}
console.log(uniqueArr) // [1, 2, 3, 4, 5]

// 方式五
var uniqueArr = arr.reduce((map, item) => {
  map[item] = 0
  // 不能在里面直接返回Object.keys(map)
  // 因为这里返回的map会依然作为下次迭代的初始值
  return map
}, {})
Object.keys(uniqueArr)

// 找到两个数组中，重复的数字
function findDuplicates(arr1, arr2) {
  // 将数组转换为 Set，去除重复元素
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)
  // 使用 filter 方法过滤出两个 Set 都有的元素
  const duplicates = [...set1].filter((item) => set2.has(item))
  return duplicates
}
```

## 文件下载

### 图片下载

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Save Image to Local Album</title>
  </head>
  <body>
    <img
      src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94f4f5c114a4bf4b5f40ae5a8d6b805~tplv-k3u1fbpfcp-zoom-1.png"
      id="image"
    />
    <button style="width: 100px; height: 50px" id="save">点击我，保存图片</button>
    <script>
      var image = document.getElementById('image')
      var saveButton = document.getElementById('save')

      saveButton.addEventListener('click', function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)

        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob)
          var a = document.createElement('a')
          a.href = url
          a.download = 'image.jpg'
          a.click()
          URL.revokeObjectURL(url)
        })
      })
    </script>
  </body>
</html>
```

由于 JavaScript 的同源策略，无法直接监听上面 a 标签文件的下载完成事件。但是，可以通过以下几种方式来实现类似的效果：

- 使用 XMLHttpRequest 请求文件，监听其 load 事件，然后使用 Blob 对象创建 URL，将其赋值给 a 标签的 href 属性，从而实现文件下载。
- 使用 iframe 或者 window.open 打开文件下载链接，然后使用定时器轮询判断文件是否下载完成。
- 使用第三方库，如 FileSaver.js，它提供了一些方法可以直接将文件保存到本地，同时也提供了下载完成的回调函数。

## 继承

1. 原型链继承：通过将子类的原型设置为父类的实例，实现继承。缺点是父类的引用类型属性会被所有子类实例共享。
2. 构造函数继承：通过在子类构造函数中调用父类构造函数，实现继承。缺点是父类原型上的方法和属性无法被继承。
3. 组合继承：将原型链继承和构造函数继承结合起来，既能继承父类原型上的方法和属性，又能避免共享父类引用类型属性的问题。
4. 原型式继承：通过创建一个空对象，将父类实例作为该对象的原型，实现继承。缺点是无法传递参数，同时存在共享父类引用类型属性的问题。
5. 寄生式继承：使用原型式继承，但在返回新对象之前，通过添加方法等操作，增强新对象。缺点同原型式继承。
6. 寄生组合式继承：通过借用构造函数继承父类属性和方法，再通过寄生式继承父类原型上的方法和属性，实现继承。是一种比较完善的继承方式。

### 原型链继承

```javascript
function Parent() {
  this.name = 'parent'
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child() {
  this.age = 18
}
Child.prototype = new Parent()

var child = new Child()
child.sayName() // parent
```

- 将父类的实例作为子类的原型
- 缺点是父类的引用类型属性会被所有子类实例共享。

### 借用构造函数继承

```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  // 在子类里，调用父类的构造函数
  Parent.call(this, name)
  this.age = age
}

var child = new Child('child', 18)
console.log(child.name) // child
console.log(child.age) // 18
```

- 在子类中，直接调用父类的构造函数
- 缺点是父类原型上的方法和属性无法被继承。

### 组合继承

```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child

var child = new Child('child', 18)
child.sayName() // child
```

- 父类的实例，作为子类的原型
- 在子类的构造函数里，调用父类构造函数
- 既能继承父类原型上的方法和属性，又能避免共享父类引用类型属性的问题？？？这是怎么避免的？
  - 当执行 new Parent() 时，Child.prototype 会得到 name 属性
  - 当执行 new Child('child', 18) 时，又会调用 Parent 构造函数，child 实例上又得到一个 name 属性，从而覆盖上一步得到的 name 属性

### 原型式继承

```javascript
function createObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}

var parent = {
  name: 'parent',
  sayName: function () {
    console.log(this.name)
  },
}

var child = createObj(parent)
child.sayName() // parent
```

- 通过创建一个空对象，将父类实例作为该对象的原型，实现继承。比如 parent 就是父类实例，然后创建一个 F 空函数对象，最后实例化 F 并返回
- 缺点是无法传递参数，同时存在共享父类引用类型属性的问题。

#### 寄生式继承

使用原型式继承，但在返回新对象之前，通过添加方法等操作，增强新对象。缺点同原型式继承。

```javascript
function createObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function createChild(parent, age) {
  var child = createObj(parent)
  child.age = age
  return child
}

var parent = {
  name: 'parent',
  sayName: function () {
    console.log(this.name)
  },
}

var child = createChild(parent, 18)
child.sayName() // parent
```

### 寄生组合式继承

通过借用构造函数继承父类属性和方法，再通过寄生式继承父类原型上的方法和属性，实现继承。是一种比较完善的继承方式。

```js
// 原型式继承
function createObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function inheritPrototype(child, parent) {
  var prototype = createObj(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  // 构造函数，继承父类属性和方法
  Parent.call(this, name)
  this.age = age
}
inheritPrototype(Child, Parent)

var child = new Child('child', 18)
child.sayName() // child
```

### new 操作符

在 JavaScript 中，new 操作符用于创建一个对象实例。它的主要作用是将**构造函数与新对象相关联，然后返回该新对象**。

1. 创建一个空对象
2. 将该空对象的原型指向构造函数的原型对象
3. 将构造函数的 this 指向新的空对象
4. 执行构造函数，并传参给构造函数
5. 如果构造函数返回一个对象，则返回该对象，否则返回该空对象

```js
function myNew(constructor, ...args) {
  // Object.create(proto[, propertiesObject])
  // 创建一个新对象，使用提供的对象来提供给新对象的__proto__
  // var o = new Object();             //1、新建空对象
  // o.__proto__ = Foo.prototype;      //2、建立连接
  const obj = Object.create(constructor.prototype)
  const res = constructor.apply(obj, args)
  return res instanceof Object ? res : obj
}
```

- 使用 new 时，跟定后面跟着一个构造函数，比如 new F()的 F
- 同时要让新对象的 **proto** 指向构造函数的 prototype，直接 Object.create 即可
- 要想继承构造函数里的属性，则必须执行他
- 然后还得修改 this，并传参为己所用
- 最后判断返回的对象

## 数据劫持

### Object.defineProperty

### Proxy

```js
const proxy = new Proxy(target, handler)
```

- target 是要代理的目标对象，可以是任何类型的对象，
- handler 则是一个对象，用于定义代理对象的行为。handler 中定义了一些特殊的方法，称为“陷阱函数”（trap functions），当代理对象被操作时，会自动调用这些陷阱函数来实现代理的行为。

下面是 handler 中常用的陷阱函数：

- get(target, property, receiver)：当读取代理对象的属性时调用。
- set(target, property, value, receiver)：当设置代理对象的属性时调用。
- apply(target, thisArg, argumentsList)：当代理对象作为函数被调用时调用。
- construct(target, argumentsList, newTarget)：当代理对象作为构造函数被调用时调用。
- has(target, property)：当使用 in 操作符或 Reflect.has() 方法检查属性是否存在时调用。
- deleteProperty(target, property)：当使用 delete 操作符或 Reflect.deleteProperty() 方法删除属性时调用。
- getOwnPropertyDescriptor(target, property)：当使用 Object.getOwnPropertyDescriptor() 方法获取属性描述符时调用。
- defineProperty(target, property, descriptor)：当使用 Object.defineProperty() 或 Object.defineProperties() 方法定义属性时调用。

除了以上陷阱函数外，还有一些其他的陷阱函数，如 getPrototypeOf()、setPrototypeOf()、isExtensible()、preventExtensions()、getOwnPropertyNames()、getPrototypeOf() 等

## 异步加载

### 异步加载图片

```js
function loadImgAsync(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('could not load img at ' + url))
    }
    img.src = url
  })
}
```

### 无所不在的统计代码

```js
// 无所不在的百度统计代码，这便是常规的按需加载，用的时候执行以下就好(可以用事件触发)
;(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?<xxxxx>'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()
```

### 实现 vue 项目中的按需加载

```js
function load(componentName, path) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script')
    script.src = path
    script.async = true
    script.onload = function () {
      // 通过Vue.component验证组件，存在就resolve,否则reject
      var component = Vue.component(componentName)
      if (component) {
        resolve(component)
      } else {
        reject()
      }
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

var router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: {
        template: '<div>Home page</div>',
      },
    },
    {
      path: '/about',
      component: function (resolve, reject) {
        // 使用自定义的loda函数加载
        load('about', 'about.js').then(resolve, reject)
      },
    },
  ],
})

var app = new Vue({
  el: '#app',
  router: router,
})
```

### 配合 webpack 的按需加载

```js
// 配合webpack
const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    {
      path: '/about',
      // Vue.js支持component定义为一个函数：function (resolve) {}，
      // 在函数内，可以使用类似node.js的库引入模式
      // 这个特殊的require语法告诉webpack自动将编译后的代码分割成不同的块，这些块将通过按需自动下载。
      component: function (resolve) {
        require(['./components/about'], resolve)
      },
    },
    { path: '/', redirect: '/home' },
  ],
})

// 现在项目使用这种方式
// 1. import() 不同于 import，该方法为了动态加载模块而引入的新语法
// 2. import() 返回结果是 Promise
const router = new VueRouter({
  routes: [
    {
      path: `${rootPath}/pages`,
      redirect: { name: 'Home' },
      // import() 用于动态加载模块，其引用的模块及子模块会被分割打包成一个独立的 chunk。
      component: () => import('views/layout'),
      children: [
        {
          path: 'home',
          // Webpack 还允许以注释的方式传参，进而更好的生成 chunk。
          component: () =>
            import(
              /* webpackInclude: /\.json$/ */
              /* webpackExclude: /\.noimport\.json$/ */
              /* webpackChunkName: "my-chunk-name" */
              /* webpackMode: "lazy" */
              'views/blank'
            ),
          meta: { title: '首页', isHomePage: true },
          name: 'Home',
        },
      ],
    },
  ],
})

// webpack中使用的三种异步加载方式
// 1、System.import()； 已废除，不推荐
// 2、require.ensure()； v1和v2均可使用
// 3、import()；v2支持，v1不支持
```

### webpack 按需加载实现

#### 同步代码分割 require.ensure

同步代码分割是通过使用 require.ensure 方法来实现的。require.ensure 方法接收三个参数：需要分割的模块，分割后的模块名，以及分割后的模块对应的 chunk 的名称

```js
require.ensure(
  [],
  function (require) {
    var module = require('./module')
  },
  'module'
)
```

这段代码表示将./module 模块进行分割，分割后的模块名为 module，对应的 chunk 名称也为 module。

```js
// 手动实现一个requrieEnsure 函数
// 这里是并发，发起多个请求，还可以实现类似，promiseAll或者promiseLimit
function requireEnsure(dependencies, callback) {
  var module = {}
  var loadedDependencies = 0

  function loadDependency(dependencyIndex) {
    var dependency = dependencies[dependencyIndex]
    var script = document.createElement('script')
    script.src = dependency

    script.onload = function () {
      loadedDependencies++
      if (loadedDependencies === dependencies.length) {
        callback(module)
      }
    }

    document.head.appendChild(script)
  }

  for (var i = 0; i < dependencies.length; i++) {
    loadDependency(i)
  }
}
```

#### 异步代码分割 import()

异步代码分割是通过使用 import()方法来实现的。import()方法返回一个 Promise 对象，可以使用 then 方法来获取分割后的模块

```js
import('./module').then(function (module) {
  // do something with module
})
```

这段代码表示将./module 模块进行分割，并在分割后的模块加载完成后执行回调函数。

**手动实现一个 import()函数**

```js
async function import(moduleName) {
  const moduleUrl = `/modules/${moduleName}.js`;
  const response = await fetch(moduleUrl);
  const moduleSource = await response.text();
  const moduleExports = eval(moduleSource);
  return moduleExports.default;
}
```

### webpack 插件

该插件会在 webpack 编译完成后，遍历所有生成的 JS 文件，查找其中的 setTimeout 和 setInterval 调用，然后将它们收集到一个数组中。如果指定了 outputFile 选项，则将结果保存到指定文件中。否则，只输出收集到的定时器数量。

```js
const fs = require('fs')

class TimerCollectorPlugin {
  constructor(options) {
    this.options = options || {}
    this.timers = []
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('TimerCollectorPlugin', (compilation, callback) => {
      const assets = compilation.assets
      const keys = Object.keys(assets)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key.endsWith('.js')) {
          const content = assets[key].source()
          const regex = /setTimeout|setInterval/g
          let match
          while ((match = regex.exec(content)) !== null) {
            this.timers.push(match[0])
          }
        }
      }
      if (this.options.outputFile) {
        fs.writeFile(this.options.outputFile, JSON.stringify(this.timers), (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log(
              `TimerCollectorPlugin: ${this.timers.length} timers collected and saved to ${this.options.outputFile}`
            )
          }
          callback()
        })
      } else {
        console.log(`TimerCollectorPlugin: ${this.timers.length} timers collected`)
        callback()
      }
    })
  }
}

module.exports = TimerCollectorPlugin
```

使用插件

```js
const TimerCollectorPlugin = require('./TimerCollectorPlugin')

module.exports = {
  // ...
  plugins: [
    new TimerCollectorPlugin({
      outputFile: 'timers.json', // 可选，指定输出文件路径
    }),
  ],
}
```

## 事件循环

## 空间占用

- 1GB = 1024MB = 1024 _ 1024Kb = 1024 _ 1024 \* 1024Byte（字节）
- 一个字节 就是 8 位
- 整数（int）：通常占用 4 个字节（32 位），但在某些编程语言中可能占用 2 个或 8 个字节。
- 长整数（long）：通常占用 8 个字节（64 位），但在某些编程语言中可能占用 4 个或 16 个字节。
- 浮点数（float）：通常占用 4 个字节（32 位），但在某些编程语言中可能占用 8 个字节。
- 双精度浮点数（double）：通常占用 8 个字节（64 位），但在某些编程语言中可能占用 4 个或 16 个字节。
- 字符（char）：通常占用 1 个字节，但在某些编程语言中可能占用 2 个或更多字节。

需要注意的是，这些数字类型的大小可能因编程语言、硬件平台和操作系统而异。

```js
function memorySizeOf(obj) {
  var bytes = 0

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8
          break
        case 'string':
          bytes += obj.length * 2
          break
        case 'boolean':
          bytes += 4
          break
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1)
          if (objClass === 'Object' || objClass === 'Array') {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue
              sizeOf(obj[key])
            }
          } else bytes += obj.toString().length * 2
          break
      }
    }
    return bytes
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(3) + ' KiB'
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(3) + ' MiB'
    else return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(3) + ' GiB'
  }

  return formatByteSize(sizeOf(obj))
}
```
