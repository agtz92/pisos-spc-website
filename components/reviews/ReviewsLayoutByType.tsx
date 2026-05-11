/**
 * ReviewsLayoutByType
 *
 * CONCEPT: Groups reviews into sections by their reviewType (Book, Film, Game, etc.),
 * making it easy to browse within a category. Each type section has a bold header with
 * a count badge and a horizontal scroll rail of review cards — so many types can be
 * visible on screen simultaneously without infinite vertical scrolling.
 *
 * DESIGN DECISIONS:
 * - Type sections are sorted by review count (most reviews first)
 * - Each type's header shows the type name + a pill with the count
 * - Within a type, reviews are sorted newest first (by publishedAt/createdAt)
 * - Each section uses a horizontal scroll rail (overflow-x: auto) with snap-scroll
 *   so users can swipe through long lists without disrupting the page flow
 * - Cards in the rail are portrait format: 160px wide, image fills top 55%, title below
 * - Reviews with no type fall into an "Other" catch-all section at the bottom
 *
 * GOOD FOR: Media review sites that cover multiple content types (books + films + games).
 * The rail layout keeps the page height manageable even with hundreds of reviews.
 *
 * MODIFICATION NOTES:
 * - Card width: change `minWidth: 160` and `width: 160` in the card style
 * - To show full cards instead of a rail: replace the scroll rail div with a CSS grid
 * - To link section headers to filtered pages: wrap the h2 in a Link to /reviews/type/<key>
 * - To sort types alphabetically instead of by count: change the `sort` comparator
 * - Rail snap behavior: remove `scrollSnapType` / `scrollSnapAlign` to disable snapping
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import type { ReviewsModuleColors, ReviewsModuleCopy } from '@/lib/templates/config';
import { formatDate, getScorePalette, scoreTier } from './reviewsHelpers';

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  typeCategories: { slug: string; name: string }[];
}

function TypeRailCard({ review, colors }: { review: Review; colors: ReviewsModuleColors }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const score = review.rating ? parseFloat(review.rating) : null;
  const palette = score != null && !Number.isNaN(score) ? getScorePalette(score, colors) : null;
  const display = score != null && !Number.isNaN(score)
    ? (Number.isInteger(score) ? String(score) : score.toFixed(1))
    : null;

  return (
    <article
      data-review-rail-card
      className="group"
      style={{
        minWidth: 160, width: 160, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        background: 'var(--template-panel, #fff)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Image */}
      <Link href={`/reviews/${review.slug}`} style={{ position: 'relative', display: 'block', aspectRatio: '4 / 3', background: 'var(--template-muted-panel, #f3f4f6)', flexShrink: 0 }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover transition-transform duration-400 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {display && palette && (
          <div
            data-score-chip
            data-score-tier={scoreTier(score!)}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: palette.background, color: palette.text,
              fontWeight: 900, fontSize: '0.8rem',
              boxShadow: `0 2px 8px ${palette.shadow}`,
            }}
          >
            {display}
          </div>
        )}
      </Link>

      {/* Content */}
      <div style={{ padding: '0.65rem 0.75rem', flex: 1 }}>
        {review.subject && (
          <p style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {review.subject}
          </p>
        )}
        <h3 style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3, color: 'var(--template-ink, #161218)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
            {review.title}
          </Link>
        </h3>
        {review.publishedAt && (
          <p style={{ fontSize: '0.6rem', color: 'var(--template-muted-text, #9ca3af)', marginTop: '0.3rem' }}>{formatDate(review.publishedAt)}</p>
        )}
      </div>
    </article>
  );
}

export default function ReviewsLayoutByType({ reviews, colors, copy, typeCategories }: Props) {
  // Build type-keyed map
  const typeMap = new Map<string, Review[]>();
  const ungrouped: Review[] = [];

  reviews.forEach((r) => {
    const key = r.reviewType?.trim() || '';
    if (!key) { ungrouped.push(r); return; }
    if (!typeMap.has(key)) typeMap.set(key, []);
    typeMap.get(key)!.push(r);
  });

  // Sort each group newest-first
  typeMap.forEach((arr) => arr.sort((a, b) => {
    const da = new Date(a.publishedAt ?? a.createdAt ?? 0).getTime();
    const db = new Date(b.publishedAt ?? b.createdAt ?? 0).getTime();
    return db - da;
  }));

  // Sort types by count desc
  const typeSections = Array.from(typeMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key, arr]) => ({
      key,
      label: typeCategories.find((t) => t.slug === key)?.name ?? key,
      reviews: arr,
    }));

  return (
    <div data-reviews-page>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Page header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.4rem' }}>
            Browse by Category
          </p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
            {copy.title}
          </h1>
        </div>

        <div className="space-y-12">
          {typeSections.map((section) => (
            <section key={section.key}>
              {/* Section header */}
              <div data-review-section-header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--template-panel-border, #e5e7eb)' }}>
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
                  {section.label}
                </h2>
                <span data-review-count-badge style={{ padding: '0.2rem 0.65rem', borderRadius: 999, background: 'var(--template-muted-panel, #f3f4f6)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--template-muted-text, #6b7280)' }}>
                  {section.reviews.length}
                </span>
                <Link href={`/reviews/type/${section.key}`} style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: 'var(--template-accent, #ec0f7f)', textDecoration: 'none' }} className="hover:underline underline-offset-2">
                  See all →
                </Link>
              </div>

              {/* Horizontal scroll rail */}
              <div
                style={{
                  display: 'flex', gap: '0.85rem',
                  overflowX: 'auto', padding: '10px 20px 20px 0',
                  margin: '-10px 0 -10px 0',
                  scrollSnapType: 'x mandatory',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
                className="hide-scrollbar"
              >
                {section.reviews.map((r) => (
                  <TypeRailCard key={r.slug} review={r} colors={colors} />
                ))}
              </div>
            </section>
          ))}

          {ungrouped.length > 0 && (
            <section>
              <div data-review-section-header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--template-panel-border, #e5e7eb)' }}>
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
                  Other
                </h2>
                <span data-review-count-badge style={{ padding: '0.2rem 0.65rem', borderRadius: 999, background: 'var(--template-muted-panel, #f3f4f6)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--template-muted-text, #6b7280)' }}>
                  {ungrouped.length}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', padding: '10px 20px 20px 0', margin: '-10px 0 -10px 0', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                {ungrouped.map((r) => <TypeRailCard key={r.slug} review={r} colors={colors} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
