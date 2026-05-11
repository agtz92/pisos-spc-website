# Config System Guide

This document explains the actual configuration structure currently implemented in:

- `lib/templates/config.ts`

It is intended as a handoff reference for future agents and developers.

## What exists today

`config.ts` currently has three main exported layers:

- `colorPalettes`
- `templateConfigs`
- `moduleConfigs`

And two helper accessors:

- `getTemplateConfig(...)`
- `getModuleConfig(...)`

The current contract is:

1. raw color tokens live in `colorPalettes`
2. template and module config objects map those tokens into feature usage
3. components read from `templateConfigs` or `moduleConfigs`

## 1. `colorPalettes`

This is the raw color/token registry.

It is split into four buckets:

- `colorPalettes.global`
- `colorPalettes.moduleSpecific`
- `colorPalettes.templateSpecific`
- `colorPalettes.moduleStyleSpecific`

### `colorPalettes.global`

Shared neutrals and common surface values.

Current examples:

- `white`
- `whiteSoft`
- `whiteRose`
- `whiteRoseMuted`
- `ink`
- `inkStrong`
- `inkSoft`
- `inkMuted`
- `borderSoft`
- `panelSoft`

### `colorPalettes.moduleSpecific`

Shared module-level tokens used by more than one content area.

Current example:

- `editorialAccent`

This is used by:

- `moduleConfigs.blog.colors.accent`
- `moduleConfigs.recipes.colors.accent`

### `colorPalettes.templateSpecific`

Template-owned color systems.

Current template buckets:

- `modern`
- `retro`
- `futuristic`

Each of these contains its own shell-specific tokens.

Examples:

- `colorPalettes.templateSpecific.modern.accent`
- `colorPalettes.templateSpecific.retro.highlight`
- `colorPalettes.templateSpecific.futuristic.panelBorder`

### `colorPalettes.moduleStyleSpecific`

Module-only styling systems that are too specialized to be global.

Current example:

- `reviews`

This currently contains:

- `accent`
- `badgeText`
- `railBorder`
- `typeStyles`
- `scorePalettes`

## 2. `templateConfigs`

This is the shell-level configuration for the site templates.

Current templates:

- `templateConfigs.modern`
- `templateConfigs.retro`
- `templateConfigs.futuristic`

All three currently use the same top-level shape:

- `colors`
- `copy`
- `layout`

### `templateConfigs.modern`

#### `templateConfigs.modern.colors`

Current fields:

- `accent`
- `accentSoft`
- `accentStrong`
- `ink`
- `mutedText`
- `textOnAccent`
- `gridLine`
- `gridLineSoft`
- `pageBackground`
- `panelBackground`
- `mutedPanelBackground`

#### `templateConfigs.modern.copy`

Current fields:

- `utilityBarLabel`
- `headerTagline`
- `footerDescription`
- `footerEyebrow`

#### `templateConfigs.modern.layout`

Current fields:

- `navItems`

This is where the modern navbar labels and routes come from.

### `templateConfigs.retro`

#### `templateConfigs.retro.colors`

Current fields:

- `ink`
- `mutedText`
- `textOnAccent`
- `pageBackground`
- `panelBackground`
- `mutedPanelBackground`
- `contentBackground`
- `sidebarBackground`
- `footerBackground`
- `navBackground`
- `navAltBackground`
- `panelBorder`
- `highlight`
- `highlightStrong`
- `link`
- `paperNoise`

#### `templateConfigs.retro.copy`

Current fields:

- `eyebrow`
- `tagline`
- `metaLabel`
- `featureLabel`
- `featureTitle`
- `featureDescription`
- `footerEyebrow`
- `footerDescription`
- `statHighlights`
- `sidebarCards`

Important note:

- `sidebarCards` exists in config, but you should verify usage in the template before assuming the UI renders every field exactly as listed.

#### `templateConfigs.retro.layout`

Current fields:

- `navItems`

At the moment, `retro.layout` is mainly navigation metadata.

### `templateConfigs.futuristic`

#### `templateConfigs.futuristic.colors`

Current fields:

- `pageBackground`
- `bodyText`
- `ink`
- `mutedText`
- `accent`
- `accentStrong`
- `accentBorder`
- `accentGlow`
- `panelBackground`
- `mutedPanelBackground`
- `panelBorder`
- `headerBackground`
- `footerBackground`
- `topGlowLine`
- `scanlineOverlay`
- `gridOverlay`
- `imageBorder`

#### `templateConfigs.futuristic.copy`

Current fields:

- `footerPrefix`

#### `templateConfigs.futuristic.layout`

Current fields:

- `navItems`
- `mainContainerClassName`

## 3. `moduleConfigs`

This is the page/domain-level configuration.

Current modules:

- `blog`
- `recipes`
- `realestate`
- `reviews`
- `products`

All modules currently expose:

- `colors`
- `copy`
- `layout`

But the exact field set differs depending on whether the module uses the basic shape or a specialized one.

### Basic modules

These currently use the shared `BasicModuleConfig` shape:

- `blog`
- `recipes`
- `realestate`
- `products`

#### `colors`

Current fields:

- `accent`
- `ink`
- `panelBackground`
- `panelBorder`

#### `copy`

Current fields:

- `title`
- `emptyState`
- `featuredLabel`
- `moreLabel`

#### `layout`

Current fields:

- `containerClassName`
- `featuredGridClassName`
- `featuredSideCount`
- `railCount`

### `moduleConfigs.reviews`

Reviews has a specialized config shape.

#### `moduleConfigs.reviews.colors`

Current fields:

- `accent`
- `ink`
- `railBorder`
- `sectionRule`
- `featuredBadgeBackground`
- `featuredBadgeText`
- `featuredBadgeBorder`
- `featuredCard`
- `reviewCard`
- `typeStyles`
- `scorePalettes`

`featuredCard` and `reviewCard` each contain:

- `borderRadius`
- `shadow`

#### `moduleConfigs.reviews.copy`

Current fields:

- `title`
- `emptyState`
- `railHeading`
- `moreReviewsLabel`
- `reviewTypes`

#### `moduleConfigs.reviews.layout`

Current fields:

- `containerClassName`
- `featuredGridClassName`
- `remainingGridClassName`
- `sideReviewCount`
- `railReviewCount`

## Where common UI settings live

Use this cheat sheet based on the actual implementation:

- template navbar labels and routes:
  - `templateConfigs.<template>.layout.navItems`
- template header/footer shell copy:
  - `templateConfigs.<template>.copy`
- template shell colors:
  - `templateConfigs.<template>.colors`
- module page text:
  - `moduleConfigs.<module>.copy`
- module layout classes and item counts:
  - `moduleConfigs.<module>.layout`
- module-specific badges, rails, score systems:
  - `moduleConfigs.<module>.colors`

## Practical examples

If you want to change the shared editorial accent used by blog and recipes:

- update `colorPalettes.moduleSpecific.editorialAccent`

If you want to change the modern navbar labels:

- update `templateConfigs.modern.layout.navItems`

If you want to change the modern shell tagline:

- update `templateConfigs.modern.copy.headerTagline`

If you want to change the retro feature header text:

- update `templateConfigs.retro.copy.featureTitle`
- update `templateConfigs.retro.copy.featureDescription`

If you want to change the futuristic footer prefix:

- update `templateConfigs.futuristic.copy.footerPrefix`

If you want to change the reviews rail heading or empty state:

- update `moduleConfigs.reviews.copy.railHeading`
- update `moduleConfigs.reviews.copy.emptyState`

If you want to change how many reviews appear in the side stack:

- update `moduleConfigs.reviews.layout.sideReviewCount`

If you want to change review score colors:

- update `colorPalettes.moduleStyleSpecific.reviews.scorePalettes`

## How components consume config

Current access helpers:

- `getTemplateConfig('modern')`
- `getTemplateConfig('retro')`
- `getTemplateConfig('futuristic')`
- `getModuleConfig('blog')`
- `getModuleConfig('recipes')`
- `getModuleConfig('realestate')`
- `getModuleConfig('reviews')`
- `getModuleConfig('products')`

Examples in the repo:

- `lib/templates/modern.tsx`
- `lib/templates/retro.tsx`
- `lib/templates/futuristic.tsx`
- `app/reviews/page.tsx`
- `components/ReviewCard.tsx`
- `app/reviews/layout.tsx`

## Editing rules

When adding or changing config:

1. decide whether the setting belongs in `colorPalettes`, `templateConfigs`, or `moduleConfigs`
2. if it is a reusable color token, add it to the correct `colorPalettes` bucket
3. map it through the relevant template or module config
4. consume it from components through the config helpers

Avoid:

- adding new hard-coded values in components when the value clearly belongs in config
- describing fields in docs that do not actually exist in `config.ts`
- assuming all templates/modules expose the exact same nested keys beyond the currently defined interfaces

## Current caveat

The architecture is in place, but there may still be some hard-coded values left in component/template files outside `config.ts`.

If you find one:

1. decide whether it is color, copy, or layout
2. move it into the correct config layer
3. update the consuming component

## Summary

The actual current contract is:

- raw color tokens live in `colorPalettes`
- shell-level config lives in `templateConfigs`
- page/domain-level config lives in `moduleConfigs`
- components read from `getTemplateConfig(...)` and `getModuleConfig(...)`

That is the structure the next agent should work from unless `config.ts` itself changes.
