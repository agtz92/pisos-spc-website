'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, type UtilityLayoutProps } from './sections';

export default function UtilityFaqSearchable({ page }: UtilityLayoutProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    page.faqItems.forEach((i) => { if (i.category) set.add(i.category); });
    return Array.from(set);
  }, [page.faqItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return page.faqItems.filter((i) => {
      const matchCat = activeCategory === 'all' || i.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q);
    });
  }, [page.faqItems, query, activeCategory]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header>
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && <div className="mt-4"><UtilitySubheading>{page.subheadline}</UtilitySubheading></div>}
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div
          className="relative flex-1"
          style={{
            background: t.panel,
            border: `1px solid ${t.panelBorder}`,
            borderRadius: 14,
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: t.mutedText,
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            placeholder="Search questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.6rem',
              border: 'none',
              background: 'transparent',
              color: t.ink,
              fontSize: '0.95rem',
              outline: 'none',
              borderRadius: 14,
            }}
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <CategoryChip active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>All</CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)}>
              {c}
            </CategoryChip>
          ))}
        </div>
      )}

      <ul className="mt-8 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <li
            className="px-5 py-12 text-center"
            style={{
              color: t.mutedText,
              background: t.panel,
              border: `1px dashed ${t.panelBorder}`,
              borderRadius: 14,
            }}
          >
            No questions match your search.
          </li>
        ) : (
          filtered.map((item) => (
            <li key={item.id}>
              <details
                className="group"
                style={{
                  background: t.panel,
                  border: `1px solid ${t.panelBorder}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                <summary
                  className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 list-none"
                  style={{ color: t.ink, fontWeight: 700, fontSize: '1rem' }}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className="transition-transform group-open:rotate-45"
                    style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: 999,
                      background: `color-mix(in srgb, ${t.accent} 14%, transparent)`,
                      color: t.accent, display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 600,
                    }}
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
                  <p className="pt-4" style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {item.answer}
                  </p>
                </div>
              </details>
            </li>
          ))
        )}
      </ul>
    </article>
  );
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        padding: '0.4rem 0.85rem',
        borderRadius: 999,
        border: `1px solid ${active ? 'transparent' : t.panelBorder}`,
        background: active ? t.accent : t.panel,
        color: active ? t.textOnAccent : t.ink,
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
