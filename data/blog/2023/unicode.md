---
title: '编码及文件系统'
date: Sat May 13 2023 10:22:57 GMT+0800 (中国标准时间)
lastmod: '2023-05-13'
tags: ['编码', 'unicode', 'utf-8', 'File', 'Blob', 'URL', 'FormData']
draft: false
summary: '软件架构的规则是相同的！！！'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/clean-architecture
---

## 编码格式

编码是将**一种符号系统中的符号转换成另一种符号系统**中的符号的过程。

在**计算机中，编码是将字符转换为数字**的过程。不同的编码方案使用不同的数字表示不同的字符。

在 JavaScript 领域中，常用的字符编码格式包括

- ASCII 码：ASCII 码是一种基本的字符编码格式，它只包含了英文字母、数字、标点符号等基本字符，共计 128 个字符。
- Unicode：Unicode 是一种更加全面的字符编码格式，它包含了几乎所有的语言字符，包括汉字、日文、韩文等，共计超过 130,000 个字符。
- UTF-8：**UTF-8 是 Unicode 的一种实现方式，它采用可变长度的编码方式**，可以用一个字节表示 ASCII 码中的字符，用两个或三个字节表示 Unicode 中的字符，从而节省存储空间。
  - 可变长度：编码长度可以根据字符的不同而变化，从而节省空间
- UTF-16：UTF-16 也是 Unicode 的一种实现方式，它采用**固定长度的编码**方式，用两个字节表示 BMP（Basic Multilingual Plane）中的字符，用四个字节表示其他字符。

也就是说，unicode 本身是一个编码格式，而 utf-8，utf-16，等等又是 unicode 的实现方式而已。

## 可变长度编码方式

可变长度编码方式是一种数据压缩技术，它通过对不同长度的数据进行不同的编码长度来减小数据的存储空间和传输带宽。

- 可变长度编码方式通常用于压缩文本、音频、视频等多媒体数据，其中常用的编码方式包括霍夫曼编码、算术编码和字典编码等。
- 与固定长度编码方式相比，可变长度编码方式具有更高的压缩比和更好的适应性，但同时也需要更多的计算和处理时间。

UTF-8 是一种可变长度编码方式，它的编码长度可以根据字符的不同而变化。这意味着不同的字符可能需要不同的字节数来进行编码。

具体来说，UTF-8 将 Unicode 字符编码为一系列字节序列，每个字节序列的第一个字节用于指示该序列的长度。

- 如果第一个字节的最高位为 0，则这个字符只需要一个字节进行编码；
  - 例如，英文字母 A 的 Unicode 码点是 U+0041，用 UTF-8 编码时只需要一个字节，其二进制表示为 01000001；
- 如果最高位为 1，那么这个字符需要更多的字节进行编码，第一个字节中的 1 的个数就表示了该字符需要的总字节数。
  - 而中文汉字“中”的 Unicode 码点是 U+4E2D，用 UTF-8 编码时需要三个字节，其二进制表示为 11100100 10111000 10101101。

## 如何得到 unicode 编码

- String.charCodeAt()
- String.fromCharCode()：该方法接受一个或多个 Unicode 码点，返回一个字符串。
- String.codePointAt()：该方法返回给定索引处的 Unicode 码点。它可以处理 Unicode 码点大于 0xFFFF 的字符，也就是支持大于四字节

```js
let str = 'Hello World'
let unicode = str.charCodeAt(0) // 72

let str = '🍎'
let unicode = str.codePointAt(0) // 127822

let char = String.fromCharCode(72) // "H" 将unicode码转换为 对应的字符
```

String.normalize() 方法是用于将字符串标准化为指定的 Unicode 标准格式的方法。它可以将字符串中的字符转换为等效的标准形式

如将重音符号转换为基本字符和组合重音符号，将变音符号转换为基本字符和附加变音符号等。该方法接受一个可选的参数，用于指定标准化的形式，可以是 "NFC"、"NFD"、"NFKC" 或 "NFKD"。

```js
const str = 'café'
console.log(str.normalize()) // 输出 "café"

const str2 = 'cafe\u0301' // "e\u0301" 是重音符号
console.log(str2.normalize()) // 输出 "café"

const str3 = 'Περιπτώσεις' // "́" 是组合重音符号
console.log(str3.normalize()) // 输出 "Περιπτώσεις"

const str4 = 'ḉafe' // "ḉ" 是组合字符 "c" 和附加变音符号 ","
console.log(str4.normalize('NFKD')) // 输出 "cafe"
```

- 第一个例子中的字符串已经是标准形式，因此 String.normalize() 方法不会对其进行任何更改。
- 第二个例子中的字符串包含重音符号，但是重音符号与基本字符是分开的，因此 String.normalize() 方法将其转换为标准形式。
- 第三个例子中的字符串包含组合重音符号，String.normalize() 方法将其转换为标准形式。
- 在第四个示例中，使用了参数 "NFKD"，它将字符转换为其分解形式，然后将组合字符和附加变音符号转换为基本字符和附加变音符号。

需要注意的是，String.normalize() 方法在某些情况下可能会影响字符串的长度。例如，在第二个示例中，使用 String.normalize() 方法将字符串 "cafe\u0301" 转换为 "café"，长度从 5 变为了 4。因此，在使用 String.normalize() 方法时，需要注意字符的长度会发生变化

## 字符串相关编码

JavaScript 的字符串是基于 Unicode 的：每个字符由 1-4 个字节的字节序列表示。

JavaScript 允许**我们通过下述三种表示方式之一将一个字符以其十六进制 Unicode 编码的方式插入到字符串中**：

- \xXX：XX 必须是介于 00 与 FF 之间的两位十六进制数，\xXX 表示 Unicode 编码为 XX 的字符。
- \uXXXX： XXXX 必须是 4 位十六进制数，值介于 0000 和 FFFF 之间
- `\u{XXXXXXX}`：XXXXXXX 必须是介于 0 和 10FFFF（Unicode 定义的最高码位）之间的 1 到 6 个字节的十六进制值。

```js
// \xXX 相关
// "\x7A" 表示 "z" (Unicode 编码为 U+007A)。
alert('\x7A') // z
alert('\xA9') // © (版权符号)

// \uXXXX 相关
alert('\u00A9') // ©, 等同于 \xA9，只是使用了四位十六进制数表示而已
alert('\u044F') // я（西里尔字母）
alert('\u2191') // ↑（上箭头符号）

// \u{X…XXXXXX} 相关
alert('\u{20331}') // 佫, 一个不常见的中文字符（长 Unicode）
alert('\u{1F60D}') // 😍, 一个微笑符号（另一个长 Unicode）
```

## 进制转换

进制转换是将一个数从一种进制表示转换为另一种进制表示的过程。常见的进制有二进制、八进制、十进制和十六进制。

进制转换在计算机科学和工程领域中非常重要，因为不同的进制在计算机中有不同的应用场景，例如二进制用于表示计算机内部的数据，十六进制用于调试和编程等。

### parseInt

```js
// 🔥🔥 string表示要转换的字符串，radix表示要转换的进制数，默认是10进制
// parseInt(string, radix)

// 🔥 将 指定进制 转换为 10 进制
parseInt('1a', 16) // 26 -> 1*16 + 10 -> 26

// 🔥 转换为十进制整数时，如果遇到非数字字符停止转换
parseInt('1a', 10) // 1

parseInt('a1', 2) // NaN
parseInt('a1') // NaN
parseInt('a1', 16) // 161 -> 10*16 + 1
parseInt('1010', 2) // 10 -> 1*2^3 + 2
```

- parseInt 要想将指定 字符串 转换为目标进制的数值，该函数会自动根据进制数，来识别字符串中的有效字符
  - 比如 16 进制，可以识别 a - f 等，但 10 进制就不识别
  - 同样 2 进制，只识别 0，1，大于 1 的也不识别，自动抛弃
  - 如果从前向后都识别不了，则返回 NaN
- 如果字符串以 0x 开头，则 parseInt 会将其视为十六进制数；
- 如果字符串以 0 开头，则 parseInt 会将其视为八进制数（在严格模式下不支持）。因此，建议在使用 parseInt 时始终指定进制参数。
- 如果字符串以 0b 开头，则是二进制

### toString

- 对于字符串类型，toString()方法返回字符串本身。
- 🔥🔥 对于数字类型，toString()方法可以接收一个参数，指定转换的进制数。如果不指定，则默认转换为十进制
- 对于数组类型，toString()方法将数组中的每个元素转换为字符串，并用逗号分隔
- 对于对象类型，toString()方法默认返回"[object Object]"。
  - 🔥🔥 如果想要自定义 toString()方法的返回值，可以在对象中定义一个 toString()方法

```js
// 🔥🔥 转换数字
var num = 10
console.log(num.toString()) // "10"
console.log(num.toString(2)) // "1010"
console.log(num.toString(16)) // "a"

;((255 << 16) | (255 << 8) | 0)
  .toString(16)(
    // 'ffff00'
    (255 << 16) | (255 << 8) | 0
  )
  .toString() // '16776960' 10进制

// 🔥🔥 转换数组
var arr = [1, 2, 3]
console.log(arr.toString()) // "1,2,3"

// 🔥🔥 转换对象
var obj1 = { a: 1 }
console.log(obj1.toString()) // [object Object]

var obj = {
  name: 'Tom',
  age: 18,
  toString: function () {
    return this.name + ' is ' + this.age + ' years old.'
  },
}
console.log(obj.toString()) // "Tom is 18 years old."
```

**实例：如何将 rgb 格式转换为 16 进制格式**

1. rgb 格式都是 255 以内的数字，也就是 2^8 - 1
2. rgb 的各个色值都在 0-8 位，因此如果要想显示成 16 进制，则需要 进行位运算，比如左移
   1. value `<<` num， value 是要进行左移运算的值，num 是要左移的位数，左移运算会将二进制表示的数左移 num 位，然后右侧补 0
3. 16 进制的字符串，以 0x 开头
4. 16 进制的颜色色值，都是 0xXxXxXX 格式，需要注意长度补齐

```js
const rgbToHex = (r, g, b) => {
  // 接收过来的rgb格式如何？可以将r、g、b各个位上的数字，左移，然后再运算，合并到一块
  // 然后再将合并后的数值，转换为16进制字符串，🔥🔥 toString如果不填写16，则默认转为10进制，务必注意 🔥🔥
  // 🔥🔥🔥🔥注意：下面的 `<<` 添加的反引号，正常是不需要的，这里主要为了项目编译通过
  const hex = ((r `<<` 16) | (g `<<` 8) | b).toString(16)

  // 如何拼接字符串，保证位数？
  // ((00 << 16) | (255 << 8) | 0).toString(16) -> 'ff00' 按位运算后，有可能导致高位缺失
  // '000000' + 'ff00' -> '000000ff00' -> 截取后6位
  return '0x' + `000000${hex}`.slice(-6)
}
rgbToHex(0, 255, 0)   // '00ff00'
rgbToHex(0, 255, 255) // '00ffff'
```

当然还可以借助 js 里的 **padStart** 方法，这个方法可以在字符串前面添加指定字符，直到字符串达到指定长度为止

```js
const str = '8';
const paddedStr = str.padStart(2, '0');  // 字符串长度8，若不够，则补0
console.log(paddedStr);                  // '08'


const rgbToHex = (r, g, b) => {
  const hex = ((r `<<` 16) | (g `<<` 8) | b).toString(16)
  return '0x' + hex.padStart(6, '0')
}
rgbToHex(0, 255, 0)
```

## decodeURI、decodeURIComponent

- decodeURI 解码一个完整的 URI，包括协议、域名、查询参数等所有部分，
  - decodeURI 将所有的 %xx 编码解码成它们所代表的字符，但是会保留一些特殊字符，例如冒号、正斜杠、问号等
  - 保留的哪些字符？很简单：url 里可以有什么字段不就是了。。。
- decodeURIComponent 只解码 URI 中的特定部分，例如查询参数中的值。
  - 将所有的 %xx 编码解码成它们所代表的字符，包括保留字符，因为查询字符串里，只有 key=value&
- 为了防止意外，还是改用什么转换就用什么转换吧。

```js
console.log(encodeURI('http://example.com/path?a=hello world&b=/test/'))
// http://example.com/path?a=hello%20world&b=/test/
console.log(decodeURI('http://example.com/path?a=hello%20world&b=/test/'))
// http://example.com/path?a=hello world&b=/test/

console.log(encodeURIComponent('http://example.com/path?a=hello world&b=/test/'))
// http%3A%2F%2Fexample.com%2Fpath%3Fa%3Dhello%20world%26b%3D%2Ftest%2F
console.log(
  decodeURIComponent('http%3A%2F%2Fexample.com%2Fpath%3Fa%3Dhello%20world%26b%3D%2Ftest%2F')
)
// http://example.com/path?a=hello world&b=/test/
```

如上

- 如果成对的使用，仅从转换的角度看，一切安好，但是
- 如果交叉用，则出现问题
- 如果乱用，也出问题，比如将 url 里的 冒号都格式化了，就不是一个正确的 url 了

那如何将一个错误编码的 url 转成正确的呢？

- 很荣幸，decodeURI 与 decodeURIComponent 的底层原理是一样的，只是转换的字符数量不同而已
- 既然原理相同，那分别对 url 部分和查询参数部分，递归反解析是不是就对了
- 仔细观察下面的结果，可以发现，如果多次重复编码，则会出现 `%25` 这个符号，就是将 `%` 编码的结果
- 然后发现，encodeURI 转换的字符数量是 encodeURIComponent 的子集，也就是如果编码出错了，肯定用 decodeURIComponent 反解析回来

```js
const code1 = encodeURIComponent('/')
const code2 = encodeURIComponent(code1)
const code3 = encodeURIComponent(code2)
console.log(
  code1,
  code2,
  code3,
  encodeURIComponent('%'),
  encodeURIComponent(' '),
  encodeURIComponent('?')
)
// %2F %252F %25252F %25 %20 %3F

const code11 = encodeURI(' ')
const code22 = encodeURI(code11)
const code33 = encodeURI(code22)
console.log(code11, code22, code33, encodeURI('%'), encodeURI(' '), encodeURI('?'))
// %20 %2520 %252520 %25 %20 %3F ?

// 将多次encode的url转为 只code一次的 结果
// 🔥🔥 注意，该方法并不能将 encode 的资源，完全转换为 我们平时看到的格式
const decodeRepeatCodeStr = (str) => {
  // 判断是否包含 %25，则一直迭代遍历
  let isRepeat = true
  while (isRepeat) {
    str = decodeURIComponent(str)
    isRepeat = ~str.indexOf('%25')
  }
  return str
}

console.log(decodeRepeatCodeStr('%25252F')) // %2F

// 🔥🔥 将其转换为最开始的格式
const decoderUrl = (str) => {
  while (decodeURIComponent(str) !== str) {
    str = decodeURIComponent(str)
  }
  return str
}
console.log(decoderUrl('%25252F')) // /  🔥🔥 这里将其转换为 最开始的状态了
```

## base64 编码

### 产生的历史原因

Base64 格式的历史可以追溯到 20 世纪 60 年代，当时计算机科学家们正在开发一种称为电子邮件的新通信协议。由于当时的电子邮件只能传输 ASCII 字符，因此需要一种方式将二进制数据转换为 ASCII 字符，以便能够在电子邮件中传输。于是，Base64 编码就应运而生。

Base64 编码是一种基于 64 个字符的编码方式，将 3 个 8 位字节转换为 4 个 6 位字节，然后将 6 位字节转换为相应的 ASCII 字符。这样就可以将任意二进制数据转换为 ASCII 字符，从而在电子邮件等文本协议中传输。

随着互联网的发展，Base64 编码也被广泛应用于数据传输和存储，例如在 HTTP、SMTP、FTP 等协议中，以及在 XML、JSON 等数据格式中。同时，由于 Base64 编码后的数据长度比原始数据增加了约 1/3，因此也被用于数据加密和签名等场景，以增强数据的安全性。

### 使用

Base64 编码是一种将二进制数据转换为 ASCII 字符的编码方法，它将 3 个字节的二进制数据编码为 4 个 ASCII 字符。

1. 将待编码的二进制数据按照 3 个字节一组进行分组。
2. 对于每一组数据，将其按照 6 位一组进行分割，得到 4 个数值。
3. 将这 4 个数值作为索引，从 Base64 字符表中取出对应的字符进行编码。
4. 如果分组中的数据不足 3 个字节，则使用 0 进行填充，编码后的字符也相应地添加等号。

例如，将二进制数据"01100001 01100010 01100011"进行 Base64 编码，具体过程如下：

1. 分组为"01100001 01100010 01100011"。
2. 每一组数据按照 6 位一组进行分割，得到 4 个数值：011000 010110 001011 000000。
3. 从 Base64 字符表中取出对应的字符进行编码，得到"YWJj"。

因此，原始数据"01100001 01100010 01100011"经过 Base64 编码后变成了"YWJj"。

```js
// 实现一个读取文件，并转换base64的方法
<input type="file" id="fileInput" />
<img src="data:image/png;base64,xxxx" />

const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  convertToBase64(file);
});

function convertToBase64(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // reader.result 为："data:image/png;base64,iVBORw0KGgoAxxx..."
    const base64String = reader.result.split(',')[1];
    console.log(base64String);
  };
  reader.onerror = error => {
    console.log('Error: ', error);
  };
}
```

- 🔥 🔥 目前只能使用 base64 格式将本地的图片资源内敛到文件里，暂无其他好的办法
- base64 格式已经是经过编码过的资源，如果想进一步压缩，则可能会增加更多的字符，导致文件变得更大
- Base64 格式可以是任何文件格式，包括**文本、图像、音频、视频**等。但是，将视频转换为 Base64 格式可能会导致文件大小急剧增加，并且在解码时可能会出现性能问题。

## 操作二进制数据

- 生成的 base64 格式文件，如何通过 url 打开？
- 浏览器发送文件，理论上只会传输 文本格式，那其他格式的文件如何传输，比如文件？

🔥 🔥 前面我们说了很多关于编码的内容，底层无非都是二进制之间的相互转化，而任何内容，其实计算机底层都是二进制表示的。

但对于前端开发而言，其实很少直接操作二进制数据，因此感知并不是很强。但 js 确实提供了很多操作二进制数据的 api

在 JavaScript 中，二进制数据流指的是一组由 0 和 1 组成的二进制数据，可以用于存储或传输诸如图像、音频、视频、压缩文件等类型的数据。

JS 中提供了多种处理二进制数据流的方法，如 File 接口、Blob、Buffer 等。

- 🔥 🔥 **Blob 是二进制数据的容器，可以保存任何类型的二进制数据**。它可以通过 new Blob()构造函数创建，也可以通过 File 接口的 slice()方法截取文件的一部分生成。Blob 对象还提供了一些方法，如 size 属性，用于获取 Blob 对象的大小；type 属性，用于获取 Blob 对象的 MIME 类型；slice()方法，用于截取 Blob 对象的一部分。
- 🔥 🔥 **File 接口是在浏览器环境中使用的 API，而且是 Blob 接口的子集**，用于表示文件的信息，如文件名、大小、修改时间等。它可以通过 input[type=file]元素或拖放操作获取，也可以通过 XMLHttpRequest 发送 FormData 对象上传文件。File 接口还提供了一些方法，如 slice()，用于截取文件的一部分。
- **Buffer 是 Node.js 中处理二进制数据的核心模块**，它提供了一种类似数组的数据结构，用于存储和操作二进制数据。Buffer 对象可以通过 new Buffer()构造函数创建，也可以通过 Buffer.from()方法从字符串、数组、Buffer 对象等类型的数据转换而来。Buffer 对象还提供了一些方法，如 slice()，用于截取 Buffer 对象的一部分；toString()，用于将 Buffer 对象转换为字符串；write()，用于向 Buffer 对象中写入数据等。

### Blob（Binary Large Object）

使用场景：

1. 文件上传：在前端上传文件时，可以使用 Blob 来读取文件内容并将其发送到服务器。
2. 图片处理：在前端进行图片处理时，可以使用 Blob 将图片转换为二进制数据，然后再进行操作。
3. 下载文件：在前端下载文件时，可以使用 Blob 将文件内容转换为二进制数据，然后再将其保存为文件。
4. 语音识别：在语音识别应用中，可以使用 Blob 将录音数据转换为二进制数据，然后再将其发送到服务器进行识别。
5. 视频播放：在前端播放视频时，可以使用 Blob 将视频文件转换为二进制数据，然后再进行播放。

```javascript
var blob = new Blob(array, options)
```

- 其中，array 参数是一个数组，用于存储二进制数据。options 参数是一个可选的对象，用于指定 Blob 对象的一些属性，包括 type、endings 等。
- endings 属性用于指定 Blob 对象的行终止符，可以是"transparent"或"native"。如果指定为"transparent"，则表示不对行终止符做任何处理；如果指定为"native"，则表示使用本地系统的行终止符。
- type 属性用于指定 Blob 对象的 MIME 类型，例如，如果要创建一个表示 PNG 图像的 Blob 对象，可以这样写：

```javascript
var blob = new Blob([pngData], { type: 'image/png' })
```

了解了 Blob 的基本语法后，我们来看一下它的原理。

Blob 对象实际上是一种二进制数据流，它可以通过`URL.createObjectURL()`方法生成一个 URL，然后可以**通过这个 URL 来访问 Blob 对象的数据**。

例如，下面的代码创建了一个表示文本数据的 Blob 对象，并生成一个 URL：

```javascript
var blob = new Blob(['Hello, world!'], { type: 'text/plain' })
var url = URL.createObjectURL(blob)

// 生成的URL可以用于创建一个新的Image、Audio、Video等标签，或者用于Ajax请求中的FormData对象。
// 例如，下面的代码创建了一个Image标签，并将Blob对象的数据作为图片的源：
var img = new Image()
img.src = url
img.height = 60
document.body.appendChild(img)
```

上面并不会展示成图片，因为并不是图片资源。

Blob 对象还可以用于上传文件，例如，下面的代码创建了一个表示文件的 Blob 对象，并将其上传到服务器：

```js
var file = new Blob([fileData], { type: 'application/octet-stream' })

var formData = new FormData()
formData.append('file', file, 'filename.txt')

var xhr = new XMLHttpRequest()
xhr.open('POST', '/upload')
xhr.send(formData)
```

### File

File 对象继承自 Blob。

```js
new File(fileParts, fileName, [options])
```

- fileParts —— Blob/BufferSource/String 类型值的数组。
- fileName —— 文件名字符串。
- options —— 可选对象：
  - lastModified —— 最后一次修改的时间戳（整数日期）。

File 对象具有以下属性：

- name：文件名，不包括路径。
- size：文件大小，以字节为单位。
- type：文件的 MIME 类型。
- lastModifiedDate：文件的最后修改日期。

除了 Blob 方法和属性外，File 对象还有 name 和 lastModified 属性，以及从文件系统读取的内部功能。我们通常从用户输入如 <input> 或拖放事件来获取 File 对象。

```html
<input type="file" id="fileInput" />

<script>
  var fileInput = document.getElementById('fileInput')
  var files = fileInput.files
  var file = files[0]
</script>
```

FileReader 对象可以从文件或 blob 中读取数据，可以读取为以下三种格式：

- readAsArrayBuffer(blob) —— 将数据读取为二进制格式的 ArrayBuffer。
- readAsText(blob, [encoding]) —— 将数据读取为给定编码（默认为 utf-8 编码）的文本字符串。
- readAsDataURL(blob) —— 读取二进制数据，并将其编码为 base64 的 data url。
- abort() —— 取消操作。

```html
<input type="file" onchange="readFile(this)" />

<script>
  function readFile(input) {
    let file = input.files[0]

    let reader = new FileReader()

    reader.readAsText(file)

    reader.onload = function () {
      console.log(reader.result)
    }

    reader.onerror = function () {
      console.log(reader.error)
    }
  }
</script>
```

### FormData

是一种用于将表单数据编码为键值对并发送到服务器的数据类型。它**可以用于发送包含文件上传等复杂数据的请求**。

formData 数据格式是一种可以将表单数据序列化成键值对的格式，可以**支持文件上传和二进制数据传输**，同时也可以支持多层嵌套的数据结构。

```js
var file = new Blob([fileData], { type: 'application/octet-stream' })

var formData = new FormData()
formData.append('file', file, 'filename.txt')

var xhr = new XMLHttpRequest()
xhr.open('POST', '/upload')
xhr.send(formData)
```

为何会使用 FormData?

**普通的对象不能传输文件类型，因为文件类型需要使用二进制数据进行传输，而普通的对象只能传输文本数据**。FormData 对象则可以将文件类型转换成二进制数据，并进行传输。

formData 数据格式产生的原因主要是因为 HTML 表单元素只能接受键值对的数据格式，而传统的 JSON 格式或者 XML 格式无法直接被 HTML 表单元素接受。

因此，为了方便将表单数据提交到服务器，formData 数据格式应运而生。

这使得开发者可以更加方便地处理表单数据，同时也为前后端数据交互提供了更加灵活的方式。

## 参考链接

[文件 API(MDN)](https://developer.mozilla.org/zh-CN/docs/Web/API/File_API)
[二进制数据，文件](https://zh.javascript.info/binary)
