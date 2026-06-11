/**
 * ReviewsAggregate — big average-rating widget.
 *
 * Activated by ``page.reviewsShowAggregate`` and requires at least one
 * review in ``modules.reviews``. The 1-10 scale used internally is
 * normalized to 0-5 stars on render.
 *
 * Pairs naturally with the AggregateRating JSON-LD emitted by
 * ``landing-page-seo.ts`` — both read from the same source data.
 */
import type { LandingPage } from '@/lib/graphql';
import type { ModuleData } from '../sections';
import { t } from '../sections';

export default function ReviewsAggregate({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  if (!page.reviewsShowAggregate) return null;
  const rated = (modules.reviews || []).filter((r) => r.rating != null);
  if (rated.length === 0) return null;
  const sum = rated.reduce((s, r) => s + Number(r.rating ?? 0), 0);
  const avg10 = sum / rated.length;          // internal 1-10 scale
  const avg5 = Math.round((avg10 / 2) * 10) / 10;
  const breakdown: Record<5 | 4 | 3 | 2 | 1, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  rated.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating ?? 0) / 2))) as 1 | 2 | 3 | 4 | 5;
    breakdown[star] += 1;
  });
  const max = Math.max(1, ...Object.values(breakdown));

  return (
    <section className="py-14" style={{ background: t.panel, borderTop: `1px solid ${t.panelBorder}` }}>
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-5xl font-extrabold" style={{ color: t.ink }}>
            {avg5.toFixed(1)}
            <span className="ml-3" style={{ color: '#facc15' }}>
              {'★★★★★'.slice(0, Math.round(avg5))}
              <span style={{ color: t.panelBorder }}>{'★★★★★'.slice(Math.round(avg5))}</span>
            </span>
          </div>
          <div className="mt-2 text-sm" style={{ color: t.mutedText }}>
            Based on <b style={{ color: t.ink }}>{rated.length}</b> reviews
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs">
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span style={{ width: 24, color: t.mutedText }}>{star}★</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: t.mutedPanel }}>
                <div className="h-2 rounded-full" style={{ background: '#facc15', width: `${(breakdown[star] / max) * 100}%` }} />
              </div>
              <span style={{ width: 28, textAlign: 'right', color: t.mutedText }}>{breakdown[star]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
