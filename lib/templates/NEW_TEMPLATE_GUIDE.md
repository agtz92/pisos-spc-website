# How to Add a New Template

Complete handoff for adding a new template. Read every section before touching any file.
Last updated to reflect the full pipeline including module color wiring, score palettes, and template-specific chip styling.

---

## What a Template Is

A template is the outer shell of the public website: `<html>` wrapper, header, nav, footer, background decorations, and global CSS overrides. It does **not** own content — it wraps module pages (blog, recipes, etc.) rendered as `{children}`.

### What a template is NOT responsible for

Module pages (`blog`, `recipes`, `listings`, `products`, `reviews`) each have **multiple layout variants** the tenant picks from in CMS → Settings → Template → Content → Modules:

- `blog`: `editorial` · `list` · `macro` · `magazine` · `spotlight` · `stream`
- `recipes`: `category` · `editorial` · `grid` · `macro` · `timed` · `visual`
- `realestate`: `cards` · `compare` · `featured` · `feed` · `macro` · `neighborhood`
- `products`: `catalog` · `grid` · `lookbook` · `macro` · `quickShop` · `showcase`
- `reviews`: `byType` · `featured` · `grid` · `leaderboard` · `list` · `macro`

Components live in `website/components/<module>/<Module>Layout<Variant>.tsx` and the active variant is stored at `templateConfig.modules.<mod>.layout.variant`. The page (`app/<mod>/page.tsx`) does a `switch` on the variant and picks the right layout.

**A new template automatically inherits all variants** — the variants read `var(--template-*)` CSS variables, so they adapt to whatever shell wraps them. You do not need to modify `components/<module>/` when adding a template. Only revisit them if a variant breaks visually under your new template and the fix is template-specific (use `.<name>-shell [data-*]` scoped overrides in your GlobalStyles, not edits to the variant component).

---

## File Map — Everything You Will Touch

### Website (`website/`)

| File | What to do |
|------|-----------|
| `lib/templates/config.ts` | Interfaces, default config, palette tokens, score palettes |
| `lib/templates/<name>.tsx` | Layout component |
| `lib/templates/validate.ts` | **Read-only** — import `validateTemplateCssVars` + `TemplateCssVarMap` into your layout |
| `app/layout.tsx` | Import layout, add branch to template selector |
| `app/blog/page.tsx` | Already wires module colors via CSS vars — no change needed |
| `app/recipes/page.tsx` | Same |
| `app/products/page.tsx` | Same |
| `app/listings/page.tsx` | Same |
| `app/reviews/page.tsx` | Add new template branch to `baseScorePalettes` selector |

### CMS (`frontend/src/pages/settings/`)

> ⚠️ The old guide referenced `Settings.tsx` — that file has been split into these:

| File | What to do |
|------|-----------|
| `sections/TemplateSection.tsx` | Add template to the `templates` preview array |
| `constants/templateFields.ts` | Add to `TEMPLATE_COPY_FIELDS`, `TEMPLATE_COLOR_FIELDS`, `DEFAULT_NAV_LABELS` |
| `constants/templatePalettes.ts` | Add palette presets to `TEMPLATE_PALETTES` |
| `utils/colorUtils.ts` | Add branch to `deriveModuleColors` + `deriveScorePalettes` |

---

## Step 1 — `config.ts` (website)

### 1a. Add color, copy, layout interfaces

```ts
export interface MinimalTemplateColors {
  pageBackground: string;
  ink: string;
  mutedText: string;
  accent: string;
  panelBackground: string;
  mutedPanelBackground: string;
  panelBorder: string;
}

export interface MinimalTemplateCopy {
  footerTagline: string;
}

export interface MinimalTemplateLayout {
  navItems: Record<string, { label: string; href: string }>;
}

export interface MinimalTemplateConfig {
  colors: MinimalTemplateColors;
  copy: MinimalTemplateCopy;
  layout: MinimalTemplateLayout;
}
```

### 1b. Extend `TemplateConfigMap` and `TemplateName`

```ts
export interface TemplateConfigMap {
  modern: ModernTemplateConfig;
  retro: RetroTemplateConfig;
  futuristic: FuturisticTemplateConfig;
  executive: ExecutiveTemplateConfig;
  minimal: MinimalTemplateConfig; // ← add
}

export type TemplateName = 'modern' | 'retro' | 'futuristic' | 'executive' | 'minimal';
```

### 1c. Add raw palette tokens

```ts
colorPalettes.templateSpecific.minimal = {
  pageBackground: '#ffffff',
  ink: '#111827',
  accent: '#6366f1',
  // ...
}
```

> ⚠️ **Isolation rule.** Tokens under `colorPalettes.templateSpecific.<name>` must be referenced **only** from `templateConfigs.<name>` (and from your own template's files). Never import another template's bucket — e.g. do not write
> `accent: colorPalettes.templateSpecific.modern.accent` inside `templateConfigs.minimal`. Doing so couples the two templates: any future change to `modern` silently changes `minimal` as well. If you need the same hex, inline it or add a new shared token under `colorPalettes.global`.

### 1d. Add score palettes for reviews module

The reviews page picks a score palette base per template. Add yours under `colorPalettes.moduleStyleSpecific.reviews`:

```ts
minimalScorePalettes: {
  excellent: { background: '#00c875', text: '#001a0d', shadow: 'rgba(0,200,117,0.3)' },
  great:     { background: '#3dc45a', text: '#001a0d', shadow: 'rgba(61,196,90,0.28)' },
  good:      { background: '#66cc33', text: '#0d1a00', shadow: 'rgba(102,204,51,0.28)' },
  mixed:     { background: '#ffbd3f', text: '#1a1000', shadow: 'rgba(255,189,63,0.3)' },
  poor:      { background: '#ff614e', text: '#1a0400', shadow: 'rgba(255,97,78,0.3)' },
},
```

Choose colors that match your template's aesthetic:
- `retro`: muted earth tones — `#2a5e1f` green, `#9e5018` amber, `#8b2318` red
- `futuristic` (dark): neon — `#00c875`, `#00a8d4`, `#f03050`
- `executive`: muted professional — `#2a8a5a`, `#3d7ab5`, `#b03a3a`

### 1e. Wire score palettes into `app/reviews/page.tsx`

```ts
const baseScorePalettes =
  tenant?.template === 'retro'      ? colorPalettes.moduleStyleSpecific.reviews.retroScorePalettes :
  tenant?.template === 'futuristic' ? colorPalettes.moduleStyleSpecific.reviews.futuristicScorePalettes :
  tenant?.template === 'executive'  ? colorPalettes.moduleStyleSpecific.reviews.executiveScorePalettes :
  tenant?.template === 'minimal'    ? colorPalettes.moduleStyleSpecific.reviews.minimalScorePalettes :
  reviewsConfig.colors.scorePalettes;
```

### 1f. Add default config entry in `templateConfigs`

```ts
minimal: {
  colors: {
    pageBackground: colorPalettes.templateSpecific.minimal.pageBackground,
    ink: colorPalettes.templateSpecific.minimal.ink,
    // ...
  },
  copy: { footerTagline: 'A clean template.' },
  layout: {
    navItems: {
      blog:       { label: 'Blog',        href: '/blog' },
      recipes:    { label: 'Recipes',     href: '/recipes' },
      products:   { label: 'Products',    href: '/products' },
      realestate: { label: 'Real Estate', href: '/listings' },
      reviews:    { label: 'Reviews',     href: '/reviews' },
    },
  },
},
```

---

## Step 2 — Write the layout component (`lib/templates/minimal.tsx`)

### Required prop interface

```ts
interface TemplateLayoutProps {
  siteName: string;
  enabledModules: string[];
  savedConfig?: Record<string, unknown>;
  children: React.ReactNode;
}
```

### Required pattern

```tsx
import { validateTemplateCssVars, type TemplateCssVarMap } from '../validate';

export function MinimalLayout({ siteName, enabledModules, savedConfig, children }: TemplateLayoutProps) {
  const savedColors = (savedConfig?.colors ?? {}) as Partial<typeof minimalConfig.colors>
  const colors = { ...minimalConfig.colors, ...savedColors }
  // ↑ If your template derives some colors from others (e.g. mutedPanelBackground
  //   tinted from accent), DO NOT put that logic in config.ts — write a local
  //   `resolveMinimalColors(base, saved)` inside this file. See Step 2a below.

  const copy = { ...minimalConfig.copy, ...(savedConfig?.copy as Partial<typeof minimalConfig.copy> ?? {}) }

  const savedNavItems = ((savedConfig?.layout as Record<string, unknown> | undefined)?.navItems ?? {}) as Record<string, { label: string; href: string }>
  const navItems = enabledModules
    .map((key) => {
      const staticItem = minimalConfig.layout.navItems[key]
      if (!staticItem) return undefined
      const override = savedNavItems[key]
      return override?.label ? { ...staticItem, label: override.label } : staticItem
    })
    .filter((item): item is { label: string; href: string } => Boolean(item))

  // Required: every template sets exactly the 8 vars in TemplateCssVarMap.
  // TypeScript will complain if you miss one; validateTemplateCssVars will
  // warn in dev if any resolves to an empty string.
  const cssVars: TemplateCssVarMap = {
    '--template-accent':          colors.accent,
    '--template-accent-strong':   colors.accentStrong ?? colors.accent,
    '--template-ink':             colors.ink,
    '--template-muted-text':      colors.mutedText,
    '--template-panel':           colors.panelBackground,
    '--template-muted-panel':     colors.mutedPanelBackground,
    '--template-panel-border':    colors.panelBorder,
    '--template-text-on-accent':  colors.textOnAccent ?? '#ffffff',
  };
  validateTemplateCssVars('minimal', cssVars);

  return (
    <div
      className="minimal-shell min-h-full"
      style={{
        background: colors.pageBackground,
        color: colors.ink,
        ...(cssVars as React.CSSProperties),
      }}
    >
      <MinimalGlobalStyles colors={colors} />
      {/* header, nav */}
      <main>{children}</main>
      {/* footer */}
    </div>
  );
}
```

### Step 2a — (Optional) Runtime color derivation

If one of your colors is computed from another (instead of being a fixed token the user edits directly), write a local `resolve<Name>Colors` function **inside your template folder**, modeled after `modern/index.tsx:24-43`:

```ts
function resolveMinimalColors(
  base: MinimalTemplateColors,
  saved: Partial<MinimalTemplateColors>,
): MinimalTemplateColors {
  const merged = { ...base, ...saved }
  const acc = hexToRgb(merged.accent)
  if (!acc) return merged
  const { r, g, b } = acc

  // Only derive a field if the user didn't explicitly set it
  if (!saved.mutedPanelBackground)
    merged.mutedPanelBackground = `rgba(${r},${g},${b},0.05)`

  return merged
}
```

Then call it in the layout: `const colors = resolveMinimalColors(minimalConfig.colors, savedColors)`.

**Rules for runtime derivation:**
- Keep it pure — input → output, no side effects.
- Always gate derivation with `if (!saved.<field>)` — otherwise a user-edited value will be silently overwritten every render.
- Live in `lib/templates/<name>/index.tsx`. Never in `config.ts`, never shared with another template.
- If derivation depends on the accent being a valid `#rrggbb`, handle the parse-fail case (return `merged` unchanged, like `resolveModernColors` does).

Skip this step entirely if every color in your template is a direct token the user picks — most templates (`retro`, `executive`) have no derivation at all.

### The CSS variable contract — mandatory

Every template **must** set all 8 CSS variables. Module pages read these for their colors.

| Variable | Used by |
|----------|---------|
| `--template-accent` | Category labels, accent bars, CTAs, review type chips |
| `--template-accent-strong` | Hover states, gradients |
| `--template-ink` | Heading text, bold text |
| `--template-muted-text` | Dates, metadata, captions |
| `--template-panel` | Card/panel backgrounds |
| `--template-muted-panel` | Image placeholders, filter bars |
| `--template-panel-border` | Card borders, dividers |
| `--template-text-on-accent` | Text on accent-colored backgrounds |

### Global CSS overrides (`MinimalGlobalStyles`)

Write a `function MinimalGlobalStyles({ colors }: { colors: MinimalTemplateColors })` that returns a `<style>` tag. Minimum required selectors:

```css
/* Font */
.minimal-shell { font-family: ...; }

/* Headings */
.minimal-shell h1, .minimal-shell h2, .minimal-shell h3,
.minimal-shell h4, .minimal-shell h5, .minimal-shell h6 {
  color: ${colors.ink};
}

/* Prose links */
.minimal-shell .prose a { color: ${colors.accent}; }

/* Override Tailwind surface classes */
.minimal-shell [class*="bg-white"]     { background-color: ${colors.panelBackground} !important; }
.minimal-shell [class*="bg-gray-50"],
.minimal-shell [class*="bg-gray-100"]  { background-color: ${colors.mutedPanelBackground} !important; }
.minimal-shell [class*="border-gray-200"] { border-color: ${colors.panelBorder} !important; }
```

### Reviews-specific template chip and badge styling

Review type chips (e.g. MOVIE, MUSIC) and featured badges use `data-*` attributes. Each template's GlobalStyles **must** include overrides so they look native to the template, not just recolored.

```css
/* Type chip shape — adapts to template aesthetic */
.minimal-shell [data-review-type-chip] {
  border-radius: 4px;               /* 0 for retro, 2px for futuristic, 999px for modern */
  border: 1px solid currentColor;   /* retro uses 2px; futuristic adds box-shadow glow */
}

/* Featured badge — adapts to template aesthetic */
.minimal-shell [data-featured-badge] {
  border-radius: 4px;
  background: color-mix(in srgb, var(--template-accent) 12%, var(--template-panel, #fff));
  color: var(--template-accent);
  border: 1px solid color-mix(in srgb, var(--template-accent) 25%, transparent);
}
```

**Reference implementations per template:**
- `retro`: `border: 2px solid currentColor !important; border-radius: 0 !important;` — stamp look
- `futuristic`: thin border + `box-shadow: 0 0 6px color-mix(in srgb, currentColor 30%, transparent)` — glow
- `executive`: `border-radius: 3px` — subtle professional
- `modern`: rounded pill, soft gradient background

---

## Step 3 — Register in `app/layout.tsx`

```ts
import { MinimalLayout } from '@/lib/templates/minimal';

// inside RootLayout:
if (template === 'retro') {
  TemplateLayout = RetroLayout;
} else if (template === 'futuristic') {
  TemplateLayout = FuturisticLayout;
} else if (template === 'executive') {
  TemplateLayout = ExecutiveLayout;
} else if (template === 'minimal') {  // ← add
  TemplateLayout = MinimalLayout;
} else {
  TemplateLayout = ModernLayout;
}
```

No backend changes needed — Django stores `template` as a free string.

---

## Step 4 — CMS: `TemplateSection.tsx`

Add to the `templates` preview array:

```ts
{
  id: 'minimal',
  label: 'Minimal',
  description: 'Clean and simple with maximum readability',
  preview: (
    <svg viewBox="0 0 160 100" className="w-full h-full" aria-hidden>
      {/* SVG thumbnail */}
    </svg>
  ),
},
```

---

## Step 5 — CMS: `templateFields.ts`

### 5a. `TEMPLATE_COPY_FIELDS`

```ts
minimal: [
  { key: 'footerTagline', label: 'Footer Tagline', placeholder: 'A clean template.' },
],
```

### 5b. `TEMPLATE_COLOR_FIELDS`

```ts
minimal: [
  { key: 'accent',               label: 'Accent',           defaultHex: '#6366f1' },
  { key: 'pageBackground',       label: 'Page Background',  defaultHex: '#ffffff' },
  { key: 'ink',                  label: 'Text',             defaultHex: '#111827' },
  { key: 'mutedText',            label: 'Muted Text',       defaultHex: '#6b7280' },
  { key: 'panelBackground',      label: 'Panel BG',         defaultHex: '#ffffff' },
  { key: 'mutedPanelBackground', label: 'Muted Panel BG',   defaultHex: '#f9fafb' },
  { key: 'panelBorder',          label: 'Panel Border',     defaultHex: '#e5e7eb' },
],
```

> **`defaultHex` must match `config.ts` defaults exactly.** This is what the CMS shows as the placeholder color and what the reset button restores to. A mismatch makes the CMS look disconnected from what the website renders.

### 5c. `DEFAULT_NAV_LABELS`

```ts
minimal: {
  blog: 'Blog', recipes: 'Recipes', products: 'Products',
  realestate: 'Real Estate', reviews: 'Reviews', landingpage: 'Landing Pages',
},
```

---

## Step 6 — CMS: `templatePalettes.ts`

Add at least 3 presets:

```ts
minimal: [
  {
    id: 'indigo',
    name: 'Indigo',
    previewColors: ['#6366f1', '#e0e7ff', '#4338ca', '#ffffff'],
    colors: {
      accent: '#6366f1', accentStrong: '#4338ca',
      pageBackground: '#ffffff', ink: '#111827',
      mutedText: '#6b7280', panelBackground: '#ffffff',
      mutedPanelBackground: '#f5f3ff', panelBorder: '#e5e7eb',
    },
  },
],
```

---

## Step 7 — CMS: `colorUtils.ts`

### 7a. Add a branch to `deriveModuleColors`

This runs when a palette preset is selected. It writes module color overrides into the CMS draft, including type chip colors and score palettes.

```ts
} else if (template === 'minimal') {
  const accent       = paletteColors.accent          ?? '#6366f1'
  const accentStrong = paletteColors.accentStrong    ?? accent
  const accentSoft   = paletteColors.accentSoft      ?? lightenHex(accent, 0.7)
  const ink          = paletteColors.ink             ?? '#111827'
  const panelBg      = paletteColors.panelBackground ?? '#ffffff'
  const panelBorder  = panelBg === '#ffffff' ? '#e5e7eb' : 'rgba(0,0,0,0.08)'
  const base = { accent, ink, panelBackground: panelBg, panelBorder }
  mods.blog       = base
  mods.recipes    = base
  mods.products   = base
  mods.realestate = base
  mods.reviews    = {
    ...base,
    railBorder:        accentSoft,
    featuredBadgeText: accentStrong,
    ...flattenTypeStyles(deriveReviewTypeStyles(paletteColors, template)),
    ...flattenScorePalettes(deriveScorePalettes(paletteColors, template)),
  }
}
```

### 7b. Add a branch to `deriveScorePalettes`

```ts
if (template === 'minimal') {
  // modern defaults work for a clean template
  return {
    excellent: { background: '#00c875', text: '#001a0d' },
    great:     { background: '#3dc45a', text: '#001a0d' },
    good:      { background: '#66cc33', text: '#0d1a00' },
    mixed:     { background: '#ffbd3f', text: '#1a1000' },
    poor:      { background: '#ff614e', text: '#1a0400' },
  }
}
```

---

## ⚠️ Module Overrides Are Tenant-Wide, Not Per-Template

Before reading the pipeline, internalize this constraint:

```
templateConfig = {
  modern:     { colors, copy, layout }   ← per-template
  retro:      { colors, copy, layout }   ← per-template
  futuristic: { colors, copy, layout }   ← per-template
  executive:  { colors, copy, layout }   ← per-template
  minimal:    { colors, copy, layout }   ← per-template
  modules: {                              ← ⚠️ NOT per-template
    blog:    { colors, copy, layout }
    reviews: { colors, copy, layout }
    ...
  }
}
```

**Implication for your new template:**

If a user previously customized module colors while on `modern` (say they set `reviews.scorePalettes.excellent.background` to pink), then switches to `minimal`, **those overrides will still apply**. The reviews page merges `savedMod.colors` on top of your template-aware `baseScorePalettes`, regardless of which template is active.

### When designing a new template, choose one of two strategies:

**Strategy A — Adapt to pre-existing module overrides** *(default, recommended)*
Design your template so it looks acceptable even when a user has stale module overrides from a different template. This means:
- Use `var(--template-accent)` etc. as module defaults so any `accent` override the user set remains the accent.
- Score palettes: provide a `<name>ScorePalettes` that looks good *as a fallback*, but assume users may have saved their own palette from a previous template.
- Do not rely on a specific `reviews.typeStyles` shape — the user may have one.

**Strategy B — Namespace your module needs under the template block**
If your template genuinely cannot render with another template's saved module overrides (e.g. a print-style template that needs specific hex values for legibility), save those overrides under `templateConfig.<name>.modules` instead of the shared `templateConfig.modules`. This requires:
- Extending the page-level read in `app/<mod>/page.tsx` to check `templateConfig[template]?.modules?.[mod]?.colors` first, fall back to `templateConfig.modules.[mod].colors`.
- Extending the CMS save path in `TemplateSection.tsx` to write to the template-scoped location when your template is active.
- This is a larger change — only do it if Strategy A is genuinely insufficient.

**Default guidance:** start with Strategy A. Every current template (`modern`, `retro`, `futuristic`, `executive`) uses Strategy A. Only escalate if you hit a real visual breakage you cannot solve with CSS-var fallbacks.

---

## How Module Color Overrides Flow

This is the **full pipeline** from CMS save to rendered pixel. Understanding this prevents bugs.

```
User saves module color in CMS
  → draftToNestedColors(draft, MODULE_COLOR_FIELDS['reviews'])
  → { scorePalettes: { excellent: { background: '#00c875', text: '#001a0d' } }, typeStyles: { movie: { bg: '...', text: '...' } }, ... }
  → saved to backend as module.colors JSON

page.tsx (website) reads tenant.templateConfig.modules.reviews.colors
  → merges savedColors over template-aware base (retroScorePalettes / futuristicScorePalettes / etc.)
  → builds mergedColors object
  → sets --template-accent etc. on wrapper div (for reviews, passes full colors prop to layout)

For basic modules (blog, recipes, products, listings):
  → reads savedColors from savedMod.colors
  → builds moduleStyle with --template-accent, --template-ink, --template-panel, --template-panel-border
  → wraps layout in <div style={moduleStyle}>
  → layout components already use var(--template-accent) etc. — they automatically pick up the overrides

For reviews (complex module):
  → merges type styles, score palettes, badge text
  → passes full colors object as prop to layout component
  → layout uses colors.scorePalettes[tier].background etc. directly
```

### Basic module page pattern (blog, recipes, products, listings)

```ts
const savedColors = (savedMod.colors ?? {}) as Record<string, unknown>
const moduleStyle = {
  ...(savedColors.accent          ? { '--template-accent':       savedColors.accent }          : {}),
  ...(savedColors.ink             ? { '--template-ink':          savedColors.ink }             : {}),
  ...(savedColors.panelBackground ? { '--template-panel':        savedColors.panelBackground } : {}),
  ...(savedColors.panelBorder     ? { '--template-panel-border': savedColors.panelBorder }     : {}),
} as Record<string, string>

return <div style={moduleStyle}>{layout}</div>
```

The CSS vars only override when a value is saved — otherwise template globals remain in effect.

---

## Verification Tools

Two automated checks cover bug classes TypeScript cannot see because the CMS (`frontend/`) and the website (`website/`) are separate packages that share no imports.

### 1. Runtime CSS-var validator (dev mode)

`website/lib/templates/validate.ts` exports:

- `REQUIRED_TEMPLATE_CSS_VARS` — the 8 variables every template must set
- `TemplateCssVarMap` — type alias; use it to type the CSS-var object in your layout so TypeScript catches missing keys at compile time
- `validateTemplateCssVars(templateName, cssVars)` — dev-only runtime check that `console.warn`s if any variable resolves to an empty string

Both are shown in the Required pattern above. Do not skip them.

### 2. CMS ↔ website contract check (static)

Run from the repo root:

```bash
node scripts/check-template-contract.mjs
```

Detects:
- CMS fields saving to keys the site ignores (silent no-op for users)
- `defaultHex` placeholder in CMS disagreeing with the site's actual default
- Cross-template coupling (e.g. `templateConfigs.minimal` referencing `colorPalettes.templateSpecific.modern`)
- Copy fields declared in CMS that don't render anywhere

Exit code 0 = clean, 1 = errors, 2 = script setup problem. Run it after every template change before committing. Warnings are acceptable for intentionally-derived colors; errors always need fixing.

---

## Checklist Before Finishing

**`website/lib/templates/config.ts`**
- [ ] Color/copy/layout interfaces defined
- [ ] `TemplateConfigMap` and `TemplateName` updated
- [ ] Raw palette tokens added to `colorPalettes.templateSpecific.<name>`
- [ ] Score palettes added to `colorPalettes.moduleStyleSpecific.reviews.<name>ScorePalettes`
- [ ] Default config entry added to `templateConfigs`

**`website/lib/templates/<name>.tsx`**
- [ ] Exports `<Name>Layout` with correct prop interface
- [ ] Builds a `TemplateCssVarMap` const with all 8 required variables; TypeScript enforces completeness
- [ ] Calls `validateTemplateCssVars('<name>', cssVars)` right before returning JSX
- [ ] If template derives colors at runtime: `resolve<Name>Colors` lives in this file (not `config.ts`), is pure, and gates each derived field with `if (!saved.<field>)`
- [ ] `MinimalGlobalStyles` covers: headings, prose links, bg-white, bg-gray-50, border-gray-200
- [ ] `[data-review-type-chip]` style defined (shape, border treatment)
- [ ] `[data-featured-badge]` style defined
- [ ] Template looks acceptable with pre-existing `templateConfig.modules.*` overrides from other templates (Strategy A) — or intentionally implements Strategy B

**Tokens isolation**
- [ ] No reference to `colorPalettes.templateSpecific.<other>` anywhere in this template
- [ ] Shared hexes used by multiple templates either inlined or promoted to `colorPalettes.global`

**Automated verification**
- [ ] `node scripts/check-template-contract.mjs` exits 0 (no errors). Warnings are acceptable for intentionally-derived values.

**`website/app/layout.tsx`**
- [ ] New layout imported and wired into template selector

**`website/app/reviews/page.tsx`**
- [ ] New template branch added to `baseScorePalettes` selector

**CMS: `TemplateSection.tsx`**
- [ ] Template added to `templates` preview array with SVG thumbnail

**CMS: `templateFields.ts`**
- [ ] `TEMPLATE_COPY_FIELDS` entry added
- [ ] `TEMPLATE_COLOR_FIELDS` entry added — `defaultHex` values must match `config.ts` defaults exactly
- [ ] `DEFAULT_NAV_LABELS` entry added

**CMS: `templatePalettes.ts`**
- [ ] At least 3 palette presets added

**CMS: `colorUtils.ts`**
- [ ] Branch added to `deriveModuleColors` with `flattenTypeStyles` + `flattenScorePalettes`
- [ ] Branch added to `deriveScorePalettes`

---

## Common Mistakes

**`defaultHex` in `MODULE_COLOR_FIELDS` doesn't match `config.ts` defaults.**
The CMS uses `defaultHex` as the placeholder color and reset value. If it doesn't match what the website actually renders for that field, the CMS looks disconnected even though the pipeline is correct. Always copy the exact hex from `config.ts`.

**Score palettes not added to `config.ts` or `reviews/page.tsx`.**
If you skip Step 1d/1e, the reviews module falls back to `modern` score colors (bright green/yellow/red) regardless of your template. For a dark template this looks completely wrong.

**No `[data-review-type-chip]` rule in GlobalStyles.**
Without this, chips use the default 1px alpha-opacity border that looks modern/soft on every template. Retro needs a 2px solid border, futuristic needs a glow. Always add this rule scoped to `.<name>-shell`.

**Module page colors not wired.**
All 5 module pages (`blog`, `recipes`, `products`, `listings`, `reviews`) must either wrap layouts in a `<div style={moduleStyle}>` or pass a `colors` prop. Currently blog/recipes/products/listings use the CSS var wrapper approach; reviews uses a `colors` prop. Don't mix these up.

**Using `getTemplateConfig('name').colors` in component JSX.**
This is frozen at build time and ignores saved user overrides. Always use the merged `colors` local variable computed from `{ ...defaults, ...savedColors }`.

**Using Tailwind `dark:` variants.**
The site does not use a `dark` class. Theming is entirely via CSS variables on the shell div. Use `var(--template-panel)` instead of `dark:bg-gray-900`.

**Missing CSS variable causes silent fallback.**
If `--template-panel-border` is not set, components fall back to `#e5e7eb`. It will look wrong but won't error. Check all 8 vars are set.

**Referencing another template's tokens from your config.**
Writing `colorPalettes.templateSpecific.modern.accent` inside `templateConfigs.minimal` couples the templates — a future change to `modern`'s accent will silently change `minimal` too. Use your own bucket or promote the value to `colorPalettes.global`.

**Putting runtime derivation in `config.ts`.**
`config.ts` is a frozen constant — it cannot read saved user colors. If your template needs derived colors (like `modern` computes tinted `mutedPanelBackground` from `accent`), the logic must live in a local function in `lib/templates/<name>/index.tsx`. Defining it in `config.ts` means it always runs on defaults, never on user overrides.

**Assuming module overrides reset when the user switches templates.**
`templateConfig.modules.*` is shared across all templates for the tenant. A user who customized reviews colors in `modern` and then switches to your new template will still carry those overrides. Either design your template to tolerate arbitrary module overrides (Strategy A) or adopt the namespaced `templateConfig.<name>.modules` approach (Strategy B) — do not assume a clean slate.
