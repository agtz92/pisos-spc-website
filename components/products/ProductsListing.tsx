/**
 * ProductsListing — renders a product list with the tenant's chosen Products
 * layout variant and module colors.
 *
 * Shared by ``/products`` and ``/products/category/[slug]`` so a category page
 * looks exactly like the main catalog, just filtered. Before this, the
 * category page had its own bare grid that ignored the layout and colors.
 */
import type { Category, Product, TenantInfo } from '@/lib/graphql';
import ProductsLayoutGrid from '@/components/products/ProductsLayoutGrid';
import ProductsLayoutShowcase from '@/components/products/ProductsLayoutShowcase';
import ProductsLayoutCatalog from '@/components/products/ProductsLayoutCatalog';
import ProductsLayoutLookbook from '@/components/products/ProductsLayoutLookbook';
import ProductsLayoutQuickShop from '@/components/products/ProductsLayoutQuickShop';
import ProductsLayoutMacro from '@/components/products/ProductsLayoutMacro';

interface Props {
  products: Product[];
  categories: Category[];
  tenant: TenantInfo | null;
  /** Optional content rendered above the layout (e.g. a category heading). */
  header?: React.ReactNode;
}

export default function ProductsListing({ products, categories, tenant, header }: Props) {
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

  // ``tenant`` already carries the stock-config subset (Product Stock fields
  // were added to TenantInfo + the GraphQL fragment in lib/graphql.ts).
  // Passing it as ``stockConfig`` lets each renderer compute its badge with
  // tenant-defined text + color, instead of the old hardcoded green/red.
  const stockConfig = tenant ?? null;
  const props = { products, categories, stockConfig };

  let layout: React.ReactNode;
  if (layoutVariant === 'showcase')        layout = <ProductsLayoutShowcase  {...props} />;
  else if (layoutVariant === 'catalog')    layout = <ProductsLayoutCatalog   {...props} />;
  else if (layoutVariant === 'lookbook')   layout = <ProductsLayoutLookbook  {...props} />;
  else if (layoutVariant === 'quick-shop') layout = <ProductsLayoutQuickShop {...props} />;
  else if (layoutVariant === 'macro')      layout = <ProductsLayoutMacro     {...props} />;
  else                                     layout = <ProductsLayoutGrid      {...props} />;

  return (
    <div style={moduleStyle}>
      {header}
      {layout}
    </div>
  );
}
