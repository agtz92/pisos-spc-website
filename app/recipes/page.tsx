import { getRecipes, getCategories } from '@/lib/graphql';
import type { Metadata } from 'next';
import { getTenantCached } from '@/lib/modules';
import RecipesLayoutEditorial from '@/components/recipes/RecipesLayoutEditorial';
import RecipesLayoutGrid from '@/components/recipes/RecipesLayoutGrid';
import RecipesLayoutCategory from '@/components/recipes/RecipesLayoutCategory';
import RecipesLayoutTimed from '@/components/recipes/RecipesLayoutTimed';
import RecipesLayoutVisual from '@/components/recipes/RecipesLayoutVisual';
import RecipesLayoutMacro from '@/components/recipes/RecipesLayoutMacro';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Recipes' };

export default async function RecipesPage() {
  const tenant = await getTenantCached();
  const savedModules = (tenant?.templateConfig?.modules) as Record<string, Record<string, unknown>> | undefined;
  const savedMod = savedModules?.recipes ?? {};
  const savedLayout = (savedMod.layout ?? {}) as Record<string, unknown>;
  const savedColors = (savedMod.colors ?? {}) as Record<string, unknown>;
  const layoutVariant = (savedLayout.variant as string | undefined) ?? 'editorial';

  const moduleStyle = {
    ...(savedColors.accent          ? { '--template-accent':       savedColors.accent }          : {}),
    ...(savedColors.ink             ? { '--template-ink':          savedColors.ink }             : {}),
    ...(savedColors.panelBackground ? { '--template-panel':        savedColors.panelBackground } : {}),
    ...(savedColors.panelBorder     ? { '--template-panel-border': savedColors.panelBorder }     : {}),
  } as Record<string, string>;

  const ink = 'var(--template-ink, #161218)';

  let recipes: Awaited<ReturnType<typeof getRecipes>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let error: string | null = null;

  try {
    [recipes, categories] = await Promise.all([getRecipes(), getCategories('recipes')]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load recipes';
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: ink, opacity: 0.5 }}>
        <p>{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: ink, opacity: 0.4 }}>
        <p className="text-sm font-medium">No recipes published yet.</p>
      </div>
    );
  }

  let layout: React.ReactNode;
  if (layoutVariant === 'grid')     layout = <RecipesLayoutGrid     recipes={recipes} categories={categories} />;
  else if (layoutVariant === 'category') layout = <RecipesLayoutCategory recipes={recipes} categories={categories} />;
  else if (layoutVariant === 'timed')    layout = <RecipesLayoutTimed    recipes={recipes} categories={categories} />;
  else if (layoutVariant === 'visual')   layout = <RecipesLayoutVisual   recipes={recipes} categories={categories} />;
  else if (layoutVariant === 'macro')    layout = <RecipesLayoutMacro    recipes={recipes} categories={categories} />;
  else                                   layout = <RecipesLayoutEditorial recipes={recipes} categories={categories} />;

  return <div style={moduleStyle}>{layout}</div>;
}
