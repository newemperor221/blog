import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'
import themeConfig from './src/theme.config'

const iconSafeList = themeConfig.nav.flatMap((item) => {
  const icons: string[] = []
  if (item.icon) {
    icons.push(item.icon)
  }
  if (item.dropboxItems) {
    item.dropboxItems.forEach((subItem) => {
      if (subItem.icon) {
        icons.push(subItem.icon)
      }
    })
  }
  return icons
})

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetAttributify(),
  ],
  safelist: iconSafeList,
})
