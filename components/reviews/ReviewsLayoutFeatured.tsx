/**
 * ReviewsLayoutFeatured
 *
 * CONCEPT: A full editorial reviews front page — the top-scored or most recent review
 * gets a cinematic hero, the next 2–3 appear in a side-by-side panel, a horizontal
 * score rail shows the next batch, and the remainder fill a standard grid below.
 * Mimics the layout of a professional review publication (e.g. Metacritic, IGN).
 *
 * DESIGN DECISIONS:
 * - Hero review takes the full top row with a large image, score chip overlay, and gradient scrim
 * - Side panel shows 2 reviews with horizontal card layout (thumbnail left, details right)
 * - Rail shows 4–5 reviews as compact score + title tiles in a horizontal strip
 * - Remaining reviews fall into a standard ReviewCard grid
 * - Score chips use the scorePalettes colors (excellent/great/good/mixed/poor) from config
 * - Layout uses the `layout` prop (sideReviewCount, railReviewCount) from module config
 *   so the split between hero/side/rail/grid can be tuned from the CMS
 *
 * GOOD FOR: Media review sites (games, films, music, books) that publish frequently
 * and want to give prominent visual weight to the latest or best review.
 *
 * MODIFICATION NOTES:
 * - Hero image height: change `aspectRatio: '21 / 9'` in the hero section
 * - Side review count: change `layout.sideReviewCount` in the module config (CMS setting)
 * - Rail review count: change `layout.railReviewCount` in the module config (CMS setting)
 * - To surface the top-scored review as hero (instead of most recent): sort `reviews` by
 *   `parseFloat(rating)` before this component receives them
 * - Score chip size on hero: edit the width/height/fontSize in the hero score chip inline style
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import ReviewCard from '@/components/ReviewCard';
import ReviewStrip from '@/components/ReviewStrip';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { getModuleConfig } from '@/lib/templates/config';
import type { ReviewsModuleColors, ReviewsModuleCopy, ReviewsModuleLayout } from '@/lib/templates/config';
import { formatDate, getScorePalette, getVerdict, scoreTier } from './reviewsHelpers';

const reviewsConfig = getModuleConfig('reviews');

function ScoreBox({ rating, colors, size = 'lg' }: { rating: string | null; colors: ReviewsModuleColors; size?: 'lg' | 'sm' | 'xs' }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  if (Number.isNaN(score)) return null;
  const palette = getScorePalette(score, colors);
  const dims: Record<string, { dim: number; font: string }> = {
    lg: { dim: 72, font: '2rem' }, sm: { dim: 46, font: '1.25rem' }, xs: { dim: 34, font: '0.9rem' },
  };
  const { dim, font } = dims[size];
  const display = Number.isInteger(score) ? String(score) : score.toFixed(1);
  return (
    <div data-score-chip data-score-tier={scoreTier(score)} style={{ width: dim, height: dim, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.background, color: palette.text, fontWeight: 900, fontSize: font, letterSpacing: '-0.03em', lineHeight: 1 }}>
      {display}
    </div>
  );
}

function FeaturedBadge({ template, text }: { template: string; text: string }) {
  if (template === 'retro') {
    return (
      <span data-featured-badge style={{ alignSelf: 'flex-start', display: 'inline-block', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '0.18rem 0.65rem', background: 'var(--template-accent)', color: 'var(--template-ink)', border: '2px solid var(--template-ink)', borderRadius: 0 }}>{text}</span>
    );
  }
  if (template === 'futuristic') {
    return (
      <span data-featured-badge style={{ alignSelf: 'flex-start', display: 'inline-block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, padding: '0.18rem 0.65rem', background: 'transparent', color: 'var(--template-accent)', border: '1px solid var(--template-accent)', borderRadius: 2, boxShadow: '0 0 8px color-mix(in srgb, var(--template-accent) 35%, transparent)' }}>{text}</span>
    );
  }
  if (template === 'executive') {
    return (
      <span data-featured-badge style={{ alignSelf: 'flex-start', display: 'inline-block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '0.18rem 0.65rem', background: 'color-mix(in srgb, var(--template-accent) 8%, var(--template-panel, #fff))', color: 'var(--template-accent)', border: '1px solid color-mix(in srgb, var(--template-accent) 30%, transparent)', borderRadius: 3 }}>{text}</span>
    );
  }
  // modern default — pill, soft tinted bg
  return (
    <span data-featured-badge style={{ alignSelf: 'flex-start', display: 'inline-block', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '0.2rem 0.75rem', background: 'color-mix(in srgb, var(--template-accent) 14%, var(--template-panel, #fff))', color: 'var(--template-accent)', border: '1px solid color-mix(in srgb, var(--template-accent) 28%, transparent)', borderRadius: 999 }}>{text}</span>
  );
}

function FeaturedReview({ review, colors, template }: { review: Review; colors: ReviewsModuleColors; template: string }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const date = formatDate(review.publishedAt ?? review.createdAt);
  const score = review.rating ? parseFloat(review.rating) : null;
  const scorePalette = score != null && !Number.isNaN(score) ? getScorePalette(score, colors) : null;
  const typeStyle = colors.typeStyles[review.reviewType] ?? colors.typeStyles.other;
  const chipRadius = template === 'retro' ? 0 : template === 'futuristic' ? 2 : template === 'executive' ? 3 : 4;

  return (
    <article data-featured-review className="group overflow-hidden" style={{ '--score-shadow': scorePalette?.shadow ?? 'transparent', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340, border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)' } as React.CSSProperties}>
      <Link href={`/reviews/${review.slug}`} style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
        {imageUrl ? <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority /> : <div style={{ position: 'absolute', inset: 0, background: 'var(--template-muted-panel, #f3f4f6)' }} />}
        <span data-review-type-chip style={{ position: 'absolute', top: 14, left: 14, zIndex: 2, padding: '0.25rem 0.65rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.text}22`, borderRadius: chipRadius }}>{review.reviewType}</span>
      </Link>
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderLeft: '1px solid var(--template-panel-border, #e5e7eb)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
        <FeaturedBadge template={template} text="Featured" />
        {scorePalette && score != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ScoreBox rating={review.rating} colors={colors} size="lg" />
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--template-muted-text, #6b7280)', marginBottom: 2 }}>Our Verdict</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em', color: scorePalette.background }}>{getVerdict(score)}</p>
            </div>
          </div>
        )}
        <div>
          {review.subject && (
            <p style={{ fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.3rem' }}>
              {review.subject}
              {(review.creator || review.releaseYear) && <span style={{ color: 'var(--template-muted-text, #6b7280)', fontWeight: 600, marginLeft: '0.5rem' }}>{[review.creator, review.releaseYear].filter(Boolean).join(' · ')}</span>}
            </p>
          )}
          <h1 style={{ fontWeight: 900, lineHeight: 1.08, fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}>
            <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{review.title}</Link>
          </h1>
        </div>
        {review.verdict && <p style={{ color: 'var(--template-ink, #161218)', opacity: 0.6, fontSize: '0.88rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{review.verdict}</p>}
        {review.pros && review.pros.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {review.pros.slice(0, 3).map((pro, i) => (
              <span key={i} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', background: 'color-mix(in srgb, var(--template-accent, #ec0f7f) 10%, transparent)', color: 'var(--template-accent, #ec0f7f)', border: '1px solid color-mix(in srgb, var(--template-accent, #ec0f7f) 22%, transparent)' }}>+ {pro}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--template-muted-text, #6b7280)', marginTop: 'auto' }}>
          {review.author && <span style={{ fontWeight: 700, opacity: 1 }}>{review.author.name}</span>}
          {review.author && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </article>
  );
}

function ReviewRail({ reviews, railHeading, colors }: { reviews: Review[]; railHeading: string; colors: ReviewsModuleColors }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', flexShrink: 0 }} />
        <h2 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--template-ink, #161218)', opacity: 0.7, margin: 0 }}>{railHeading}</h2>
        <div style={{ flex: 1, height: 1, background: `var(--reviews-rail-border, ${colors.railBorder})` }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reviews.map((review) => {
          const score = review.rating ? parseFloat(review.rating) : null;
          return (
            <article key={review.slug} data-review-rail-item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.85rem 1rem', border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)' }}>
              {score != null && !Number.isNaN(score) && <ScoreBox rating={review.rating} colors={colors} size="sm" />}
              <div style={{ minWidth: 0 }}>
                {review.subject && <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--template-muted-text, #6b7280)', marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{review.subject}</p>}
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--template-ink, #161218)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                  <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:underline">{review.title}</Link>
                </h3>
                {score != null && !Number.isNaN(score) && <p style={{ fontSize: '0.62rem', fontWeight: 700, marginTop: '0.2rem', color: getScorePalette(score, colors).background }}>{getVerdict(score)}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  layout: ReviewsModuleLayout;
  typeCategories: { slug: string; name: string }[];
  template: string;
}

export default function ReviewsLayoutFeatured({ reviews, colors, copy, layout, typeCategories, template }: Props) {
  const [featured, ...rest] = reviews;
  const sideReviews = rest.slice(0, layout.sideReviewCount);
  const railStart = layout.sideReviewCount;
  const railEnd = railStart + layout.railReviewCount;
  const railReviews = rest.slice(railStart, railEnd);
  const remaining = rest.slice(railEnd);
  const topRatedPool = rest.filter((r) => r.rating != null).slice(0, 8);

  return (
    <div data-reviews-page>
      <CategoryFilterBar categories={typeCategories} basePath="/reviews/type/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-12">
        <FeaturedReview review={featured} colors={colors} template={template} />
        {sideReviews.length > 0 && (
          <section style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))' }}>
            {sideReviews.map((r) => <ReviewCard key={r.slug} review={r} reviewColors={colors} />)}
          </section>
        )}
        {railReviews.length > 0 && <ReviewRail reviews={railReviews} railHeading={copy.railHeading} colors={colors} />}
        {topRatedPool.length > 0 && <ReviewStrip reviews={topRatedPool} heading="Top Rated" colors={colors} />}
        {remaining.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--template-ink, #161218)', opacity: 0.7 }}>{copy.moreReviewsLabel}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
            </div>
            <div className={`grid gap-8 ${reviewsConfig.layout.remainingGridClassName}`}>
              {remaining.map((r) => <ReviewCard key={r.slug} review={r} reviewColors={colors} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
