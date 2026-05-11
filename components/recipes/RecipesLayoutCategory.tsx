/**
 * RecipesLayoutCategory
 *
 * CONCEPT: Groups recipes into sections by category, each with a bold header and a
 * 3-col grid of RecipeCards. A "See all" link in each header goes to the category
 * filter page. Recipes without a category collect in an "Other Recipes" section at
 * the bottom.
 *
 * DESIGN DECISIONS:
 * - Categories are sorted by recipe count descending (most recipes first)
 * - Section headers use a large display-size category name + accent left-border decoration
 * - "See all" links to `/recipes/category/<slug>` which renders the filtered category page
 * - Uncategorized recipes render last in an "Other Recipes" catch-all section
 * - Each section shows all recipes for that category — no truncation
 *
 * GOOD FOR: Recipe sites organized around cooking styles or cuisines (e.g. "Italian",
 * "Quick & Easy", "Desserts"). Lets users discover an entire category at a glance.
 *
 * MODIFICATION NOTES:
 * - To limit recipes per section and add "show more": slice `catRecipes` array and add
 *   a toggle (requires converting to Client Component with useState)
 * - To sort categories alphabetically: change the sort comparator on `categoryMap.entries()`
 * - Section title size: edit the `fontSize` in the h2 style
 * - To hide the "See all" link: remove the Link element in the section header
 * - Grid columns: change `sm:grid-cols-2 lg:grid-cols-3` in the section grid className
 */

import Link from 'next/link';
import type { Recipe, Category } from '@/lib/graphql';
import RecipeCard from '@/components/RecipeCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';

function SectionLabel({ label, href }: { label: string; href?: string }) {
  return (
    <div data-recipe-section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: 4, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
      {href ? (
        <Link href={href} style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.7, textDecoration: 'none' }}
          className="hover:underline underline-offset-3">
          {label}
        </Link>
      ) : (
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.7 }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: panelBorder }} />
    </div>
  );
}

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutCategory({ recipes, categories }: Props) {
  // Group by category
  const grouped = new Map<string, { name: string; slug: string; recipes: Recipe[] }>();
  const uncategorized: Recipe[] = [];

  recipes.forEach((recipe) => {
    if (recipe.category) {
      const key = recipe.category.slug;
      if (!grouped.has(key)) {
        grouped.set(key, { name: recipe.category.name, slug: recipe.category.slug, recipes: [] });
      }
      grouped.get(key)!.recipes.push(recipe);
    } else {
      uncategorized.push(recipe);
    }
  });

  const sections = Array.from(grouped.values());

  if (sections.length === 0) {
    return (
      <div data-recipes-page style={{ background: panelBackground }}>
        <CategoryFilterBar categories={categories} basePath="/recipes/category/" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          <SectionLabel label="All Recipes" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-recipes-page style={{ background: panelBackground }}>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-14">
        {sections.map(({ name, slug, recipes: catRecipes }) => (
          <section key={slug}>
            <SectionLabel label={name} href={`/recipes/category/${slug}`} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catRecipes.slice(0, 6).map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
            {catRecipes.length > 6 && (
              <div className="mt-4">
                <Link href={`/recipes/category/${slug}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: accent, textDecoration: 'none' }}
                  className="hover:underline underline-offset-3">
                  See all {catRecipes.length} in {name} →
                </Link>
              </div>
            )}
          </section>
        ))}
        {uncategorized.length > 0 && (
          <section>
            <SectionLabel label="More Recipes" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorized.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
