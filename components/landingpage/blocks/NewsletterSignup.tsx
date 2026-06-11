'use client';

/**
 * NewsletterSignup — client component.
 *
 * POSTs ``{ email, tenant_slug, source_slug }`` to the Django endpoint
 * ``/api/newsletter/subscribe``. The form intentionally renders no
 * status states until submit so server-side flicker is impossible.
 *
 * Only renders when ``page.newsletter?.enabled === true``.
 */
import { useState } from 'react';
import type { LandingPage, LandingNewsletterBlock } from '@/lib/graphql';
import { t } from '../sections';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || '';

export default function NewsletterSignup({
  page, block,
}: {
  page: LandingPage;
  block: LandingNewsletterBlock;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [email, setEmail] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('sending');
    try {
      const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tenant_slug: TENANT_SLUG,
          source_slug: page.slug,
        }),
      });
      setState(res.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
  }

  return (
    <section className="py-14" style={{ background: t.mutedPanel }}>
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
        <div className="sm:col-span-3">
          <h3 className="text-2xl font-bold" style={{ color: t.ink }}>{block.heading}</h3>
          {block.subheading && (
            <p className="mt-2 text-sm" style={{ color: t.mutedText }}>{block.subheading}</p>
          )}
        </div>
        <form onSubmit={onSubmit} className="sm:col-span-2 flex flex-col gap-3">
          {state === 'ok' ? (
            <p className="text-sm font-semibold" style={{ color: t.accent }}>{block.successMessage}</p>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={block.placeholder}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                  style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
                />
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
                  style={{ background: t.accent, color: '#fff' }}
                >
                  {state === 'sending' ? '…' : block.buttonText}
                </button>
              </div>
              {state === 'err' && (
                <p className="text-xs" style={{ color: '#dc2626' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </section>
  );
}
