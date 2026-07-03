/**
 * BentoFeatures — asymmetric features grid (Apple-style bento).
 *
 * Activated by ``featuresLayout === 'bento'``. Each ``LandingFeature``
 * declares a ``span`` of:
 *   - 'regular' → 1×1 cell
 *   - 'wide'    → 2 columns
 *   - 'tall'    → 2 rows
 * The CSS grid uses ``auto-flow: dense`` so cells fill any holes.
 */
import Link from 'next/link';
import type { LandingPage, LandingFeature } from '@/lib/graphql';
import { FeatureIcon, FeatureMedia, t } from '../sections';

function spanClass(span: string): string {
  if (span === 'wide') return 'sm:col-span-2';
  if (span === 'tall') return 'sm:row-span-2';
  return '';
}

export default function BentoFeatures({ page }: { page: LandingPage }) {
  if (page.featuresLayout !== 'bento') return null;
  if (!page.featuresEnabled) return null;
  const items = page.features || [];
  if (items.length === 0) return null;
  const cardMedia = page.featuresMediaStyle === 'card';
  return (
    <section className="py-20" style={{ background: t.mutedPanel }}>
      <div className="max-w-6xl mx-auto px-4">
        {(page.featuresHeading || page.featuresSubheading) && (
          <div className="text-center mb-14">
            {page.featuresHeading && <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: t.ink }}>{page.featuresHeading}</h2>}
            {page.featuresSubheading && <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: t.mutedText }}>{page.featuresSubheading}</p>}
          </div>
        )}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gridAutoFlow: 'dense',
          }}
        >
          {items.map((f: LandingFeature) => (
            <div
              key={f.id}
              className={`rounded-2xl overflow-hidden transition-shadow hover:shadow-lg ${spanClass(f.span || 'regular')}`}
              style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, minHeight: 160 }}
            >
              {cardMedia && <FeatureMedia icon={f.icon} image={f.image} alt={f.title} />}
              <div className="p-6">
                {!cardMedia && (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                       style={{ background: t.mutedPanel, color: t.accent }}>
                    <FeatureIcon icon={f.icon} image={f.image} alt={f.title} />
                  </div>
                )}
                <h3 className="text-lg font-semibold" style={{ color: t.ink }}>{f.title}</h3>
                {f.description && (
                  <p className="mt-2 leading-relaxed" style={{ color: t.mutedText }}>{f.description}</p>
                )}
                {f.linkText && f.linkUrl && (
                  <Link href={f.linkUrl} className="mt-3 inline-block text-sm font-semibold hover:underline"
                        style={{ color: t.accent }}>
                    {f.linkText} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
