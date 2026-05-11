import { getProducts, getCategories } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getModuleConfig } from '@/lib/templates/config';
import { getTenantCached } from '@/lib/modules';
import ProductsLayoutGrid from '@/components/products/ProductsLayoutGrid';
import ProductsLayoutShowcase from '@/components/products/ProductsLayoutShowcase';
import ProductsLayoutCatalog from '@/components/products/ProductsLayoutCatalog';
import ProductsLayoutLookbook from '@/components/products/ProductsLayoutLookbook';
import ProductsLayoutQuickShop from '@/components/products/ProductsLayoutQuickShop';
import ProductsLayoutMacro from '@/components/products/ProductsLayoutMacro';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Products' };

const productsConfig = getModuleConfig('products');

export default async function ProductsPage() {
  const tenant = await getTenantCached();
  const savedModules = (tenant?.templateConfig?.modules) as Record<string, Record<string, unknown>> | undefined;
  const savedMod = savedModules?.products ?? {};
  const savedLayout = (savedMod.layout ?? {}) as Record<string, unknown>;
  const savedColors = (savedMod.colors ?? {}) as Record<string, unknown>;
  const layoutVariant = (savedLayout.variant as string | undefined) ?? 'grid';

  const moduleStyle = {
    ...(savedColors.accent          ? { '--template-accent':       savedColors.accent }          : {}),
    ...(savedColors.ink             ? { '--template-ink':          savedColors.ink }             : {}),
    ...(savedColors.panelBackground ? { '--template-panel':        savedColors.panelBackground } : {}),
    ...(savedColors.panelBorder     ? { '--template-panel-border': savedColors.panelBorder }     : {}),
  } as Record<string, string>;

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

  let layout: React.ReactNode;
  if (layoutVariant === 'showcase')   layout = <ProductsLayoutShowcase   products={products} categories={categories} />;
  else if (layoutVariant === 'catalog')    layout = <ProductsLayoutCatalog    products={products} categories={categories} />;
  else if (layoutVariant === 'lookbook')   layout = <ProductsLayoutLookbook   products={products} categories={categories} />;
  else if (layoutVariant === 'quick-shop') layout = <ProductsLayoutQuickShop  products={products} categories={categories} />;
  else if (layoutVariant === 'macro')      layout = <ProductsLayoutMacro     products={products} categories={categories} />;
  else                                     layout = <ProductsLayoutGrid products={products} categories={categories} />;

  return <div style={moduleStyle}>{layout}</div>;
}
