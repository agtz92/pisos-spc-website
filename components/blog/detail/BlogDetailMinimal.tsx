import Link from 'next/link';
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
 * Minimal / editorial blog post detail layout. An ultra-clean, centered single
 * column with no cover hero — just an understated meta line (category · author ·
 * date), the headline, an excerpt deck and the markdown body, surrounded by
 * generous whitespace. Built for typography-first, distraction-free reading.
 *
 * All colors come from --template-* vars so it adapts to every visual template.
 */
export default function BlogDetailMinimal({ post }: { post: Post }) {
  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article
      data-post-detail
      className="max-w-2xl mx-auto px-4 sm:px-6"
      style={{ paddingTop: '4rem', paddingBottom: '5rem' }}
    >
      {/* Subtle back link */}
      <div style={{ marginBottom: '3rem' }}>
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
          className="transition-colors hover:opacity-75"
        >
          <span style={{ fontSize: '1rem' }}>←</span> Blog
        </Link>
      </div>

      {/* Understated meta line: category · author · date */}
      <div
        data-post-detail-byline
        className="flex items-center flex-wrap"
        style={{
          gap: 8,
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: templateMutedText,
          marginBottom: '1.25rem',
        }}
      >
        {post.category && (
          <>
            <Link
              data-post-category
              href={`/blog/category/${post.category.slug}`}
              style={{ color: templateAccent, textDecoration: 'none' }}
              className="hover:opacity-75 transition-opacity"
            >
              {post.category.name}
            </Link>
          </>
        )}
        {post.author && (
          <>
            {post.category && <span aria-hidden style={{ opacity: 0.5 }}>·</span>}
            <Link
              href={`/blog/author/${post.author.slug}`}
              style={{ color: templateMutedText, textDecoration: 'none' }}
              className="hover:opacity-75 transition-opacity"
            >
              {post.author.name}
            </Link>
          </>
        )}
        {date && (
          <>
            {(post.category || post.author) && (
              <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            )}
            <span>{date}</span>
          </>
        )}
      </div>

      {/* Headline */}
      <h1
        style={{
          fontWeight: 800,
          fontSize: 'clamp(1.9rem, 5vw, 3rem)',
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
            marginTop: '1.25rem',
            fontSize: '1.2rem',
            color: templateMutedText,
            lineHeight: 1.65,
          }}
        >
          {post.excerpt}
        </p>
      )}

      {/* Body */}
      <div style={{ marginTop: '2.5rem' }}>
        <MarkdownRenderer content={post.body ?? ''} />
      </div>

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
      <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${templatePanelBorder}` }}>
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
    </article>
  );
}
