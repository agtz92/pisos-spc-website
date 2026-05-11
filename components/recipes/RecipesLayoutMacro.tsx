/**
 * RecipesLayoutMacro
 *
 * CONCEPT: Typography-first recipe index. Newspaper macro aesthetic — big type,
 * strong rules, no cards. A lead recipe headlines the top with the title dominant
 * and image below. Remaining recipes stack as wide rows with the cook time as the
 * left "dateline" column (the recipe equivalent of a newspaper date).
 *
 * DESIGN DECISIONS:
 * - Lead: top rule bar (category badge + time + difficulty), giant headline,
 *   full-width 16:9 image below with no rounding
 * - Rows: left dateline column = total cook time (big number + unit), center = category
 *   + title + servings, right = 88×88 thumbnail with no rounding
 * - CategoryFilterBar above everything, same as other layouts
 * - No cards, no shadows — just type and a bottom rule per row
 *
 * GOOD FOR: Recipe blogs where the dish name is strong enough to stand alone.
 * Works with every template via CSS vars.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Recipe, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

// ── CSS variable tokens ─────────────────────────────────────────────────────

const v = {
  accent:      'var(--template-accent, #e5201b)',
  ink:         'var(--template-ink, #161218)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  mutedPanel:  'var(--template-muted-panel, #f3f4f6)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(mins: number | null): string | null {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Returns { big, unit } for the dateline column. E.g. big="45" unit="MIN" or big="1.5" unit="HR" */
function cookTimeParts(prepTime: number | null, cookTime: number | null): { big: string; unit: string } | null {
  const total = (prepTime ?? 0) + (cookTime ?? 0);
  if (!total) return null;
  if (total < 60) return { big: String(total), unit: 'MIN' };
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (m === 0) return { big: String(h), unit: 'HR' };
  return { big: `${h}:${String(m).padStart(2, '0')}`, unit: 'HR' };
}

// ── MacroRecipeLead ─────────────────────────────────────────────────────────

function MacroRecipeLead({ recipe }: { recipe: Recipe }) {
  const img = resolveMediaUrl(recipe.coverImage);
  const totalTime = formatTime((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0));

  return (
    <article data-recipe-macro-lead className="group">
      {/* Top rule — newspaper section divider */}
      <div style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}`, padding: '4px 0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {recipe.category && (
          <Link
            data-recipe-category
            href={`/recipes/category/${recipe.category.slug}`}
            className="font-black uppercase tracking-widest"
            style={{ fontSize: '0.65rem', color: v.accent, background: v.ink, padding: '2px 8px', textDecoration: 'none' }}
          >
            {recipe.category.name}
          </Link>
        )}
        {totalTime && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.08em' }}>
            {totalTime}
          </span>
        )}
        {recipe.difficulty && (
          <span className="font-semibold" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.08em', textTransform: 'capitalize' }}>
            {recipe.difficulty}
          </span>
        )}
        {recipe.servings && (
          <span className="font-semibold ml-auto" style={{ fontSize: '0.65rem', color: v.mutedText, letterSpacing: '0.05em' }}>
            {recipe.servings} servings
          </span>
        )}
      </div>

      <Link href={`/recipes/${recipe.slug}`} style={{ textDecoration: 'none' }}>
        {/* Headline first — newspaper style */}
        <h1
          className="font-black leading-[0.92] tracking-tight group-hover:underline underline-offset-4 mb-5"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', color: v.ink }}
        >
          {recipe.title}
        </h1>

        {/* Image below headline */}
        {img && (
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: '16 / 9',
              background: v.mutedPanel,
              border: `2px solid ${v.panelBorder}`,
              borderRadius: 0,
            }}
          >
            <Image
              src={img}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        )}
      </Link>

      {/* Description below image */}
      {recipe.description && (
        <p
          className="mt-4"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: v.mutedText, lineHeight: 1.6, maxWidth: '52rem' }}
        >
          {recipe.description}
        </p>
      )}
    </article>
  );
}

// ── MacroRecipeRow ──────────────────────────────────────────────────────────

function MacroRecipeRow({ recipe, index }: { recipe: Recipe; index: number }) {
  const img = resolveMediaUrl(recipe.coverImage);
  const timeParts = cookTimeParts(recipe.prepTime, recipe.cookTime);

  return (
    <article
      data-recipe-row
      className="group"
      style={{ borderBottom: `2px solid ${v.panelBorder}` }}
    >
      <Link
        href={`/recipes/${recipe.slug}`}
        className="flex items-stretch gap-6 sm:gap-8 py-6 sm:py-8 px-4 sm:px-6"
        style={{ textDecoration: 'none' }}
      >
        {/* Cook time dateline column */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-start pt-1 hidden sm:flex"
          style={{ width: 52, borderRight: `2px solid ${v.panelBorder}`, paddingRight: '1rem' }}
        >
          {timeParts ? (
            <>
              <span
                className="font-black leading-none tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: v.ink }}
              >
                {timeParts.big}
              </span>
              <span
                className="font-bold uppercase tracking-widest mt-0.5"
                style={{ fontSize: '0.6rem', color: v.mutedText }}
              >
                {timeParts.unit}
              </span>
            </>
          ) : (
            <span
              className="font-black tabular-nums"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: v.ink, opacity: 0.2 }}
            >
              #{String(index).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          {recipe.category && (
            <span
              data-recipe-category
              className="inline-block mb-1.5 font-black uppercase tracking-widest"
              style={{ fontSize: '0.62rem', color: v.accent }}
            >
              {recipe.category.name}
            </span>
          )}
          <h2
            className="font-black leading-[1.02] tracking-tight group-hover:underline underline-offset-4"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', color: v.ink }}
          >
            {recipe.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-2" style={{ fontSize: '0.72rem', color: v.mutedText }}>
            {recipe.difficulty && <span style={{ fontWeight: 700, color: v.ink, textTransform: 'capitalize' }}>{recipe.difficulty}</span>}
            {recipe.servings && (
              <>
                <span>&middot;</span>
                <span>{recipe.servings} servings</span>
              </>
            )}
            {/* Mobile time fallback */}
            {timeParts && <span className="sm:hidden">&middot; {timeParts.big}{timeParts.unit.toLowerCase()}</span>}
            <span className="hidden sm:inline" aria-hidden style={{ marginLeft: 'auto' }}>#{String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {img && (
          <div
            className="relative overflow-hidden flex-shrink-0 self-center"
            style={{ width: 88, height: 88, background: v.mutedPanel, border: `2px solid ${v.panelBorder}`, borderRadius: 0 }}
          >
            <Image
              src={img}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

// ── MacroSectionLabel ───────────────────────────────────────────────────────

function MacroSectionLabel({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2 mb-0"
      style={{ borderTop: `3px solid ${v.ink}`, borderBottom: `1px solid ${v.ink}` }}
    >
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
      <span
        className="font-black uppercase tracking-[0.2em]"
        style={{ fontSize: '0.65rem', color: v.ink }}
      >
        &#8213; {label} &#8213;
      </span>
      <div style={{ flex: 1, height: 1, background: v.panelBorder }} />
    </div>
  );
}

// ── RecipesLayoutMacro ──────────────────────────────────────────────────────

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutMacro({ recipes, categories }: Props) {
  const [lead, ...rest] = recipes;

  return (
    <div data-recipes-page>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        {/* Lead recipe */}
        {lead && (
          <div className="mb-16">
            <MacroRecipeLead recipe={lead} />
          </div>
        )}

        {/* Remaining recipes */}
        {rest.length > 0 && (
          <div>
            <MacroSectionLabel label="More Recipes" />
            <div style={{ borderTop: `1px solid ${v.panelBorder}` }}>
              {rest.map((recipe, i) => (
                <MacroRecipeRow key={recipe.slug} recipe={recipe} index={i + 2} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
