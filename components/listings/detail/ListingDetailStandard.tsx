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
 * Default listing detail layout: cover image at top, then a two-column body —
 * title/address/description on the left, a sidebar with price, property details
 * and amenities on the right. This is the original (and fallback) presentation —
 * visually identical to the pre-variant detail page.
 */
export default function ListingDetailStandard({ listing }: { listing: Listing }) {
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

  return (
    <article data-listing-detail className="max-w-4xl mx-auto">
      <Link href="/listings" data-listing-breadcrumb className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        ← Back to Listings
      </Link>

      {imageUrl && (
        <div data-listing-cover className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image src={imageUrl} alt={listing.title} fill className="object-cover" priority />
          <span data-listing-type-badge className="absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: 'var(--template-accent, #2563eb)' }}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          {(listing.address || listing.city) && (
            <p className="mt-2 text-gray-500 flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {[listing.address, listing.city, listing.state, listing.zipCode, listing.country].filter(Boolean).join(', ')}
            </p>
          )}

          {listing.description && (
            <div className="mt-6 prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={listing.description} />
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-4">
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

          {listing.amenities.length > 0 && (
            <div data-listing-amenities style={{ borderRadius: '0.75rem', border: '1px solid var(--template-panel-border, #e5e7eb)', background: 'var(--template-panel, #fff)', padding: '1.25rem' }}>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
                {listingConfig.copy.amenitiesHeading}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
        </div>
      </div>
    </article>
  );
}
