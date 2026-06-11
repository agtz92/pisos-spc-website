/**
 * TeamGrid — Team members section (Services, Portfolio).
 *
 * Pulls from ``LandingTeamSelect`` which references Author. Per-page
 * ``roleOverride`` wins over ``author.role`` when set.
 */
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/graphql';
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function TeamGrid({ page }: { page: LandingPage }) {
  if (!page.teamEnabled) return null;
  const items = page.teamMembers || [];
  if (items.length === 0) return null;
  return (
    <section className="py-20" style={{ background: t.mutedPanel }}>
      <div className="max-w-6xl mx-auto px-4">
        {page.teamHeading && (
          <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>{page.teamHeading}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((m) => {
            const avatar = resolveMediaUrl(m.author?.avatar);
            const role = m.roleOverride || m.author?.role || '';
            return (
              <div key={m.id} className="text-center">
                {avatar ? (
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3">
                    <Image src={avatar} alt={m.author?.name || ''} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center font-bold text-2xl mb-3"
                       style={{ background: t.panel, color: t.accent }}>
                    {(m.author?.name || '?').charAt(0)}
                  </div>
                )}
                <p className="font-semibold" style={{ color: t.ink }}>{m.author?.name}</p>
                {role && (
                  <p className="text-xs mt-0.5" style={{ color: t.mutedText }}>{role}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
