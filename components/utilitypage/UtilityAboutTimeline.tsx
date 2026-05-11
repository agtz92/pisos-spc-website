import { t, UtilityEyebrow, UtilityHeading, UtilitySubheading, UtilityProse, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityAboutTimeline({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.subheadline && <div className="mt-4"><UtilitySubheading>{page.subheadline}</UtilitySubheading></div>}
      </header>

      {page.body && (
        <div className="mt-10 max-w-3xl">
          <UtilityProse body={page.body} />
        </div>
      )}

      {page.timelineMilestones.length > 0 && (
        <section className="mt-14">
          <p
            style={{
              color: t.accent,
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Milestones
          </p>
          <ol className="mt-6 grid gap-0">
            {page.timelineMilestones.map((m, idx) => {
              const last = idx === page.timelineMilestones.length - 1;
              return (
                <li key={m.id} className="grid grid-cols-[120px_minmax(0,1fr)] gap-6">
                  <div className="relative pt-2 text-right">
                    <span
                      style={{
                        color: t.accent,
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {m.year}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        right: -7,
                        top: 12,
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: t.accent,
                        boxShadow: `0 0 0 4px ${t.panel}, 0 0 0 5px ${t.panelBorder}`,
                      }}
                    />
                  </div>
                  <div
                    className={last ? 'pb-2' : 'pb-10'}
                    style={{ borderLeft: `1px solid ${t.panelBorder}`, paddingLeft: '1.75rem' }}
                  >
                    <h3 style={{ color: t.ink, fontSize: '1.1rem', fontWeight: 700 }}>{m.title}</h3>
                    {m.description && (
                      <p className="mt-2" style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.65 }}>
                        {m.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {page.ctaText && (
        <div className="mt-12">
          <UtilityCta page={page} />
        </div>
      )}
    </article>
  );
}
