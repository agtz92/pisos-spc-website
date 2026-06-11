import { resolveMediaUrl } from '@/lib/graphql';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from 'next/image';
import Link from 'next/link';
import { getModuleConfig } from '@/lib/templates/config';
import type { Listing } from '@/lib/graphql';

function formatPrice(price: string | null, isRent: boolean): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (isNaN(n)) return null;
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return isRent ? `${formatted}/mo` : formatted;
}

/**
 * Brochure listing detail layout. Built as a real-estate "for sale" brochure:
 *   • Full-bleed cover hero (~60vh) with dark gradient overlay; the For Sale/For
 *     Rent badge, title, address and price sit over the image in white.
 *   • A full-width horizontal spec band of bordered cells (beds/baths/area/…).
 *   • Full-width description (max-w-3xl) then a responsive amenities grid.
 * All colors come from --template-* vars so it adapts to every visual template.
 * Falls back to a plain title block when no cover image is present.
 */
export default function ListingDetailBrochure({ listing }: { listing: Listing }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const price = formatPrice(listing.price, isRent);
  const listingConfig = getModuleConfig('realestate');

  const specs = [
    listing.bedrooms != null && { label: 'Bedrooms', value: String(listing.bedrooms) },
    listing.bathrooms != null && { label: 'Bathrooms', value: String(listing.bathrooms) },
    listing.area != null && { label: 'Area', value: `${parseFloat(listing.area).toLocaleString()} m²` },
    listing.yearBuilt != null && { label: 'Year Built', value: String(listing.yearBuilt) },
    listing.parking != null && { label: 'Parking', value: String(listing.parking) },
    listing.propertyType && { label: 'Type', value: listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1) },
  ].filter(Boolean) as { label: string; value: string }[];

  const address = [listing.address, listing.city, listing.state, listing.zipCode, listing.country].filter(Boolean).join(', ');

  return (
    <article data-listing-detail className="max-w-5xl mx-auto">
      <Link href="/listings" data-listing-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Listings
      </Link>

      {imageUrl ? (
        <div data-listing-cover className="relative w-full overflow-hidden rounded-xl" style={{ height: '60vh', maxHeight: '560px' }}>
          <Image src={imageUrl} alt={listing.title} fill className="object-cover" priority />
          {/* Dark gradient so white text stays legible over any image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)' }} />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-white">
            <span data-listing-type-badge className="inline-block rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: 'var(--template-accent, #2563eb)' }}>
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">{listing.title}</h1>
            {address && (
              <p className="mt-2 flex items-center gap-1.5 text-sm sm:text-base text-white/80">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {address}
              </p>
            )}
            {price && (
              <p data-listing-price-box className="mt-4 text-3xl sm:text-4xl font-bold">
                {price}
                <span className="ml-2 align-middle text-sm font-medium text-white/70 capitalize">{isRent ? 'Monthly rent' : 'Sale price'}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Fallback when no cover image — plain title block */
        <div>
          <span data-listing-type-badge className="inline-block rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: 'var(--template-accent, #2563eb)' }}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight" style={{ color: 'var(--template-ink, #161218)' }}>{listing.title}</h1>
          {address && (
            <p className="mt-2 flex items-center gap-1.5" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {address}
            </p>
          )}
          {price && (
            <p data-listing-price-box className="mt-4 text-3xl sm:text-4xl font-bold" style={{ color: 'var(--template-ink, #161218)' }}>
              {price}
              <span className="ml-2 align-middle text-sm font-medium capitalize" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{isRent ? 'Monthly rent' : 'Sale price'}</span>
            </p>
          )}
        </div>
      )}

      {/* Full-width horizontal spec band — bordered cells */}
      {specs.length > 0 && (
        <div
          data-listing-specs-box
          className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-3 lg:grid-cols-6"
          style={{
            borderColor: 'var(--template-panel-border, #e5e7eb)',
            background: 'var(--template-panel-border, #e5e7eb)',
          }}
        >
          {specs.map(({ label, value }) => (
            <div key={label} className="p-4 text-center" style={{ background: 'var(--template-panel, #fff)' }}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>{label}</dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: 'var(--template-ink, #161218)' }}>{value}</dd>
            </div>
          ))}
        </div>
      )}

      {/* Full-width description */}
      {listing.description && (
        <div className="mt-10 prose prose-sm max-w-3xl dark:prose-invert">
          <MarkdownRenderer content={listing.description} />
        </div>
      )}

      {/* Amenities as a responsive grid */}
      {listing.amenities.length > 0 && (
        <div data-listing-amenities className="mt-10">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
            {listingConfig.copy.amenitiesHeading}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listing.amenities.map((a) => (
              <div key={a.id} data-listing-amenity-item style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0, color: 'var(--template-accent, #ec0f7f)' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: '0.875rem', color: 'var(--template-ink, #161218)' }}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
