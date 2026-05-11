import { t, UtilityEyebrow, UtilityHeading, UtilityProse, type UtilityLayoutProps } from './sections';

export default function UtilityLegalSingle({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        {page.eyebrow && <UtilityEyebrow>{page.eyebrow}</UtilityEyebrow>}
        <div className="mt-3"><UtilityHeading>{page.headline || page.title}</UtilityHeading></div>
        {page.lastUpdatedLabel && (
          <p className="mt-4" style={{ color: t.mutedText, fontSize: '0.85rem', fontWeight: 600 }}>
            {page.lastUpdatedLabel}
          </p>
        )}
      </header>

      <div className="mt-8" style={{ borderTop: `1px solid ${t.panelBorder}` }} />

      <div className="mt-8">
        <UtilityProse body={page.body} />
      </div>
    </article>
  );
}
