import { resolveMediaUrl } from '@/lib/graphql';
import type { Recipe } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';

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

/**
 * Editorial "magazine" recipe detail layout. An editorial masthead (category ·
 * large title · description) sits above a two-column grid: the LEFT column holds
 * the rounded cover image followed by the numbered instructions, while the RIGHT
 * column is a sticky bordered ingredients card plus a compact prep/cook/total/
 * serves/level stats block. The notes box spans the full width at the bottom.
 * All theme colors come from --template-* vars so it adapts across templates.
 */
export default function RecipeDetailMagazine({ recipe }: { recipe: Recipe }) {
  const imageUrl = resolveMediaUrl(recipe.coverImage);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  const diff = (recipe.difficulty ?? '').toLowerCase();

  const stats: { label: string; value: string }[] = [];
  const prep = formatTime(recipe.prepTime);
  if (prep) stats.push({ label: 'Prep', value: prep });
  const cook = formatTime(recipe.cookTime);
  if (cook) stats.push({ label: 'Cook', value: cook });
  const total = formatTime(totalTime);
  if (total) stats.push({ label: 'Total', value: total });
  if (recipe.servings) stats.push({ label: 'Serves', value: String(recipe.servings) });

  return (
    <article data-recipe-detail className="max-w-5xl mx-auto">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: ink, opacity: 0.5, textDecoration: 'none' }}
      >
        ← Back to Recipes
      </Link>

      {/* Editorial masthead */}
      <header className="border-b pb-8" style={{ borderColor: panelBorder }}>
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
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold leading-tight tracking-tight" style={{ color: ink }}>
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="mt-4 max-w-3xl text-lg sm:text-xl italic leading-relaxed" style={{ color: ink, opacity: 0.65 }}>
            {recipe.description}
          </p>
        )}
      </header>

      {/* Two-column editorial body */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* LEFT: cover image + instructions */}
        <div>
          {imageUrl && (
            <div data-recipe-hero className="relative aspect-video overflow-hidden rounded-xl">
              <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
            </div>
          )}

          {recipe.instructions.length > 0 && (
            <div data-recipe-instructions className={imageUrl ? 'mt-10' : undefined}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: ink }}>Instructions</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      data-recipe-step-number
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: accent, color: panelBackground }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-base leading-relaxed pt-1" style={{ color: ink }}>
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* RIGHT: sticky ingredients card + compact stats */}
        <aside className="lg:sticky lg:top-8 self-start space-y-6">
          {recipe.ingredients.length > 0 && (
            <div
              data-recipe-ingredients
              className="rounded-xl p-6"
              style={{ border: `1px solid ${panelBorder}`, background: panelBackground }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: ink }}>Ingredients</h2>
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ri) => (
                  <li key={ri.id} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
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

          {(stats.length > 0 || recipe.difficulty) && (
            <div
              className="rounded-xl p-5"
              style={{ border: `1px solid ${panelBorder}`, background: mutedPanel }}
            >
              <dl className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} data-recipe-stat className="flex items-center justify-between">
                    <dt className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>
                      {stat.label}
                    </dt>
                    <dd className="text-sm font-semibold" style={{ color: ink }}>
                      {stat.value}
                    </dd>
                  </div>
                ))}
                {recipe.difficulty && (
                  <div
                    data-recipe-stat
                    data-recipe-difficulty-stat
                    className="flex items-center justify-between rounded-md px-3 py-2"
                    style={{
                      background: DIFFICULTY_BG[diff] ?? panelBackground,
                      color: DIFFICULTY_COLOR[diff] ?? ink,
                    }}
                  >
                    <dt className="text-xs uppercase tracking-wider opacity-70">Level</dt>
                    <dd className="text-sm font-semibold capitalize">{recipe.difficulty}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </aside>
      </div>

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
