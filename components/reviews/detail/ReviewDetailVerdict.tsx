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
 * Score / verdict-forward treatment of the review detail page.
 *
 * The score and verdict are the heroes. A bold header band carries the subject
 * title + creator/year + type chip alongside a LARGE numeric score rendered in a
 * rounded chip (with the StarRating beneath it). The verdict then lands
 * immediately as a prominent full-width pull-quote near the top. Below: a
 * two-column pros/cons grid, the review body, an optional smaller cover image,
 * and the author block.
 */
export default function ReviewDetailVerdict({ review }: { review: Review }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const score = review.rating ? parseFloat(review.rating) : null;
  const subtitle = [review.creator, review.releaseYear].filter(Boolean).join(' · ');

  return (
    <article data-review-detail style={{ maxWidth: '56rem', margin: '0 auto' }}>
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

      {/* Header band — subject identity (left) + big score chip (right) */}
      <header
        data-review-cover
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderRadius: 20,
          border: `1px solid ${templatePanelBorder}`,
          background: 'var(--template-panel, #ffffff)',
          padding: 'clamp(1.5rem, 4vw, 2.25rem)',
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={review.reviewType} />
            {review.genre && (
              <span style={{ fontSize: '0.75rem', color: templateMutedText }}>{review.genre}</span>
            )}
          </div>
          {review.subject && (
            <h1
              style={{
                fontSize: 'clamp(1.875rem, 5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                color: templateInk,
              }}
            >
              {review.subject}
            </h1>
          )}
          {subtitle && (
            <p style={{ color: templateMutedText, fontSize: '0.95rem' }}>{subtitle}</p>
          )}
        </div>

        {/* Big score chip */}
        {score !== null && (
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div
              className="flex flex-col items-center justify-center"
              style={{
                background: templateAccent,
                borderRadius: 24,
                padding: '1.1rem 1.6rem',
                minWidth: 132,
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(2.75rem, 8vw, 3.75rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {score.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                out of 10
              </span>
            </div>
            <StarRating rating={review.rating} />
          </div>
        )}
      </header>

      {/* Verdict — prominent full-width pull-quote near the top */}
      {review.verdict && (
        <div
          data-review-verdict-box
          style={{
            marginTop: '2rem',
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
              fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

      {/* Review title + body */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: templateInk, lineHeight: 1.15 }}>
          {review.title}
        </h2>
        {review.body && (
          <div className="mt-4 prose prose-sm max-w-none">
            <MarkdownRenderer content={review.body} />
          </div>
        )}
      </div>

      {/* Cover image — optional, smaller, supporting */}
      {imageUrl && (
        <div data-review-cover className="mt-8 relative aspect-video rounded-xl overflow-hidden">
          <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover" />
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
