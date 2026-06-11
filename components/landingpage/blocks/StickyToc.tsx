'use client';

/**
 * StickyToc — Fixed table of contents (Phase 7).
 *
 * Lists the page's named sections in a fixed right rail on desktop.
 * Active highlight requires IntersectionObserver; we ship a static
 * version first and add the active-section tracker behind a small
 * client effect.
 */
import { useEffect, useState } from 'react';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

type TocItem = { id: string; label: string };

function tocFor(page: LandingPage): TocItem[] {
  const items: TocItem[] = [];
  if (page.heroEnabled) items.push({ id: 'hero', label: 'Overview' });
  if (page.featuresEnabled && page.features.length > 0) items.push({ id: 'services', label: 'Services' });
  if (page.processEnabled) items.push({ id: 'process', label: 'Process' });
  items.push({ id: 'cases', label: 'Cases' });
  if (page.pricingEnabled && page.pricingPlans.length > 0) items.push({ id: 'pricing', label: 'Pricing' });
  if (page.faqEnabled && page.faqItems.length > 0) items.push({ id: 'faq', label: 'FAQ' });
  return items;
}

export default function StickyToc({ page }: { page: LandingPage }) {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    if (!page.stickyTocEnabled) return;
    const items = tocFor(page);
    const observers: IntersectionObserver[] = [];
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(it.id); },
        { rootMargin: '-30% 0px -60% 0px' },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [page]);

  if (!page.stickyTocEnabled) return null;
  const items = tocFor(page);
  if (items.length === 0) return null;
  return (
    <aside
      aria-label="Table of contents"
      className="hidden lg:block"
      style={{
        position: 'fixed', right: 16, top: '30%',
        background: t.panel, border: `1px solid ${t.panelBorder}`,
        borderRadius: 10, padding: 12, fontSize: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', zIndex: 20, maxWidth: 200,
      }}
    >
      <p className="font-bold mb-2" style={{ color: t.ink }}>On this page</p>
      <ol className="flex flex-col gap-1">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              style={{
                display: 'block',
                padding: '2px 0 2px 8px',
                borderLeft: `2px solid ${active === it.id ? t.accent : 'transparent'}`,
                color: active === it.id ? t.ink : t.mutedText,
                fontWeight: active === it.id ? 600 : 400,
              }}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
