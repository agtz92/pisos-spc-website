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
 * Stacked editorial detail layout. A single-column, magazine-style reading
 * flow: centered masthead (category · title · brand · price · stock), a large
 * full-width gallery, then long-form copy in a narrow reading column, with the
 * specifications table full-width below. Best for story-driven / lifestyle
 * products where the description carries the sell. All colors via --template-*.
 */
export default function ProductDetailStacked({ product, stockConfig }: Props) {
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const slides = buildGallery(product);
  const stock = getStockBadge(product.stock, stockConfig);

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/products" data-product-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Products
      </Link>

      {/* Centered editorial masthead */}
      <header className="max-w-2xl mx-auto text-center">
        {product.category && (
          <Link href={`/products/category/${product.category.slug}`}
            data-product-category
            className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:underline">
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight">{product.title}</h1>
        {product.brand && (
          <p className="mt-1" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>
        )}

        <div className="mt-4 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap">
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
        {product.sku && (
          <p className="mt-2 text-xs" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>SKU: {product.sku}</p>
        )}
      </header>

      {/* Full-width gallery */}
      <div className="mt-8">
        <ProductGallery slides={slides} productTitle={product.title} />
      </div>

      {/* Long-form copy in a narrow reading column */}
      <div className="max-w-2xl mx-auto mt-10">
        {product.shortDescription && (
          <div className="prose prose-base max-w-none dark:prose-invert" data-product-short-description>
            <MarkdownRenderer content={product.shortDescription} />
          </div>
        )}
        {product.description && (
          <div className="mt-6 prose prose-base max-w-none dark:prose-invert">
            <MarkdownRenderer content={product.description} />
          </div>
        )}
      </div>

      <SpecificationsTable groups={product.specifications ?? []} />
    </div>
  );
}
