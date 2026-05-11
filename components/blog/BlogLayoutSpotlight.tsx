/**
 * BlogLayoutSpotlight
 *
 * CONCEPT: Cinematic single-spotlight entry. The first post gets a near-full-viewport
 * hero with its cover image filling the frame and title overlaid at the bottom via a
 * soft gradient scrim. Below that, posts 2–3 appear as a 2-col "editor's choice"
 * strip, and the remaining posts go into a standard 3-col grid.
 *
 * DESIGN DECISIONS:
 * - Hero height is 72vh (capped at 680px) — immersive but still shows content below
 * - Title overlay uses a gradient scrim (transparent → ink/85%) for legibility
 * - Category badge uses the accent color as a solid pill over the image
 * - Posts 2–3 use a 16:10 aspect image with the stacked PostCard for consistency
 * - No CategoryFilterBar shown inside the layout — caller adds it above if desired
 *
 * GOOD FOR: Photography/travel sites, brand journals, any site where the lead story
 * should completely dominate the page above the fold.
 *
 * MODIFICATION NOTES:
 * - Hero height: change `height: '72vh'` and `maxHeight: 680` in HeroSpotlight
 * - Scrim intensity: adjust the gradient stop opacity (currently 0.85)
 * - To show 4 curated posts instead of 2: change `rest.slice(0, 2)` to `slice(0, 4)`
 *   and update gridTemplateColumns to 4 columns
 * - To remove the overlay title and show title below image instead: move the text block
 *   outside the Link and remove the absolute positioning
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

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div style={{ width: 4, height: 18, background: templateAccent, borderRadius: 2 }} />
      <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: templateMutedText }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: templatePanelBorder }} />
    </div>
  );
}

function HeroSpotlight({ post }: { post: Post }) {
  const imageUrl = resolveMediaUrl(post.coverImage);
  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article data-spotlight-hero className="group" style={{ position: 'relative', height: '72vh', maxHeight: 680, minHeight: 360, borderRadius: 'var(--template-card-radius, 24px)', overflow: 'hidden', background: templateMutedPanel }}>
      {imageUrl && (
        <Image src={imageUrl} alt={post.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority style={{ transformOrigin: 'center' }}
        />
      )}

      {/* Gradient scrim */}
      <div data-spotlight-scrim style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, transparent 30%, color-mix(in srgb, ${templateInk} 85%, transparent) 100%)`,
      }} />

      {/* Category badge */}
      {post.category && (
        <div style={{ position: 'absolute', top: 24, left: 24 }}>
          <Link data-spotlight-category href={`/blog/category/${post.category.slug}`} style={{
            display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 999,
            background: templateAccent, color: '#fff',
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            {post.category.name}
          </Link>
        </div>
      )}

      {/* Overlay title */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        <h1 style={{
          fontWeight: 900, lineHeight: 1.04,
          fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
          letterSpacing: '-0.05em', color: '#fff',
          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          marginBottom: '0.75rem', maxWidth: '80%',
        }}>
          <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}
            className="group-hover:underline underline-offset-4">
            {post.title}
          </Link>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
          {post.author && <span style={{ fontWeight: 700, color: '#fff' }}>{post.author.name}</span>}
          {post.author && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </article>
  );
}

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutSpotlight({ posts, categories }: Props) {
  const [hero, ...rest] = posts;
  const curated = rest.slice(0, 2);
  const remaining = rest.slice(2);

  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/blog/category/" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 space-y-12">
        <HeroSpotlight post={hero} />

        {curated.length > 0 && (
          <section>
            <SectionLabel label="Editor's Pick" />
            <div className="grid gap-8 sm:grid-cols-2">
              {curated.map((post) => <PostCard key={post.slug} post={post} variant="stacked" />)}
            </div>
          </section>
        )}

        {remaining.length > 0 && (
          <section>
            <SectionLabel label="More Articles" />
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
