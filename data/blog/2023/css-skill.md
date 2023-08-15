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

## cssnano

是一个用于压缩和优化 CSS 的工具，它的原理和作用如下：

- 压缩 CSS：cssnano 使用各种技术和算法来删除无用的空格、换行、注释、重复的样式等，从而减小 CSS 文件的大小，提高加载速度。
- 优化 CSS：cssnano 还可以对 CSS 进行一些优化，例如将颜色值转换为更短的形式、将长的属性值转换为简写形式、合并相同的选择器等，从而减小 CSS 文件的复杂度，提高解析效率。
- 处理浏览器前缀：cssnano 可以自动处理 CSS 中的浏览器前缀，根据配置文件中设置的目标浏览器版本，自动添加或删除不同浏览器的前缀，从而减小 CSS 文件的大小，并兼容不同的浏览器。
- 模块化支持：cssnano 可以与其他构建工具（如 webpack、gulp）集成，作为一个插件使用，从而可以根据需要选择性地进行压缩和优化。

总的来说，cssnano 的原理是通过删除无用的空格、注释和重复的样式，优化 CSS 属性值，处理浏览器前缀等方式来减小 CSS 文件的大小，提高加载速度和解析效率，并提供模块化支持。
