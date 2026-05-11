/**
 * ProductsLayoutCatalog
 *
 * CONCEPT: A compact row-based catalog — each product is a horizontal tile with an
 * 80px square thumbnail on the left, category + title + description in the center,
 * and price + CTA button on the right. Fits many products in the viewport with minimal
 * scrolling. Feels like a print catalog or a B2B product list.
 *
 * DESIGN DECISIONS:
 * - 3-column row grid: `80px thumb | 1fr info | auto price+cta`
 * - Thumbnail is square (80×80) with rounded corners; hover zoom effect on the image
 * - Description is truncated to 1 line via `line-clamp-1` to keep rows compact
 * - Price is right-aligned with compare-at price shown strikethrough below it
 * - "View" CTA is a compact pill button — keeps the right column narrow
 * - Out-of-stock items show a small "Out of stock" badge next to the category label
 * - Rows have a card-style border and background for separation (not just a border-bottom)
 *
 * GOOD FOR: Wholesale / B2B stores, tech product catalogs, or any store where users
 * compare products primarily by name and price rather than imagery. Good for 20–100+
 * products.
 *
 * MODIFICATION NOTES:
 * - Thumbnail size: change `width: 80, height: 80` in the Link + Image wrapper
 * - Description line clamp: change `line-clamp-1` to `line-clamp-2` for more context
 * - To add a SKU or product code: add a `<p>` below the title with `product.sku`
 * - To make rows sortable by price: convert to Client Component and sort products in state
 * - Row border radius: change `borderRadius: 14` in the article style
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function CatalogRow({ product }: { product: Product }) {
  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const inStock = product.stock == null || product.stock > 0;

  return (
    <article
      data-product-row
      className="group"
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto',
        gap: '0 1.25rem',
        alignItems: 'center',
        padding: '0.9rem 1.25rem',
        borderRadius: 14,
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        background: 'var(--template-panel, #ffffff)',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Thumbnail */}
      <Link href={`/products/${product.slug}`} className="block shrink-0 overflow-hidden" style={{ width: 80, height: 80, borderRadius: 10, position: 'relative', background: 'var(--template-muted-panel, #f9fafb)' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #e5e7eb)' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
          {product.category && (
            <Link href={`/products/category/${product.category.slug}`} data-product-category style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)', textDecoration: 'none' }}>
              {product.category.name}
            </Link>
          )}
          {!inStock && (
            <span data-product-badge style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.1rem 0.4rem', borderRadius: 999, background: 'var(--template-muted-panel, #f3f4f6)', color: 'var(--template-muted-text, #6b7280)' }}>
              Out of stock
            </span>
          )}
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link href={`/products/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
            {product.title}
          </Link>
        </h2>
        {product.description && (
          <p className="line-clamp-1" style={{ fontSize: '0.8rem', color: 'var(--template-muted-text, #6b7280)', marginTop: '0.2rem', lineHeight: 1.5 }}>
            {product.description}
          </p>
        )}
        {product.brand && <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', marginTop: '0.2rem' }}>{product.brand}</p>}
      </div>

      {/* Price + CTA */}
      <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        <div>
          {price && <p data-product-price style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)' }}>{price}</p>}
          {compareAt && <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', textDecoration: 'line-through' }}>{compareAt}</p>}
        </div>
        <Link href={`/products/${product.slug}`} data-product-cta style={{ padding: '0.4rem 1rem', borderRadius: 8, fontWeight: 700, fontSize: '0.78rem', background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View
        </Link>
      </div>
    </article>
  );
}

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductsLayoutCatalog({ products, categories }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div data-post-section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', borderRadius: 2 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--template-muted-text, #6b7280)' }}>
            {products.length} Products
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
        </div>
        <div className="space-y-3">
          {products.map((p) => <CatalogRow key={p.slug} product={p} />)}
        </div>
      </div>
    </div>
  );
}
