import { getProducts, getCategories } from '@/lib/graphql';
import { getTenantCached } from '@/lib/modules';
import { getModuleConfig } from '@/lib/templates/config';
import ProductsListing from '@/components/products/ProductsListing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 86400;

const productsConfig = getModuleConfig('products');

export async function generateStaticParams() {
  try { const cats = await getCategories('products'); return cats.map((c) => ({ slug: c.slug })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await getCategories('products');
    const cat = cats.find((c) => c.slug === slug);
    return cat ? { title: cat.name } : {};
  } catch { return {}; }
}

/**
 * Category listing — same layout variant and module colors as ``/products``
 * (via ``ProductsListing``), filtered to one category, with the category name
 * as the page heading. Unknown slugs 404 instead of rendering an empty page.
 */
export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, categories, tenant] = await Promise.all([
    getProducts({ categorySlug: slug }),
    getCategories('products'),
    getTenantCached(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const header = (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight"
        style={{ color: 'var(--template-ink, #161218)' }}
      >
        {category.name}
      </h1>
    </div>
  );

  if (products.length === 0) {
    return (
      <div>
        {header}
        <div className="text-center py-20" style={{ color: 'var(--template-ink, #161218)', opacity: 0.4 }}>
          <p className="text-sm font-medium">{productsConfig.copy.emptyState}</p>
        </div>
      </div>
    );
  }

  return <ProductsListing products={products} categories={categories} tenant={tenant} header={header} />;
}
