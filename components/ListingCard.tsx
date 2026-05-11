import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';

function formatPrice(price: string | null): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatArea(area: string | null): string | null {
  if (!area) return null;
  const n = parseFloat(area);
  if (Number.isNaN(n)) return null;
  return `${n.toLocaleString()} m2`;
}

export default function ListingCard({ listing, portrait }: { listing: Listing; portrait?: boolean }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const price = formatPrice(listing.price);
  const isRent = listing.listingType === 'rent';
  const location = [listing.city, listing.state].filter(Boolean).join(', ');
  const summary = listing.description?.trim();
  const visibleAmenities = (listing.amenities ?? []).slice(0, 3);

  return (
    <article
      data-listing-card
      className="group overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md"
      style={{
        borderRadius: 24,
        boxShadow: '0 14px 40px rgba(22, 18, 24, 0.05)',
        background: 'var(--template-panel, #ffffff)',
        borderColor: 'var(--template-panel-border, #e5e7eb)',
      }}
    >
      <div className={portrait ? '' : 'grid gap-0 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]'}>
        <Link
          href={`/listings/${listing.slug}`}
          className={`relative block overflow-hidden ${portrait ? 'aspect-[16/10]' : 'aspect-[4/3] lg:aspect-auto lg:h-full'}`}
          style={{
            textDecoration: 'none',
            background: 'var(--template-muted-panel, #fff4fa)',
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span
              data-listing-type-badge
              className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]"
              style={{
                background: 'color-mix(in srgb, var(--template-panel, #ffffff) 92%, transparent)',
                color: 'var(--template-ink, #161218)',
                borderColor: 'var(--template-panel-border, rgba(22, 18, 24, 0.1))',
                backdropFilter: 'blur(8px)',
              }}
            >
              {isRent ? 'For Rent' : 'For Sale'}
            </span>

            {listing.category && (
              <span
                data-listing-category-badge
                className="rounded-full border px-3 py-1 text-xs font-semibold shadow-sm"
                style={{
                  background: 'color-mix(in srgb, var(--template-panel, #ffffff) 92%, transparent)',
                  color: 'color-mix(in srgb, var(--template-ink, #161218) 72%, #ffffff)',
                  borderColor: 'var(--template-panel-border, rgba(22, 18, 24, 0.08))',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {listing.category.name}
              </span>
            )}
          </div>

          {price && (
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span
                className="rounded-xl px-4 py-2 text-lg font-black backdrop-blur-sm"
                style={{
                  background: 'color-mix(in srgb, var(--template-ink, #161218) 78%, transparent)',
                  color: '#fff8fc',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
                }}
              >
                {price}
                {isRent ? '/mo' : ''}
              </span>
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className="text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: 'var(--template-accent, #ec0f7f)' }}
              >
                {listing.propertyType || 'Property'}
              </p>
              <h2
                className="mt-2 text-2xl font-black leading-tight"
                style={{ letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}
              >
                <Link
                  href={`/listings/${listing.slug}`}
                  className="transition-colors hover:text-black/70"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {listing.title}
                </Link>
              </h2>
            </div>

            {price && !portrait && (
              <div className="text-left lg:text-right">
                <p className="text-3xl font-black leading-none" style={{ color: 'var(--template-ink, #161218)' }}>
                  {price}
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
                  {isRent ? 'Monthly rent' : 'Listed price'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
            {formatArea(listing.area) && <span>{formatArea(listing.area)}</span>}
            {listing.bedrooms != null && <span>{listing.bedrooms} rec.</span>}
            {listing.bathrooms != null && <span>{listing.bathrooms} banos</span>}
            {listing.parking != null && <span>{listing.parking} estac.</span>}
            {listing.yearBuilt != null && <span>{listing.yearBuilt}</span>}
          </div>

          {location && (
            <p className="mt-4 text-base font-semibold text-gray-900">{location}</p>
          )}

          {listing.address && (
            <p className="mt-1 text-sm" style={{ color: 'var(--template-muted-text, #6b7280)' }}>{listing.address}</p>
          )}

          {!portrait && summary && (
            <p className="mt-4 line-clamp-2 text-sm leading-7" style={{ color: 'var(--template-muted-text, #6b7280)' }}>
              {summary}
            </p>
          )}

          {!portrait && visibleAmenities.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity.id}
                  data-listing-amenity-badge
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{
                    borderColor: 'var(--template-panel-border, rgba(22, 18, 24, 0.08))',
                    background: 'var(--template-muted-panel, #fbfbfc)',
                    color: '#5b6472',
                  }}
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
            <Link
              data-listing-primary-btn
              href={`/listings/${listing.slug}`}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold transition-opacity hover:opacity-85"
              style={{
                background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)',
                color: '#fff8fc',
                textDecoration: 'none',
                boxShadow: '0 10px 24px color-mix(in srgb, var(--template-accent, #ec0f7f) 22%, transparent)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.22)',
              }}
            >
              View Property
            </Link>
            {!portrait && (
              <Link
                data-listing-secondary-btn
                href={`/listings/${listing.slug}`}
                className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition-colors hover:border-gray-400 hover:text-gray-900"
                style={{
                  textDecoration: 'none',
                  borderColor: 'color-mix(in srgb, var(--template-accent, #ec0f7f) 20%, transparent)',
                  background: 'color-mix(in srgb, var(--template-muted-panel, #fff8fb) 94%, transparent)',
                  color: 'var(--template-accent-strong, #8f1360)',
                }}
              >
                See Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
