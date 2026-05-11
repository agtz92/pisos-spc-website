/**
 * ListingsLayoutCompare
 *
 * CONCEPT: Side-by-side property comparison. Each listing is a card in a
 * 2–3 column grid, but all cards share a consistent vertical spec structure:
 * image → price → property type → title → spec rows (beds/baths/area/year built).
 * The aligned rows make it easy to compare listings at a glance.
 *
 * DESIGN DECISIONS:
 * - All cards have equal height via `align-items: stretch` on the grid
 * - Spec rows use a label+value pattern with consistent horizontal alignment
 * - Price is large and bold at the top of the text block, not on the image
 * - Image aspect ratio is fixed at 16:10 for visual consistency across cards
 * - A "For Sale / For Rent" badge sits inside the image (top-left)
 * - The CTA button is always at the bottom of the card (flex-grow pushes it down)
 *
 * GOOD FOR: Users who want to compare several properties methodically — e.g.
 * a buyer narrowing down a shortlist. Especially effective for 4–12 listings.
 *
 * MODIFICATION NOTES:
 * - To add more spec rows: add a `<SpecRow>` call in the card body
 * - To change columns: update the grid className (currently sm:2, xl:3)
 * - To show a "compare" checkbox per card: add a checkbox input and manage state
 *   (note: requires converting this to a Client Component with useState)
 * - Image height: change `aspectRatio: '16 / 10'` in the Link style
 * - To remove the price from inside the card header and put it back on the image:
 *   move the price <div> into the image Link and apply absolute positioning
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import ListingsHero from '@/components/ListingsHero';
import type { BasicModuleCopy } from '@/lib/templates/config';

function formatPrice(price: string | null, isRent: boolean): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  const f = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return isRent ? `${f}/mo` : f;
}

function formatArea(area: string | null): string | null {
  if (!area) return null;
  const n = parseFloat(area);
  if (Number.isNaN(n)) return null;
  return `${n.toLocaleString()} m²`;
}

function SpecRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--template-panel-border, #e5e7eb)' }}>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--template-ink, #161218)' }}>{value}</span>
    </div>
  );
}

function CompareCard({ listing }: { listing: Listing }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const price = formatPrice(listing.price, isRent);

  return (
    <article data-listing-compare-card style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)', boxShadow: '0 8px 24px rgba(22,18,24,0.05)' }}>
      {/* Image */}
      <Link href={`/listings/${listing.slug}`} className="block shrink-0 overflow-hidden group" style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--template-muted-panel, #f3f4f6)' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </div>
        )}
        <span data-listing-type-badge style={{ position: 'absolute', top: 12, left: 12, padding: '0.25rem 0.65rem', borderRadius: 999, background: isRent ? 'var(--template-accent, #ec0f7f)' : 'var(--template-ink, #161218)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          {isRent ? 'For Rent' : 'For Sale'}
        </span>
      </Link>

      {/* Card body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem 1.1rem 1.25rem' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.3rem' }}>
          {listing.propertyType || 'Property'}
        </p>
        {price && (
          <p style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)', lineHeight: 1, marginBottom: '0.4rem' }}>
            {price}
          </p>
        )}
        <h2 style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25, color: 'var(--template-ink, #161218)', marginBottom: '0.9rem' }}>
          <Link href={`/listings/${listing.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:underline underline-offset-2">
            {listing.title}
          </Link>
        </h2>

        {/* Spec rows */}
        <div style={{ flex: 1, marginBottom: '1rem' }}>
          <SpecRow label="Area"    value={formatArea(listing.area)} />
          <SpecRow label="Beds"    value={listing.bedrooms != null ? `${listing.bedrooms}` : null} />
          <SpecRow label="Baths"   value={listing.bathrooms != null ? `${listing.bathrooms}` : null} />
          <SpecRow label="Parking" value={listing.parking != null ? `${listing.parking}` : null} />
          <SpecRow label="Built"   value={listing.yearBuilt != null ? `${listing.yearBuilt}` : null} />
          <SpecRow label="City"    value={[listing.city, listing.state].filter(Boolean).join(', ') || null} />
        </div>

        <Link data-listing-cta href={`/listings/${listing.slug}`} style={{ display: 'block', textAlign: 'center', padding: '0.6rem 1rem', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem', background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)', color: '#fff', textDecoration: 'none' }}>
          View Property
        </Link>
      </div>
    </article>
  );
}

interface Props {
  listings: Listing[];
  copy: Partial<BasicModuleCopy> & { emptyState: string };
}

export default function ListingsLayoutCompare({ listings, copy }: Props) {
  const forSale = listings.filter((l) => l.listingType === 'sale');
  const forRent = listings.filter((l) => l.listingType === 'rent');
  const featuredAmenities = Array.from(
    new Set(listings.flatMap((l) => (l.amenities ?? []).slice(0, 2).map((a) => a.name))),
  ).slice(0, 4);

  return (
    <div className="space-y-8">
      {listings.length > 0 && (
        <ListingsHero
          totalCount={listings.length}
          forSaleCount={forSale.length}
          forRentCount={forRent.length}
          featuredAmenities={featuredAmenities}
          eyebrow={copy.heroEyebrow ?? 'Property Finder'}
          description={copy.heroDescription ?? ''}
        />
      )}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" style={{ alignItems: 'stretch' }}>
        {listings.map((l) => <CompareCard key={l.slug} listing={l} />)}
      </div>
    </div>
  );
}
