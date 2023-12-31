---
title: '工程化工具'
date: Sun May 14 2023 14:47:25 GMT+0800 (中国标准时间)
lastmod: '2023-05-14'
tags: ['工程化']
draft: false
summary: '这短短的一生，我们总要做一些有意义的事情。。。'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/2023/engineer-tools
---

## 私服

### npm 私服如何搭建？

- 推拉代码，可以使用 ssh，也可以使用 http 协议
- 肯定是一个服务器，node 服务器如何处理 ssh 协议？
- 每次推拉的数据，需要与服务器都交互哪些数据？
- 本地的每次操作，都在 git 的提交记录里，这些又是如何存储的？
- 然后代码回滚等，又是如何操作的？

npm 私服是一个中央仓库，用于存储和管理 npm 包。它的工作原理类似于 npm 官方仓库，但它是部署在本地网络中的。

- 安装一个 npm 包时，他们会首先检查本地的 npm 私服是否拥有该包，有直接下载，没有则去公网
- 发布一个 npm 包时，他们将把它上传到 npm 私服中。私服将验证包的有效性，并将其存储在本地的存储库中

搭建步骤：

1. 安装 Node.js 和 npm
2. 安装 sinopia，sinopia 是一款 npm 私服软件，可以通过 npm 安装：
3. 配置 sinopia，
4. 配置完成后，可以启动 sinopia：
5. 配置 npm

```bash
# 1、安装node npm
# 2、安装 sinopia
npm install -g sinopia
# 3、配置 sinopia
sinopia --config ./config.yaml --adduser
# 4、启动sinopia
sinopia  # 可以通过 http://localhost:4873 访问sinopia的web界面了。
# 5、配置npm，使其可以使用sinopia作为私服
npm set registry http://localhost:4873
```

### ssh、https、git 协议

Git 协议、SSH 协议和 HTTPS 协议都是 Git 仓库的传输协议，

- Git 协议：是 Git 自带的传输协议，使用端口号 9418，传输速度快，但不支持用户认证和加密传输。
- SSH 协议：使用 SSH 加密连接，可以进行用户认证，传输速度也比较快，但需要配置 SSH 服务和公钥/私钥。
- HTTPS 协议：使用 HTTPS 加密连接，支持用户认证和加密传输，但传输速度相对较慢，需要输入用户名和密码进行认证。

其实，不管什么协议，都是一个请求而已，然后服务器负责监听这种协议的请求，并处理。

如下是一个 node 服务器处理 ssh 的示例：

```js
const ssh2 = require('ssh2')

const server = new ssh2.Server(
  {
    hostKeys: [require('fs').readFileSync('/path/to/private/key')],
  },
  function (client) {
    console.log('Client connected!')

    client.on('authentication', function (ctx) {
      if (ctx.method === 'password' && ctx.username === 'username' && ctx.password === 'password') {
        ctx.accept()
      } else {
        ctx.reject()
      }
    })

    client.on('ready', function () {
      console.log('Client authenticated and ready!')
      client.on('session', function (accept, reject) {
        const session = accept()
        session.once('exec', function (accept, reject, info) {
          console.log(`Command: ${info.command}`)
          const stream = accept()
          stream.write('Welcome to SSH server!\n')
          stream.end('Goodbye!\n')
        })
      })
    })
  }
)

server.listen(22, '0.0.0.0', function () {
  console.log('SSH server started!')
})
```

### git 工具

git 是一种分布式版本控制系统，它可以在本地仓库中跟踪文件的修改和版本变化，并提供一系列命令来管理这些变化。

工作原理：

- **Git 的数据模型**：Git 的数据模型是基于文件系统的，每个文件都有一个唯一的 SHA-1 哈希值，Git 把文件存储在一个称为“对象库”的数据库中。Git 的对象库由三种类型的对象组成：blob 对象（存储文件内容）、tree 对象（存储目录结构）、commit 对象（存储提交信息）。
- **Git 的工作流程**：Git 的工作流程是基于分支的，每个分支都是一个指向某个 commit 对象的指针。当我们创建一个新的分支时，Git 会创建一个新的指针并指向当前的 commit 对象，然后我们在新的分支上进行修改和提交。当我们需要合并两个分支时，Git 会自动找到它们的最近共同祖先 commit 对象，然后把两个分支的修改合并到一起。
- Git 的命令行工具：Git 的命令行工具是通过调用 Git 的 API 来实现的。我们可以使用命令行工具来执行 Git 的各种操作，比如创建分支、提交修改、合并分支等。

总的来说，Git 的底层运行原理是基于分布式版本控制系统的数据模型和工作流程，通过命令行工具来实现各种操作。

## rrweb 回放

rrweb 是 'record and replay the web' 的简写，旨在利用现代浏览器所提供的强大 API 录制并回放任意 web 界面中的用户操作。

rrweb 是一个用于记录和回放 Web 应用程序用户会话的 JavaScript 库。它可以捕获用户与 Web 应用程序的交互，并将其转换为可重现的 JSON 格式。这可以用于错误排除、性能优化、用户行为分析等方面。rrweb 支持跨浏览器、跨平台，并且可以与 React、Vue、Angular 等主流框架集成。

rrweb 主要由 3 部分组成：

- rrweb-snapshot，包含 snapshot 和 rebuild 两个功能。snapshot 用于将 DOM 及其状态转化为可序列化的数据结构并添加唯一标识；rebuild 则是将 snapshot 记录的数据结构重建为对应的 DOM。
- rrweb，包含 record 和 replay 两个功能。record 用于记录 DOM 中的所有变更（mutation）；replay 则是将记录的变更按照对应的时间一一重放。
- rrweb-player，为 rrweb 提供一套 UI 控件，提供基于 GUI 的暂停、快进、拖拽至任意时间点播放等功能。

[更多请参考](https://github.com/rrweb-io/rrweb/blob/master/README.zh_CN.md)

## 包管理器

- Lerna 是一个用于管理包含多个软件包（package）的 JavaScript 项目的工具。它允许您将多个软件包存储在一个 Git 仓库中，并且可以在这些软件包之间共享依赖项。Lerna 还提供了一些其他功能，如版本控制和发布管理。

- npm
  - 包仓库最大，拥有大量的支持和文档
- yarn
- pnpm
  - 共享依赖项：pnpm 采用硬链接机制，使得多个项目可以共享同一个依赖项。
  - 更少的磁盘空间：pnpm 不会为每个项目安装一个完整的依赖项，而是使用链接机制，节省了磁盘空间。

然后三者都支持，并行下载和缓存机制，可以更快地安装依赖项。

### 如何解决包版本不一致的问题

1. 升级依赖包版本：如果遇到包版本不一致的问题，可以尝试升级依赖包版本，使其保持一致。可以使用 `npm-check` 或 `yarn upgrade-interactive` 来查看和更新依赖包版本。
2. 使用锁定文件：可以使用 `npm-shrinkwrap.json` 或 `yarn.lock` 锁定依赖包版本，确保每次安装的依赖包版本一致。
3. 使用 peerDependencies：在 `package.json` 中使用 `peerDependencies`，指定依赖包的版本范围，确保依赖包版本兼容性。
4. 使用 webpack 的 resolve.alias：在 webpack 配置文件中使用 `resolve.alias`，将依赖包指定到特定版本，确保打包时使用的依赖包版本一致。
5. 使用 npm audit：使用 `npm audit` 或 `yarn audit` 命令检查安装的依赖包是否存在安全漏洞或版本不一致问题，并根据提示进行相应的更新或修复。

## babel

Babel 是一个 JavaScript 编译器，它的主要作用是将 ES6/ES7 等新版本的 JavaScript 代码转换为 ES5 的标准 JavaScript 代码，以便在当前的浏览器和环境中执行。Babel 的运行原理如下：

1. 解析：Babel 首先将输入的代码解析成抽象语法树（AST），以便后续的操作。
2. 转换：Babel 根据预定义的转换规则，将 AST 中的新语法转换为 ES5 的标准语法。Babel 提供了一系列的转换插件，开发者可以根据自己的需求自由选择和组合这些插件。
3. 生成：Babel 将转换后的 AST 重新生成为标准的 JavaScript 代码，并输出到文件或内存中。

Babel 的运行原理可以简单概括为“输入代码 -> 解析成 AST -> 转换 AST -> 生成代码”。

在 Babel 中，执行顺序是先应用插件（plugins），再应用预设（presets）。具体来说，Babel 首先将所有的插件按照配置顺序依次执行，然后再将所有的预设按照配置顺序依次执行。这意味着，如果一个插件和一个预设都修改了同一个语法或特性，那么插件的修改会先被应用，然后预设的修改会覆盖插件的修改。

这是因为预设是一组插件的集合，它们被设计为一起使用，以便在一起完成某个特定的任务。因此，预设的修改通常会覆盖插件的修改，以确保它们能够协同工作，达到预期的效果。此外，预设还可以方便地打包和共享，使得使用 Babel 更加方便和高效。

## loader

### style-loader

Style-loader 是一个 Webpack 的 loader，主要用于将 CSS 代码注入到 HTML 页面中，使样式生效。

当 Webpack 打包时，Style-loader 会将 CSS 代码转换成 JavaScript 代码，并将其注入到 HTML 页面中的`<style>`标签中。这样做的好处是可以避免使用外部 CSS 文件，减少 HTTP 请求，提升页面加载速度。

#### 手动实现一个 style-loader

```js
// 1、获取CSS代码：通过AJAX请求、读取本地文件等方式获取。
// 2、CSS代码转换成JavaScript代码的方法有很多种，可以使用正则表达式、CSS Parser等工具
const css = 'body { background-color: red; }'
const js = `const style = document.createElement('style');
  style.innerHTML = '${css.replace(/(\r\n|\n|\r)/gm, '')}';
  document.head.appendChild(style);
`
// 3、注入到HTML页面中
const script = document.createElement('script')
script.innerHTML = js
document.head.appendChild(script)
```
