/**
 * ProcessTimeline — numbered timeline (Services, Portfolio, Digital).
 */
import type { LandingPage } from '@/lib/graphql';
import { t, FeatureIcon } from '../sections';

export default function ProcessTimeline({ page }: { page: LandingPage }) {
  if (!page.processEnabled) return null;
  const steps = page.processSteps || [];
  if (steps.length === 0) return null;
  return (
    <section className="py-20" style={{ background: t.mutedPanel }}>
      <div className="max-w-6xl mx-auto px-4">
        {page.processHeading && (
          <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>
            {page.processHeading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s) => (
            <div key={s.id} className="p-6 rounded-2xl text-center"
                 style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center font-extrabold text-lg mb-3"
                   style={{ background: t.accent, color: '#fff' }}>
                {String(s.stepNumber ?? 0).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: t.ink }}>{s.title}</h3>
              {s.duration && (
                <p className="text-xs mt-1" style={{ color: t.accent }}>{s.duration}</p>
              )}
              {s.description && (
                <p className="text-sm mt-2 leading-relaxed" style={{ color: t.mutedText }}>{s.description}</p>
              )}
              {(s.icon || s.image) && (
                <div className="mt-3 inline-block" style={{ color: t.accent }}>
                  <FeatureIcon icon={s.icon} image={s.image} alt={s.title} size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
