'use client';

import { useState, useEffect, useRef } from 'react';
import RecipeCard from '@/components/RecipeCard';
import type { Recipe } from '@/lib/graphql';

const accent = 'var(--template-accent, #e5201b)';
const ink = 'var(--template-ink, #161218)';
const panelBorder = 'var(--template-panel-border, #e5e7eb)';

const PER_PAGE = 4;

export default function QuickPicksStrip({ recipes }: { recipes: Recipe[] }) {
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const pendingPage = useRef<number | null>(null);
  const totalPages = Math.ceil(recipes.length / PER_PAGE);
  const visible = recipes.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => {
      if (pendingPage.current !== null) {
        setPage(pendingPage.current);
        pendingPage.current = null;
      }
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [fading]);

  function changePage(next: number, dir: 'left' | 'right') {
    if (fading) return;
    pendingPage.current = next;
    setDirection(dir);
    setFading(true);
  }

  return (
    <section>
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div data-recipe-section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ width: 4, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: ink,
          }}>
            Quick Picks
          </span>
          <div style={{ flex: 1, height: 1, background: panelBorder }} />
        </div>

        {/* Arrow buttons */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
            <button
              onClick={() => changePage(Math.max(0, page - 1), 'left')}
              disabled={page === 0}
              aria-label="Previous"
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${panelBorder}`,
                background: 'transparent',
                color: ink,
                opacity: page === 0 ? 0.3 : 1,
                cursor: page === 0 ? 'default' : 'pointer',
                transition: 'opacity 0.15s',
                fontFamily: 'inherit',
                borderRadius: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
            <button
              onClick={() => changePage(Math.min(totalPages - 1, page + 1), 'right')}
              disabled={page >= totalPages - 1}
              aria-label="Next"
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${panelBorder}`,
                background: 'transparent',
                color: ink,
                opacity: page >= totalPages - 1 ? 0.3 : 1,
                cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                transition: 'opacity 0.15s',
                fontFamily: 'inherit',
                borderRadius: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l5 4-5 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Cards with fade+slide transition ── */}
      <div
        data-recipe-strip
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          opacity: fading ? 0 : 1,
          transform: fading
            ? `translateX(${direction === 'right' ? '-12px' : '12px'})`
            : 'translateX(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {visible.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} compact />
        ))}
      </div>
    </section>
  );
}
