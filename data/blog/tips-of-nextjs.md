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

### Conflicting paths returned from getStaticPaths, paths must be unique per page.

- 一种 case 是，添加的标签有空字符串，导致判断失败

### eslint

- Irregular whitespace not allowed 这种错误，一般是复制其他地方的代码到编辑器，比如 devtools 里，导致失败，检查相关的即可

### 图床

- 为了降低服务器的使用，可以将图片转为 base64，然后再通过其他格式将这个再次转换成更短的，只需要占用算力就可以

### md 语法

- draft：是否为草稿，
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

### mdx md 文件

[gray-matter](https://www.npmjs.com/package/gray-matter) Parse front-matter from a string or file. Fast, reliable and easy to use. Parses YAML front matter by default, but also has support for YAML, JSON, TOML or Coffee Front-Matter, with options to set custom delimiters. Used by metalsmith, assemble, verb and many other projects.

MDX (Markdown with JSX) 是一种结合了 Markdown 和 JSX 的格式，用于在 React 应用中编写组件和页面。相比之下，MD 文件只是使用 Markdown 格式编写的文本文件，用于记录笔记、文档等。

MDX 文件可以在其中嵌入 React 组件，这使得它非常适合于编写交互式文档和教程。另一方面，MD 文件只能包含 Markdown 格式的文本，不能嵌入任何代码或组件。

MDX 文件通常需要使用特殊的编译器或库来处理，以便将其中的 JSX 代码转换为可执行的 React 组件。而 MD 文件则可以直接在任何支持 Markdown 格式的编辑器中编辑和查看。

总之，MDX 文件更加灵活和强大，适合于编写复杂的文档和教程，而 MD 文件则更加简单和易于使用，适合于快速记录笔记和文档。

### slug

Slug 是指在 URL 中用来标识某一资源的短字符串。通常它是由字母、数字、连字符和下划线等字符组成，用于代替该资源的名称或标题。Slug 的作用是为了让 URL 更加简洁、易读、易记，同时也有利于搜索引擎优化。例如，一个文章的 URL 可以是：example.com/posts/what-is-a-slug，其中 "what-is-a-slug" 就是这篇文章的 slug。

```js
import { slug } from 'github-slugger'

const kebabCase = (str) => slug(str)
```

就像 GitHub 为 markdown 标题做的那样生成一个 slug。 它还确保 slug 以与 GitHub 相同的方式是唯一的。
这个包的总体目标是模拟 GitHub 处理生成降价标题锚点的方式尽可能接近。

和短链不同，短链通常由一个服务提供商生成和管理，并将长 URL 映射到短链。使用短链可以节省字符空间，方便在限制字符数量的场景下使用，例如在社交媒体上共享链接。

slug 可以简单理解为从原来的 url 截取部分片段作为标识。

### react 的一些感想

- react 项目的最大特点，感觉就是数据通过 props 的传递，如果嵌套很深的话，很不方便取定位数据的来源

```js
export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      {/* 搜索，是根据传入的posts文件，然后解析frontMatter，然后input匹配关键词 */}
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="所有文章"
      />
    </>
  )
}
```

### newsletter

supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus

These are all email marketing platforms that allow users to create and send email campaigns to subscribers. Each platform has its own unique features and pricing plans.

newsletter 和普通的邮箱服务（如谷歌邮箱）有很大的区别。下面是一些主要的区别：

- 目的不同：newsletter 主要是用来发送信息、新闻、促销等内容给订阅者，而普通的邮箱服务则是用来发送和接收个人邮件的。
- 频率不同：newsletter 通常是定期发送，如每周、每月等，而普通的邮箱服务则是随时可以发送和接收邮件。
- 发送量不同：newsletter 通常是发送给大量的订阅者，而普通的邮箱服务则是发送给个人或小组。
- 安全性不同：newsletter 通常会包含一些链接和图片等内容，可能会存在安全隐患，而普通的邮箱服务则有更好的安全措施来保护用户的个人信息和数据。
- 界面和功能不同：newsletter 通常有自己的界面和功能，如订阅、取消订阅、阅读等，而普通的邮箱服务则有更多的功能，如分类、回复、转发等。

### tailwild css

[官网](https://tailwindcss.com/docs/min-width)

使用时，只需要在输入框里，输入你想要的 css 样式名，tailwind css 就会给出很多提示，根据提示选择自己需要的即可

### 渲染数据的接口

在 Next.js 中，用于动态渲染数据的接口是 getServerSideProps 和 getStaticProps。

getServerSideProps：

- getServerSideProps 是一个异步函数，用于在每个请求时获取数据并将其作为 props 传递给页面组件。
- 每当客户端请求页面时，Next.js 会调用 getServerSideProps 函数，并将数据作为 props 传递给页面组件。
- 在 getServerSideProps 函数内部，可以执行异步操作，如从数据库获取数据、调用 API 等。
- getServerSideProps 函数在服务器端执行，因此可以在每个请求时动态获取数据，并在服务器上进行渲染。

getStaticProps：

- getStaticProps 是一个异步函数，用于在构建时获取数据并将其作为静态 props 传递给页面组件。
- 在构建过程中，Next.js 会调用 getStaticProps 函数，并将数据作为静态 props 传递给页面组件。
- 在 getStaticProps 函数内部，可以执行异步操作，如从数据库获取数据、调用 API 等。
- getStaticProps 函数在构建时执行，因此它可以在构建过程中预先获取数据，并将数据作为静态 HTML 页面的一部分进行生成。

这两个接口可以根据页面的需求选择使用。如果页面需要在每个请求时动态获取数据，可以使用 getServerSideProps。如果页面的数据可以在构建时预先获取，然后被所有客户端共享，可以使用 getStaticProps。

需要注意的是，getServerSideProps 和 getStaticProps 都必须导出为默认导出的函数，并且只能在页面组件中使用。这些函数可以在页面组件中直接定义，或者通过导入自外部模块。

### 除了 next.js，还有几个类似的产品

Next.js：

- Next.js 是一个基于 React 的框架，提供了服务器渲染、静态站点生成（SSG）、增量静态生成（ISG）等功能。
- 它具有强大的构建工具、路由和导航系统，并且与 React 生态系统紧密集成。
- Next.js 支持多种数据获取方法，如 getServerSideProps、getStaticProps 等，以及自动代码分割和优化的静态资源加载。

Nuxt.js：

- Nuxt.js 是一个基于 Vue.js 的框架，提供了服务器渲染、静态站点生成等功能。
- 它具有类似于 Next.js 的路由、数据获取方法和构建工具，同时支持自动代码分割和异步组件加载。
- Nuxt.js 提供了一套开箱即用的配置，使得构建和部署 Vue.js 应用程序变得更加简单。

Gatsby：

- Gatsby 是一个静态站点生成器，用于构建快速、安全和可扩展的静态网站和应用程序。
- 它使用 React 和 GraphQL 来管理数据和页面内容，支持服务器渲染和静态生成。
- Gatsby 提供了丰富的插件生态系统和自动优化的构建过程，使得构建和部署静态网站变得更加便捷。

SvelteKit：

- SvelteKit 是一个基于 Svelte 的框架，用于构建现代化的 Web 应用程序。
- 它提供了服务器渲染、静态站点生成等功能，并且具有简洁的 API 和快速的渲染性能。
- SvelteKit 使用路由和页面模块的概念来组织应用程序，并支持数据获取和自动代码分割。
