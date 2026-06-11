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
 * Sheet listing detail layout — a dense, agent/datasheet presentation:
 *   • Compact header: title + address (left), price + type badge (right), inline.
 *   • The SPECS are the hero — a prominent bordered grid of all property facts
 *     (beds/baths/area/year/parking/type) as labeled cells, full width.
 *   • A smaller cover image beside the description.
 *   • Amenities as a compact two-column checklist.
 * Minimal, information-dense, B2B/agent feel. All colors come from --template-*
 * vars so it adapts to every visual template.
 */
export default function ListingDetailSheet({ listing }: { listing: Listing }) {
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

      {/* Compact header — title/address (left) · price + badge (right) */}
      <header
        className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b pb-5"
        style={{ borderColor: 'var(--template-panel-border, #e5e7eb)' }}
      >
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight" style={{ color: 'var(--template-ink, #161218)' }}>{listing.title}</h1>
          {address && (
            <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {address}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span data-listing-type-badge className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: 'var(--template-accent, #2563eb)' }}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          {price && (
            <p data-listing-price-box className="text-2xl sm:text-3xl font-bold whitespace-nowrap" style={{ color: 'var(--template-ink, #161218)' }}>
              {price}
              <span className="ml-1.5 align-middle text-xs font-medium capitalize" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{isRent ? '/mo' : ''}</span>
            </p>
          )}
        </div>
      </header>

      {/* Specs datasheet — the hero, full-width grid of labeled cells */}
      {specs.length > 0 && (
        <div
          data-listing-specs-box
          className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-3"
          style={{
            borderColor: 'var(--template-panel-border, #e5e7eb)',
            background: 'var(--template-panel-border, #e5e7eb)',
          }}
        >
          {specs.map(({ label, value }) => (
            <div key={label} className="p-4" style={{ background: 'var(--template-panel, #fff)' }}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>{label}</dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: 'var(--template-ink, #161218)' }}>{value}</dd>
            </div>
          ))}
        </div>
      )}

      {/* Description beside a smaller cover image */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {listing.description && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={listing.description} />
            </div>
          )}
        </div>

        {imageUrl && (
          <div data-listing-cover className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:order-last">
            <Image src={imageUrl} alt={listing.title} fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Amenities — compact two-column checklist */}
      {listing.amenities.length > 0 && (
        <div data-listing-amenities className="mt-8">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
            {listingConfig.copy.amenitiesHeading}
          </h3>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {listing.amenities.map((a) => (
              <div key={a.id} data-listing-amenity-item style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '1rem', height: '1rem', flexShrink: 0, color: 'var(--template-accent, #ec0f7f)' }} viewBox="0 0 20 20" fill="currentColor">
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
