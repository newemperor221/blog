<script lang="ts" setup>
import type { NavItemType } from './NavTypes'
import { useDark, useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'
import LeftNavBtn from './LeftNavBtn.vue'
import MenuBar from './MenuBar.vue'
import RightNavBar from './RightNavBar.vue'

const props = defineProps<{
  name: string
  navLinks: NavItemType[]
  clickToggleCallback: (state: boolean) => void
}>()

defineEmits<{
  clickSearch: []
}>()

const { directions, arrivedState } = useWindowScroll({ throttle: 10 })

let scrollFlag = true

const showNav = computed(() => {
  if (directions.bottom) {
    scrollFlag = false
    return false
  }
  else if (directions.top) {
    scrollFlag = true
    return true
  }
  else {
    return scrollFlag
  }
})

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
</script>

<template>
  <Transition name="slideDownIn">
    <nav
      v-show="showNav" id="nav" :class="{ 'nav-bg': !arrivedState.top }"
      class="h-12.5 w-full top-0 fixed z-9 backdrop-blur-8 backdrop-saturate-180"
    >
      <div class="mb-0 ml-auto mr-auto mt-0 flex flex-nowrap h-full w-[calc(100%-0.625rem)] w-85%">
        <LeftNavBtn :click-callback="clickToggleCallback" />
        <MenuBar :name="name" :nav-links="props.navLinks" />
        <RightNavBar>
          <div class="text-5 pb-2.5 pl-2 pr-2 pt-2.5 cursor-pointer" @click="isDark = !isDark">
            <div :class="{ 'i-ri-sun-line': !isDark, 'i-ri-moon-line': isDark }" />
          </div>
          <div id="search" class="text-5 pb-2.5 pl-2 pr-2 pt-2.5 cursor-pointer" @click="$emit('clickSearch')">
            <div class="i-ri-search-line" />
          </div>
        </RightNavBar>
      </div>
    </nav>
  </Transition>
</template>

<style lang="css" scoped>
.nav-bg {
  background-image: var(--nav-bg);
  box-shadow: 0.1rem 0.1rem 0.2rem var(--grey-9-a1);
  text-shadow: 0 0 0.0625rem var(--grey-9-a1);
  color: var(--text-color);
}

@keyframes slideDownIn {
  0% {
    transform: translateY(-4rem);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes slideUpOut {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4rem);
  }
}

.slideDownIn-enter-active {
  animation: 0.4s slideDownIn;
}

.slideDownIn-leave-active {
  animation: 0.4s slideUpOut;
}
</style>
