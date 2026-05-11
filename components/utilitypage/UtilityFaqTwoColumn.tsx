import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, UtilityCta, type UtilityLayoutProps } from './sections';
import type { UtilityFaqItem } from '@/lib/graphql';

export default function UtilityFaqTwoColumn({ page }: UtilityLayoutProps) {
  // Group by category if any are set; otherwise use a single bucket.
  const groups = groupByCategory(page.faqItems);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && <div className="mt-4"><UtilitySubheading>{page.subheadline}</UtilitySubheading></div>}
      </header>

      {groups.length > 0 && (
        <div className="mt-12 flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.label}>
              {group.label && (
                <h2
                  style={{
                    color: t.accent,
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    marginBottom: '1.25rem',
                  }}
                >
                  {group.label}
                </h2>
              )}
              <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                {group.items.map((item) => (
                  <div key={item.id}>
                    <h3 style={{ color: t.ink, fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35 }}>
                      {item.question}
                    </h3>
                    <p className="mt-3" style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.7 }}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {page.ctaText && (
        <div className="mt-12">
          <UtilityCta page={page} />
        </div>
      )}
    </article>
  );
}

function groupByCategory(items: UtilityFaqItem[]): { label: string; items: UtilityFaqItem[] }[] {
  if (items.length === 0) return [];
  const map = new Map<string, UtilityFaqItem[]>();
  for (const item of items) {
    const key = item.category || '';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}
