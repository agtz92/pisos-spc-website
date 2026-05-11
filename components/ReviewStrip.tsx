'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import type { ReviewsModuleColors } from '@/lib/templates/config';

const PER_PAGE = 4;

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

export default function ReviewStrip({
  reviews,
  heading,
  colors,
}: {
  reviews: Review[];
  heading: string;
  colors: ReviewsModuleColors;
}) {
  const sorted = [...reviews].sort((a, b) => {
    const sa = a.rating ? parseFloat(a.rating) : 0;
    const sb = b.rating ? parseFloat(b.rating) : 0;
    return sb - sa;
  });

  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const pendingPage = useRef<number | null>(null);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const visible = sorted.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => {
      if (pendingPage.current !== null) {
        setPage(pendingPage.current);
        pendingPage.current = null;
      }
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [fading]);

  function changePage(next: number, dir: 'left' | 'right') {
    if (fading) return;
    pendingPage.current = next;
    setDirection(dir);
    setFading(true);
  }

  return (
    <section>
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 4, height: 20, background: 'var(--template-accent, #ec0f7f)', flexShrink: 0 }} />
          <h2 style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--template-ink, #161218)',
          }}>
            {heading}
          </h2>
        </div>

        {/* Arrow buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => changePage(Math.max(0, page - 1), 'left')}
            disabled={page === 0}
            aria-label="Previous"
            style={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--template-panel-border, #e5e7eb)',
              background: page === 0 ? 'transparent' : 'var(--template-panel, #fff)',
              color: page === 0 ? 'var(--template-ink, #161218)' : 'var(--template-ink, #161218)',
              opacity: page === 0 ? 0.3 : 1,
              cursor: page === 0 ? 'default' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => changePage(Math.min(totalPages - 1, page + 1), 'right')}
            disabled={page >= totalPages - 1}
            aria-label="Next"
            style={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--template-panel-border, #e5e7eb)',
              background: page >= totalPages - 1 ? 'transparent' : 'var(--template-panel, #fff)',
              color: 'var(--template-ink, #161218)',
              opacity: page >= totalPages - 1 ? 0.3 : 1,
              cursor: page >= totalPages - 1 ? 'default' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--template-panel-border, #e5e7eb)', marginBottom: '1.1rem' }} />

      {/* ── Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        padding: '10px 20px 20px 0',
        margin: '-10px -20px -20px 0',
        opacity: fading ? 0 : 1,
        transform: fading
          ? `translateX(${direction === 'right' ? '-12px' : '12px'})`
          : 'translateX(0)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        {visible.map((review) => {
          const imageUrl = resolveMediaUrl(review.coverImage);
          const score = review.rating ? parseFloat(review.rating) : null;
          const tier = score != null && !Number.isNaN(score) ? getScoreTier(score) : null;
          const palette = tier ? colors.scorePalettes[tier] : null;
          const typeStyle = colors.typeStyles[review.reviewType] ?? colors.typeStyles.other;
          return (
            <article
              key={review.slug}
              data-review-strip-card
              className="group"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--template-panel, #fff)',
                border: '1px solid var(--template-panel-border, #e5e7eb)',
                borderLeft: palette ? `4px solid ${palette.background}` : '4px solid var(--template-panel-border, #e5e7eb)',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <Link
                href={`/reviews/${review.slug}`}
                style={{ display: 'block', position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', flexShrink: 0 }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={review.subject || review.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--template-muted-panel, #f3f4f6)' }} />
                )}
              </Link>

              {/* Content */}
              <div style={{ padding: '0.75rem 0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: 'var(--template-ink, #161218)',
                }}>
                  <Link href={`/reviews/${review.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}
                    className="hover:underline">
                    {review.subject || review.title}
                  </Link>
                </h3>

                <span
                  data-review-type-chip
                  style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    background: typeStyle.bg,
                    color: typeStyle.text,
                    border: `1px solid ${typeStyle.text}22`,
                  }}
                >
                  {review.reviewType}
                </span>
              </div>

              {/* Score section */}
              {palette && score != null && (
                <div style={{
                  padding: '0.6rem 0.875rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}>
                  <div>
                    <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--template-ink, #161218)', opacity: 0.4, marginBottom: 2 }}>
                      Score
                    </p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 800, color: palette.background, lineHeight: 1.2 }}>
                      {getVerdict(score)}
                    </p>
                  </div>
                  <div
                    data-score-chip
                    data-score-tier={tier}
                    style={{
                      width: 44, height: 44, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: palette.background,
                      color: palette.text,
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {Number.isInteger(score) ? String(score) : score.toFixed(1)}
                  </div>
                </div>
              )}

              {/* Score bar */}
              {palette && score != null && (
                <div style={{ margin: '0.6rem 0.875rem 0.875rem', height: 4, background: 'var(--template-panel-border, #e5e7eb)' }}>
                  <div style={{
                    height: '100%',
                    width: `${(score / 10) * 100}%`,
                    background: palette.background,
                  }} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
