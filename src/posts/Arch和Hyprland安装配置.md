---
title: Arch和Hyprland安装配置
date: 2026-02-21
description: ""
tags: ["Arch", "Hyprland", "安装配置"]
categories: ["Arch"]
draft: false
---

## 安装

内容参考 [Arch WiKi](https://wiki.archlinuxcn.org/wiki/安装指南#) Arch 提供了自动化安装脚本可以输入 `archinstall` 进行配置

### 下载 Arch 镜像

[Arch 2024.12.01 镜像](https://mirrors.tuna.tsinghua.edu.cn/archlinux/iso/2024.12.01/)

### 验证 ISO 文件密钥 SHA256

```bash
certutil -hashfile 镜像文件. iso SHA256 # 和官网密钥对比
```

[Arch 官网下载界面](https://archlinux.org/download/) 密钥在这查看
### 制作启动盘

进入 [Rufus 官网](https://rufus.ie/en/) 下载 rufus 启动盘制作软件分区类型 GPT，目标系统类型 UEFI

如果是固态 U 盘就打开显示高级设备选项

勾选上显示 USB 外置硬盘

### 验证引导模式

```bash
cat /sys/firmware/efi/fw_platform_size # 验证 UEFI 位数是 64 位或 32 位
```

### 连接 WIFI

`rfkill unblock wifi` 解除网络接口软件屏蔽

```bash
iwctl # 进入 [iwd]# 界面
device list # 列出所有可用的适配器设备
device name set-property Powered on # 把网络适配器打开
station name scan # 扫描网络
station name get-networks # 列出所有网络
station name connect SSID # 连接网络
exit # 退出 [iwd]# 界面
```

Name 是适配器名称，SSID 是无线网络名称

连接上了可使用 `ping archlinux.org` 测试网络是否通畅

### 更新系统时间

```bash
timedatectl set-ntp true # 启用 NTP 同步
```

### 创建硬盘分区

```bash
fdisk -l # 查看硬盘信息
fdisk 硬盘名称 # 分区工具修改硬盘分区表，把路径写全
```

#### fdisk 创建分区

我的分区方案是一个 EFI 分区、一个 SWAP 分区、一个 /(根) 分区

输入 `g` 创建一个 GPT 分区表输入 `n` 创建分区

接下来依次是分区编号、起始扇区、结束扇区分区编号如果是默认直接回车即可、起始扇区也是结束扇区根据想要分区多大输入，1G 就输入 `+1G`

512MB 就输入 `+512M` 输入 `p` 显示分区表输入 `w` 保存分区表写入磁盘输入 `q` 放弃更改后的分区表

### 格式化分区

```bash
mkfs.ext4 根分区 # 格式化 / 分区
mkswap swap 分区 # 格式化 swap 分区
mkfs.fat -F 32 EFI 分区 # 格式化 EFI 分区
```

### 挂载分区

```bash
mount 根分区 /mnt # 把根分区挂载到 / mnt 目录
mount --mkdir EFI 分区 /mnt/boot # 把 EFI 分区挂载到 / mnt/boot 目录
swapon swap 分区 # 启用 Swap 分区
```

遵循先挂载到根分区，再挂载 EFI 分区，最后挂载其他分区

### 配置软件源

```bash
curl -L "https://archlinux.org/mirrorlist/?country=CN&protocol=https" \
-o /etc/pacman.d/mirrorlist  # 获取中国大陆的 https 镜像站
```

进入 `/etc/pacma.d/mirrorlist` 文件找到想要的软件源把前面的 #去掉保存即可

### 安装必需软件包

`pacstrap -K /mnt base linux linux-firmware` 安装 linux 内核文件显示分区表如果计算机是 intel 的 CPU 追加 `intel-ucode`，AMD CPU 追加 `amd-ucode` 文件管理系统的用户工具：

ext4 `e2fsprogs`exfat `exfatprogs`Btrfs `btrfs-progs`XFS `xfsprogs`

访问 RAID 分区的工具 `mdadm` 访问 LVM 分区的工具 `lvm2` 内建音频的 `sof-firmware`, 用于 Marvell 无线的 `linux-firmware-marvell`Broadcom wireless 的固件包 `broadcom-wl` 联网所需的程序 `modemmanager` 文件编辑器如 `nano`,`vim` 访问 man 和 info 页面中文档的工具:`man-db`,`man-pages`,`texinfo`ssh 工具 `openssh`、网络管理器 `networkmanager`sudo `sudo`、zsh `zsh`、git `git`、base-level `base-level`、nodejs `nodejs`、`npm`

```bash
pacstrap -K /mnt base linux linux-firmware interl-ucode amd-ucode \
e2fsprogs exfatprogs btrfs-progs xfsprogs mdadm lvm2 sof-firmware \
linux-firmware-marvell broadcom-wl modemmanager nano vim man-db \
man-pages texinfo openssh networkmanager sudo zsh git base-level \
nodejs npm
```

### 生成 fstab 文件

```bash
genfstab -U /mnt >> /mnt/etc/fstab # 分区挂载或启用后自动检测并生成系统文件
```

### chroot 到新安装的系统

```bash
arch-chroot /mnt # chroot 到新安装系统
```

### 设置时区

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime # 设置时区为上海
hwclock --sysohc # 生成 / etc/adjtime 文件
```

### 区域化本地设置

打开 `/etc/locale.gen` 文件取消 `en_US.UTF-8 UFT-8` 和 `zh_CN.UTF-8 UTF-8` 的注释，保存退出执行 `locale-gen` 命令打开 `/etc/locale.conf` 文件添加 `LANG=en_US.UTF-8` 和 `LC_TIME=zh_CN.UTF-8` 两行

### 网络配置

```bash
vim /etc/hostname # 在文件中输入主机名
ip link show # 查看网络接口
ip link set interface up # 开启网络接口，interface 替换为网络接口
systemctl enable NetworkManager.service # 开机自启网络服务
systemctl enable sshd.service # 开机自启 sshd 服务
```

### 设置 root 密码

```bash
passwd root # 设置 root 密码
```

### 安装 Grub 引导程序

安装软件包 `efibootmgr`、`grub`

```bash
# 把 grub 安装到磁盘
grub-install --target=x86_64-efi \
--efi-directory=/boot --bootloader-id=GRUB

# 生成 cfg 文件
grub-mkconfig -o /boot/grub/grub.cfg
```

进入 cfg 文件 找到 `set timeout=10` 把 10 改为 0 保存退出

```bash
exit # 退出 chroot 环境
umount -R /mnt # 手动卸载全部被挂载分区
reboot # 重启系统
```

撤出启动盘进入系统后使用 `nmtui` 工具连接网络

### 创建普通用户

```bash
cat /etc/shells # 查看 zsh 路径
useradd -m -s "/bin/zsh" "username" #创建普通用户，并为其指定默认 shell 为 zsh
passwd "用户名"
```

使用 root 用户在 `/etc/sudoers` 文件里找到 `root ALL=(ALL:ALL) ALL` 复制在下一行粘贴，把 root 换成我们要添加的普通用户名，保存退出（这样就能普通用户就能使用 sudo 命令执行 root 权限了）建议用户名不要用中文、大写，否则 Hyprland 登陆会登不进去
## 配置

### 配置 ArchLinuxCN

使用 [清华的软件源](https://mirrors.tuna.tsinghua.edu.cn/help/archlinuxcn/) 在 `/etc/pacman.conf` 末尾添加以下语句

```bash
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

添加本地信任 GPG key`sudo pacman-key --lsign-key "farseerc@archlinux.org"` 安装 archlinuxcn 密钥 `sudo pacman -Sy archlinuxcn-keyring` 配置 git 的全局设置

```bash
git config --global user.name "your_github_username"
git config --global user.email "your_github_email@email.com"
git config --global init.defaultBranch main
```

### npm 换源

```bash
node -v && npm -v # 查看 npm、node 版本
# 更换华为源
npm config set registry https://mirrors.huaweicloud.com/repository/npm/
npm cache clean -f # 清理缓存
npm config list # 查看源
npm update # 更新
sudo npm install -g npm@latest # 更新 npm
```

使用 npm 下载工具需要 root 权限

### Github SSH 下载

```bash
ssh-keygen -t ed25519 -C "your_name@email.com"
cat ~/.ssh/id_ed25519.pub
```

登录 **github**，点击 **头像**，点击 **设置**，找到 **SSH and GPG keys** 选项，点击 **SSH keys** 右边的 **New SSH key** 按钮，标题给个恰当的密钥名字，把 `cat ~/.ssh/id_ed25519.pub` 的输出全部复制进 Key 里面，单击 **Add SSH key**，接着输入你的 github 登录密码 `ssh -T git@github.com` 弹出以下内容，代表成功 `Hi your_name! You’ve successfully authenticated, but GitHub does not provide shell access.`

### paru 安装

```bash
git clone --depth=1 https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

`sudo vim /etc/pacman.conf` 把 Color 的注释去掉 `sudo nano /etc/paru.conf` 把 BottomUp 注释去掉 `paru -Syu` 更新

### Hyprland 安装

```bash
git clone --depth=1 https://github.com/JaKooLit/Arch-Hyprland.git
cd Arch-Hyprland
chmod +x install.sh
./install.sh
```

安装过程需要全程联网并且建议挑网络好的时候安装如果安装过程中经常有软件下载失败可以先把最后的标记失败的软件安装上，再配置好 npm 和 github ssh 下载方式，再进行下载

安装一些娱乐软件

```bash
paru -S google-chrome # 安装 chrome 浏览器
paru -S baidunetdisk-bin # 安装百度网盘
paru -S nerd-fonts # 安装 nerd-fonts 字体
paru -S linuxqq wechat # qq 和微信
paru bilibili # 选择 1
```

安装中文字体

```bash
sudo pacman -Sy adobe-source-han-sans-cn-fonts \
adobe-source-han-serif-cn-fonts noto-fonts-cjk \
wqy-microhei wqy-microhei wqy-microhei-lite \
wqy-bitmapfont ttf-arphic-ukai ttf-arphic-uming
```

### oh-my-zsh

如果安装完毕，终端没有 ohmyzsh 美化，可以自己尝试安装

```bash
git clone --depth=1 https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
# 主题 powerlevel10k
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git \
${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
# 高亮
git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git \
${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 自动补全
git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions \
${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 进入. zshrc 文件
# 找到 ZSH_THEME，把值改为 "powerlevel10k/powerlevel10k"
# 找到 plugins=(git)，在 git 后面添加 zsh-autosuggestions zsh-syntax-highlighting
```

### LazyVim

保证装有 neovim 和 git

```bash
sudo pacman -Sy neovim
git clone --depth=1 https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
nvim # 启动 nvim，安装插件
# 在~/.zshrc 文件中添加
alias vim='nvim' # 需要先将 vim 删掉，如果出现有 vim 但是 pacman 找不到，可以先安装，再删除
```

### 电池管理

```bash
sudo pacman -S tlp
paru -S tlpui-git # 如果出现 git 仓库克隆失败可以先执行下行注释 git 命令克隆下来, 再安装
# git clone https://github.com/linrunner/TLP.git
paru -S tlp-rdw
paru -S tp_smapi-lts tp_smapi
sudo systemctl enable tlp.service
sudo systemctl start tlp.service
sudo systemctl enable NetworkManager-dispatcher.service
sudo systemctl start NetworkManager-dispatcher.service
sudo systemctl mask systemd-rfkill.socket systemd-rfkill.service
```

### 风扇控制

```bash
paru -S nbfc-linux-git
```

### ufw 防火墙

```bash
sudo pacman -S ufw
systemctl enable ufw
systemctl start ufw
# 操作
sudo ufw allow 3389/tcp
sudo ufw allow 3389/udp
sudo ufw reset
sudo ufw status
sudo ufw default deny
```

### 安装 VSCode

在 [VSCode 下载链接](https://code.visualstudio.com/Download) 下载. tar.gz 包

把安装包 `tar -zxvf 安装包. tar.gz` 解压，放在 / opt / 目录下

使用 ln 命令创建软件链接 `ln -s /opt/code-stable-x64-1731511985 /opt/vscode`

创建 `vscode.desktop` 文件 (快捷方式)[链接](about:blank)

```bash
[Desktop Entry]
Type=Application
Name=Visual Studio Code
Exec=/opt/vscode/code
Icon=/opt/vscode/resources/app/resources/linux/code.png
Comment=Visual Studio Code
Terminal=false
```

把文件放在 `/usr/share/applications/` 目录下，结束