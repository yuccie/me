---
title: 'css相关'
date: Fri May 12 2023 21:18:08 GMT+0800 (中国标准时间)
lastmod: '2023-05-09'
tags: ['css', '渐变', '滤镜']
draft: false
summary: '那些酷炫的css技巧'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/css-skills
---

## 渐变

### 字体渐变

```css
.linear {
  background-image: linear-gradient(180deg, #4d8bff 10%, rgba(77, 139, 255, 0.4) 100%);
  /* -webkit-background-clip 属性和 -webkit-text-fill-color 属性用于指定文本的颜色和背景的裁剪方式。 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```
