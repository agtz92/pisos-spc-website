/**
 * Outcomes — "What you'll learn" bullet grid (Digital layout primarily).
 */
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

export default function Outcomes({ page }: { page: LandingPage }) {
  if (!page.outcomesEnabled) return null;
  const items = page.outcomes || [];
  if (items.length === 0) return null;
  return (
    <section className="py-16" style={{ background: t.panel }}>
      <div className="max-w-5xl mx-auto px-4">
        {page.outcomesHeading && (
          <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>{page.outcomesHeading}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((o) => (
            <div key={o.id} className="flex items-start gap-3 p-4 rounded-xl"
                 style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
              <span className="font-bold text-lg flex-shrink-0" style={{ color: t.accent }}>✓</span>
              <div>
                <p className="font-semibold" style={{ color: t.ink }}>{o.title}</p>
                {o.description && (
                  <p className="mt-1 text-sm" style={{ color: t.mutedText }}>{o.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
