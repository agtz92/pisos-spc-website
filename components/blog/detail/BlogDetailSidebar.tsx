import Link from 'next/link';
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import type { Post } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #111111)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templatePanel = 'var(--template-panel, #ffffff)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sidebar blog post detail layout. A two-column reading experience: the main
 * column carries an optional (non-bleed) cover image, headline, excerpt deck and
 * markdown body, while a sticky right-hand meta card holds the author, publish
 * date, category and tags. Collapses to a single column on small screens.
 *
 * All colors come from --template-* vars so it adapts to every visual template.
 */
export default function BlogDetailSidebar({ post }: { post: Post }) {
  const imageUrl = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const authorAvatarUrl = post.author ? resolveMediaUrl(post.author.avatar) : null;

  return (
    <article
      data-post-detail
      className="max-w-6xl mx-auto px-4 sm:px-6"
      style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}
    >
      {/* Back link */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Link
          data-post-detail-back
          href="/blog"
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: templateMutedText,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          className="transition-colors"
        >
          <span style={{ fontSize: '1rem' }}>←</span> Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-12">
        {/* ── Main reading column ──────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Optional cover image — contained, not full-bleed */}
          {imageUrl && (
            <div
              data-post-detail-hero
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                minHeight: 200,
                maxHeight: 420,
                overflow: 'hidden',
                background: templateMutedPanel,
                borderRadius: 16,
                marginBottom: '2rem',
              }}
            >
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          )}

          {/* Headline */}
          <h1
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              lineHeight: 1.15,
              color: templateInk,
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt / deck */}
          {post.excerpt && (
            <p
              style={{
                marginTop: '1rem',
                fontSize: '1.15rem',
                color: templateMutedText,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Body */}
          <div style={{ marginTop: '2rem' }}>
            <MarkdownRenderer content={post.body ?? ''} />
          </div>

          {/* Bottom back link */}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${templatePanelBorder}` }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                color: templateAccent,
                textDecoration: 'none',
              }}
              className="hover:opacity-75 transition-opacity"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

        {/* ── Sticky meta sidebar ──────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-8 self-start">
          <div
            style={{
              background: templatePanel,
              border: `1px solid ${templatePanelBorder}`,
              borderRadius: 16,
              padding: '1.5rem',
            }}
          >
            {/* Author */}
            {post.author && (
              <div data-post-detail-byline>
                <Link
                  href={`/blog/author/${post.author.slug}`}
                  className="flex items-center gap-3"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {authorAvatarUrl ? (
                    <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <Image
                        src={authorAvatarUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: templateAccent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: templateMutedText,
                      }}
                    >
                      Written by
                    </p>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: templateInk, marginTop: 2 }}>
                      {post.author.name}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Date */}
            {date && (
              <div
                style={{
                  marginTop: post.author ? '1.25rem' : 0,
                  paddingTop: post.author ? '1.25rem' : 0,
                  borderTop: post.author ? `1px solid ${templatePanelBorder}` : undefined,
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: templateMutedText,
                  }}
                >
                  Published
                </p>
                <p style={{ fontSize: '0.85rem', color: templateInk, marginTop: 4 }}>{date}</p>
              </div>
            )}

            {/* Category */}
            {post.category && (
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: `1px solid ${templatePanelBorder}`,
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: templateMutedText,
                    marginBottom: 8,
                  }}
                >
                  Category
                </p>
                <Link
                  data-post-category
                  href={`/blog/category/${post.category.slug}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.7rem',
                    background: templateAccent,
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  {post.category.name}
                </Link>
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: `1px solid ${templatePanelBorder}`,
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: templateMutedText,
                    marginBottom: 8,
                  }}
                >
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      data-post-detail-tag
                      href={`/blog/tag/${tag.slug}`}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: templateMutedText,
                        border: `1px solid ${templatePanelBorder}`,
                        borderRadius: 999,
                        padding: '0.15rem 0.6rem',
                        textDecoration: 'none',
                      }}
                      className="transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
