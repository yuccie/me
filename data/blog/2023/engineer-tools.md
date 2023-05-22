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

## 构建工具

- Webpack：是一个模块打包工具，主要用于将多个模块打包成一个文件，支持多种模块类型（如 CommonJS、AMD、ES6），可以通过插件扩展其功能，支持热更新，可以进行代码压缩、代码分离等优化处理。
- Rollup：是一个 JavaScript 模块打包器，主要用于打包库，支持 ES6 模块规范，可以进行 Tree Shaking 优化，生成的代码更加简洁。
-
- Vite：是一个基于浏览器原生 ES 模块的开发服务器和构建工具，使用了现代浏览器原生的 ES 模块导入方式，实现了更快的热更新和构建速度，支持 Vue 3.0。
- Gulp：是一个基于流的自动化构建工具，可以将多个任务串联起来，支持多种插件，可以进行文件的压缩、合并、重命名等操作。
- Grunt：是一个基于任务的自动化构建工具，可以将多个任务串联起来，支持多种插件，可以进行文件的压缩、合并、重命名等操作。

构建工具和打包工具都是用来管理项目中的代码资源的工具，但是它们的主要区别在于：

- 构建工具：主要用于管理项目中的源代码，例如编译、转换、合并、压缩等。常见的构建工具有 Grunt、Gulp、Webpack 等。
- 打包工具：主要用于将构建好的代码资源打包成一个或多个文件，以便于在浏览器中加载。常见的打包工具有 Browserify、Webpack、Rollup 等。

简单来说，**构建工具是用来处理源代码的，而打包工具是用来处理构建好的代码资源的。**

## webpeck

### compiler 阶段和 compilation 阶段。

在 compiler 阶段，Webpack 会调用插件的 apply 方法，将 compiler 对象作为参数传递给插件。在这个阶段，插件可以通过 compiler 对象访问到整个 Webpack 环境，包括配置、options、entry、output 等信息。插件可以利用这些信息进行预处理，比如在编译前根据配置生成一些代码、修改配置、添加 loader 等。

- 读取配置文件，初始化参数：Webpack 会读取配置文件，根据配置文件的内容，初始化参数，包括 entry、output、module、plugins 等。
- 创建 Compiler 对象：Webpack 会创建一个 Compiler 对象，该对象负责管理整个编译过程，包括启动编译、读取文件、解析文件等。
- 注册插件：Webpack 会注册所有的插件，这些插件会在编译过程中被调用，可以对编译过程进行干预和修改。
- 执行 run 方法：Webpack 会执行 Compiler 对象的 run 方法，该方法启动编译过程，包括读取文件、解析文件、生成抽象语法树等。

在 compilation 阶段，Webpack 会调用插件的 run 方法，将 compilation 对象作为参数传递给插件。在这个阶段，插件可以访问到当前编译的模块、依赖、chunk、文件等信息。插件可以利用这些信息进行进一步的处理，比如在编译过程中对代码进行优化、添加一些额外的资源等。

- 解析文件：Webpack 会解析文件，生成抽象语法树，并且生成模块依赖关系。
- 生成模块：Webpack 会根据模块依赖关系，生成模块对象，包括模块的代码、依赖关系等。
- 优化代码：Webpack 会对代码进行优化，包括去重、压缩等。
- 生成输出文件：Webpack 会根据生成的模块和优化后的代码，生成最终的输出文件，包括 JS、CSS、图片等。同时，Webpack 也会生成一个 manifest 文件，记录模块的 id 和文件路径等信息，方便后续的模块查找和更新。

### 打包机制

- loader：加载器，将不同类型的文件转成可执行的 js 代码
  - webpack 原生只支持 js 和 json
  - loader 将 webpack 不支持的资源解析成支持的，并添加到依赖图里
  - 本身是一个函数，接受源文件，返回转换的结果
  - loader 执行顺序是从右往左，从下往上的。
- plugin：扩展 Webpack 的功能，例如压缩代码、提取公共代码
  - 而 plugin 主要是增强处理资源的能力，比如 boundle 的优化，环境变量的注入，目录的删除等
  - 作用于整个构建过程，开始到结束都可以使用插件

1. 配置入口文件：通过配置文件指定打包的入口文件，Webpack 会从入口文件开始递归地查找所有依赖的模块。
2. 解析模块依赖：Webpack 会根据入口文件中的依赖关系递归地解析出所有依赖的模块，并将其转换成抽象语法树（AST）。
3. 加载模块：Webpack 会根据模块的类型，使用对应的加载器进行加载，例如对于 CSS 文件，Webpack 会使用 CSS 加载器加载。
4. 转换模块：Webpack 会根据配置文件中的规则，对加载的模块进行转换，例如使用 Babel 转换 ES6 代码为 ES5 代码。
5. 合并模块：Webpack 会将转换后的模块合并成一个或多个文件，根据配置文件中的输出选项将其输出到指定的目录。
6. 优化打包结果：Webpack 会对打包结果进行优化，例如去除重复的代码、提取公共代码等。
7. 输出打包结果：最后，Webpack 会将打包结果输出到指定的目录中，可以通过浏览器或服务器加载这些文件。

### 解析模块依赖

示例：手动实现一个模块解析函数

总结：

- 转换成 ast 的阶段，只是单纯的在代码层面做分割，并达标
- 然后做一些基本的语言层面的校验

```js
function parseDependencies(code) {
  const dependencies = []
  // /require\(['"](.+?)['"]\)/g -> require\(  ['"]  (.+?)  ['"] \)/g
  // ['"] 匹配单引号或者双引号  (.+?) 作为一个补货组，匹配除换行符以外的任意字符，至少1个
  const requireRegex = /require\(['"](.+?)['"]\)/g
  // /import\s+  (?:.+\s+from\s+)?  (.+?)['"]/g
  // /import\s+ 匹配import及多个空格
  // (?:.+\s+from\s+)?   ?: 针对括号里的所有，意思是匹配一个以"from"结尾的字符串，且前面至少包含一个空格和一个字符
  // 同时 ?: 表示非补货组，也就是匹配上了，也不会出现在match结果里，提高效率
  // ? 表示可选，因为有 import 'xxx' 的场景，后面的同上
  const importRegex = /import\s+(?:.+\s+from\s+)?['"](.+?)['"]/g
  let match

  while ((match = requireRegex.exec(code))) {
    dependencies.push(match[1])
  }

  while ((match = importRegex.exec(code))) {
    dependencies.push(match[1])
  }

  return dependencies
}

const code = `
  const foo = require('./foo');
  import bar from './bar';

  // code here
`

const dependencies = parseDependencies(code)
console.log(dependencies) // ['./foo', './bar']
```

### AST 转换

AST（Abstract Syntax Tree，抽象语法树）是一种树形结构，用于表示程序的抽象语法结构。它将程序代码转换为树形结构，每个节点表示代码中的一个语法结构。AST 可以用于静态分析、编译器的中间表示和代码重构等方面。在编译器中，编译器可以通过 AST 来优化代码、检查语法错误和生成目标代码。

示例：下面是一个简单的转换抽象语法树的代码。

```js
function parseCode(code) {
  let ast = []

  // Split the code by line
  let lines = code.split('\n')

  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()

    // Ignore comments and empty lines
    if (line.startsWith('//') || line === '') continue

    // Split the line into tokens
    let tokens = line.split(' ')

    // Determine the type of the line
    let type = ''
    if (tokens[0] === 'if') {
      type = 'if'
    } else if (tokens[0] === 'else') {
      type = 'else'
    } else if (tokens[0] === 'for') {
      type = 'for'
    } else if (tokens[0] === 'while') {
      type = 'while'
    } else {
      type = 'assignment'
    }

    // Create a new AST node for the line
    let node = {
      type: type,
      value: line,
      children: [],
    }

    // Add the node to the AST
    ast.push(node)

    // If this is an if or else statement, add the children
    if (type === 'if' || type === 'else') {
      let childCode = ''
      let childIndent = 0
      let childLines = []

      // Find the first child line
      for (let j = i + 1; j < lines.length; j++) {
        let childLine = lines[j].trim()

        if (childLine === '') continue

        let indent = lines[j].match(/^\s*/)[0].length

        if (indent === childIndent + 2) {
          childCode += childLine + '\n'
          childLines.push(j)
        } else if (indent > childIndent + 2) {
          throw new Error('Invalid indent level')
        } else {
          break
        }
      }

      // Parse the child code recursively
      node.children.push(parseCode(childCode.trim()))

      // Remove the child lines from the main code
      for (let j = childLines.length - 1; j >= 0; j--) {
        lines.splice(childLines[j], 1)
      }

      // Skip the child lines in the main loop
      i += childLines.length
    }
  }

  return ast
}
```

### HMR（Hot Module Replacement）

Webpack 热更新是通过 webpack-dev-server 插件实现的，它利用了 WebSocket 技术实现了浏览器与服务器之间的实时通信。

1. 当 webpack-dev-server 启动时，会在浏览器端注入一段客户端代码，这段代码会与 webpack-dev-server 建立 WebSocket 连接，用来接收服务器端的更新信息。
2. 当源代码发生变化时，webpack 会重新编译代码，并将编译后的代码通过 WebSocket 发送给浏览器端。
3. 浏览器端接收到代码后，会使用 HMR（Hot Module Replacement）技术，将新的模块替换掉旧的模块，从而实现热更新。

需要注意的是，**HMR 只能替换能够被更新的模块，例如函数、类、对象等，而不能替换变量、常量等**。如果需要替换变量、常量等，需要手动刷新页面。

HMR 的实现原理是在运行时替换模块，而变量、常量等在编译阶段就已经被确定并提升，无法在运行时被替换。因此，需要手动刷新页面来更新变量、常量等。

```js
// webpack配置
const webpack = require('webpack')
module.exports = {
  // ...其他配置
  plugins: [new webpack.HotModuleReplacementPlugin()],
}

// 客户端业务代码
if (module.hot) {
  module.hot.accept('./app.js', function () {
    console.log('app.js has been updated')
    // 获取最新的模块代码
    const updatedModule = require('./app.js')
    // 使用新代码替换旧代码
    app = updatedModule.default
  })
}

// 服务端代码
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.js')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  hot: true,
  // ...其他配置
})

// 启动Webpack Server
server.listen(8080, 'localhost', function () {
  console.log('Starting server on http://localhost:8080')
})

// 监听文件改动事件，发送HMR消息给客户端
compiler.hooks.done.tap('webpack-dev-server', function (stats) {
  const changedModules = stats.compilation.modifiedFiles || []
  if (changedModules.length) {
    server.sockWrite(server.sockets, 'content-changed')
  }
})
```

这样就可以手动实现 HMR 技术了。当代码发生改变时，webpack 会自动编译并更新页面内容，而不需要刷新整个页面。

### 性能优化

优化，无非是从几个方面：

- 资源瘦身
  - tree shaking
  - 压缩混淆
  - 去除冗余 css
  - 图片压缩
- 速度优化
  - 资源切割
  - 缓存
  - 公共资源抽离等
- 分析

  - webpack-boundle-analyzer

- 使用 Tree Shaking：通过在代码中标记未使用的代码，Tree Shaking 可以删除未使用的代码，从而减少文件大小，提高加载速度。
- Code Splitting：将代码拆分成多个小块，使得每个页面只需加载需要的代码块，而不是整个应用程序。
- 懒加载：延迟加载组件或模块，只在需要时加载。这可以减少初始加载时间，提高用户体验。
- 使用缓存：使用 webpack 的缓存机制可以避免重复编译，提高构建速度。
- 使用 UglifyJS 压缩代码：通过压缩代码，可以减少文件大小，提高加载速度。
- 使用 PurifyCSS：此插件可以检测未使用的 CSS 样式，并删除它们，从而减少文件大小，提高加载速度。
- 使用 CommonsChunkPlugin：此插件可以将公共模块提取到单独的文件中，并在多个页面之间共享，从而减少重复加载的代码。
- 优化图片：通过压缩和优化图片，可以减少文件大小，提高加载速度。
- 使用 webpack-dev-server：此插件可以在开发过程中提供实时重新加载和热替换功能，从而提高开发效率。
- 使用 webpack-bundle-analyzer：此插件可以帮助您分析应用程序的打包结果，找出包含大量代码的模块，并使用 Code Splitting 和懒加载来优化它们。

### 分包策略

按照入口文件分包：多个入口文件可以分别打包成不同的文件，减小文件的大小，提高页面加载速度。

- 按照模块分包：webpack 可以通过代码分割的方式将不同模块打包成不同的文件，根据页面需要动态加载，提高页面加载速度。
- 按照异步加载分包：在 webpack 中可以使用 import()或 require.ensure()方法实现异步加载，按需加载模块，提高页面加载速度。
- 按照公共部分分包：将多个页面共用的代码打包成一个公共文件，减小重复代码，提高页面加载速度。
- 按照缓存策略分包：webpack 可以根据缓存策略将不同的文件分别打包成不同的文件，提高缓存命中率，减小文件加载时间。

主要是通过 webpack 的 splitChunks 插件来实现

- 最大、最小体积
- 并发数
- 缓存组等
- http2，无需担心并发数。
- [更多配置选项](https://webpack.js.org/plugins/split-chunks-plugin/)

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
```

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
