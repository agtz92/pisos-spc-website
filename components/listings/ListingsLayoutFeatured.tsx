/**
 * ListingsLayoutFeatured
 *
 * CONCEPT: The first listing gets a cinematic full-width hero treatment with a 21:9
 * aspect ratio image, gradient scrim, and overlaid title/price/specs. All remaining
 * listings appear in a standard 3-col card grid below. Immediately communicates the
 * "top pick" to the visitor.
 *
 * DESIGN DECISIONS:
 * - Hero aspect ratio is 21:9 (ultra-wide / cinematic) to maximize image impact
 * - Price, type badge, title, and 3 spec chips (beds/baths/area) overlay the hero image
 * - A gradient scrim (`linear-gradient to top`) darkens the bottom of the image for legibility
 * - The hero links to the listing detail page; the full overlay area is clickable
 * - Remaining listings use the shared ListingCard component — no special treatment
 * - If only one listing exists, only the hero renders (grid is empty)
 *
 * GOOD FOR: Landing pages for a real estate agency where the agent manually orders
 * listings to surface the best property first. Also effective for "property of the week"
 * editorial placements.
 *
 * MODIFICATION NOTES:
 * - Hero aspect ratio: change `aspectRatio: '21 / 9'` (try `16 / 9` for a taller hero)
 * - To feature the 2nd or 3rd listing as hero: change `listings[0]` / `listings.slice(1)`
 * - To add a "Featured" badge on the hero image: add a positioned span with "Featured" text
 * - Grid below the hero: change `xl:grid-cols-3` to adjust column count
 * - To show the hero title outside the image (below it): move the overlay text div outside
 *   the image Link and apply normal flow positioning
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import ListingCard from '@/components/ListingCard';
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

function HeroListing({ listing }: { listing: Listing }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const price = formatPrice(listing.price, isRent);
  const location = [listing.city, listing.state].filter(Boolean).join(', ');

  return (
    <article
      data-listing-hero-article
      className="group"
      style={{
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        background: 'var(--template-panel, #ffffff)',
        boxShadow: '0 18px 48px rgba(22, 18, 24, 0.08)',
      }}
    >
      {/* Full-width image */}
      <Link href={`/listings/${listing.slug}`} style={{ position: 'relative', display: 'block', aspectRatio: '21 / 9', background: 'var(--template-muted-panel, #f3f4f6)', overflow: 'hidden' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-muted-text, #9ca3af)' }}>
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </div>
        )}
        {/* Overlay badges */}
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: '0.5rem' }}>
          <span data-listing-type-badge style={{ padding: '0.3rem 0.8rem', borderRadius: 999, background: 'color-mix(in srgb, var(--template-accent, #ec0f7f) 90%, transparent)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          {listing.category && (
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: 999, background: 'color-mix(in srgb, var(--template-panel, #fff) 88%, transparent)', color: 'var(--template-ink, #161218)', fontSize: '0.68rem', fontWeight: 700, backdropFilter: 'blur(6px)', border: '1px solid var(--template-panel-border, #e5e7eb)' }}>
              {listing.category.name}
            </span>
          )}
        </div>
        {price && (
          <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
            <span style={{ padding: '0.4rem 1rem', borderRadius: 12, background: 'color-mix(in srgb, var(--template-ink, #161218) 82%, transparent)', color: '#fff', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', backdropFilter: 'blur(6px)' }}>
              {price}
            </span>
          </div>
        )}
      </Link>

      {/* Details row */}
      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem 2rem' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.3rem' }}>
            {listing.propertyType || 'Property'}
          </p>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--template-ink, #161218)' }}>
            <Link href={`/listings/${listing.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
              {listing.title}
            </Link>
          </h2>
          {location && <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)', marginTop: '0.3rem' }}>{location}</p>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--template-muted-text, #6b7280)' }}>
          {formatArea(listing.area) && <span>{formatArea(listing.area)}</span>}
          {listing.bedrooms != null && <span>{listing.bedrooms} rec.</span>}
          {listing.bathrooms != null && <span>{listing.bathrooms} baños</span>}
          {listing.parking != null && <span>{listing.parking} estac.</span>}
        </div>
        <Link
          data-listing-cta
          href={`/listings/${listing.slug}`}
          style={{
            flexShrink: 0, padding: '0.65rem 1.5rem', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem',
            background: 'linear-gradient(135deg, var(--template-accent, #ec0f7f) 0%, var(--template-accent-strong, #c105aa) 100%)',
            color: '#fff', textDecoration: 'none',
          }}
        >
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

export default function ListingsLayoutFeatured({ listings, copy }: Props) {
  const [first, ...rest] = listings;

  return (
    <div className="space-y-8">
      {copy.heroEyebrow && (
        <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)' }}>
          {copy.heroEyebrow}
        </p>
      )}

      <HeroListing listing={first} />

      {rest.length > 0 && (
        <div>
          <div data-listings-section-header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', borderRadius: 2 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--template-muted-text, #6b7280)' }}>
              More Properties
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((l) => <ListingCard key={l.slug} listing={l} portrait />)}
          </div>
        </div>
      )}
    </div>
  );
}
