<script lang='ts'>
  import type { NavItemType } from '../navbar/NavTypes'
  import type { SidebarConfig } from './SidebarTypes'
  import SidebarAuthor from './SidebarAuthor.svelte'
  import SidebarMenu from './SidebarMenu.svelte'
  import SidebarSocial from './SidebarSocial.svelte'
  import SidebarState from './SidebarState.svelte'

  interface Props {
    config: SidebarConfig
    siteState: {
      categories: number
      posts: number
      tags: number
    }
    menuSource: NavItemType[] | any
  }

  const { config, menuSource, siteState }: Props = $props()
</script>

<div class='overview'>
  <SidebarAuthor
    author={config.author || ''}
    avatar={config.avatar || ''}
    description={config.description || ''}
  />

  <SidebarState state={siteState} />

  <SidebarSocial social={config.social || {}} />

  <SidebarMenu menu={menuSource} />
</div>

<style>
  .overview {
    width: 100%;
  }
</style>
