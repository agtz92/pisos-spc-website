/**
 * ListingsLayoutMacro
 *
 * CONCEPT: Typography-first property index. Newspaper macro aesthetic — big type,
 * strong rules, no cards. A lead listing dominates the top with the address and
 * title huge and the full-width image below. Remaining listings stack as wide rows
 * with a compact price as the left "dateline" column.
 *
 * DESIGN DECISIONS:
 * - Lead: top rule bar (type badge + property type + city), giant headline,
 *   full-width 16:9 image, key specs + description below
 * - Rows: left dateline = compact price ($1.2M / $2.5K/mo), center = property type
 *   + title + location + bedroom/bath/area specs, right = 88×88 thumbnail
 * - No cards, no shadows — just type and a bottom rule per row
 *
 * GOOD FOR: Real estate portals where the property name and price lead.
 * Works with every template via CSS vars.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import type { BasicModuleCopy } from '@/lib/templates/config';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

// ── CSS variable tokens ─────────────────────────────────────────────────────

const v = {
  accent:      'var(--template-accent, #e5201b)',
  ink:         'var(--template-ink, #161218)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  mutedPanel:  'var(--template-muted-panel, #f3f4f6)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatPriceFull(price: string | null, isRent: boolean): string | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  return isRent ? `${formatted}/mo` : formatted;
}

/** Compact: $1.2M, $500K, $2,500/mo */
function formatPriceCompact(price: string | null, isRent: boolean): { line1: string; line2?: string } | null {
  if (!price) return null;
  const n = parseFloat(price);
  if (Number.isNaN(n)) return null;
  let val: string;
  if (n >= 1_000_000) val = `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  else if (n >= 1_000) val = `$${Math.round(n / 1_000)}K`;
  else val = `$${Math.round(n)}`;
  return isRent ? { line1: val, line2: '/mo' } : { line1: val };
}

function formatArea(area: string | null): string | null {
  if (!area) return null;
  const n = parseFloat(area);
  if (Number.isNaN(n)) return null;
  return `${n.toLocaleString()} m²`;
}

function SpecPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: v.mutedText }}>
      {children}
    </span>
  );
}

// ── MacroListingLead ────────────────────────────────────────────────────────

function MacroListingLead({ listing }: { listing: Listing }) {
  const img = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const priceFull = formatPriceFull(listing.price, isRent);
  const location = [listing.city, listing.state].filter(Boolean).join(', ');
  const area = formatArea(listing.area);

  return (
    <article data-listing-macro-lead className="group">
      {/* Top rule — newspaper section divider */}
      <div style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}`, padding: '4px 0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span
          data-listing-type-badge
          className="font-black uppercase tracking-widest"
          style={{ fontSize: '0.65rem', color: v.accent, background: v.ink, padding: '2px 8px' }}
        >
          {isRent ? 'For Rent' : 'For Sale'}
        </span>
        {listing.propertyType && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.06em' }}>
            {listing.propertyType}
          </span>
        )}
        {location && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.05em' }}>
            {location}
          </span>
        )}
        {priceFull && (
          <span className="font-black ml-auto" style={{ fontSize: '0.9rem', color: v.ink, letterSpacing: '-0.02em' }}>
            {priceFull}
          </span>
        )}
      </div>

      <Link href={`/listings/${listing.slug}`} style={{ textDecoration: 'none' }}>
        {/* Headline first */}
        <h1
          className="font-black leading-[0.92] tracking-tight group-hover:underline underline-offset-4 mb-5"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', color: v.ink }}
        >
          {listing.title}
        </h1>

        {/* Image below headline */}
        {img && (
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: '16 / 9',
              background: v.mutedPanel,
              border: `2px solid ${v.panelBorder}`,
              borderRadius: 0,
            }}
          >
            <Image
              src={img}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        )}
      </Link>

      {/* Specs + description below image */}
      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
          {listing.bedrooms != null && <SpecPill>{listing.bedrooms} bed</SpecPill>}
          {listing.bathrooms != null && <SpecPill>{listing.bathrooms} bath</SpecPill>}
          {area && <SpecPill>{area}</SpecPill>}
          {listing.yearBuilt && <SpecPill>Built {listing.yearBuilt}</SpecPill>}
          {listing.parking != null && <SpecPill>{listing.parking} parking</SpecPill>}
        </div>
        {listing.description && (
          <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: v.mutedText, lineHeight: 1.6, flex: '1 1 20rem' }}>
            {listing.description}
          </p>
        )}
      </div>
    </article>
  );
}

// ── MacroListingRow ─────────────────────────────────────────────────────────

function MacroListingRow({ listing, index }: { listing: Listing; index: number }) {
  const img = resolveMediaUrl(listing.coverImage);
  const isRent = listing.listingType === 'rent';
  const priceCompact = formatPriceCompact(listing.price, isRent);
  const location = [listing.city, listing.state].filter(Boolean).join(', ');
  const area = formatArea(listing.area);

  return (
    <article
      data-listing-macro-row
      className="group"
      style={{ borderBottom: `2px solid ${v.panelBorder}` }}
    >
      <Link
        href={`/listings/${listing.slug}`}
        className="flex items-stretch gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6"
        style={{ textDecoration: 'none' }}
      >
        {/* Price dateline column */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start pt-1 hidden sm:flex"
          style={{ width: 72, borderRight: `2px solid ${v.panelBorder}`, paddingRight: '1rem' }}
        >
          {priceCompact ? (
            <>
              <span
                className="font-black leading-none tabular-nums text-center"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', color: v.ink }}
              >
                {priceCompact.line1}
              </span>
              {priceCompact.line2 && (
                <span className="font-bold mt-0.5" style={{ fontSize: '0.6rem', color: v.mutedText }}>
                  {priceCompact.line2}
                </span>
              )}
            </>
          ) : (
            <span
              className="font-black tabular-nums"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: v.ink, opacity: 0.2 }}
            >
              #{String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {listing.propertyType && (
              <span
                className="font-black uppercase tracking-widest"
                style={{ fontSize: '0.62rem', color: v.accent }}
              >
                {listing.propertyType}
              </span>
            )}
            <span
              data-listing-type-badge
              className="font-black uppercase tracking-widest"
              style={{ fontSize: '0.62rem', color: v.mutedText }}
            >
              · {isRent ? 'Rent' : 'Sale'}
            </span>
          </div>
          <h2
            className="font-black leading-[1.02] tracking-tight group-hover:underline underline-offset-4"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', color: v.ink }}
          >
            {listing.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-3" style={{ fontSize: '0.72rem', color: v.mutedText }}>
            {location && <span style={{ fontWeight: 700, color: v.ink }}>{location}</span>}
            {listing.bedrooms != null && <span>{listing.bedrooms} bed</span>}
            {listing.bathrooms != null && <span>{listing.bathrooms} bath</span>}
            {area && <span>{area}</span>}
            {/* Mobile price fallback */}
            {priceCompact && (
              <span className="sm:hidden" style={{ fontWeight: 700, color: v.ink }}>
                · {priceCompact.line1}{priceCompact.line2 ?? ''}
              </span>
            )}
            <span className="hidden sm:inline" aria-hidden style={{ marginLeft: 'auto' }}>#{String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {img && (
          <div
            className="relative overflow-hidden flex-shrink-0 self-center"
            style={{ width: 88, height: 88, background: v.mutedPanel, border: `2px solid ${v.panelBorder}`, borderRadius: 0 }}
          >
            <Image
              src={img}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

// ── MacroSectionLabel ───────────────────────────────────────────────────────

function MacroSectionLabel({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2 mb-0"
      style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}` }}
    >
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
      <span
        className="font-black uppercase tracking-[0.2em]"
        style={{ fontSize: '0.65rem', color: v.ink }}
      >
        &#8213; {label} &#8213;
      </span>
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
    </div>
  );
}

// ── ListingsLayoutMacro ─────────────────────────────────────────────────────

interface Props {
  listings: Listing[];
  copy: Partial<BasicModuleCopy> & { emptyState: string };
}

export default function ListingsLayoutMacro({ listings, copy }: Props) {
  const [lead, ...rest] = listings;

  // Build type categories for filter bar
  const typeCategories = [
    { slug: 'sale', name: 'For Sale' },
    { slug: 'rent', name: 'For Rent' },
  ].filter((t) => listings.some((l) => l.listingType === t.slug));

  return (
    <div>
      {typeCategories.length > 1 && (
        <CategoryFilterBar categories={typeCategories} basePath="/listings/" />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        {/* Lead listing */}
        {lead && (
          <div className="mb-16">
            <MacroListingLead listing={lead} />
          </div>
        )}

        {/* Remaining listings */}
        {rest.length > 0 && (
          <div>
            <MacroSectionLabel label={copy.title ?? 'More Properties'} />
            <div style={{ borderTop: `1px solid ${v.panelBorder}` }}>
              {rest.map((listing, i) => (
                <MacroListingRow key={listing.slug} listing={listing} index={i + 2} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
