---
title: '数据结构'
date: Fri May 12 2023 21:18:08 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['数据结构', '递归', '迭代']
draft: false
summary: '软件架构的规则是相同的！！！'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/clean-architecture
---

## 前言

## 第一部分：数组

### 数组的几种创建方式：

- Array.from(arrayLike[, mapFn[, thisArg]]) 将一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
- Array.of() 创建一个具有可变数量参数的新数组实例

Array.from(arrayLike[, mapFn[, thisArg]]) 的用法：

```js
// 💥 1、字符串会被拆分为单字符数组
console.log(Array.from('Matt')) // ["M", "a", "t", "t"]

// 💥 2、Array.from()对现有数组执行浅复制
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1) // [1, 2, 3, 4]

// 💥 3、可以使用任何可迭代对象
const iter = {
  // ES6引入了一批常用内置符号(well-known symbol)，用于暴露语言内部的行为，
  // 开发者 可以直接访问、重写或模拟这些行为。这些内置符号都以 Symbol 工厂函数字符串属性的形式存在。
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
    yield 4
  },
}
console.log(Array.from(iter)) // [1, 2, 3, 4]

// 💥 4、像数组结构 -》鸭子模型
const arrayLike = {
  1: 1,
  length: 2,
}
console.log(Array.from(arrayLike)) // [undefined, 1]

// 💥 5、Array.from() 的参数2，可以实现map的功能，不像 Array.from().map()那样先创建一个中间数组，如下：
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1, (x) => x ** 2) // [1, 4, 9, 16]

// 6、Array.from() 的参数3，可以指定this，如下：
const a1 = [1, 2, 3, 4]
const a3 = Array.from(
  a1,
  function (x) {
    return x ** this.exponent
  },
  { exponent: 2 }
)
console.log(a3) // [1, 4, 9, 16]
// 注意：不支持箭头函数

// 💥 7、Array.of
console.log(Array.of(1, 2, 3, 4)) // [1, 2, 3, 4]
console.log(Array.of(undefined)) // [undefined]

// 对比Array()，
Array(2) // [, ,]
Array.of(2) // [2]
```

### 数组常用的方法 💥 🔥

1. push() - 将一个或多个元素添加到数组的末尾，并**返回新的长度**
2. pop() - 移除数组的最后一个元素，并**返回该元素的值**
3. shift() - 移除数组的第一个元素，并**返回该元素的值**
4. unshift() - 将一个或多个元素添加到数组的开头，并**返回新的长度**
5. concat() - 将两个或多个数组合并成一个新数组，无返回值
6. slice() - 返回一个新的数组，包含从开始到结束（不包括结束）的所有元素
7. splice() - 在指定位置删除或添加一个或多个元素
8. reverse() - 反转数组的顺序
9. sort() - 对数组进行排序
10. indexOf() - 返回指定元素在数组中的第一个匹配项的索引，如果不存在则返回-1
11. lastIndexOf() - 返回指定元素在数组中最后一个匹配项的索引，如果不存在则返回-1
12. forEach() - 对数组中的每个元素执行指定的函数
13. map() - 对数组中的每个元素执行指定的函数，并返回一个新的数组
14. filter() - 返回一个新的数组，其中包含满足指定条件的所有元素
15. reduce() - 对数组中的所有元素执行指定的函数，并返回一个累积值

```js
// 💥 1、push()：向数组末尾添加一个或多个元素，并返回新的长度。
let arr = [1, 2, 3]
arr.push(7) // 4 🔥 返回数组长度
console.log(arr) // [1, 2, 3, 7]

// 💥 2、pop()：从数组末尾删除一个元素，并返回该元素的值。
let arr = [1, 2, 3]
let last = arr.pop()
console.log(last) // 3  返回元素的值
console.log(arr) // [1, 2]

// 💥 3、shift()：从数组开头删除一个元素，并返回该元素的值。
let arr = [1, 2, 3]
let first = arr.shift()
console.log(first) // 1
console.log(arr) // [2, 3]

// 💥 4、unshift()：向数组开头添加一个或多个元素，并返回新数组的长度。
let arr = [1, 2, 3]
arr.unshift(0, -1) // 🔥 可以添加一个或多个, 返回 长度
console.log(arr) // [-1, 0, 1, 2, 3]

// 💥 5、splice()：从数组中删除或添加元素。🔥 返回删除的值，数组
let arr = [1, 2, 3]
arr.splice(1, 1, 4, 5) // 🔥 从索引1的位置，删除 1个值，并插入 4,5两个值
console.log(arr) // [1, 4, 5, 3]
arr.splice(-1, 1) // [3]  🔥 从数组末尾开始
console.log(arr) // [1, 4, 5]

// 💥 6、slice()：返回数组的一个子集。前闭后开
let arr = [1, 2, 3, 4, 5, 6, 7, 8]
let subArr = arr.slice(1, 4) //
console.log(subArr) // [2, 3, 4]
// 如果为负数，则表示从数组末尾开始
// array.slice(-2,-1) 表示从数组倒数第二个元素（包括该元素）开始截取，一直截取到数组倒数第一个元素（不包括该元素）。
let sub1Arr = arr.slice(2, -1) // [3, 4, 5, 6, 7] 🔥 整数第二个，到倒数第一个
console.log(sub1Arr)
let sub2Arr = arr.slice(-2, -1) // [7] 🔥
let sub3Arr = arr.slice(-2, -3) // [] 🔥 开始比结束还要后。。。不存在这样的值，所以为空

// 💥 7、concat()：连接两个或多个数组，并返回新数组
let arr1 = [1, 2, 3]
let arr2 = [4, 5]
let newArr = arr1.concat(arr2, '66') // 🔥 不需要解构即可，还支持单个值
console.log(newArr) // [1, 2, 3, 4, 5, '66']

// 💥 8、indexOf()：返回数组中指定元素的第一个匹配项的索引，如果不存在则返回-1。
let arr = [1, 2, 3, 4, 5]
let index = arr.indexOf(3)
console.log(index) // 2
let index1 = arr.indexOf(3, 3) // 🔥 参数2是，从哪个索引开始查询，不支持负数
console.log(index1) // -1

// 💥 9、lastIndexOf()：返回数组中指定元素的最后一个匹配项的索引，如果不存在则返回-1。
let arr = [1, 2, 3, 4, 3]
let index = arr.lastIndexOf(3)
console.log(index) // 4 倒数第一个就是
let index1 = arr.lastIndexOf(3, 2)
console.log(index1) // 2 从倒数第二个往前找，也就是中间的3，索引 2

// 💥 10、对数组中的每个元素执行一次指定的函数。
let arr = [1, 2, 3]
arr.forEach(function (item) {
  console.log(item)
})

// 💥 11、reduce()：方法是 JavaScript 数组的一个高阶函数，可以用来对数组中的每个元素依次执行一个指定的操作，最终返回一个累加的结果。
// reduce() 方法接收两个参数：
// 1. 一个回调函数，该函数接收四个参数：
//    累加器（accumulator）：初始值或上一次回调函数返回的值。
//    当前值（currentValue）：当前元素的值。
//    当前索引（index）：当前元素在数组中的索引。
//    数组（array）：调用 reduce() 方法的数组本身。
// 2. 一个可选的初始值（initialValue），用于作为第一次调用回调函数时的累加器的值。如果没有提供初始值，则将使用数组的第一个元素作为初始值。
// array.reduce(callback[, initialValue])
const numbers = [1, 2, 3, 4, 5]
const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
}, 0)
console.log(sum) // 15

// 给定一个字符串，取出嵌套对象里的值
const val = 'a.b.1.d'.split('.').reduce(
  (acc, cur) => {
    return acc[cur]
  },
  { a: { b: [{}, { d: 'cool' }] } }
)
console.log(val) // cool

// 给定一个嵌套数组，收集二级数组列表
const arr = [
  {
    list: [{ a: 1 }],
  },
  {
    list: [{ b: 1 }, { c: 1 }],
  },
]
const val = arr.reduce((acc, cur) => {
  return acc.concat(cur.list)
}, [])
console.log(val) // [{...}, {...}, {...}]

// 💥 12、sort() 排序，原位（in-place）排序 修改原数组
// reverse 不够灵活，所以才有了 sort
// 默认情况下，sort()会按**照升序重新排列数组元素**，即最小的值在前面，最大的值在后面。
// 为此，sort()会在每一项上调用 String()转型函数，然后**比较字符串**来决定顺序。即使**数组的元素都是数值，也会先把数组转换为字符串再比较、排序**。
let values = [0, 1, 5, 10, 15]
values.sort() // 0,1,10,15,5  🔥 注意只是在每一项上字符串化，然后排序

// 默认只会比较开头的第一个字符串，获取unicode编码
'10'.charCodeAt(0) // 49
'5'.charCodeAt(0) // 53
'a'.charCodeAt() // 97
'A'.charCodeAt() // 65
String.fromCharCode(65) // A

// 注意：在js内部，字符以UTF-16格式存储，也就是2字节。
// 但对于那些需要4字节存储的字符，上述方法无法识别，
let s = '𠮷a'

// 被处理错误
s.length // 3 错误
s.charAt(0) // '' ，读不出来
s.charAt(1) // '' ，读不出来
s.charCodeAt(0) // 55362，前两个字节
s.charCodeAt(1) // 57271，后两个字节

// 被正确处理，'𠮷a'视为三个字符，“𠮷”的十进制码点134071，后两个字节，最后是a
s.codePointAt(0) // 134071，被截取且完整的读出来了
s.codePointAt(1) // 57271，后两个字节
s.codePointAt(2) // 97

// 如何处理长度呢？
// ES6提供了codePointAt方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。
// 占2个字节的字符最大的码点为0xFFFF(十进制为65536）。超过65536（0xFFFF）的字符占4个字节。
//  🔥 一个字节是8位，也就是 2^8 = 256，小于256都是一个字节，大于256 小于 256 * 2^8 = 65536 就是两字节
// 可以借助for...of，其可以利用codePointAt处理4字节字符
let len = 0
for (let char of s) {
  if (char.codePointAt(0) > 0xffff) {
    len += 4
  } else if (char.codePointAt(0) > 0x00ff) {
    len += 2
  } else {
    len += 1
  }
}
console.log(len) // 5

// 或者
var textEncoder = new TextEncoder('utf-8')
textEncoder.encode('𠮷a').length // 5
```

## 第二部分：递归

简单来说，函数的递归调用就是自己调用自己，即一个函数在调用其他函数的过程中，又出现了对自身的调用，这种函数称为递归函数。

- 直接调用：f() -> f()
- 间接调用：f() -> f1() -> f()

其实递归的思想，是分而治之，而且每次的输入值的范围都会变小，知道设置的条件满足即退出

**示例一：从给定的数字倒数到最小的数字，每次减 1。**

```js
function countDown(num) {
  if (num === 1) {
    return num
  }
  // console.log(num)

  // 输入值：每次都减少
  return countDown(num - 1)
}
```

**示例二：如何证明一个数字是奇数还是偶数**

- 可以通过 num % 2 == 0
- 还可以，每次都 - 2，最后若是 1 就是奇数，若为 0，则为偶数

```js
const oddOrEven = (num) => {
  if (num === 0) {
    return 'Even'
  } else if (num === 1) {
    return 'Odd'
  } else {
    return oddOrEven(num - 2)
  }
}
console.log(oddOrEven(20)) // Even
console.log(oddOrEven(75)) // Odd
```

**示例三：输出 50 以内斐波那契数列**

斐波那契额数列的特点：`1,1,2,3,5,8,13`，从第三个值开始，每个值都是前两者的和

```js
const fib = (num) => {
  // 停止条件
  if (num === 1 || num === 2) {
    return 1
  }

  // 每次减小范围
  return fib(num - 1) + fib(num - 2)
}

console.time()
fib(30)
console.timeEnd() // 13.01611328125ms
// 💥 🔥default: 16.1640625 ms

console.time()
fib(50)
console.timeEnd()
// 💥 🔥default: 130814.3779296875 ms

// 130814.3779296875 / 13.01611328125 = 10050.187417939003 倍
// 130814.3779296875 也就是 130s -> 2分钟10秒
```

```js
// 用数组存放对应的值
const fib1 = (num) => {
  if (num < 2) {
    return [0, 1]
  }
  // 最后的结果肯定是：target = fib1(num - 1) + fib1(num) 也就是 倒数第二位的值 + 倒数第一位的值
  //                target = fib1(num - 1) + (fib1(num - 1) + fib1(num - 2))

  // 倒数第二位
  let arr = fib1(num - 1)
  // 加入最后一位的值
  arr.push(arr[arr.length - 1] + arr[arr.length - 2])
  return arr
}

fib1(10) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

在使用递归的地方，都是可以使用迭代的，而且效率更高

递归效率低，是因为每次递归都会创建函数备份，占用内存空间，同时也有堆栈溢出的风险

所谓迭代，一般就是循环

```js
const fib2 = (num) => {
  let arr = [0, 1]
  if (num < 2) return arr.slice(0, n) // slice语法是：[)，也就是前闭后开

  // 大于2之后，则都是之前的累加
  for (let i = 2; i < num; i++) {
    arr.push(arr[i - 1] + arr[i - 2])
  }

  return arr
}
fib2(10) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
fib2(5) // [0, 1, 1, 2, 3]
```

递归的执行过程如下图

- 回推过程
- 递推过程

![递归过程](/static/images/recoursion-process.png)

## 第三部分：动态规划

动态规划是一种算法设计技术，它是解决一类最优化问题的有效方法。它的基本思想是将原问题分解成若干个子问题，通过求解子问题的最优解，得到原问题的最优解。

动态规划的原理可以概括为以下几个步骤：

1. 定义状态：将原问题分解成若干个子问题，并定义每个子问题的状态。
2. 定义状态转移方程：根据子问题之间的关系，建立状态转移方程。
3. 确定边界条件：确定子问题的边界条件，即最小的子问题的解。
4. 求解最优解：根据状态转移方程和边界条件，逐步求解子问题的最优解，最终得到原问题的最优解。

动态规划的主要特点是具有重叠子问题和最优子结构性质。重叠子问题指的是每个子问题都有多个重复的子问题，可以通过缓存已经求解过的子问题的解来避免重复计算。最优子结构性质指的是原问题的最优解可以通过子问题的最优解来求解。

动态规划的应用广泛，比如最长公共子序列、背包问题、最短路径问题等都可以使用动态规划来求解。

### 如何高效的给出 动态规划类问题的解法

1. 理解问题的本质：动态规划算法是**解决最优化问题的一种方法**，通常需要对问题进行抽象和建模。因此，理解问题的本质和特点是非常重要的，只有深入理解问题，才能够有效地设计和实现动态规划算法。
2. 确定状态和状态转移方程：动态规划算法的核心是**状态和状态转移方程**。因此，在设计动态规划算法时，需要明确定义状态，并确定状态之间的转移关系。这通常需要一定的数学建模和分析能力。
3. 利用备忘录和递归：**动态规划算法通常需要解决大量的子问题，因此，可以使用备忘录和递归的方法来避免重复计算。备忘录可以记录已经计算过的结果，避免重复计算。递归可以将问题分解成更小的子问题，**便于求解。
4. 优化空间复杂度：动态规划算法**通常需要使用一个二维数组或者更大的空间来记录状态和转移方程**。为了优化空间复杂度，可以使用滚动数组或者状态压缩的方法来减少空间占用。
5. 利用优化技巧：动态规划算法通常需要进行一些优化，例如剪枝、贪心、二分等技巧。这些技巧可以帮助我们更快地求解问题，提高算法效率。

- 剪枝：在动态规划过程中，某些状态的计算可能会被重复执行，造成时间复杂度的增加。剪枝就是通过某些方法，避免不必要的重复计算，从而提高算法的效率。
- 贪心：贪心算法是一种基于贪心策略的算法，它在每一步都选择当前状态下的最优解，从而得到全局最优解。在动态规划中，贪心算法可以用来优化状态转移方程，减少状态的数量和计算量。

## 第三部分：数组

## 第三部分：数组

## 第三部分：数组

## 第三部分：数组

## 第三部分：数组
