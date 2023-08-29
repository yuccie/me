---
title: 'rpx与px转换'
date: Mon Aug 28 2023 21:51:29 GMT+0800 (中国标准时间)
tags: ['rpx', 'px']
draft: false
summary: '小程序rpx与px转换'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/responsive-layout/小程序rpx与px转换.md
---

## rpx

### 背景

rpx（responsive pixel） 是微信小程序的单位，可以根据屏幕自适应。规定屏幕宽度为`750rpx`.

如在 iPhone6 上，屏幕宽度为`375px`，共有 750 个物理像素，则 750rpx = 375px = 750 物理像素，1rpx = 0.5px = 1 物理像素。

浏览器里的一切长度都是 css 像素为单位，css 像素的单位是 px(pixel 像素的缩写)，他是图像显示的基本单元，**既不是一个确定的物理量，也不是一个点或者小方块，而是一个抽象概念**。。。

- 物理像素其实就等价于设备像素
  - 物理像素是硬件上的概念，不能被进一步分割。例如，一个分辨率为 1920x1080 的屏幕具有 1920 个物理像素宽和 1080 个物理像素高。
- 逻辑像素是在网页设计和样式中使用的单位
  - 在普通显示屏上，一个逻辑像素通常对应于一个物理像素，但在高密度（高 DPI）屏幕上，一个逻辑像素可能会对应多个物理像素。
- pixelRatio = 设备物理像素 / 设备逻辑像素
  - 当缩放浏览器时，该值会发生变化，逻辑像素 100px，放大两倍后依然是 100px，但是看起来宽了，那是因为物理像素多了一倍。
- mac 等显示器都可以修改分辨率

  - 其实物理像素无法再修改，之所以可以修改分辨率，那是因为图形驱动程序首先会根据新的分辨率计算出新的像素排列和像素总数。如果新分辨率比之前的分辨率更高，那么新的像素排列可能会使用更多的物理像素。如果新分辨率较低，那么可能会使用更少的物理像素。
  - 总的来说，重新分配像素的过程涉及到像素的重新排列、缩放和插值等操作，以适应新的分辨率。

- iphone12
  - 屏幕分辨率：1170*2532 ，屏幕尺寸：390*844 ，dpr：@3x

在微信小程序中：

- `px = rpx * (屏幕宽度 / 750)`
  - 750 是微信小程序设计稿的宽度（在开发者工具中设计时默认的宽度），屏幕宽度是设备的实际屏幕宽度，可以通过 wx.getSystemInfo 获取，而实际屏幕宽度肯定是不会变化的
  - 如果你有一个 rpx 值为 100，在一个 375px 宽度的设备上计算 px 的值：`px = 100 \* (375 / 750) = 50px`

### 响应式原理

微信小程序规定，任何手机的换算基准都是 750

| 设备        | 尺寸信息        | rpx 换算 px                    |
| ----------- | --------------- | ------------------------------ |
| iPhone5     | 320 x 568 dpr:2 | `1rpx = (320/750)px = 0.42px`  |
| iPhone6     | 375 x 667 dpr:2 | `1rpx = (375/750)px = 0.5px`   |
| iPhone6plus | 414 x 736 dpr:3 | `1rpx = (414/750)px = 0.552px` |

```js
var BASE_DEVICE_WIDTH = 750
var isIOS = navigator.userAgent.match('iPhone')
var deviceWidth = window.screen.width || 375
var deviceDPR = window.devicePixelRatio || 2

var checkDeviceWidth =
  window.__checkDeviceWidth__ ||
  function () {
    var newDeviceWidth = window.screen.width || 375
    var newDeviceDPR = window.devicePixelRatio || 2
    var newDeviceHeight = window.screen.height || 375
    if (window.screen.orientation && /^landscape/.test(window.screen.orientation.type || ''))
      newDeviceWidth = newDeviceHeight
    if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
      deviceWidth = newDeviceWidth
      deviceDPR = newDeviceDPR
    }
  }

checkDeviceWidth()
var eps = 1e-4 // 0.0001

var transformRPX =
  window.__transformRpx__ ||
  function (number, newDeviceWidth) {
    if (number === 0) return 0

    //  number * (375 / 750) => px
    //  number / 750 * 375   => px
    number = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth)
    // 计算机中存在舍入误差，这里可以一定程度上避免
    number = Math.floor(number + eps)

    if (number === 0) {
      if (deviceDPR === 1 || !isIOS) {
        // 非ios切dpr为1，则返回1
        return 1
      } else {
        // 等于0，且是ios下会返回 0.5
        return 0.5
      }
    }
    return number
  }
```

看底层实现发现：

- 设置一个 0rpx，在 ios 下会返回 0.5
- 为了避免舍入误差，增加了部分偏移量

知道了底层如何处理长度的，那就出现一个现象，也就是说当设置的单位相差不大时，结果是同一个值，如下

| 设备        | 尺寸信息        | rpx 换算 px                              |
| ----------- | --------------- | ---------------------------------------- |
| iPhone6plus | 414 x 736 dpr:3 | `1rpx = (414/750)px = 0.552px`           |
| iPhone6plus | 414 x 736 dpr:3 | `0.5rpx = 0.5*(414/750)px = 0.276px`     |
| iPhone6plus | 414 x 736 dpr:3 | `1.5rpx = 1.5*(414/750)px = 0.828px`     |
|             |                 | `Math.flool之后都为0，然后变成默认值0.5` |

### 舍入误差

舍入误差是指在进行浮点数计算时由于浮点数的有限精度而引入的近似值与真实值之间的差异。

由于计算机使用有限的位数来表示浮点数，无法准确地表示所有的实数，因此在进行浮点数计算时会出现舍入误差。

舍入误差的产生可以归因于以下两个主要因素：

1. 有限的浮点数表示：计算机使用有限的位数来表示浮点数，例如 IEEE 754 标准中的单精度（32 位）和双精度（64 位）浮点数。这限制了浮点数的精度，无法准确表示某些实数，因此在进行计算时会引入舍入误差。
2. 计算过程中的近似：在进行浮点数计算时，通常会涉及加法、减法、乘法和除法等基本运算。每个运算都可能导致结果的微小偏差，这些偏差会在连续计算中积累，导致最终的舍入误差。

舍入误差可能会导致计算结果与预期结果之间存在差异，并且这种差异可能会在复杂的数学计算和数值分析中表现得更为显著。在某些情况下，舍入误差可能会导致计算结果的不稳定性或错误的输出。

既然舍入误差是系统自动的行为，那手动加一个与预期目标接近的一个小数，这样就可以一定程度上屏蔽掉这个舍入误差

比如系统产生一个 `0.0000000001` 很小的一个数，但我业务诉求的精度其实精确到 0.0001 就行了，因此我就可以 0.0000000001 + 0.0001 = 0.0001000001，然后 `Math.floor(0.0001000001)` ，虽然结果都是 0，但是其实这里主要以 0.0001 为准了，相当于屏蔽掉了舍入误差 0.0000000001

### 其他的一些方法

- 使用四舍五入（Round）：使用 Math.round 函数可以将一个小数四舍五入到最接近的整数。这可以在某些情况下减少舍入误差。例如，Math.round(number \* 100) / 100 可以将小数保留两位小数，并进行四舍五入。
- 使用高精度数学库：对于需要高精度计算的情况，可以使用专门的高精度数学库，如 BigNumber.js 或 Decimal.js。这些库提供了更精确的数值表示和计算方法，可以减少舍入误差的影响。
- 避免连续计算：连续进行多个浮点数计算可能会导致舍入误差的积累。如果可能的话，尽量将计算过程重新组织为减少中间计算步骤或使用更精确的计算方法，以减少舍入误差的影响。
- 使用整数计算：在某些情况下，如果问题允许，可以将浮点数转换为整数来进行计算，然后再将结果转换回浮点数。整数计算在不涉及小数的情况下可以避免舍入误差。

### 项目实例

问题：在小程序项目中，view 标签之前是存在间距的，尤其是在 ide 上缩放不同的比例，可以更清楚的查看到，间距之间底部的背景色。

原因：rpx 单位换算成 px 后，由于精度以及 css 渲染问题导致元素之间出现间隙。这可能是由于浏览器或渲染引擎的 bug 或限制所致

目前代码测解决方式，对于出现间隙的 block 元素，添加 `margin-left: 1rpx`
