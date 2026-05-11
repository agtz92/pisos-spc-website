import Link from 'next/link';

/**
 * Shared category / type filter strip used across all module index pages.
 * Uses template CSS variables so it automatically adapts to the active theme.
 */
export function CategoryFilterBar({
  categories,
  basePath,
}: {
  categories: Array<{ slug: string; name: string }>;
  basePath: string; // e.g. "/recipes/category/" or "/reviews/type/"
}) {
  if (categories.length === 0) return null;

  return (
    <div data-category-filter-bar className="scrollbar-none flex gap-1.5 overflow-x-auto max-w-7xl mx-auto px-4 py-3 sm:px-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${basePath}${cat.slug}`}
          data-category-pill
          style={{
            padding: '0.25rem 0.85rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--template-ink, #161218)',
            background: 'var(--template-panel, #ffffff)',
            border: '1px solid var(--template-panel-border, #e5e7eb)',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
