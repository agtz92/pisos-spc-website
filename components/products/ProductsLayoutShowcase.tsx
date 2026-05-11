/**
 * ProductsLayoutShowcase
 *
 * CONCEPT: The first product gets a horizontal split hero — image fills 60% on the
 * left, a styled text + CTA panel fills 40% on the right. The rest of the catalog
 * appears in a standard 3-col ProductCard grid below. Balances editorial "featured
 * product" storytelling with a complete browsable catalog.
 *
 * DESIGN DECISIONS:
 * - Hero uses a 60 / 40 grid split (image left, text right) at a fixed height of 400px
 * - Text panel contains: category eyebrow → product name → brand → description → price → CTA
 * - The full-width hero doesn't scroll with the grid — it's a static top section
 * - "Shop Now" CTA uses the full accent gradient and rounded pill shape
 * - Remaining products use the shared ProductCard — design stays in sync
 * - If there's only one product, only the hero renders (grid is empty / not shown)
 *
 * GOOD FOR: Small-to-medium product catalogs (10–40 products) where the store wants to
 * highlight a signature or new-arrival product while still showing the full range.
 *
 * MODIFICATION NOTES:
 * - Hero height: change `height: 400` in both the image and text panel wrappers
 * - Column split: change `gridTemplateColumns: '60fr 40fr'` (try '50fr 50fr')
 * - To feature a specific product (not just the first): sort the products array
 *   before passing it into this component
 * - To add a "New Arrival" badge on the hero: add a positioned span with absolute styling
 * - Grid columns: change `xl:grid-cols-3` in the grid below the hero
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import ProductCard from '@/components/ProductCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function FeaturedProduct({ product }: { product: Product }) {
  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const inStock = product.stock == null || product.stock > 0;

  return (
    <article
      data-product-hero
      className="group"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        background: 'var(--template-panel, #ffffff)',
        boxShadow: '0 18px 48px rgba(22, 18, 24, 0.08)',
        minHeight: 400,
      }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ position: 'relative', display: 'block', background: 'var(--template-muted-panel, #f9fafb)' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #e5e7eb)' }}>
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {!inStock && (
          <span style={{ position: 'absolute', top: 16, left: 16, padding: '0.3rem 0.8rem', borderRadius: 999, background: 'color-mix(in srgb, var(--template-panel, #fff) 92%, transparent)', color: 'var(--template-ink, #161218)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', backdropFilter: 'blur(6px)', border: '1px solid var(--template-panel-border, #e5e7eb)' }}>
            Out of stock
          </span>
        )}
      </Link>

      {/* Details */}
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
        {product.category && (
          <Link href={`/products/category/${product.category.slug}`} data-product-category style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)', textDecoration: 'none' }}>
            {product.category.name}
          </Link>
        )}
        <div>
          <h2 style={{ fontWeight: 900, lineHeight: 1.08, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}>
            <Link href={`/products/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
              {product.title}
            </Link>
          </h2>
          {product.brand && <p style={{ fontSize: '0.82rem', color: 'var(--template-muted-text, #6b7280)', marginTop: '0.3rem', fontWeight: 600 }}>{product.brand}</p>}
        </div>

        {product.description && (
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--template-ink, #161218)', opacity: 0.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
            {product.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          {price && <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}>{price}</span>}
          {compareAt && <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', textDecoration: 'line-through' }}>{compareAt}</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href={`/products/${product.slug}`} data-product-cta style={{ padding: '0.7rem 1.5rem', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)', color: '#fff', textDecoration: 'none' }}>
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductsLayoutShowcase({ products, categories }: Props) {
  const [first, ...rest] = products;

  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <FeaturedProduct product={first} />

        {rest.length > 0 && (
          <div>
            <div data-post-section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', borderRadius: 2 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--template-muted-text, #6b7280)' }}>More Products</span>
              <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
