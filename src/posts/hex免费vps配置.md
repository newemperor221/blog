---
title: hex免费vps配置源
date: 2026-02-28
description: ""
tags: ["hex.co.id", "ipv6", "免费vps"]
categories: ["vps"]
draft: false
---

## hex.co.id免费ipv6 vps

晚上1点抢

## Debian源

删除原来空的DNS配置文件

```
rm -f /etc/resolv.conf
```

导入DNS配置

```
cat > /etc/resolv.conf <<'EOF'
nameserver 2606:4700:4700::1111
nameserver 2606:4700:4700::1001
nameserver 2001:4860:4860::8888
nameserver 2620:fe::fe
options timeout:2 attempts:2 rotate
EOF
```

处理废弃库

```
mv /etc/apt/sources.list.d/ct-preset.list /etc/apt/sources.list.d/ct-preset.list.disabled
```

apt更新和安装软件

```
apt update && apt install curl ca-certificates
```

