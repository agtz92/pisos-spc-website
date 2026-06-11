/**
 * PressMentions — strip of media outlets where the brand was featured.
 *
 * Renders when ``pressMentionsEnabled === true`` and there is at least
 * one ``LandingPressMention``. Layouts call it where the wireframe puts
 * it (Storefront / Portfolio / Macro after testimonials; Services after
 * the reviews strip).
 */
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function PressMentions({ page }: { page: LandingPage }) {
  if (!page.pressMentionsEnabled) return null;
  const items = page.pressMentions || [];
  if (items.length === 0) return null;
  return (
    <section className="py-12" style={{ background: t.mutedPanel, borderTop: `1px solid ${t.panelBorder}` }}>
      <div className="max-w-6xl mx-auto px-4">
        {page.pressMentionsHeading && (
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-6"
             style={{ color: t.mutedText }}>
            {page.pressMentionsHeading}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {items.map((m) => {
            const logoUrl = resolveMediaUrl(m.logo);
            const inner = logoUrl ? (
              <div className="relative h-8 w-24">
                <Image src={logoUrl} alt={m.mediaName} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
              </div>
            ) : (
              <span className="text-lg font-bold tracking-tight" style={{ color: t.mutedText }}>
                {m.mediaName}
              </span>
            );
            return m.url ? (
              <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" title={m.quote || m.mediaName}>
                {inner}
              </a>
            ) : (
              <div key={m.id} title={m.quote || m.mediaName}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
