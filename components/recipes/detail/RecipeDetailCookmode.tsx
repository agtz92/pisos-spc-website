import type { Recipe } from '@/lib/graphql';
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
 * "Cook mode" recipe detail layout — a kitchen-friendly, follow-along view.
 * Minimal chrome, no cover image. A compact inline stat row (prep / cook /
 * total / serves / level) sits under the title, ingredients render as a visual
 * checklist (bordered square markers, no interactivity), and instructions are
 * oversized numbered steps with big readable text and generous spacing. Single
 * centered column. All theme colors come from --template-* vars.
 */
export default function RecipeDetailCookmode({ recipe }: { recipe: Recipe }) {
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

      {/* Compact inline stat row */}
      {(stats.length > 0 || recipe.difficulty) && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {stats.map((stat) => (
            <span key={stat.label} data-recipe-stat className="inline-flex items-baseline gap-1.5">
              <span className="text-xs uppercase tracking-wider" style={{ color: ink, opacity: 0.5 }}>
                {stat.label}
              </span>
              <span className="font-semibold" style={{ color: ink }}>{stat.value}</span>
            </span>
          ))}
          {recipe.difficulty && (
            <span
              data-recipe-stat
              data-recipe-difficulty-stat
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize"
              style={{
                background: DIFFICULTY_BG[diff] ?? mutedPanel,
                color: DIFFICULTY_COLOR[diff] ?? ink,
              }}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>
      )}

      {/* Ingredients as a visual checklist */}
      {recipe.ingredients.length > 0 && (
        <div data-recipe-ingredients className="mt-10">
          <h2 className="text-xl font-bold mb-5" style={{ color: ink }}>Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ri) => (
              <li key={ri.id} className="flex items-start gap-3 text-base">
                <span
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-md"
                  style={{ border: `2px solid ${panelBorder}`, background: panelBackground }}
                />
                <span style={{ color: ink }}>
                  {ri.amount && <span className="font-semibold">{ri.amount} </span>}
                  {ri.unit && <span style={{ color: 'var(--template-muted-text, #6b7280)' }}>{ri.unit} </span>}
                  <span>{ri.ingredient.name}</span>
                  {ri.notes && <span style={{ color: 'var(--template-muted-text, #9ca3af)' }} className="italic"> ({ri.notes})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Oversized numbered instruction steps */}
      {recipe.instructions.length > 0 && (
        <div data-recipe-instructions className="mt-12">
          <h2 className="text-xl font-bold mb-6" style={{ color: ink }}>Instructions</h2>
          <ol className="space-y-10">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-5">
                <span
                  data-recipe-step-number
                  className="shrink-0 text-5xl font-extrabold leading-none tabular-nums"
                  style={{ color: accent }}
                >
                  {idx + 1}
                </span>
                <p className="text-lg sm:text-xl leading-relaxed pt-1" style={{ color: ink }}>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {recipe.notes && (
        <div
          data-recipe-notes
          className="mt-12 rounded-lg p-5"
          style={{
            borderLeft: `4px solid ${accent}`,
            background: mutedPanel,
            border: `1px solid ${panelBorder}`,
            borderLeftColor: accent,
            borderLeftWidth: 4,
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: accent }}>Notes</h3>
          <p className="text-base leading-relaxed" style={{ color: ink, opacity: 0.8 }}>
            {recipe.notes}
          </p>
        </div>
      )}
    </article>
  );
}
