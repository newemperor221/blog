---
title: "WSL安装和使用"
date: 2026-03-14
description: ""
tags: ["WSL"]
categories: ["WSL"]
draft: false
---

> 安装的是Debian系统

## 安装WSL

PowerShell右击以管理员身份运行

使用以下命令安装wsl

```bash
wsl --install
```

## 安装linux系统版本

打开Microsoft Store搜Debian，下载

## 迁移系统

> 在D盘新建一个名叫WSL的空目录

```bash
# 关闭所有系统版本
wsl --shutdown

# 查看系统版本
wsl -l -v

# 打包系统
wsl --export Debian D:\WSL\wsl-export.tar

# 注销原系统
wsl --unregister Debian

# 把打包的系统文件恢复到D盘WSL目录里
wsl --import Debian D:\WSL\Debian D:\WSL\wsl-export.tar --version 2

# 启动系统
wsl -d Debian
```

> 然后可以把wsl-export.tar文件删掉了

## 修改默认用户

> 打开WSL系统会提示新建用户和输入密码
> 
> 这里会把普通用户作为默认用户
> 
> 无需在sudoers文件里添加内容

```bash
Debian.exe config --default-user <普通用户>
```

## 修改软件源

找到系统的`/etc/apt/sources.list`文件

把[中科大软件源](https://mirrors.ustc.edu.cn/help)的Debian和Debian Security粘贴进去

执行`sudo apt-get update && sudo apt-get upgrade -y`更新