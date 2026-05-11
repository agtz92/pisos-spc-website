import { getRecipe, getRecipes, resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';
const mutedPanel = 'var(--template-muted-panel, #f3f4f6)';

// Semantic difficulty colors — kept intentionally separate from the accent palette.
const DIFFICULTY_BG: Record<string, string> = {
  easy:   'rgba(22,163,74,0.10)',
  medium: 'rgba(202,138,4,0.12)',
  hard:   'rgba(220,38,38,0.10)',
};
const DIFFICULTY_COLOR: Record<string, string> = {
  easy:   '#15803d',
  medium: '#a16207',
  hard:   '#b91c1c',
};

function formatTime(mins: number | null): string | null {
  if (!mins) return null;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

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
  const recipe = await getRecipe(slug).catch(() => null);
  if (!recipe) notFound();

  const imageUrl = resolveMediaUrl(recipe.coverImage);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  const diff = (recipe.difficulty ?? '').toLowerCase();

  return (
    <article data-recipe-detail className="max-w-3xl mx-auto">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: ink, opacity: 0.5, textDecoration: 'none' }}
      >
        ← Back to Recipes
      </Link>

      {recipe.category && (
        <Link
          data-recipe-category
          href={`/recipes/category/${recipe.category.slug}`}
          className="text-xs font-semibold uppercase tracking-wider hover:underline"
          style={{ color: accent, textDecoration: 'none' }}
        >
          {recipe.category.name}
        </Link>
      )}

      <h1 className="mt-2 text-4xl font-bold leading-tight" style={{ color: ink }}>
        {recipe.title}
      </h1>

      {/* Quick stats */}
      {(recipe.prepTime || recipe.cookTime || recipe.servings || recipe.difficulty) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {recipe.prepTime && (
            <div
              data-recipe-stat
              className="flex flex-col items-center rounded-lg px-4 py-2 text-center min-w-[80px]"
              style={{ border: `1px solid ${panelBorder}`, background: panelBackground }}
            >
              <span className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>Prep</span>
              <span className="text-sm font-semibold mt-0.5" style={{ color: ink }}>
                {formatTime(recipe.prepTime)}
              </span>
            </div>
          )}
          {recipe.cookTime && (
            <div
              data-recipe-stat
              className="flex flex-col items-center rounded-lg px-4 py-2 text-center min-w-[80px]"
              style={{ border: `1px solid ${panelBorder}`, background: panelBackground }}
            >
              <span className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>Cook</span>
              <span className="text-sm font-semibold mt-0.5" style={{ color: ink }}>
                {formatTime(recipe.cookTime)}
              </span>
            </div>
          )}
          {totalTime > 0 && (
            <div
              data-recipe-stat
              className="flex flex-col items-center rounded-lg px-4 py-2 text-center min-w-[80px]"
              style={{ border: `1px solid ${panelBorder}`, background: panelBackground }}
            >
              <span className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>Total</span>
              <span className="text-sm font-semibold mt-0.5" style={{ color: ink }}>
                {formatTime(totalTime)}
              </span>
            </div>
          )}
          {recipe.servings && (
            <div
              data-recipe-stat
              className="flex flex-col items-center rounded-lg px-4 py-2 text-center min-w-[80px]"
              style={{ border: `1px solid ${panelBorder}`, background: panelBackground }}
            >
              <span className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>Serves</span>
              <span className="text-sm font-semibold mt-0.5" style={{ color: ink }}>
                {recipe.servings}
              </span>
            </div>
          )}
          {recipe.difficulty && (
            <div
              data-recipe-stat
              data-recipe-difficulty-stat
              className="flex flex-col items-center rounded-lg px-4 py-2 text-center min-w-[80px]"
              style={{
                border: `1px solid ${panelBorder}`,
                background: DIFFICULTY_BG[diff] ?? panelBackground,
                color: DIFFICULTY_COLOR[diff] ?? ink,
              }}
            >
              <span className="text-xs uppercase tracking-wider opacity-70">Level</span>
              <span className="text-sm font-semibold mt-0.5 capitalize">{recipe.difficulty}</span>
            </div>
          )}
        </div>
      )}

      {imageUrl && (
        <div data-recipe-hero className="mt-8 relative aspect-video rounded-xl overflow-hidden">
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
        </div>
      )}

      {recipe.description && (
        <p className="mt-6 text-lg italic leading-relaxed" style={{ color: ink, opacity: 0.65 }}>
          {recipe.description}
        </p>
      )}

      {/* Ingredients + Instructions */}
      {(recipe.ingredients.length > 0 || recipe.instructions.length > 0) && (
        <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr]">
          {recipe.ingredients.length > 0 && (
            <div data-recipe-ingredients>
              <h2 className="text-xl font-bold mb-4" style={{ color: ink }}>Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ri) => (
                  <li key={ri.id} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: accent }}
                    />
                    <span style={{ color: ink }}>
                      {ri.amount && <span className="font-medium">{ri.amount} </span>}
                      {ri.unit && <span style={{ color: 'var(--template-muted-text, #6b7280)' }}>{ri.unit} </span>}
                      <span>{ri.ingredient.name}</span>
                      {ri.notes && <span style={{ color: 'var(--template-muted-text, #9ca3af)' }} className="italic"> ({ri.notes})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions.length > 0 && (
            <div data-recipe-instructions>
              <h2 className="text-xl font-bold mb-4" style={{ color: ink }}>Instructions</h2>
              <ol className="space-y-5">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      data-recipe-step-number
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: accent, color: panelBackground }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-relaxed pt-0.5" style={{ color: ink }}>
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {recipe.notes && (
        <div
          data-recipe-notes
          className="mt-10 rounded-lg p-5"
          style={{
            borderLeft: `4px solid ${accent}`,
            background: mutedPanel,
            border: `1px solid ${panelBorder}`,
            borderLeftColor: accent,
            borderLeftWidth: 4,
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: accent }}>Notes</h3>
          <p className="text-sm leading-relaxed" style={{ color: ink, opacity: 0.8 }}>
            {recipe.notes}
          </p>
        </div>
      )}
    </article>
  );
}
