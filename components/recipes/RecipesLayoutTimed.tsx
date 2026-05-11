/**
 * RecipesLayoutTimed
 *
 * CONCEPT: Organizes recipes by total cook time rather than category or editorial
 * curation. Recipes are bucketed into Quick (<30 min), Medium (30–60 min), Long
 * (>60 min), and Untimed (no time data). Each bucket gets a bold header with a
 * time badge, followed by a 3-col grid of recipe cards.
 *
 * DESIGN DECISIONS:
 * - Time buckets use distinct visual labels: stopwatch icon + human-readable range
 * - Bucket headers are large and typographically expressive to anchor each section
 * - Recipes without time data are collected in an "Any Time" fallback section
 * - Within each bucket, recipes are sorted by total time ascending (shortest first)
 * - Uses the same RecipeCard component — no new card design needed
 *
 * GOOD FOR: Cooking sites where users often filter by how much time they have.
 * Works especially well when recipes span a wide range of prep/cook times.
 *
 * MODIFICATION NOTES:
 * - Bucket thresholds: change the `TIME_BUCKETS` array (currently <30, 30-60, >60)
 * - To add more buckets (e.g. <15 min "Super Quick"): insert a new entry in TIME_BUCKETS
 * - Bucket header icon: replace the SVG clock with any icon (or remove it)
 * - To show a count badge per bucket: add `({bucket.recipes.length})` next to the label
 * - To hide empty buckets: they are already skipped via the `.filter(b => b.recipes.length > 0)` call
 */

import type { Recipe, Category } from '@/lib/graphql';
import RecipeCard from '@/components/RecipeCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';

interface TimeBucket {
  id: string;
  label: string;
  sublabel: string;
  test: (totalMins: number) => boolean;
  recipes: Recipe[];
}

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutTimed({ recipes, categories }: Props) {
  // Sort by total time ascending within each bucket
  const withTime = recipes.filter((r) => (r.prepTime ?? 0) + (r.cookTime ?? 0) > 0)
    .sort((a, b) => ((a.prepTime ?? 0) + (a.cookTime ?? 0)) - ((b.prepTime ?? 0) + (b.cookTime ?? 0)));
  const untimed = recipes.filter((r) => (r.prepTime ?? 0) + (r.cookTime ?? 0) === 0);

  const buckets: TimeBucket[] = [
    { id: 'quick',  label: 'Quick',  sublabel: 'Under 30 min', test: (m) => m < 30,  recipes: [] },
    { id: 'medium', label: 'Medium', sublabel: '30 – 60 min',  test: (m) => m < 60,  recipes: [] },
    { id: 'long',   label: 'Long',   sublabel: 'Over 1 hour',  test: () => true,      recipes: [] },
  ];

  withTime.forEach((recipe) => {
    const total = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
    const bucket = buckets.find((b) => b.test(total));
    if (bucket) bucket.recipes.push(recipe);
  });

  const activeBuckets = buckets.filter((b) => b.recipes.length > 0);

  return (
    <div data-recipes-page style={{ background: panelBackground }}>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-16">
        {activeBuckets.map((bucket) => (
          <section key={bucket.id}>
            {/* Bucket header */}
            <div data-recipe-section style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `2px solid ${panelBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.04em', color: ink, lineHeight: 1 }}>
                  {bucket.label}
                </h2>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: accent, letterSpacing: '0.04em', paddingBottom: '0.1rem' }}>
                {bucket.sublabel}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, color: ink, opacity: 0.4 }}>
                {bucket.recipes.length} {bucket.recipes.length === 1 ? 'recipe' : 'recipes'}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bucket.recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </section>
        ))}

        {untimed.length > 0 && (
          <section>
            <div data-recipe-section style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `2px solid ${panelBorder}` }}>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.04em', color: ink, lineHeight: 1 }}>
                Any Time
              </h2>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, color: ink, opacity: 0.4 }}>
                {untimed.length} {untimed.length === 1 ? 'recipe' : 'recipes'}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {untimed.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
