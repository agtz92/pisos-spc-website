import { getProduct, getProducts, resolveMediaUrl } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    if (!product) return {};
    return { title: product.title, description: product.description || undefined };
  } catch { return {}; }
}

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  return isNaN(n) ? null : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) notFound();

  const imageUrl = resolveMediaUrl(product.coverImage);
  const price = formatPrice(product.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const inStock = product.stock == null || product.stock > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/products" data-product-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Products
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div>
          {imageUrl ? (
            <div data-product-detail-image className="relative aspect-square rounded-xl overflow-hidden border">
              <Image src={imageUrl} alt={product.title} fill className="object-cover" priority />
            </div>
          ) : (
            <div className="aspect-square rounded-xl border flex items-center justify-center bg-gray-50 text-gray-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          )}
        </div>

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

          <div className="mt-3 flex items-center gap-2">
            <span data-product-stock className={`inline-flex items-center gap-1 text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-400'}`} />
              {inStock ? (product.stock != null ? `${product.stock} in stock` : 'In stock') : 'Out of stock'}
            </span>
          </div>

          {product.sku && (
            <p className="mt-2 text-xs" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>SKU: {product.sku}</p>
          )}

          {product.description && (
            <div className="mt-6 prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={product.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
