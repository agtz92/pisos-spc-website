import { getRecipe, getRecipes, getTenant } from '@/lib/graphql';
import { getModuleSettings, getLayoutVariant } from '@/lib/templates/moduleLayout';
import RecipeDetailStandard from '@/components/recipes/detail/RecipeDetailStandard';
import RecipeDetailHero from '@/components/recipes/detail/RecipeDetailHero';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const recipes = await getRecipes();
    return recipes.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const recipe = await getRecipe(slug);
    if (!recipe) return {};
    return { title: recipe.title, description: recipe.description || undefined };
  } catch {
    return {};
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch recipe + tenant in parallel — tenant carries the per-module layout +
  // color overrides.
  const [recipe, tenant] = await Promise.all([
    getRecipe(slug).catch(() => null),
    getTenant().catch(() => null),
  ]);
  if (!recipe) notFound();

  const { layout, moduleStyle } = getModuleSettings(tenant, 'recipes');
  const detailVariant = getLayoutVariant(layout, 'detailVariant', 'standard');

  let detail: React.ReactNode;
  if (detailVariant === 'hero') detail = <RecipeDetailHero     recipe={recipe} />;
  else                          detail = <RecipeDetailStandard recipe={recipe} />;

  return <div style={moduleStyle}>{detail}</div>;
}
