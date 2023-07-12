---
title: '每天一个知识点'
date: Wed Jul 12 2023 09:20:03 GMT+0800 (中国标准时间)
lastmod: '2023-07-12'
tags: ['知识点', '手写']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/daybyday
---

## 202307

### 20230712 生命周期

#### 小程序生命周期

生命周期，在应用或者组件的整个生命周期过程中，不同时期对外暴露的钩子，其实就是对外暴露一个回调函数

**应用程序的生命周期**

- onLaunch 监听小程序实例初始化，全局只触发一次
- onShow 从后台切换到前台
- onHide 从前台切换到后台
- onError 发生脚本或 api 错误都会进来
- onUnhandledRejection 监听到小程序示例有未处理的 promise reject 错误
- onPageNotFound 小程序要打开的页面不存在
- onThemeChange 监听到主题发生变化

> 创建小程序时，App() 必须在 app.js 中调用，必须调用且只能调用一次。不然会出现无法预期的后果。

QA:

- 切换到前台和后台，是打开小程序和关闭小程序吗？还是长按切换？在 app 内部又是如何表现？
- 不管是实例，还是页面，还是组件，都有个构造函数，然后入参就是对应页面、组件、实例的配置，包含生命周期

**页面的生命周期**

- onLoad 页面初次加载，只是执行钩子，页面元素并没有创建
- onShow 监听页面显示
- onReady 监听页面初次渲染完成
- onHide 监听页面隐藏
- onUnload 监听页面卸载

- onShareAppMessage 分享

**组件的生命周期**

- created 组件实例刚刚被创建时，此时无法使用 setData
- attached 组件实例进入到页面节点树时
- ready 组件布局完成时
- moved 组件实例被移动到节点树其他的位置
- detached 组件实例从节点树移除时
- lifetimes 组件的生命周期也可以在这里定义，优先级比外层高
  - created 组件实例刚刚被创建时，此时无法使用 setData
  - attached 组件实例进入到页面节点树时
  - ready 组件布局完成时
  - moved 组件实例被移动到节点树其他的位置
  - detached 组件实例从节点树移除时
  - error 当组件方法抛出错误时发生
- pageLifetimes 组件所在页面的生命周期声明对象
  - show 组件所在页面被展示时执行
  - hide 组件所在页面被隐藏时执行
  - resize 组件所在的页面尺寸变化时执行
  - routeDone 组件所在页面路由动画完成时执行

> 自定义 tabBar 的 pageLifetime 不会触发。
