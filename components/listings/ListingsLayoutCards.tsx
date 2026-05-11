/**
 * ListingsLayoutCards
 *
 * CONCEPT: The default real estate listings view — a summary hero banner at the top
 * (total count, for-sale/for-rent split, featured amenities) followed by a responsive
 * grid of ListingCards. Simple and familiar.
 *
 * DESIGN DECISIONS:
 * - ListingsHero renders a compact stats + amenity-tag bar above the grid
 * - Uses the shared ListingCard component — card design is centrally maintained
 * - 3 columns on XL, 2 on SM, 1 on mobile
 * - No sorting or filtering at the layout level — server returns already-sorted listings
 * - An empty state message renders if there are no listings (handled in the parent page,
 *   but the hero is skipped when listings.length === 0)
 *
 * GOOD FOR: General-purpose property listing pages. Works well for small-to-medium
 * inventories (up to ~50 listings) where no specialized browsing mode is needed.
 *
 * MODIFICATION NOTES:
 * - To remove the hero: delete the ListingsHero block
 * - To add a sort control: convert to Client Component and sort `listings` in state
 * - Grid columns: change `sm:grid-cols-2 xl:grid-cols-3` in the grid className
 * - Card gap: change `gap-6` in the grid className
 * - To show a map view toggle: add a Client Component button and conditionally swap
 *   the grid for a map embed
 */

import type { Listing } from '@/lib/graphql';
import ListingCard from '@/components/ListingCard';
import ListingsHero from '@/components/ListingsHero';
import type { BasicModuleCopy } from '@/lib/templates/config';

interface Props {
  listings: Listing[];
  copy: Partial<BasicModuleCopy> & { emptyState: string };
}

export default function ListingsLayoutCards({ listings, copy }: Props) {
  const forSale = listings.filter((l) => l.listingType === 'sale');
  const forRent = listings.filter((l) => l.listingType === 'rent');
  const featuredAmenities = Array.from(
    new Set(listings.flatMap((l) => (l.amenities ?? []).slice(0, 2).map((a) => a.name))),
  ).slice(0, 4);

  return (
    <div className="space-y-8">
      {listings.length > 0 && (
        <ListingsHero
          totalCount={listings.length}
          forSaleCount={forSale.length}
          forRentCount={forRent.length}
          featuredAmenities={featuredAmenities}
          eyebrow={copy.heroEyebrow ?? 'Property Finder'}
          description={copy.heroDescription ?? ''}
        />
      )}
      <div className="space-y-6">
        {listings.map((l) => <ListingCard key={l.slug} listing={l} />)}
      </div>
    </div>
  );
}
