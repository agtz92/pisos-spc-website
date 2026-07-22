/**
 * LayoutCTA — shared closing-CTA section that respects ``page.ctaStyle``.
 *
 * Every non-Links layout (Storefront, Services, Digital, Portfolio, Macro)
 * delegates its bottom CTA section to this component. Two reasons:
 *
 *   1. Each layout used to roll its own CTA with hardcoded ``#fff`` / rgba
 *      values, which collided with the multi-template color system on dark
 *      backgrounds (the secondary CTA went near-invisible on the Modern
 *      cool-gray panel — see Sombrealo report).
 *   2. The ``data-lp-on-dark`` contract already exists for heroes; reusing
 *      it on the CTA section means the same template overrides apply.
 *
 * The "scale" prop controls headline typography only:
 *
 *   monumental → Macro (clamp 3rem-6rem headline)
 *   regular    → Storefront / Services / Digital / Portfolio
 *
 * ``ctaStyle`` decisions:
 *
 *   default | (unset)  → background = t.panel, on-light text via t.* tokens
 *   dark              → background = t.ink, on-dark contract applies
 *   brand             → background = t.accent, on-dark contract applies
 *                        (accents are typically saturated enough that
 *                         light foreground reads correctly; if a tenant
 *                         picks a pastel accent this is the only mode
 *                         where you might want a custom override later)
 *
 * Layouts can pass an optional ``footnote`` string rendered below the CTAs
 * (used by Digital for "Cancel anytime. No questions asked.").
 */
import Link from 'next/link';
import { type LandingPage } from '@/lib/graphql';
import { t, newTabProps } from './sections';

export type CTAScale = 'monumental' | 'regular';

interface ScaleStyles {
  sectionPaddingY: string;
  containerPaddingX: string;
  headlineClass: string;
  headlineFontSize?: string;  // monumental uses inline clamp()
  subheadingClass: string;
}

const SCALES: Record<CTAScale, ScaleStyles> = {
  monumental: {
    sectionPaddingY: 'py-32',
    containerPaddingX: 'px-6',
    headlineClass: 'font-black leading-[0.9] tracking-tight',
    headlineFontSize: 'clamp(3rem, 7vw, 6rem)',
    subheadingClass: 'mt-6 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed',
  },
  regular: {
    sectionPaddingY: 'py-20',
    containerPaddingX: 'px-4',
    headlineClass: 'text-3xl sm:text-4xl font-bold',
    subheadingClass: 'mt-4 text-lg',
  },
};

export default function LayoutCTA({
  page,
  scale = 'regular',
  footnote,
}: {
  page: LandingPage;
  scale?: CTAScale;
  footnote?: string;
}) {
  if (!page.ctaEnabled || !page.ctaHeading) return null;

  const onDark = page.ctaStyle === 'dark' || page.ctaStyle === 'brand';
  const bg =
    page.ctaStyle === 'dark'
      ? t.ink
      : page.ctaStyle === 'brand'
        ? t.accent
        : t.panel;

  const styles = SCALES[scale];

  return (
    <section
      {...(onDark ? { 'data-lp-on-dark': '' } : {})}
      className={`${styles.sectionPaddingY} ${styles.containerPaddingX}`}
      style={{ background: bg }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className={styles.headlineClass}
          style={styles.headlineFontSize ? { fontSize: styles.headlineFontSize } : undefined}
        >
          {page.ctaHeading}
        </h2>
        {page.ctaSubheading && (
          <p
            data-lp-subhead
            className={styles.subheadingClass}
            style={onDark ? undefined : { color: t.mutedText }}
          >
            {page.ctaSubheading}
          </p>
        )}
        {(page.ctaPrimaryText || page.ctaSecondaryText) && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-4">
              {page.ctaPrimaryText && (
                <Link
                  data-lp-primary-cta
                  {...newTabProps(page.ctaPrimaryNewTab)}
                  href={page.ctaPrimaryUrl || '#'}
                  className="px-8 py-3 rounded-xl font-semibold shadow transition-opacity hover:opacity-90"
                  style={onDark ? undefined : { background: t.accent, color: t.panel }}
                >
                  {page.ctaPrimaryText}
                </Link>
              )}
              {page.ctaSecondaryText && (
                <Link
                  data-lp-secondary-cta
                  {...newTabProps(page.ctaSecondaryNewTab)}
                  href={page.ctaSecondaryUrl || '#'}
                  className="px-8 py-3 rounded-xl font-semibold border-2 transition-colors"
                  style={
                    onDark
                      ? undefined
                      : { borderColor: t.panelBorder, color: t.ink }
                  }
                >
                  {page.ctaSecondaryText}
                </Link>
              )}
            </div>
            {footnote && (
              <p
                data-lp-body
                className="text-xs mt-1"
                style={onDark ? { opacity: 0.7 } : { color: t.mutedText }}
              >
                {footnote}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
