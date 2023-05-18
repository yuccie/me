---
title: '正则表达式'
date: Sun May 14 2023 22:39:49 GMT+0800 (中国标准时间)
lastmod: '2023-05-14'
tags: ['正则表达式']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/regex
---

##

### 先行断言

正则表达式中的先行断言指的是在**匹配到某个模式之前，需要先匹配到另一个模式**。先行断言的语法为“(?=pattern)”，其中“pattern”表示需要先匹配的模式

举个例子，假设我们需要匹配一个字符串中所有以“http”开头的 URL，但是不包括“http”本身。这时候我们可以使用先行断言来实现：

`(?<=http://)[^\s]+` 这个正则表达式中，`(?<=http://)`表示先行断言，表示需要匹配到“http://”之后才能继续匹配后面的模式。然后“[^\s]+”表示匹配一个或多个非空格字符，也就是 URL 的主体部分。

- `(?<=http://)` 是一个“正向后行断言”，表示要匹配的内容必须在以 http:// 开头的字符串后面
- `(?=http://)` 是一个“正向先行断言”，表示要匹配的内容必须在以 http:// 开头的字符串前面，但不包括 http:// 这个字符串本身

另外一个例子，假设我们需要匹配一个字符串中所有以数字开头的单词，这时候我们可以使用先行断言来实现：`\b(?=\d)[a-zA-Z]+\b`, “\b”表示单词边界，也就是匹配单词的开头或结尾，“(?=\d)”表示先行断言，表示需要匹配到数字之后才能继续匹配后面的模式，“[a-zA-Z]+”表示匹配一个或多个字母，也就是单词的主体部分。

## 格式化人民币

```js
// 方式一：
function formatMoney(money) {
  // 将金额转为字符串
  money = money.toString()

  // 拆分整数部分和小数部分
  let parts = money.split('.')
  let integerPart = parts[0]
  let decimalPart = (parts[1] || '').padEnd(2, '0') // 补足后面两位

  // 整数部分每三位加一个逗号
  let formattedIntegerPart = ''
  for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    // j 变量用来统计什么时候添加 ,
    if (j % 3 === 0 && j !== 0) {
      formattedIntegerPart = ',' + formattedIntegerPart
    }
    // '6' + '7'，integerPart[i]放在前面
    formattedIntegerPart = integerPart[i] + formattedIntegerPart
  }

  // 返回格式化后的金额
  return '￥' + formattedIntegerPart + '.' + decimalPart
}

// 示例
console.log(formatMoney(1234567.89)) // ￥1,234,567.89

// 方式二：
function formatNumber(val) {
  var num = val + ''
  var str = ''
  var ret = num.split('.')

  if (ret[0] !== undefined) {
    // \B表示后面的内容，不是处在开始位置
    // (?:\d{3}) 非捕获组
    // (?=XXX+$)，先行断言，匹配一个空字符位置，它后面跟着一串数字（至少三个），这串数字前面可能有其他字符，但不能有数字。这个匹配位置的作用是在它前面插入逗号。
    // 它表示在当前位置后面匹配到 (?:\d{3})+ 的内容，但不包括当前位置在内。可以用一个指针从后往前指，两个数字间的缝隙也算
    // 某个位置后面必须有三个数字
    str = ret[0].replace(/(?=(?:\d{3})+$)/g, ',')
    if (ret[1]) {
      str += '.' + ret[1].padEnd(2, '0')
    }
  }
  return str
}
formatNumber(1234567789) // "1,234,567,789"
formatNumber(0) // "0"
formatNumber(12456.734567) // "12,456.734567"

function formatRMB(num) {
  if (isNaN(num)) {
    return '无效数字'
  }
  var sign = num < 0 ? '-' : ''
  num = Math.abs(num)
  var cents = Math.floor((num * 100 + 0.5) % 100)
  num = Math.floor(num / 100)
  if (isNaN(num) || num < 1 || num > 999999999) {
    return '无效金额'
  }
  var str = ''
  var digit = ['', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = ['', '拾', '佰', '仟', '万', '亿']
  for (var i = 0; i < unit.length && num > 0; i++) {
    var n = num % 10
    if (n > 0) {
      str = digit[n] + unit[i] + str
    } else if (i == 4) {
      str = unit[i] + str
    }
    num = Math.floor(num / 10)
  }
  str = sign + str + '元'
  if (cents == 0) {
    str += '整'
  } else {
    str += digit[cents / 10] + '角' + digit[cents % 10] + '分'
  }
  return str
}

console.log(formatRMB(1234567.89)) // 壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分
console.log(formatRMB(0.01)) // 壹分
console.log(formatRMB(-1234567.89)) // 负壹佰贰拾叁万肆仟五佰陆拾柒元捌角玖分
console.log(formatRMB('foo')) // 无效数字
console.log(formatRMB(10000000000)) // 无效金额
```

## 格式化驼峰

### 改成驼峰

```js
function toHump(name) {
  return name.replace(/[_-](\w)?/g, function (all, letter) {
    return letter ? letter.toUpperCase() : ''
  })
}
// -w w
// -a a
// - undefined
toHump('hello-world-a_') // "helloWorldA"
```

### 改成连接线

```js
function toLine1(name) {
  // 将所有大写，改为 下划线开始
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}
toLine1('aBcDfe') // 'a_bc_dfe'

function toLine2(name) {
  // replace参数二的函数，函数里的参数2开始都是匹配的组
  // str是匹配的完整字符串，不过这里str和letter是一样的
  return name.replace(/([A-Z])/g, (str, letter) => `_${letter.toLowerCase()}`)
}
toLine2('aBcDfe')
```

## 其他

```js
// 输入值不能全部为空格
// [^ ]匹配除空格以外的任意字符。 .* 匹配任意长度的任意字符。
;/.*[^ ].*/.test(' 2 ') // true
;/.*[^ ].*/.test('   ') // false

// 不能纯数字，取反即可
!/^\d+$/.test('2') // false

// 不能包含数字
!/\d+/g.test('a2') // false
```
