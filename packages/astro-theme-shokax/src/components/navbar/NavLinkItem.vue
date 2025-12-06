<script setup lang="ts">
import NavItem from './NavItem.vue'

const props = defineProps<{
  href?: string
  text?: string
  icon?: string
}>()

const linkHref = props.href || '#'
</script>

<template>
  <NavItem>
    <a :href="linkHref">
      <div v-if="icon" :class="icon" class="icon-nav text-xl vertical-text-bottom inline-block" />
      {{ text }}
    </a>
  </NavItem>
</template>
