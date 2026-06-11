import { getListing, getListings, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import ListingDetailStandard from '@/components/listings/detail/ListingDetailStandard';
import ListingDetailBrochure from '@/components/listings/detail/ListingDetailBrochure';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try { const l = await getListings(); return l.map((item) => ({ slug: item.slug })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await getListing(slug);
    if (!listing) return {};
    return { title: listing.title };
  } catch { return {}; }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch listing + tenant in parallel — tenant carries the per-module layout
  // variant + color overrides (note: route is /listings but module key is realestate).
  const [listing, tenant] = await Promise.all([
    getListing(slug).catch(() => null),
    getTenant().catch(() => null),
  ]);
  if (!listing) notFound();

  const { layout, moduleStyle } = getModuleSettings(tenant, 'realestate');
  const detailVariant = getLayoutVariant(layout, 'detailVariant', 'standard');

  let detail: React.ReactNode;
  if (detailVariant === 'brochure') detail = <ListingDetailBrochure listing={listing} />;
  else                              detail = <ListingDetailStandard listing={listing} />;

  return <div style={moduleStyle}>{detail}</div>;
}
