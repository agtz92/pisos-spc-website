import Link from 'next/link';

interface ListingsHeroProps {
  totalCount: number;
  forSaleCount: number;
  forRentCount: number;
  featuredAmenities: string[];
  eyebrow: string;
  description: string;
}

export default function ListingsHero({
  totalCount,
  forSaleCount,
  forRentCount,
  featuredAmenities,
  eyebrow,
  description,
}: ListingsHeroProps) {
  return (
    <section
      data-listings-hero
      className="border border-gray-200 bg-white px-5 py-6 sm:px-6"
      style={{
        borderRadius: 24,
        boxShadow: '0 14px 40px rgba(22, 18, 24, 0.05)',
        background: 'var(--template-panel, #ffffff)',
        borderColor: 'var(--template-panel-border, #e5e7eb)',
      }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--template-accent, #ec0f7f)' }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-2 text-4xl font-black leading-none"
            style={{ letterSpacing: '-0.05em', color: 'var(--template-ink, #161218)' }}
          >
            {totalCount.toLocaleString()} properties to explore
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            data-listings-hero-filter-btn
            href="/listings/sale"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: 'var(--template-panel-border, #e5e7eb)',
              color: 'var(--template-accent-strong, #c105aa)',
              textDecoration: 'none',
              background: 'var(--template-muted-panel, #fff8fb)',
            }}
          >
            For Sale <span className="ml-1 opacity-60">({forSaleCount})</span>
          </Link>
          <Link
            data-listings-hero-filter-btn
            href="/listings/rent"
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: 'var(--template-panel-border, #e5e7eb)',
              color: 'var(--template-accent-strong, #c105aa)',
              textDecoration: 'none',
              background: 'var(--template-muted-panel, #fff8fb)',
            }}
          >
            For Rent <span className="ml-1 opacity-60">({forRentCount})</span>
          </Link>
        </div>
      </div>

      {featuredAmenities.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {featuredAmenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border px-3 py-1 text-xs font-semibold text-gray-600"
              style={{
                borderColor: 'var(--template-panel-border, #e5e7eb)',
                background: 'var(--template-panel, #ffffff)',
              }}
            >
              {amenity}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
