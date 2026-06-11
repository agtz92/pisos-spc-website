/**
 * ProductsLayoutMacro
 *
 * CONCEPT: Typography-first product index. Newspaper macro aesthetic — big type,
 * strong rules, no cards. A lead product dominates the top with a large headline
 * and full-width image. Remaining products stack as wide rows with the price as
 * the left "dateline" column — the commercial equivalent of a newspaper date.
 *
 * DESIGN DECISIONS:
 * - Lead: top rule bar (category + brand + stock status), giant title,
 *   full-width 16:9 image, price block + description below image
 * - Rows: left dateline = formatted price (data-product-price, template-styled),
 *   center = category (data-product-category) + title + brand, right = 88×88 thumbnail
 * - CategoryFilterBar above everything
 * - No cards, no shadows — just type and a bottom rule per row
 *
 * GOOD FOR: Product catalogs where the product name and price sell themselves.
 * Works with every template via CSS vars + existing data-product-* pipeline.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { getStockBadge, type StockConfig } from '@/lib/product-stock';
import { stripMarkdown, truncate } from '@/lib/strip-markdown';

// ── CSS variable tokens ─────────────────────────────────────────────────────

const v = {
  accent:      'var(--template-accent, #e5201b)',
  ink:         'var(--template-ink, #161218)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  mutedPanel:  'var(--template-muted-panel, #f3f4f6)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

// ── MacroProductLead ────────────────────────────────────────────────────────

function MacroProductLead({ product, stockConfig }: { product: Product; stockConfig: StockConfig | null | undefined }) {
  const img = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const stock = getStockBadge(product.stock, stockConfig);
  const previewText = product.shortDescription
    ? truncate(stripMarkdown(product.shortDescription), 240)
    : null;

  return (
    <article data-product-macro-lead className="group">
      {/* Top rule — newspaper section divider */}
      <div style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}`, padding: '4px 0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {product.category && (
          <Link
            data-product-category
            href={`/products/category/${product.category.slug}`}
            className="font-black uppercase tracking-widest"
            style={{ fontSize: '0.65rem', color: v.accent, background: v.ink, padding: '2px 8px', textDecoration: 'none' }}
          >
            {product.category.name}
          </Link>
        )}
        {product.brand && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.06em' }}>
            {product.brand}
          </span>
        )}
        {stock && !stock.inStock && (
          <span data-product-badge className="font-semibold" style={{ fontSize: '0.65rem', color: stock.color, letterSpacing: '0.05em' }}>
            {stock.label}
          </span>
        )}
        {price && (
          <span data-product-price className="font-black ml-auto" style={{ fontSize: '0.9rem', color: v.ink, letterSpacing: '-0.02em' }}>
            {price}
          </span>
        )}
      </div>

      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
        {/* Headline first — newspaper style */}
        <h1
          className="font-black leading-[0.92] tracking-tight group-hover:underline underline-offset-4 mb-5"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', color: v.ink }}
        >
          {product.title}
        </h1>

        {/* Image below headline */}
        {img && (
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: '16 / 9',
              background: v.mutedPanel,
              border: `2px solid ${v.panelBorder}`,
              borderRadius: 0,
            }}
          >
            <Image
              src={img}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        )}
      </Link>

      {/* Price block + description below image */}
      <div className="mt-4 flex items-start gap-6 flex-wrap">
        {(price || compareAt) && (
          <div className="flex-shrink-0">
            {price && (
              <p data-product-price style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: v.ink, lineHeight: 1 }}>
                {price}
              </p>
            )}
            {compareAt && (
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: v.mutedText, textDecoration: 'line-through', marginTop: '0.2rem' }}>
                {compareAt}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {(previewText || product.description) && (
            <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: v.mutedText, lineHeight: 1.6 }}>
              {previewText ?? product.description}
            </p>
          )}
          <Link
            href={`/products/${product.slug}`}
            data-product-cta
            className="inline-block mt-3 font-black uppercase tracking-wider"
            style={{ fontSize: '0.72rem', padding: '0.5rem 1.25rem', background: `linear-gradient(135deg, ${v.accent} 0%, var(--template-accent-strong, #c105aa) 100%)`, color: '#fff', textDecoration: 'none', borderRadius: 0 }}
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── MacroProductRow ─────────────────────────────────────────────────────────

function MacroProductRow({ product, index, stockConfig }: { product: Product; index: number; stockConfig: StockConfig | null | undefined }) {
  const img = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const stock = getStockBadge(product.stock, stockConfig);

  return (
    <article
      data-product-macro-row
      className="group"
      style={{ borderBottom: `2px solid ${v.panelBorder}` }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex items-stretch gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6"
        style={{ textDecoration: 'none' }}
      >
        {/* Price dateline column */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start pt-1 hidden sm:flex"
          style={{ width: 80, borderRight: `2px solid ${v.panelBorder}`, paddingRight: '1rem' }}
        >
          {price ? (
            <>
              <span
                data-product-price
                className="font-black leading-tight tabular-nums text-center"
                style={{ fontSize: '0.9rem', color: v.ink }}
              >
                {price}
              </span>
              {compareAt && (
                <span className="font-semibold mt-0.5 text-center" style={{ fontSize: '0.6rem', color: v.mutedText, textDecoration: 'line-through' }}>
                  {compareAt}
                </span>
              )}
            </>
          ) : (
            <span
              className="font-black tabular-nums"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: v.ink, opacity: 0.2 }}
            >
              #{String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {product.category && (
              <span
                data-product-category
                className="font-black uppercase tracking-widest"
                style={{ fontSize: '0.62rem', color: v.accent }}
              >
                {product.category.name}
              </span>
            )}
            {stock && !stock.inStock && (
              <span data-product-badge style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.1rem 0.4rem', background: v.mutedPanel, color: stock.color, border: `1px solid ${stock.color}` }}>
                {stock.label}
              </span>
            )}
          </div>
          <h2
            className="font-black leading-[1.02] tracking-tight group-hover:underline underline-offset-4"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', color: v.ink }}
          >
            {product.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-2" style={{ fontSize: '0.72rem', color: v.mutedText }}>
            {product.brand && <span style={{ fontWeight: 700, color: v.ink }}>{product.brand}</span>}
            {/* Mobile price fallback */}
            {price && <span className="sm:hidden" style={{ fontWeight: 700, color: v.ink }}>&middot; {price}</span>}
            <span className="hidden sm:inline" aria-hidden style={{ marginLeft: 'auto' }}>#{String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {img && (
          <div
            className="relative overflow-hidden flex-shrink-0 self-center"
            style={{ width: 88, height: 88, background: v.mutedPanel, border: `2px solid ${v.panelBorder}`, borderRadius: 0 }}
          >
            <Image
              src={img}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

// ── MacroSectionLabel ───────────────────────────────────────────────────────

function MacroSectionLabel({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2 mb-0"
      style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}` }}
    >
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
      <span
        className="font-black uppercase tracking-[0.2em]"
        style={{ fontSize: '0.65rem', color: v.ink }}
      >
        &#8213; {label} &#8213;
      </span>
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
    </div>
  );
}

// ── ProductsLayoutMacro ─────────────────────────────────────────────────────

interface Props {
  products: Product[];
  categories: Category[];
  stockConfig?: StockConfig | null;
}

export default function ProductsLayoutMacro({ products, categories, stockConfig }: Props) {
  const [lead, ...rest] = products;

  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        {/* Lead product */}
        {lead && (
          <div className="mb-16">
            <MacroProductLead product={lead} stockConfig={stockConfig} />
          </div>
        )}

        {/* Remaining products */}
        {rest.length > 0 && (
          <div>
            <MacroSectionLabel label="More Products" />
            <div style={{ borderTop: `1px solid ${v.panelBorder}` }}>
              {rest.map((product, i) => (
                <MacroProductRow key={product.slug} product={product} index={i + 2} stockConfig={stockConfig} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
