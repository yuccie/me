---
title: '数据结构'
date: Fri May 12 2023 21:18:08 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['数据结构', '递归', '迭代']
draft: false
summary: '软件架构的规则是相同的！！！'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/data-structure
---

## 前言

1. 确定用哪种方法解
2. 搭建解法架构
3. 填充内容

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

'a.b.1.d'.split('.').reduce((acc, cur) => {
  // const temp = acc[cur] ? acc[cur] : undefined  不行，需要处理acc
  return acc?.[cur] // 这样就好了
}, val)

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

1. 两个指针，从左到右分别移动
2. 两个指针都必须小于对应数组的长度
3. 移动一遍之后，肯定剩下长的那个，然后再处理

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

  // 前面处理交集，下面处理的就是剩下的，要么arr1，要么arr2
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

[stackblitz 数组相关](https://stackblitz.com/edit/js-rxwzmh?file=index.js)

### 实现一个数组的全排列

给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

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
      // 当 permutation = [3] 时
      // 当 j = 0 时，permutation.slice(0, j) 其实就是空，然后first就是 2, permutation.slice(0)就是3 -> [2, 3]
      // 当 j = 1 时，permutation.slice(0, 1)就是3，permutation.slice(1)就是空，所以为 [3, 2]
      // 下面的作用很巧妙，将first插入到permutation的各个位置。
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

1. 首先，在函数的第一行，如果数组只有一个元素，直接返回该元素，时间复杂度为 O(1)。
2. 然后，获取第一个元素和剩余的元素的时间复杂度为 O(1)。
3. 接着，递归获取剩余元素的全排列的时间复杂度为 O((n-1) \* (n-1)!)，因为每次递归都会减少一个元素，所以递归的次数是 n-1，每次递归都要进行全排列，因此时间复杂度为(n-1)!。
4. 最后，将第一个元素插入到每个排列的位置的时间复杂度为 O(n!)，因为每个排列的长度为 n-1，所以需要将第一个元素插入到 n-1 个位置，共有(n-1)!个排列。

因此，总的时间复杂度为 O(n\*n!)。

#### 方式二

1. 深度优先遍历，
2. 定义深度优先遍历函数

```js
var permute = function (nums) {
  // 存储全排列的结果
  let res = []

  // 初期的路径为空
  dfs([])

  function dfs(path) {
    // 如果路径长度和数组长度相等，说明一轮排列完成了
    if (path.length === nums.length) {
      res.push([...path])
    }

    // 遍历剩余的选择，将不重复的选择添加进path里
    for (let num of nums) {
      // 重复选择了，就继续循环
      // 这里做判断了，也就不用start标识了。
      if (path.includes(num)) continue

      // 如果没用过，则加到路径中
      path.push(num)
      // dfs，一条路走到头
      dfs(path)
      // 一条路径包含所有的值，递归结束，然后后退
      path.pop()
    }
  }
  return res
}

// 示例用法
console.log(permute([1, 2, 3]))
```

### 全排列 2

给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

- 注意：这里有重复的
- 需要记录每个位置上的数字，是否使用过

```
输入：nums = [1,1,2]
输出：[[1,1,2], [1,2,1], [2,1,1]]
```

```js
var permuteUnique = function (nums) {
  // 定义结果数组
  const result = []
  // 初始化一个数据，用来标记哪些使用过了
  const used = Array(nums.length).fill(false)
  // 排序，将相同的数字都挨着
  nums.sort((a, b) => a - b)
  // 执行回溯函数
  backtrack([])

  // 定义回溯函数
  function backtrack(path) {
    // 先判断是否满足条件
    if (path.length === nums.length) {
      result.push([...path])
      return
    }
    // 遍历数组
    for (let i = 0; i < nums.length; i++) {
      // 如果使用过，则不用再遍历
      if (used[i]) continue
      // 如果前后重复了呢？上面需要先排序
      // 这里判断，如果多个相邻的都重复，那就需要一直往后走
      // 这里需要判断是前一个，!used[i - 1] 为ture，说明前一个为false，肯定之前某个位置已经处理过了
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue

      used[i] = true
      path.push(nums[i])
      backtrack(path)
      path.pop()
      used[i] = false
    }
  }
  return result
}
```

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

- 定义个最大值变量，然后再定一个当前子序列长度的变量
- 满足条件时，则一直累加，否则判断二者大小

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

- 遍历数组，先找到每个序列的开始值
- 然后 while 循环看能找到多少

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
  // const isEven = res.length & 1 === 0 // 和1进行与操作，偶数比为0
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

### 寻找数组中第三大的数

```js
function findThirdLargestNumber(arr) {
  if (arr.length < 3) {
    return '数组长度不足3'
  }

  // Number.POSITIVE_INFINITY 正无穷
  // Number.NEGATIVE_INFINITY 负无穷大
  let first = Number.NEGATIVE_INFINITY
  let second = Number.NEGATIVE_INFINITY
  let third = Number.NEGATIVE_INFINITY

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > first) {
      third = second
      second = first
      first = arr[i]
    } else if (arr[i] > second && arr[i] < first) {
      third = second
      second = arr[i]
    } else if (arr[i] > third && arr[i] < second) {
      third = arr[i]
    }
  }

  if (third === Number.NEGATIVE_INFINITY) {
    return '数组中没有第三大的数'
  }

  return third
}

// 示例用法
const numbers = [1, 3, 5, 2, 9, 8, 7]
const thirdLargest = findThirdLargestNumber(numbers)
console.log(thirdLargest) // 输出: 7
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
    // 如果 C - B 存在，则说明存在一个和为k的子数组，直接累加即可
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
    // preSum[1] 就是前1项的和，也就是 索引0和1的和。
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

- 利用双指针，分别指向最左侧和最右侧，
- 然后相加，并与 target 做对比
- 因为已经是递增排序的了，所以如果小于，则 left++

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
- 已经排序好了，从最左和最右，往内部挤压，这里只会返回一对，如果多对则需要修改

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
  nums.sort((a, b) => a - b) // 先排序，排序不能直接sort，因为涉及到Unicode的排序

  const res = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue // 避免重复

    // 外层循环是第一个数，第二个和第三个，则需要循环
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

1. 首先将数组排序，然后从左到右遍历数组，**以当前元素作为三数之和的第一个数，用双指针 left 和 right 分别指向当前元素的下一个元素和数组末尾元素。**
2. 在双指针的循环中，计算三数之和，如果等于 0，则将三个数加入结果数组中，并将 left 和 right 分别向中间移动一位，同时跳过重复的数（因为已经排序，所以相同的数一定在一起）。
3. 如果三数之和小于 0，则将 left 向右移动一位，因为数组已经排序，所以将 left 右移可以让三数之和变大。
4. 如果三数之和大于 0，则将 right 向左移动一位，可以让三数之和变小。
5. 1 最终返回结果数组。

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
- 相比三数之和，四数之和是两层 for 循环
- 而两数之和，不需要 for 循环就搞定了，左右指针
- 其实就相当于：三数之和为一个 for 循环加一个两数之和，四数之和则相当于两个 for 循环加一个两数之和

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
```

## 递归

简单来说，函数的递归调用就是自己调用自己，即一个函数在调用其他函数的过程中，又出现了对自身的调用，这种函数称为递归函数。

- 直接调用：f() -> f()
- 间接调用：f() -> f1() -> f()

其实递归的思想，是分而治之，而且每次的输入值的范围都会变小（**其实也就是自顶向下的思想**），知道设置的条件满足即退出，

**示例一：从给定的数字倒数到最小的数字，每次减 1。**

```js
function countDown(num) {
  if (num === 1) {
    return num
  }
  // console.log(num)

  // 输入值：每次都减少，顶部是num，下一个则是 num - 1，自顶向下
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

  // 定义数组，且初始化的值为 倒数第二位
  let arr = fib1(num - 1)

  // 加入最后一位的值，是前两者的和
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

1. 首先，动态规划问题的一般形式就是求最值。比如说让你求最长递增子序列呀，最小编辑距离呀等等。
2. 既然是要求最值，核心问题是什么呢？**求解动态规划的核心问题是穷举**。因为要求最值，肯定要把所有可行的答案穷举出来，然后在其中找最值呗。
3. 虽然动态规划的核心思想就是穷举求最值，但是问题可以千变万化，穷举所有可行解其实并不是一件容易的事，需要你熟练掌握递归思维，只有列出正确的「状态转移方程」，才能正确地穷举。
4. 而且，你需要判断算法问题是否具备「最优子结构」，是否能够通过子问题的最值得到原问题的最值。
5. 另外，动态规划问题存在「重叠子问题」，如果暴力穷举的话效率会很低，所以需要你使用「备忘录」或者「DP table」来优化穷举过程，避免不必要的计算。
6. 因此：**重叠子问题、最优子结构、状态转移方程**就是动态规划三要素

如何列出状态转移方程：

明确 base case -> 明确「状态」-> 明确「选择」 -> 定义 dp 数组/函数的含义。

```js
var fib = function (N) {
  if (N === 1 || N === 2) return 1
  return fib(N - 1) + fib(N - 2)
}
```

上面的算法之所以低效，就是存在大量的 重复计算 ，也就是 重叠子问题，那如何用备忘录去解决它呢？

- 时间复杂度：用子问题个数乘以解决一个子问题需要的时间
  - 这里递归其实是一个二叉树，子问题的个数也就是节点的个数：2^n，第一层 1 个，第二层 2 个，第三层 4 个，第四层 8 个，也就是 2^3
  - 解决一个子问题的时间是：O(1)
  - 总的时间复杂度：2^n

```js
var fib = function (N) {
  // 备忘录全初始化为 0
  let memo = new Array(N + 1).fill(0)
  // 进行带备忘录的递归
  return dp(memo, N)
}

// 带着备忘录进行递归
var dp = function (memo, n) {
  // base case
  if (n == 0 || n == 1) return n
  // 已经计算过，不用再计算了
  if (memo[n] !== 0) return memo[n]

  // 将计算过的数据都放在缓存里
  memo[n] = dp(memo, n - 1) + dp(memo, n - 2)
  return memo[n]
}
```

- 时间复杂度：用子问题个数乘以解决一个子问题需要的时间
  - 由于没有重复计算，子问题个数为 O(n)
  - 每个子问题的耗时，没有什么循环，因此 O(1)
  - 总的时间复杂度就是：O(n)

观察递归算法，其实有以下结论:

- 上面的斐波那契数列计算是「自顶向下」进行「递归」求解，而这里直接求目标值
- 而动态规划，则是「自底向上」进行「递推」求解，其实就是先求 最开始的值

有了上一步「备忘录」的启发，我们可以把这个「备忘录」独立出来成为一张表，通常叫做 DP table，在这张表上完成「自底向上」的推算岂不美哉！

```js
var fib = function (N) {
  if (N === 0) return 0
  // 定义表
  let dp = new Array(N + 1).fill(0)

  // base case 初始状态
  dp[0] = 0
  dp[1] = 1

  // 状态转移方程
  for (let i = 2; i <= N; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[N]
}
```

上面的 dp 表，空间复杂度是 O(n)，其实还可以再优化成 O(1)，因为观察它`dp[i] = dp[i - 1] + dp[i - 2]` 发现其实
只需要存储两个数就可以。如下

```js
var fib = function (N) {
  let a = 0
  let b = 1
  let sum = 0

  // 状态转移方程
  for (let i = 2; i <= N; i++) {
    // 累加和
    sum += b
    // a,b不停的向后移动
    let temp = a + b
    a = b
    b = temp
  }

  return sum
}
```

### 如何高效的给出 动态规划类问题的解法

1. 理解问题的本质：动态规划算法是**解决最优化问题的一种方法**，通常需要对问题进行抽象和建模。因此，理解问题的本质和特点是非常重要的，只有深入理解问题，才能够有效地设计和实现动态规划算法。
2. 确定状态和状态转移方程：动态规划算法的核心是**状态和状态转移方程**。因此，在设计动态规划算法时，需要明确定义状态，并确定状态之间的转移关系。这通常需要一定的数学建模和分析能力。
3. 利用备忘录和递归：**动态规划算法通常需要解决大量的子问题，因此，可以使用备忘录和递归的方法来避免重复计算。备忘录可以记录已经计算过的结果，避免重复计算。递归可以将问题分解成更小的子问题，**便于求解。
4. 优化空间复杂度：动态规划算法**通常需要使用一个二维数组或者更大的空间来记录状态和转移方程**。为了优化空间复杂度，可以使用滚动数组或者状态压缩的方法来减少空间占用。
5. 利用优化技巧：动态规划算法通常需要进行一些优化，例如剪枝、贪心、二分等技巧。这些技巧可以帮助我们更快地求解问题，提高算法效率。

- 剪枝：在动态规划过程中，某些状态的计算可能会被重复执行，造成时间复杂度的增加。剪枝就是通过某些方法，避免不必要的重复计算，从而提高算法的效率。
- 贪心：贪心算法是一种基于贪心策略的算法，它在每一步都选择当前状态下的最优解，从而得到全局最优解。在动态规划中，贪心算法可以用来优化状态转移方程，减少状态的数量和计算量。

### 零钱兑换

给你 k 种面值的硬币，面值分别为 `c1, c2 ... ck`，每种硬币的数量无限，再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，如果不可能凑出，算法返回 -1 。

比如说 k = 3，面值分别为 1，2，5，总金额 amount = 11。那么最少需要 3 枚硬币凑出，即 11 = 5 + 5 + 1。

**你认为计算机应该如何解决这个问题？显然，就是把所有可能的凑硬币方法都穷举出来，然后找找看最少需要多少枚硬币。**

**1、暴力递归**

首先，这个问题是动态规划问题，因为它具有「最优子结构」的。要符合「最优子结构」，子问题间必须互相独立。

说白了，各个子问题不相互影响，比如要想考出很高的分，只需要每个学科的分都很高就足够了，每个学科都是相互独立的。

回到凑零钱问题，为什么说它符合最优子结构呢？假设你有面值为 1, 2, 5 的硬币，你想求 amount = 11 时的最少硬币数（原问题），**如果你知道凑出 amount = 10, 9, 6 的最少硬币数（子问题），你只需要把子问题的答案加一（再选一枚面值为 1, 2, 5 的硬币），求个最小值，就是原问题的答案**。因为硬币的数量是没有限制的，所以子问题之间没有相互制，是互相独立的。

**2、如何列出目标转移方程**

1. 确定 base case，这个很简单，显然目标金额 amount 为 0 时算法返回 0，因为不需要任何硬币就已经凑出目标金额了。
2. 确定「状态」，也就是原问题和子问题中会变化的变量。由于硬币数量无限，硬币的面额也是题目给定的，只有目标金额会不断地向 base case 靠近，所以唯一的「状态」就是目标金额 amount。
3. 确定「选择」，也就是导致「状态」产生变化的行为。目标金额为什么变化呢，因为你在选择硬币，你每选择一枚硬币，就相当于减少了目标金额。所以说所有硬币的面值，就是你的「选择」。
4. 明确 dp 函数/数组的定义。我们这里讲的是自顶向下的解法，所以会有一个递归的 dp 函数，
   1. 一般来说函数的参数就是状态转移中会变化的量，也就是上面说到的「状态」；
   2. 函数的返回值就是题目要求我们计算的量。就本题来说，状态只有一个，即「目标金额」，题目要求我们计算凑出目标金额所需的最少硬币数量。

所以我们可以这样定义 dp 函数：dp(n) 表示，输入一个目标金额 n，返回凑出目标金额 n 所需的最少硬币数量。

```js
// 具有最优子结构，然后想办法穷举所有，同时利用备忘录
var coinChange = function (coins, amount) {
  // 定义dp数组，索引表示金额，数组中的值，表示对应硬币的数量
  // 总金额是amount，但是总金额也是由 各个子金额叠加过来的
  // 先假设每个面值都需要很多个硬币组成
  let dp = Array(amount + 1).fill(Infinity) // 注意是 amount + 1，因为索引0开始
  // 初始化base case，当面值是0时，肯定不需要任何硬币
  dp[0] = 0

  // 列出状态转移方程，穷举出所有金额的可能性
  // for (let i = 1; i <= amount; i++) {
  //   // i其实就是对应的金额，当金额为i时，最小需要多少个硬币
  //   for (let coin of coins) {
  //     if (i >= coin) {
  //       // 当前面额是coin，在不使用coin时，方案数量为 dp[i]
  //       // 如果选择使用coin，那只能是 dp[i-coin] + 1，1就是coin，很明确
  //       // 而dp[i-coin]，就是总金额i - coin
  //       dp[i] = Math.min(dp[i], dp[i - coin] + 1)
  //     }
  //   }
  // }
  // 上面的for循环还可以如下，更加高效，谁在内层和外层，效果是一样的。
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      // 当不使用coin时，就是dp[i]
      // 当使用coin时，dp[i-coin] + 1，1就是coin本身
      // i 是总金额，若使用coin，则必存在 dp[i-coin]最优，在加上1个coin硬币，就出最优结果了
      dp[i] = Math.min(dp[i], dp[i - coin] + 1)
    }
  }
  // 其实就是穷举，列出所有可能，然后找出最优
  // console.log(dp);
  return dp[amount] === Infinity ? -1 : dp[amount]
}
```

### 零钱兑换 2

给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。

请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。

假设每一种面额的硬币有无限个。

题目数据保证结果符合 32 位带符号整数。

```
输入：amount = 5, coins = [1, 2, 5]
输出：4
解释：有四种方式可以凑成总金额：
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
```

- 相比凑零钱 1，这里需要记录每个组合

```js
var change = (amount, coins) => {
  // 索引是金额，值是可以组成该金额的方案数量
  const dp = Array(amount + 1).fill(0)
  // 初始化
  dp[0] = 1 // 金额为0，肯定只有一种方案

  // 穷举
  // 外层循环枚举每一种硬币，内层循环则枚举使用当前硬币 coin 时，能够组成的所有金额 i。
  for (const coin of coins) {
    // 然后只使用一个coin，可以组成多少状态呢？也就是内层循环
    // 如果就这一个coin，那组成的金额肯定 >= coin，也就是i从coin开始
    for (let i = coin; i <= amount; i++) {
      // 对于面额为 coin的硬币，当 coin<= i <=amount时，如果存在一种硬币组合的金额之和等于i-coin
      // 则在该硬币组合中增加一个面额为coin的硬币，即可得到一种金额之和为i的硬币组合。
      dp[i] = dp[i] + dp[i - coin]
    }
  }

  return dp[amount]
}
```

对于每个 i，我们需要考虑两种情况：

- 不使用当前的硬币 coin。此时，组成金额 i 的方案数应当与组成金额 i 时不使用当前硬币 coin 的方案数相同，即 dp[i] = dp[i]。
- 使用当前的硬币 coin。此时，我们需要考虑使用当前硬币 coin 之前的组合方案。
  - 这些方案中，金额之和为 i - coin 的方案可以通过在这些方案中增加一个面额为 coin 的硬币得到。因此，使用当前硬币 coin 可以得到的组合方案数应当等于金额为 i - coin 的方案数，即 dp[i - coin]。

因此，我们可以将这两种情况的方案数相加，得到组成金额 i 的所有方案数：dp[i] = dp[i] + dp[i - coin]。

总结零钱兑换：

- 多层循环，不要一下子看多层，先选定一个外层数字，然后执行一遍内层循环
- 多层循环，无所谓谁在外层，还是在内层，但内外层有时候会导致一些不一样的代码逻辑，但本质是一样的

### 接雨水

题目：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。【力扣 42 题】

- 可以理解为，一排高低不同的实心阶梯，下雨后，阶梯里可以存多少水
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

### 青蛙跳台阶问题

```js
function numWays(n) {
  if (n <= 0) {
    return 1
  }

  let dp = Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1
  // 控制数值范围：通过取模运算，可以将一个较大的数值限制在一个较小的范围内。例如，取模 1000000007 可以将结果限制在 0 到 1000000006 之间。
  // 防止整数溢出：当进行大数运算时，结果可能会超出计算机表示的整数范围。取模运算可以防止这种溢出情况的发生，并确保结果仍在可表示的范围内。
  // 常用于计数和累加操作：当需要对计数或累加的结果进行取模时，可以避免结果过大而导致溢出问题。这在动态规划、组合数学、排列组合等领域中经常用到。
  // 在一些算法中，取模运算可以产生周期性的结果，利用这个特性可以优化计算，减少重复计算或存储的开销。
  // 总之，取模运算可以帮助我们控制数值范围、避免整数溢出，并在某些情况下提供算法的优化。在特定的问题中，使用适当的模数进行取模运算是很常见的操作。
  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] % 1000000007) + (dp[i - 2] % 1000000007)
  }
  return dp[n] % 1000000007
}

// 解释为何：dp[i] = dp[i - 1] + dp[i - 2]
// 假设我们有一个 4 级的台阶。我们可以使用以下符号来表示每一级台阶的跳法数量：

// dp[0]: 第 0 级台阶的跳法数量
// dp[1]: 第 1 级台阶的跳法数量
// dp[2]: 第 2 级台阶的跳法数量
// dp[3]: 第 3 级台阶的跳法数量
// dp[4]: 第 4 级台阶的跳法数量
// 现在，让我们一步步计算每一级台阶的跳法数量：

// 初始情况下，我们已知 dp[0] = 1（跳上 0 级台阶只有一种跳法）和 dp[1] = 1（跳上 1 级台阶只有一种跳法）。
// 现在我们计算 dp[2]，也就是跳上第 2 级台阶的跳法数量。我们可以有两种方式到达第 2 级台阶：
// 从第 1 级台阶跳一级到达第 2 级台阶。
// 从第 0 级台阶跳两级到达第 2 级台阶。
// 因此，dp[2] = dp[1] + dp[0] = 1 + 1 = 2。
// 接下来，我们计算 dp[3]，也就是跳上第 3 级台阶的跳法数量。同样，我们可以有两种方式到达第 3 级台阶：
// 从第 2 级台阶跳一级到达第 3 级台阶。
// 从第 1 级台阶跳两级到达第 3 级台阶。
// 因此，dp[3] = dp[2] + dp[1] = 2 + 1 = 3。
// 最后，我们计算 dp[4]，也就是跳上第 4 级台阶的跳法数量。同样，我们可以有两种方式到达第 4 级台阶：
// 从第 3 级台阶跳一级到达第 4 级台阶。
// 从第 2 级台阶跳两级到达第 4 级台阶。
// 因此，dp[4] = dp[3] + dp[2] = 3 + 2 = 5。
```

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

    // 移动指针，移动小的，目的是找出大的
    arr[leftIdx] < arr[rightIdx] ? leftIdx++ : rightIdx--
  }
  return max
}
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) // 49
// 其实就是 height[8]  height[1] => (8 - 1) * Math.min(7, 8) => 49
```

### 最长递增子序列

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7] 是数组 [0,3,1,6,2,2,7]`的子序列。

```
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2, 3, 7, 101]，因此长度为 4 。
```

- 通俗讲就是：不改变原有数组元素的顺序，同时是升序的子序列

```js
function lengthOfLIS(nums) {
  const n = nums.length
  // 首先，我们初始化 dp 数组的所有元素为 1，因为每个位置自身都是一个递增子序列。
  const dp = new Array(n).fill(1)

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        // 我们遍历数组 nums，对于每个位置 i，再遍历其之前的位置 j（从 0 到 i-1）。
        // 如果 nums[i] > nums[j]，意味着我们可以将位置 i 加入到以位置 j 结尾的子序列中，从而形成一个更长的递增子序列。
        // 我们通过比较 dp[i] 和 dp[j] + 1，选择其中较大的值来更新 dp[i]。
        // dp[i] 表示以位置 i 结尾的最长递增子序列的长度。
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }

  // 这样，当遍历完整个数组 nums 后，dp 数组中的最大值即为最长递增子序列的长度。
  // 最后，我们遍历 dp 数组，找到其中的最大值，即为所求的最长递增子序列的长度。

  let maxLength = 0
  for (let i = 0; i < n; i++) {
    maxLength = Math.max(maxLength, dp[i])
  }

  return maxLength
}

// 示例用法
const nums = [10, 9, 2, 5, 3, 7, 101, 18]
const lisLength = lengthOfLIS(nums)
console.log(lisLength) // 输出: 4

// 在示例用法中，给定数组 [10, 9, 2, 5, 3, 7, 101, 18]，我们首先初始化 dp 数组为 [1, 1, 1, 1, 1, 1, 1, 1]。

// 接下来，我们开始遍历数组 nums：

// 对于 nums[1] = 9，在其之前的元素中没有比它小的数，所以 dp[1] 保持为 1。
// 对于 nums[2] = 2，在其之前的元素中有比它小的数（nums[1] = 9），所以我们可以将 nums[2] 加入到以 nums[1] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[2] 更新为 2。
// 对于 nums[3] = 5，在其之前的元素中有比它小的数（nums[2] = 2），所以我们可以将 nums[3] 加入到以 nums[2] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[3] 更新为 2。
// 对于 nums[4] = 3，在其之前的元素中有比它小的数（nums[2] = 2），所以我们可以将 nums[4] 加入到以 nums[2] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[4] 更新为 2。
// 对于 nums[5] = 7，在其之前的元素中有比它小的数（nums[2] = 2 和 nums[4] = 3），所以我们可以将 nums[5] 加入到以 nums[2] 或 nums[4] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[5] 更新为 3。
// 对于 nums[6] = 101，在其之前的元素中有比它小的数（nums[2] = 2、nums[4] = 3 和 nums[5] = 7），所以我们可以将 nums[6] 加入到以 nums[2]、nums[4] 或 nums[5] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[6] 更新为 4。
// 对于 nums[7] = 18，在其之前的元素中有比它小的数（nums[2] = 2、nums[4] = 3 和 nums[5] = 7），所以我们可以将 nums[7] 加入到以 nums[2]、nums[4] 或 nums[5] 结尾的子序列中，从而形成一个更长的递增子序列。因此，dp[7] 更新为 4。
// 最后，遍历 dp 数组，找到其中的最大值 4，即为所求的最长递增子序列的长度。
```

## 字符串

- 双指针算法：使用两个指针分别指向字符串的不同位置，通过移动指针来解决问题，例如判断回文字符串、最长回文子串等问题。
- 动态规划算法：通过拆分问题为子问题，然后通过递推求解的方式得到最终的解，例如最长公共子序列、编辑距离等问题。
- KMP 算法：通过预处理模式字符串的信息，然后在匹配过程中利用这些信息来跳过不必要的比较，从而提高匹配效率。
- 哈希算法：通过将字符串映射到一个哈希值上，可以快速判断两个字符串是否相等，例如字符串匹配问题。
- Trie 树算法：通过构建一个树形结构来存储字符串集合，可以快速地查找、插入、删除字符串，例如前缀匹配、字符串排序等问题。
- 线段树算法：通过将字符串转换为数值表示，可以使用线段树来维护区间信息，例如区间最大值、区间和等问题。
- 后缀数组算法：通过将字符串的所有后缀排序，可以快速地求解多种字符串问题，例如最长重复子串、最长公共前缀等问题。

- substring 和 slice 的使用方法相同，但是 substring 不支持负数参数，而 slice 可以。substring 如何开始大于结束，则自动交换二者位置。slice 则直接返回空
- substr 和 slice 的截取方式相同，但是 substr 的第二个参数是截取的长度，而 slice 的第二个参数是截取的结束位置。

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
  // 遍历字符串，从每个索引位置向两侧发散
  for (let i = 0; i < s.length; i++) {
    // 以当前字符为中心的奇数长度的回文子串
    let l = i
    let r = i
    // 左侧>=0，右侧需 < s.length
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--
      r++
    }
    // while循环完以后，判断是否为最长。
    // 最后会执行一次，l--,r++，而slice又是[)，因此可以直接如下
    let palindrome = s.slice(l + 1, r)
    // 如果比最长的还长，则更新最长的
    if (palindrome.length > longest.length) {
      longest = palindrome
    }

    // 想象一下4个字符时。
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

- 这里子序列的定义是，不改变剩余字符顺序的情况下

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
  // 左上角到右下角的对角线，下方都是无效数据，因为字符串截取肯定是i < j
  for (let i = len - 1; i >= 0; i--) {
    // i 和 j 的大小关系是啥？
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

给定一个包含大写字母和小写字母的字符串  s ，返回通过这些字母构造成的 最长的回文串  。

在构造过程中，请注意 区分大小写 。比如  "Aa"  不能当做一个回文字符串。

- 不要求顺序，自由组装

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
    // 想象下，其实就是不停的往里放，然后又向外取，来计数
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
  // 拼接两个，然后前后各去掉一个。
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

- 其实就是先移动有指针，找到所有覆盖目标字符串的右边界
- 然后再开始移动左指针

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
      // 是0，其实就表示，这个字符属于目标字符，然后再统计其次数
      if (map[char] === 0) {
        counter++
      }
      // 当counter等于0时，其实 map里的数据，要么是0，要么是-1
      map[char] = (map[char] || 0) + 1
      left++
    }
  }
  // 当两层循环都结束后，就可以得到最小的 minLen 和 minLeftStart
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
var lengthOfLongestSubstring = function (s) {
  // 利用两个指针模拟一个滑动窗口
  let left = 0
  let right = 0
  let len = s.length

  let res = ''
  let maxLen = 0

  while (left <= right && right < len) {
    // 判断是否重复，不重复拼接
    if (res.indexOf(s[right]) === -1) {
      res += s[right]
      right++
      // 更新最大值
      maxLen = Math.max(res.length, maxLen)
    } else {
      // 如果重复了，则移动左指针，并重新得到新的子串
      // pww -> ww -> wk
      // 这里不能使用 ++left，因为left会累加，其实如果重复，每次都是从第二项开始截取即可
      // res = res.slice(++left, right + 1)  left没啥用
      res = res.slice(1, right + 1)
    }
  }
  return maxLen
}
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
      // 注意，这里是滑动窗口，右侧遇到包含的字符时，左侧开始移动，一直移动到 right 又可以移动的情况
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
- 如果包含，肯定是左侧先包含，同时要删除最左侧的，因为右侧还要继续往下走，left++
- 利用双指针法，可以截取一个区域

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
      // 注意，这里是滑动窗口，右侧遇到包含的字符时，左侧开始移动，一直移动到 right 又可以移动的情况
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
    // 每次取一个，不需要加while循环，while循环就一下子执行到底了
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

- 类似消消乐，凡是相邻挨着的字符串，全部干掉
- 可以用一个堆栈来承载处理完的字符串

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

console.log(removeAdjacentDuplicates('abbbbad')) // 输出 "d"
console.log(removeAdjacentDuplicates('abbbad')) // 输出  "adad"
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

/\(\)/g

// 测试
console.log(isValid('[](){}')) // true
console.log(isValid('[({})]')) // true
console.log(isValid('[({)}]')) // false字符串的replace方法是用于将字符串中的某个子串替换为另一个子串。当入参是正则表达式时，可以使用正则表达式来匹配要替换的子串。
```

## 二叉树

- 完全二叉树：除了最后一层节点不满外，其它层节点都是满的，且最后一层的节点都集中在左边。
- 满二叉树：每个节点都有 0 个或 2 个子节点。
- 二叉查找树：左子树上所有节点的值均小于根节点的值，右子树上所有节点的值均大于根节点的值。
- 平衡二叉树：左子树和右子树的高度差不超过 1。
- 红黑树：一种自平衡二叉查找树，具有如下特点：节点是红色或黑色；根节点与叶子节点都是黑色；如果一个节点是红色，那么它的子节点都是黑色；从任意节点到其每个叶子节点的路径都包含相同数目的黑色节点。
- B 树：一种多路搜索树，具有如下特点：每个节点最多有 m 个子节点；除根节点和叶子节点外，其他节点至少有[m/2]个子节点；所有叶子节点都在同一层。
- 线索二叉树：在二叉树中，将节点的空指针指向该节点在中序遍历中的前驱或后继节点，称为线索二叉树。

总之，不同的二叉树形态有着不同的特点，适用于不同的场景和问题。

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
    // 每次插入节点，都需要实例化一个节点
    const node = new Node(value)

    // 如果没有根节点，则直接赋值root
    if (!this.root) {
      this.root = node
    } else {
      // 否则，需要遍历二叉树
      let current = this.root

      while (current) {
        // 小值在左侧
        if (value < current.value) {
          // 到达左边界，则找到插入的位置了
          if (!current.left) {
            current.left = node
            break
          }
          // 否则一直找最左侧
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

### 二叉树遍历方法

1. 前序遍历：先访问根节点，再遍历左子树，最后遍历右子树 -> 根左右
2. 中序遍历：先遍历左子树，再访问根节点，最后遍历右子树 -> 左根右
3. 后序遍历：先遍历左子树，再遍历右子树，最后访问根节点 -> 左右根
4. 层序遍历：从根节点开始，按照从上到下、从左到右的顺序逐层遍历整棵树。

```js
// 1、先序遍历
const recursionPreOrderTraversal = (root) => {
  if (!root) {
    return
  }
  // 💥 🔥 先序，肯定第一个输出的是根，因此先打印
  arr1.push(root.value)
  // 递归遍历所有左树
  recursionPreOrderTraversal(root.left)
  // 递归遍历所有右树
  recursionPreOrderTraversal(root.right)
}

// 中序递归：遍历所有左树 -> 根 ->  遍历所有右树
// 预期：
const recursionInOrderTraversal = (root) => {
  if (!root) {
    return
  }
  // 递归遍历所有左树，将左侧树都遍历完
  recursionInOrderTraversal(root.left)
  arr2.push(root.value)
  // 递归遍历所有右树
  recursionInOrderTraversal(root.right)
}

// 后序递归：遍历所有左树 -> 遍历所有右树 -> 根
const recursionPostOrderTraversal = (root) => {
  if (!root) {
    return
  }
  // 递归遍历所有左树
  recursionPostOrderTraversal(root.left)
  // 递归遍历所有右树
  recursionPostOrderTraversal(root.right)
  arr3.push(root.value)
}
```

```js
// 迭代方法
// 使用迭代的话，就需要用到循环，而循环就需要模拟一个数组堆栈，那什么可以呢？
// 递归是不断求自己，而迭代则需要模拟遍历堆栈
// 答案是：将待处理的节点，存放到堆栈里，利用数组的自身改变性，循环处理
const iterationPreOrderTraversal = (root) => {
  // 如果没有节点，则返回空
  if (!root) return []

  const results = []
  const stack = [root] // 将节点放入堆栈，先序遍历，先处理根节点

  while (stack.length) {
    // 若堆栈里有节点，则一直处理
    const node = stack.pop() // 取出节点
    results.push(node.value) // 先序遍历，则需要立马就存放值
    node.right && stack.push(node.right) // 前面使用pop，从后面取值，所以最后压入的先处理，而先序需要先处理左侧树
    node.left && stack.push(node.left)
  }
  return results
  // 💥 🔥 先序，肯定第一个输出的是根，因此先打印
}
console.log('迭代先序结果：', iterationPreOrderTraversal(root)) // [1,2,4,5,3]

// 因此关键的关键，就是如何构建这个堆栈，💥 🔥 想象一下遍历的最终结果，然后想法按这个顺序把他们从二叉树上拿出来，并放到堆栈里💥 🔥
// 数据结构如下
//          1
//         / \
//        2   3
//       / \
//      4   5
const iterationInOrderTraversal = (root) => {
  if (!root) return []

  const stacks = [] // 左根右 -> 放到堆栈里，就应该是 🔥右根左🔥，因为每次是pop从堆栈取，因此需要先将所有左树全放进去
  const results = []
  let current = root

  while (current || stacks.length) {
    // 当从最底部走上来，此时current为左下角节点的右子树，很明显没有，然后跳过while开始处理 节点 2
    while (current) {
      // 参考数据结构图，当第一次 root的1进来，直接放进去了。。。其实 1 也可以看做是左子节点，想象下2、3 又何尝不是 1 ？
      // 第一次，所以可以直接压入
      stacks.push(current)
      // 然后后续压入的都是左侧节点
      current = current.left
    }

    // 当无法再添加左节点时，从栈中弹出一个节点，并将其赋值给current，表示开始处理右子节点。
    current = stacks.pop()
    // 第一次时，此时 current 已经在最左下方了，没有子树了，也就是 左根右，没有左了，拿出根的value，然后继续处理右子节点，因为不知道有没有右子节点
    results.push(current.value) // 🔥 节点里的值，是根据 TreeNode 类确定的，value、val、、什么都行

    // 上面的current，其实就可以理解为根，然后处理右子节点，因为堆栈里没有右子节点的信息，所以需要通过代码走逻辑
    // 将current指向当前节点的右子节点，下一轮循环将在右子树中继续进行左侧节点的遍历。
    current = current.right
  }
  return results
}
console.log('迭代中序结果：', iterationInOrderTraversal(root)) // 结果：[4, 2, 5, 1, 3]

// 该算法的原理是：利用栈实现二叉树的深度优先遍历，通过lastVisitedNode记录上一个访问的节点，判断当前节点是否可以被访问，从而实现后序遍历。
// 具体来说，当一个节点的左右子节点都被访问过时，该节点才能被访问。
// 因此，我们需要在遍历过程中记录上一个访问的节点，以便判断当前节点的右子节点是否已经被访问过。
// 如果右子节点已经被访问过，说明该节点可以被访问了。

const iterationPostOrderTraversal = (root) => {
  const results = []
  const stacks = []
  let lastVisited = null
  let current = root

  while (current || stacks.length) {
    while (current) {
      stacks.push(current)
      current = current.left
    }

    // 🔥 注意，这里引用堆栈里最后的一个值，第一次时，就是左下角的值
    current = stacks[stacks.length - 1]
    // 需要判断这个节点，是否有右节点(有的话，需要继续入栈)，或者被访问过
    //          1
    //         / \
    //        2   3
    //       / \
    //          5
    if (!current.right || current.right === lastVisited) {
      // 当没有左右节点，或者被访问过了，才可以将value放入到结果里
      results.push(current.value)
      // 计入处理完了当前节点，比如5，则可以丢弃5了
      stacks.pop() // 不需要接收了
      // 📌标记下，比如5已经访问过了
      lastVisited = current
      // current 重置，开始下一次stacks.length循环
      current = null
    } else {
      // 参考上面的数据结构，当current为2时，需要将right再入栈，只有左右都入栈了，才可以输出 2 的value
      current = current.right
    }
  }

  return results
}
console.log('迭代后序结果：', iterationPostOrderTraversal(root)) // 结果：[4, 5, 2, 3, 1]
```

### 二叉树最小深度

```js
class TreeNode {
  // 二叉树，有三个值
  constructor(val, left, right) {
    this.val = val
    this.left = left
    this.right = right
  }
}
```

#### 递归方法

```js
function minDepth(root) {
  // 两个临界值：没有节点或者没有子节点
  if (!root) {
    return 0
  }
  if (!root.left && !root.right) {
    return 1
  }

  // 递归获取左侧或右侧子树的高度
  let min = Number.MAX_SAFE_INTEGER
  if (root.left) {
    min = Math.min(minDepth(root.left), min)
  }
  if (root.right) {
    min = Math.min(minDepth(root.right), min)
  }
  return min + 1
}
```

#### BFS 广度优先

我们可以使用广度优先搜索算法（BFS）来解决这个问题。BFS 从根节点开始搜索，一层一层地遍历树，直到找到**最短路径**。

举个例子，假设有如下二叉树：

```
      1
     / \
    2   3
   / \   \
  4   5   6
```

按照 BFS 遍历的顺序，先访问根节点 1，再按照从左到右的顺序访问 2 和 3 节点，然后访问 4、5 和 6 节点，最终得到遍历的结果为：1 -> 2 -> 3 -> 4 -> 5 -> 6。

我们可以通过队列来实现 BFS。首先将根节点入队，然后从队列中取出一个节点，将其左右子节点入队。如果当前节点没有左右子节点，则说明它是叶子节点，返回它的深度即可。

```js
function minDepth(root) {
  // 如果根节点为空，深度为0
  if (!root) return 0

  // 队列中存储节点和它的深度，
  // 首先压入的是头部节点，然后是左侧和右侧节点，这个遍历方式前序遍历
  const queue = [{ node: root, depth: 1 }]

  while (queue.length) {
    // 取出队列中的第一个节点
    const { node, depth } = queue.shift()

    if (!node.left && !node.right) {
      // 如果当前节点是叶子节点，返回它的深度
      return depth
    }

    if (node.left) {
      // 如果当前节点有左子节点，将其入队
      queue.push({ node: node.left, depth: depth + 1 })
    }

    if (node.right) {
      // 如果当前节点有右子节点，将其入队
      queue.push({ node: node.right, depth: depth + 1 })
    }
  }
}

const tree = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(2.5), new TreeNode(4)),
  new TreeNode(3, null, new TreeNode(5))
)
console.log(minDepth(tree)) // 输出: 2

// 二叉树的结构如下：
//   1
//  / \
// 2   3
//  \   \
//   4   5
```

#### 深度优先遍历

- 深度优先遍历是一条路走到底，再返回来走其他路，
- 而广度优先遍历是一层一层遍历，先遍历与起点相邻的节点，再遍历它们的相邻节点。
- 在 DFS 算法中，使用栈来存储待处理的节点，在 BFS 算法中，使用队列来存储待处理的节点

```js
function minDepth(root) {
  if (!root) {
    return 0
  }
  let min = Infinity
  const stack = [[root, 1]]

  while (stack.length) {
    // 使用了栈来存储节点，每次弹出栈顶元素进行处理
    // 栈顶元素，是最后压入的。。。对比广度优先，则处理栈底，也就是 stack.shift()
    // 仔细想想，深度优先时，stack.pop()都是获取的最后的叶子节点，
    // 而广度优先，则使用队列，先排队则先用，对比这里就是每次需要遍历一层才可以。而深度则需要遍历
    const [node, depth] = stack.pop()
    if (!node.left && !node.right) {
      min = Math.min(min, depth)
    }
    if (node.left) {
      stack.push([node.left, depth + 1])
    }
    if (node.right) {
      stack.push([node.right, depth + 1])
    }
  }
  return min
}
```

### 打开转盘锁

你有一个带有四个圆形拨轮的转盘锁。每个拨轮都有 10 个数字： '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' 。每个拨轮可以自由旋转：例如把 '9' 变为  '0'，'0' 变为 '9' 。每次旋转都只能旋转一个拨轮的一位数字。

锁的初始数字为 '0000' ，一个代表四个拨轮的数字的字符串。

列表 deadends 包含了一组死亡数字，一旦拨轮的数字和列表里的任何一个元素相同，这个锁将会被永久锁定，无法再被旋转。

字符串 target 代表可以解锁的数字，你需要给出解锁需要的最小旋转次数，如果无论如何不能解锁，返回 -1 。

- 其实就是每次拨动一个转盘，所有转盘上的数字不能与 deadends 里的相同

```
输入：deadends = ["0201","0101","0102","1212","2002"], target = "0202"
输出：6
解释：
可能的移动序列为 "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"。
注意 "0000" -> "0001" -> "0002" -> "0102" -> "0202" 这样的序列是不能解锁的，
因为当拨动到 "0102" 时这个锁就会被锁定。
```

```js
function openLock(deadends, target) {
  // 将死锁状态存入一个 Set 中，
  const deadSet = new Set(deadends)

  // 将初始状态 "0000" 存入队列中，并将其标记为已访问
  const visited = new Set()
  const queue = ['0000']
  visited.add('0000')
  let step = 0

  while (queue.length) {
    const len = queue.length
    for (let i = 0; i < len; i++) {
      const curr = queue.shift()
      // 判断是否为死亡状态
      if (deadSet.has(curr)) {
        continue
      }
      if (curr === target) {
        return step
      }
      // 如果没有碰到死亡状态，则对每个转盘上的数字进行计算
      for (let j = 0; j < 4; j++) {
        const up = plusOne(curr, j)
        if (!visited.has(up)) {
          queue.push(up)
          visited.add(up)
        }
        const down = minusOne(curr, j)
        if (!visited.has(down)) {
          queue.push(down)
          visited.add(down)
        }
      }
    }
    step++
  }
  return -1
}

// 加一
function plusOne(str, index) {
  const arr = str.split('')
  if (arr[index] === '9') {
    arr[index] = '0'
  } else {
    arr[index] = String(Number(arr[index]) + 1)
  }
  return arr.join('')
}

function minusOne(str, index) {
  const arr = str.split('')
  if (arr[index] === '0') {
    arr[index] = '9'
  } else {
    arr[index] = String(Number(arr[index]) - 1)
  }
  return arr.join('')
}
```

这个算法是用来解决开锁问题的。给定一个初始锁的状态 "0000" 和一个目标状态 target，以及一些不能被旋转的死锁状态，求从初始状态到达目标状态的最小步数。

算法的实现是基于 BFS（广度优先搜索）的。

1. 首先将死锁状态存入一个 Set 中，将初始状态 "0000" 存入队列中，并将其标记为已访问。
2. 然后进入一个 while 循环，每次从队列中取出一个状态进行处理。
3. 如果当前状态是死锁状态，则跳过。
4. 如果当前状态是目标状态，则返回当前步数。
5. 否则，对当前状态的每个数字进行加一或减一的操作，生成新的状态，并将其加入队列中。
6. 如果新状态没有被访问过，则将其标记为已访问。

其中，plusOne 和 minusOne 函数用来对状态进行加一和减一的操作。如果当前数字是 9 或 0，则需要进行特殊处理。

### 相同的树

- 深度优先遍历是一种递归算法，可以更容易地实现。
- 其次，深度优先遍历是一种自上而下的遍历方式，可以更快地发现两棵树不相同的情况，从而提前结束遍历。
- 而广度优先遍历是一种自下而上的遍历方式，需要遍历完整棵树才能得出结论，效率较低。

因此，在检验两棵树是否相同的问题中，深度优先遍历更为适合。

```js
var isSameTree = function (p, q) {
  // 深度优先：是自上而下遍历，处理两棵树是否相同时，效率高
  // 而广度优先，则是从下而上，需要遍历整个树才行，这里效率低，但广度优先适合用在最短路径上
  // 先处理边界条件
  if (!p && !q) return true // 都为空，相同
  if (!p || !q) return false // 一个为空，不相同
  if (p.val !== q.val) return false // 值不相同

  // 注意，这里栈的元素结构是 [p, q]，因为要同时处理这两个
  const stacks = [[p, q]]
  while (stacks.length) {
    // 深度优先，则先pop最后的一个
    const [node1, node2] = stacks.pop()
    // 类似上面的判断
    if (!node1 && !node2) continue // 都为空，继续遍历
    if (!node1 || !node2) return false // 一个为空，不相同
    if (node1.val !== node2.val) return false // 值不相同，不相同

    // 继续压入其他的节点
    stacks.push([node1.left, node2.left]) // 左子树入栈
    stacks.push([node1.right, node2.right]) // 右子树入栈
  }
  // 最后 会执行到 !node1 && !node2 这里，因此最后需要返回true
  return true
}
```

#### 递归方法

```js
var isSameTree = function (p, q) {
  // 1、两个节点都没有，肯定相同
  // 2、两个节点，一个有，一个没有，不相同
  // 3、两个节点，值不同，也不同
  // 4、递归
  if (!p && !q) {
    return true
  } else if (!p || !q) {
    return false
  } else if (p.val !== q.val) {
    return false
  } else {
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
  }
}
```

对于深度优先算法，可以采用递归和迭代实现

- 递归
- 迭代

### 岛屿的最大面积

给你一个大小为 m x n 的二进制矩阵 grid 。

岛屿   是由一些相邻的  1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设  grid 的四个边缘都被 0（代表水）包围着。

岛屿的面积是岛上值为 1 的单元格的数目。

计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。

- 其实就是方格纸上，每个格子要么 1，要么 0
- 1 就是岛屿，0 就是海水，相当于统计方格纸上，连着的 1 最多有多少，需要上下左右挨着的。

- 这个算法选用深度优先是因为要遍历整个岛屿，深度优先搜索可以很自然地模拟这个过程。
- 首先找到一个陆地点，然后从这个点开始，尽可能向四周扩展，**直到无法继续扩展，然后回溯到上一个点，继续向另一个方向扩展**。这个过程可以用递归来实现，就是深度优先搜索。
- 同时，深度优先搜索还可以很方便地记录岛屿的面积，因为在搜索过程中，每次访问到一个陆地点，就可以将面积加 1。

```js
function maxAreaOfIsland(grid) {
  let maxArea = 0
  // 先拿到方格纸的长和宽，其实就是二维数组
  const m = grid.length // 这个就是宽度
  const n = grid[0].length // 这个就是深度

  //  首先找到一个陆地点，然后从这个点开始，尽可能向四周扩展，**直到无法继续扩展，然后回溯到上一个点，继续向另一个方向扩展**。这个过程可以用递归来实现，就是深度优先搜索。
  const dfs = (i, j) => {
    // 将边界条件直接返回0
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) {
      return 0
    }
    // i,j表示当前搜索的位置，这里设置为0，表示搜索过
    // 这里相当于把原来gird的1都为了0，因为已经统计过了
    grid[i][j] = 0
    let area = 1 // 同时当前位置的面积就是1
    // 然后开始搜索这个上下左右四个方向
    area += dfs(i - 1, j) // 左
    area += dfs(i + 1, j) // 右
    area += dfs(i, j - 1) // 上
    area += dfs(i, j + 1) // 下
    // 最后返回area
    return area
  }

  // 主函数，从棋盘的左上角开始遍历
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 如果单个方格是1，则是岛屿，需要继续查找，看是否还有其他挨着的岛屿
      if (grid[i][j] === 1) {
        maxArea = Math.max(maxArea, dfs(i, j))
      }
    }
  }
  return maxArea
}
```

这段代码是用来求解给定二维数组中最大岛屿面积的函数。岛屿是由相邻的 1 组成的区域，相邻指上下左右相邻。函数中的核心是深度优先搜索（DFS）算法。

1. 首先定义一个变量 maxArea 来记录最大岛屿面积，然后获取二维数组的行数 m 和列数 n。
2. 接着定义一个名为 dfs 的递归函数，用来搜索岛屿面积。
   1. 该函数传入两个参数 i 和 j，表示当前搜索的位置，如果越界或者当前位置为 0，则返回 0，
   2. 否则将当前位置标记为 0，表示已经搜索过，
   3. 然后定义一个变量 area 来记录当前岛屿的面积，初始值为 1，因为当前位置已经是 1 了。
   4. 然后向上下左右四个方向递归搜索，并将搜索到的岛屿面积加到 area 中，最后返回 area。
3. 接下来，通过两个循环遍历整个二维数组，如果当前位置为 1，则调用 dfs 函数来搜索该岛屿的面积，并将结果与 maxArea 取最大值，最后返回 maxArea 即可。

总之，这段代码的思路就是通过 DFS 算法来搜索岛屿面积，然后遍历整个二维数组，找到最大的岛屿面积。

```js
function maxAreaOfIsland(grid) {
  let maxArea = 0
  // 需要棋盘的宽高
  let m = grid.length
  let n = grid[0].length

  // 主函数，双层循环遍历整个棋盘
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 如果当前格子为1，则需要递归处理
      if (grid[i][j]) {
        maxArea = Math.max(maxArea, dfs(i, j))
      }
    }
  }
  return maxArea

  // 定义辅助函数，主要逻辑就是递归的向上下左右方向遍历
  // 既然是递归，那肯定就需要边界条件
  function dfs(i, j) {
    if (i < 0 || i >= m || j < 0 || j >= n || !grid[i][j]) {
      // 这些条件下，面积都为0
      return 0
    }

    // 重置当前格子，相当于已经遍历过了，后续就不用再遍历了
    grid[i][j] = 0
    let area = 1 // 虽然 grid[i][j] 改为0了，但这里记录了
    // 开始向四个方向，遍历
    area += dfs(i, j - 1) // 上
    area += dfs(i, j + 1) // 下
    area += dfs(i - 1, j) // 左
    area += dfs(i + 1, j) // 右
    return area
  }
}
```

### 二叉树的最近公共祖先

1. 判断二叉树根节点是否为 null，或者是否等于 p 节点或 q 节点，如果是，直接返回根节点。
2. 分别递归左子树和右子树，查找 p 和 q 节点的位置。
3. 如果 p 和 q 节点分别在左右子树中找到了，那么当前节点即为最近公共祖先，返回当前节点。
4. 如果只在左子树中找到了 p 或 q 节点，那么返回左子树中找到的节点。
5. 如果只在右子树中找到了 p 或 q 节点，那么返回右子树中找到的节点。
6. 最终返回的节点即为 p 和 q 节点的最近公共祖先。

```js
function lowestCommonAncestor(root, p, q) {
  if (root === null || root === p || root === q) {
    return root
  }
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)

  if (left !== null && right !== null) {
    return root
  } else if (left !== null) {
    return left
  } else {
    return right
  }
}
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
  // slow.next = null

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

### 链表中第 K 个节点

```js
var kthToLast = function (head, k) {
  // 设置两个指针，一个指针先走k步，然后两个指针再一块走
  // 刚开始的那个指针走到头时，慢指针指向的就是倒数第k个指针

  let fast = head
  let slow = head
  let counter = 0
  while (counter < k) {
    fast = fast.next
    counter++
  }

  // 二者在同时走，循环的条件是 fast存在
  while (fast) {
    fast = fast.next
    slow = slow.next
  }

  // 返回节点的值，也就是val，看定义
  return slow.val
}
```

## Promise 相关

### promiseLimit

```js
// 给定一个请求列表，和最大并发数limit，写一个最大并发数为 limit 的逻辑，等到所有都结束了再返回
const promiseLimit = (ps, limit) => {
  // 异步操作，肯定涉及Promise
  return new Promise((resolve, reject) => {
    const res = []
    let idx = 0
    let pengdingCount = 0 // 正在请求的数量

    // 需要定义几个函数，从而实现嵌套调用
    const runTask = (task, idx) => {
      pengdingCount++ // 执行了几个
      task()
        .then((val) => {
          // 请求成功，则消除请求池
          pengdingCount-- // 请求成功，立马修改计数
          // 根据请求的序号，填充响应
          res[idx] = val
          // 其实walk就会第一次一下子，执行limit个，后续如果还想再激活，则需要再次调用
          walk()
        })
        .catch((err) => {
          // 如果失败，数量也会
          res[idx] = err
        })
        .finally(() => {
          // 不能放在这里，因为时序问题，会导致 !pengdingCount 先执行
          // pengdingCount--
        })
    }
    const walk = () => {
      // 开始执行，条件满足就执行：请求池有余量 且 有待请求的
      while (pengdingCount < limit && idx < ps.length) {
        runTask(ps[idx], idx) // 执行
        console.log('正在运行中', pengdingCount, '__111__', idx)
        idx++
      }
      // 如果正在请求的数量清空了，则resolve
      console.log('djch pengdingCount', pengdingCount)
      if (!pengdingCount) {
        resolve(res)
      }
    }

    walk() // 执行
  })
}

const promiseLimit = (ps, limit) => {
  return new Promise((resolve, reject) => {
    const res = [] // 存放结果
    let pendingCount = 0 // 正在请求的数量
    let idx = 0 // 当前请求索引

    const runTask = (task, idx) => {
      task()
        .then((val) => {
          pendingCount--
          res[idx] = val
          // 再次执行walk
          walk()
        })
        .catch((err) => {
          res[idx] = err
          // 或者 reject(err)
        })
    }
    const walk = () => {
      // 正在请求数 < limit && idx < ps.length
      while (pendingCount < limit && idx < ps.length) {
        runTask(ps[idx], idx)
        pendingCount++
        idx++
      }

      // 如果没有正在请求的，直接返回
      if (!pendingCount) {
        resolve(res)
      }
    }
    walk()
  })
}
```

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

const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve, reject) => reject(2)),
]
promise
  .all(tasks)
  .then((res) => console.log('res', res))
  .catch((err) => console.log(err))
```

### promiseAll

```js
const myPromiseAll = (ps) => {
  return new Promise((resolve, reject) => {
    const res = []
    let count = 0

    for (let i = 0; i < ps.length; i++) {
      ps[i]()
        .then((val) => {
          count++
          res[i] = val

          if (count === ps.length) {
            resolve(res)
          }
        })
        .catch((err) => reject(err))
    }
  })
}
```

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

## 回溯相关

```
result = []
def backtrack(路径, 选择列表):
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择
```

其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」，特别简单。

### 子集

给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。

```
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

输入：nums = [0]
输出：[[],[0]]
```

- 子集，要求顺序

```js
// 思想参考方案二或三
function subsets(nums) {
  let res = []
  // 调用回溯函数，传入起始索引和空的路径数组，开始生成子集。
  backtrack(0, [])
  return res

  // 参数一是遍历的起始位置
  // 参数二是所有之前遍历的结果
  function backtrack(start, path) {
    // 直接压入结果数组
    res.push([...path])

    // 从起始索引开始遍历数组的剩余部分。
    for (let i = start; i < nums.length; i++) {
      // 将当前遍历到的元素nums[i]加入路径数组path中，表示选择了这个元素。
      path.push(nums[i])
      // 递归调用回溯函数，传入更新后的起始索引i + 1和当前的路径数组path，继续生成子集。
      backtrack(i + 1, path)
      // 在递归回溯之后，将刚才选择的元素从路径数组中删除，进行回溯操作，尝试选择其他的元素。
      path.pop()
    }
  }
}
```

#### 方式二

1. 原序列的每个位置在答案序列中的状态有被选中和不被选中两种，用 t 存放，n 是数组长度
2. 在进入 dfs(cur, n)之前[0, cur-1]的位置的状态是确定的，而[cur, n-1]内位置的状态是不确定的
3. dfs(cur, n) 需要确定 cur 位置的状态，然后求解子问题 dfs(cur+1, n)
4. 对于 cur 位置，我们需要考虑 a[cur] 取或者不取，如果取，我们需要把 a[cur] 放到一个临时目录里，再执行 dfs(cur+1, n)，执行结束后对 t 进行回溯
5. 如果不取，则直接执行 dfs(cur+1, n)
6. 在整个递归调用的过程中，cur 是从小到大递增的，当 cur 增加到 n 的时候，记录答案并终止。
7. 时间复杂度为：O^2

```js
var subsets = function (nums) {
  const t = []
  const ans = []

  const dfs = (cur) => {
    // 这个cur除了 cur + 1 改变外，每次递归都保留之前的堆栈现场，从而达到变化
    if (cur === nums.length) {
      ans.push(t.slice())
      return
    }
    // 如果使用nums[cur]，则放在临时目录里
    // 同时再求解子问题，dfs(cur + 1)
    // 等所有子问题解决完后，回溯
    t.push(nums[cur])
    dfs(cur + 1)
    t.pop()

    // 如果不使用 nums[cur] ，则直接求解子问题
    dfs(cur + 1)
  }
  dfs(0)
  return ans
}
subsets([1, 2, 3])
```

#### 方式二：迭代法实现子集枚举

1. 记原序列中元素的总数为 n，原序列中的每个数字 ai 的状态可能有两种，即「在子集中」和「不在子集中」。
2. 我们用 1 表示「在子集中」，0 表示不在子集中，那么每一个子集可以对应一个长度为 n 的 1/0 序列
3. 第 i 位表示 ai 是否在子集中，例如：n = 3，a = [5,2,9]，如下示例发现 1/0 序列对应的二进制数正好从 0 到 2^n - 1

```
000 -> []        -> 0
001 -> [9]       -> 1
010 -> [2]       -> 2
011 -> [2, 9]    -> 3
100 -> [5]       -> 4
101 -> [5, 9]    -> 5
110 -> [5, 2]    -> 6
111 -> [5, 2, 9] -> 7
```

如果写个逻辑，将 二进制各种可能与集合按位与计算

```js
function subsets(nums) {
  const ans = []
  const n = nums.length

  // 1 << n，表示 1 向左移动 n 位，空出的位置补0，也就是 1左移3位，就是8
  // mask就是上面示例的二进制数的十进制表示
  for (let mask = 0; mask < 1 << n; ++mask) {
    const t = []

    // 遍历每个位置的数字
    for (let i = 0; i < n; i++) {
      // 根据上面的序列示例知道，针对每一个mask，只需映射到数组里对应的索引即可
      // 如何做呢，只需将对应索引左移 i 位，也变成对应的 二进制，且当前位置为ture
      // 在与mask按位与操作，如果为true，就存放当前的值
      if (mask & (1 << i)) {
        t.push(nums[i])
      }
    }
    ans.push(t)
  }
  return ans
}
```

### 括号生成

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]

输入：n = 1
输出：["()"]
```

- 想象下，你如何构造这些有效字符串，肯定先写一个左括号，然后判断
- 暴力递归：生成所有可能的字符串，然后判断是否有效，缺点是很多冗余且无效的计算
- 回溯法如下：只有在满足条件下，才会拼接，更加高效

```js
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  // backtrack函数来生成所有可能的组合。初始时，当前字符串为空字符串，开括号数和闭括号数均为0，最大括号对数为n。
  // 当当前字符串的长度，是最大括号对数的两倍时，可能的组合产生

  // 回溯架构：先写结果、调用回溯、返回
  const res = []
  // 参数2是当前字符串，参数3左括号的数量
  // 参数4是右括号的数量，参数5是括号的最大对数
  backtrack(res, '', 0, 0, n)
  return res

  function backtrack(res, cur, open, close, max) {
    // 当当前字符串的长度 是 max 的两倍时
    if (cur.length === max * 2) {
      res.push(cur)
      // 并返回，说明这一轮的递归结束了
      return
    }
    // 如果左右括号的数量，不够，需要往里面添加对应的符号
    if (open < max) {
      backtrack(res, cur + '(', open + 1, close, max)
    }
    // 📢 注意，这里是close < open，不是 < max
    // 因为括号是成对出现的，先构造左侧括号，再构造右侧括号。
    // if (close < max) {
    if (close < open) {
      backtrack(res, cur + ')', open, close + 1, max)
    }
  }
}

generateParenthesis(3) // ['((()))', '(()())', '(())()', '()(())', '()()()']

// res: '((()))' cur：((()) -> ((() -> ((( -> (()
```

```js
function test() {
  function testDiGui(i) {
    if (i === 3) return
    testDiGui(i + 1)
    console.log('djch', i)
  }
  testDiGui(0)
}
test()
// 调用堆栈情况，也就是说当i 小于 3时，log一直不会执行
// 等到 i === 3 时，递归递推过程结束，开始回推，也就是执行log，然后因为i被函数作为闭包变量，一直封存
// 等到回推过程，继续执行下面的逻辑，同时i的值也变成以前的了
// djch 2
// djch 1
// djch 0
```

### 复原 IP 地址

有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

例如：`"0.1.2.201" 和 "192.168.1.1"` 是 有效 IP 地址，但是 `"0.011.255.245"、"192.168.1.312" 和 "192.168@1.1"` 是 无效 IP 地址。

给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入  '.' 来形成。你 不能   重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。

```
输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]

输入：s = "0000"
输出：["0.0.0.0"]

输入：s = "101023"
输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
```

- 不管三七二十一，先写框架

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const res = []
  // 这个回溯公式是啥呢。。。？记住回溯就是穷举，而且挨个穷举，但有个好处就是，不是无脑穷举，而是有效才继续存储
  // 从字符串的第一个位置，开始截取，使用dfs，不断地向下截取
  // 参数1是截取的开始位置，参数2是最终的结果
  backtrack(0, [])
  return res

  function backtrack(start, path) {
    // 判断返回条件，（可以先遍历，后续再写这个边界，不然上来容易懵逼）
    // 如果path的长度正好是4段，因为ip地址就是4段，且start的位置在末尾，说明遍历完所有的了，同时有效
    if (path.length === 4 && start === s.length) {
      res.push(path.join('.'))
      return
    }
    // 如果走完了全程或者找到了4段，但是没有同时满足，则无效
    if (path.length === 4 || start === s.length) {
      return
    }

    // 每次最多截取3个字符
    for (let len = 1; len <= 3; len++) {
      // start记录遍历的位置
      if (start + len > s.length) {
        // 如果长度，比总的字符串还长，直接结束
        break
      }

      const str = s.substring(start, start + len)
      if ((str.length > 1 && str.startsWith('0')) || (len === 3 && +str > 255)) {
        // 这是前面和后面的边界值，触发后需要下一轮循环。不用再继续往path里添加了
        continue
      }

      // path里不同位数的字符串
      path.push(str)
      // 下一个位置，就是 start + len
      backtrack(start + len, path)
      path.pop()
    }
  }
}
restoreIpAddresses('25525511135') // ['255.255.11.135', '255.255.111.35']
// [2, 5, 5, 2]   不满足
// [2, 5, 5, 25]  不满足
// [2, 5, 5, 255] 不满足 就这样一直不停向下回溯
```

### n 皇后

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

n  皇后问题 研究的是如何将 n  个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 n ，返回所有不同的  n  皇后问题 的解决方案。

每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

```js
var solveNQueens = function (n) {
  // 要求：1、不能在同一行或同一列；2、不能在对角线上
  // 1、定义一个数组，下标为行号，值为皇后所在的列号，如果值不重复，也就是没有皇后在同一列，即满足要求1
  // 2、数组值相减、下标相减，如果绝对值不相等，则满足要求2

  // 定义结果数组
  let res = []

  // 定义回溯函数
  // 参数1是当前已经存放皇后的数组arr，curRow是当前行号
  function backTrack(arr, curRow) {
    let len = arr.length

    // 如果当前行号curRow === len，说明回溯完成，也就是皇后的数量与行数相同
    // 只需将数组里的数据，转化为结果格式的数组即可
    if (len === curRow) {
      res.push(
        arr.map((v) => {
          return `${'.'.repeat(v)}Q${'.'.repeat(n - v - 1)}`
        })
      )
    }

    // 如果没有回溯完成，则需要遍历当前行的每一列存放皇后
    for (let i = 0; i < len; i++) {
      // 假设arr[i] = i 可以存放皇后
      arr[curRow] = i
      let flag = true

      // 既然假设的位置已经存放皇后，则后续来的皇后需要与之对比
      // 只需对比前curRow行
      for (let j = 0; j < curRow; j++) {
        // 如果循环结束，falg变为false了，说明该行不能再放皇后了
        // i表示某一行待插入皇后的列，arr[j]表示已经存在的皇后列，
        // abs === 0 其实就相当于，多个皇后在同一列了。
        // (abs > 0 ? abs : -abs) === curRow - j 就相当于，相邻的皇后在同一个对角线上了。
        // curRow就是待插入的行，j就是已经插入的皇后的行
        let abs = i - arr[j]
        if (abs === 0 || (abs > 0 ? abs : -abs) === curRow - j) {
          flag = false
          // 整行都不行，直接退出循环
          break
        }
      }

      // 循环结束后，flag没变，说明 arr[i] = i假设成立，则开始遍历下一层
      if (flag) {
        console.log('arr', arr)
        backTrack(arr.slice(), curRow + 1)
      }
    }
  }
  // 从第0行开始执行回溯，参数一是每一行的情况
  backTrack(Array(n), 0)

  // 返回结果
  return res
}
```

这段代码实现了求解 n 皇后问题的功能。n 皇后问题是指在 n×n 的棋盘上，放置 n 个皇后，使得皇后彼此之间不能相互攻击（即不能在同一行、同一列或同一斜线上）。该函数使用回溯算法实现。具体实现如下：

1. 定义一个结果数组 res，用于存放满足条件的解；
2. 定义一个回溯函数 backTrack，该函数接收两个参数，一个是当前已经存放皇后的数组 arr，另一个是当前行号 curRow；
3. 如果 curRow 等于数组长度 n，说明回溯完成，将 arr 转化为结果格式的数组，存入 res 中；
4. 遍历当前行的每一列，假设该位置可以存放皇后，将该位置的列号存入 arr[curRow]中；
5. 对于已经存放皇后的每一行，判断该位置是否满足条件，即不能在同一列，也不能在同一斜线上；
6. 如果所有已经存放皇后的行都满足条件，则开始遍历下一层，即调用 backTrack 函数，传入一个新的 arr 数组和 curRow+1；
7. 如果该位置不满足条件，则直接进入下一次循环，遍历下一个位置；
8. 回溯结束后，返回结果数组 res。

该函数使用了 slice()方法来复制数组，避免对原数组的修改。同时，使用了字符串的 repeat()方法来生成结果格式的字符串。

```js
function solveNQueens(n) {
  const result = []
  const board = Array.from({ length: n }, () => Array(n).fill('.'))

  function backtrack(row) {
    if (row === n) {
      result.push(board.map((row) => row.join('')))
      return
    }

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q'
        backtrack(row + 1)
        board[row][col] = '.'
      }
    }
  }

  function isValid(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') {
        return false
      }
      const leftDiagonal = col - (row - i)
      if (leftDiagonal >= 0 && board[i][leftDiagonal] === 'Q') {
        return false
      }
      const rightDiagonal = col + (row - i)
      if (rightDiagonal < n && board[i][rightDiagonal] === 'Q') {
        return false
      }
    }
    return true
  }

  backtrack(0)
  return result
}
```

该算法使用回溯的思想，在棋盘上逐行放置皇后，并检查当前位置是否合法。如果当前行放置皇后后导致无法放置下一行的皇后，就回溯到上一行重新尝试其他位置。当所有行都放置好了皇后，就将当前的棋盘状态加入结果集中。时间复杂度为 O(n^n)。

## 深度优先

深度优先遍历（Depth-First Traversal）是一种用于遍历或搜索树或图的算法。在深度优先遍历中，从起始节点开始，沿着一条路径尽可能深入，直到无法继续为止，然后回溯到前一个节点，继续探索其他路径，直到遍历完所有节点。

在 JavaScript 中，**深度优先遍历可以通过递归或使用栈来实现**。

### 递归实现深度优先遍历：

在递归实现中，我们从根节点开始，先访问当前节点，然后递归地遍历它的所有子节点。

```javascript
function depthFirstTraversal(node) {
  console.log(node) // 访问当前节点

  if (node.children) {
    for (let child of node.children) {
      depthFirstTraversal(child) // 递归遍历子节点
    }
  }
}
```

### 栈实现深度优先遍历：

使用栈来实现深度优先遍历可以避免使用递归的方式，它模拟了递归调用的行为。具体实现是，将根节点入栈，然后进入循环，弹出栈顶节点并访问它，将其子节点按照逆序（或者按照特定顺序）入栈，重复此过程直到栈为空。

```javascript
function depthFirstTraversal(root) {
  const stack = [root]

  while (stack.length > 0) {
    const node = stack.pop()
    console.log(node) // 访问当前节点

    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]) // 子节点入栈
      }
    }
  }
}
```

深度优先遍历在许多场景中非常有用，如寻找路径、拓扑排序、解决迷宫问题等。通过深度优先遍历，我们可以探索整个图或树的结构，从而实现各种问题的求解和分析。

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
