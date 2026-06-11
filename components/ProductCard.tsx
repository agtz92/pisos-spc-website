import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { getStockBadge, type StockConfig } from '@/lib/product-stock';
import { stripMarkdown, truncate } from '@/lib/strip-markdown';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
}

export default function ProductCard({
  product,
  stockConfig,
}: {
  product: Product;
  /** Optional — when present, drives the stock pill (text + color). When
   *  null/missing the badge is hidden. Passed by the list page after a
   *  single getTenant() fetch. */
  stockConfig?: StockConfig | null;
}) {
  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const stock = getStockBadge(product.stock, stockConfig);
  // Short description preview (markdown stripped + truncated for compact tile).
  const previewText = truncate(stripMarkdown(product.shortDescription), 90);

  return (
    <article
      data-product-card
      className="group overflow-hidden transition-shadow hover:shadow-md"
      style={{
        borderRadius: 24,
        background: 'var(--template-panel, #ffffff)',
        borderColor: 'var(--template-panel-border, #e5e7eb)',
        boxShadow: '0 14px 40px rgba(22, 18, 24, 0.05)',
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block relative overflow-hidden"
        style={{
          textDecoration: 'none',
          background: 'var(--template-muted-panel, #f9fafb)',
        }}
      >
        {imageUrl ? (
          <div className="aspect-square relative">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center" style={{ color: 'var(--template-panel-border, #e5e7eb)' }}>
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {/* Stock pill — only renders when tenant has the indicator on AND
            the item is out of stock (in-stock items don't get a tag here
            to keep tiles visually quiet — see detail page for the
            in-stock case). Color comes from tenant settings. */}
        {stock && !stock.inStock && (
          <span
            data-product-badge
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]"
            style={{
              background: 'color-mix(in srgb, var(--template-panel, #ffffff) 92%, transparent)',
              color: stock.color,
              border: `1px solid ${stock.color}`,
            }}
          >
            {stock.label}
          </span>
        )}
      </Link>

      <div className="p-5">
        {product.category && (
          <Link
            href={`/products/category/${product.category.slug}`}
            data-product-category
            className="text-xs font-semibold uppercase tracking-[0.12em]"
            style={{ color: 'var(--template-accent, #ec0f7f)', textDecoration: 'none' }}
          >
            {product.category.name}
          </Link>
        )}
        <h2
          className="mt-2 text-xl font-black leading-tight"
          style={{ letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)' }}
        >
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-black/70"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {product.title}
          </Link>
        </h2>
        {product.brand && <p className="mt-1 text-sm" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>}

        {previewText && (
          <p
            className="mt-2 text-sm line-clamp-2"
            style={{ color: 'var(--template-muted-text, #6b7280)' }}
          >
            {previewText}
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          {price && (
            <span data-product-price className="text-xl font-black" style={{ color: 'var(--template-ink, #161218)' }}>
              {price}
            </span>
          )}
          {compareAt && (
            <span className="text-sm line-through" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>
              {compareAt}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
