import { getReviews } from '@/lib/graphql';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;

const TYPE_LABELS: Record<string, string> = {
  movie: 'Movies', music: 'Music', product: 'Products',
  book: 'Books', game: 'Games', restaurant: 'Restaurants', other: 'Other',
};

export async function generateStaticParams() {
  return Object.keys(TYPE_LABELS).map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  return { title: TYPE_LABELS[type] ?? 'Reviews' };
}

export default async function ReviewTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  let reviews: Awaited<ReturnType<typeof getReviews>> = [];
  try { reviews = await getReviews({ reviewType: type }); } catch { /* empty */ }

  return (
    <div>
      <Link href="/reviews" className="text-sm mb-4 inline-block" style={{ color: 'var(--template-muted-text, #6b7280)' }}>← All reviews</Link>
      <h1 className="text-3xl font-bold mb-8">{TYPE_LABELS[type] ?? type}</h1>
      {reviews.length === 0 ? (
        <p className="text-center py-16" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>No {TYPE_LABELS[type]?.toLowerCase() ?? type} reviews yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((r) => <ReviewCard key={r.slug} review={r} />)}
        </div>
      )}
    </div>
  );
}
