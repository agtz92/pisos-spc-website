import { getListings } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getModuleConfig } from '@/lib/templates/config';
import { getTenantCached } from '@/lib/modules';
import ListingsLayoutCards from '@/components/listings/ListingsLayoutCards';
import ListingsLayoutFeed from '@/components/listings/ListingsLayoutFeed';
import ListingsLayoutFeatured from '@/components/listings/ListingsLayoutFeatured';
import ListingsLayoutNeighborhood from '@/components/listings/ListingsLayoutNeighborhood';
import ListingsLayoutCompare from '@/components/listings/ListingsLayoutCompare';
import ListingsLayoutMacro from '@/components/listings/ListingsLayoutMacro';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Listings' };

const realestateConfig = getModuleConfig('realestate');

export default async function ListingsPage() {
  const tenant = await getTenantCached();
  const savedModules = (tenant?.templateConfig?.modules) as Record<string, Record<string, unknown>> | undefined;
  const savedMod = savedModules?.realestate ?? {};
  const savedCopy = ((savedMod.copy ?? {}) as Partial<typeof realestateConfig.copy>);
  const savedLayout = (savedMod.layout ?? {}) as Record<string, unknown>;
  const savedColors = (savedMod.colors ?? {}) as Record<string, unknown>;
  const copy = { ...realestateConfig.copy, ...savedCopy };
  const layoutVariant = (savedLayout.variant as string | undefined) ?? 'cards';

  const moduleStyle = {
    ...(savedColors.accent          ? { '--template-accent':       savedColors.accent }          : {}),
    ...(savedColors.ink             ? { '--template-ink':          savedColors.ink }             : {}),
    ...(savedColors.panelBackground ? { '--template-panel':        savedColors.panelBackground } : {}),
    ...(savedColors.panelBorder     ? { '--template-panel-border': savedColors.panelBorder }     : {}),
  } as Record<string, string>;

  let listings: Awaited<ReturnType<typeof getListings>> = [];
  let error: string | null = null;

  try {
    listings = await getListings();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load listings';
  }

  if (error) return <div className="text-center py-20 text-gray-500"><p>{error}</p></div>;

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-sm font-medium">{copy.emptyState}</p>
      </div>
    );
  }

  let layout: React.ReactNode;
  if (layoutVariant === 'feed')         layout = <ListingsLayoutFeed         listings={listings} copy={copy} />;
  else if (layoutVariant === 'featured')     layout = <ListingsLayoutFeatured     listings={listings} copy={copy} />;
  else if (layoutVariant === 'neighborhood') layout = <ListingsLayoutNeighborhood listings={listings} copy={copy} />;
  else if (layoutVariant === 'compare')      layout = <ListingsLayoutCompare      listings={listings} copy={copy} />;
  else if (layoutVariant === 'macro')        layout = <ListingsLayoutMacro        listings={listings} copy={copy} />;
  else                                       layout = <ListingsLayoutCards listings={listings} copy={copy} />;

  return <div style={moduleStyle}>{layout}</div>;
}
