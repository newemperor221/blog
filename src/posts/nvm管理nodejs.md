---
title: nvm管理nodejs
date: 2026-02-21
description: ""
tags: ["nvm", "nodejs"]
categories: ["Nodejs"]
draft: false
---

## 安装nvm
nvm是nodejs管理器，可下载多个nodejs版本，随意切换
安装nvm
```bash
scoop install nvm
```
下载版本，我选择22.5.1
```bash
nvm install 22.5.1
```
第一次下载nvm，没有默认版本，下载了22.5.1，后会提示使用这个版本

查看nvm下载的nodejs版本
```bash
nvm list
```
使用22.5.1版本
```bash
nvm use 22.5.1
```
使用后22.5.1前面会有个`*`

### 切换npm软件源
查看npm的软件源
```bash
npm config get registry
```
切换npm的软件源，这里我选择淘宝镜像源
```bash
npm config set registry https://registry.npmmirror.com/
```

## 使用nrm管理npm镜像源
安装nrm
```bash
npm install -g nrm
```
查看本机上所有的镜像源
```bash
nrm ls
```
这里刚才切换的淘宝镜像源，前面有个`*`，表明此为当前使用镜像源

使用镜像源
```bash
nrm use 镜像源
```
切换成华为镜像源

测试nrm所有镜像源速度
```bash
nrm test
```
