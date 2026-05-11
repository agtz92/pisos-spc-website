import { t, UtilityProse, type UtilityLayoutProps } from './sections';

export default function UtilityLegalCompact({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header
        className="flex items-center justify-between gap-4 pb-4"
        style={{ borderBottom: `1px solid ${t.panelBorder}` }}
      >
        <h1
          style={{
            color: t.ink,
            fontSize: '1.6rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {page.headline || page.title}
        </h1>
        {page.lastUpdatedLabel && (
          <p style={{ color: t.mutedText, fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {page.lastUpdatedLabel}
          </p>
        )}
      </header>

      <div
        className="mt-6"
        style={{
          fontSize: '0.94rem',
          lineHeight: 1.65,
        }}
      >
        <UtilityProse body={page.body} />
      </div>
    </article>
  );
}
