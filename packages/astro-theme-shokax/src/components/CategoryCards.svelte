<script lang='ts'>
  import { onMount } from 'svelte'
  import CategoryCard from './CategoryCard.svelte'

  interface PostInfo {
    title: string
    url: string
  }

  interface CategoryItem {
    name: string
    url: string
    cover?: string
    topCategory?: {
      name: string
      url: string
    }
    postCount: number
    childCount?: number
    posts: PostInfo[]
  }

  interface Props {
    categories?: CategoryItem[]
  }

  const { categories = [] }: Props = $props()

  let container: HTMLDivElement
  let items: HTMLElement[] = []
  let activeIndex = $state<number | null>(null)

  function handleToggle(index: number) {
    activeIndex = activeIndex === index ? null : index
  }

  onMount(() => {
    if (!container)
      return

    // Get all category items
    items = Array.from(container.querySelectorAll('.item'))

    if (items.length === 0)
      return

    // Intersection Observer for scroll animations
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.classList.contains('show')) {
            io.unobserve(entry.target)
          }
          else {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              entry.target.classList.add('show')
              io.unobserve(entry.target)
            }
          }
        })
      },
      {
        root: null,
        threshold: [0.3],
      },
    )

    // Observe all items
    items.forEach((item) => {
      io.observe(item)
    })

    // Show first 2 items immediately
    items.slice(0, 2).forEach((item) => {
      item.classList.add('show')
    })

    // Cleanup
    return () => {
      items.forEach(item => io.unobserve(item))
    }
  })
</script>

<div bind:this={container}>
  {#each categories as category, index (category.url)}
    <CategoryCard
      name={category.name}
      url={category.url}
      cover={category.cover}
      topCategory={category.topCategory}
      postCount={category.postCount}
      childCount={category.childCount}
      posts={category.posts}
      isActive={activeIndex === index}
      onToggle={() => handleToggle(index)}
    />
  {/each}
</div>

<style>
  div {
    display: contents;
  }

  :global(.item.show) {
    opacity: 1;
    animation: slideUpBigIn 0.6s ease-out forwards;
  }

  @keyframes slideUpBigIn {
    from {
      transform: translateY(2rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
