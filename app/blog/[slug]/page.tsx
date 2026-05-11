import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPost, getPosts, resolveMediaUrl } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #111111)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    openGraph: post.seo?.ogImage ? { images: [post.seo.ogImage] } : undefined,
    alternates: post.seo?.canonicalUrl ? { canonical: post.seo.canonicalUrl } : undefined,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const imageUrl = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const authorAvatarUrl = post.author ? resolveMediaUrl(post.author.avatar) : null;

  return (
    <article data-post-detail>
      {/* ── Article header — constrained width ─────────────────────────── */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6"
        style={{ paddingTop: '2.5rem', paddingBottom: '1.5rem' }}
      >
        {/* Back + Category row */}
        <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
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
          className="transition-colors group"
        >
          <span style={{ fontSize: '1rem' }}>←</span> Blog
        </Link>

        {post.category && (
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
        )}
        </div>

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

        {/* Author + Date row */}
        <div
          data-post-detail-byline
          className="mt-5 flex items-center gap-3 flex-wrap"
          style={{
            paddingTop: '1.25rem',
            borderTop: `1px solid ${templatePanelBorder}`,
            borderBottom: `1px solid ${templatePanelBorder}`,
            paddingBottom: '1.25rem',
          }}
        >
          {post.author && (
            <Link
              href={`/blog/author/${post.author.slug}`}
              className="flex items-center gap-2.5"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {authorAvatarUrl ? (
                <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
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
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: templateAccent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: templateInk }}>
                  {post.author.name}
                </p>
                {date && (
                  <p style={{ fontSize: '0.75rem', color: templateMutedText, marginTop: 1 }}>
                    {date}
                  </p>
                )}
              </div>
            </Link>
          )}
          {!post.author && date && (
            <p style={{ fontSize: '0.82rem', color: templateMutedText }}>{date}</p>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="ml-auto flex flex-wrap gap-1.5">
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
        </div>
      </div>

      {/* ── Hero image — full width, no horizontal padding ─────────────── */}
      {imageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            data-post-detail-hero
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              minHeight: 220,
              maxHeight: 460,
              overflow: 'hidden',
              background: templateMutedPanel,
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(22, 18, 24, 0.08)',
            }}
          >
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ── Article body — narrow reading width ────────────────────────── */}
      <div
        className="max-w-2xl mx-auto px-4 sm:px-6"
        style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}
      >
        <MarkdownRenderer content={post.body ?? ''} />

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
    </article>
  );
}
