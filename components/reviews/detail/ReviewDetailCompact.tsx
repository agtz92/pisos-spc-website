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
 * Compact / editorial treatment of the review detail page.
 *
 * A clean, dense single-column read with minimal chrome: a small type chip,
 * subject + creator/year, and an inline StarRating sit in a tight masthead with
 * an optional small cover thumbnail. Tight spacing throughout — the body leads,
 * followed by a compact two-column pros/cons block, a one-line verdict, and a
 * trimmed author byline. Understated and information-dense.
 */
export default function ReviewDetailCompact({ review }: { review: Review }) {
  const imageUrl = resolveMediaUrl(review.coverImage);
  const subtitle = [review.creator, review.releaseYear].filter(Boolean).join(' · ');

  return (
    <article data-review-detail className="max-w-2xl mx-auto">
      <Link
        href="/reviews"
        data-review-breadcrumb
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.78rem',
          fontWeight: 600,
          color: templateMutedText,
          textDecoration: 'none',
          marginBottom: '1rem',
        }}
        className="transition-colors"
      >
        ← Back to Reviews
      </Link>

      {/* Tight masthead — optional thumbnail + identity */}
      <header className="flex items-start gap-4">
        {imageUrl && (
          <div
            data-review-cover
            className="relative shrink-0 overflow-hidden rounded-lg"
            style={{ width: 72, height: 72 }}
          >
            <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={review.reviewType} />
            {review.genre && (
              <span style={{ fontSize: '0.72rem', color: templateMutedText }}>{review.genre}</span>
            )}
          </div>
          {review.subject && (
            <h1
              style={{
                marginTop: '0.4rem',
                fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: templateInk,
              }}
            >
              {review.subject}
            </h1>
          )}
          {subtitle && (
            <p style={{ marginTop: '0.15rem', fontSize: '0.82rem', color: templateMutedText }}>{subtitle}</p>
          )}
        </div>
      </header>

      {/* Inline rating */}
      <div style={{ marginTop: '0.75rem' }}>
        <StarRating rating={review.rating} />
      </div>

      {/* Review title + body */}
      <h2
        style={{
          marginTop: '1.5rem',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: templateInk,
          lineHeight: 1.2,
        }}
      >
        {review.title}
      </h2>
      {review.body && (
        <div className="mt-3 prose prose-sm max-w-none">
          <MarkdownRenderer content={review.body} />
        </div>
      )}

      {/* Compact pros & cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div
          className="mt-6 grid gap-4 sm:grid-cols-2"
          style={{
            borderTop: `1px solid ${templatePanelBorder}`,
            paddingTop: '1.25rem',
          }}
        >
          {review.pros.length > 0 && (
            <div data-review-pros-box>
              <h3
                style={{
                  fontWeight: 700,
                  color: '#4ade80',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                }}
              >
                Pros
              </h3>
              <ul className="space-y-1">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5" style={{ fontSize: '0.82rem', color: templateInk }}>
                    <span style={{ marginTop: 1, flexShrink: 0, color: '#4ade80' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div data-review-cons-box>
              <h3
                style={{
                  fontWeight: 700,
                  color: '#f87171',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                }}
              >
                Cons
              </h3>
              <ul className="space-y-1">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5" style={{ fontSize: '0.82rem', color: templateInk }}>
                    <span style={{ marginTop: 1, flexShrink: 0, color: '#f87171' }}>✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Verdict — one-line */}
      {review.verdict && (
        <div
          data-review-verdict-box
          style={{
            marginTop: '1.5rem',
            borderLeft: '4px solid #facc15',
            background: 'rgba(234,179,8,0.08)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: templateInk }}>
            <span
              style={{
                fontWeight: 700,
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.72rem',
                marginRight: '0.5rem',
              }}
            >
              Verdict
            </span>
            {review.verdict}
          </p>
        </div>
      )}

      {/* Author — trimmed byline */}
      {review.author && (
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1rem',
            borderTop: `1px solid ${templatePanelBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          {review.author.avatar ? (
            <Image
              src={resolveMediaUrl(review.author.avatar) ?? ''}
              alt={review.author.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: templateAccent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {review.author.name.charAt(0)}
            </div>
          )}
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: templateInk }}>
            {review.author.name}
          </p>
        </div>
      )}
    </article>
  );
}
