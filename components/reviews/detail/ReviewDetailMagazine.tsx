import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import {
  TypeBadge,
  StarRating,
  templateInk,
  templateMutedText,
  templatePanelBorder,
  templateAccent,
} from './_shared';

/**
 * Magazine / critic treatment of the review detail page.
 *
 * A cinematic cover hero anchors the layout — type chip + subject title +
 * creator/year sit white over a dark gradient bottom-left, with a large
 * numeric score chip bottom-right. Below: the review title as a section
 * heading, the body, a full-width verdict pull-quote, a two-column pros/cons
 * grid, and the author block. Falls back to a plain header when no cover image.
 */
export default function ReviewDetailMagazine({ review }: { review: Review }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const score = review.rating ? parseFloat(review.rating) : null;
  const subtitle = [review.creator, review.releaseYear].filter(Boolean).join(' · ');

  return (
    <article data-review-detail style={{ maxWidth: '60rem', margin: '0 auto' }}>
      <Link
        href="/reviews"
        data-review-breadcrumb
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.82rem',
          fontWeight: 600,
          color: templateMutedText,
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
        className="transition-colors"
      >
        ← Back to Reviews
      </Link>

      {/* Cover hero */}
      {imageUrl ? (
        <div
          data-review-cover
          className="relative overflow-hidden rounded-2xl"
          style={{ height: '55vh', maxHeight: 520, minHeight: 320 }}
        >
          <Image
            src={imageUrl}
            alt={review.subject || review.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)',
            }}
          />

          {/* Bottom-left: type + subject + creator/year */}
          <div
            className="absolute left-0 bottom-0 flex flex-col gap-2"
            style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem)', maxWidth: '75%' }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={review.reviewType} />
              {review.genre && (
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{review.genre}</span>
              )}
            </div>
            {review.subject && (
              <h1
                style={{
                  fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: '#ffffff',
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}
              >
                {review.subject}
              </h1>
            )}
            {subtitle && (
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{subtitle}</p>
            )}
          </div>

          {/* Bottom-right: big score chip */}
          {score !== null && (
            <div
              className="absolute right-0 bottom-0 flex items-center"
              style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem)' }}
            >
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 20,
                  padding: '0.85rem 1.25rem',
                  minWidth: 92,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 2.75rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: templateInk,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {score.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: templateMutedText, marginTop: 2 }}>
                  / 10
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Plain header fallback (no cover image) */
        <div data-review-cover style={{ marginBottom: '0.5rem' }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <TypeBadge type={review.reviewType} />
            {review.genre && (
              <span style={{ fontSize: '0.75rem', color: templateMutedText }}>{review.genre}</span>
            )}
          </div>
          {review.subject && (
            <h1 style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 800, color: templateInk }}>
              {review.subject}
            </h1>
          )}
          {subtitle && <p style={{ marginTop: '0.25rem', color: templateMutedText }}>{subtitle}</p>}
          <div style={{ marginTop: '1rem' }}>
            <StarRating rating={review.rating} />
          </div>
        </div>
      )}

      {/* Review title + body */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: templateInk, lineHeight: 1.15 }}>
          {review.title}
        </h2>
        {review.body && (
          <div className="mt-4 prose prose-sm max-w-none">
            <MarkdownRenderer content={review.body} />
          </div>
        )}
      </div>

      {/* Verdict — full-width pull-quote */}
      {review.verdict && (
        <div
          data-review-verdict-box
          style={{
            marginTop: '2.5rem',
            borderRadius: 16,
            borderLeft: '6px solid #facc15',
            background: 'rgba(234,179,8,0.08)',
            padding: 'clamp(1.5rem, 4vw, 2.25rem)',
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: '#fbbf24',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.8rem',
            }}
          >
            Verdict
          </h3>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              lineHeight: 1.5,
              fontWeight: 600,
              color: templateInk,
            }}
          >
            {review.verdict}
          </p>
        </div>
      )}

      {/* Pros & Cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {review.pros.length > 0 && (
            <div
              data-review-pros-box
              style={{
                borderRadius: 12,
                border: '1px solid rgba(34,197,94,0.35)',
                background: 'rgba(34,197,94,0.1)',
                padding: '1.25rem',
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  color: '#4ade80',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>+</span> Pros
              </h3>
              <ul className="space-y-1.5">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ fontSize: '0.875rem', color: templateInk }}>
                    <span style={{ marginTop: 2, flexShrink: 0, color: '#4ade80' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div
              data-review-cons-box
              style={{
                borderRadius: 12,
                border: '1px solid rgba(239,68,68,0.35)',
                background: 'rgba(239,68,68,0.08)',
                padding: '1.25rem',
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  color: '#f87171',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>−</span> Cons
              </h3>
              <ul className="space-y-1.5">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ fontSize: '0.875rem', color: templateInk }}>
                    <span style={{ marginTop: 2, flexShrink: 0, color: '#f87171' }}>✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Author */}
      {review.author && (
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${templatePanelBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {review.author.avatar ? (
            <Image
              src={resolveMediaUrl(review.author.avatar) ?? ''}
              alt={review.author.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: templateAccent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {review.author.name.charAt(0)}
            </div>
          )}
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: templateInk }}>{review.author.name}</p>
            {review.author.bio && (
              <p
                className="line-clamp-1"
                style={{ fontSize: '0.75rem', color: templateMutedText }}
              >
                {review.author.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
