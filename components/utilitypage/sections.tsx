/**
 * Shared building blocks for utility-page layout variants.
 *
 * Mirrors website/components/landingpage/sections.tsx: only consumes
 * --template-* CSS variables so the same components blend into modern,
 * retro, futuristic, and executive shells.
 */

import {
  Mail, Phone, MapPin, MessageSquare, Globe, Clock, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { UtilityPage } from '@/lib/graphql';

export const t = {
  accent:        'var(--template-accent, #2563eb)',
  accentStrong:  'var(--template-accent-strong, #1d4ed8)',
  ink:           'var(--template-ink, #111827)',
  mutedText:     'var(--template-muted-text, #6b7280)',
  panel:         'var(--template-panel, #ffffff)',
  panelBorder:   'var(--template-panel-border, #e5e7eb)',
  mutedPanel:    'var(--template-muted-panel, #f8fafc)',
  textOnAccent:  'var(--template-text-on-accent, #ffffff)',
};

export const CONTACT_ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  address: MapPin,
  'message-square': MessageSquare,
  message: MessageSquare,
  globe: Globe,
  clock: Clock,
};

export function ContactIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const C = icon ? CONTACT_ICON_MAP[icon.toLowerCase()] : undefined;
  if (C) return <C size={size} strokeWidth={1.75} />;
  return <Mail size={size} strokeWidth={1.75} />;
}

export interface UtilityLayoutProps {
  page: UtilityPage;
}

export function UtilityCta({ page }: { page: UtilityPage }) {
  if (!page.ctaText || !page.ctaUrl) return null;
  return (
    <a
      href={page.ctaUrl}
      className="inline-flex items-center gap-2 px-5 py-3 no-underline transition-transform hover:-translate-y-0.5"
      style={{
        background: t.accent,
        color: t.textOnAccent,
        borderRadius: 12,
        fontWeight: 700,
        fontSize: '0.95rem',
        boxShadow: `0 8px 24px color-mix(in srgb, ${t.accent} 22%, transparent)`,
      }}
    >
      {page.ctaText}
      <ArrowRight size={18} strokeWidth={2} />
    </a>
  );
}

export function UtilityEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: t.accent,
        fontSize: '0.72rem',
        fontWeight: 800,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </p>
  );
}

export function UtilityHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        color: t.ink,
        fontSize: 'clamp(2rem, 4vw, 3.4rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        fontWeight: 800,
      }}
    >
      {children}
    </h1>
  );
}

export function UtilitySubheading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: t.mutedText,
        fontSize: '1.05rem',
        lineHeight: 1.7,
        maxWidth: '52ch',
      }}
    >
      {children}
    </p>
  );
}

/**
 * Best-effort prose renderer for body content.
 * Treats the body as pre-formatted text split into paragraphs, with simple
 * heading detection (lines that start with `## ` become h2). For richer
 * formatting authors can save HTML directly — react `dangerouslySetInnerHTML`
 * is intentionally avoided here to keep CMS content safe by default.
 */
export function UtilityProse({ body }: { body: string }) {
  if (!body) return null;
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-5" style={{ color: t.ink }}>
      {blocks.map((block, idx) => {
        if (block.startsWith('## ')) {
          return (
            <h2
              key={idx}
              id={slugify(block.slice(3))}
              style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '0.5rem' }}
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('# ')) {
          return (
            <h2 key={idx} style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {block.slice(2)}
            </h2>
          );
        }
        return (
          <p key={idx} style={{ fontSize: '1rem', lineHeight: 1.75, color: t.ink, opacity: 0.92 }}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function extractTocFromBody(body: string): { id: string; label: string }[] {
  if (!body) return [];
  const items: { id: string; label: string }[] = [];
  for (const line of body.split('\n')) {
    if (line.startsWith('## ')) {
      const label = line.slice(3).trim();
      if (label) items.push({ id: slugify(label), label });
    }
  }
  return items;
}
