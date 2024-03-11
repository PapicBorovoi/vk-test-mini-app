import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from "@vkontakte/vk-mini-apps-router";

export const DEFAULT_ROOT = "default_root";

export const DEFAULT_VIEW = "default_view";

export const DEFAULT_VIEW_PANELS = {
  FIRST: "first",
  SECOND: "second",
} as const;

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.FIRST, "/", []),
      createPanel(
        DEFAULT_VIEW_PANELS.SECOND,
        `/${DEFAULT_VIEW_PANELS.SECOND}`,
        []
      ),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
