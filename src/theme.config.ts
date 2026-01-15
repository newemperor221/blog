// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
  siteName: "ShokaX",
  locale: "zh-CN", // 网站语言: "zh-CN" | "en"
  nav: [
    {
      href: "/",
      text: "首页",
      icon: "i-ri-home-line",
    },
    {
      dropbox: true,
      text: "文章",
      href: "/posts/",
      icon: "i-ri-quill-pen-fill",
      dropboxItems: [
        {
          href: "/categories/",
          text: "分类",
          icon: "i-ri-book-shelf-fill",
        },
        {
          href: "/tags/",
          text: "标签",
          icon: "i-ri-price-tag-3-fill",
        },
        {
          href: "/archives/",
          text: "归档",
          icon: "i-ri-archive-line",
        },
      ],
    },
  ],
  brand: {
    title: "ShokaX",
    subtitle: "A modern blog theme",
    logo: "✨",
  },
  cover: {
    enableCover: true,
    enablePreload: true,
    // 固定封面模式（可选）：
    // - enableFixedCover: 是否启用固定封面
    // - fixedCover: 推荐填 "cover-1" ~ "cover-6"（来自 src/components/Images.astro 预设），
    //              或者填 public 路径/远程 URL（会使用 <img> 兜底渲染）
    enableFixedCover: false,
    // fixedCover: "cover-1",
    // gradient: true, // 渐变模式
    enableNextGradientCover: false, // 文章导航使用渐变背景
  },
  sidebar: {
    author: "Your Name",
    description: "A brief introduction",
    social: {
      github: {
        url: "https://github.com/yourname",
        icon: "i-ri-github-fill",
      },
      twitter: {
        url: "https://twitter.com/yourname",
        icon: "i-ri-twitter-x-line",
      },
      email: {
        url: "mailto:your@email.com",
        icon: "i-ri-mail-line",
      },
    },
  },
  footer: {
    since: 2025,
    icon: {
      name: "sakura rotate",
      color: "#ffc0cb",
    },
    count: true,
    powered: true,
    icp: {
      enable: true,
      // icon: '/beian-icon.png',
      icpnumber: "津ICP备2022001375号",
      // beian: '网安备案号',
      // recordcode: 'xxxxx',
    },
  },
  widgets: {
    randomPosts: true,
    recentComments: true,
  },
  home: {
    selectedCategories: [{ name: "Tutorial" }, { name: "Frontend" }],
    pageSize: 5,
  },
  copyright: {
    license: "CC-BY-NC-SA-4.0",
    show: true,
  },
});
