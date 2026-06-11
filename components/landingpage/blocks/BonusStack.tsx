/**
 * BonusStack — Bonus material cards (Digital layout).
 */
import type { LandingPage } from '@/lib/graphql';
import { FeatureIcon, t } from '../sections';

export default function BonusStack({ page }: { page: LandingPage }) {
  if (!page.bonusesEnabled) return null;
  const items = page.bonuses || [];
  if (items.length === 0) return null;
  return (
    <section className="py-16" style={{ background: t.mutedPanel }}>
      <div className="max-w-5xl mx-auto px-4">
        {page.bonusesHeading && (
          <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>{page.bonusesHeading}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((b) => (
            <div key={b.id} className="rounded-2xl p-6"
                 style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
              <div className="text-3xl mb-2">🎁</div>
              {b.icon && (
                <div className="mb-2" style={{ color: t.accent }}>
                  <FeatureIcon icon={b.icon} image={b.image} alt={b.title} size={24} />
                </div>
              )}
              <h3 className="text-lg font-bold" style={{ color: t.ink }}>{b.title}</h3>
              {b.description && (
                <p className="mt-2 text-sm leading-relaxed" style={{ color: t.mutedText }}>{b.description}</p>
              )}
              {b.valueUsd != null && (
                <p className="mt-2 text-sm font-semibold" style={{ color: t.accent }}>
                  Value: ${Number(b.valueUsd).toFixed(2)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
