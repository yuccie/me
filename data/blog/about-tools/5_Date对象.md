---
title: 'Date对象'
date: Wed Oct 11 2023 09:15:30 GMT+0800 (中国标准时间)
lastmod: '2023-10-11'
tags: ['Date对象']
draft: false
summary: 'Date对象'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/5_Date对象
---

## Date

### UTC

UTC 是协调世界时（Coordinated Universal Time）的缩写，它是一种基于原子钟的时间标准，用于协调全球范围内的时间

UTC 被广泛使用作为全球统一的时间参考，以确保不同地区的时间一致性。它不受时区的影响，不考虑夏令时的调整，而是采用恒定的秒数来衡量时间。UTC 的原子钟基于国际原子时（International Atomic Time，简称 TAI），并通过加入闰秒来与地球自转的变化保持同步。

UTC 并不是一个时区，而是一种标准时间。不同的时区可以通过与 UTC 的偏移来表示本地时间。

例如，东部标准时间（Eastern Standard Time，简称 EST）的偏移是 UTC-5，表示比 UTC 时间早 5 小时。

### 获取当前时区信息

```js
// 创建一个 DateTimeFormat 对象
const dtf = new Intl.DateTimeFormat()

// 获取当前时区信息
const timeZone = dtf.resolvedOptions().timeZone

console.log(timeZone) // 'Asia/Shanghai'
```

### 生成指定时区的时间

```js
// 创建一个 Date 对象
const date = new Date()

// 生成指定时区的时间字符串
const options = {
  timeZone: 'America/New_York', // 指定时区，例如美国东部时区
  hour12: false, // 是否使用 12 小时制
  hour: 'numeric', // 小时显示格式
  minute: 'numeric', // 分钟显示格式
  second: 'numeric', // 秒显示格式
}

const timeString = date.toLocaleTimeString('en-US', options)
console.log(timeString)
```

### Date.now()

Date.now() 方法生成的时间戳是基于 Coordinated Universal Time (UTC) 的。

Date.now() 返回的是自 1970 年 1 月 1 日 00:00:00 UTC（协调世界时）到当前时间的毫秒数。**它不受本地时区的影响，始终返回相对于 UTC 时间的时间戳**。

请注意，时间戳是一个与时区无关的绝对值。如果你需要将时间戳转换为本地时区的日期和时间，可以使用 Date 对象的其他方法，如 toLocaleString() 或 toLocaleTimeString()，并传递适当的时区选项。

### 时间格式

- 本地时间（Local Time）：本地时间是指特定地理区域内的时间，根据当地的时区规则进行调整。本地时间可以根据所在地的时区进行显示和解释。

- GMT（格林尼治标准时间）：GMT 是指格林尼治天文时间，是一种以英国伦敦格林尼治天文台所在地的标准时间。**GMT 与 UTC 在大部分情况下是相同的，但在涉及闰秒调整时可能会略有不同**。

- ISO 8601 格式：ISO 8601 是国际标准化组织定义的日期和时间表示法。它使用统一的格式，例如 YYYY-MM-DD 表示日期，HH:MM:SS 表示时间，并可以包含时区信息，如 YYYY-MM-DDTHH:MM:SSZ 表示带有时区偏移的时间。

- RFC 2822 格式：RFC 2822 是一种 Internet 标准，用于电子邮件和其他网络协议中的时间表示。它使用类似于 Day, DD Mon YYYY HH:MM:SS +timezone 的格式，例如 Tue, 01 Jan 2022 12:34:56 +0000。

- Unix 时间戳：Unix 时间戳是指自 1970 年 1 月 1 日 00:00:00 UTC 起经过的秒数或毫秒数。它是一种常用的时间表示方式，用于计算机系统中存储和处理时间。
