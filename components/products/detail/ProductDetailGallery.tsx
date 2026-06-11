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
 * Immersive gallery detail layout. The imagery is the hero: an oversized
 * gallery column with a slim, minimal detail rail (title · price · stock ·
 * short copy) that stays sticky alongside it. Long description + specs sit
 * below, de-emphasized. Best for visual / design-led products. All colors via
 * --template-* so it adapts to every visual template.
 */
export default function ProductDetailGallery({ product, stockConfig }: Props) {
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const slides = buildGallery(product);
  const stock = getStockBadge(product.stock, stockConfig);

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/products" data-product-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Products
      </Link>

      {/* Oversized gallery (left) + slim sticky detail rail (right) */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.85fr)]">
        <div data-product-gallery-immersive>
          <ProductGallery slides={slides} productTitle={product.title} />
        </div>

        <aside className="lg:sticky lg:top-8 self-start">
          {product.category && (
            <Link href={`/products/category/${product.category.slug}`}
              data-product-category
              className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:underline">
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight">{product.title}</h1>
          {product.brand && (
            <p className="mt-1 text-sm" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            {price && <span data-product-price className="text-2xl font-bold">{price}</span>}
            {compareAt && <span className="text-base line-through" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>{compareAt}</span>}
          </div>

          {stock && (
            <div className="mt-3">
              <span
                data-product-stock
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: stock.color }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: stock.color }} />
                {stock.label}
              </span>
            </div>
          )}

          {product.sku && (
            <p className="mt-2 text-xs" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>SKU: {product.sku}</p>
          )}

          {/* Only the short description in the rail — keep it minimal. */}
          {product.shortDescription && (
            <div className="mt-5 prose prose-sm max-w-none dark:prose-invert" data-product-short-description>
              <MarkdownRenderer content={product.shortDescription} />
            </div>
          )}
        </aside>
      </div>

      {/* De-emphasized long copy below the fold */}
      {product.description && (
        <div className="max-w-3xl mt-12 prose prose-sm max-w-none dark:prose-invert">
          <MarkdownRenderer content={product.description} />
        </div>
      )}

      <SpecificationsTable groups={product.specifications ?? []} />
    </div>
  );
}
