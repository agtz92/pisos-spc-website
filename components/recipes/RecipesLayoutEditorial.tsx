/**
 * RecipesLayoutEditorial
 *
 * CONCEPT: A curated editorial front page for a recipe site. One prominent hero recipe
 * leads, followed by a "Quick Picks" horizontal scroll strip of short-cook-time recipes,
 * then an "Editor's Picks" featured grid, and finally a "More Recipes" grid at the bottom.
 *
 * DESIGN DECISIONS:
 * - Hero takes the full width with a tall 16:9 image, gradient scrim, and white title overlay
 * - Quick Picks strip filters recipes with total time ≤ 30 min and shows them as compact
 *   horizontal cards in a scroll container — helps time-pressed users find options fast
 * - Editor's Picks shows the next 4 recipes in a 2×2 grid with full RecipeCard components
 * - "More Recipes" renders the remaining posts in a standard 3-col grid
 * - All sections draw from the same sorted list — the hero is index 0, rest follow in order
 *
 * GOOD FOR: Food blogs and recipe apps where the publisher wants to highlight a featured
 * recipe daily while still surfacing quick-cook options prominently.
 *
 * MODIFICATION NOTES:
 * - Hero aspect ratio: change `aspectRatio: '16 / 9'` in the hero Link style
 * - Quick Picks time threshold: change the `<= 30` filter to any number of minutes
 * - Editor's Picks count: change `.slice(1, 5)` to include more or fewer recipes
 * - To add a category filter bar above the hero: import CategoryFilterBar and add it
 * - To randomize which recipe is the hero: shuffle the array before rendering
 */

import type { Recipe, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import QuickPicksStrip from '@/components/QuickPicksStrip';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatTime(mins: number | null): string | null {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60); const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div data-recipe-section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: 4, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: ink, opacity: 0.7 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: panelBorder }} />
    </div>
  );
}

function HeroRecipe({ recipe }: { recipe: Recipe }) {
  const imageUrl = resolveMediaUrl(recipe.coverImage);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <article data-recipe-hero className="group" style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 16px 48px rgba(22,18,24,0.10)' }}>
      <Link href={`/recipes/${recipe.slug}`} style={{ position: 'relative', display: 'block', aspectRatio: '16 / 7', overflow: 'hidden', background: panelBorder, textDecoration: 'none', minHeight: 220 }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover group-hover:scale-105" style={{ transition: 'transform 0.7s ease' }} priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${accent}22, ${accent}55)` }} />
        )}
        {recipe.difficulty && (
          <span data-recipe-difficulty style={{ position: 'absolute', top: 14, right: 14, padding: '0.25rem 0.65rem', borderRadius: 999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize' as const, letterSpacing: '0.04em', zIndex: 2 }}>
            {recipe.difficulty}
          </span>
        )}
      </Link>
      <div style={{ background: panelBackground, padding: 'clamp(1.25rem, 3vw, 2rem)', borderTop: `1px solid ${panelBorder}` }}>
        {recipe.category && (
          <Link data-recipe-category href={`/recipes/category/${recipe.category.slug}`} style={{ display: 'inline-block', marginBottom: '0.85rem', padding: '0.22rem 0.7rem', borderRadius: 999, background: accent, color: '#fff', fontSize: '0.69rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>
            {recipe.category.name}
          </Link>
        )}
        <h1 style={{ fontWeight: 800, lineHeight: 1.05, fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', color: ink, marginBottom: '0.65rem' }}>
          <Link href={`/recipes/${recipe.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{recipe.title}</Link>
        </h1>
        {recipe.description && (
          <p style={{ color: ink, opacity: 0.62, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '52rem', marginBottom: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
            {recipe.description}
          </p>
        )}
        {totalTime > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: ink, opacity: 0.5, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            {formatTime(totalTime)}
            {recipe.servings && <><span>·</span><span>{recipe.servings} servings</span></>}
          </div>
        )}
      </div>
    </article>
  );
}

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutEditorial({ recipes, categories }: Props) {
  const [hero, ...rest] = recipes;
  const quickPicks = rest.slice(0, 5);
  const topTrio = rest.slice(5, 8);
  const remaining = rest.slice(8);

  return (
    <div data-recipes-page style={{ background: panelBackground }}>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-12">
        <HeroRecipe recipe={hero} />
        {quickPicks.length > 0 && <QuickPicksStrip recipes={quickPicks} />}
        {topTrio.length > 0 && (
          <section>
            <SectionLabel label="Editor's Picks" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topTrio.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </section>
        )}
        {remaining.length > 0 && (
          <section>
            <SectionLabel label="More Recipes" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {remaining.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
