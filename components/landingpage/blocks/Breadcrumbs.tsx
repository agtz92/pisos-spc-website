/**
 * Breadcrumbs — top-of-page breadcrumbs (Phase 3 wired, Phase 7 polished).
 * Renders when ``page.showBreadcrumbs === true``. The matching
 * ``BreadcrumbList`` JSON-LD is emitted from ``landing-page-seo.ts``.
 */
import Link from 'next/link';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function Breadcrumbs({ page }: { page: LandingPage }) {
  if (!page.showBreadcrumbs) return null;
  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 py-3 text-sm">
      <ol className="flex items-center gap-2 flex-wrap" style={{ color: t.mutedText }}>
        <li>
          <Link href="/" style={{ color: t.accent }}>Home</Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link href="/lp" style={{ color: t.accent }}>Landings</Link>
        </li>
        <li aria-hidden>›</li>
        <li style={{ color: t.ink }}>{page.title}</li>
      </ol>
    </nav>
  );
}
