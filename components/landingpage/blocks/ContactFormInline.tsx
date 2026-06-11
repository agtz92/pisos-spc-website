'use client';

/**
 * ContactFormInline — opt-in inline contact form.
 *
 * Rendered only when ``page.contactFormEnabled === true``. Every label
 * (heading, subheading, placeholders, button text, success title +
 * body) is editable from the CMS. Submits to the public Django endpoint
 * ``/api/contact/submit``.
 */
import { useState } from 'react';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || '';

export default function ContactFormInline({ page }: { page: LandingPage }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  if (!page.contactFormEnabled) return null;

  // Resolve labels with fallbacks. The CMS persists empty strings when
  // the editor leaves a field blank; we still want sensible defaults so
  // a partially configured form renders correctly.
  const heading            = page.contactFormHeading            || 'Get in touch';
  const subheading         = page.contactFormSubheading         || '';
  const namePh             = page.contactFormNamePlaceholder    || 'Your name';
  const emailPh            = page.contactFormEmailPlaceholder   || 'your@email.com';
  const messagePh          = page.contactFormMessagePlaceholder || 'How can we help?';
  const buttonText         = page.contactFormButtonText         || 'Send →';
  const successTitle       = page.contactFormSuccessTitle       || 'Thanks!';
  const successBody        = page.contactFormSuccessBody        || "We'll get back to you within 24 hours.";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch(`${API_BASE}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tenant_slug: TENANT_SLUG, source_slug: page.slug }),
      });
      setState(res.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
  }

  return (
    <section id="contact" className="py-16" style={{ background: t.mutedPanel }}>
      <div className="max-w-2xl mx-auto px-4">
        {state === 'ok' ? (
          <div className="text-center p-8 rounded-2xl"
               style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
            <h3 className="text-2xl font-bold" style={{ color: t.ink }}>{successTitle}</h3>
            {successBody && (
              <p className="mt-2 text-sm" style={{ color: t.mutedText }}>{successBody}</p>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 p-6 rounded-2xl"
                style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
            <div>
              <h3 className="text-xl font-bold" style={{ color: t.ink }}>{heading}</h3>
              {subheading && (
                <p className="mt-1 text-sm" style={{ color: t.mutedText }}>{subheading}</p>
              )}
            </div>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={namePh}
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={emailPh}
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
            />
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={messagePh}
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="self-start px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
              style={{ background: t.accent, color: '#fff' }}
            >
              {state === 'sending' ? '…' : buttonText}
            </button>
            {state === 'err' && (
              <p className="text-xs" style={{ color: '#dc2626' }}>Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
