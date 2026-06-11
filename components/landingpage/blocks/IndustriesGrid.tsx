/**
 * IndustriesGrid — Industries we serve (Services layout).
 */
import type { LandingPage } from '@/lib/graphql';
import { FeatureIcon, t } from '../sections';

export default function IndustriesGrid({ page }: { page: LandingPage }) {
  if (!page.industriesEnabled) return null;
  const items = page.industries || [];
  if (items.length === 0) return null;
  return (
    <section className="py-16" style={{ background: t.panel }}>
      <div className="max-w-6xl mx-auto px-4">
        {page.industriesHeading && (
          <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>
            {page.industriesHeading}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((ind) => (
            <div key={ind.id} className="text-center p-4 rounded-xl"
                 style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
              <div className="mb-2" style={{ color: t.accent }}>
                <FeatureIcon icon={ind.icon} image={ind.image} alt={ind.name} size={28} />
              </div>
              <p className="text-sm font-semibold" style={{ color: t.ink }}>{ind.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
