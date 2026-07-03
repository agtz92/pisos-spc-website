/**
 * Shared utilities for landing page layout variants.
 * CSS variable tokens, icon map, small reusable sub-components, and module data types.
 */

import type { Post, Recipe, Product, Listing, Review } from '@/lib/graphql';

export type { Post, Recipe, Product, Listing, Review };

export interface ModuleData {
  posts: Post[];
  recipes: Recipe[];
  products: Product[];
  listings: Listing[];
  reviews: Review[];
  activeModules: string[];
}

import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

// ── CSS variable tokens ──────────────────────────────────────────────────────

export const t = {
  accent:      'var(--template-accent, #2563eb)',
  ink:         'var(--template-ink, #111827)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
  mutedPanel:  'var(--template-muted-panel, #f8fafc)',
};

// ── Icon resolver ────────────────────────────────────────────────────────────

/**
 * Resolve a kebab-case icon slug (what the CMS persists) to a Lucide component
 * via a runtime lookup against the whole ``lucide-react`` library — so ANY of
 * Lucide's icons render without maintaining a hand-written map. Browse slugs at
 * https://lucide.dev/icons/ and use them verbatim.
 *
 * The CMS IconPicker enumerates the same library, so the two stay in sync by
 * construction (no shared import needed).
 */

// Legacy slug aliases — kebab slugs older content persisted that no longer map
// 1:1 to a current Lucide PascalCase export.
const ICON_ALIASES: Record<string, string> = {
  'bar-chart': 'BarChart2',
};

function slugToPascal(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/** Look up a Lucide component for a kebab-case slug, or undefined if unknown. */
export function lucideForSlug(slug: string): LucideIcon | undefined {
  if (!slug) return undefined;
  const key = slug.toLowerCase();
  const name = ICON_ALIASES[key] ?? slugToPascal(key);
  const C = (Lucide as Record<string, unknown>)[name];
  return typeof C === 'function' || (typeof C === 'object' && C !== null)
    ? (C as LucideIcon)
    : undefined;
}

// ── Small shared sub-components ──────────────────────────────────────────────

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? '#facc15' : t.panelBorder }}>★</span>
      ))}
    </div>
  );
}

/** If the string is a 3/6-digit hex color (with or without '#'), return the
 *  normalized `#rrggbb` form; otherwise null. Lets the editor type a hex into
 *  the icon slot and get a real color swatch/banner instead of raw text. */
export function hexOrNull(v?: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  return /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s) ? (s.startsWith('#') ? s : `#${s}`) : null;
}

/** Resolve a stored media path to an absolute URL (prepends the API base for
 *  relative `/media/...` paths; leaves absolute http(s) URLs untouched). */
export function mediaSrc(image: string): string {
  return image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${image}`;
}

export function FeatureIcon({ icon, image, size = 24, alt = '' }: {
  icon?: string;
  image?: string | null;
  size?: number;
  alt?: string;
}) {
  // 1. Custom uploaded image always wins.
  if (image) {
    return (
      <img
        src={mediaSrc(image)}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }
  // 2. Hex color in the icon slot → paint a color swatch instead of raw text.
  const swatch = hexOrNull(icon);
  if (swatch) {
    return (
      <span
        role="img"
        aria-label={alt || swatch}
        style={{ width: size, height: size, background: swatch, borderRadius: Math.max(4, size * 0.2), display: 'inline-block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
      />
    );
  }
  // 3. Lucide icon resolved at runtime from the slug.
  const C: LucideIcon | undefined = icon ? lucideForSlug(icon) : undefined;
  if (C) return <C size={size} strokeWidth={1.75} />;
  // 4. Raw text fallback (legacy — emoji or unknown slug).
  if (icon) return <span style={{ fontSize: size }}>{icon}</span>;
  // 5. Default sparkle.
  return <span style={{ fontSize: size, fontWeight: 700 }}>✦</span>;
}

/**
 * Large media banner for the "card" features media style (grid layouts only,
 * driven by `page.featuresMediaStyle === 'card'`). Fills a fixed-ratio block:
 * uploaded image → object-cover; hex in the icon slot → solid color banner;
 * icon slug → large centered icon on a tinted panel. `ratio` is a CSS
 * aspect-ratio string (default 4/3).
 */
export function FeatureMedia({ icon, image, alt = '', ratio = '4 / 3' }: {
  icon?: string;
  image?: string | null;
  alt?: string;
  ratio?: string;
}) {
  const base: CSSProperties = {
    width: '100%', aspectRatio: ratio, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  };
  if (image) {
    return <img src={mediaSrc(image)} alt={alt} style={{ ...base, objectFit: 'cover' }} />;
  }
  const banner = hexOrNull(icon);
  if (banner) {
    return <span role="img" aria-label={alt || banner} style={{ ...base, background: banner }} />;
  }
  const C: LucideIcon | undefined = icon ? lucideForSlug(icon) : undefined;
  return (
    <span style={{ ...base, background: t.mutedPanel, color: t.accent }}>
      {C ? <C size={48} strokeWidth={1.5} /> : <span style={{ fontSize: 40, fontWeight: 700 }}>{icon || '✦'}</span>}
    </span>
  );
}
