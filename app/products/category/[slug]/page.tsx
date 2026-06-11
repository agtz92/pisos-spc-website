import { getProducts, getCategories } from '@/lib/graphql';
import { getTenantCached } from '@/lib/modules';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try { const cats = await getCategories('products'); return cats.map((c) => ({ slug: c.slug })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await getCategories('products');
    const cat = cats.find((c) => c.slug === slug);
    return { title: cat ? `${cat.name}` : 'Products' };
  } catch { return {}; }
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categoryName = slug;
  let tenant: Awaited<ReturnType<typeof getTenantCached>> = null;
  try {
    const [p, cats, t] = await Promise.all([
      getProducts({ categorySlug: slug }),
      getCategories('products'),
      getTenantCached(),
    ]);
    products = p;
    tenant = t;
    categoryName = cats.find((c) => c.slug === slug)?.name ?? slug;
  } catch { /* empty */ }

  return (
    <div>
      <Link href="/products" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">← All products</Link>
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => <ProductCard key={p.slug} product={p} stockConfig={tenant} />)}
        </div>
      )}
    </div>
  );
}
