/**
 * BlogLayoutEditorial
 *
 * CONCEPT: A classic editorial homepage pattern — one dominant hero story at the top,
 * flanked by 2–3 secondary stories to its right, followed by a curated horizontal
 * "latest" rail and a standard post grid below. Mimics the visual hierarchy of a
 * print newspaper or magazine front page.
 *
 * DESIGN DECISIONS:
 * - Hero post occupies ~60% of the top row width; side posts split the remaining 40%
 * - Hero has a tall 3:2 aspect ratio image with a gradient scrim and white title overlay
 * - Side posts are compact: small thumbnail + category + title only (no excerpt)
 * - The "Latest" rail below the fold shows 4–5 posts with thumbnails in a horizontal row
 * - Remaining posts fall into a responsive 3-col PostCard grid
 * - No pagination — all published posts render on the same page
 *
 * GOOD FOR: Content-heavy blogs with regular publishing cadence where editorial hierarchy
 * (which story is most important today) matters. Best with 8+ posts.
 *
 * MODIFICATION NOTES:
 * - Hero image height: change `aspectRatio: '3 / 2'` in the hero Link style
 * - Side post count: change `sideCount` (currently 2); add more posts from `rest`
 * - Rail post count: change the `.slice(0, 4)` call in the latest rail section
 * - To add category tags to side posts: add `post.category?.name` display below the title
 * - To make the hero link open in a new tab: add `target="_blank"` to the hero Link
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Post, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import PostCard from '@/components/PostCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateInk = 'var(--template-ink, #161218)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatDate(iso: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', ...options,
  });
}

function FeaturedHero({ post }: { post: Post }) {
  const imageUrl = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article data-post-hero className="group">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden"
        style={{
          position: 'relative', aspectRatio: '16 / 10', textDecoration: 'none',
          background: templateMutedPanel,
          borderRadius: 'var(--template-card-radius, 24px)',
          border: `1px solid ${templatePanelBorder}`,
          boxShadow: 'var(--template-hero-shadow, 0 18px 48px color-mix(in srgb, var(--template-accent, #e5201b) 14%, transparent))',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl} alt={post.title} fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transformOrigin: 'center', borderRadius: 0 }}
            priority
          />
        ) : (
          <div className="h-full w-full" style={{ background: templateMutedPanel }} />
        )}
      </Link>

      <div className="pt-4">
        {post.category && (
          <Link href={`/blog/category/${post.category.slug}`} data-post-category style={{
            display: 'inline-block', marginBottom: '0.75rem',
            fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: templateAccent, textDecoration: 'none',
          }}>
            {post.category.name}
          </Link>
        )}

        <h1 style={{
          fontWeight: 800, lineHeight: 1.02,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          letterSpacing: '-0.05em', color: templateInk,
        }}>
          <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'underline' }} className="underline-offset-4">
            {post.title}
          </Link>
        </h1>

        {post.excerpt && (
          <p className="mt-3 line-clamp-3" style={{ color: templateMutedText, fontSize: '1rem', lineHeight: 1.6, maxWidth: '40rem' }}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1" style={{ fontSize: '0.8rem', color: templateMutedText }}>
          {post.author && <span style={{ fontWeight: 700, color: templateInk }}>{post.author.name}</span>}
          {post.author && date && <span>&middot;</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </article>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div data-post-section className="mb-6 flex items-center gap-3">
      <div style={{ width: 4, height: 18, background: templateAccent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: templateMutedText }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: templatePanelBorder }} />
    </div>
  );
}

function LatestRail({ posts }: { posts: Post[] }) {
  return (
    <aside data-latest-rail>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1, letterSpacing: '-0.04em', color: templateInk, marginBottom: '1rem' }}>
        The Latest
      </h2>
      <div className="space-y-5 border-l pl-4" style={{ borderColor: templatePanelBorder }}>
        {posts.map((post, index) => {
          const stamp = formatDate(post.publishedAt ?? post.createdAt, { month: 'short', day: 'numeric', year: undefined });
          return (
            <article key={post.slug}>
              <p style={{ marginBottom: '0.45rem', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: templateAccent }}>
                {stamp ?? `Update ${index + 1}`}
              </p>
              <h3 style={{ fontSize: '1rem', lineHeight: 1.25, color: templateInk }}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'underline' }} className="underline-offset-3">
                  {post.title}
                </Link>
              </h3>
            </article>
          );
        })}
      </div>
    </aside>
  );
}

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutEditorial({ posts, categories }: Props) {
  const [featured, ...rest] = posts;
  const sideStories = rest.slice(0, 2);
  const latestStories = rest.slice(2, 8);
  const highlights = rest.slice(8, 11);
  const remaining = rest.slice(11);

  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/blog/category/" />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <section className="grid gap-10 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.72fr)_minmax(220px,0.62fr)]">
          <FeaturedHero post={featured} />
          {sideStories.length > 0 && (
            <div className="space-y-8">
              {sideStories.map((post) => <PostCard key={post.slug} post={post} variant="stacked" />)}
            </div>
          )}
          {latestStories.length > 0 && <LatestRail posts={latestStories} />}
        </section>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        {highlights.length > 0 && (
          <section>
            <SectionLabel label="Latest" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {highlights.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </section>
        )}

        {remaining.length > 0 && (
          <section>
            <SectionLabel label="More Articles" />
            {remaining.length <= 6 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((post) => <PostCard key={post.slug} post={post} />)}
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-3">
                <div className="grid auto-rows-max gap-8 sm:grid-cols-2 lg:col-span-2">
                  {remaining.slice(0, -3).map((post) => <PostCard key={post.slug} post={post} />)}
                </div>
                <aside>
                  <SectionLabel label="Also Worth Reading" />
                  <div className="space-y-5">
                    {remaining.slice(-3).map((post) => <PostCard key={post.slug} post={post} variant="compact" />)}
                  </div>
                </aside>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
