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
 * Gallery listing detail layout — a photo-led, immersive showcase:
 *   • Large full-width cover image (~60vh, rounded) with the For Sale/For Rent
 *     badge overlaid in the top-left corner.
 *   • Title, address and a prominent price line directly beneath the image.
 *   • A two-column body: the description (left) alongside a sticky sidebar
 *     (right) holding the price box + property-details box.
 *   • Amenities as a responsive grid below the fold.
 * All colors come from --template-* vars so it adapts to every visual template.
 */
export default function ListingDetailGallery({ listing }: { listing: Listing }) {
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
    <article data-listing-detail className="max-w-6xl mx-auto">
      <Link href="/listings" data-listing-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Listings
      </Link>

      {/* Hero cover — the imagery leads */}
      {imageUrl && (
        <div data-listing-cover className="relative w-full overflow-hidden rounded-2xl" style={{ height: '60vh', maxHeight: '620px' }}>
          <Image src={imageUrl} alt={listing.title} fill className="object-cover" priority />
          <span data-listing-type-badge className="absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: 'var(--template-accent, #2563eb)' }}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      )}

      {/* Title · address · prominent price line */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: 'var(--template-ink, #161218)' }}>{listing.title}</h1>
          {address && (
            <p className="mt-2 flex items-center gap-1.5" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {address}
            </p>
          )}
        </div>
        {price && (
          <p className="text-3xl sm:text-4xl font-bold whitespace-nowrap" style={{ color: 'var(--template-accent, #2563eb)' }}>
            {price}
            <span className="ml-2 align-middle text-sm font-medium capitalize" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{isRent ? 'Monthly rent' : 'Sale price'}</span>
          </p>
        )}
      </div>

      {/* Body — description (left) + sticky price/specs sidebar (right) */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {listing.description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={listing.description} />
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-8 self-start space-y-4">
          {price && (
            <div data-listing-price-box className="rounded-xl border p-5">
              <p className="text-3xl font-bold">{price}</p>
              <p className="text-sm mt-1 capitalize" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{isRent ? 'Monthly rent' : 'Sale price'}</p>
            </div>
          )}

          {specs.length > 0 && (
            <div data-listing-specs-box className="rounded-xl border p-5">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #6b7280)' }}>Property Details</h3>
              <dl className="space-y-2">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt style={{ color: 'var(--template-muted-text, #6b7280)' }}>{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Amenities — responsive grid below the fold */}
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
