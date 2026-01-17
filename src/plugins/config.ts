import type { PluginManifest } from "./plugin";

export interface Plugin<O> {
  plugin: (options: O) => PluginManifest;
  options: O;
}

export function definePlugin<O>(plugin: Plugin<O>): Plugin<O> {
  return plugin;
}

export type injectPoint =
  | "head"
  | "layout"
  | "right-nav"
  | "left-nav"
  | "post-meta"
  | "sidebar"
  | "footer"
  | "widgets"
  | "post-footer"
  | "comment"
  | "footer-status"
  | "toolbar"
  | "segments-sticky";

export type injectPoints = Record<string, string> & Partial<Record<injectPoint, string>>;

export interface HyacinePluginSystemConfig {
  injectPoints: injectPoints;
  plugins: Plugin<unknown>[];
}

export function defineConfig(config: HyacinePluginSystemConfig): HyacinePluginSystemConfig {
  return config;
}
