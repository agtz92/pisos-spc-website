/**
 * StickyBar — universal opt-in promo bar that sits at the top of any
 * landing page, above the layout-specific hero.
 *
 * Fed by the inline ``stickyBar*`` fields on ``LandingPage`` (not by a
 * ``LandingCustomBlock`` — sticky bar is universal enough to warrant
 * dedicated columns).
 *
 * Behavior:
 * - Hidden entirely when ``stickyBarEnabled === false``.
 * - Hidden when ``stickyBarEndsAt`` has already passed (server-side
 *   evaluation; updates on next ISR revalidation, which is fine for promo
 *   bars).
 * - ``stickyBarStyle`` picks the background: ``accent`` (template accent),
 *   ``dark`` (template ink), or ``brand`` (alias of accent right now).
 */

import Link from 'next/link';
import { t } from '../sections';
import type { LandingPage } from '@/lib/graphql';

type StickyBarFields = Pick<
  LandingPage,
  | 'stickyBarEnabled'
  | 'stickyBarText'
  | 'stickyBarCtaText'
  | 'stickyBarCtaUrl'
  | 'stickyBarEndsAt'
  | 'stickyBarStyle'
>;

function isExpired(endsAt: string | null | undefined): boolean {
  if (!endsAt) return false;
  const ts = Date.parse(endsAt);
  if (Number.isNaN(ts)) return false;
  return ts < Date.now();
}

export default function StickyBar({ page }: { page: StickyBarFields }) {
  if (!page.stickyBarEnabled) return null;
  if (!page.stickyBarText && !page.stickyBarCtaText) return null;
  if (isExpired(page.stickyBarEndsAt)) return null;

  const style = page.stickyBarStyle || 'accent';
  const bg = style === 'dark' ? t.ink : t.accent;

  return (
    <div
      data-lp-sticky-bar
      style={{
        background: bg,
        color: '#ffffff',
        padding: '10px 16px',
        fontSize: 13,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {page.stickyBarText && (
          <span style={{ flex: '1 1 auto', minWidth: 0 }}>
            {page.stickyBarText}
          </span>
        )}
        {page.stickyBarCtaText && (
          <Link
            href={page.stickyBarCtaUrl || '#'}
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              border: '1.5px solid rgba(255,255,255,0.55)',
              borderRadius: 6,
              color: '#ffffff',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {page.stickyBarCtaText} →
          </Link>
        )}
      </div>
    </div>
  );
}
