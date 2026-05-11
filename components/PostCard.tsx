import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'stacked';
}

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #161218)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templatePanel = 'var(--template-panel, #ffffff)';
const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const imageUrl = resolveMediaUrl(post.coverImage);

  if (variant === 'compact') {
    return (
      <article data-post-card="compact" className="group flex items-start gap-4 rounded-[22px] border p-3" style={{ borderColor: templatePanelBorder, background: templatePanel }}>
        {imageUrl ? (
          <Link
            href={`/blog/${post.slug}`}
            className="block shrink-0 overflow-hidden rounded-[16px]"
            style={{ width: 100, height: 70, position: 'relative', background: templateMutedPanel }}
          >
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="shrink-0 rounded-[16px]" style={{ width: 100, height: 70, background: templateMutedPanel }} />
        )}

        <div className="min-w-0">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              data-post-category
              className="mb-1 block"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: templateAccent,
                textDecoration: 'none',
              }}
            >
              {post.category.name}
            </Link>
          )}

          <h3 className="line-clamp-2 font-bold leading-snug" style={{ fontSize: '0.92rem', color: templateInk }}>
            <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {post.title}
            </Link>
          </h3>

          {date && (
            <p className="mt-1" style={{ fontSize: '0.74rem', color: templateMutedText }}>
              {date}
            </p>
          )}
        </div>
      </article>
    );
  }

  if (variant === 'stacked') {
    return (
      <article data-post-card="stacked" className="group rounded-[24px] border p-3" style={{ borderColor: templatePanelBorder, background: templatePanel }}>
        <Link
          href={`/blog/${post.slug}`}
          className="block overflow-hidden rounded-[18px]"
          style={{ position: 'relative', aspectRatio: '16 / 10', background: templateMutedPanel }}
          tabIndex={-1}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ transformOrigin: 'center' }}
            />
          ) : (
            <div className="h-full w-full" style={{ background: templateMutedPanel }} />
          )}
        </Link>

        <div className="pt-3">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              data-post-category
              style={{
                display: 'inline-block',
                marginBottom: '0.45rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: templateAccent,
                textDecoration: 'none',
              }}
            >
              {post.category.name}
            </Link>
          )}

          <h3 className="font-bold leading-snug" style={{ fontSize: '1rem', color: templateInk, lineHeight: 1.22 }}>
            <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {post.title}
            </Link>
          </h3>

          {post.excerpt && (
            <p className="mt-2 line-clamp-3" style={{ fontSize: '0.9rem', color: templateMutedText, lineHeight: 1.55 }}>
              {post.excerpt}
            </p>
          )}

          <div className="mt-3 flex items-center gap-1.5" style={{ fontSize: '0.72rem', color: templateMutedText }}>
            {post.author && <span style={{ color: templateInk, fontWeight: 600 }}>{post.author.name}</span>}
            {post.author && date && <span>&middot;</span>}
            {date && <span>{date}</span>}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article data-post-card="default" className="group flex h-full flex-col rounded-[24px] border p-4" style={{ borderColor: templatePanelBorder, background: templatePanel }}>
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-[20px]"
        style={{ position: 'relative', aspectRatio: '16 / 9', background: templateMutedPanel }}
        tabIndex={-1}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ transformOrigin: 'center' }}
          />
        ) : (
          <div className="h-full w-full" style={{ background: templateMutedPanel }} />
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug}`}
            data-post-category
            style={{
              display: 'inline-block',
              marginBottom: '0.45rem',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: templateAccent,
              textDecoration: 'none',
            }}
          >
            {post.category.name}
          </Link>
        )}

        <h2 className="font-bold leading-snug" style={{ fontSize: '1.05rem', color: templateInk, lineHeight: 1.3 }}>
          <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-1.5 line-clamp-2" style={{ fontSize: '0.825rem', color: templateMutedText, lineHeight: 1.55 }}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-3" style={{ fontSize: '0.72rem', color: templateMutedText }}>
          {post.author && (
            <>
              <Link
                href={`/blog/author/${post.author.slug}`}
                style={{ color: templateInk, fontWeight: 600, textDecoration: 'none' }}
              >
                {post.author.name}
              </Link>
              {date && <span>&middot;</span>}
            </>
          )}
          {date && <span>{date}</span>}
        </div>
      </div>
    </article>
  );
}
