import Link from 'next/link';
import Image from 'next/image';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { getModuleConfig } from '@/lib/templates/config';
import type { ReviewsModuleColors } from '@/lib/templates/config';

const reviewsConfig = getModuleConfig('reviews');

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getScoreTier(score: number) {
  if (score >= 9.5) return 'excellent';
  if (score >= 7.5) return 'great';
  if (score >= 6.1) return 'good';
  if (score >= 4.0) return 'mixed';
  return 'poor';
}

function getVerdict(score: number): string {
  if (score >= 9.5) return 'Universal Acclaim';
  if (score >= 7.5) return 'Generally Favorable';
  if (score >= 6.1) return 'Mostly Positive';
  if (score >= 4.0) return 'Mixed or Average';
  if (score >= 2.0) return 'Generally Unfavorable';
  return 'Overwhelming Dislike';
}

function ScoreBadge({ rating, colors }: { rating: string | null; colors?: ReviewsModuleColors }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  if (Number.isNaN(score)) return null;
  const tier = getScoreTier(score);
  const resolvedColors = colors ?? reviewsConfig.colors;
  const palette = resolvedColors.scorePalettes[tier];
  const display = Number.isInteger(score) ? String(score) : score.toFixed(1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      {/* Square score box */}
      <div
        data-score-chip
        data-score-tier={tier}
        style={{
          width: 44, height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: palette.background,
          color: palette.text,
          fontWeight: 900,
          fontSize: '1.15rem',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {display}
      </div>
      {/* Verdict */}
      <div>
        <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--template-muted-text, #6b7280)', marginBottom: 1 }}>
          Score
        </p>
        <p style={{ fontSize: '0.78rem', fontWeight: 800, color: palette.background, lineHeight: 1.2 }}>
          {getVerdict(score)}
        </p>
      </div>
    </div>
  );
}

export default function ReviewCard({ review, reviewColors }: { review: Review; reviewColors?: ReviewsModuleColors }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const date = formatDate(review.publishedAt ?? review.createdAt);
  const resolvedColors = reviewColors ?? reviewsConfig.colors;
  const typeStyle = resolvedColors.typeStyles[review.reviewType] ?? resolvedColors.typeStyles.other;
  const score = review.rating ? parseFloat(review.rating) : null;
  const tier = score != null && !Number.isNaN(score) ? getScoreTier(score) : null;
  const palette = tier ? resolvedColors.scorePalettes[tier] : null;

  return (
    <article
      data-review-card
      className="group overflow-hidden transition-shadow hover:shadow-md"
      style={{
        borderRadius: resolvedColors.reviewCard.borderRadius,
        boxShadow: resolvedColors.reviewCard.shadow,
        background: 'var(--template-panel, #ffffff)',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {imageUrl && (
        <Link href={`/reviews/${review.slug}`} className="block aspect-[16/10] relative overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={review.subject || review.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="p-5" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Type chip + category */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            data-review-type-chip
            className="px-2 py-0.5 text-xs font-bold uppercase tracking-[0.08em]"
            style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.text}22` }}
          >
            {review.reviewType}
          </span>
          {review.category && (
            <Link
              href={`/reviews/category/${review.category.slug}`}
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--template-muted-text, #6b7280)', textDecoration: 'none' }}
            >
              {review.category.name}
            </Link>
          )}
        </div>

        {review.subject && (
          <p className="text-lg font-black" style={{ letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)' }}>
            {review.subject}
          </p>
        )}

        {(review.creator || review.releaseYear) && (
          <p className="mt-1 text-sm" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
            {[review.creator, review.releaseYear].filter(Boolean).join(' · ')}
          </p>
        )}

        <h2 className="mt-3 text-xl font-black leading-tight" style={{ letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)' }}>
          <Link
            href={`/reviews/${review.slug}`}
            className="transition-colors"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {review.title}
          </Link>
        </h2>

        <div style={{ flex: 1 }} />

        {/* Score section with border separator */}
        <div style={{
          marginTop: '1rem',
          paddingTop: '0.9rem',
          borderTop: '1px solid var(--template-panel-border, #e5e7eb)',
        }}>
          <ScoreBadge rating={review.rating} colors={resolvedColors} />
        </div>

        {/* Score bar */}
        {palette && score != null && (
          <div style={{ marginTop: '0.65rem', height: 4, background: 'var(--template-panel-border, #e5e7eb)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(score / 10) * 100}%`,
              background: palette.background,
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
          {review.author && <span className="font-semibold">{review.author.name}</span>}
          {review.author && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </article>
  );
}
