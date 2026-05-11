import { t, UtilityEyebrow, UtilityHeading, UtilityProse, extractTocFromBody, type UtilityLayoutProps } from './sections';

export default function UtilityLegalToc({ page }: UtilityLayoutProps) {
  const toc = extractTocFromBody(page.body);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl">
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.lastUpdatedLabel && (
          <p className="mt-4" style={{ color: t.mutedText, fontSize: '0.85rem', fontWeight: 600 }}>
            {page.lastUpdatedLabel}
          </p>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)]">
        {toc.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p
              style={{
                color: t.accent,
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              On this page
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {toc.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-1 no-underline"
                    style={{
                      color: t.ink,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderLeft: `2px solid ${t.panelBorder}`,
                      paddingLeft: '0.85rem',
                    }}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <div>
          <UtilityProse body={page.body} />
        </div>
      </div>
    </article>
  );
}
