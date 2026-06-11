import Link from 'next/link';
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import type { Post } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #111111)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
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
 * Immersive / magazine blog post detail layout. The cover image becomes a
 * full-bleed cinematic hero banner with the category chip, headline, excerpt
 * and byline overlaid in white over a dark gradient. The article body then
 * flows in a narrow reading column below.
 *
 * When there is no cover image we fall back to a plain, non-overlaid title
 * block so the page never looks broken.
 *
 * All colors come from --template-* vars so it adapts to every visual template.
 */
export default function BlogDetailImmersive({ post }: { post: Post }) {
  const imageUrl = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const authorAvatarUrl = post.author ? resolveMediaUrl(post.author.avatar) : null;

  return (
    <article data-post-detail>
      {imageUrl ? (
        /* ── Full-bleed immersive hero with overlaid header ──────────── */
        <header
          style={{
            position: 'relative',
            width: '100%',
            height: '60vh',
            maxHeight: 560,
            minHeight: 360,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark gradient overlay so overlaid text stays legible */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 100%)',
            }}
          />

          {/* Overlaid header content */}
          <div
            className="relative max-w-4xl mx-auto px-4 sm:px-6 w-full"
            style={{ paddingBottom: '2.5rem', paddingTop: '2.5rem', color: '#fff' }}
          >
            {post.category && (
              <Link
                data-post-category
                href={`/blog/category/${post.category.slug}`}
                style={{
                  display: 'inline-block',
                  marginBottom: '1rem',
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
            )}

            <h1
              style={{
                fontWeight: 800,
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                lineHeight: 1.1,
                color: '#fff',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 20px rgba(0,0,0,0.35)',
              }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                style={{
                  marginTop: '1rem',
                  fontSize: '1.15rem',
                  color: 'rgba(255,255,255,0.88)',
                  lineHeight: 1.6,
                  maxWidth: '42rem',
                  textShadow: '0 1px 12px rgba(0,0,0,0.35)',
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Byline */}
            <div
              data-post-detail-byline
              className="mt-5 flex items-center gap-3 flex-wrap"
            >
              {post.author ? (
                <Link
                  href={`/blog/author/${post.author.slug}`}
                  className="flex items-center gap-2.5"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {authorAvatarUrl ? (
                    <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.7)' }}>
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
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: templateAccent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {post.author.name}
                    </p>
                    {date && (
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.78)', marginTop: 1 }}>
                        {date}
                      </p>
                    )}
                  </div>
                </Link>
              ) : (
                date && (
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>{date}</p>
                )
              )}
            </div>
          </div>
        </header>
      ) : (
        /* ── Graceful fallback: plain (non-overlaid) title block ──────── */
        <header
          className="max-w-4xl mx-auto px-4 sm:px-6"
          style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}
        >
          {post.category && (
            <Link
              data-post-category
              href={`/blog/category/${post.category.slug}`}
              style={{
                display: 'inline-block',
                marginBottom: '1rem',
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
          )}

          <h1
            style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              lineHeight: 1.1,
              color: templateInk,
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                marginTop: '1rem',
                fontSize: '1.15rem',
                color: templateMutedText,
                lineHeight: 1.6,
                maxWidth: '42rem',
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            data-post-detail-byline
            className="mt-5 flex items-center gap-3 flex-wrap"
            style={{
              paddingTop: '1.25rem',
              borderTop: `1px solid ${templatePanelBorder}`,
              paddingBottom: '0.25rem',
            }}
          >
            {post.author ? (
              <Link
                href={`/blog/author/${post.author.slug}`}
                className="flex items-center gap-2.5"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {authorAvatarUrl ? (
                  <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
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
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: templateAccent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: templateInk }}>
                    {post.author.name}
                  </p>
                  {date && (
                    <p style={{ fontSize: '0.78rem', color: templateMutedText, marginTop: 1 }}>
                      {date}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              date && (
                <p style={{ fontSize: '0.85rem', color: templateMutedText }}>{date}</p>
              )
            )}
          </div>
        </header>
      )}

      {/* ── Article body — narrow reading column ───────────────────────── */}
      <div
        className="max-w-2xl mx-auto px-4 sm:px-6"
        style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}
      >
        <MarkdownRenderer content={post.body ?? ''} />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: '2.5rem' }}>
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
        )}

        {/* Bottom back link */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${templatePanelBorder}` }}>
          <Link
            data-post-detail-back
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
    </article>
  );
}
