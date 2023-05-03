---
title: '那些使用nextjs时的技巧'
date: Wed May 03 2023 19:03:04 GMT+0800 (中国标准时间)
lastmod: '2023-05-03'
tags: ['技巧', 'nextjs', 'tips']
draft: false
summary: '一些关于使用nextjs遇到的问题集锦'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/tips-of-nextjs
---

## 关于

在使用 nextjs 的过程中，总会遇到一些问题，下面是一些总结，如果恰好屏幕前的你也遇到了，可以参考。

### md 语法

- draft：是否为草稿
- layout：用哪种布局，在 layouts 文件夹下，不同的布局效果不同
- canonicalUrl：规范网址，写这篇文章线上的地址即可
- bibliography：参考书目

### 评论系统

A comments system powered by GitHub Discussions.

操作步骤：

1. 此仓库是公开的，否则访客将无法查看 discussion。
2. [giscus app](https://github.com/apps/giscus) 已安装否则访客将无法评论和回应。
3. [Discussions 功能已在你的仓库中启用](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)。

- style-src，项目里需要下载对应的 css 样式，但触发了 csp 的配置，导致下载失败
- 即使在 github 上安装了 giscus app，但是在本地开发时，仍然提示未安装，接口调用的
