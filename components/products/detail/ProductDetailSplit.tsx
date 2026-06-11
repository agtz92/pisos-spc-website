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
 * Default product detail layout: gallery on the left, details on the right,
 * specifications table full-width below. This is the original (and fallback)
 * presentation — visually identical to the pre-variant detail page.
 */
export default function ProductDetailSplit({ product, stockConfig }: Props) {
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const slides = buildGallery(product);
  const stock = getStockBadge(product.stock, stockConfig);

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/products" data-product-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Products
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image carousel — cover always slide 0, then gallery in order */}
        <ProductGallery slides={slides} productTitle={product.title} />

        {/* Details */}
        <div>
          {product.category && (
            <Link href={`/products/category/${product.category.slug}`}
              data-product-category
              className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:underline">
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 text-3xl font-bold leading-tight">{product.title}</h1>
          {product.brand && <p className="mt-1" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{product.brand}</p>}

          <div className="mt-4 flex items-baseline gap-3">
            {price && <span data-product-price className="text-3xl font-bold">{price}</span>}
            {compareAt && <span className="text-lg line-through" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>{compareAt}</span>}
          </div>

          {/* Stock badge — only renders when tenant has the indicator enabled.
              Colors and labels come from tenant settings (see Settings →
              Product Stock). No hardcoded green/red here. */}
          {stock && (
            <div className="mt-3 flex items-center gap-2">
              <span
                data-product-stock
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: stock.color }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: stock.color }}
                />
                {stock.label}
              </span>
            </div>
          )}

          {product.sku && (
            <p className="mt-2 text-xs" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>SKU: {product.sku}</p>
          )}

          {/* Short description — markdown, but rendered compact above the
              long description. Used as the metadata description too. */}
          {product.shortDescription && (
            <div className="mt-5 prose prose-sm max-w-none dark:prose-invert" data-product-short-description>
              <MarkdownRenderer content={product.shortDescription} />
            </div>
          )}

          {product.description && (
            <div className="mt-6 prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={product.description} />
            </div>
          )}
        </div>
      </div>

      <SpecificationsTable groups={product.specifications ?? []} />
    </div>
  );
}
