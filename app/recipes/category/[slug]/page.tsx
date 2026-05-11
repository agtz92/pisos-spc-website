import { getRecipes, getCategories } from '@/lib/graphql';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const cats = await getCategories('recipes');
    return cats.map((c) => ({ slug: c.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await getCategories('recipes');
    const cat = cats.find((c) => c.slug === slug);
    return { title: cat ? `${cat.name} Recipes` : 'Recipes' };
  } catch { return {}; }
}

export default async function RecipeCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let recipes: Awaited<ReturnType<typeof getRecipes>> = [];
  let categoryName = slug;

  try {
    const [r, cats] = await Promise.all([getRecipes({ categorySlug: slug }), getCategories('recipes')]);
    recipes = r;
    categoryName = cats.find((c) => c.slug === slug)?.name ?? slug;
  } catch { /* show empty */ }

  return (
    <div>
      <Link href="/recipes" className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">← All recipes</Link>
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No recipes in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {recipes.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
