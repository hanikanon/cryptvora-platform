# Cryptvora — Unified Platform

This project merges four separate Lovable/TanStack Start exports into one
platform, using the Community Chat project's design system as the single
source of truth (colors, radius, shadows, glass, gradients).

## What came from where

| Source project | Became |
|---|---|
| `projet 1` (Landing) | Public marketing site — `src/routes/index.tsx` + `src/components/landing/Landing.tsx`. All "Sign in" / "Get started" CTAs now link straight to `/app` (no password gate, per request). |
| `Crypto 1` | Not used for merge — it turned out to be an earlier, near-duplicate copy of the same Landing page, with no dashboard/portfolio code inside it. If you have a separate zip that actually contains the trading dashboard, send it and I'll fold it in in place of the current `/app` overview. |
| `niveur` (badges + dashboard shell) | The whole authenticated app shell — `src/components/app-shell.tsx`, plus `/app` (overview), `/app/levels`, `/app/leaderboards`, `/app/risk`, `/app/profile`. The Portfolio-Level / Trader-Level badge system (`src/lib/tiers.ts`, `src/lib/badge-svg.tsx`, `src/components/tier-badge.tsx`) lives here and is now also wired into the Community profile card. |
| `dardacha` (Community Chat) | `/app/community`, and the **design system** in `src/styles.css` + every shared primitive in `src/components/ui/*`. |

## Structure

```
src/
  routes/
    __root.tsx        root shell, meta, ThemeProvider
    index.tsx          → public Landing page
    app/
      index.tsx         → dashboard overview
      community.tsx      → community chat
      levels.tsx, leaderboards.tsx, risk.tsx, profile.tsx
  components/
    ui/                 shared shadcn primitives (dardacha canonical)
    landing/Landing.tsx
    community/          Chrome, LeftSidebar, RightPanel, MessageList, Composer...
    app-shell.tsx, charts.tsx, level-cards.tsx, level-progress.tsx,
    risk-rules.tsx, tier-badge.tsx, unlock-celebration.tsx
  hooks/  use-mobile.tsx, use-theme.tsx
  lib/    utils.ts, i18n.tsx, tiers.ts, badge-svg.tsx
  styles.css            single design system, light + dark
public/
  logo.png              your owl mascot (used in the app header)
```

## Design system / theming

- All colors are CSS variables (`--background`, `--primary`, `--card`, etc.)
  consumed via Tailwind v4 `@theme inline`. Components never hardcode colors,
  so switching `:root` vs `.dark` re-themes the entire app — landing,
  dashboard, badges and chat all read from the same tokens.
- **Light mode** = dardacha's original clean white + purple.
- **Dark mode** (new, added here) uses the exact palette from your brief:
  `#0A0A0F` / `#111118` / `#17171F` / `#1D1D27` backgrounds, `#2A2A36`
  borders, and the `#C68AFB → #6F25E9` purple family for every accent
  (buttons, active tabs, ring, badges, glow).
- Toggle button lives in the dashboard header (`app-shell.tsx`, sun/moon
  icon) and persists to `localStorage` via `useTheme()`.

## Badge system

`src/lib/tiers.ts` (untouched from `niveur`) defines the 20-tier Capital and
Trader tracks; `TierBadge` renders them as animated inline SVG. It now shows
up in: Profile page, Leaderboards, dashboard overview, and the Community
Chat profile sheet (`components/community/panels.tsx`). Chat member lists
still keep their lightweight diamond/gold/silver ring — that's a separate,
lighter decoration dardacha already had for avatars in a tight list, and
removing it would strip working functionality, so it was left in place
alongside the full badge system rather than replacing it.

## Known gaps / next steps

- **No real auth** — `/app` is open, matching what you asked for (skip the
  password step). If you want a lightweight "enter your name" gate instead
  of nothing, say so.
- **`Crypto 1` dashboard content** — as noted above, the zip didn't actually
  contain it. Overview/portfolio/exchange-connection screens currently come
  from `niveur`'s dashboard shell. Send the real file if it exists elsewhere.
- I do not have network access in this environment, so I could not run
  `npm install` / `vite build` here to verify the build end-to-end. Every
  `@/...` import in the merged tree was checked against the actual file
  list and all resolve — but please run a build once locally and send me
  any error output if something doesn't compile.
- `routeTree.gen.ts` is intentionally **not** included — TanStack's router
  plugin regenerates it automatically the first time you run `dev` or
  `build`.

## Run it

```bash
npm install   # or: bun install
npm run dev   # or: bun run dev
```
