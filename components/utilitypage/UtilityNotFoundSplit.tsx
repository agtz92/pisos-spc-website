import Image from 'next/image';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/graphql';
import { t, UtilityCta, type UtilityLayoutProps } from './sections';

export default function UtilityNotFoundSplit({ page }: UtilityLayoutProps) {
  const heroUrl = resolveMediaUrl(page.heroImage);
  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p
            style={{
              color: t.accent,
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Error 404
          </p>
          <h1
            className="mt-3"
            style={{
              color: t.ink,
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            {page.headline || 'This page got lost.'}
          </h1>
          {page.subheadline && (
            <p
              className="mt-4"
              style={{
                color: t.mutedText,
                fontSize: '1.05rem',
                lineHeight: 1.65,
                maxWidth: '46ch',
              }}
            >
              {page.subheadline}
            </p>
          )}
          {page.body && (
            <p
              className="mt-3 whitespace-pre-line"
              style={{ color: t.mutedText, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '52ch' }}
            >
              {page.body}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
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
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '4 / 3',
            borderRadius: 22,
            border: `1px solid ${t.panelBorder}`,
            background: t.mutedPanel,
          }}
        >
          {heroUrl ? (
            <Image src={heroUrl} alt="" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                aria-hidden
                style={{
                  color: t.accent,
                  fontSize: 'clamp(8rem, 22vw, 16rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.85,
                  opacity: 0.18,
                }}
              >
                404
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
