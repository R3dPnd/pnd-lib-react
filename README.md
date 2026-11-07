# pnd-lib-react

Shared React components, hooks and the arcade neon theme (Silkscreen + the
dann-of-thursday palette, pixel frames, scanlines) for PND dashboards:
endless-illusion today, Akane (pnd-mcp `ui/`) next.

## Install

Pin a tag as a git dependency. npm runs `prepare`, which builds `dist/`.

```json
"dependencies": {
  "pnd-lib-react": "github:R3dPnd/pnd-lib-react#v0.1.0"
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
| Components | `Button`, `Tabs`, `Segmented`, `Panel`, `Chip`, `Tag`, `EmptyState`, `Banner`, `StatusBadge`, `Timestamp`, `Avatar`, `TypingIndicator`, `CopyButton`, `Checkbox`, `Select`, `TextInput`, `TextField`, `DisplaySettings` |
| Hooks | `useLoad`, `useHashRoute`, `useDisplay` |
| Display prefs | `DisplayHost`, `localStorageHost`, `applySavedDisplay`, `resolve`, `sanitizePrefs`, … |
| Utilities | `getJson`, `postJson`, `fmtTime`, `relTime` |

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
