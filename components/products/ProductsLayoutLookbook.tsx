/**
 * ProductsLayoutLookbook
 *
 * CONCEPT: Alternating full-width editorial rows — each product takes the full page
 * width with the image on one side and styled text on the other. Even-indexed products
 * have image-left / text-right; odd-indexed are flipped. The generous white space and
 * large typography give this layout a fashion-catalogue or lifestyle-brand feel.
 *
 * DESIGN DECISIONS:
 * - Each row uses a fixed 55 / 45 split (image / text) that flips on alternating rows
 * - Image height is fixed at 480px so rows feel consistently proportioned
 * - Text block contains: category eyebrow → product name (display-size) → description →
 *   price strip → CTA button — stacked with generous vertical rhythm
 * - A subtle background tint (`var(--template-muted-panel)`) behind every other row
 *   helps visually separate entries without harsh borders
 * - The CTA uses the full accent gradient and spans the width of the text column
 * - On screens below `md` the two-column split collapses to a stacked card layout
 *
 * GOOD FOR: Lifestyle, fashion, and premium product brands where the story behind each
 * item matters as much as the item itself. Best with high-quality photography.
 *
 * MODIFICATION NOTES:
 * - Column split ratio: change `gridTemplateColumns` values (currently '55fr 45fr')
 * - Row height: change the `height: 480` style on the image wrapper
 * - To add a video thumbnail for some products: check for a video URL field and swap
 *   the Image component for a <video> or a play-button overlay on the image
 * - Alternate background: remove the `background` from even-row wrappers to keep all
 *   rows on the same background
 * - To show a "New" or "Sale" badge: add a conditional badge overlay on the image
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { getStockBadge, type StockConfig } from '@/lib/product-stock';
import { stripMarkdown, truncate } from '@/lib/strip-markdown';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function LookbookRow({
  product,
  index,
  stockConfig,
}: {
  product: Product;
  index: number;
  stockConfig: StockConfig | null | undefined;
}) {
  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const isEven = index % 2 === 0;
  const stock = getStockBadge(product.stock, stockConfig);
  // Short description (markdown stripped) used in lookbook text block when
  // present; falls back to long description for backward compat.
  const previewText = product.shortDescription
    ? truncate(stripMarkdown(product.shortDescription), 200)
    : null;

  const textBlock = (
    <div data-lookbook-text={isEven ? 'right' : 'left'} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3.5rem', gap: '1rem' }}>
      {product.category && (
        <Link href={`/products/category/${product.category.slug}`} data-product-category style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', textDecoration: 'none' }}>
          {product.category.name}
        </Link>
      )}
      <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--template-ink, #161218)' }}>
        <Link href={`/products/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:opacity-75 transition-opacity">
          {product.title}
        </Link>
      </h2>
      {product.brand && (
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>
      )}
      {(previewText || product.description) && (
        <p className="line-clamp-3" style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--template-muted-text, #6b7280)' }}>
          {previewText ?? product.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        {price && <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}>{price}</span>}
        {compareAt && <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--template-muted-text, #9ca3af)', textDecoration: 'line-through' }}>{compareAt}</span>}
        {stock && !stock.inStock && (
          <span data-product-badge style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999, background: 'var(--template-muted-panel, #f3f4f6)', color: stock.color, border: `1px solid ${stock.color}` }}>
            {stock.label}
          </span>
        )}
      </div>
      <Link href={`/products/${product.slug}`} data-product-cta style={{ display: 'block', textAlign: 'center', padding: '0.85rem 1.5rem', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.02em', background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)', color: '#fff', textDecoration: 'none' }}>
        Shop Now
      </Link>
    </div>
  );

  const imageBlock = (
    <div style={{ position: 'relative', height: 480, background: 'var(--template-muted-panel, #f3f4f6)', overflow: 'hidden' }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={product.title} fill className="object-cover" />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
      )}
    </div>
  );

  return (
    <article data-lookbook-row style={{ display: 'grid', gridTemplateColumns: isEven ? '55fr 45fr' : '45fr 55fr', background: isEven ? 'var(--template-panel, #fff)' : 'var(--template-muted-panel, #f9fafb)' }}>
      {isEven ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
    </article>
  );
}

interface Props {
  products: Product[];
  categories: Category[];
  /** Optional — drives the stock pill. Pass from the list page after a
   *  single getTenant() fetch. */
  stockConfig?: StockConfig | null;
}

export default function ProductsLayoutLookbook({ products, categories, stockConfig }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />
      <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0.5rem 1rem 0' }}>
        {products.map((p, i) => <LookbookRow key={p.slug} product={p} index={i} stockConfig={stockConfig} />)}
      </div>
    </div>
  );
}
