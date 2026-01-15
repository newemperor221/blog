import type { NavItemType } from "@/components/navbar/NavTypes";
import type { SidebarConfig } from "@/components/sidebar/SidebarTypes";
import type { Locale } from "@/i18n";

interface BrandConfig {
  // 首页大标题
  title?: string;
  // 首页副标题
  subtitle?: string;
  // 首页 Logo，可以是文本或emoji
  logo?: string;
}

interface CoverConfig {
  // 是否启用封面
  enableCover?: boolean;
  // 是否启用预加载
  enablePreload?: boolean;
  fixedCover?: string;
  gradient?: boolean;
  enableNextGradientCover?: boolean;
}

interface FooterConfig {
  since?: number;
  icon?: {
    name?: string;
    color?: string;
  };
  count?: boolean;
  powered?: boolean;
  icp?: {
    enable?: boolean;
    icon?: string;
    icpnumber?: string;
    beian?: string;
    recordcode?: string;
  };
}

interface WidgetsConfig {
  randomPosts?: boolean;
  recentComments?: boolean;
}

interface HomeConfig {
  selectedCategories?: {
    name: string;
    cover?: string;
  }[];

  /** 首页分页：每页文章数量（不含置顶文章） */
  pageSize?: number;
}

/**
 * 协议类型
 * CC 4.0 系列：BY, BY-SA, BY-ND, BY-NC, BY-NC-SA, BY-NC-ND
 * 禁止转载：NOREPRINT
 */
export type LicenseType =
  | "CC-BY-4.0"
  | "CC-BY-SA-4.0"
  | "CC-BY-ND-4.0"
  | "CC-BY-NC-4.0"
  | "CC-BY-NC-SA-4.0"
  | "CC-BY-NC-ND-4.0"
  | "NOREPRINT";

interface CopyrightConfig {
  /** 全站默认协议类型 */
  license?: LicenseType;
  /** 是否显示版权声明 */
  show?: boolean;
}

export interface ShokaXThemeConfig {
  siteName: string;
  locale?: Locale; // 网站语言设置，默认为 zh-CN
  nav: NavItemType[];
  sidebar?: SidebarConfig;
  brand?: BrandConfig;
  cover?: CoverConfig;
  footer?: FooterConfig;
  widgets?: WidgetsConfig;
  home?: HomeConfig;
  copyright?: CopyrightConfig;
}

export function defineConfig(config: ShokaXThemeConfig) {
  return config;
}
