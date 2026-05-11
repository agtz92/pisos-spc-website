/**
 * ListingsLayoutNeighborhood
 *
 * CONCEPT: Groups properties by city, turning the listings page into an
 * area-exploration experience. Each city gets a bold section header showing
 * the city name, listing count, and a for-sale/for-rent breakdown. Inside
 * each section, properties appear as compact horizontal rows (thumbnail + key specs).
 *
 * DESIGN DECISIONS:
 * - Cities are sorted by the number of listings (most populated first)
 * - Within a city, for-sale properties come before for-rent
 * - Each row is compact: 120px thumbnail + type badge + price + title + 3 specs
 * - "Ungrouped" properties (no city data) appear in a final catch-all section
 * - Section headers use a large ink-colored city name + muted metadata line
 *
 * GOOD FOR: Multi-city real estate platforms, relocation tools, or any case where
 * visitors are browsing by geography rather than property type or price.
 *
 * MODIFICATION NOTES:
 * - To group by state instead of city: change `listing.city` to `listing.state`
 * - To group by propertyType instead: change the grouping key to `listing.propertyType`
 * - Row height: adjust the `minHeight` on the thumbnail (currently 90px)
 * - To show a map pin icon next to city name: add SVG before the <h2>
 * - To limit visible rows per city (with "show all" link): slice `cityListings` and add a toggle
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import type { BasicModuleCopy } from '@/lib/templates/config';

function formatPrice(price: string | null, isRent: boolean): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  const f = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return isRent ? `${f}/mo` : f;
}

function NeighborhoodRow({ listing }: { listing: Listing }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const price = formatPrice(listing.price, isRent);

  return (
    <article data-listing-neighborhood-row className="group" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)', transition: 'box-shadow 0.15s' }}>
      <Link href={`/listings/${listing.slug}`} style={{ position: 'relative', display: 'block', minHeight: 90, background: 'var(--template-muted-panel, #f3f4f6)', flexShrink: 0 }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-panel-border, #ccc)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </div>
        )}
        <span data-listing-type-badge style={{ position: 'absolute', bottom: 6, left: 6, padding: '0.15rem 0.45rem', borderRadius: 999, background: isRent ? 'var(--template-accent, #ec0f7f)' : 'var(--template-ink, #161218)', color: '#fff', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          {isRent ? 'Rent' : 'Sale'}
        </span>
      </Link>

      <div style={{ padding: '0.65rem 0.9rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', minWidth: 0 }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2, color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            <Link href={`/listings/${listing.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
              {listing.title}
            </Link>
          </h3>
          {price && <span style={{ flexShrink: 0, fontSize: '0.9rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--template-ink, #161218)' }}>{price}</span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.8rem', fontSize: '0.72rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)' }}>
          <span style={{ color: 'var(--template-accent, #ec0f7f)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{listing.propertyType || 'Property'}</span>
          {listing.bedrooms != null && <span>{listing.bedrooms} bed</span>}
          {listing.bathrooms != null && <span>{listing.bathrooms} bath</span>}
          {listing.area && <span>{parseFloat(listing.area).toLocaleString()} m²</span>}
        </div>
      </div>
    </article>
  );
}

interface Props {
  listings: Listing[];
  copy: Partial<BasicModuleCopy> & { emptyState: string };
}

export default function ListingsLayoutNeighborhood({ listings, copy }: Props) {
  // Group by city, sort cities by listing count desc
  const cityMap = new Map<string, Listing[]>();
  const ungrouped: Listing[] = [];

  listings.forEach((l) => {
    const key = l.city?.trim() || '';
    if (!key) { ungrouped.push(l); return; }
    if (!cityMap.has(key)) cityMap.set(key, []);
    // sale before rent within city
    const arr = cityMap.get(key)!;
    if (l.listingType === 'sale') { arr.unshift(l); } else { arr.push(l); }
  });

  const cities = Array.from(cityMap.entries())
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-10">
      {copy.heroEyebrow && (
        <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)' }}>
          {copy.heroEyebrow}
        </p>
      )}

      {cities.map(([city, cityListings]) => {
        const forSale = cityListings.filter((l) => l.listingType === 'sale').length;
        const forRent = cityListings.filter((l) => l.listingType === 'rent').length;
        return (
          <section key={city}>
            <div data-listing-neighborhood-header style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--template-panel-border, #e5e7eb)' }}>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
                {city}
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', paddingBottom: '0.1rem' }}>
                {cityListings.length} {cityListings.length === 1 ? 'property' : 'properties'}
                {forSale > 0 && ` · ${forSale} sale`}
                {forRent > 0 && ` · ${forRent} rent`}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cityListings.map((l) => <NeighborhoodRow key={l.slug} listing={l} />)}
            </div>
          </section>
        );
      })}

      {ungrouped.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--template-panel-border, #e5e7eb)' }}>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)', lineHeight: 1 }}>
              Other Locations
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ungrouped.map((l) => <NeighborhoodRow key={l.slug} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
