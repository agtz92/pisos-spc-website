/**
 * ProductsLayoutQuickShop
 *
 * CONCEPT: A tight 4-column product grid designed for fast scanning and impulse
 * buying. Price is the most prominent text element on each card — bigger than the
 * title. Each card is compact, showing image → price → title → CTA. No category
 * labels clutter the cards; the filter bar at the top handles navigation.
 *
 * DESIGN DECISIONS:
 * - 4 columns on large screens, 3 on lg, 2 on sm — denser than a standard 3-col grid
 * - Image aspect ratio is square (1:1) to keep rows visually uniform
 * - Price comes BEFORE the title in the visual hierarchy (unlike most e-commerce layouts)
 *   to prioritize "can I afford this?" over product identity — matches impulse-shop behavior
 * - "Add to Cart" CTA is a full-width pill at the bottom of each card
 * - Out-of-stock cards show a greyed-out overlay badge and a "Notify Me" CTA instead
 * - A sale badge (accent background, "SALE" text) overlays the top-left of the image
 *   whenever compareAtPrice > price
 * - Cards have a subtle lift shadow on hover
 *
 * GOOD FOR: General merchandise stores, flash sale pages, or any catalog where price
 * and speed of browsing matter most. Particularly effective for sites selling many
 * similar items where category is less important than price point.
 *
 * MODIFICATION NOTES:
 * - Number of columns: change the grid className (currently sm:2, lg:3, xl:4)
 * - Image ratio: change `aspectRatio: '1 / 1'` (try '4 / 3' for landscape)
 * - Price font size: edit the `fontSize: '1.35rem'` in the price span
 * - To add a quantity selector: this would require converting to a Client Component
 * - Sale threshold: the badge shows whenever compareAtPrice is set — add a threshold
 *   (e.g. only show if discount > 10%) by computing percentage and adding a condition
 * - CTA label: change "Shop Now" / "Notify Me" strings below
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { getStockBadge, type StockConfig } from '@/lib/product-stock';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function QuickShopCard({ product, stockConfig }: { product: Product; stockConfig: StockConfig | null | undefined }) {
  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const stock = getStockBadge(product.stock, stockConfig);
  // Fall back to the raw "stock > 0" check when the tenant has disabled the
  // badge (we still need to switch the CTA between Shop Now / Notify Me).
  const inStock = stock ? stock.inStock : (product.stock == null || product.stock > 0);
  const onSale = product.price && product.compareAtPrice
    ? parseFloat(product.compareAtPrice) > parseFloat(product.price)
    : false;

  return (
    <article data-product-card className="group" style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)', transition: 'box-shadow 0.15s', boxShadow: '0 1px 4px rgba(22,18,24,0.04)' }}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block shrink-0 overflow-hidden" style={{ position: 'relative', aspectRatio: '1 / 1', background: 'var(--template-muted-panel, #f9fafb)' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={product.title} fill className="object-cover transition-transform duration-400 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
        )}
        {onSale && (
          <span data-product-sale-badge style={{ position: 'absolute', top: 10, left: 10, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'var(--template-accent, #ec0f7f)', color: '#fff', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            Sale
          </span>
        )}
        {stock && !stock.inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span data-product-badge style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: stock.color, padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.9)', borderRadius: 6, border: `1px solid ${stock.color}` }}>
              {stock.label}
            </span>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div style={{ padding: '0.85rem 0.9rem 0.9rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
        {/* Price — primary element */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          {price && (
            <span data-product-price style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--template-ink, #161218)' }}>
              {price}
            </span>
          )}
          {compareAt && (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--template-muted-text, #9ca3af)', textDecoration: 'line-through' }}>
              {compareAt}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3, color: 'var(--template-ink, #161218)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
          <Link href={`/products/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
            {product.title}
          </Link>
        </h2>

        {/* CTA */}
        <Link
          href={`/products/${product.slug}`}
          data-product-cta
          style={{
            display: 'block', textAlign: 'center', marginTop: '0.35rem',
            padding: '0.5rem 0.75rem', borderRadius: 999, fontWeight: 800, fontSize: '0.78rem',
            background: inStock
              ? 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)'
              : 'var(--template-muted-panel, #f3f4f6)',
            color: inStock ? '#fff' : 'var(--template-muted-text, #9ca3af)',
            textDecoration: 'none',
          }}
        >
          {inStock ? 'Shop Now' : 'Notify Me'}
        </Link>
      </div>
    </article>
  );
}

interface Props {
  products: Product[];
  categories: Category[];
  stockConfig?: StockConfig | null;
}

export default function ProductsLayoutQuickShop({ products, categories, stockConfig }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <QuickShopCard key={p.slug} product={p} stockConfig={stockConfig} />)}
        </div>
      </div>
    </div>
  );
}
