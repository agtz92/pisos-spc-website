import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBackground = 'var(--template-panel, #ffffff)';

const DIFFICULTY_BADGE: Record<string, { bg: string; color: string }> = {
  easy:   { bg: 'rgba(22,163,74,0.88)',  color: '#fff' },
  medium: { bg: 'rgba(202,138,4,0.90)',  color: '#fff' },
  hard:   { bg: 'rgba(220,38,38,0.88)', color: '#fff' },
};

function formatTime(mins: number | null): string | null {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Clock SVG icon */
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function RecipeCard({
  recipe,
  /** compact = tighter padding, used in horizontal scroll strip */
  compact,
}: {
  recipe: Recipe;
  compact?: boolean;
}) {
  const imageUrl = resolveMediaUrl(recipe.coverImage);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  const diff = (recipe.difficulty ?? '').toLowerCase();
  const badge = DIFFICULTY_BADGE[diff];

  return (
    <article
      data-recipe-card
      className="group hover:shadow-xl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: compact ? 14 : 18,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(22,18,24,0.07)',
        transition: 'box-shadow 0.25s',
      }}
    >
      {/* ── Image wrapper ── */}
      <div style={{ position: 'relative', aspectRatio: '3 / 2', flexShrink: 0, overflow: 'hidden', background: '#e5e7eb' }}>
        {/* Recipe link covers the whole image */}
        <Link
          href={`/recipes/${recipe.slug}`}
          style={{ position: 'absolute', inset: 0, display: 'block', textDecoration: 'none' }}
          aria-label={recipe.title}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105"
              style={{ transition: 'transform 0.5s ease', transformOrigin: 'center' }}
            />
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${accent}22 0%, ${accent}44 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 5v5l3 2" />
              </svg>
            </div>
          )}

          {/* Bottom gradient for text legibility */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)',
          }} />
        </Link>

        {/* Category pill — sibling of image link, positioned bottom-left */}
        {recipe.category && (
          <Link
            data-recipe-category
            href={`/recipes/category/${recipe.category.slug}`}
            style={{
              position: 'absolute', bottom: 10, left: 10,
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              background: accent,
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              zIndex: 2,
            }}
          >
            {recipe.category.name}
          </Link>
        )}

        {/* Difficulty badge — top right */}
        {badge && (
          <span data-recipe-difficulty style={{
            position: 'absolute', top: 10, right: 10,
            padding: '0.2rem 0.55rem',
            borderRadius: 999,
            background: badge.bg,
            color: badge.color,
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'capitalize',
            letterSpacing: '0.04em',
            backdropFilter: 'blur(4px)',
            zIndex: 2,
          }}>
            {recipe.difficulty}
          </span>
        )}
      </div>

      {/* ── Text body ── */}
      <div style={{
        padding: compact ? '0.75rem 0.9rem 0.85rem' : '1rem 1.1rem 1.15rem',
        background: panelBackground,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        <h2 style={{
          fontSize: compact ? '0.9rem' : '1.05rem',
          fontWeight: 700,
          lineHeight: 1.25,
          color: ink,
          marginBottom: '0.4rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          <Link href={`/recipes/${recipe.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {recipe.title}
          </Link>
        </h2>

        {recipe.description && !compact && (
          <p style={{
            fontSize: '0.8rem',
            color: ink,
            opacity: 0.6,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '0.5rem',
          }}>
            {recipe.description}
          </p>
        )}

        {totalTime > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginTop: 'auto',
            paddingTop: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: ink,
            opacity: 0.45,
          }}>
            <ClockIcon />
            {formatTime(totalTime)}
            {recipe.servings && (
              <>
                <span style={{ opacity: 0.6 }}>·</span>
                <span>{recipe.servings} serv.</span>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
