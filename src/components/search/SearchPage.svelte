<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { getT } from "@/i18n";
  import themeConfig from "@/theme.config";
  import pagefindCssHref from "@pagefind/default-ui/css/ui.css?url";

  const isDev = import.meta.env.DEV;

  interface Props {
    selector?: string | HTMLElement;
    showSearch?: boolean;
  }

  let { selector = undefined, showSearch = $bindable(false) }: Props = $props();
  const t = getT((themeConfig.locale as "zh-CN" | "en") || "zh-CN");

  let visible = $state(false);
  let isDark = $state(false);
  let observer: MutationObserver | null = null;
  let cleanupListener: (() => void) | null = null;

  function toggleVisibility() {
    visible = !visible;
  }

  function updateDarkMode() {
    isDark = document.documentElement.getAttribute("data-theme") === "dark";
  }

  function loadPagefindCssAfterOnload() {
    return new Promise<void>((resolve) => {
      const existing = document.querySelector<HTMLLinkElement>(
        'link[data-pagefind-ui="true"]',
      );
      if (existing) {
        resolve();
        return;
      }

      const appendCss = () => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = pagefindCssHref;
        link.dataset.pagefindUi = "true";
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
      };

      if (document.readyState === "complete") {
        appendCss();
        return;
      }

      window.addEventListener("load", appendCss, { once: true });
    });
  }

  async function initPagefind() {
    if (isDev) return;

    try {
      const [{ PagefindUI }] = await Promise.all([
        // @ts-expect-error no types for PagefindUI
        import("@pagefind/default-ui"),
        loadPagefindCssAfterOnload(),
      ]);
      new PagefindUI({ element: "#pagefind", showSubResults: true });
    } catch (error) {
      console.warn("Pagefind 初始化失败：", error);
    }
  }

  onMount(() => {
    initPagefind();

    // Setup dark mode observer
    updateDarkMode();
    observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Setup selector listener
    if (selector) {
      let element: HTMLElement | null = null;

      if (typeof selector === "string") {
        element = document.querySelector(selector);
      } else if (selector instanceof HTMLElement) {
        element = selector;
      }

      if (element) {
        element.addEventListener("click", toggleVisibility);
        cleanupListener = () => {
          element?.removeEventListener("click", toggleVisibility);
        };
      } else {
        console.warn("Invalid selector provided for PagefindSearch component.");
      }
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (cleanupListener) {
      cleanupListener();
      cleanupListener = null;
    }
  });

  // Watch showSearch prop when no selector is provided
  $effect(() => {
    if (!selector && showSearch !== undefined) {
      visible = showSearch;
    }
  });
</script>

<div
  class="pagefind fixed top-12 z-999 m-12 max-h-80% max-w-100vw min-h-70% w-[calc(100vw_-_7rem)]
  overflow-x-hidden overflow-y-scroll rounded-lg p-2
  bg-gradient-to-b from-black/50 to-black/60
  backdrop-blur-2xl slide-down"
  class:dark={isDark}
  class:pagefind-hidden={!visible}
>
  {#if isDev}
    <div class="dev-tip p-6 text-center">
      {t("search.devModeSkipped")}<br />
      {t("search.buildHint")}
    </div>
  {:else}
    <div id="pagefind"></div>
  {/if}
  <div
    class="i-ri-close-line absolute bottom-4 right-4 cursor-pointer text-8"
    onclick={() => (visible = false)}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Enter" && (visible = false)}
  ></div>
</div>

<style>
  :global(.pagefind-ui__results-area),
  :global(.pagefind-ui__result-link),
  :global(.pagefind-ui__result-excerpt),
  :global(.pagefind-ui__message) {
    color: var(--grey-9) !important;
  }

  .pagefind {
    scrollbar-width: thin;
    scrollbar-color: var(--grey-5) transparent;
    border: 1px solid var(--grey-2);
  }

  .pagefind-hidden {
    opacity: 0 !important;
    pointer-events: none;
    transform: translateY(-100%);
  }

  .slide-down {
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .dev-tip {
    color: var(--grey-9);
    line-height: 1.75;
  }

  @keyframes slide-down-enter {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 0.9;
    }
  }
</style>
