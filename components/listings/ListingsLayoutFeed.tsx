/**
 * ListingsLayoutFeed
 *
 * CONCEPT: A compact horizontal-row feed — each listing is a single row with a 200px
 * thumbnail on the left and all key details on the right. Fits more listings in the
 * viewport at once compared to a card grid, making it easier to scan a large inventory.
 *
 * DESIGN DECISIONS:
 * - Row height is driven by the thumbnail height (120px fixed)
 * - Thumbnail uses object-cover with a subtle hover zoom (group-hover:scale-105)
 * - Details column uses flex layout: type badge + title row at top, spec pills below
 * - For-sale vs for-rent is indicated by a colored dot badge (accent = rent, ink = sale)
 * - Price is right-aligned in the details row to visually separate it from the title
 * - A horizontal rule separates each row without a border on the row itself (lighter feel)
 * - No ListingsHero in feed mode — the layout's own header serves as context
 *
 * GOOD FOR: High-volume inventories (50–200+ listings) where users need to scan quickly.
 * Works well for both desktop and tablet where horizontal rows feel natural.
 *
 * MODIFICATION NOTES:
 * - Thumbnail size: change the `width: 200, height: 120` values in the image wrapper
 * - To add more spec pills: add more `<span>` elements in the spec row
 * - To link the row (entire row clickable): wrap the `<article>` in a Link with position:absolute
 * - To add a "Save" bookmark icon: add a button in the right-most position of the details column
 * - To add pagination: slice the listings array and add prev/next controls
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
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return isRent ? `${formatted}/mo` : formatted;
}

function formatArea(area: string | null): string | null {
  if (!area) return null;
  const n = parseFloat(area);
  if (Number.isNaN(n)) return null;
  return `${n.toLocaleString()} m²`;
}

function FeedRow({ listing }: { listing: Listing }) {
  const imageUrl = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const price = formatPrice(listing.price, isRent);
  const location = [listing.city, listing.state].filter(Boolean).join(', ');

  return (
    <article
      data-listing-feed-row
      className="group"
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 0,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        background: 'var(--template-panel, #ffffff)',
        boxShadow: '0 4px 16px rgba(22, 18, 24, 0.04)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Thumbnail */}
      <Link
        href={`/listings/${listing.slug}`}
        style={{ position: 'relative', display: 'block', minHeight: 140, background: 'var(--template-muted-panel, #f3f4f6)', flexShrink: 0 }}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--template-muted-text, #9ca3af)' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          </div>
        )}
        <span
          data-listing-type-badge
          style={{
            position: 'absolute', top: 10, left: 10,
            padding: '0.2rem 0.55rem', borderRadius: 999,
            background: 'color-mix(in srgb, var(--template-panel, #fff) 90%, transparent)',
            color: 'var(--template-ink, #161218)',
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--template-panel-border, #e5e7eb)',
          }}
        >
          {isRent ? 'Rent' : 'Sale'}
        </span>
      </Link>

      {/* Details */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)', marginBottom: '0.2rem' }}>
              {listing.propertyType || 'Property'}
            </p>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--template-ink, #161218)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Link href={`/listings/${listing.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="group-hover:underline underline-offset-2">
                {listing.title}
              </Link>
            </h2>
          </div>
          {price && (
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--template-ink, #161218)' }}>
                {price}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--template-muted-text, #6b7280)' }}>
          {formatArea(listing.area) && <span>{formatArea(listing.area)}</span>}
          {listing.bedrooms != null && <span>{listing.bedrooms} rec.</span>}
          {listing.bathrooms != null && <span>{listing.bathrooms} baños</span>}
          {listing.parking != null && <span>{listing.parking} estac.</span>}
        </div>

        {location && (
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--template-ink, #161218)', marginTop: '0.1rem' }}>{location}</p>
        )}
      </div>
    </article>
  );
}

interface Props {
  listings: Listing[];
  copy: Partial<BasicModuleCopy> & { emptyState: string };
}

export default function ListingsLayoutFeed({ listings, copy }: Props) {
  const forSale = listings.filter((l) => l.listingType === 'sale');
  const forRent = listings.filter((l) => l.listingType === 'rent');

  return (
    <div className="space-y-6">
      {/* Compact summary header */}
      <div data-listing-feed-header style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem 1.25rem',
        padding: '1rem 1.25rem', borderRadius: 12,
        background: 'var(--template-muted-panel, #f9fafb)',
        border: '1px solid var(--template-panel-border, #e5e7eb)',
        fontSize: '0.8rem',
      }}>
        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--template-ink, #161218)', letterSpacing: '-0.03em' }}>
          {listings.length} properties
        </span>
        <span style={{ color: 'var(--template-muted-text, #6b7280)' }}>
          {forSale.length} for sale · {forRent.length} for rent
        </span>
        {copy.heroEyebrow && (
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--template-accent, #ec0f7f)' }}>
            {copy.heroEyebrow}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {listings.map((l) => <FeedRow key={l.slug} listing={l} />)}
      </div>
    </div>
  );
}
