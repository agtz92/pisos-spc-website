import Link from 'next/link';
import { t, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityNotFoundCentered({ page }: UtilityLayoutProps) {
  return (
    <article className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p
        style={{
          color: t.accent,
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          lineHeight: 0.9,
        }}
      >
        404
      </p>
      <h1
        className="mt-4"
        style={{
          color: t.ink,
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        {page.headline || 'Page not found'}
      </h1>
      {page.subheadline && (
        <p
          className="mt-3"
          style={{
            color: t.mutedText,
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '40ch',
          }}
        >
          {page.subheadline}
        </p>
      )}
      {page.body && (
        <p
          className="mt-3 whitespace-pre-line"
          style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '46ch' }}
        >
          {page.body}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <UtilityCta page={page} />
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 no-underline"
          style={{
            background: t.panel,
            color: t.ink,
            border: `1px solid ${t.panelBorder}`,
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Back home
        </Link>
      </div>
    </article>
  );
}
