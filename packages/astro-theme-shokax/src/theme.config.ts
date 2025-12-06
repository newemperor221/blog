import type { NavItemType } from './components/navbar/NavTypes'

interface ShokaXThemeConfig {
  siteName: string
  nav: NavItemType[]
}

function defineConfig(config: ShokaXThemeConfig) {
  return config
}

export default defineConfig({
  siteName: 'ShokaX',
  nav: [
    {
      href: '/',
      text: 'Home',
      icon: 'i-ri-home-2-fill',
    },
  ],
})
