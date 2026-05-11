/**
 * ProductsLayoutGrid
 *
 * CONCEPT: A clean, equal-weight 3-column product grid. No hero, no featured items —
 * every product card is the same size and priority. The category filter bar at the top
 * is the only navigation affordance.
 *
 * DESIGN DECISIONS:
 * - 3 columns on LG+, 2 on SM, 1 on mobile
 * - Uses the shared ProductCard component — consistent design with category pages
 * - Category filter bar links to /products/category/<slug> pages
 * - Products are displayed in server order (typically newest first)
 * - No custom page header — the filter bar serves as the page header in this layout
 *
 * GOOD FOR: General merchandise stores with a uniform product catalog where price
 * and imagery drive purchase decisions. Familiar e-commerce grid pattern.
 *
 * MODIFICATION NOTES:
 * - Column count: change `lg:grid-cols-3` (try `xl:grid-cols-4` for a denser grid)
 * - Card gap: change `gap-6` in the grid className
 * - To add a sort/filter bar: convert to Client Component and add sorting state
 * - To show a product count label: add a header div above the grid
 * - To add infinite scroll or pagination: slice the products array and add controls
 */

import type { Product, Category } from '@/lib/graphql';
import ProductCard from '@/components/ProductCard';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductsLayoutGrid({ products, categories }: Props) {
  return (
    <div>
      <CategoryFilterBar categories={categories} basePath="/products/category/" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </div>
  );
}
