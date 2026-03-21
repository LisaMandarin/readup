---
name: theme-style
description: Apply the project's UI theme styling conventions by preferring Ant Design components + theme tokens. Use when generating or modifying frontend UI (React/TSX) so styling stays consistent; fall back to Tailwind utilities and the CSS variables defined in `frontend/src/index.css` when Ant Design equivalents are unavailable.
---

# Theme Style (Ant Design first, Tailwind fallback)

## Core rules
1. Prefer Ant Design for UI primitives (buttons, layout, menus, forms, cards, etc.).
2. When using Ant Design, prefer theme tokens over hard-coded colors:
   - Use `theme.useToken()` and read values like `colorBgContainer` from the token object.
   - When a component background/text needs project colors, derive them from Ant Design tokens or map to the project's CSS variables (see “Tailwind fallback”).
3. If an Ant Design component isn’t available/appropriate, use Tailwind utility classes, but do not hard-code arbitrary brand colors.
4. For brand colors and typography, use the CSS variables from `frontend/src/index.css`:
   - `--bg-main`, `--card-bg`, `--card-border`, `--text-main`, `--accent`, `--font-body`, `--font-heading`.

## Ant Design guidance (preferred path)
- Wrap the app (or the relevant subtree) with `ConfigProvider` when theme configuration is needed.
- Use Ant Design layout primitives (e.g., `Layout`, `Header`, `Content`, `Footer`) for page structure.
- For any “container” backgrounds (card/panel-like areas), prefer:
  - Ant token values (from `theme.useToken()`), or
  - CSS variables via inline `style` (only if a token doesn’t exist for the desired surface color).
- Avoid mixing Tailwind classes for the same visual purpose when an Ant Design prop/theme token can achieve it (prevents double-styling conflicts).

## Tailwind fallback guidance (when Ant Design isn’t used)
- Use Tailwind utilities for spacing, layout, typography sizing, and stateful UI.
- For brand colors/typography, use the CSS variables from `frontend/src/index.css` instead of hard-coded hex values:
  - Use `style={{ color: 'var(--text-main)' }}` / `style={{ background: 'var(--card-bg)' }}` / `style={{ borderColor: 'var(--card-border)' }}` where needed.
- Keep Tailwind usage “structural”:
  - spacing (`p-*`, `m-*`, `gap-*`), sizing (`max-w-*`, `w-*`), layout (`flex`, `items-*`, `justify-*`)
  - typography (`text-*`, `font-*`)
  - use `style` for the project’s exact colors/fonts via the CSS variables.

## Minimal example patterns
- Ant Design panel surface:
  - Read container bg from `theme.useToken()` and apply it to the panel `style`.
- Tailwind-only element with brand color:
  - Use Tailwind for layout classes and apply `style={{ background: 'var(--card-bg)' }}` (and/or `style={{ color: 'var(--text-main)' }}`) for exact project colors.

