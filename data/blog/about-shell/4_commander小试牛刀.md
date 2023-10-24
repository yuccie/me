---
title: commander小试牛刀
date: Fri Oct 20 2023 09:26:43 GMT+0800 (中国标准时间)
lastmod: 2023/10/20
tags: [commander, shell, 命令行]
draft: false
summary: commander小试牛刀
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-shell/4_commander小试牛刀.md
---

### commander 模块

commander 模块是一个用于构建命令行界面（CLI）的 Node.js 模块，**它主要用于解析命令行参数和选项，而不是直接用于等待用户输入**。

commander 模块允许你定义命令和选项，并在命令行中触发相应的回调函数。它提供了一种方便的方式来处理命令行输入，并根据用户提供的参数执行相应的操作。

```js
const { program } = require('commander')

// 定义命令和选项
program
  .version('1.0.0')
  .option('-n, --name <name>', '你的名字')
  .option('-c, --color <color>', '你喜欢的颜色')
  .option('-a, --age <age>', '你的年龄')
  .parse(process.argv)

// 执行相应的操作
console.log('你的名字是：', program.name)
console.log('你喜欢的颜色是：', program.color)
console.log('你的年龄是：', program.age)
```

- 首先，通过 require('commander') 引入 commander 模块，并从中解构出 program 对象。
- 使用 program.version() 方法定义你的 CLI 的版本号。
- 使用 program.option() 方法定义命令行选项。每个选项都包含一个短标志（如 -n）和一个长标志（如 --name），以及一个描述。
- 使用 program.parse() 方法解析命令行参数，并将其保存在 program 对象中。

**注意**：

- 在上面定义 commander 时，options 里的定义方式是：`-n, --name <name>`，这就意味着后续命令行的格式是 `--name <name>`
  - 比如 `-n dog` 解析出来就是 `dog`
  - 比如 `-n=dog` 解析出来就是 `=dog`
- `program.version('0.0.1', '-v, --vers', 'output the current version');`
  - 参数二，是简写和全拼，默认是 -V 大写
  - 参数二，必须是两个，仅仅写一个 -v 无效
  - 参数三，是描述

### commander 之 command 模块

使用 commander 可以解析命令行里的参数，那能不能根据命令行里的某个参数，去执行一些逻辑呢？

答案就是 command

```js
#! /usr/bin/env node
const { program } = require('commander')

// 定义命令和选项
program
  .command('init')
  .version('1.0.0', '-v, --version')
  .description('初始化commander小工具')
  .option('-n, --name <name>', '你的名字')
  .option('-c, --color <color>', '你喜欢的颜色')
  .option('-a, --age <age>', '你的年龄')
  .action(async (res) => {
    console.log('res', res)
  })
  .parse(process.argv)
```

当执行上面的逻辑，命令行里输入：`./cmd init --name dog -c red -a 19` 时，会报错：`TypeError: this.name is not a function`，原因是底层对 name 做了过滤导致 `this.emit('command:' + this.name(), operands, unknown);` 换个名字即可

```js
#! /usr/bin/env node
const { program } = require('commander')

// 定义命令和选项
program
  .command('init')
  .version('1.0.0', '-v, --vers')
  .description('初始化commander小工具')
  .option('-u, --username <username>', '你的名字')
  .option('-c, --color <color>', '你喜欢的颜色')
  .option('-a, --age <age>', '你的年龄')
  .action(function (res) {
    console.log('res', res)
  })
  .parse(process.argv)

// 使用时，在命令行输入下面的，就会打印下方一坨内容 🔥
// ./cmd -u dog -c red -a 19

/* <ref *1> Command {
  _events: [Object: null prototype] {
    'option:vers': [Function (anonymous)],
    'option:username': [Function (anonymous)],
    'option:color': [Function (anonymous)],
    'option:age': [Function (anonymous)]
  },
  _eventsCount: 4,
  _maxListeners: undefined,
  commands: [],
  options: [
    Option {
      flags: '-v, --vers',
      required: false,
      optional: false,
      mandatory: false,
      negate: false,
      short: '-v',
      long: '--vers',
      description: 'output the version number',
      defaultValue: undefined
    },
    Option {
      flags: '-u, --username <username>',
      required: true,
      optional: false,
      mandatory: false,
      negate: false,
      short: '-u',
      long: '--username',
      description: '你的名字',
      defaultValue: undefined
    },
    Option {
      flags: '-c, --color <color>',
      required: true,
      optional: false,
      mandatory: false,
      negate: false,
      short: '-c',
      long: '--color',
      description: '你喜欢的颜色',
      defaultValue: undefined
    },
    Option {
      flags: '-a, --age <age>',
      required: true,
      optional: false,
      mandatory: false,
      negate: false,
      short: '-a',
      long: '--age',
      description: '你的年龄',
      defaultValue: undefined
    }
  ],
  parent: <ref *2> Command {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
    _maxListeners: undefined,
    commands: [ [Circular *1] ],
    options: [],
    parent: null,
    _allowUnknownOption: false,
    _args: [],
    rawArgs: null,
    _scriptPath: null,
    _name: '',
    _optionValues: {},
    _storeOptionsAsProperties: true,
    _passCommandToAction: true,
    _actionResults: [],
    _actionHandler: null,
    _executableHandler: false,
    _executableFile: null,
    _defaultCommandName: null,
    _exitCallback: null,
    _aliases: [],
    _hidden: false,
    _helpFlags: '-h, --help',
    _helpDescription: 'display help for command',
    _helpShortFlag: '-h',
    _helpLongFlag: '--help',
    _hasImplicitHelpCommand: undefined,
    _helpCommandName: 'help',
    _helpCommandnameAndArgs: 'help [command]',
    _helpCommandDescription: 'display help for command',
    program: [Circular *2],
    Command: [class Command extends EventEmitter],
    Option: [class Option],
    CommanderError: [class CommanderError extends Error],
    [Symbol(kCapture)]: false
  },
  _allowUnknownOption: false,
  _args: [],
  rawArgs: [
    '/Users/didi/.nvm/versions/node/v16.18.1/bin/node',
    '/Users/didi/space/me/data/blog/about-shell/cmd',
    '-u',
    'dog',
    '-c',
    'red',
    '-a',
    '19'
  ],
  _scriptPath: '/Users/didi/space/me/data/blog/about-shell/cmd',
  _name: 'init',
  _optionValues: {},
  _storeOptionsAsProperties: true,
  _passCommandToAction: true,
  _actionResults: [],
  _actionHandler: [Function: listener],
  _executableHandler: false,
  _executableFile: null,
  _defaultCommandName: null,
  _exitCallback: null,
  _aliases: [],
  _hidden: false,
  _helpFlags: '-h, --help',
  _helpDescription: 'display help for command',
  _helpShortFlag: '-h',
  _helpLongFlag: '--help',
  _hasImplicitHelpCommand: 0,
  _helpCommandName: 'help',
  _helpCommandnameAndArgs: 'help [command]',
  _helpCommandDescription: 'display help for command',
  _version: '1.0.0',
  _versionOptionName: 'vers',
  _description: '初始化commander小工具',
  _argsDescription: undefined,
  username: 'dog',   // 注意这里 🔥，变量是全拼
  color: 'red',      // 注意这里 🔥，变量是全拼
  age: '19',         // 注意这里 🔥，变量是全拼
  args: [],
  [Symbol(kCapture)]: false
} */
```

- 综上在 action 里得到的变量是全拼，比如 `username`
- 要想从 action 里获取有效信息，需要解构对应的值

### 总结

- commander 模块是一个命令行，它主要用于解析命令行参数和选项
- `program.version(version, [optionName], [optionDescription])`
  - `program.version('1.0.0', '-v, --custom-version', '显示自定义版本号');`
- `program.option(flags, description, [defaultValue])`
- `program.command('<commandName> [arguments]')`
- `program.description(description)`

```js
program.version(version, [optionName], [optionDescription])

program.option(flags, description, [defaultValue])

program.arguments('<args>')

program.command('<commandName> [arguments]')

program.parse(process.argv)

program
  .command('init <name>')
  .description('初始化项目')
  .option('-p, --path <path>', '项目路径')
  .action(function (name, options, command) {
    console.log('初始化项目:', name)
    console.log('项目路径:', options.path)
  })

program.parse(process.argv)
```
