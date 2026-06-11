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
 * Hero-led "cookbook" recipe detail layout. A full-width cover image hero with a
 * dark gradient overlay carries the category, title and description in white at
 * the bottom; a full-width stat band (prep / cook / total / serves / level)
 * sits directly beneath, then a two-column ingredients (sticky) / instructions
 * grid and the notes box. All theme colors come from --template-* vars so it
 * adapts across visual templates. When there is no cover image it falls back to
 * a plain title block.
 */
export default function RecipeDetailHero({ recipe }: { recipe: Recipe }) {
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

      {imageUrl ? (
        <div
          data-recipe-hero
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ height: 'min(55vh, 520px)' }}
        >
          <Image src={imageUrl} alt={recipe.title} fill className="object-cover" priority />
          {/* Dark gradient so overlaid white text stays legible */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 70%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            {recipe.category && (
              <Link
                data-recipe-category
                href={`/recipes/category/${recipe.category.slug}`}
                className="text-xs font-semibold uppercase tracking-wider hover:underline"
                style={{ color: '#ffffff', opacity: 0.9, textDecoration: 'none' }}
              >
                {recipe.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold leading-tight text-white">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="mt-3 max-w-2xl text-base sm:text-lg italic leading-relaxed text-white/85">
                {recipe.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="border-b pb-6" style={{ borderColor: panelBorder }}>
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
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold leading-tight" style={{ color: ink }}>
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="mt-3 max-w-2xl text-lg italic leading-relaxed" style={{ color: ink, opacity: 0.65 }}>
              {recipe.description}
            </p>
          )}
        </div>
      )}

      {/* Full-width stat band — a single row of bordered cells */}
      {(stats.length > 0 || recipe.difficulty) && (
        <div
          className="mt-6 grid overflow-hidden rounded-xl border"
          style={{
            gridTemplateColumns: `repeat(${stats.length + (recipe.difficulty ? 1 : 0)}, minmax(0, 1fr))`,
            borderColor: panelBorder,
            background: panelBackground,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-recipe-stat
              className="flex flex-col items-center justify-center px-3 py-4 text-center"
              style={i > 0 ? { borderLeft: `1px solid ${panelBorder}` } : undefined}
            >
              <span className="text-[11px] uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>
                {stat.label}
              </span>
              <span className="mt-1 text-base font-semibold" style={{ color: ink }}>
                {stat.value}
              </span>
            </div>
          ))}
          {recipe.difficulty && (
            <div
              data-recipe-stat
              data-recipe-difficulty-stat
              className="flex flex-col items-center justify-center px-3 py-4 text-center"
              style={{
                borderLeft: stats.length > 0 ? `1px solid ${panelBorder}` : undefined,
                background: DIFFICULTY_BG[diff] ?? panelBackground,
                color: DIFFICULTY_COLOR[diff] ?? ink,
              }}
            >
              <span className="text-[11px] uppercase tracking-wider opacity-70">Level</span>
              <span className="mt-1 text-base font-semibold capitalize">{recipe.difficulty}</span>
            </div>
          )}
        </div>
      )}

      {/* Ingredients (sticky) + Instructions */}
      {(recipe.ingredients.length > 0 || recipe.instructions.length > 0) && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr]">
          {recipe.ingredients.length > 0 && (
            <div data-recipe-ingredients className="lg:sticky lg:top-8 self-start">
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
