---
title: '页面性能'
date: Fri May 26 2023 14:21:47 GMT+0800 (中国标准时间)
lastmod: '2023-05-26'
tags: ['性能', '加载']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/page-optimize
---

## 分位值

- 90 分位指的是某个数据集中排在前 90%的数据所对应的数值，即有 90%的数据小于等于这个数值。
- 而 80 分位则是指有 80%的数据小于等于对应的数值。
- 这两个指标常用于描述数据的分布情况，可以用来评估数据的集中程度和离散程度。

## performance

```js
// 1、加载时间
var navigationTiming = window.performance.timing
var loadTime = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart
console.log('页面加载时间为：' + loadTime + '毫秒')

// 2、对应资源
var resourceTiming = window.performance.getEntriesByType('resource')
var resourceLoadTime = 0
for (var i = 0; i < resourceTiming.length; i++) {
  resourceLoadTime += resourceTiming[i].duration
}
console.log('资源加载时间为：' + resourceLoadTime + '毫秒')

// 3、渲染时间
var paintTiming = window.performance.getEntriesByType('paint')
var firstPaintTime = paintTiming[0].startTime
console.log('首次渲染时间为：' + firstPaintTime + '毫秒')

// 4、内存使用情况
var memoryInfo = window.performance.memory
console.log('内存使用情况为：' + memoryInfo.usedJSHeapSize + '字节')

// 5、网络连接情况
var networkInfo = window.navigator.connection
console.log('网络连接状况为：' + networkInfo.effectiveType)
```
