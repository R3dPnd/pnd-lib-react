# pnd-lib-react

Shared React components, hooks and two themes, arcade and glass, for PND
dashboards: endless-illusion (arcade: Silkscreen, the dann-of-thursday palette,
pixel frames, scanlines) and Akane (glass: frosted red-to-purple surfaces,
system sans).

## Install

Pin a tag as a git dependency. npm runs `prepare`, which builds `dist/`.

```json
"dependencies": {
  "pnd-lib-react": "github:R3dPnd/pnd-lib-react#v0.2.0"
}
```

Peer dependencies: `react` and `react-dom` 18.

Import the styles once, before the app's own CSS:

```ts
import "pnd-lib-react/styles.css"; // theme.css + components.css
import "./styles.css";
```

`theme.css` alone gives the tokens, fonts, base and pixel frames without the
component styles.

## What's in it

| Kind | Exports |
|------|---------|
| Components | `Button`, `Tabs`, `Segmented`, `Panel`, `Chip`, `Tag`, `EmptyState`, `Banner`, `StatusBadge`, `Timestamp`, `Avatar`, `TypingIndicator`, `CopyButton`, `Checkbox`, `Select`, `TextInput`, `TextField`, `DisplaySettings` (`showFont` prop hides the font picker) |
| Layout | `IconButton`, `Card`, `Meter`, `NavRail`, `NavRailItem` |
| Chat | `Spinner`, `ChatMessage`, `MessageList`, `ToolActivity`, `WorkingIndicator`, `Composer` |
| Hooks | `useLoad`, `useHashRoute`, `useDisplay`, `useNow` |
| Themes | `Theme`, `THEMES`, `resolveTheme`, `applyTheme` |
| Display prefs | `DisplayHost`, `localStorageHost`, `applySavedDisplay`, `resolve`, `sanitizePrefs`, … |
| Utilities | `getJson`, `postJson`, `fmtTime`, `relTime`, `meterTone`, `fmtElapsed`, `isNearBottom`, `isSendKey`, `hasNoChildren` |

`TextInput`, `TextField` and `Select` take an optional label.

## Themes

Two themes ship in the same `styles.css`. Arcade is the default and needs
nothing; glass is opt-in through `data-theme` on `<html>`:

```ts
import { applyTheme, resolveTheme } from "pnd-lib-react";

applyTheme(resolveTheme(config.theme)); // "glass" | "arcade"
```

`resolveTheme(value, fallback = "arcade")` maps any string (a config value, a
saved pref) to a known theme, so an old or empty name like `rose` falls back
instead of leaving the page unstyled. `applyTheme` sets `data-theme`. Every
glass rule is scoped to `[data-theme="glass"]`, so arcade looks the same
without it.

Glass tokens (set on `:root[data-theme="glass"]`):

| Token | Use |
|-------|-----|
| `--surface` | Panel and bubble fill, `rgba(255,255,255,.07)`. |
| `--surface-bar` | Bars and rails, `.04` fill. |
| `--surface-line` | 1px border of a surface. |
| `--blur` | `backdrop-filter` blur radius (10px). |
| `--radius`, `--radius-sm` | Panel/bubble (14px) and small-control (8px) corners. |
| `--accent` | Solid accent `#ff2d55`; `--accent-2` is `#8b2cf5`. |
| `--accent-grad` | `linear-gradient(135deg, #e11d48, #7c3aed)`, primary buttons. |
| `--ink`, `--muted`, `--placeholder` | Text colors. |
| `--tool-bg`, `--tool-ink` | Tool chip fill and text. |
| `--body-font`, `--mono` | System sans; mono only for code and logs. |

Status colors (`--green`, `--orange`, `--red`, `--violet`) keep their meanings
across themes.

`data-effects`: under glass, `reduced` and `off` set `--blur` to 0 and drop
shadows and glows; `off` also flattens the background gradient to a solid.
Browsers without `backdrop-filter` get opaque surfaces.

## Theming

Override these CSS custom properties; everything else derives from them.

| Token | Use |
|-------|-----|
| `--accent` | Live accent: primary button, active tab, focused input, field labels. Set it on a container to recolor everything inside. |
| `--edge` | Frame color of the element it's set on. |
| `--panel-accent` | A `.panel` heading's color. |
| `--who` | A person's/agent's color (`Avatar`, `TypingIndicator`, link buttons). |
| `--cyan` … `--blue` | The neon palette. `Chip`/`Tag` take these names as `tone`. |

Frame your own elements with `.pixel-frame` (or `.pixel-frame--sm`).

`useDisplay` / `applyResolved` set `data-density`, `data-effects`, `data-touch`,
`data-font` and `data-profile` on `<html>` and the UI scale as `--zoom`. Key
layout spacing off `--gap`, `--gap-sm`, `--pad`, `--app-py`, `--app-px` and
`--fs` so density works.

### Display host

`useDisplay(host)` needs to know where prefs live and who owns fullscreen:

```ts
// plain browser
export const displayHost = localStorageHost("myapp.display");

// desktop shell: supply load/save and, optionally, shell fullscreen
export const displayHost: DisplayHost = {
  isDesktop: true,
  load: () => window.__BOOT__.prefs,
  save: (prefs) => void fetch("/api/display-prefs", { method: "POST", body: JSON.stringify(prefs) }),
  fullscreen: { toggle: shell.toggleFullscreen, get: shell.isFullscreen },
};
```

Call `applySavedDisplay(displayHost)` in `main.tsx` before rendering so the
first paint already has the saved look.

## Develop

```bash
npm install
npm run typecheck
npm test
npm run build      # dist/
```

To try changes in an app before tagging, `npm install ../pnd-lib-react` there
(a `file:` link) and add `resolve: { dedupe: ["react", "react-dom"] }` to its
Vite config so the link doesn't load a second React. Switch back to the tagged
git dependency before committing the app.

## Releasing

Bump `version` in `package.json`, commit, tag `vX.Y.Z`, push the tag, then bump
the `#vX.Y.Z` in each app's `package.json` and reinstall.
