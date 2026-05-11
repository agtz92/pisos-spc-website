import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityFaqAccordion({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="text-center">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && (
          <div className="mt-4 inline-flex flex-col items-center">
            <UtilitySubheading>{page.subheadline}</UtilitySubheading>
          </div>
        )}
      </header>

      {page.faqItems.length > 0 && (
        <ul className="mt-10 flex flex-col gap-3">
          {page.faqItems.map((item) => (
            <li key={item.id}>
              <details
                className="group"
                style={{
                  background: t.panel,
                  border: `1px solid ${t.panelBorder}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                <summary
                  className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 list-none"
                  style={{ color: t.ink, fontWeight: 700, fontSize: '1rem' }}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className="transition-transform group-open:rotate-45"
                    style={{
                      flexShrink: 0,
                      width: 26, height: 26, borderRadius: 999,
                      background: `color-mix(in srgb, ${t.accent} 14%, transparent)`,
                      color: t.accent, display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 600,
                    }}
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5" style={{ borderTop: `1px solid ${t.panelBorder}` }}>
                  <p className="pt-4" style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {item.answer}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}

      {page.ctaText && (
        <div className="mt-10 flex justify-center">
          <UtilityCta page={page} />
        </div>
      )}
    </article>
  );
}
