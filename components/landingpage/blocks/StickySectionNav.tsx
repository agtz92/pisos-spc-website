'use client';

/**
 * StickySectionNav — fixed top nav that appears once the user scrolls
 * past the hero. Anchors to the LP's named sections. Phase 6 ships a
 * minimal sticky bar; the IntersectionObserver-driven active-section
 * highlight lands in Phase 7.
 */
import { useEffect, useState } from 'react';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

const DEFAULT_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'process',  label: 'Process' },
  { id: 'cases',    label: 'Cases' },
  { id: 'pricing',  label: 'Pricing' },
  { id: 'contact',  label: 'Contact' },
];

export default function StickySectionNav({ page }: { page: LandingPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!page.stickySectionNavEnabled) return null;
  return (
    <nav
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        background: t.ink, color: '#fff',
        padding: '10px 16px',
        zIndex: 30,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.2s, transform 0.2s',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <span className="text-sm font-bold">↑ Top</span>
        <div className="flex gap-1 flex-wrap text-xs">
          {DEFAULT_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="px-3 py-1 rounded-full"
               style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
