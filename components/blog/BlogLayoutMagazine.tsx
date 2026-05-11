/**
 * BlogLayoutMagazine
 *
 * CONCEPT: Groups posts by their category, turning the blog into a multi-section
 * magazine. Each category gets a bold section header (with a "See all" link) followed
 * by a 3-col PostCard grid. Uncategorized posts appear in a final catch-all section.
 *
 * DESIGN DECISIONS:
 * - Categories are sorted by post count (most posts first) so the most active topics lead
 * - Within each category, posts are sorted newest-first (server order preserved)
 * - Section headers use a large ink-colored category name + decorative left accent bar
 * - A "See all" link next to the header links to the category filter page
 * - The last section ("Uncategorized") only renders if there are posts without a category
 * - No global "latest" rail — the per-section grids are the entire content surface
 *
 * GOOD FOR: Multi-topic publications where readers self-identify with specific categories
 * (e.g. "Tech", "Design", "Business"). Helps users find content by interest rather than
 * by recency.
 *
 * MODIFICATION NOTES:
 * - To limit posts per section (with "show all"): slice `catPosts` and add a toggle button
 *   (note: requires converting to Client Component with useState)
 * - To sort categories alphabetically: change the sort comparator
 * - Section header font size: change the `fontSize` in the h2 style
 * - To hide the "See all" link: remove the Link element in the section header
 * - To show a category description below the header: add a description field to Category
 *   and render it as a subtitle paragraph
 */

import Link from 'next/link';
import type { Post, Category } from '@/lib/graphql';
import PostCard from '@/components/PostCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const templateAccent = 'var(--template-accent, #e5201b)';
const templateMutedText = 'var(--template-muted-text, #6b7280)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

function SectionLabel({ label, href }: { label: string; href?: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div style={{ width: 4, height: 18, background: templateAccent, borderRadius: 2, flexShrink: 0 }} />
      {href ? (
        <Link href={href} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: templateMutedText, textDecoration: 'none' }}
          className="hover:underline underline-offset-3">
          {label}
        </Link>
      ) : (
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: templateMutedText }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: templatePanelBorder }} />
    </div>
  );
}

interface Props {
  posts: Post[];
  categories: Category[];
}

export default function BlogLayoutMagazine({ posts, categories }: Props) {
  // Group posts by category
  const grouped = new Map<string, { name: string; slug: string; posts: Post[] }>();
  const uncategorized: Post[] = [];

  posts.forEach((post) => {
    if (post.category) {
      const key = post.category.slug;
      if (!grouped.has(key)) {
        grouped.set(key, { name: post.category.name, slug: post.category.slug, posts: [] });
      }
      grouped.get(key)!.posts.push(post);
    } else {
      uncategorized.push(post);
    }
  });

  // If nothing is categorized, fall back to a simple grid
  const sections = Array.from(grouped.values());
  if (sections.length === 0) {
    return (
      <div>
        <CategoryFilterBar categories={categories} basePath="/blog/category/" />
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6">
          <SectionLabel label="All Posts" />
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/blog/category/" />

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-8 pb-16 sm:px-6">
        {sections.map(({ name, slug, posts: catPosts }) => (
          <section key={slug}>
            <SectionLabel label={name} href={`/blog/category/${slug}`} />
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {catPosts.slice(0, 6).map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
            {catPosts.length > 6 && (
              <div className="mt-4">
                <Link
                  href={`/blog/category/${slug}`}
                  style={{ fontSize: '0.8rem', fontWeight: 700, color: templateAccent, textDecoration: 'none' }}
                  className="hover:underline underline-offset-3"
                >
                  See all {catPosts.length} in {name} →
                </Link>
              </div>
            )}
          </section>
        ))}

        {uncategorized.length > 0 && (
          <section>
            <SectionLabel label="More Articles" />
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {uncategorized.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
