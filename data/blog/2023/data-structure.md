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

## 算法归类

### 双指针法与滑动窗口算法

双指针法和滑动窗口算法都是解决数组或字符串的问题的常用算法，它们的区别如下：

- 双指针法通常用于解决数组或字符串的查找、排序、去重等问题，而滑动窗口算法通常用于解决子串或子数组的问题，例如最长子串、最小覆盖子串等。
- 双指针法通常是将两个指针从数组或字符串的两端开始移动，根据题目要求调整指针的移动方式，直到找到符合要求的结果。而滑动窗口算法通常是维护一个窗口，通过移动窗口的起点和终点来寻找符合要求的子串或子数组。
- 双指针法的时间复杂度通常是 O(n)，因为需要遍历整个数组或字符串。而滑动窗口算法的时间复杂度通常是 O(n)，因为每个元素只会被访问一次。
- 双指针法的空间复杂度通常是 O(1)，因为只需要维护两个指针。而滑动窗口算法的空间复杂度通常是 O(k)，其中 k 是窗口的大小。

总的来说，双指针法和滑动窗口算法都是比较常用的算法，具体选择哪种算法取决于问题的具体要求。

## 数组

- 二分查找：在有序数组中查找指定元素，时间复杂度 O(logn)。
- 双指针法：用两个指针从数组的两端开始向中间移动，解决一些数组相关的问题，如求和、查找等。
- 滑动窗口：在数组或字符串上，通过维护一个窗口来解决一些子串或子序列相关的问题。
- 前缀和：用于快速求解连续子数组的和，通过预处理数组的前缀和，可以在 O(1)时间内求解任意子数组的和。
- 合并两个有序数组：将两个有序数组合并成一个有序数组，时间复杂度 O(n)，可以用于归并排序。
- 快速排序：通过分治法的思想，将一个数组分成两个子数组，分别排序，最终合并成一个有序数组，时间复杂度 O(nlogn)。
- 桶排序：将待排序数组元素根据某个特征值分配到不同的桶中，再对每个桶内的元素进行排序，最终将所有桶合并成一个有序数组，时间复杂度 O(n)。
- 计数排序：统计待排序数组中每个元素出现的次数，再根据元素出现的次数将元素放到相应的位置上，时间复杂度 O(n)。
- 二叉堆：一种基于完全二叉树的数据结构，可以用于实现优先队列、堆排序等算法，时间复杂度 O(nlogn)。
- 动态规划：通过将问题分解成子问题的方式，得到最优解的算法，可以用于解决一些数组相关的问题，如最长递增子序列、最大子数组和等。

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

### 合并两个有序数组

```js
function mergeSortedArrays(arr1, arr2) {
  let mergedArr = []
  let i = 0
  let j = 0

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      mergedArr.push(arr1[i])
      i++
    } else {
      mergedArr.push(arr2[j])
      j++
    }
  }

  while (i < arr1.length) {
    mergedArr.push(arr1[i])
    i++
  }

  while (j < arr2.length) {
    mergedArr.push(arr2[j])
    j++
  }

  return mergedArr
}
```

- 注意，因为数组本来就有序，而且 i，j 其实并不是同步变化的

这个函数接受两个有序数组作为参数，并返回一个合并后的有序数组。

1. 它使用两个指针 i 和 j 来比较两个数组中的元素，并将较小的元素添加到合并数组中。
2. 一旦一个数组的指针到达其末尾，该函数将继续将另一个数组中的所有元素添加到合并数组中。
3. 最后，它返回合并后的有序数组。

### 实现一个数组的全排列

#### 方式一

1. 将数组分成两部分：第一个元素和剩余的元素
2. 对剩余的元素进行全排列（递归）
3. 将第一个元素插入到剩余元素全排列的每个位置
4. 重复执行以上步骤，直到全部排列完毕

```js
function permute(arr) {
  // 如果数组只有一个元素，直接返回该元素
  if (arr.length === 1) {
    return [arr]
  }

  // 获取第一个元素和剩余的元素
  const [first, ...rest] = arr

  // 递归获取剩余元素的全排列
  const permutations = permute(rest)

  // 将第一个元素插入到每个排列各个位置
  const result = []
  for (let i = 0; i < permutations.length; i++) {
    const permutation = permutations[i]
    console.log('djch permutation', JSON.stringify(permutation))

    for (let j = 0; j <= permutation.length; j++) {
      const newPermutation = [...permutation.slice(0, j), first, ...permutation.slice(j)]
      result.push(newPermutation)
      console.log(
        'djch newPermutation',
        JSON.stringify(newPermutation),
        first,
        JSON.stringify(result)
      )
    }
  }
  // djch permutation [3]
  // djch newPermutation [2,3] 2 [[2,3]]
  // djch newPermutation [3,2] 2 [[2,3],[3,2]]
  // djch permutation [2,3]
  // djch newPermutation [1,2,3] 1 [[1,2,3]]
  // djch newPermutation [2,1,3] 1 [[1,2,3],[2,1,3]]
  // djch newPermutation [2,3,1] 1 [[1,2,3],[2,1,3],[2,3,1]]
  // djch permutation [3,2]
  // djch newPermutation [1,3,2] 1 [[1,2,3],[2,1,3],[2,3,1],[1,3,2]]
  // djch newPermutation [3,1,2] 1 [[1,2,3],[2,1,3],[2,3,1],[1,3,2],[3,1,2]]
  // djch newPermutation [3,2,1] 1 [[1,2,3],[2,1,3],[2,3,1],[1,3,2],[3,1,2],[3,2,1]]

  return result
}

// 示例
const arr = [1, 2, 3]
const result = permute(arr)
console.log(result)
```

该算法的时间复杂度为 O(n\*n!)，其中 n 为数组 arr 的长度。

首先，在函数的第一行，如果数组只有一个元素，直接返回该元素，时间复杂度为 O(1)。

然后，获取第一个元素和剩余的元素的时间复杂度为 O(1)。

接着，递归获取剩余元素的全排列的时间复杂度为 O((n-1) \* (n-1)!)，因为每次递归都会减少一个元素，所以递归的次数是 n-1，每次递归都要进行全排列，因此时间复杂度为(n-1)!。

最后，将第一个元素插入到每个排列的位置的时间复杂度为 O(n!)，因为每个排列的长度为 n-1，所以需要将第一个元素插入到 n-1 个位置，共有(n-1)!个排列。

因此，总的时间复杂度为 O(n\*n!)。

#### 方式二

```js
function permute(input) {
  var permArr = [],
    usedChars = []

  function permuteHelper(input) {
    for (var i = 0; i < input.length; i++) {
      var ch = input.splice(i, 1)[0]
      usedChars.push(ch)

      if (input.length == 0) {
        permArr.push(usedChars.slice())
      }
      console.log(
        'djch ',
        i,
        JSON.stringify(input),
        ch,
        JSON.stringify(usedChars),
        JSON.stringify(permArr)
      )
      // djch  0 [2,3] 1 [1]     []
      // djch  0 [3]   2 [1,2]   []
      // djch  0 []    3 [1,2,3] [[1,2,3]]
      permuteHelper(input)
      input.splice(i, 0, ch)
      usedChars.pop()
      console.log(
        'djch _',
        i,
        JSON.stringify(input),
        ch,
        JSON.stringify(usedChars),
        JSON.stringify(permArr)
      )
      // djch _ 0 [3]   3 [1,2] [[1,2,3]]
      // djch _ 0 [2,3] 2 [1]   [[1,2,3]]
    }
    return permArr
  }

  return permuteHelper(input)
}

// 示例用法
console.log(permute([1, 2, 3]))
```

1. 首先，函数遍历输入字符串的每个字符，并将其从输入字符串中删除。
2. 然后，将该字符添加到 usedChars 数组中，并检查输入字符串的长度是否为 0。
3. 如果是，将 usedChars 数组的副本添加到 permArr 数组中。
4. 然后，继续递归调用 permuteHelper 函数，直到所有排列都被生成。
5. 在返回到上一层递归时，将该字符重新添加到输入字符串中，并将其从 usedChars 数组中删除。

最后，函数返回 permuteHelper 函数的结果，即所有排列的数组。

该函数的原理是通过递归调用自身来生成所有可能的排列。在每次递归调用中，函数从输入数组中取出一个元素，并将其添加到已使用的字符数组中。当输入数组为空时，表示已经生成了一个排列，将其添加到结果数组中。然后，函数将当前元素重新插入到输入数组中，并从已使用的字符数组中删除它，以便生成下一个排列。最终，函数返回包含所有排列的结果数组。

这个算法的时间复杂度为 O(n!),其中 n 是输入数组 input 的长度。这是因为该算法使用递归来生成所有可能的排列，每次递归都会将数组 input 中的一个元素与已经生成的排列组合，因此总共需要进行 n 次递归。在每次递归中，需要遍历 input 数组中的所有元素，因此总共需要进行 n!次遍历。因此，该算法的时间复杂度为 O(n!)。

该算法的空间复杂度为 O(n^2)，其中 n 是输入数组的长度。这是因为该算法使用了两个辅助数组：permArr 和 usedChars，每个数组的长度最大为 n。此外，递归调用 permuteHelper 函数时，会创建 n 个新的函数调用栈，每个函数调用栈的空间复杂度为 O(n)。因此，总空间复杂度为 O(n^2 + n\*n) = O(n^2)。

### 数组支持负索引

- 数组除了常规的 `arr[index]` 获取数据外，还可以 arr.get(index) 获取

```js
Array.prototype.get = function (index) {
  if (index < 0) {
    return this[this.length + index]
  } else {
    return this[index]
  }
}

// 使用负索引获取数组元素
const list = [1, 2, 3]
console.log(list.get(-1)) // 输出 3

// 还可以如下，自定义负索引
list[-1] = list[list.length - 1]
list[-2] = list[list.length - 2]
list[-3] = list[list.length - 3]

console.log(list[-1]) // 输出 3
```

### 最长连续递增序列

给定一个未经排序的整数数组，找到最长且 连续递增的子序列，并返回该序列的长度。

连续递增的子序列 可以由两个下标 `l 和 r（l < r）`确定，如果对于每个 `l <= i < r，都有 nums[i] < nums[i + 1]` ，那么子序列 `[nums[l], nums[l + 1], ..., nums[r - 1], nums[r]]` 就是连续递增子序列。

```
输入：nums = [1,3,5,4,7]
输出：3
解释：最长连续递增序列是 [1,3,5], 长度为3。
尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。
```

```js
function findLengthOfLCIS(nums) {
  // 没有长度，直接返回0
  if (nums.length === 0) {
    return 0
  }

  // 定义最大和当前长度分别为1，当前长度每次都会运行，而最大值只会在特定时机发生变化
  let maxLength = 1
  let currentLength = 1

  for (let i = 1; i < nums.length; i++) {
    // 如果后面的比前面的大，则当前长度增加
    if (nums[i] > nums[i - 1]) {
      currentLength++
    } else {
      // 否则，对比最大值，重新赋值
      maxLength = Math.max(maxLength, currentLength)
      // 同时清空当前值
      currentLength = 1
    }
  }
  // 最后再次对比
  return Math.max(maxLength, currentLength)
}
```

- 属于快慢指针，双指针

时间复杂度为 O(n)，其中 n 是数组 nums 的长度，因为算法需要遍历整个数组一次。

空间复杂度为 O(1)，因为算法只使用了常数个额外变量来存储当前长度和最大长度，不随输入规模变化。

### 最长连续序列

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为  O(n) 的算法解决此问题。

```
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

```js
function longestConsecutive(nums) {
  // 去重
  let set = new Set(nums)
  let maxLen = 0 // 最大
  for (let num of set) {
    // 这个for循环，其实就是找到起始位置
    // 对于示例中的100,200只会执行一次，而对于4直接就不会进去
    if (!set.has(num - 1)) {
      // 如果没有包含 num - 1，说明 num 是 起始位置
      let curNum = num
      let curLen = 1
      // 确定了起点，就开始向后循环，如果连续则记录并更行
      while (set.has(curNum + 1)) {
        curNum++
        curLen++
      }
      // 如果循环结束，则更新最大值
      maxLen = Math.max(maxLen, curLen)
    }
  }
  return maxLen
}
longestConsecutive([100, 4, 200, 1, 3, 2]) // 4
```

- 时间复杂度为 O(n)，空间复杂度为 O(n)，其中 n 为数组 nums 的长度。
- 因为需要用一个 set 来进行去重操作，所以需要额外的空间来存储 set，所以空间复杂度为 O(n)。
- 在 for 循环和 while 循环中，每个元素最多被访问两次，所以时间复杂度为 O(n)。因此，总的时间复杂度为 O(n)，空间复杂度为 O(n)。

### 寻找两个正序数组的中位数

给定两个大小分别为 m 和 n 的正序（从小到大）数组  nums1 和  nums2。请你找出并返回这两个正序数组的 中位数 。

算法的时间复杂度应该为 O(log (m+n)) 。

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  // 合并两个有序数组，然后找到中间的那个
  let res = []
  let i = 0
  let j = 0
  // 利用双指针，先合并有序数组
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      res.push(nums1[i])
      i++
    } else {
      res.push(nums2[j])
      j++
    }
  }

  while (i < nums1.length) {
    res.push(nums1[i])
    i++
  }
  while (j < nums2.length) {
    res.push(nums2[j])
    j++
  }
  const minddle = Math.floor(res.length / 2)
  const isEven = res.length % 2 === 0
  const final = isEven ? (res[minddle - 1] + res[minddle]) / 2 : res[minddle]
  return final
}
```

- 时间复杂度为 O(m+n)，其中 m 和 n 分别为 nums1 和 nums2 的长度，因为需要遍历两个数组并将它们合并成一个有序数组。
- 空间复杂度为 O(m+n)，因为需要创建一个新数组来存储合并后的有序数组。

### 寻找数组中第二大的数

#### 方式一

```js
const findSecondLargestBad = (arr) => {
  const depuliationArr = [...new Set(arr)].sort()
  console.log('djch depuliationArr', depuliationArr)
  return depuliationArr[depuliationArr.length - 2]
}
```

- 时间复杂度：O(nlogn)，因为在数组去重时使用了 Set，Set 内部使用哈希表实现，时间复杂度为 O(n)，而数组排序使用了快速排序，时间复杂度为 O(nlogn)，所以总的时间复杂度为 O(nlogn)。
- 空间复杂度：O(n)，因为在去重时使用了 Set，需要将所有不同的元素存储在一个新的数组中，所以空间复杂度为 O(n)。

#### 方式二

```js
const findSecondLargest = (arr) => {
  // 定义一个最大，一个次大
  let max = arr[0]
  let secondMax = -Infinity

  // 遍历数组
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      secondMax = max // 既然有数据比max大，那之前的max就是次大
      max = arr[i]
    } else if (arr[i] < max && arr[i] > secondMax) {
      // 想象一下，将条件分成x轴上的三段，
      secondMax = arr[i] // 其实相当于只记录 次大的数据
    }
  }

  return secondMax
}

// 这个算法的时间复杂度为 O(n)，空间复杂度O(1)
console.log(findSecondLargest([1, 1, 2, 3, 4, 4]))
console.log(findSecondLargestBad([1, 1, 2, 3, 4, 4]))
```

### 快速排序

```js
const quickSort = (arr) => {
  if (arr.length <= 1) return arr

  const pivot = arr[0]
  const left = []
  const right = []

  // 从索引1开始遍历
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}

const unsortedArr = [3, 1, 6, 2, 4, 5]
const sortedArr = quickSort(unsortedArr)
console.log(sortedArr) // [1, 2, 3, 4, 5, 6]
```

### 和为 K 的子数组

给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的连续子数组的个数 。

- 这里和返回和为 target 的所有集合还不太一样，这里是连续的子数组

```
输入：nums = [1,2,3], k = 3
输出：2
```

1. 遍历数组，计算当前的前缀和 sum，然后将 sum 减去 k，得到一个目标值 target。
2. 如果哈希表中已经存在 target，说明存在一个子数组的和为 k。如果哈希表中不存在 target，则将当前的前缀和 sum 存入哈希表中
3. 最后返回子数组和为 k 的个数即可。

```js
var subarraySum = function (nums, k) {
  const map = new Map()
  map.set(0, 1) //
  let sum = 0
  let count = 0
  // [1,2,3] 2
  for (let i = 0; i < nums.length; i++) {
    // 累加
    sum += nums[i]

    // 如果有 sum - k 则说明，两个位置之间的子数组的和为k，累加即可
    // 这个地方必须是 sum - k，其实可以想象下 两数之和 A + B = C ,那这里的 C 就是sum，然后A或B就是K
    // 如何 C - B 存在，则说明存在一个和为k的子数组，直接累加即可
    if (map.has(sum - k)) {
      count += map.get(sum - k)
      // console.log('djch count', count)
    }

    // 如果之前有过，则继续累加，属于不同的组合了
    if (map.has(sum)) {
      map.set(sum, map.get(sum) + 1)
    } else {
      // 将不同累加的和都放在map里
      map.set(sum, 1)
    }
  }
  return count
}
// [1,2,3] 3
// {0 => 1}
// {1 => 1}
// {3 => 1}
// {6 => 1}
```

具体实现如下：

1. 创建一个哈希表 map，并将值 0 和出现次数 1 存入哈希表中，因为当累加到某个位置时，如果前面的所有数的和为 0，则当前位置到该位置的子数组的和为当前位置的值。
2. 定义变量 sum 和 count，其中 sum 用于记录当前位置之前的所有数的和，count 用于记录和为 k 的子数组数量。
3. 遍历给定数组 nums，对于每个位置 i，累加当前位置的值到 sum 中。
4. 检查 map 中是否存在 sum-k 的值，如果存在，则说明之前某个位置的前缀和值与当前位置的前缀和值之差为 k，即存在一个和为 k 的子数组，累加其出现次数到 count 中。
5. 检查 map 中是否存在当前位置的前缀和值 sum，如果存在，则将其出现次数加 1，否则将其存入 map 中并将出现次数初始化为 1。
6. 返回 count，即为和为 k 的子数组数量。

总结思想：使用前缀和和哈希表记录之前出现过的前缀和值及其出现次数，通过检查 map 中是否存在 sum-k 的值来判断是否存在和为 k 的子数组，从而实现高效计算。该思想在解决和为 k 的子数组问题中非常常用。

#### 前缀和 思想

前缀和算法是一种常用的算法，它可以用来求解区间和等问题。它的思路是先预处理出一个前缀和数组，然后通过前缀和数组来快速求解区间和等问题。

下面是一个简单的前缀和算法的 JavaScript 代码：

```javascript
function prefixSum(arr) {
  let n = arr.length
  let preSum = new Array(n)
  // 第一项的和，肯定就是arr[0]
  preSum[0] = arr[0]
  // 后续的都是累加
  for (let i = 1; i < n; i++) {
    preSum[i] = preSum[i - 1] + arr[i]
  }
  return preSum
}

function getSum(preSum, left, right) {
  // 如果left等于0，可以想象一个窗口，相当于覆盖了整个数组
  if (left == 0) {
    return preSum[right]
  }
  // 如果left不等于0，相当于窗口覆盖了数组的一部分
  return preSum[right] - preSum[left - 1]
}
```

在这个代码中，`prefixSum`函数用来计算前缀和数组，`getSum`函数用来求解区间和。具体解释如下：

1. `prefixSum`函数接受一个数组`arr`作为参数，返回一个前缀和数组`preSum`。首先创建一个长度为`n`的数组`preSum`，其中`n`是`arr`的长度。然后初始化`preSum[0]`为`arr[0]`。接着使用循环遍历数组`arr`，从下标`1`开始，依次计算`preSum[i]`，使其等于`preSum[i-1] + arr[i]`。最后返回`preSum`数组。

2. `getSum`函数接受三个参数，分别是前缀和数组`preSum`、区间左端点`left`和区间右端点`right`。如果左端点`left`等于`0`，那么区间和就等于`preSum[right]`。否则，区间和就等于`preSum[right] - preSum[left-1]`。

总的来说，前缀和算法的核心思想是预处理出前缀和数组，然后利用前缀和数组来快速求解区间和等问题。这种算法在一些数据量较大的问题中非常实用，可以大大减少计算量。

### 两数之和

```js
function twoSum(nums, target) {
  let map = new Map()
  for (let i = 0; i < nums.length; i++) {
    let rest = target - nums[i]
    // A + B = C，如果当前值是B，而A已经在map里了，是不是就找到了
    if (map.has(rest)) {
      return [map.get(rest), i]
    }
    map.set(nums[i], i)
  }
  return -1
}
```

### 两数之和 II - 输入有序数组

给你一个下标从 1 开始的整数数组  numbers ，该数组已按 非递减顺序排列, 请你从数组中找出满足相加之和等于目标数  target 的两个数。如果设这两个数分别是 `numbers[index1] 和 numbers[index2]` ，则 `1 <= index1 < index2 <= numbers.length 。`

以长度为 2 的整数数组 `[index1, index2]` 的形式返回这两个整数的下标 index1 和 index2。

你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。

你所设计的解决方案必须只使用常量级的额外空间。

```
输入：numbers = [2,3,4], target = 6
输出：[1,3]
解释：2 与 4 之和等于目标数 6 。因此 index1 = 1, index2 = 3 。返回 [1, 3] 。
```

```js
function twoSum(numbers, target) {
  let left = 0,
    right = numbers.length - 1

  while (left < right) {
    // 利用双指针，因为已经是排好序的了
    const sum = numbers[left] + numbers[right]

    if (sum === target) {
      return [left + 1, right + 1]
    } else if (sum < target) {
      // 小于target时，需要慢慢的变成大值
      left++
    } else {
      // 如果大于target，则需要变小
      right--
    }
  }
  return [-1, -1]
}

twoSum([2, 7, 11, 15], 9) // [1, 2]
```

- 利用双指针，查找和为 target 的序列。

### 三数之和

给你一个整数数组 nums ，判断是否存在三元组 `[nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0 `。请

你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
```

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b) // 先排序

  const res = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue // 避免重复

    let left = i + 1
    let right = nums.length - 1 // 双指针
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]])
        while (left < right && nums[left] === nums[left + 1]) left++ // 避免重复
        while (left < right && nums[right] === nums[right - 1]) right-- // 避免重复
        // 等于时，同时缩进
        left++
        right--
      } else if (sum < 0) {
        left++
      } else {
        right--
      }
    }
  }
  return res
}
threeSum([-1, 0, 1, 2, -1, -4]) // [[-1,-1,2],[-1,0,1]]
```

这是一个求三数之和为 0 的函数，采用了双指针的方法。

1. 首先将数组排序，然后从左到右遍历数组，以当前元素作为三数之和的第一个数，用双指针 left 和 right 分别指向当前元素的下一个元素和数组末尾元素。
2. 在双指针的循环中，计算三数之和，如果等于 0，则将三个数加入结果数组中，并将 left 和 right 分别向中间移动一位，同时跳过重复的数（因为已经排序，所以相同的数一定在一起）。
3. 如果三数之和小于 0，则将 left 向右移动一位，因为数组已经排序，所以将 left 右移可以让三数之和变大。
4. 如果三数之和大于 0，则将 right 向左移动一位，可以让三数之和变小。
5. 1 最终返回结果数组。

```js
var threeSum = function (nums) {
  let arr = []
  // 排序，然后固定一个，然后两侧指针，排序不能直接sort，因为涉及到Unicode的排序
  nums = nums.sort((a, b) => a - b)
  const len = nums.length
  if (nums == null || len < 3) return arr

  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) break

    let left = i + 1
    let right = len - 1
    if (i > 0 && nums[i] == nums[i - 1]) continue // 去重，不要看原数组，要看排好序的数组

    while (left < right) {
      let a = nums[i]
      let b = nums[left]
      let c = nums[right]

      let sum = a + b + c
      if (!sum) {
        arr.push([a, b, c])
        while (left < right && nums[left] === nums[left + 1]) left++ // 去重
        while (left < right && nums[right] === nums[right - 1]) right-- // 去重
        // 此时都需要走，不然会重复
        left++
        right--
      } else if (sum < 0) {
        // 和小，说明需要增大
        left++
      } else if (sum > 0) {
        // 因为排好序了，此时降低大值就是小值
        right--
      }
    }
  }
  return arr
}
```

### 四数之和

给你一个由 n 个整数组成的数组  nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组  `[nums[a], nums[b], nums[c], nums[d]]`（若两个四元组元素一一对应，则认为两个四元组重复）：

```
输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

```js
function fourSum(nums, target) {
  const result = []
  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue

    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue

      let left = j + 1
      let right = nums.length - 1
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right]

        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]])
          while (left < right && nums[left] === nums[left + 1]) left++
          while (left < right && nums[right] === nums[right - 1]) right--
          left++
          right--
        } else if (sum < target) {
          left++
        } else {
          right--
        }
      }
    }
  }
  return result
}
```

- 四数之和的原理，类似三数之和，只是以当前元素和下一个元素作为前两个

### 删除有序数组中的重复项

给你一个 升序排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 。然后返回 nums 中唯一元素的个数。

```js
var removeDuplicates = function (nums) {
  // 使用for循环遍历
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      nums.splice(i, 1)
      // 如果删除了，数组长度会变化，所以i需要后退一位
      i--
    }
  }
  return nums.length
}

// 下面的这个在leetcode上不通过。。。但没毛病啊
var removeDuplicates = function (nums) {
  let i = 0
  while (i < nums.length - 1) {
    // 修改循环条件
    if (nums[i] === nums[i + 1]) {
      nums.splice(i + 1, 1)
    } else {
      i++ // 不相同则继续往后遍历
    }
  }
  return nums
}
```

## 递归

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

- 其实递归，就是将大问题，不断的拆解成小问题。
- 最后那个最小的问题，可以直接返回，相当于终止了递归，因此必须有终止条件

**示例三：输出 50 以内斐波那契数列**

斐波那契额数列的特点：`1,1,2,3,5,8,13`，从第三个值开始，每个值都是前两者的和

```js
const fib = (num) => {
  // 停止条件：前两个直接返回
  if (num === 1 || num === 2) {
    return 1
  }

  // 每次减小范围：后面的都返回 前一个 + 前两个 的和
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

- 50 以内的斐波那契数列，就很耗费时间

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

递归效率低，是因为每次递归都会**创建函数备份，占用内存空间，同时也有堆栈溢出的风险**

所谓迭代，一般就是循环，

- 注意如果想返回斐波那契额数列，则用数组
- 如果想返回单个的值，则用

```js
const fib2 = (num) => {
  // 定义个基础数组，当num的长度小于2时，直接返回数组的前几项
  let arr = [0, 1]
  if (num < 2) return arr.slice(0, num) // slice语法是：[)，也就是前闭后开

  // 大于2之后，比如3，则是前一项和前两项的和
  for (let i = 2; i < num; i++) {
    // 这里面都是数组里单个的值，然后累加
    arr.push(arr[i - 1] + arr[i - 2])
  }

  return arr
}
fib2(5) // [0, 1, 1, 2, 3]
fib2(10) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

```js
// const fib3Error = (num) => {
//   let result = 0
//   if (!num) {
//     return 0
//   } else if (num === 1) {
//     return 1
//   }

//   for (let i = 2; i < num; i++) {
//     result += num[i-1] + num[i-2]  // ❌❌❌ 大错，num是具体的数字，不是斐波那契额数列
//   }

//   return result
// }
// console.log(fib3([]))  // NaN ❌❌❌❌

// 下面的是计算前前n项的斐波那契数列和。
function fibonacciSum(n) {
  let sum = 0
  let a = 0
  let b = 1

  for (let i = 0; i < n; i++) {
    // 累加
    sum += b
    // 模拟斐波那契数的计算
    let temp = a + b
    a = b
    b = temp
  }

  return sum
}

console.log(fibonacciSum(10)) // 输出：143
```

递归的执行过程如下图

- 回推过程
- 递推过程

![递归过程](/static/images/recoursion-process.png)

## 动态规划

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

### 接雨水

题目：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。【力扣 42 题】

- 可以理解为，一排高低不同的阶梯，下雨后，阶梯里可以存多少水
- 只有低的柱子，也就是形成坑，才可能存水。。。木桶效应
- 双指针，从两侧往里遍历，然后判断双指针指向的柱子，谁高谁低，
- 需记录每次的最高高度
- 该算法的时间复杂度为 O(n)，空间复杂度为 O(1)。

```js
const trap = (heights) => {
  let left = 0,
    right = heights.length - 1 // 左右指针索引
  let maxLeft = 0,
    maxRight = 0 // 左右最大值，其实这里最大值的意义是：如果比他小才可能有水
  let results = 0 // 结果

  // 双指针，使用while，运行条件：左侧索引小于右侧索引
  while (left < right) {
    // 判断，两侧指针，谁小
    if (heights[left] < heights[right]) {
      // 左侧小，则统计左侧的存水量
      if (heights[left] > maxLeft) {
        maxLeft = heights[left]
      } else {
        // 比最大值小，说明形成了洼地
        results += maxLeft - heights[left]
      }
      // 指针移动
      left++
    } else {
      if (heights[right] > maxRight) {
        maxRight = heights[right]
      } else {
        results += maxRight - heights[right]
      }
      right--
    }
  }
  return results
}
const heights = [2, 1, 2]
console.log(trap(heights)) // 1
console.log(trap([3, 1, 3])) // 2
```

### 跳跃游戏

给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标。

```
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
```

```js
function canJump(nums) {
  let maxJump = 0 // 当前能够跳到的最远距离
  const n = nums.length // 数组长度

  for (let i = 0; i < n; i++) {
    // 刚开始在第一个下标位置，如果想移动到下一个下标，则可跳的最远距离必须要大于索引，否则直接就过不去啊
    if (maxJump < i) return false // 如果当前位置无法到达，返回false

    // 下标位置 + nums[i]
    maxJump = Math.max(maxJump, i + nums[i]) // 更新能够跳到的最远距离
    // 循环中，有一个就表示可以
    if (maxJump >= n - 1) return true // 如果能够跳到最后一个位置，返回true
  }
  // 循环结束了，都没有过去，那肯定为false
  return false
}
```

该函数用于判断一个数组中的元素是否能够跳到最后一个位置。

- 其中，maxJump 表示当前能够跳到的最远距离，n 表示数组长度。
- 在循环中，首先判断当前位置是否能够到达，如果不能则返回 false，
- 否则更新能够跳到的最远距离。当能够跳到最后一个位置时，返回 true。
- 最后，如果循环结束后仍未返回 false，则说明能够跳到最后一个位置，返回 true。

### 盛最多水的容器

给定一个长度为 n 的整数数组  height 。有  n  条垂线，第 i 条线的两个端点是  `(i, 0) 和 (i, height[i])` 。

找出其中的两条线，使得它们与  x  轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

- 这里的垂线其实不占用体积，因此可以只考虑两个挡板间的距离和矮挡板的高度就可以了

```js
function maxArea(arr) {
  // 双指针法
  let len = arr.length
  let leftIdx = 0
  let rightIdx = len - 1
  let max = 0

  // 左指针小于右指针，则一直循环
  while (leftIdx < rightIdx) {
    // 计算两个挡板间的空间，矩形，高度以矮的为准
    let tempArea = (rightIdx - leftIdx) * Math.min(arr[leftIdx], arr[rightIdx])
    // 更新最大值
    max = Math.max(max, tempArea)

    // 移动指针，移动小的
    arr[leftIdx] < arr[rightIdx] ? leftIdx++ : rightIdx--
  }
  return max
}
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) // 48
// 其实就是 height[8]  height[1] => (8 - 1) * Math.min(7, 8) => 49
```

## 字符串

- 双指针算法：使用两个指针分别指向字符串的不同位置，通过移动指针来解决问题，例如判断回文字符串、最长回文子串等问题。
- 动态规划算法：通过拆分问题为子问题，然后通过递推求解的方式得到最终的解，例如最长公共子序列、编辑距离等问题。
- KMP 算法：通过预处理模式字符串的信息，然后在匹配过程中利用这些信息来跳过不必要的比较，从而提高匹配效率。
- 哈希算法：通过将字符串映射到一个哈希值上，可以快速判断两个字符串是否相等，例如字符串匹配问题。
- Trie 树算法：通过构建一个树形结构来存储字符串集合，可以快速地查找、插入、删除字符串，例如前缀匹配、字符串排序等问题。
- 线段树算法：通过将字符串转换为数值表示，可以使用线段树来维护区间信息，例如区间最大值、区间和等问题。
- 后缀数组算法：通过将字符串的所有后缀排序，可以快速地求解多种字符串问题，例如最长重复子串、最长公共前缀等问题。

### 最长回文子串

给你一个字符串 s，找到 s 中最长的回文子串。

如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

```js
function longestPalindrome(s) {
  let longest = ''
  for (let i = 0; i < s.length; i++) {
    // 以当前字符为中心的奇数长度的回文子串
    let l = i,
      r = i
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--
      r++
    }
    // 最后会执行一次，l--,r++，而slice又是[)，因此可以直接如下
    let palindrome = s.slice(l + 1, r)
    // 如果比最长的还长，则更新最长的
    if (palindrome.length > longest.length) {
      longest = palindrome
    }

    // 以当前字符和下一个字符为中心的偶数长度的回文子串
    // 奇数或偶数，不一定哪个的值是最大值，因此需要考虑奇偶
    ;(l = i), (r = i + 1)
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--
      r++
    }
    palindrome = s.slice(l + 1, r)
    if (palindrome.length > longest.length) {
      longest = palindrome
    }
  }
  return longest
}

// 示例
console.log(longestPalindrome('babad')) // 'bab' 或 'aba'
console.log(longestPalindrome('cbbd')) // 'bb'
```

1. 遍历字符串中的每一个字符，以该字符为中心向两侧扩展，检查是否存在奇数长度的回文子串。
2. 如果存在，则将该回文子串与当前最长回文子串进行比较，更新最长回文子串。
3. 接着，以当前字符和下一个字符为中心向两侧扩展，检查是否存在偶数长度的回文子串。
4. 如果存在，则将该回文子串与当前最长回文子串进行比较，更新最长回文子串。
5. 最后，返回最长的回文子串。

#### 方式一

```js
var longestPalindrome = function (s) {
  // 思路，利用左右两个指针，分别向两边扩散
  // 扩散完以后，两个指针之间的内容
  if (s.length < 2) return s
  let res = ''

  for (let i = 0; i < s.length; i++) {
    // 这里虽然执行了两次helper，但不用担心，因为其实同一时刻，只会有一个helper里的逻辑有效
    // 回文子串是奇数，相当于此时左右两个指针处于同一点
    helper(i, i)
    // 回文子串是偶数，比如abba
    helper(i, i + 1)
  }
  // 比如 abba
  // i = 0时，s[i] = a，此时s[l] === s[r] =》l->-1，r->1
  //
  function helper(l, r) {
    // 如果二者相等，则继续向两侧扩展，不相等则结束并统计回文串
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--
      r++
    }
    console.log('djch l r', l, r)
    // 当循环完后，因为l--，和r++了，因此这两个值相当于边界，不能包含截取
    // 另外咱要获取的是最长的那个子串，因此每次都需要与res.length比较,也就是最长的子串
    // r与l之间有多少个字符，应该是r-l，但l--，r++了，slice又是后不包括，所以 r - (l + 1) => r - l - 1
    // 如果包括的话，因该是(r-1) - (l+1) => r-l-2
    if (r - l - 1 > res.length) {
      // slice前包后不包
      res = s.slice(l + 1, r)
      console.log('djch res', res)
    }
  }
  return res
}
// 测试
console.log(longestPalindrome('babad')) // "bab" 或 "aba"
console.log(longestPalindrome('cbbd')) // "bb"
```

- 这个题，是不改变现有字符串，从里面截取最长的子串，想象一个可伸缩的滑动窗口。
- 想象：从头开始遍历字符串，每个字符串都需要向左，向右开始扩展，因为回文是对称相等
- 如果相等，则继续扩展，如果不相等了，则说明回文串到边界了，需要记录和对比
- 一个主函数，主要用来遍历，一个辅助函数主要用来执行具体的逻辑

### 最长回文子序列

给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。

子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。

注意：子序列，不要求顺序

```
输入：s = "bbbab"
输出：4
解释：一个可能的最长回文子序列为 "bbbb" 。
```

动态规划通常是通过将原问题分解成更小的子问题来求解，然后将子问题的解组合成原问题的解。在这个算法中，我们将原问题分解成许多子问题，每个子问题都是求解给定字符串的一个子串的最长回文子序列的长度。

我们用一个二维数组 dp 来保存子问题的解。数组`dp[i][j]`表示给定字符串 s 的子串`s[i...j]`的最长回文子序列的长度。最终我们要求的就是`dp[0][n-1]`，即整个字符串 s 的最长回文子序列的长度。

1. 我们从右下角开始，从右向左、从下向上地填写 dp 数组。
2. 当 i=j 时，子串`s[i...j]`只有一个字符，它肯定是回文的，所以 dp[i][j]=1。
3. 当`i<j`时，如果 s[i]=s[j]，那么 s[i...j]可以看作是`s[i+1...j-1]`的两端加上相同的字符 s[i]和 s[j]，此时`dp[i][j]=dp[i+1][j-1]+2`
4. 如果 s[i]!=s[j]，那么我们可以选择舍弃 s[i]或者舍弃 s[j]，然后求解子问题 s[i+1...j]或者 s[i...j-1]的最长回文子序列的长度，取其中的最大值作为 dp[i][j]的值。

最后，dp[0][n-1]就是整个字符串 s 的最长回文子序列的长度。

这个算法的时间复杂度是 O(n^2)，空间复杂度也是 O(n^2)。

```js
var longestPalindromeSubseq = function (s) {
  // 利用动态规划
  const len = s.length
  if (len <= 1) return len

  // 定义dp table，二位数组，dp[i][j],i表示左边的指针，j表示右边的指针，因为字符串有长度嘛
  const dp = Array.from(Array(len), () => Array(len).fill(0))
  // 当i和j相等时，其实就是一个字符嘛，所以此时长度为1
  for (let i = 0; i < len; i++) {
    dp[i][i] = 1
  }
  // 想象一个方格纸贴在墙上，然后你看着方格纸，顶部向右是j轴，左侧向下是i轴。
  // 因此dp[0][len-1]就是右上角位置的元素。
  // 穷举，现在的情况是左下角的位置其实都是无效数据，可以不遍历
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i + 1; j < len; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[0][len - 1]
}
```

### 最长回文串

给定一个包含大写字母和小写字母的字符串  s ，返回   通过这些字母构造成的 最长的回文串  。

在构造过程中，请注意 区分大小写 。比如  "Aa"  不能当做一个回文字符串。

```
输入:s = "abccccdd"
输出:7
解释:
我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。
```

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  // 比如打牌，成对的都打出去，最后剩的都是单张的，只需再抽一张，就是最长的
  // 因为要求的是回文串的长度，并不是回文串的种类
  let tempSet = new Set()
  let num = 0
  s.split('').forEach((code) => {
    if (tempSet.has(code)) {
      tempSet.delete(code)
      // 删除后，相当于打出去两张，此时num需要加2
      num += 2
    } else {
      // 如果没有的话，先加进去
      tempSet.add(code)
    }
  })

  // 最后，如果还有剩余的牌，只需要再抽出来一张即可
  return num + (tempSet.size ? 1 : 0)
}
```

- 这个题，是根据已有的字符，重新构造，看最终有多少种可能

### 重复的子字符串

给定一个非空的字符串 s ，检查是否可以通过由它的一个子串重复多次构成。

```
输入: s = "abab"
输出: true
```

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern1 = function (s) {
  // \1+ 表示匹配一个或多个与第一个捕获组相同的字符。其中 \1 表示第一个捕获组的内容，+ 表示至少匹配一个。
  let reg = /^(\w+)\1+$/
  return reg.test(s)
}

var repeatedSubstringPattern2 = function (s) {
  // abab abab => 'bababa'
  let s1 = (s + s).slice(1, -1)
  // bababa  abab
  return s1.indexOf(s) !== -1
}
// 假设原始字符串是 "abab"，如果它是由它的子串 "ab" 重复两次组成的，那么它应该变成 "abababab"。
// 注意到这个新字符串的开头和结尾都是 "ab"，但是中间有一个 "ba"。
// 为了避免这种情况，我们可以将原始字符串拼接起来，得到 "abababab"，然后去掉开头和结尾的一个字符，得到 "bababa"。
// 这样做的目的是为了防止原始字符串的第一个字符和最后一个字符同时作为两个相邻子串的一部分，从而导致判断错误。
```

- 字符串判断是否有规则，可以用正则
- 该题其实就是判断，整串，是不是有多个相同的子串组成。

### 判断是否为回文字符串

从中间分开，然后从两侧挨个判断是否一致

```js
function isPalindrome(str) {
  let left = 0
  let right = str.length - 1
  let i = 0
  // 注意，这里只能遍历到 1/2的长度
  // for (i; i < str.length-1; i++) {
  for (i; i < str.length / 2; i++) {
    if (str[left] === str[right]) {
      left++
      right--
    } else {
      return false
    }
  }
  return true
}

function isPalindrome(str) {
  var len = str.length
  for (var i = 0; i < len / 2; i++) {
    if (str[i] !== str[len - 1 - i]) {
      return false
    }
  }
  return true
}
console.log(isPalindrome('racecar')) // true
console.log(isPalindrome('hello')) // false
```

- 遍历字符串，对比两头的字符是否相等
- 注意，遍历字符串只需 length / 2，不需要考虑 length 的奇偶，兼容

### 最小覆盖子串

给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

```
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
```

滑动窗口算法是一种解决字符串子串问题的算法，它的基本思想是维护一个窗口，通过滑动窗口的方式来寻找最小覆盖子串。具体实现过程如下：

1. 定义两个指针 left 和 right，分别表示窗口的左右边界；
2. 将 right 指针向右移动，扩大窗口，直到窗口中包含了所有的目标元素；
3. 如果当前窗口中包含了所有的目标元素，那么更新最小覆盖子串的长度和起始位置，并将 left 指针向右移动，缩小窗口；
4. 重复步骤 2 和 3，直到 right 指针到达字符串的末尾。

这个算法的思路是利用滑动窗口来找到包含目标字符串的最小子串。

1. 首先，我们需要统计目标字符串中各个字符的出现次数，用一个 map 来存储。
2. 然后，我们设置两个指针 left 和 right，从字符串 s 的最左侧开始，不断移动右指针，同时更新 map 中对应字符的出现次数。如果移动后某个字符的出现次数小于等于 0，说明该字符已经被包含在窗口中，counter 减一。
3. 当 counter 等于 0 时，说明我们已经找到了一个包含目标字符串的窗口，此时我们可以尝试缩小窗口，即移动左指针。如果左指针移动后某个字符的出现次数变为正数，说明该字符是目标字符串中的字符，此时我们需要将 counter 加一。
4. 不断移动左指针和右指针，直到右指针到达字符串 s 的末尾，或者找到了最小子串为止。
5. 最后，如果找到了最小子串，就返回该子串，否则返回空字符串。

这个算法的时间复杂度是 O(n)，其中 n 是字符串 s 的长度，因为左指针和右指针都只会移动 n 次。空间复杂度是 O(k)，其中 k 是目标字符串的长度，因为 map 中最多存储 k 个字符

```js
function minWindow(s, target) {
  let map = {}
  // 统计目标字符串各个字母的次数
  for (let char of target) {
    map[char] = (map[char] || 0) + 1
  }

  let left = 0,
    right = 0,
    counter = target.length, // 目标串的长度
    minLen = Infinity, // 最小子串长度minLen，最小值一般都设置为正无穷，反之则设置为负无穷
    minStart = 0

  while (right < s.length) {
    // 右侧指针，也是从最左侧开始
    let char = s[right]

    if (map[char] > 0) {
      // 如果包含，则相当于找到一个，减小次数
      counter--
    }
    // 不管包含与否，目标里的次数为何都减一？？
    // 其实这里，有两层含义，包含则减一，不包含则置为负一
    map[char] = (map[char] || 0) - 1
    right++

    // 当counter === 0 时，说明所有的字符都包含了
    while (counter === 0) {
      // 更新最小值，越小越好
      if (right - left < minLen) {
        minLen = right - left
        minStart = left // 更新左侧索引
      }

      // 第一层while主要是遍历right指针，遍历完，肯定包含
      // 这里再缩小左侧指针，从而缩小区间
      let char = s[left]
      if (map[char] === 0) {
        counter++
      }
      //
      map[char] = (map[char] || 0) + 1
      left++
    }
  }

  return minLen === Infinity ? '' : s.substr(minStart, minLen)
}

// 示例：
console.log(minWindow('ADOBECODEBANC', 'ABC')) // "BANC"

function minWindow(s, t) {
  let charCount = new Array(128).fill(0)
  let left = 0
  let right = 0
  let count = t.length
  let minLen = Infinity
  let minStart = 0

  // 统计t中每个字符出现的次数
  for (let i = 0; i < t.length; i++) {
    charCount[t.charCodeAt(i)]++
  }

  // 移动右指针
  while (right < s.length) {
    // 如果当前字符是t中的字符，则count减1
    if (charCount[s.charCodeAt(right)] > 0) {
      count--
    }
    // 统计每个字符出现的次数
    charCount[s.charCodeAt(right)]--
    right++

    // 当count为0时，说明已经找到一个覆盖t的子串
    while (count === 0) {
      // 更新最小长度和起始位置
      if (right - left < minLen) {
        minLen = right - left
        minStart = left
      }
      // 移动左指针
      charCount[s.charCodeAt(left)]++
      // 如果当前字符在t中出现，则count加1
      if (charCount[s.charCodeAt(left)] > 0) {
        count++
      }
      left++
    }
  }

  return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen)
}
console.log(minWindow('ADOBECODEBANC', 'ABC')) // "BANC"
```

### 滑动窗口算法，实现无重复字符的最长子串

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

```js
function longestSubstring(s) {
  let left = 0
  let right = 0
  let maxLen = 0
  const set = new Set()

  while (right < s.length) {
    // 如果不包含，则一直往里压入
    // 从字符串里获取指定索引的值，还可以 s.charAt(right)，如果超过阈值，则返回''，
    // 如果使用 s[right] 超过阈值，则返回 undefined
    if (!set.has(s[right])) {
      set.add(s[right])
      maxLen = Math.max(maxLen, set.size)
      right++
    } else {
      // 如果包含的话，肯定是最左侧的先开始包含
      set.delete(s[left])
      left++
    }
  }

  return maxLen
}
```

- 空间复杂度为 O(min(n,m))，其中 n 为字符串的长度，m 为字符集大小。因为 set 中最多存储 m 个字符。
- 时间复杂度为 O(n)，其中 n 为字符串的长度。因为每个字符最多被访问两次（一次添加到 set 中，一次从 set 中删除），所以时间复杂度为线性的。
- 因为只需要求长度，只需要用 set 记录就可
- 遍历字符串，利用滑动窗口，如果没有则一直压入，并更新最长的记录，同时右侧指针向右移动
- 如果包含，肯定是左侧先包含，left++

上面方法，没办法直接返回最终结果，因为是迭代器对象

```js
function longestSubstring(s) {
  let left = 0
  let right = 0
  let maxLen = 0
  let res = []

  while (right < s.length) {
    if (!res.includes(s.charAt(right))) {
      res.push(s.charAt(right))
      maxLen = Math.max(maxLen, res.length)
      right++
    } else {
      res.splice(0, 1)
      left++
    }
  }

  return [maxLen, res.join()]
}
longestSubstring('baddcddaabea') //  [3, 'b,e,a']
```

### 最长公共前缀

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

```
输入：strs = ["flower","flow","flight"]
输出："fl"
```

```js
function longestCommonPrefix(strs) {
  if (strs.length === 0) {
    // 如果数组为空，返回空字符串
    return ''
  }

  let prefix = strs[0] // 将第一个字符串作为前缀
  for (let i = 1; i < strs.length; i++) {
    // 循环遍历数组中的每一个字符串
    while (strs[i].indexOf(prefix) !== 0) {
      // 如果当前字符串不以前缀开头
      prefix = prefix.slice(0, prefix.length - 1) // 将前缀缩短一个字符
      // 如果为空，则直接返回，下面不需要也行，最后直接返回 prefix
      // 下面要的话，效率可以高一些
      if (prefix === '') {
        // 如果前缀为空，则说明不存在公共前缀
        return ''
      }
    }
  }
  // 循环结束后，直接返回
  return prefix // 返回最长公共前缀
}
```

- 假想第一个字符串，就是前缀
- 然后挨个匹配后续的字符串，如果`strs[i].indexOf(prefix) !== 0` 则从最后一个字符串开始缩短
- 缩短后继续匹配，知道匹配上位置。。。for 循环内部，还需要一个 while 循环

### 大数相加

```js
function bigNumAdd(a, b) {
  // 获取两个数的长度，大数是个字符串？
  // (123).length -> undefined 啊
  let i = a.length - 1
  let j = b.length - 1

  let res = '' // 最终结果
  let carry = 0 // 进位

  // 只要有一个长度大于等于0，即循环
  // 其实就是只要有任何一个数字有长度，则继续循环，肯定会先计算完小的数
  // 等到循环结束，则两个数会被完全计算。
  while (i >= 0 || j >= 0) {
    let x = 0
    let y = 0
    let sum = 0 // 两个数的和

    // 分别从最后获取大数字符串上的值，并记录
    if (i >= 0) {
      x = +a[i]
      i--
    }
    if (j >= 0) {
      y = +b[j]
      j--
    }

    // 计算，并累加进位
    sum = x + y + carry

    // 计算完，还需要判断是否大于10
    if (sum >= 10) {
      carry = 1
      sum -= 10 // 进位后，两个数的临时和就需要减10
    } else {
      carry = 0
    }

    // 两个数的临时和，需要与最终结果的字符串拼接；
    res = sum + res
  }

  // 循环结束后，再判断进位
  if (carry) {
    res = carry + res
  }
  return res
}
```

### 排序

字符串排序的原理是基于 Unicode 编码的顺序进行排序。

- 每个字符都有一个对应的 Unicode 编码，排序时会根据这些编码的大小来进行排序。
- 如果两个字符串的首个字符相同，则会比较第二个字符，以此类推直到比较出两个字符串的大小关系。
- 在排序时，大写字母会排在小写字母之前，因为它们的编码比小写字母的编码要小。

### 去除相邻的字符串

类似消消乐，凡是相邻挨着的字符串，全部干掉

```js
function removeAdjacentDuplicates(str) {
  let stack = []
  for (let i = 0; i < str.length; i++) {
    // 利用栈结构，如果相同则弹出
    if (stack.length && stack[stack.length - 1] === str[i]) {
      stack.pop()
    } else {
      stack.push(str[i])
    }
  }
  return stack.join('')
}

console.log(removeAdjacentDuplicates('abbbad')) // 输出 "d"
```

### 判断字符串中的有效括号

```js
var isValid = function (s) {
  let stack = []
  // 注意这里是右括号作为key
  let map = {
    ')': '(',
    ']': '[',
    '}': '{',
  }
  for (let item of s) {
    // 如果map里没有，则说明是左侧符号
    if (!map[item]) {
      stack.push(item)
    } else {
      if (stack.pop() !== map[item]) {
        return false
      }
    }
  }
  return !stack.length
}

var isValid = function (s) {
  // 正则匹配字符串，遇到成对的符号就替换成''
  let len = 0
  // 需要一个终止条件，就是长度经过一轮替换，如果没有变化，说明已经到头了
  while (len !== s.length) {
    len = s.length
    s = s.replace('()', '').replace('{}', '').replace('[]', '')
  }
  return !s.length
}

// 测试
console.log(isValid('[](){}')) // true
console.log(isValid('[({})]')) // true
console.log(isValid('[({)}]')) // false字符串的replace方法是用于将字符串中的某个子串替换为另一个子串。当入参是正则表达式时，可以使用正则表达式来匹配要替换的子串。
```

## 二叉树

二叉树的特点:

- 左侧节点小于根节点
- 根节点小于右节点

### 增删改查

二叉树是一种常用的数据结构，它由节点组成，每个节点最多有两个子节点，左子节点比父节点小，右子节点比父节点大。以下是使用 JavaScript 实现二叉树的插入、搜索、删除和排序算法的示例：

```js
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinaryTree {
  constructor() {
    // 初始化二叉树时，是否需要初始化根节点
    this.root = null
  }

  // 插入节点，则需要找到对应的位置
  insert(value) {
    const node = new Node(value)

    if (!this.root) {
      this.root = node
    } else {
      let current = this.root

      while (current) {
        // 小值在左侧
        if (value < current.value) {
          if (!current.left) {
            current.left = node
            break
          }
          current = current.left
        } else if (value > current.value) {
          if (!current.right) {
            current.right = node
            break
          }
          current = current.right
        } else {
          break
        }
      }
    }
  }
  // 搜索节点
  search(value) {
    // 取出根节点
    let current = this.root

    while (current) {
      if (value < current.value) {
        current = current.left
      } else if (value > current.value) {
        current = current.right
      } else {
        return current
      }
    }

    return null
  }

  // 删除节点
  delete(value) {
    this.root = this._delete(this.root, value)
  }

  _delete(node, value) {
    if (!node) {
      return null
    }

    if (value === node.value) {
      if (!node.left && !node.right) {
        return null
      }

      if (!node.left) {
        return node.right
      }

      if (!node.right) {
        return node.left
      }

      const temp = this._minValueNode(node.right)
      node.value = temp.value
      node.right = this._delete(node.right, temp.value)
      return node
    }

    if (value < node.value) {
      node.left = this._delete(node.left, value)
      return node
    }

    node.right = this._delete(node.right, value)
    return node
  }

  _minValueNode(node) {
    let current = node

    while (current.left) {
      current = current.left
    }

    return current
  }

  // 排序
  sort() {
    const result = []

    function traverse(node) {
      if (node) {
        traverse(node.left)
        result.push(node.value)
        traverse(node.right)
      }
    }

    traverse(this.root)
    return result
  }
}

// 使用
const tree = new BinaryTree()

tree.insert(10)
tree.insert(5)
tree.insert(15)
tree.insert(3)
tree.insert(7)
tree.insert(13)
tree.insert(17)

console.log(tree.sort()) // [3, 5, 7, 10, 13, 15, 17]

tree.delete(15)

console.log(tree.sort()) // [3, 5, 7, 10, 13, 17]

console.log(tree.search(7)) // Node { value: 7, left: Node {...}, right: Node {...} }
console.log(tree.search(15)) // null
```

## 链表

链表是由一系列节点组成的数据结构，每个节点包含两个部分：数据部分和指针部分。数据部分存储节点的值，指针部分存储下一个节点的地址。

链表的结构如下：

```js
function LinkedList() {
  this.head = null
  this.length = 0

  function Node(data) {
    this.data = data
    this.next = null
  }

  this.add = function (data) {
    var node = new Node(data)
    // 如果head为null，则是第一个节点
    if (this.head == null) {
      this.head = node
    } else {
      // 拿到当前链表的头结点
      var current = this.head
      while (current.next !== null) {
        // 循环找到尾节点
        current = current.next
      }
      // 将新节点，挂载在尾节点上
      current.next = node
    }
    // 更新长度
    this.length++
  }

  this.remove = function (data) {
    if (this.head == null) {
      return null
    }

    // 移除节点时，是根据data来的
    if (this.head.data === data) {
      // 直接改变下一个节点的指向
      this.head = this.head.next
      this.length--
      return data
    }

    // 如果删除的数据不是当前节点，则需要找到
    var current = this.head
    while (current.next !== null) {
      // 如果找到，改变指向
      if (current.next.data === data) {
        current.next = current.next.next
        this.length--
        return data
      }
      // 循环找
      current = current.next
    }

    return null
  }

  // 查找节点
  this.search = function (data) {
    var current = this.head
    while (current !== null) {
      if (current.data === data) {
        return current
      }
      current = current.next
    }
    return null
  }
}
```

### 环形链表

提示词：想象在同一个跑道上，同时有两个人在跑步，一快一慢，二者肯定会相遇

```js
const circleLink = (head) => {
  // ❌ 注意下面的赋值语句❗️❗️❗️ 首先fast = head 是赋值表达式，然后fast的值为head，然后再赋值给slow，但是fast变成全局变量了。。。在浏览器里fast会泄露到全局
  // 在该项目中，会直接报错：caught ReferenceError: fast is not defined
  // let slow = fast = head
  let fast = head
  let slow = head

  while (fast && fast.next) {
    if (fast === slow) {
      return true
    }
    fast = fast.next.next
    slow = slow.next
  }
  // 遍历完，都没相遇，则肯定不是环形
  return false
}
```

### 相交链表

提示词：想象两条交汇的路 A 和 B，但 A 和 B 从哪里来是未知的

思路：

1. 因为 A 和 B 的长度不一，所以二者需要先走 Math.abs(A - B) 长度
2. 然后再挨个判断是否一致

```js
const intersectLink = (head1, head2) => {
  let len1 = 0
  let curt1 = head1
  let len2 = 0
  let curt1 = head2
  // 遍历二者的长度
  while (curt1 && curt1.next) {
    curt1 = curt1.next
    len1++
  }

  while (curt2 && curt2.next) {
    curt2 = curt2.next
    len2++
  }
  // 提高效率，如果遍历完，这里还不相等，那肯定就不想交了
  if (curt2 !== curt1) return null

  curt1 = head1
  curt2 = head2
  // 下面❌错误，二者不能同时走，应该是长的走
  // 二者同时走 Math.abs(len1 - len2)，用什么计量呢？
  // let counter = Math.abs(len1 - len2)
  // while(counter) {
  //   curt1 = curt1.next
  //   curt2 = curt2.next
  //   counter--
  // }
  if (len1 > len2) {
    for (let i = 0; i < len1 - len2; i++) {
      curt1 = curt1.next
    }
  } else {
    // 注意 len2 - len1 与上方不同
    for (let j = 0; j < len2 - len1; j++) {
      curt2 = curt2.next
    }
  }

  // 等到二者站在同一起跑线时，挨个对比，如果不相等，则继续向下
  while (curt1 !== curt2) {
    curt1 = curt1.next
    curt2 = curt2.next
  }
  // 最后，只需返回节点就行，如果二者相交，curt1肯定不是null
  return curt1
}
```

```js
const intersectLink = (headA, headB) => {
  let len1 = 0,
    len2 = 0
  let tail1 = headA,
    tail2 = headB

  while (tail1 && tail1.next) {
    tail1 = tail1.next
    len1++
  }
  while (tail2 && tail2.next) {
    tail2 = tail2.next
    len2++
  }

  if (tail1 !== tail2) {
    return null
  }

  // 步骤二：战线拉的长的，赶赶进度
  let cur1 = headA,
    cur2 = headB
  if (len1 > len2) {
    for (let i = 0; i < len1 - len2; i++) {
      cur1 = cur1.next
    }
  } else {
    for (let i = 0; i < len2 - len1; i++) {
      cur2 = cur2.next
    }
  }

  // 步骤三：赶完进度后，挨个对比，如果不一样，再继续往后走
  while (cur1 !== cur2) {
    cur1 = cur1.next
    cur2 = cur2.next
  }

  // 若相同，则直接返回，二者都可以；如果cur1最后是null那就是不相交
  return cur1
}
```

### 反转链表

反转链表的方法有很多种，最常用的是迭代法和递归法。这里我们采用迭代法来实现。

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

提示词：

```js
const reverseList = (head) => {
  let cur = head
  let newNext = null // 定义中间变量，作为中转

  while (cur) {
    // 暂存当前节点的指向，其实是下一个节点
    let oldNext = cur.next

    // 改变当前节点指向，指向反向的新节点
    cur.next = newNext

    // 继续向下走，cur已经修改完毕，后续作为新的节点，即newNext
    newNext = cur
    // 将之前缓存的节点，作为当前的节点
    cur = oldNext
  }
  // 根据循环，当while(5)，进入最后一轮循环，结束后cur为null
  // 因此应该返回nexNext
  return nexNext
}
```

### 合并 K 个升序链表

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  // 前提条件，如果长度为0或者为1，特殊处理
  const len = lists.length
  if (!len) return null
  if (len === 1) return lists[0]

  // 因为lists的长度不确定，但每次也只能同时操作两个
  const mergeTwoLists = (l1, l2) => {
    if (!l1) return l2
    if (!l2) return l1

    // 这是链表，虽然题目描述里，模拟的数组接口，不要真的按数组方式处理
    // 链表结构，l1.val就是头结点的值
    if (l1.val < l2.val) {
      // 谁小，谁在前面
      l1.next = mergeTwoLists(l1.next, l2)
      // 执行完，还需要返回，外界还需要
      return l1
    } else {
      l2.next = mergeTwoLists(l1, l2.next)
      return l2
    }
  }

  // 假定第一项就是基准
  let merged = lists[0]

  for (let i = 1; i < lists.length; i++) {
    merged = mergeTwoLists(merged, lists[i])
  }

  return merged
}
```

### 回文链表

#### 方式一

1. 使用快慢指针找到链表的中点，将链表分为两部分。
2. 将后半部分链表反转。
3. 比较前半部分链表和后半部分链表的值是否相等，如果有一个不相等则返回 false，否则返回 true。

```js
function isPalindrome(head) {
  if (!head || !head.next) {
    return true
  }

  let slow = head
  let fast = head

  // 快慢指针走到中间位置
  while (fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
  }

  let pre = null
  let cur = slow.next
  slow.next = null

  // 反转后半部分
  while (cur) {
    let next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }

  // 对比头部和尾部
  while (head && pre) {
    if (head.val !== pre.val) {
      return false
    }
    head = head.next
    pre = pre.next
  }

  return true
}
```

#### 方式二

```js
var isPalindrome = function (head) {
  let res = ''
  while (head) {
    res += head.val
    head = head.next
  }
  for (let i = 0, j = res.length - 1; i < j; i++, j--) {
    if (res[i] !== res[j]) {
      return false
    }
  }
  return true
}
```

### K 个一组翻转链表

给你链表的头节点 head ，每  k  个节点一组进行翻转，请你返回修改后的链表。

k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是  k  的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]

输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

1. 先定义一个函数 reverse，用来反转一个链表。
2. 定义一个函数 reverseKGroup，用来实现每 k 个节点反转一次的功能。
3. 首先，我们需要统计链表的长度，以便确定要反转几次。
4. 然后，我们从头节点开始遍历链表，每遍历 k 个节点，就将这 k 个节点反转一次。
5. 反转 k 个节点的方法是先将它们全部取出来，然后调用 reverse 函数进行反转，最后将它们重新连接起来。
6. 如果剩下的节点不足 k 个，就不进行反转，直接将它们连接到已经反转好的部分的末尾。
7. 最后，返回反转后的链表头节点。

```js
// 反转链表的方法
function reverse(head) {
  let prev = null
  let curr = head
  while (curr) {
    let next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

// 反转k
function reverseKGroup(head, k) {
  let len = 0
  let curr = head
  // 得到链表的长度
  while (curr) {
    len++
    curr = curr.next
  }

  // 实例化节点，并将新节点指向head
  let dummy = new ListNode()
  dummy.next = head
  let prev = dummy

  // 7 / 2 => 3 反转3次
  for (let i = 0; i < Math.floor(len / k); i++) {
    // 从头开始遍历
    let start = prev.next
    for (let j = 1; j < k; j++) {
      // 暂存
      let next = start.next
      // 重写
      start.next = next.next
      // 覆盖
      next.next = prev.next
      // 继续
      prev.next = next
    }
    prev = start
  }
  return dummy.next
}
```

- 时间复杂度：O(n)，其中 n 是链表的长度。遍历链表一次的时间复杂度是 O(n)，反转每个长度为 k 的子链表的时间复杂度是 O(k)，因此总时间复杂度是 O(n)。
- 空间复杂度：O(1)。我们只需要常数的空间存储若干变量。

## Promise 相关

### promiseLimit

```js
const promiseLimit = (ps, limit) => {
  // 异步编程，肯定需要promise
  return new Promise((resolve, reject) => {
    let running = 0
    let idx = 0
    let results = []

    // runTask 辅助函数：执行具体的异步任务
    const runTask = (task) => {
      running++
      console.log('运行中的数量：', running)
      // task本身是promise，所以直接then
      task()
        .then((res) => {
          // 到这里一个任务就结束了
          running--
          results.push(res)
          // 然后开启新的任务
          walk()
        })
        .catch((err) => reject(err))
    }

    // 主函数，执行入口
    const walk = () => {
      // 正在运行的数量小于limit，则持续压入
      while (running < limit && idx < ps.length) {
        runTask(ps[idx])
        idx++
      }
      // while循环结束后，如果running为0，说明已经全部结束
      if (!running) resolve(results)
    }
    walk()
  })
}

const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 3000)),
  () => new Promise((resolve) => setTimeout(() => resolve(4), 4000)),
  () => new Promise((resolve) => setTimeout(() => resolve(5), 5000)),
  () => new Promise((resolve) => setTimeout(() => resolve(6), 6000)),
]

promiseLimit(tasks, 2)
  .then((results) => {
    console.log(results)
  })
  .catch((error) => {
    console.error(error)
  })
```

### promiseAll

```js
const promiseAllV1 = (ps) => {
  return new Promise((resolve, reject) => {
    let count = 0
    let results = []
    const len = ps.length

    // 遍历执行ps
    for (let i = 0; i < len; i++) {
      ps[i]
        .then((val) => {
          // 更新次数，压入值
          count++
          // results.push(val) // 需要保证顺序
          results[i] = val

          // 判断次数
          if (count === len) {
            resolve(results)
          }
        })
        .catch((err) => reject(err))
    }
  })
}

const tasksV1 = [Promise.resolve(1), Promise.resolve(3)]

// 以下几种操作方式都不对
// console.log('promiseAllV1结果：', promiseAllV1(tasksV1))     // ❌ promiseAllV1是一个promise，需要.then调用才能拿到结果
// const resV1 = promiseAllV1(tasksV1).then(res => res)        // ❌ 这个res并不会返回，因此resV1拿到的只是一个新的Promise
// console.log('promiseAllV1结果：', resV1)                     // ❌ 打印：Promise {<pending>}
promiseAllV1(tasksV1).then((res) => console.log('promiseAllV1结果：', res)) // ✅ [1, 3]
```

## 常见算法

### LRU（Least Recently Used）

```js
const lruCache = (size) => {
  const map = new Map()
  const maxSize = size

  return {
    get(key) {
      if (map.has(key)) {
        const val = map.get(key)
        // 删除再添加，从而达到更新效果
        map.delete(key)
        map.set(key, val)
        // 最后返回val
        return val
      }
      return -1
    },

    //
    put(key, val) {
      // 如果有，直接删除
      if (map.has(key)) {
        map.delete(key)
      }

      // 重新赋值
      map.set(key, val)

      // 设置完数据，需要检查大小
      if (map.size > maxSize) {
        // 找到最开始的那个干掉
        const firstKey = map.keys().next().value
        map.delete(firstKey)
      }
    }, // 注意是对象，需要逗号分割

    keys() {
      return map.keys()
    },
  }
}

const cache = lruCache(2)

cache.put('a', 1)
cache.put('b', 2)
cache.put('c', 3) // 操作完这个 a 将会消失
console.log(cache.get('a')) // 输出 -1

// 💥 注意观察下面返回的可迭代对象，.next()，第一次迭代，就是第一个了
console.log(cache.keys()) // 输出可迭代对象 MapIterator {'b', 'c'}
// 0 : "b"
// 1 : "c"

// 💥 上面是拿key，如果想拿到value，可以用 cache.values()
// 其实还可以 cache.values() 得到全是value的迭代器。因此可根据情况使用
```
