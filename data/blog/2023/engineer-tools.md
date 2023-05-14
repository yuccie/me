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

## 异步加载

### 异步加载图片

```js
function loadImgAsync(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('could not load img at ' + url))
    }
    img.src = url
  })
}
```

### 无所不在的统计代码

```js
// 无所不在的百度统计代码，这便是常规的按需加载，用的时候执行以下就好(可以用事件触发)
;(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?<xxxxx>'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()
```

### 实现 vue 项目中的按需加载

```js
function load(componentName, path) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script')
    script.src = path
    script.async = true
    script.onload = function () {
      // 通过Vue.component验证组件，存在就resolve,否则reject
      var component = Vue.component(componentName)
      if (component) {
        resolve(component)
      } else {
        reject()
      }
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

var router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: {
        template: '<div>Home page</div>',
      },
    },
    {
      path: '/about',
      component: function (resolve, reject) {
        // 使用自定义的loda函数加载
        load('about', 'about.js').then(resolve, reject)
      },
    },
  ],
})

var app = new Vue({
  el: '#app',
  router: router,
})
```

### 配合 webpack 的按需加载

```js
// 配合webpack
const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    {
      path: '/about',
      // Vue.js支持component定义为一个函数：function (resolve) {}，
      // 在函数内，可以使用类似node.js的库引入模式
      // 这个特殊的require语法告诉webpack自动将编译后的代码分割成不同的块，这些块将通过按需自动下载。
      component: function (resolve) {
        require(['./components/about'], resolve)
      },
    },
    { path: '/', redirect: '/home' },
  ],
})

// 现在项目使用这种方式
// 1. import() 不同于 import，该方法为了动态加载模块而引入的新语法
// 2. import() 返回结果是 Promise
const router = new VueRouter({
  routes: [
    {
      path: `${rootPath}/pages`,
      redirect: { name: 'Home' },
      // import() 用于动态加载模块，其引用的模块及子模块会被分割打包成一个独立的 chunk。
      component: () => import('views/layout'),
      children: [
        {
          path: 'home',
          // Webpack 还允许以注释的方式传参，进而更好的生成 chunk。
          component: () =>
            import(
              /* webpackInclude: /\.json$/ */
              /* webpackExclude: /\.noimport\.json$/ */
              /* webpackChunkName: "my-chunk-name" */
              /* webpackMode: "lazy" */
              'views/blank'
            ),
          meta: { title: '首页', isHomePage: true },
          name: 'Home',
        },
      ],
    },
  ],
})

// webpack中使用的三种异步加载方式
// 1、System.import()； 已废除，不推荐
// 2、require.ensure()； v1和v2均可使用
// 3、import()；v2支持，v1不支持
```

### webpack 按需加载实现

#### 同步代码分割 require.ensure

同步代码分割是通过使用 require.ensure 方法来实现的。require.ensure 方法接收三个参数：需要分割的模块，分割后的模块名，以及分割后的模块对应的 chunk 的名称

```js
require.ensure(
  [],
  function (require) {
    var module = require('./module')
  },
  'module'
)
```

这段代码表示将./module 模块进行分割，分割后的模块名为 module，对应的 chunk 名称也为 module。

```js
// 手动实现一个requrieEnsure 函数
// 这里是并发，发起多个请求，还可以实现类似，promiseAll或者promiseLimit
function requireEnsure(dependencies, callback) {
  var module = {}
  var loadedDependencies = 0

  function loadDependency(dependencyIndex) {
    var dependency = dependencies[dependencyIndex]
    var script = document.createElement('script')
    script.src = dependency

    script.onload = function () {
      loadedDependencies++
      if (loadedDependencies === dependencies.length) {
        callback(module)
      }
    }

    document.head.appendChild(script)
  }

  for (var i = 0; i < dependencies.length; i++) {
    loadDependency(i)
  }
}
```

#### 异步代码分割 import()

异步代码分割是通过使用 import()方法来实现的。import()方法返回一个 Promise 对象，可以使用 then 方法来获取分割后的模块

```js
import('./module').then(function (module) {
  // do something with module
})
```

这段代码表示将./module 模块进行分割，并在分割后的模块加载完成后执行回调函数。

**手动实现一个 import()函数**

```js
async function import(moduleName) {
  const moduleUrl = `/modules/${moduleName}.js`;
  const response = await fetch(moduleUrl);
  const moduleSource = await response.text();
  const moduleExports = eval(moduleSource);
  return moduleExports.default;
}
```

### webpack 插件

该插件会在 webpack 编译完成后，遍历所有生成的 JS 文件，查找其中的 setTimeout 和 setInterval 调用，然后将它们收集到一个数组中。如果指定了 outputFile 选项，则将结果保存到指定文件中。否则，只输出收集到的定时器数量。

```js
const fs = require('fs')

class TimerCollectorPlugin {
  constructor(options) {
    this.options = options || {}
    this.timers = []
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('TimerCollectorPlugin', (compilation, callback) => {
      const assets = compilation.assets
      const keys = Object.keys(assets)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key.endsWith('.js')) {
          const content = assets[key].source()
          const regex = /setTimeout|setInterval/g
          let match
          while ((match = regex.exec(content)) !== null) {
            this.timers.push(match[0])
          }
        }
      }
      if (this.options.outputFile) {
        fs.writeFile(this.options.outputFile, JSON.stringify(this.timers), (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log(
              `TimerCollectorPlugin: ${this.timers.length} timers collected and saved to ${this.options.outputFile}`
            )
          }
          callback()
        })
      } else {
        console.log(`TimerCollectorPlugin: ${this.timers.length} timers collected`)
        callback()
      }
    })
  }
}

module.exports = TimerCollectorPlugin
```

使用插件

```js
const TimerCollectorPlugin = require('./TimerCollectorPlugin')

module.exports = {
  // ...
  plugins: [
    new TimerCollectorPlugin({
      outputFile: 'timers.json', // 可选，指定输出文件路径
    }),
  ],
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
  -
- pnpm
  - 共享依赖项：pnpm 采用硬链接机制，使得多个项目可以共享同一个依赖项。
  - 更少的磁盘空间：pnpm 不会为每个项目安装一个完整的依赖项，而是使用链接机制，节省了磁盘空间。

然后三者都支持，并行下载和缓存机制，可以更快地安装依赖项。
