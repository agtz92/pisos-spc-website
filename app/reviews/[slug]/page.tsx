import { getReview, getReviews, resolveMediaUrl } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getModuleConfig } from '@/lib/templates/config';

export const revalidate = 60;

export async function generateStaticParams() {
  try { const r = await getReviews(); return r.map((item) => ({ slug: item.slug })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const review = await getReview(slug);
    if (!review) return {};
    return { title: review.title };
  } catch { return {}; }
}

const templateInk = 'var(--template-ink, #111111)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';
const templateAccent = 'var(--template-accent, #e5201b)';

const reviewsConfig = getModuleConfig('reviews');

function TypeBadge({ type }: { type: string }) {
  const style = reviewsConfig.colors.typeStyles[type] ?? reviewsConfig.colors.typeStyles['other' as keyof typeof reviewsConfig.colors.typeStyles];
  if (!style) return null;
  return (
    <span
      data-review-type-chip
      style={{
        background: style.bg,
        color: style.text,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '0.2rem 0.6rem',
        borderRadius: 999,
        textTransform: 'capitalize',
      }}
    >
      {type}
    </span>
  );
}

function StarRating({ rating }: { rating: string | null }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex">
        <span style={{ color: templatePanelBorder, fontSize: '1.875rem', letterSpacing: '-0.025em' }}>★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap"
          style={{ color: '#facc15', fontSize: '1.875rem', letterSpacing: '-0.025em', width: `${pct}%` }}
        >★★★★★</span>
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: templateInk, fontVariantNumeric: 'tabular-nums' }}>
        {score.toFixed(1)}
      </span>
      <span style={{ color: templateMutedText }}>/ 10</span>
    </div>
  );
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = await getReview(slug).catch(() => null);
  if (!review) notFound();

  const imageUrl = resolveMediaUrl(review.coverImage);

  return (
    <article data-review-detail style={{ maxWidth: '48rem', margin: '0 auto' }}>
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

      {/* Type + category */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TypeBadge type={review.reviewType} />
        {review.genre && (
          <span style={{ fontSize: '0.75rem', color: templateMutedText }}>{review.genre}</span>
        )}
      </div>

      {/* Subject */}
      {review.subject && (
        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: templateInk }}>
          {review.subject}
        </h1>
      )}
      {(review.creator || review.releaseYear) && (
        <p style={{ marginTop: '0.25rem', color: templateMutedText }}>
          {[review.creator, review.releaseYear].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* Rating */}
      <div style={{ marginTop: '1rem' }}>
        <StarRating rating={review.rating} />
      </div>

      {imageUrl && (
        <div data-review-cover className="mt-8 relative aspect-video rounded-xl overflow-hidden">
          <Image src={imageUrl} alt={review.subject || review.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Review title */}
      <h2 style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 800, color: templateInk }}>
        {review.title}
      </h2>

      {/* Body */}
      {review.body && (
        <div className="mt-4 prose prose-sm max-w-none">
          <MarkdownRenderer content={review.body} />
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

      {/* Verdict */}
      {review.verdict && (
        <div
          data-review-verdict-box
          style={{
            marginTop: '2rem',
            borderRadius: 12,
            borderLeft: '4px solid #facc15',
            background: 'rgba(234,179,8,0.08)',
            padding: '1.25rem',
          }}
        >
          <h3 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '0.5rem' }}>Verdict</h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: templateInk }}>{review.verdict}</p>
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
