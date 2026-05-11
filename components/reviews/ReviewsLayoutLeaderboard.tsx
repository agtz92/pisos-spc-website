/**
 * ReviewsLayoutLeaderboard
 *
 * CONCEPT: Ranks all reviews by score from highest to lowest, turning the reviews
 * page into a "best of" chart. Each entry shows a large rank number (#1, #2…) as
 * the primary visual element, paired with a score chip, thumbnail, and the key
 * review metadata. The top 3 entries get a gold/silver/bronze treatment on the
 * rank number.
 *
 * DESIGN DECISIONS:
 * - Reviews without a numeric score are excluded from the ranked list and collected
 *   in an "Unscored" section at the bottom
 * - Rank numbers use a very large monospace-style display (4rem+) in a muted color
 *   that steps to gold (#FFD700), silver (#C0C0C0), bronze (#CD7F32) for top 3
 * - Score chip is left-aligned after rank number; thumbnail follows; title + verdict right
 * - A horizontal accent line separates the ranked section from the unscored fallback
 * - Ties keep the original ordering from the server
 *
 * GOOD FOR: Entertainment / media review sites (games, films, music) where users
 * want to discover the "best" content at a glance. Also great for annual "best of"
 * round-up pages.
 *
 * MODIFICATION NOTES:
 * - To show only the top N: slice `ranked` before mapping (e.g. `ranked.slice(0, 10)`)
 * - To change medal colors: edit `RANK_COLORS` below
 * - To add a "score trend" badge (up/down arrow): add a prop and display it next to the score chip
 * - Unscored section: remove the unscored block entirely if you don't want it
 * - To group ties visually: detect equal scores and render a shared rank row
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import type { ReviewsModuleColors, ReviewsModuleCopy } from '@/lib/templates/config';
import { formatDate, getScorePalette, getVerdict, scoreTier } from './reviewsHelpers';

const RANK_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#B8C0CC',
  3: '#CD7F32',
};

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  typeCategories: { slug: string; name: string }[];
}

export default function ReviewsLayoutLeaderboard({ reviews, colors, copy, typeCategories }: Props) {
  const withScore = reviews
    .filter((r) => r.rating != null && !Number.isNaN(parseFloat(r.rating!)))
    .sort((a, b) => parseFloat(b.rating!) - parseFloat(a.rating!));
  const unscored = reviews.filter((r) => !r.rating || Number.isNaN(parseFloat(r.rating)));

  return (
    <div data-reviews-page>
      <CategoryFilterBar categories={typeCategories} basePath="/reviews/type/" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.4rem' }}>
            Ranked by Score
          </p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
            {copy.title}
          </h1>
        </div>

        {/* Ranked list */}
        <div style={{ borderTop: '2px solid var(--template-panel-border, #e5e7eb)' }}>
          {withScore.map((review, idx) => {
            const rank = idx + 1;
            const imageUrl = resolveMediaUrl(review.coverImage);
            const score = parseFloat(review.rating!);
            const palette = getScorePalette(score, colors);
            const display = Number.isInteger(score) ? String(score) : score.toFixed(1);
            const rankColor = RANK_COLORS[rank] ?? 'var(--template-panel-border, #d1d5db)';
            const date = formatDate(review.publishedAt ?? review.createdAt);

            return (
              <article
                key={review.slug}
                data-review-leaderboard-row
                className="group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 3rem auto 1fr',
                  gap: '0 1rem',
                  alignItems: 'center',
                  padding: '1.1rem 0',
                  borderBottom: '1px solid var(--template-panel-border, #e5e7eb)',
                }}
              >
                {/* Rank number */}
                <span style={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.06em', color: rankColor, fontVariantNumeric: 'tabular-nums', textAlign: 'center' as const }}>
                  {rank}
                </span>

                {/* Score chip */}
                <div
                  data-score-chip
                  data-score-tier={scoreTier(score)}
                  style={{
                    width: 44, height: 44, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: palette.background, color: palette.text,
                    fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.03em',
                    boxShadow: `0 2px 8px ${palette.shadow}`,
                  }}
                >
                  {display}
                </div>

                {/* Thumbnail */}
                <Link href={`/reviews/${review.slug}`} className="block shrink-0 overflow-hidden" style={{ width: 70, height: 52, borderRadius: 8, position: 'relative', background: 'var(--template-muted-panel, #f3f4f6)' }}>
                  {imageUrl ? (
                    <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </Link>

                {/* Title + meta */}
                <div style={{ minWidth: 0 }}>
                  {review.subject && (
                    <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {review.subject}
                    </p>
                  )}
                  <h2 style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25, color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
                      {review.title}
                    </Link>
                  </h2>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem', flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: palette.background }}>{getVerdict(score)}</span>
                    {date && <span style={{ fontSize: '0.65rem', color: 'var(--template-muted-text, #6b7280)' }}>{date}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Unscored section */}
        {unscored.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--template-muted-text, #9ca3af)' }}>Unscored</span>
              <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {unscored.map((review) => {
                const imageUrl = resolveMediaUrl(review.coverImage);
                return (
                  <article key={review.slug} data-review-unscored-card className="group" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)' }}>
                    {imageUrl && (
                      <Link href={`/reviews/${review.slug}`} className="block shrink-0 overflow-hidden" style={{ width: 52, height: 40, borderRadius: 6, position: 'relative', background: 'var(--template-muted-panel, #f3f4f6)' }}>
                        <Image src={imageUrl} alt={review.title} fill className="object-cover" />
                      </Link>
                    )}
                    <h3 style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3, color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
                        {review.title}
                      </Link>
                    </h3>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
