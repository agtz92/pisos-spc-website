/**
 * BlogLayoutMacro
 *
 * CONCEPT: Typography-first layout where the post title is the hero.
 * A single full-bleed lead post dominates the top with a large image and
 * an enormous overlaid headline. The remaining posts stack as wide rows —
 * a huge number index on the left, large title in the center, compact
 * metadata and optional thumbnail on the right.
 *
 * DESIGN DECISIONS:
 * - Lead post: full-bleed aspect-[16/9] image, gradient scrim, white title overlay
 * - Post rows: left index numeral (muted, large), center title at clamp(1.5rem → 2.5rem),
 *   right block with date + thumbnail (80×80)
 * - Category filter rendered as an oversized pill bar above the post list
 * - No excerpt shown — the title carries all the weight
 * - No cards, no shadows — just type and a bottom rule per row
 *
 * GOOD FOR: Blogs where headlines are strong enough to stand alone.
 * Works with every template via CSS vars.
 *
 * MODIFICATION NOTES:
 * - To show excerpt: add it below the h2 in MacroPostRow
 * - Lead image height: change `aspect-[16/9]` in MacroLeadPost
 * - Index numeral size: change `clamp(3rem, 5vw, 4.5rem)` in MacroPostRow
 * - To show author avatar: add avatar Image next to author name in MacroPostRow
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Post, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

// ── CSS variable tokens ─────────────────────────────────────────────────────

const v = {
  accent:      'var(--template-accent, #e5201b)',
  ink:         'var(--template-ink, #161218)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  mutedPanel:  'var(--template-muted-panel, #f3f4f6)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
};

// ── Shared helpers ──────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateShort(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── MacroLeadPost ───────────────────────────────────────────────────────────
// Full-bleed hero: image fills the frame, gradient scrim, white headline overlay.

function MacroLeadPost({ post }: { post: Post }) {
  const img = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article data-post-hero className="group">
      {/* Top rule — newspaper section divider */}
      <div style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}`, padding: '4px 0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {post.category && (
          <span
            className="font-black uppercase tracking-widest"
            style={{ fontSize: '0.65rem', color: v.accent, background: v.ink, padding: '2px 8px' }}
          >
            {post.category.name}
          </span>
        )}
        {date && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.08em' }}>
            {date}
          </span>
        )}
        {post.author && (
          <span className="font-semibold ml-auto" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.05em' }}>
            By {post.author.name}
          </span>
        )}
      </div>

      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
        {/* Headline first — newspaper style */}
        <h1
          className="font-black leading-[0.92] tracking-tight group-hover:underline underline-offset-4 mb-5"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', color: v.ink }}
        >
          {post.title}
        </h1>

        {/* Image below headline */}
        {img && (
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: '16 / 9',
              background: v.mutedPanel,
              border: `2px solid ${v.panelBorder}`,
              borderRadius: 0,
            }}
          >
            <Image
              src={img}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        )}
      </Link>
    </article>
  );
}

// ── MacroPostRow ────────────────────────────────────────────────────────────
// Large numbered row: index | title | date + thumbnail.

function MacroPostRow({ post, index }: { post: Post; index: number }) {
  const img = resolveMediaUrl(post.coverImage);
  const dateShort = formatDateShort(post.publishedAt ?? post.createdAt);
  const dateLabel = formatDate(post.publishedAt ?? post.createdAt);

  // Split short date into day + month for the dateline column
  const dateParts = dateShort?.split(' ') ?? [];
  const dateMonth = dateParts[0] ?? '';
  const dateDay   = dateParts[1] ?? '';

  return (
    <article
      data-post-row
      className="group"
      style={{ borderBottom: `2px solid ${v.panelBorder}` }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-stretch gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6"
        style={{ textDecoration: 'none' }}
      >
        {/* Dateline column — newspaper front-page style */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start pt-1 hidden sm:flex"
          style={{ width: 52, borderRight: `2px solid ${v.panelBorder}`, paddingRight: '1rem' }}
        >
          <span
            className="font-black leading-none tabular-nums"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: v.ink }}
          >
            {dateDay}
          </span>
          <span
            className="font-bold uppercase tracking-widest mt-0.5"
            style={{ fontSize: '0.6rem', color: v.mutedText }}
          >
            {dateMonth}
          </span>
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          {post.category && (
            <span
              className="inline-block mb-1.5 font-black uppercase tracking-widest"
              style={{ fontSize: '0.62rem', color: v.accent }}
            >
              {post.category.name}
            </span>
          )}
          <h2
            className="font-black leading-[1.02] tracking-tight group-hover:underline underline-offset-4"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', color: v.ink }}
          >
            {post.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-2" style={{ fontSize: '0.72rem', color: v.mutedText }}>
            {post.author && <span style={{ fontWeight: 700, color: v.ink }}>{post.author.name}</span>}
            {post.author && dateLabel && <span>&middot;</span>}
            {/* Mobile date fallback */}
            {dateLabel && <span className="sm:hidden">{dateLabel}</span>}
            <span className="hidden sm:inline" aria-hidden>#{String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {img && (
          <div
            className="relative overflow-hidden flex-shrink-0 self-center"
            style={{ width: 88, height: 88, background: v.mutedPanel, border: `2px solid ${v.panelBorder}` }}
          >
            <Image
              src={img}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

// ── MacroSectionLabel ───────────────────────────────────────────────────────

function MacroSectionLabel({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2 mb-0"
      style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}` }}
    >
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
      <span
        className="font-black uppercase tracking-[0.2em]"
        style={{ fontSize: '0.65rem', color: v.ink }}
      >
        &#8213; {label} &#8213;
      </span>
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
    </div>
  );
}

// ── BlogLayoutMacro ─────────────────────────────────────────────────────────

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutMacro({ posts, categories }: Props) {
  const [lead, ...rest] = posts;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-10">
          <CategoryFilterBar categories={categories} basePath="/blog/category" />
        </div>
      )}

      {/* Lead post */}
      {lead && (
        <div className="mb-16">
          <MacroLeadPost post={lead} />
        </div>
      )}

      {/* Remaining posts */}
      {rest.length > 0 && (
        <div>
          <MacroSectionLabel label="More" />
          <div style={{ borderTop: `1px solid ${v.panelBorder}` }}>
            {rest.map((post, i) => (
              <MacroPostRow key={post.slug} post={post} index={i + 2} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
