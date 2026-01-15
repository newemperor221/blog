# Copilot Instructions for this repo

## Project Structure & Tooling

- **Single Astro project** (not a monorepo) using Bun 1.3.x runtime. Run `bun install` to set up dependencies.
- **Build workflow**: `bun run dev` (dev server), `bun run build` (runs `build:site` then `build:index` for Pagefind search indexing), `bun run preview` (preview production build).
- **Linting & formatting**: `bun run lint` (oxlint with type-awareness), `bun run format` (oxfmt), `bun run check` (Astro type checking).
- **Alias `@`** → `./src` (configured in `astro.config.mjs` vite.resolve.alias).
- **Integrations**: Svelte 5 (with customElement compiler option), UnoCSS (with reset injection), Sitemap, es-toolkit auto-imports, font subsetting via vite-plugin-font.

## Content & Configuration

- **Content collections** (`src/content.config.ts`): Loads Markdown from `src/posts/**/*.md` using Astro's `glob` loader. **Schema requires `date: z.date()`**—always parse date strings to Date objects before passing. Optional fields: `description`, `tags`, `categories`, `draft`, `cover` (image), `sticky`, `link`. Invalid dates trigger zod refine errors.
- **Markdown pipeline**: remark-math → KaTeX, remark-gfm (tables/strikethrough), remark-ins (++underline++), remark-directive + remark-ruby-directive, remark-emoji, remark-extended-table. Shiki themes: vitesse-light/dark with colorized brackets transformer.
- **Theme config** (`src/theme.config.ts`): Uses `defineConfig` helper to export `siteName`, `nav: NavItemType[]`, `brand`, `cover`, `sidebar`, `footer`, `widgets`, `home` settings. **When adding nav icons or dropdown items**, update their icon strings here so `uno.config.ts` can auto-safelist them (prevents UnoCSS purging).
- **Search indexing**: Build process runs Pagefind after site build (`build:index` step). Mark searchable content in Astro templates with `data-pagefind-body` attribute. `SearchPage.svelte` initializes `PagefindUI` in `onMount`.

## Component Patterns (Svelte 5)

- **SSR guards**: Always wrap `window`/`document` access in `onMount` or check `typeof window !== 'undefined'`. See `NavBar.svelte` (scroll tracking), `MenuBar.svelte` (viewport width), `SidebarQuick.svelte` (scroll position).
- **NavBar architecture** (`src/components/navbar/`):
  - `NavBar.svelte`: Root component manages scroll visibility (hides on down-scroll), theme toggle via `helpers/theme.ts` (localStorage key: `vueuse-color-scheme`, sets `data-theme` on `<html>`). **Prefer callbacks over events** (`clickToggleCallback`, `onSearch` props).
  - `MenuBar.svelte`: Computes `isDesktop` from viewport width (`> 820px`) in `onMount` + resize listener; only renders nav links/dropdowns on desktop. Uses `{#each navLinks as ... (href)}`—ensure unique `href` keys.
  - `DropBox.svelte` + `DropBoxItem.svelte`: Hover timing (300ms delay for links, 100ms for submenus). Pass classes via `className` prop; spread `...$$restProps` for attributes.
- **Theme helpers** (`src/components/navbar/helpers/theme.ts`): Export `initTheme` (reads storage/system pref), `toggleTheme`, `applyTheme`. `ThemeMode` type union: `"light" | "dark"`.

## Styling & Icons (UnoCSS)

- **Presets**: `presetWind4` (Tailwind-like utilities), `presetIcons` (icon classes), `presetAttributify`, `transformerDirectives`.
- **Icon usage**: Class names like `i-ri-home-line` (Remix Icons via `@iconify-json/ri`). To prevent purging, add icons to `uno.config.ts` safelist by updating `theme.config.ts` nav/sidebar configs.
- **Gradient styles**: Dropdown items use gradient hover effects; see `DropBoxItem.svelte` for pattern.

## Local Toolkit Utilities (`src/toolkit/`)

- **Post helpers** (`posts/`):
  - `formatCategories`: Builds hierarchical category tree, sorts children by `length` descending, optional `depth` limit. Expects `{ _id, parent?, length, posts }`.
  - `structurePostsByDate`: Groups posts by year/month (set `daily: true` for day grouping). **Expects `date: Date`**—convert strings before calling.
  - `generateTagCloud`: Scales tag font/color using TinyColor between `minFontSize`/`maxFontSize` and `startColor`/`endColor`. Optional `limit` for top-N tags.
  - `calculateStats`, `randomPosts`: Word counting and random post selection utilities.
- **Tools** (`tools/`): `fmtNum` (number formatting), `generateRandomBrightColor` (HSL color generator).
- **Config helper** (`themeConfig.ts`): `defineConfig` function for type-safe theme configuration, `ShokaXThemeConfig` interface.

## Critical Gotchas

- **Date handling**: Content schema enforces Date objects with zod refine—parse ISO strings before passing to collection entries.
- **Icon safelisting**: Update `theme.config.ts` nav/sidebar configs → `uno.config.ts` auto-extracts icons → prevents UnoCSS purging.
- **SSR-safe code**: Always guard browser APIs (`window`, `document`, `localStorage`) with `onMount` or typeof checks—Astro SSR will error otherwise.
- **Responsive nav**: `MenuBar.svelte` only renders links on desktop (width > 820px); mobile uses sidebar/hamburger pattern.
- **Build sequence**: `build:site` → `build:index` (Pagefind) ensures search index includes rendered content.
