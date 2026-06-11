import { getReview, getReviews, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import ReviewDetailStandard from '@/components/reviews/detail/ReviewDetailStandard';
import ReviewDetailMagazine from '@/components/reviews/detail/ReviewDetailMagazine';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try { const r = await getReviews(); return r.map((item) => ({ slug: item.slug })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const review = await getReview(slug);
    if (!review) return {};
    return { title: review.title };
  } catch { return {}; }
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch review + tenant in parallel — tenant powers the per-module layout +
  // color overrides.
  const [review, tenant] = await Promise.all([
    getReview(slug).catch(() => null),
    getTenant().catch(() => null),
  ]);
  if (!review) notFound();

  const { layout, moduleStyle } = getModuleSettings(tenant, 'reviews');
  const detailVariant = getLayoutVariant(layout, 'detailVariant', 'standard');

  let detail: React.ReactNode;
  if (detailVariant === 'magazine') detail = <ReviewDetailMagazine review={review} />;
  else                              detail = <ReviewDetailStandard review={review} />;

  return <div style={moduleStyle}>{detail}</div>;
}
