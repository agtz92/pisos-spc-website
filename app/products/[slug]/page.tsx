import { getProduct, getProducts, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import ProductDetailSplit from '@/components/products/detail/ProductDetailSplit';
import ProductDetailSpecForward from '@/components/products/detail/ProductDetailSpecForward';
import ProductDetailStacked from '@/components/products/detail/ProductDetailStacked';
import ProductDetailGallery from '@/components/products/detail/ProductDetailGallery';
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
    return { title: product.title, description: product.shortDescription || product.description || undefined };
  } catch { return {}; }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch product + tenant in parallel — tenant powers the stock badge config
  // and the per-module layout + color overrides.
  const [product, tenant] = await Promise.all([
    getProduct(slug).catch(() => null),
    getTenant().catch(() => null),
  ]);
  if (!product) notFound();

  // ``tenant`` carries both the stock-config subset and the module palette.
  const { layout, moduleStyle } = getModuleSettings(tenant, 'products');
  const detailVariant = getLayoutVariant(layout, 'detailVariant', 'split');

  let detail: React.ReactNode;
  if      (detailVariant === 'spec-forward') detail = <ProductDetailSpecForward product={product} stockConfig={tenant} />;
  else if (detailVariant === 'stacked')      detail = <ProductDetailStacked     product={product} stockConfig={tenant} />;
  else if (detailVariant === 'gallery')      detail = <ProductDetailGallery     product={product} stockConfig={tenant} />;
  else                                       detail = <ProductDetailSplit       product={product} stockConfig={tenant} />;

  return <div style={moduleStyle}>{detail}</div>;
}
