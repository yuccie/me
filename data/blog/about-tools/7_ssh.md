---
title: 'ssh'
date: Thu Oct 19 2023 21:00:06 GMT+0800 (中国标准时间)
lastmod: '2023-10-19'
tags: ['ssh']
draft: false
summary: 'ssh秘钥管理'
layout: PostSimple
bibliography: references-data.bib
canonicalUrl: https://dume.vercel.app/blog/about-tools/7_ssh
---

## ssh 介绍

为 Secure Shell 的缩写，是一种网络协议，用于计算机之间的加密登录，如果一个用户从本地计算机，使用 ssh 协议登录另一台远程计算机，我们可以认为这种登录是安全的，即使被中途截获，密码也不会泄露。ssh 之所以安全，因为他采用公钥加密

**过程：**

1. 远程主机收到用户的登录请求，把自己的公钥发给用户，
2. 用户使用这个公钥，将登陆密码加密后，发送给远程主机，
3. 远程主机用自己的私钥，解密登录密码，如果密码正确，就登录成功。

但也有安全隐患，如果有人截获了登录请求（第一步），然后冒充远程主机，将伪造的公钥发送给用户，那么用户就很难辨别真伪。因为不像 https 协议那样，ssh 协议的公钥是没有证书中心 ca 公证的，也就是说，都是自己签发。

可以设想，如果攻击者插在用户与远程主机之间（比如公共的 wifi 区域），用伪造的公钥，获取用户的登录密码，再用这个密码登录远程主机，那么 ssh 的安全机制就荡然无存。也是中间人攻击（Man-in-the-middle attack）

ssh 分客户端 openssh-client 和 openssh-server，如果只是想登陆别人的机器，ssh 只需安装 openssh-client（ubantu 有默认安装），如果要想使本机开放 ssh 服务就需要安装 openssh-server。

ssh root@67.218.147.xxx 意思是，安全脚本连接系统用户是 root，服务器地址是 67.218.147.xxx，
ssh 默认连接的端口是 22，如果想修改端口，需要加 ssh -p 端口号 root@67.218.147.xxx
而 ip 地址可以通过设置 hostname 来改变。如上图中 root@djch 但连接的时候，不建议这样，ip 更加高效。

### Enter passphrase for key xxx

每个 SSH 用户都有自己的`known_hosts`文件，此外系统也有一个这样的文件，通常是`/etc/ssh/_known_hosts`，保存一些对所有用户都可信赖的远程主机的公钥。`id_rsa.pub`是本机的公钥，`id_rsa`是本机的私钥。

```bash
# ~/.ssh 目录是一些密钥信息
# 若不添加任何信息可以直接执行下面命令，然后一路回车，
# 此时会生成id_rsa，id_rsa_pub，只需要将后者拷贝到远程对应服务器即可
ssh-keygen

# 但是若想一台电脑建立多个ssh连接，则需要为每个秘钥生成不同的名字
ssh-keygen -t rsa -C "your_mail@example.com" -f ~/.ssh/my_example_rsa
# -t 后面跟秘钥的类型，这里是rsa
# -C 是密钥的注释，一般在生成的秘钥最后面
# -f 因为默认都会生成同样的秘钥名字，这里相当于重命名
# 此时会在~/.ssh目录生成my_example_rsa和my_example_rsa.pub两个文件
# 只需将my_example_rsa.pub拷贝到远程
# 注意：还需要在~/.ssh目录增加(若没有)config文件，然后里面配置如下信息

#------------
# xxx-gitlab（这是区分不同的用户名，自定义即可）
Host gitlab.xxx.net
HostName gitlab.xxx.net
PreferredAuthentications publickey
IdentityFile ~/.ssh/xxx-gitlab-rsa

# 配置文件参数
# Host : 别名,随便取
# HostName : 如果要登录的主机名为git@gitlab.xxx.net:xxx.git,则Host为：gitlab.xxx.net
# User : 登录名,最好用账户邮箱
# PreferredAuthentications: 优先使用哪个方式验证,支持秘钥(publickey)和密码(password)方式
# IdentityFile : 指明对应用户的私钥文件地址(私钥的权限600)
#------------

# 配置完可以测试一下：
# @前面的协议一般都为git，后面的地址就是上面HostName
ssh -T git@gitlab.xxx.net
# 还可以直接通过别名方式：ssh -T Hostxxx
# 若输出类似一下信息，则代表成功：
Hi xxx! You have successfully authenticated, but GitHub does not provide shell access.

# 可以打印详细信息，尤其连接有问题时
ssh -T -v git@gitlab.xxx.net

# 如果正常操作后，还是提示permission denied就执行
ssh-add -k ~/.ssh/gitlab_rsa

# 有时候会打印：Permissions 0644 xxx are too open.
# 此时只需给指定的文件添加权限即可：
chmod 600 文件名

# 提示：Enter passphrase for key xxx
# 为了避免每次都提示输入，可以执行如下命令将私钥添加进钥匙串
ssh-add -K ~/.ssh/对应私钥文件名
# 但需要注意：ssh-add 这个命令不是用来永久性的记住你所使用的私钥的。实际上，它的作用只是把你指定的私钥添加到 ssh-agent 所管理的一个session 当中。而 ssh-agent 是一个用于存储私钥的临时性的 session 服务，也就是说当你重启之后，ssh-agent服务也就重置了。
# 还有人说，秘钥重新生成走一遍流程就好，但也不一定。。。
# 参考：https://help.github.com/cn/github/authenticating-to-github/working-with-ssh-key-passphrases

# 还可以直接在 当前所用的shell里配置，就免得每次手动操作，比如当前我的shell是zsh
# 修复每次关机重启都需要验证git登录信息,这里只是将每次的操作挪到终端自动执行而已.
ssh-add -K ~/.ssh/yuccie1617@gmail.com
参考：https://blog.csdn.net/superbfly/article/details/75287741
```

使用密码登录，每次都需要输入密码，非常麻烦，好在`ssh`提供公钥登录，可以省去输入密码的步骤。所谓公钥登录，原理就是用户将自己的公钥存储在远程主机上，登录时，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后再发给远程主机，远程主机用事先存储用户的公钥解密，如果成功，则客户的是可信的，直接允许登录`shell`，不再要求密码。

注意：临时性的 session 服务是有时效性的，当长时间没有使用，再次使用依然会出现 `Enter passphrase for key xxx ` 只需再次操作 `ssh-add -K ~/.ssh/对应私钥文件名` 即可

另外对于 zsh 来说，多个 ssh 配置的秘钥配置是存放在 `~/.ssh/config` 里
