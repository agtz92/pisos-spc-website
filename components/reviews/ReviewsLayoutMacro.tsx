/**
 * ReviewsLayoutMacro
 *
 * CONCEPT: Typography-first review index. Newspaper macro aesthetic — big type,
 * strong rules, no cards. A lead review dominates the top with the title huge
 * and the score chip prominent. Remaining reviews stack as wide rows with the
 * score as the left "dateline" column — the review equivalent of a newspaper date.
 *
 * DESIGN DECISIONS:
 * - Lead: top rule bar (review type + subject + creator/year), giant headline,
 *   full-width 16:9 image below, score chip + verdict below image
 * - Rows: left dateline = score chip (data-score-chip + data-score-tier, styled
 *   by the template automatically), center = type + title + subject + verdict,
 *   right = 88×88 thumbnail
 * - CategoryFilterBar (by review type) above everything, same as other layouts
 * - No cards, no shadows — just type and bottom rule per row
 *
 * GOOD FOR: Review blogs where the score and headline are strong enough to stand alone.
 * Works with every template via CSS vars + the existing data-score-chip pipeline.
 *
 * MODIFICATION NOTES:
 * - Score size: change width/height on the score chip wrapper in MacroReviewLead/Row
 * - To hide verdict in rows: remove the getVerdict block in MacroReviewRow
 * - To show author: add author name next to type in the meta row
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import type { ReviewsModuleColors, ReviewsModuleCopy } from '@/lib/templates/config';
import { formatDate, getScorePalette, getVerdict, scoreTier } from './reviewsHelpers';

// ── CSS variable tokens ─────────────────────────────────────────────────────

const v = {
  accent:      'var(--template-accent, #e5201b)',
  ink:         'var(--template-ink, #161218)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  mutedPanel:  'var(--template-muted-panel, #f3f4f6)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
};

// ── ScoreChip ───────────────────────────────────────────────────────────────

function ScoreChip({ rating, colors, size = 56 }: { rating: string | null; colors: ReviewsModuleColors; size?: number }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  if (Number.isNaN(score)) return null;
  const palette = getScorePalette(score, colors);
  const display = Number.isInteger(score) ? String(score) : score.toFixed(1);
  return (
    <div
      data-score-chip
      data-score-tier={scoreTier(score)}
      style={{
        width: size, height: size, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: palette.background, color: palette.text,
        fontWeight: 900, fontSize: size >= 64 ? '1.6rem' : '1.1rem',
        letterSpacing: '-0.03em', lineHeight: 1,
        boxShadow: `0 2px 8px ${palette.shadow}`,
      }}
    >
      {display}
    </div>
  );
}

// ── MacroReviewLead ─────────────────────────────────────────────────────────

function MacroReviewLead({ review, colors }: { review: Review; colors: ReviewsModuleColors }) {
  const img = resolveMediaUrl(review.coverImage);
  const score = review.rating ? parseFloat(review.rating) : null;
  const scorePalette = score != null && !Number.isNaN(score) ? getScorePalette(score, colors) : null;
  const date = formatDate(review.publishedAt ?? review.createdAt);

  return (
    <article data-review-macro-lead className="group">
      {/* Top rule — newspaper section divider */}
      <div style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}`, padding: '4px 0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {review.reviewType && (
          <span
            className="font-black uppercase tracking-widest"
            style={{ fontSize: '0.65rem', color: v.accent, background: v.ink, padding: '2px 8px' }}
          >
            {review.reviewType}
          </span>
        )}
        {review.subject && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.06em' }}>
            {review.subject}
          </span>
        )}
        {(review.creator || review.releaseYear) && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.05em' }}>
            {[review.creator, review.releaseYear].filter(Boolean).join(' · ')}
          </span>
        )}
        {date && (
          <span className="font-semibold ml-auto" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.05em' }}>
            {date}
          </span>
        )}
      </div>

      <Link href={`/reviews/${review.slug}`} style={{ textDecoration: 'none' }}>
        {/* Headline first — newspaper style */}
        <h1
          className="font-black leading-[0.92] tracking-tight group-hover:underline underline-offset-4 mb-5"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', color: v.ink }}
        >
          {review.title}
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
              alt={review.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        )}
      </Link>

      {/* Score + verdict below image */}
      {score != null && !Number.isNaN(score) && (
        <div className="flex items-center gap-3 mt-4">
          <ScoreChip rating={review.rating} colors={colors} size={64} />
          {scorePalette && (
            <div>
              <p className="font-black uppercase tracking-wider" style={{ fontSize: '0.7rem', color: v.mutedText }}>Score</p>
              <p className="font-black" style={{ fontSize: '1rem', color: scorePalette.background }}>{getVerdict(score)}</p>
            </div>
          )}
        </div>
      )}

      {/* Verdict if no score */}
      {review.verdict && score == null && (
        <p className="mt-3" style={{ fontSize: '0.9rem', color: v.mutedText, fontStyle: 'italic' }}>
          &ldquo;{review.verdict}&rdquo;
        </p>
      )}
    </article>
  );
}

// ── MacroReviewRow ──────────────────────────────────────────────────────────

function MacroReviewRow({ review, index, colors }: { review: Review; index: number; colors: ReviewsModuleColors }) {
  const img = resolveMediaUrl(review.coverImage);
  const score = review.rating ? parseFloat(review.rating) : null;
  const scorePalette = score != null && !Number.isNaN(score) ? getScorePalette(score, colors) : null;

  return (
    <article
      data-review-macro-row
      className="group"
      style={{ borderBottom: `2px solid ${v.panelBorder}` }}
    >
      <Link
        href={`/reviews/${review.slug}`}
        className="flex items-stretch gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6"
        style={{ textDecoration: 'none' }}
      >
        {/* Score dateline column */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start pt-1 hidden sm:flex"
          style={{ width: 56, borderRight: `2px solid ${v.panelBorder}`, paddingRight: '1rem' }}
        >
          {score != null && !Number.isNaN(score) ? (
            <ScoreChip rating={review.rating} colors={colors} size={50} />
          ) : (
            <span
              className="font-black tabular-nums"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: v.ink, opacity: 0.2 }}
            >
              #{String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          {review.reviewType && (
            <span
              className="inline-block mb-1.5 font-black uppercase tracking-widest"
              style={{ fontSize: '0.62rem', color: v.accent }}
            >
              {review.reviewType}
            </span>
          )}
          <h2
            className="font-black leading-[1.02] tracking-tight group-hover:underline underline-offset-4"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', color: v.ink }}
          >
            {review.title}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2" style={{ fontSize: '0.72rem', color: v.mutedText }}>
            {review.subject && (
              <span style={{ fontWeight: 700, color: v.ink }}>{review.subject}</span>
            )}
            {review.subject && (review.creator || review.releaseYear) && <span>&middot;</span>}
            {(review.creator || review.releaseYear) && (
              <span>{[review.creator, review.releaseYear].filter(Boolean).join(' · ')}</span>
            )}
            {scorePalette && score != null && (
              <>
                <span>&middot;</span>
                <span style={{ fontWeight: 700, color: scorePalette.background }}>{getVerdict(score)}</span>
              </>
            )}
            <span className="hidden sm:inline" aria-hidden style={{ marginLeft: 'auto' }}>#{String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {img && (
          <div
            className="relative overflow-hidden flex-shrink-0 self-center"
            style={{ width: 88, height: 88, background: v.mutedPanel, border: `2px solid ${v.panelBorder}`, borderRadius: 0 }}
          >
            <Image
              src={img}
              alt={review.title}
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

// ── ReviewsLayoutMacro ──────────────────────────────────────────────────────

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  typeCategories: { slug: string; name: string }[];
}

export default function ReviewsLayoutMacro({ reviews, colors, copy, typeCategories }: Props) {
  const [lead, ...rest] = reviews;

  return (
    <div data-reviews-page>
      <CategoryFilterBar categories={typeCategories} basePath="/reviews/type/" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        {/* Lead review */}
        {lead && (
          <div className="mb-16">
            <MacroReviewLead review={lead} colors={colors} />
          </div>
        )}

        {/* Remaining reviews */}
        {rest.length > 0 && (
          <div>
            <MacroSectionLabel label={copy.title ?? 'More Reviews'} />
            <div style={{ borderTop: `1px solid ${v.panelBorder}` }}>
              {rest.map((review, i) => (
                <MacroReviewRow key={review.slug} review={review} index={i + 2} colors={colors} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
