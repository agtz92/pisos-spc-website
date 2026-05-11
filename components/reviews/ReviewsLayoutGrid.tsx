/**
 * ReviewsLayoutGrid
 *
 * CONCEPT: A flat, equal-weight 3-column grid of ReviewCards. No hero, no rails —
 * every review gets the same amount of space. The review-type filter bar at the top
 * provides the only navigation.
 *
 * DESIGN DECISIONS:
 * - 3 columns on LG+, 2 on SM, 1 on mobile
 * - Uses the shared ReviewCard component — consistent with single-review detail pages
 * - Review-type filter bar links to /reviews/type/<slug> category pages
 * - No custom header — the category bar serves as the page header in this layout
 * - Reviews are displayed in server order (typically newest first)
 *
 * GOOD FOR: Review sites with a moderate number of reviews (10–80) that don't need
 * editorial hierarchy. Particularly good when all reviews are of similar importance
 * (e.g. a user-curated library or a year-end "best of" list).
 *
 * MODIFICATION NOTES:
 * - Column count: change `lg:grid-cols-3` (try `xl:grid-cols-4` for a denser grid)
 * - To add a sort control (by score, by date): convert to Client Component
 * - Card gap: change `gap-6` in the grid className
 * - To add a count label above the grid: add a header div showing `{reviews.length} Reviews`
 * - To show a "no reviews" empty state here instead of in the page: add a conditional
 *   rendering block when `reviews.length === 0`
 */

import type { Review } from '@/lib/graphql';
import ReviewCard from '@/components/ReviewCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import type { ReviewsModuleColors, ReviewsModuleCopy } from '@/lib/templates/config';

interface Props {
  reviews: Review[];
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  typeCategories: { slug: string; name: string }[];
}

export default function ReviewsLayoutGrid({ reviews, colors, copy, typeCategories }: Props) {
  return (
    <div data-reviews-page>
      <CategoryFilterBar categories={typeCategories} basePath="/reviews/type/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 4, height: 18, background: 'var(--template-accent, #ec0f7f)', flexShrink: 0, borderRadius: 2 }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--template-ink, #161218)', opacity: 0.7 }}>{copy.title}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--template-panel-border, #e5e7eb)' }} />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r) => <ReviewCard key={r.slug} review={r} reviewColors={colors} />)}
        </div>
      </div>
    </div>
  );
}
