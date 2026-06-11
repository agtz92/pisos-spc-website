/**
 * AwardsGrid — Awards & recognition (Portfolio layout).
 */
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function AwardsGrid({ page }: { page: LandingPage }) {
  if (!page.awardsEnabled) return null;
  const items = page.awards || [];
  if (items.length === 0) return null;
  return (
    <section className="py-16" style={{ background: t.panel }}>
      <div className="max-w-5xl mx-auto px-4">
        {page.awardsHeading && (
          <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>{page.awardsHeading}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((a) => {
            const img = resolveMediaUrl(a.image);
            const card = (
              <div className="rounded-2xl p-6 text-center"
                   style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                {img ? (
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <Image src={img} alt={a.title} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="text-3xl mb-3">🏆</div>
                )}
                <h3 className="text-base font-bold" style={{ color: t.ink }}>{a.title}</h3>
                {(a.organization || a.year) && (
                  <p className="text-xs mt-1" style={{ color: t.mutedText }}>
                    {[a.organization, a.year].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            );
            return a.url ? (
              <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer">{card}</a>
            ) : (
              <div key={a.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
