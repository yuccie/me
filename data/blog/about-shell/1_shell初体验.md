---
title: 'shell初体验'
date: Wed Aug 30 2023 22:25:23 GMT+0800 (中国标准时间)
lastmod: '2023-08-30'
tags: ['shell']
draft: false
summary: '那些强大的命令行工具'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-shell/1_shell初体验
---

## shell

Shell 是一种命令行解释器（Command Line Interpreter），是操作系统与用户之间进行交互的接口。它接收用户输入的命令，并将其转化为操作系统能够理解和执行的指令。

Shell 的工作原理如下：

1. 用户在命令行终端中输入命令。
2. Shell 读取并解析用户输入的命令。
3. Shell 根据命令的类型和参数来确定要执行的操作。
4. Shell 调用相应的系统程序、工具或脚本来执行命令。
5. 执行结果通过标准输出（stdout）显示给用户。
6. Shell 等待下一个命令的输入，重复上述过程。

Shell 是一个强大的工具，它提供了许多功能和特性，例如：

- 命令解析和分隔：Shell 可以解析和分隔用户输入的命令，确定命令名称、参数和选项等信息。
- 环境变量管理：Shell 可以设置、获取和操作环境变量，这些变量存储了系统和用户相关的信息。
- 文件和目录操作：Shell 可以执行文件和目录的创建、复制、移动、删除等操作。
- 管道和重定向：Shell 支持使用管道（|）将多个命令连接起来，以及使用重定向符号（>、>>、<等）来控制输入和输出。
- 脚本编程：Shell 提供了脚本编程的功能，可以编写包含条件判断、循环、函数等的脚本文件，以实现自动化任务和批处理操作。

不同的操作系统有不同的 Shell，例如在 Unix/Linux 系统中常见的是 Bash（Bourne Again Shell），而在 Windows 系统中常见的是命令提示符（Command Prompt）或 PowerShell。每种 Shell 都有自己的语法和特性，但它们都遵循了类似的工作原理。

## shell 种类

在不同的操作系统中，常见的 Shell 种类有以下几种：

- Bourne Shell (sh)：最早的 Unix Shell，其衍生版本包括 Bash、Dash 等。
- Bash (Bourne Again Shell)：Bash 是在 Bourne Shell 基础上进行扩展和增强的 Shell，它是 Unix 和 Linux 系统中最常用的 Shell。大多数 Linux 发行版默认使用 Bash 作为默认 Shell。
- C Shell (csh)：C Shell 是在 C 语言风格的基础上设计的 Shell，具有类似于 C 语言的语法和特性。在某些 Unix 系统中，C Shell 是默认的 Shell。
- Korn Shell (ksh)：Korn Shell 是由 AT&T Bell 实验室的 David Korn 开发的 Shell，它结合了 Bourne Shell 和 C Shell 的特性，并引入了一些新的功能。Korn Shell 在 Unix 和 Linux 系统中广泛使用。
- Z Shell (zsh)：Z Shell 是对 Bourne Shell 的扩展，它提供了更多的功能和配置选项。Z Shell 具有高级的自动补全、历史命令管理、主题定制等特性，被认为是功能最强大的 Shell 之一。
- PowerShell：PowerShell 是由 Microsoft 开发的 Shell 和脚本语言，主要用于 Windows 系统。它提供了强大的命令行环境和脚本编程功能，并支持与.NET Framework 的集成。

通过下面命令可以查看当前系统里的 shells

```bash
# 方式一：
cat /etc/shells # ✅
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

# /bin/bash
# /bin/csh
# /bin/dash
# /bin/ksh
# /bin/sh
# /bin/tcsh
# /bin/zsh

# 方式二：
ls -l /bin/*sh  # ✅ 其实就是遍历执行文件
# -r-xr-xr-x  1 root  wheel  1326576  8 11  2022 /bin/bash
# -rwxr-xr-x  2 root  wheel  1153456  8 11  2022 /bin/csh
# -rwxr-xr-x  1 root  wheel   307296  8 11  2022 /bin/dash
# -r-xr-xr-x  1 root  wheel  2599008  8 11  2022 /bin/ksh
# -rwxr-xr-x  1 root  wheel   150384  8 11  2022 /bin/sh
# -rwxr-xr-x  2 root  wheel  1153456  8 11  2022 /bin/tcsh
# -rwxr-xr-x  1 root  wheel  1377872  8 11  2022 /bin/zsh

ls -l /usr/bin/*sh # ✅ 其实就是遍历执行文件
# -rwxr-xr-x   1 root  wheel   168672  8 11  2022 /usr/bin/afhash
# -rwxr-xr-x   1 root  wheel   173088  8 11  2022 /usr/bin/chsh
# -rwxr-xr-x   1 root  wheel   170352  8 11  2022 /usr/bin/crlrefresh
# -rwxr-xr-x  15 root  wheel      120  8 11  2022 /usr/bin/hash
# -rwxr-xr-x  71 root  wheel      811  8 11  2022 /usr/bin/instmodsh
# -rwxr-xr-x   1 root  wheel   167872  8 11  2022 /usr/bin/mcxrefresh
# -rwxr-xr-x   1 root  wheel      951  8 11  2022 /usr/bin/power_report.sh
# -rwxr-xr-x   1 root  wheel  1558848  8 11  2022 /usr/bin/ssh
# lrwxr-xr-x   1 root  wheel        8  8 11  2022 /usr/bin/tclsh -> tclsh8.5
# lrwxr-xr-x   1 root  wheel        7  8 11  2022 /usr/bin/wish -> wish8.5
```

## 切换 shell

```bash
# 查看当前的shell
echo $SHELL  # 必须是大写，这是系统的变量
# /bin/zsh

# 切换成 bash shell
chsh -s /bin/bash
```

如果提示 `chsh: no changes made` ，则可能是已经切换到目标 shell 了，不需要再次切换了，通过 `echo $SHELL` 查看，还有就是 shell 路径不对，通过 `cat /etc/shells` 查看

## 环境变量与 shell 的关系

前面说过，Shell 可以设置、获取和操作环境变量，这些变量存储了系统和用户相关的信息。

环境变量是在操作系统级别定义的全局变量，而 Shell 是一种命令行解释器，可以访问和操作这些环境变量。

1. **Shell 的启动过程和环境变量**： 当用户打开一个新的终端窗口或登录到系统时，Shell 会进行启动过程。
   1. 在启动过程中，Shell 会读取系统预定义的环境变量，并将其设置为 Shell 会话的一部分。这意味着在 Shell 会话中，用户可以直接访问和使用这些环境变量。
2. **Shell 配置文件和环境变量**： Shell 通常提供配置文件，用于定义和加载用户特定的配置和环境变量。
   1. 这些配置文件（如`.bashrc、.bash_profile、.zshrc`等）会在 Shell 启动时自动加载，并允许用户自定义环境变量、设置别名、定义函数等。

通过配置文件，用户可以在每次启动 Shell 时自动设置或修改环境变量，以便满足其特定需求。

因此，通过不同的 shell，打开不同的系统软件，需要在不同的配置文件里才可以配置。比如：

- Bash Shell：
  - `/etc/profile`：系统级别的 Bash 配置文件，用于定义全局的环境变量和配置。
  - `~/.bash_profile`：用户级别的 Bash 配置文件，用于定义个人的环境变量和配置。它在用户登录时执行一次。
  - `~/.bashrc`：用户级别的 Bash 配置文件，用于定义个人的环境变量和配置。它在每次打开新的终端窗口时执行。
- Zsh Shell：
  - `/etc/zshenv`：系统级别的 Zsh 配置文件，用于定义全局的环境变量。
  - `~/.zshrc`：用户级别的 Zsh 配置文件，用于定义个人的环境变量和配置。它在每次打开新的终端窗口时执行。

因此，在目前的项目中，多数使用的是 zsh shell，因此配置环境变量，只需要在 `~/.zshrc` 里配置即可，每次打开控制台都会执行这里面的配置。

## 环境变量

在 Unix 和 Unix-like 系统（如 Linux）中，**环境变量通常使用大写字母，而在 Windows 系统中，环境变量通常是不区分大小写的**。因此，在 Unix 和 Unix-like 系统中，应使用大写字母来引用环境变量的名称，以确保正确的匹配。

### 查看系统的环境变量

```bash
printenv
# USER=yq
# LOGNAME=yq
# PATH=/Users/yq/.nvm/versions/node/v16.19.0/bin:/Users/yq/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:xxx
# SHELL=/bin/zsh
# HOME=/Users/yq
# PWD=/usr/bin
# OLDPWD=/etc
# ZSH=/Users/yq/.oh-my-zsh
# PNPM_HOME=/Users/yq/Library/pnpm
# NVM_DIR=/Users/yq/.nvm
# ... 还有很多
```

- PATH：PATH 环境变量定义了操作系统在哪些目录中查找可执行文件。它包含一系列目录路径，以冒号（在 Unix 和 Unix-like 系统中）或分号（在 Windows 系统中）分隔。当您在命令行中输入一个命令时，操作系统会根据 PATH 环境变量中定义的目录顺序搜索可执行文件，并执行第一个匹配的文件。
- HOME：HOME 环境变量指定当前用户的主目录路径。许多应用程序和脚本使用 HOME 变量来确定用户的个人文件和配置的位置。
- USER：USER 环境变量存储当前用户的用户名。
- SHELL：SHELL 环境变量指定当前用户正在使用的 Shell 的路径。

```bash
echo $USER
# yq

echo $SHELL
# /bin/zsh
```

## 设置环境变量

我们知道了，shell 会从配置文件里读取设置的环境变量，那配置文件里如何设置呢？语法如何？

```bash
export VARIABLE_NAME=value
```

其中，VARIABLE_NAME 是您要设置的环境变量的名称，value 是该环境变量的值。

如果您只想在.zshrc 文件中定义临时的环境变量（仅在当前终端会话中有效），可以省略 export 关键字。

```bash
VARIABLE_NAME=value
```

请注意，为了使.zshrc 文件中的更改生效，您需要重新启动终端或运行 `source ~/.zshrc` 命令来重新加载配置。

`source ~/.zshrc` 命令的作用是重新加载当前用户的 `.zshrc` 文件，使其中的更改生效，而无需重新启动终端。

## command not found

知道了 shell 会读取指定的配置文件，因此当安装一个应用程序后，如果提示这个 command not found ，那很大可能是这个应用的环境变量并没有正确的配置。
