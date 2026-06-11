import { getListings } from '@/lib/graphql';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;
export const metadata: Metadata = { title: 'For Sale' };

export default async function ForSalePage() {
  let listings: Awaited<ReturnType<typeof getListings>> = [];
  try {
    listings = await getListings({ listingType: 'sale' });
  } catch {
    // Leave empty state in place if the backend is unavailable.
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/listings" className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-800">{'<'} All listings</Link>
        <h1 className="text-4xl font-black text-[#161218]" style={{ letterSpacing: '-0.05em' }}>For Sale</h1>
        <p className="mt-2 text-gray-600">Browse homes in the new feed layout with stronger price and specs hierarchy.</p>
      </div>
      {listings.length === 0 ? (
        <p className="py-16 text-center text-gray-400">No properties for sale yet.</p>
      ) : (
        <div className="space-y-6">
          {listings.map((l) => <ListingCard key={l.slug} listing={l} />)}
        </div>
      )}
    </div>
  );
}
