/**
 * BlogLayoutStream
 *
 * CONCEPT: Editorial magazine "stream" — each post occupies a full-width row with
 * image and text side-by-side. Odd posts: image-left / text-right. Even posts:
 * image-right / text-left (mirrored). Creates a visual rhythm as you scroll.
 *
 * DESIGN DECISIONS:
 * - Images are 45% of row width, tall aspect ratio (4:3) to give each entry weight
 * - Typography is large and expressive — headline at clamp(1.6rem, 3vw, 2.4rem)
 * - A thin accent rule separates entries instead of card borders
 * - Category link and author/date shown in the text block, not overlaid on image
 * - No pagination or "load more" — all posts in one continuous stream
 *
 * GOOD FOR: Long-form editorial sites, photography blogs, curated content feeds
 * where each post deserves full attention rather than competing in a grid.
 *
 * MODIFICATION NOTES:
 * - To change image/text split: adjust the `gridTemplateColumns` values (currently 45fr/55fr)
 * - To change alternation logic: modify the `isEven` condition
 * - To add a sticky date sidebar: wrap in a grid with a 3rd column for dates
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Post, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #161218)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutStream({ posts, categories }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/blog/category/" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
        {posts.map((post, i) => {
          const imageUrl = resolveMediaUrl(post.coverImage);
          const date = formatDate(post.publishedAt ?? post.createdAt);
          const isEven = i % 2 === 0; // even → image left, odd → image right

          return (
            <article
              key={post.slug}
              className="group"
              style={{
                display: 'grid',
                gridTemplateColumns: imageUrl ? (isEven ? '45fr 55fr' : '55fr 45fr') : '1fr',
                gap: '0 3rem',
                alignItems: 'center',
                padding: '3.5rem 0',
                borderBottom: `1px solid ${templatePanelBorder}`,
              }}
            >
              {/* Image — first column when even, second when odd */}
              {imageUrl && (
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden"
                  style={{
                    order: isEven ? 0 : 1,
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    borderRadius: 18,
                    background: templateMutedPanel,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={imageUrl} alt={post.title} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              )}

              {/* Text block */}
              <div style={{ order: isEven ? 1 : 0, paddingLeft: isEven ? 0 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  {post.category && (
                    <Link href={`/blog/category/${post.category.slug}`} style={{
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: templateAccent, textDecoration: 'none',
                    }}>
                      {post.category.name}
                    </Link>
                  )}
                  {post.category && date && <span style={{ color: templatePanelBorder, fontSize: '0.8rem' }}>·</span>}
                  {date && <span style={{ fontSize: '0.72rem', color: templateMutedText }}>{date}</span>}
                </div>

                <h2 style={{
                  fontWeight: 900, lineHeight: 1.06,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  letterSpacing: '-0.045em', color: templateInk,
                  marginBottom: '0.9rem',
                }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}
                    className="group-hover:underline underline-offset-4">
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="line-clamp-3" style={{
                    fontSize: '1rem', lineHeight: 1.7, color: templateMutedText,
                    maxWidth: '38rem', marginBottom: '1.25rem',
                  }}>
                    {post.excerpt}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                  {post.author && (
                    <Link href={`/blog/author/${post.author.slug}`} style={{
                      fontWeight: 700, color: templateInk, textDecoration: 'none',
                    }} className="hover:underline underline-offset-2">
                      {post.author.name}
                    </Link>
                  )}
                  <Link href={`/blog/${post.slug}`} style={{
                    marginLeft: 'auto', fontSize: '0.78rem', fontWeight: 700,
                    color: templateAccent, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                  }} className="hover:underline underline-offset-2">
                    Read →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
