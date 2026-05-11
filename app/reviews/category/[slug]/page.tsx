import { getReviews, getCategories } from '@/lib/graphql';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const cats = await getCategories('reviews');
    return cats.map((c) => ({ slug: c.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await getCategories('reviews');
    const cat = cats.find((c) => c.slug === slug);
    return { title: cat ? `${cat.name} Reviews` : 'Reviews' };
  } catch { return {}; }
}

export default async function ReviewCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let reviews: Awaited<ReturnType<typeof getReviews>> = [];
  let categoryName = slug;

  try {
    const [r, cats] = await Promise.all([getReviews({ categorySlug: slug }), getCategories('reviews')]);
    reviews = r;
    categoryName = cats.find((c) => c.slug === slug)?.name ?? slug;
  } catch { /* show empty */ }

  return (
    <div>
      <Link href="/reviews" className="text-sm mb-4 inline-block" style={{ color: 'var(--template-muted-text, #6b7280)' }}>← All reviews</Link>
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      {reviews.length === 0 ? (
        <p className="text-center py-16" style={{ color: 'var(--template-muted-text, #9ca3af)' }}>No reviews in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((r) => <ReviewCard key={r.slug} review={r} />)}
        </div>
      )}
    </div>
  );
}
