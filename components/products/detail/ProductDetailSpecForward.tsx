import MarkdownRenderer from '@/components/MarkdownRenderer';
import SpecificationsTable from '@/components/SpecificationsTable';
import ProductGallery from '@/components/ProductGallery';
import { buildGallery } from '@/lib/product-gallery';
import { getStockBadge, type StockConfig } from '@/lib/product-stock';
import type { Product } from '@/lib/graphql';
import Link from 'next/link';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  return isNaN(n) ? null : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

interface Props {
  product: Product;
  stockConfig: StockConfig | null;
}

/**
 * Spec-forward / datasheet detail layout. Built for technical & B2B catalogs
 * (industrial parts, materials) where the specifications table is the hero,
 * not the imagery. Structure:
 *   • Full-width header band: category · title · brand · price · stock.
 *   • Two columns: compact sticky gallery (left) · key-facts strip +
 *     prominent Specifications table (right).
 *   • Full-width long-form description below.
 * All colors come from --template-* vars so it adapts to every visual template.
 */
export default function ProductDetailSpecForward({ product, stockConfig }: Props) {
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const slides = buildGallery(product);
  const stock = getStockBadge(product.stock, stockConfig);
  const hasSpecs = (product.specifications ?? []).some((g) => g.rows && g.rows.length > 0);

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/products" data-product-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Products
      </Link>

      {/* Header band — datasheet masthead */}
      <header
        className="border-b pb-6 mb-8"
        style={{ borderColor: 'var(--template-panel-border, #e5e7eb)' }}
      >
        {product.category && (
          <Link href={`/products/category/${product.category.slug}`}
            data-product-category
            className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:underline">
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-1 text-4xl font-bold leading-tight tracking-tight">{product.title}</h1>
        {product.brand && (
          <p className="mt-1 text-base" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {price && (
            <div className="flex items-baseline gap-2">
              <span data-product-price className="text-3xl font-bold">{price}</span>
              {compareAt && <span className="text-lg line-through" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>{compareAt}</span>}
            </div>
          )}
          {stock && (
            <span
              data-product-stock
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: stock.color }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: stock.color }} />
              {stock.label}
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Left — compact sticky gallery */}
        <div className="lg:sticky lg:top-8 self-start space-y-5">
          <ProductGallery slides={slides} productTitle={product.title} />
          {product.shortDescription && (
            <div className="prose prose-sm max-w-none dark:prose-invert" data-product-short-description>
              <MarkdownRenderer content={product.shortDescription} />
            </div>
          )}
        </div>

        {/* Right — specifications as the hero */}
        <div>
          {/* Key facts strip — quick datasheet identity */}
          <dl
            className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-3"
            style={{
              borderColor: 'var(--template-panel-border, #e5e7eb)',
              background: 'var(--template-panel-border, #e5e7eb)',
            }}
          >
            {[
              product.sku ? { label: 'SKU', value: product.sku } : null,
              product.brand ? { label: 'Brand', value: product.brand } : null,
              product.category ? { label: 'Category', value: product.category.name } : null,
            ].filter(Boolean).map((fact, i) => (
              <div key={i} className="p-3" style={{ background: 'var(--template-panel, #ffffff)' }}>
                <dt className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>
                  {fact!.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium" style={{ color: 'var(--template-ink, #161218)' }}>
                  {fact!.value}
                </dd>
              </div>
            ))}
          </dl>

          {hasSpecs && (
            <h2 className="mt-8 text-xl font-bold tracking-tight" style={{ color: 'var(--template-ink, #161218)' }}>
              Specifications
            </h2>
          )}
          {/* SpecificationsTable owns its own spacing (mt-12) — neutralize it so
              it sits right under the heading. */}
          <div className="[&>section]:mt-4">
            <SpecificationsTable groups={product.specifications ?? []} />
          </div>

          {product.description && (
            <div className="mt-10 prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={product.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
