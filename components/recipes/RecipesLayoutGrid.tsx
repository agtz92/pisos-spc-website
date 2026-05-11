/**
 * RecipesLayoutGrid
 *
 * CONCEPT: A clean, equal-weight 4-column grid — no hero, no rails, no sections.
 * Every recipe card is the same size and receives the same visual priority.
 * The category filter bar at the top is the only navigation affordance.
 *
 * DESIGN DECISIONS:
 * - 4 columns on XL, 3 on LG, 2 on SM — dense but not overwhelming
 * - No featured recipe or hero — alphabetical / chronological ordering from server
 * - Uses the shared RecipeCard component so card design stays in sync with other views
 * - Category filter bar at top links to /recipes/category/<slug> pages
 * - No custom header section — the category bar IS the page header in this layout
 *
 * GOOD FOR: Large recipe libraries (50+ recipes) where users already know what they
 * want and are looking for a specific item rather than browsing editorially. Also
 * works well when all recipes are in a single category (no need for sectioning).
 *
 * MODIFICATION NOTES:
 * - Column count: change the grid className (currently sm:2, lg:3, xl:4)
 * - To add a search bar above the grid: add a Client Component search input
 * - To sort by total cook time: sort the recipes array before mapping
 * - To add a count label: add a header div showing `{recipes.length} Recipes` above the grid
 * - Card gap: change `gap-4` in the grid className
 */

import type { Recipe, Category } from '@/lib/graphql';
import RecipeCard from '@/components/RecipeCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const panelBackground = 'var(--template-panel, #ffffff)';

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutGrid({ recipes, categories }: Props) {
  return (
    <div data-recipes-page style={{ background: panelBackground }}>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
        </div>
      </div>
    </div>
  );
}
