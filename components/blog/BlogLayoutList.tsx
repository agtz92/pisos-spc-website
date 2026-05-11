/**
 * BlogLayoutList
 *
 * CONCEPT: A chronological list view — each post is a horizontal row with the
 * publish date prominently in the left column, article content (category, title,
 * excerpt) in the center, and a fixed-size thumbnail on the right. Reads like an
 * archive or changelog more than a traditional blog front page.
 *
 * DESIGN DECISIONS:
 * - Grid uses 3 columns: `80px date | 1fr content | 120px image` so dates always align
 * - Date is displayed as "Jan 14" (month + day) in a bold muted style with the year below
 * - Each row has a bottom border separator; no cards or shadows
 * - The category label uses the accent color as an eyebrow above the title
 * - Thumbnail is square-cropped at a fixed 80×80px; no zoom on hover (keeps it calm)
 * - No hero — all posts are given equal visual weight
 *
 * GOOD FOR: Developer blogs, release notes, documentation sites, or any publication
 * where readers browse by date and want a dense, scannable list.
 *
 * MODIFICATION NOTES:
 * - To show the full date (with year always visible): change the date format below
 * - Thumbnail size: change the width/height values in the thumbnail column
 * - To add reading time: add a `readingTime` field to Post and display it in the meta row
 * - To group by month: pre-process posts into month buckets and render section headers
 * - To remove excerpts: delete the excerpt <p> element in the row component
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
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateShort(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutList({ posts, categories }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/blog/category/" />

      <div className="mx-auto max-w-4xl px-4 pt-8 pb-16 sm:px-6">
        <div style={{ borderTop: `1px solid ${templatePanelBorder}` }}>
          {posts.map((post, i) => {
            const imageUrl = resolveMediaUrl(post.coverImage);
            const date = formatDate(post.publishedAt ?? post.createdAt);
            const stamp = formatDateShort(post.publishedAt ?? post.createdAt);

            return (
              <article
                key={post.slug}
                className="group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 1fr auto',
                  gap: '0 1.25rem',
                  alignItems: 'start',
                  padding: '1.25rem 0',
                  borderBottom: `1px solid ${templatePanelBorder}`,
                }}
              >
                {/* Date stamp column */}
                <div style={{ paddingTop: '0.15rem', textAlign: 'right' }}>
                  {stamp ? (
                    <time dateTime={post.publishedAt ?? post.createdAt ?? ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: templateAccent }}>
                        {stamp.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 900, lineHeight: 1, color: templateInk, letterSpacing: '-0.03em' }}>
                        {stamp.split(' ')[1]}
                      </span>
                    </time>
                  ) : (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: templateMutedText }}>{i + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div>
                  {post.category && (
                    <Link href={`/blog/category/${post.category.slug}`} style={{
                      display: 'inline-block', marginBottom: '0.3rem',
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: templateAccent, textDecoration: 'none',
                    }}>
                      {post.category.name}
                    </Link>
                  )}
                  <h2 style={{ fontWeight: 800, lineHeight: 1.2, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', letterSpacing: '-0.03em', color: templateInk }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-3">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-1 line-clamp-2" style={{ fontSize: '0.875rem', color: templateMutedText, lineHeight: 1.55 }}>
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2" style={{ fontSize: '0.72rem', color: templateMutedText }}>
                    {post.author && <span style={{ fontWeight: 700, color: templateInk }}>{post.author.name}</span>}
                    {post.author && date && <span>&middot;</span>}
                    {date && <span>{date}</span>}
                  </div>
                </div>

                {/* Thumbnail */}
                {imageUrl && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block shrink-0 overflow-hidden"
                    style={{ width: 110, height: 76, borderRadius: 12, position: 'relative', background: templateMutedPanel, flexShrink: 0 }}
                  >
                    <Image
                      src={imageUrl} alt={post.title} fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
