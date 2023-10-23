---
title: 'git工具'
date: Wed Oct 11 2023 09:15:30 GMT+0800 (中国标准时间)
lastmod: '2023-10-11'
tags: ['git工具']
draft: false
summary: 'git工具'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/4_git工具
---

## git

### git reset

git reset 用于将分支的 HEAD 指针移动到另一个位置，并可以选择是否保留或丢弃之前的更改。主要用于修改分支的历史记录。

- `git reset --soft <commit>：`移动 HEAD 指针到指定的 commit，并保留之前的更改。撤销 commit 的提交历史，但保留之前的更改在暂存区中，你可以重新提交这些更改。
- `git reset --mixed <commit>：`与 --soft 类似，移动 HEAD 指针到指定的 commit，但丢弃之前的更改。撤销 commit 的提交历史，并将之前的更改放入工作目录中的未跟踪文件状态。
- `git reset --hard <commit>：`完全移动 HEAD 指针到指定的 commit，并丢弃之前的更改。撤销 commit 的提交历史，并丢弃之前的所有更改。

当想要撤销最近的提交并保留更改，可以使用 `git reset --soft HEAD~`

在 Git 中，~ 符号用于**表示相对于当前提交的位置**。在命令 `git reset --soft HEAD~` 中，`HEAD~ 表示当前提交的父提交（上一个提交）`。

使用 ~ 符号加上数字可以表示相对于当前提交的更早的提交。例如，HEAD~2 表示当前提交的父提交的父提交（上两个提交），这中间的提交记录将都会没有，相当于重新提交。

一般想丢弃提交，但保留修改使用这个

### git revert

git revert **用于创建一个新的提交，撤销指定提交的更改**。相当于在历史记录中添加了一个新的提交，该提交是原提交的相反操作。主要用于在不改变分支历史的情况下撤销 commit。

`git revert <commit>` 创建一个新的提交，撤销指定的 commit 的更改。新的提交是原提交的相反操作，可以保留分支的历史记录。

- git revert HEAD 撤销最近的提交
- git revert xxx 指定的提交

因此每次只会撤销一个历史提交

执行 git revert 命令后，Git 会打开一个文本编辑器，让你输入撤销提交的相关说明。保存说明并关闭编辑器后，Git 将创建一个新的撤销提交。

相当于把之前的提交以及修改全部干掉了，同时新增一个提交记录。

一般想丢弃之前修改的情况下会使用这个。

### git reflog 查看变动历史

当你操作了很多 git 命令后，不知道哪个环节出错了，可以使用 `git reflog` 查看历史的 git 修改记录，比如使用 revert，还是 reset 操作等等

这将显示 Git 引用日志的列表，包括引用的哈希值、引用类型（如 HEAD、分支名）、引用变动的操作（如提交、重置）以及变动发生的时间。

```
155d297 (HEAD -> main) HEAD@{0}: reset: moving to HEAD@{1}
155d297 (HEAD -> main) HEAD@{1}: reset: moving to HEAD@{0}
155d297 (HEAD -> main) HEAD@{2}: commit: fix
cd7e2ff HEAD@{3}: reset: moving to HEAD
cd7e2ff HEAD@{4}: reset: moving to HEAD
cd7e2ff HEAD@{5}: reset: moving to HEAD
```

显示一系列引用变动的历史记录，每个记录都有一个类似 `HEAD@{n}` 的标识，其中 `n` 是一个数字。HEAD@{0} 表示最新的引用位置，而 HEAD@{1} 表示相对于最新位置的上一个引用位置，以此类推。

你可以使用 `git show HEAD@{4}` 命令来查看特定引用位置的详细信息，或者使用其他 Git 命令与该引用位置进行交互。

### git bisect 二分查找指定错误

在项目开发过程中，突然在某个版本引入了一个错误，此时代码已经提交了很多，挨个的检查代码，工作量巨大，此时可以通过 `git bisect` 提供的二分查找，快速定位问题

1. 首先使用 `git log --oneline` 查看当前分支所有的提交
2. 滚动到底部，查看最开始的提交记录，`git checkout 最开始的提交/或者确定没问题的提交`，试试有没有问题
3. 然后选择二分的范围：`git bisect start HEAD 最开始的提交/或者确定没问题的提交`，此时 git 为直接定位（应该是 `git checkout xxxcommit`）到 HEAD 与 `最开始的提交/或者确定没问题的提交` 中间的提交
4. 此时清除缓存，重新编译，看结果是否符合预期
   1. 不符合预期输入：`git bisect bad`
   2. 符合预期输入：`git bisect good`
   3. 上面两个命令，会循环自动的选择二分的中点
5. 直到最后，找到发生错误的提交。

其实与 `git reset、git revert`相比，`git checkout xxx` 才是查问题的首选，因为查问题不需要修改历史记录或代码，只是想切到对应的提交而已。

使用 `git checkout xxx` 后，如果想回到正常模式，只需要 `git checkout 当前分支名` 即可

[更多参考](https://www.ruanyifeng.com/blog/2018/12/git-bisect.html)
