/**
 * RecipesLayoutVisual
 *
 * CONCEPT: Pure image-first browsing. Every recipe is a tall card where the cover
 * photo fills ~75% of the card height and the title + category appear as a slim
 * overlay strip at the bottom over a gradient scrim. Metadata (time, difficulty)
 * is shown as compact chips in the top-right corner of the image.
 *
 * DESIGN DECISIONS:
 * - Cards are tall (aspect ratio 3:4 — portrait orientation) to maximise image impact
 * - A 3-col grid (4-col on XL) creates a mosaic-like browsing surface
 * - Text content is minimal: only category + title visible at rest
 * - On hover: the gradient scrim deepens and a subtle excerpt slides up (CSS transition)
 * - Cards without images get a gradient placeholder using the accent color
 * - No section labels or rail separators — the grid IS the layout
 *
 * GOOD FOR: Visually rich recipe libraries where photography quality is high.
 * Especially effective for food photography or styled recipe content.
 *
 * MODIFICATION NOTES:
 * - Card aspect ratio: change `aspectRatio: '3 / 4'` (taller = more immersive)
 * - Number of columns: change the grid className (currently sm:2, lg:3, xl:4)
 * - To show difficulty/time always (not just on hover): move the chips outside the hover group
 * - Scrim gradient: adjust the `background` in the overlay div
 * - To add a "quick badge" for recipes under 30min: add conditional badge in top-left
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Recipe, Category } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';

const accent = 'var(--template-accent, #e5201b)';
const panelBackground = 'var(--template-panel, #ffffff)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';

function formatTime(mins: number | null): string | null {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60); const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function VisualCard({ recipe }: { recipe: Recipe }) {
  const imageUrl = resolveMediaUrl(recipe.coverImage);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  const timeStr = formatTime(totalTime);

  return (
    <article data-recipe-card className="group" style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: 18, overflow: 'hidden', background: imageUrl ? panelBorder : `linear-gradient(135deg, ${accent}33, ${accent}77)` }}>
      {imageUrl && (
        <Image src={imageUrl} alt={recipe.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ transformOrigin: 'center' }} />
      )}

      {/* Top badges: time + difficulty */}
      {(timeStr || recipe.difficulty) && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', zIndex: 2 }}>
          {timeStr && (
            <span style={{ padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {timeStr}
            </span>
          )}
          {recipe.difficulty && (
            <span data-recipe-difficulty style={{ padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.62rem', fontWeight: 700, textTransform: 'capitalize' as const, letterSpacing: '0.03em' }}>
              {recipe.difficulty}
            </span>
          )}
        </div>
      )}

      {/* Bottom gradient scrim + title */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.72) 100%)',
        transition: 'opacity 0.25s ease',
      }} />

      <Link href={`/recipes/${recipe.slug}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', textDecoration: 'none', zIndex: 1 }}>
        {recipe.category && (
          <span data-recipe-category style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: accent, marginBottom: '0.35rem' }}>
            {recipe.category.name}
          </span>
        )}
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', lineHeight: 1.2, color: '#fff', letterSpacing: '-0.02em' }}>
          {recipe.title}
        </h2>
      </Link>
    </article>
  );
}

interface Props {
  recipes: Recipe[];
  categories: Category[];
}

export default function RecipesLayoutVisual({ recipes, categories }: Props) {
  return (
    <div data-recipes-page style={{ background: panelBackground }}>
      <CategoryFilterBar categories={categories} basePath="/recipes/category/" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => <VisualCard key={r.slug} recipe={r} />)}
        </div>
      </div>
    </div>
  );
}
