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

### 动画骨架屏

```css
@keyframes moveLight {
  0% {
    /* 水平100%的位置，垂直50%的位置 */
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.skeleton {
  width: 120px;
  height: 35px;
  background: linear-gradient(
    100deg,
    hsla(0, 0%, 74.5%, 0.2) 25%,
    hsla(0, 0%, 50.6%, 0.24) 37%,
    hsla(0, 0%, 74.5%, 0.2) 63%
  );
  background-size: 400% 100%;
  animation: moveLight ease 1.5s infinite;
}
```

```css
@keyframes skeleton-loading {
  0% {
    transform: translate(-37.5%);
  }

  to {
    transform: translate(37.5%);
  }
}

.skeleton {
  /* inset: 0 -150%; */
  background: linear-gradient(
    90deg,
    rgba(190, 190, 190, 0.2) 25%,
    rgba(129, 129, 129, 0.24) 37%,
    rgba(190, 190, 190, 0.2) 63%
  );
  animation: skeleton-loading 1.4s ease infinite;
}
```
