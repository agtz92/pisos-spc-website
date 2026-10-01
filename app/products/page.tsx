import { getProducts, getCategories } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getModuleConfig } from '@/lib/templates/config';
import { getTenantCached } from '@/lib/modules';
import { buildModuleMetadata } from '@/lib/module-seo';
import ProductsListing from '@/components/products/ProductsListing';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantCached().catch(() => null);
  return buildModuleMetadata(tenant, 'products', 'Products');
}

const productsConfig = getModuleConfig('products');

export default async function ProductsPage() {
  const tenant = await getTenantCached();
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let error: string | null = null;

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories('products')]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load products';
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--template-ink, #161218)', opacity: 0.5 }}>
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--template-ink, #161218)', opacity: 0.4 }}>
        <p className="text-sm font-medium">{productsConfig.copy.emptyState}</p>
      </div>
    );
  }

  return <ProductsListing products={products} categories={categories} tenant={tenant} />;
}
