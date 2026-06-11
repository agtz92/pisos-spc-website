# How to Safely Modify an Existing Template

Complement to `NEW_TEMPLATE_GUIDE.md`. That guide covers **adding** a template; this one covers **changing** an existing one (`modern`, `retro`, `futuristic`, `executive`) without breaking the others.

Read this whenever you are about to change colors, copy, layout, global CSS, or component behavior inside a template's folder or its CMS registries.

> **CMS ↔ website coupling.** Many template fields are editable from the CMS (`frontend/`) and rendered from the website (`website/`). The two packages share no type imports, so TypeScript cannot catch a mismatch between `TEMPLATE_COLOR_FIELDS.<name>` and `templateConfigs.<name>.colors`. Whenever you modify one side, run `node scripts/check-template-contract.mjs` (see "Verification Ritual" below) — the script surfaces every silent mismatch.

---

## The Isolation Contract

Every template is guaranteed not to affect the others **as long as** all changes stay inside these lanes:

| Lane | What lives here | Scoped by |
|------|-----------------|-----------|
| **Shell CSS** | `website/lib/templates/<name>/*GlobalStyles.tsx` | `.<name>-shell` class prefix |
| **Shell components** | `website/lib/templates/<name>/*.tsx` | Imported only from `website/lib/templates/<name>/index.tsx` |
| **Raw tokens** | `colorPalettes.templateSpecific.<name>` in `config.ts` | Referenced only from `templateConfigs.<name>` |
| **Template config defaults** | `templateConfigs.<name>` in `config.ts` | Read only by `<Name>Layout` via `getTemplateConfig('<name>')` |
| **Per-template score palettes** | `colorPalettes.moduleStyleSpecific.reviews.<name>ScorePalettes` | Selected by `app/reviews/page.tsx` per `tenant.template` |
| **CMS registries** | Entries keyed by template ID in `TEMPLATE_COPY_FIELDS`, `TEMPLATE_COLOR_FIELDS`, `TEMPLATE_PALETTES`, `TEMPLATE_BG_ADORNMENTS`, `DEFAULT_NAV_LABELS` | `Record<string, …>` — your entry is independent |
| **Runtime selector branch** | `app/layout.tsx` + `app/reviews/page.tsx` | Additive `if` branches |
| **Derivation branch** | `deriveModuleColors` + `deriveScorePalettes` in `colorUtils.ts` | Additive `if (template === '<name>')` |
| **Saved user data** | `Tenant.template_config[<name>]` JSON block | One block per template ID |

If every change stays inside the lane for template `X`, templates `Y` and `Z` cannot be affected — guaranteed by the class scoping and the runtime selector.

---

## Shared Surfaces (do NOT touch without intent)

These are the only places where a careless edit **will** leak across templates:

### 1. `colorPalettes.global` (`config.ts`)
Changing `#ffffff`, `ink`, `borderSoft`, etc. reflows every module card in every template.
**Rule:** never edit these to fix a single-template issue. Instead, add a token inside `colorPalettes.templateSpecific.<name>` and reference it only from that template's config.

### 2. `colorPalettes.moduleSpecific.editorialAccent` (`config.ts`)
This is the red (`#e5201b`) that `blog` and `recipes` default to on **every** template.
**Rule:** if you want to recolor blog/recipes for just one template, override `moduleConfigs.<mod>.colors.accent` in-line inside that template's layout via the CSS-var wrapper — or better, let the user do it via the CMS module-color section.

### 3. `moduleConfigs.<mod>` (`config.ts`)
The `blog`, `recipes`, `realestate`, `products`, `reviews` entries are **shared** across all templates. They supply the fallback grid classes, empty-state copy, default card radii, etc.
**Rule:** only modify these when the change is intended for all templates. Template-specific behavior must go in the template's shell CSS (`*GlobalStyles.tsx`) or the module page's wrapper (which reads `var(--template-*)`).

### 4. `Tenant.template_config.modules.<mod>` (user-saved JSON)
⚠️ **This key is tenant-wide, not per-template.** If a user customizes "Blog accent" while on `modern` and then switches to `retro`, those overrides persist and will apply to `retro` too.
**Rule:** never design a template under the assumption that module overrides are clean slate. Use `var(--template-accent)` defaults that look acceptable even when a user has a saved module accent.

### 5. Shared card components (`website/components/PostCard.tsx`, `RecipeCard.tsx`, …)
They render inside every template and read `var(--template-*)`. Adding a hardcoded hex here breaks isolation for all templates at once.
**Rule:** if you need template-specific styling in a shared card, add it as a `.<name>-shell [data-post-card] { … }` rule in that template's `*GlobalStyles.tsx`. Do not branch inside the component file.

### 6. The 8 required CSS variables
`--template-accent`, `--template-accent-strong`, `--template-ink`, `--template-muted-text`, `--template-panel`, `--template-muted-panel`, `--template-panel-border`, `--template-text-on-accent`.
**Rule:** never remove, rename, or omit one. Shared cards depend on them; missing vars fall back silently to incorrect defaults (`#e5e7eb` etc.) and the bug can ship without erroring.

> **Per-template divergence is allowed — don't "fix" it by adding CMS fields.**
> A template may *derive* a var instead of exposing an editable color. Example:
> `futuristic/index.tsx` sets `--template-text-on-accent` from `colors.ink` and
> has no `footerMeta` var, so futuristic intentionally has NO `textOnAccent` /
> `footerMeta` entries in `TEMPLATE_COLOR_FIELDS.futuristic`. The rule: a CMS
> color field must exist only if `templateConfigs.<name>.colors` actually carries
> that key — otherwise `check-template-contract.mjs` errors ("CMS saves a value
> the site ignores"). To make a derived var editable, wire the template to read
> `colors.<key>` first, THEN add the CMS field.

---

## What Kind of Change Goes Where

Use this as a routing table.

| You want to change… | Edit this | Do NOT edit this |
|---|---|---|
| A color in `modern` only | `colorPalettes.templateSpecific.modern.*` + `TEMPLATE_COLOR_FIELDS.modern` (keep `defaultHex` in sync) | `colorPalettes.global`, other templates |
| A color everyone shares | `colorPalettes.global.*` | *(only do this intentionally — affects all 4)* |
| Default copy text in `retro` header | `templateConfigs.retro.copy` + `TEMPLATE_COPY_FIELDS.retro` placeholder | Other templates' copy |
| Nav label shown only in `futuristic` | `templateConfigs.futuristic.layout.navItems` + `DEFAULT_NAV_LABELS.futuristic` | Other nav blocks |
| Font or heading style in `retro` | `.retro-shell h1 { … }` in `RetroGlobalStyles.tsx` | Any non-`.retro-shell`-prefixed selector |
| Review chip look in `executive` | `.executive-shell [data-review-type-chip] { … }` | Chip CSS in `ReviewCard.tsx` |
| Add a new background adornment for `modern` | `TEMPLATE_BG_ADORNMENTS.modern` + branch inside `ModernGridBackground.tsx` (or sibling adornment file) | Other templates' adornments |
| Add a new color preset for `retro` | `TEMPLATE_PALETTES.retro` array + maybe extend `deriveModuleColors`' `retro` branch | Other templates' presets |
| Change score palette for `futuristic` reviews | `colorPalettes.moduleStyleSpecific.reviews.futuristicScorePalettes` + the corresponding `template === 'futuristic'` branch in `deriveScorePalettes` | `modernScorePalettes` / default object |
| Add a layout variant (e.g. `blog`: new `'spotlight'`) | `website/components/blog/BlogLayoutSpotlight.tsx` + option in `MODULE_LAYOUT_FIELDS.blog` + switch case in `app/blog/page.tsx` | Any template folder |
| Change how `modern` derives `mutedPanelBackground` from `accent` | `resolveModernColors` in `modern/index.tsx` | Other templates' layouts |

---

## Change-Type Checklists

### A. Changing a color only in one template

1. Pick the right token bucket:
   - If the color is reused by several fields in the template → `colorPalettes.templateSpecific.<name>.<token>`
   - If it is one-off → inline in `templateConfigs.<name>.colors`
2. Update `TEMPLATE_COLOR_FIELDS.<name>` `defaultHex` **to the exact same hex** (CMS placeholders and reset values read this).
3. If the template has a runtime derivation (e.g. `resolveModernColors`), re-check that the derived values still look right with the new base.
4. If the color participates in a palette preset (`TEMPLATE_PALETTES.<name>`), update any preset where that color is listed as the "default" variant. Users who applied other presets are unaffected.
5. If reviews uses this color indirectly (score palettes / type chips), confirm `deriveScorePalettes(template)` and `deriveReviewTypeStyles(template)` still produce reasonable output.
6. Verify: nothing outside `website/lib/templates/<name>/` or `frontend/src/pages/settings/constants/templateFields.ts#<name>` was edited.

### B. Changing CSS in one template

1. Edit only `website/lib/templates/<name>/<Name>GlobalStyles.tsx`.
2. Every selector you add/modify **must** be prefixed with `.<name>-shell`. Example: `.retro-shell article { … }`, **not** `article { … }`.
3. If a shared component (e.g. `PostCard`) needs a different look in this template, style it via attribute selectors under `.<name>-shell`:
   ```css
   .retro-shell [data-post-card] { border-radius: 0; border: 2px solid ${colors.panelBorder}; }
   ```
4. Never add `!important` rules that target bare element selectors (`article`, `section`, `h1`) — they will leak to any nested iframe or portal.
5. Verify: load the other 3 templates locally, confirm no visual diff.

### C. Changing copy defaults in one template

1. Edit `templateConfigs.<name>.copy` in `config.ts`.
2. Update the matching `placeholder` in `TEMPLATE_COPY_FIELDS.<name>` so the CMS shows the new default when the field is empty.
3. Do not remove copy keys that users may have already saved — the merge `{ ...defaults, ...saved }` will drop unknown keys gracefully, but old CMS drafts may contain orphaned keys. Safe to leave.
4. If adding a new copy key, also add an entry to `TEMPLATE_COPY_FIELDS.<name>` or it cannot be edited from the CMS.

### D. Changing the layout structure (header/footer/nav) of one template

1. Edit only files inside `website/lib/templates/<name>/`.
2. Keep the `TemplateLayoutProps` signature identical — `{ siteName, enabledModules, savedConfig, children }` is a shared contract in `app/layout.tsx`.
3. Keep the **8 required CSS variables** set on the root `<div>`. Removing one silently breaks every module card.
4. If you add a new `savedConfig` consumer key, also add a CMS field for it — otherwise users can never set it.
5. Do not touch `app/layout.tsx` unless you are adding/removing a template (changing the branch selector for an existing one will affect everyone).

### E. Changing a palette preset

1. Edit the entry in `TEMPLATE_PALETTES.<name>` in `frontend/src/pages/settings/constants/templatePalettes.ts`.
2. `previewColors` is decorative — only the 4 swatches in the CMS. `colors` is what actually gets applied when the user clicks the preset.
3. If the preset changes the `accent` or `ink`, verify `deriveModuleColors(<name>)` still produces readable module colors for that preset (contrast on cards, review chips).
4. Existing users who already applied this preset will **not** be re-applied automatically; their saved colors stay. Only new clicks use the updated values.

### F. Changing derivation logic (`resolveModernColors`, `deriveModuleColors`, `deriveScorePalettes`)

Highest-risk change — runs at save time in the CMS and at render time on the website.

1. Keep the function pure (no side effects, input → output).
2. Keep every branch guarded by `if (template === '<name>')` — do not move shared code to the top level unless it is truly shared.
3. Return the same shape as before. Missing keys silently fall through to CSS fallbacks.
4. If you add a new derived field, confirm every template branch sets it (or is OK with `undefined`).
5. Manually test every palette preset of every template after the change. One-minute spot check per template.

---

## Mental Model of the Blast Radius

When you change something in template `X`, ask this sequence:

```
1. Does the file name contain "X" or the folder is templates/X/ ?
     YES → edit freely, isolation guaranteed by class scoping.
     NO  → go to 2.

2. Is this a Record<TemplateName, …> where I'm only touching my key?
     YES → safe. Other keys unaffected.
     NO  → go to 3.

3. Is this an `if (template === 'X')` branch I'm modifying?
     YES → safe. Other branches unaffected.
     NO  → go to 4.

4. ⚠️ STOP. This edit will affect other templates. Either:
     - move the change into one of the isolated lanes above, or
     - acknowledge the cross-template impact and verify each template.
```

---

## Verification Ritual After Any Template Change

### Automated (mandatory, run first)

```bash
# 1. Contract check between CMS fields and website config
node scripts/check-template-contract.mjs

# 2. Type check both packages
pnpm -C website build      # or `next build` — surfaces TS errors
pnpm -C frontend build     # vite build runs tsc
```

The contract script (`scripts/check-template-contract.mjs`) catches the 4 silent-failure classes that TypeScript can't see across the two packages:
- Keys declared in `TEMPLATE_COLOR_FIELDS.<name>` missing from `templateConfigs.<name>.colors`
- `defaultHex` mismatches between CMS and site defaults
- Cross-template coupling (`templateConfigs.X` referencing `colorPalettes.templateSpecific.Y`)
- Copy fields saved by CMS but never rendered

Exit code 0 = clean. Warnings are acceptable for runtime-derived colors (e.g. modern's `panelBackground` resolves from accent). Errors always need fixing.

### Runtime (dev mode)

Every template layout calls `validateTemplateCssVars(...)` from `website/lib/templates/validate.ts`. If your change accidentally drops one of the 8 required CSS vars, the browser/server console warns on every render in dev. No-op in production.

### Visual (still necessary)

Automation cannot see visual regressions. Minimum spot check before committing:

1. **Switch templates in the CMS** — open each template's settings panel, confirm no fields are missing or mis-defaulted.
2. **Visit the public site** with `tenant.template` set to each of the 4 values — load `/blog`, `/recipes`, `/listings`, `/products`, `/reviews`, and one landing page if present.
3. **Apply a non-default palette preset** for the template you changed, save, reload the public site — confirm colors propagate and the 3 **other** templates still render with their defaults.

If your change touched `colorPalettes.global`, `moduleSpecific`, or `moduleConfigs`, **all 4 templates** need the visual check, not just the one you edited.

---

## Common Anti-Patterns (do not do these)

1. **Adding a bare-element CSS rule in a `*GlobalStyles.tsx`.**
   ```css
   /* ❌ leaks to every template because there's no .retro-shell prefix */
   h1 { letter-spacing: 0.1em; }
   ```
   Prefix it: `.retro-shell h1 { … }`.

2. **Branching inside a shared component.**
   ```tsx
   // ❌ PostCard should not know about templates
   <article className={template === 'retro' ? 'border-4' : 'border'}>
   ```
   Style it from the template's `*GlobalStyles.tsx` via a data attribute or scoped selector.

3. **Modifying a shared token to fix a single-template bug.**
   ```ts
   // ❌ this changes blog + recipes everywhere
   colorPalettes.moduleSpecific.editorialAccent = '#new'
   ```
   Add your own token under `templateSpecific.<name>` and wire it through `templateConfigs.<name>`.

4. **Silent removal of a CSS variable.**
   Deleting `['--template-panel-border']` from a template's root `<div>` compiles fine and ships with incorrect border colors on every card. Always keep all 8.

5. **Editing `defaultHex` in `TEMPLATE_COLOR_FIELDS` without updating `config.ts`.**
   Causes the CMS placeholder and the public site to disagree. The CMS will show color X while the site renders color Y until the user saves.

6. **Mutating `deriveModuleColors` across templates in one edit.**
   Treat each `if (template === '<name>')` branch as a separate change. Do not refactor shared derivation code and one template's branch in the same commit.

7. **Relying on `getTemplateConfig('X').colors` inside JSX at render time.**
   That is the frozen default, not the user's saved overrides. Always use the merged `colors` local you built at the top of `<X>Layout`.

---

## Quick Reference — Files You Touch Per Change Type

| Change | Files |
|---|---|
| Shell CSS only | `lib/templates/<name>/<Name>GlobalStyles.tsx` |
| Shell JSX only | `lib/templates/<name>/*.tsx` |
| Default colors / tokens | `lib/templates/config.ts` (`colorPalettes.templateSpecific.<name>` + `templateConfigs.<name>`) + `frontend/src/pages/settings/constants/templateFields.ts` (`TEMPLATE_COLOR_FIELDS.<name>` `defaultHex`) |
| Default copy | `lib/templates/config.ts` (`templateConfigs.<name>.copy`) + `templateFields.ts` (`TEMPLATE_COPY_FIELDS.<name>` placeholder) |
| Nav labels | `lib/templates/config.ts` (`templateConfigs.<name>.layout.navItems`) + `templateFields.ts` (`DEFAULT_NAV_LABELS.<name>`) |
| Background adornment | `lib/templates/<name>/<Name>BackgroundAdornment.tsx` (if exists) + `templateFields.ts` (`TEMPLATE_BG_ADORNMENTS.<name>`) |
| Palette presets | `frontend/src/pages/settings/constants/templatePalettes.ts` (`TEMPLATE_PALETTES.<name>`) |
| Review score palette | `lib/templates/config.ts` (`colorPalettes.moduleStyleSpecific.reviews.<name>ScorePalettes`) + `frontend/src/pages/settings/utils/colorUtils.ts` (`deriveScorePalettes` `<name>` branch) |
| Preset-to-module derivation | `frontend/src/pages/settings/utils/colorUtils.ts` (`deriveModuleColors` `<name>` branch) |
| Runtime color derivation | `lib/templates/<name>/index.tsx` (e.g. `resolveModernColors`) |

If your change spans more than one row here, that is fine — just confirm each file you edit maps to the template you intend, and nothing else.
