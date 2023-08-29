---
title: '1px边框问题'
date: Mon Aug 28 2023 21:51:29 GMT+0800 (中国标准时间)
tags: ['rpx', 'px']
draft: false
summary: '1px边框问题'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/responsive-layout/1px边框问题.md
---

## 1px 边框问题

### 分辨率

分辨率是指显示设备（如计算机显示器、手机屏幕、电视等）能够显示的像素数量，通常以水平像素数和垂直像素数来表示。

分辨率通常以两个数字来表示，例如 1920x1080 或 1280x720。

第一个数字表示水平像素数，第二个数字表示垂直像素数。这些数字相乘即可得到总像素数。例如，1920x1080 分辨率表示屏幕水平方向有 1920 个像素，垂直方向有 1080 个像素，总共有 1920 x 1080 = 2,073,600 个像素。

### 物理像素、设备像素

上面分辨率提到的像素指的是设备像素（也称为逻辑像素或 CSS 像素）

设备像素是指在 CSS 和图像渲染中使用的**抽象单位**，用于确定元素的大小和位置。它是与设备的显示分辨率和像素密度相关联的虚拟单位。在多数情况下，设备像素与物理像素是一一对应的，即一个设备像素对应一个物理像素。

然而，对于高分辨率（高像素密度）屏幕，一个设备像素可能对应多个物理像素。这种情况下，为了保持内容在高分辨率屏幕上的清晰度，浏览器和操作系统会对元素进行缩放。例如，一个设备像素可能对应两个物理像素，这样在相同屏幕尺寸下，显示的内容会更加细腻和清晰。

需要注意的是，CSS 和图像渲染通常是以设备像素为基准进行的，而不是物理像素。这是为了使开发人员能够以抽象的方式处理布局和设计，并在不同屏幕分辨率上提供一致的外观和体验。

总结起来，设备像素是在 CSS 和图像渲染中使用的抽象单位，而物理像素是实际构成屏幕的物理光点。在大多数情况下，设备像素与物理像素是一一对应的，但在高分辨率屏幕上，一个设备像素可能对应多个物理像素。

### 1px

iphone6 的屏幕宽度为 375px，设计师做的视觉稿一般是 750px，也就是 2x，这个时候设计师在视觉稿上画了 1px 的边框，于是你就写`border-width:1px`，然后...1px 边框问题就产生了，也就是写大了。

对设计师来说它的 1px 是相对于 750px 的，对你来说你的 1px 是相对于 375px 的，实际上你应该是`border-width:0.5px`。

#### 1px 兼容问题

- 部分浏览器，在 PC 端浏览器的最小识别像素为 1px，因此写 0.5px，浏览器会自动变为 1px，导致变粗

#### 方式一：媒体查询

```css
/* 方式1：媒体查询 */
.border {
  border: 1px solid #999;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border {
    border: 0.5px solid #999;
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border {
    border: 0.333333px solid #999;
  }
}
```

#### 方式二：hairlines

在 2014 年的 WWDC，“设计响应的 Web 体验” 一讲中，Ted O’Connor 讲到关于“retina hairlines”（retina 极细的线）：在**retina 屏上仅仅显示 1 物理像素的边框**，开发者应该如何处理呢。

在 retina 屏的浏览器**可能**不认识 0.5px 的边框，将会把它解释成 0px，没有边框。包括 iOS 7 和之前版本，OS X Mavericks 及以前版本，还有 Android 设备。因此 需要通过 js 进行判断

```js
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  var testElem = document.createElement('div')
  testElem.style.border = '.5px solid transparent'
  document.body.appendChild(testElem)

  // 通过判断最终的偏移量，看浏览器是否正确的处理了1px
  if (testElem.offsetHeight == 1) {
    document.querySelector('html').classList.add('hairlines')
  }
  document.body.removeChild(testElem)
}
// 脚本应该放在内，如果在里面运行，需要包装 $(document).ready(function() {})
```

```css
div {
  border: 1px solid #bbb;
}
.hairlines div {
  border-width: 0.5px;
}
```

#### 方式 3：bow-shadow

box-shadow 不受设备像素密度的影响，因为它是应用于元素的阴影效果，而不是直接定义边框的宽度。这意味着 box-shadow 可以在不同分辨率的屏幕上以相对一致的方式呈现，无论是在高分辨率屏幕还是低分辨率屏幕上，阴影效果都可以保持清晰可见。

```css
.border-1px {
  box-shadow: 0px 0px 1px 0px red inset;
}
```
