/**
 * ReviewsLayoutList
 *
 * CONCEPT: A dense, scannable list view — each review is a single horizontal row with
 * a score box on the far left, a small thumbnail, the subject + title + verdict in the
 * center, and the review type + date on the far right. Modeled on "all reviews" archive
 * pages at professional review aggregators.
 *
 * DESIGN DECISIONS:
 * - 4-column grid per row: `50px score | 80px thumbnail | 1fr details | auto meta`
 * - Score box is a solid-colored square (50×50) using the score palette background color
 * - Subject (what is being reviewed) is shown as a muted uppercase label above the title
 * - Verdict text (e.g. "Generally Favorable") renders below the title in the palette color
 * - Review type (book/film/game) and date are right-aligned in small muted text
 * - Rows are separated by a thin bottom border — no card shadows or backgrounds
 * - A decorative accent bar + title header appears above the list
 *
 * GOOD FOR: Review aggregators or personal review blogs where readers want to compare
 * many reviews quickly, especially when scores are the primary signal.
 *
 * MODIFICATION NOTES:
 * - Score box size: change `width: 50, height: 50` in the ScoreBox component
 * - Thumbnail size: change `width: 80, height: 56` in the thumbnail column
 * - To add subject creator/year: uncomment the creator/releaseYear span in the subject line
 * - To sort by score: pre-sort the reviews array before passing to this component
 * - To remove the verdict line: delete the `scorePalette && score != null` block
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import type { ReviewsModuleColors, ReviewsModuleCopy } from '@/lib/templates/config';
import { formatDate, getScorePalette, getVerdict, scoreTier } from './reviewsHelpers';

function ScoreBox({ rating, colors }: { rating: string | null; colors: ReviewsModuleColors }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  if (Number.isNaN(score)) return null;
  const palette = getScorePalette(score, colors);
  const display = Number.isInteger(score) ? String(score) : score.toFixed(1);
  return (
    <div data-score-chip data-score-tier={scoreTier(score)} style={{ width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.background, color: palette.text, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.03em', lineHeight: 1, boxShadow: `0 2px 8px ${palette.shadow}` }}>
      {display}
    </div>
  );
}

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  typeCategories: { slug: string; name: string }[];
}

export default function ReviewsLayoutList({ reviews, colors, copy, typeCategories }: Props) {
  return (
    <div data-reviews-page>
      <CategoryFilterBar categories={typeCategories} basePath="/reviews/type/" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', flexShrink: 0, borderRadius: 2 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--template-ink, #161218)', opacity: 0.7 }}>{copy.title}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
        </div>

        <div style={{ borderTop: '1px solid var(--template-panel-border, #e5e7eb)' }}>
          {reviews.map((review) => {
            const imageUrl = resolveMediaUrl(review.coverImage);
            const date = formatDate(review.publishedAt ?? review.createdAt);
            const score = review.rating ? parseFloat(review.rating) : null;
            const scorePalette = score != null && !Number.isNaN(score) ? getScorePalette(score, colors) : null;

            return (
              <article
                key={review.slug}
                data-review-list-row
                className="group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px auto 1fr auto',
                  gap: '0 1rem',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid var(--template-panel-border, #e5e7eb)',
                }}
              >
                {/* Score */}
                <ScoreBox rating={review.rating} colors={colors} />

                {/* Thumbnail */}
                {imageUrl ? (
                  <Link href={`/reviews/${review.slug}`} className="block shrink-0 overflow-hidden" style={{ width: 80, height: 56, borderRadius: 8, position: 'relative', background: 'var(--template-muted-panel, #f3f4f6)' }}>
                    <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </Link>
                ) : (
                  <div style={{ width: 80, height: 56, borderRadius: 8, background: 'var(--template-muted-panel, #f3f4f6)', flexShrink: 0 }} />
                )}

                {/* Details */}
                <div style={{ minWidth: 0 }}>
                  {review.subject && (
                    <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--template-ink, #161218)', opacity: 0.45, marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {review.subject}
                      {(review.creator || review.releaseYear) && <span style={{ fontWeight: 500, marginLeft: '0.4rem' }}>{[review.creator, review.releaseYear].filter(Boolean).join(' · ')}</span>}
                    </p>
                  )}
                  <h2 style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25, color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
                      {review.title}
                    </Link>
                  </h2>
                  {scorePalette && score != null && (
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: scorePalette.background, marginTop: '0.15rem' }}>{getVerdict(score)}</p>
                  )}
                </div>

                {/* Meta */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--template-ink, #161218)', opacity: 0.4, textTransform: 'capitalize' as const }}>{review.reviewType}</p>
                  {date && <p style={{ fontSize: '0.62rem', color: 'var(--template-muted-text, #6b7280)', marginTop: '0.1rem' }}>{date}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
