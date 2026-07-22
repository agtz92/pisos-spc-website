/**
 * LayoutHero — shared hero implementation that respects ``page.heroStyle``.
 *
 * Every non-Links layout (Macro, Storefront, Services, Digital, Portfolio)
 * delegates its hero to this component. The "scale" prop controls
 * typography + container density so each layout keeps its visual
 * personality:
 *
 *   monumental → Macro      (clamp 3-7.5rem headline, full viewport height)
 *   large      → Storefront (clamp 2.5-4.5rem, min-h 520-620px)
 *   medium     → Services / Digital / Portfolio  (text-4xl/5xl/6xl, py-24)
 *   compact    → reserved for layouts that need a quieter hero
 *
 * heroStyle variants (applied uniformly across scales):
 *
 *   image_background → full-bleed image + dark gradient overlay + on-dark text
 *   video_background → MP4 / YouTube / Vimeo iframe in place of image
 *   centered         → solid template-ink panel + on-dark text
 *   split_left       → grid 2-col, image left · text right (light bg)
 *   split_right      → same as split_left, columns reversed
 *
 * Colors come from t.* tokens or the template's data-lp-on-dark contract.
 * No hex literals leak from this file.
 */
import Image from 'next/image';
import Link from 'next/link';
import { resolveMediaUrl, type LandingPage } from '@/lib/graphql';
import { t, newTabProps } from './sections';

export type HeroScale = 'monumental' | 'large' | 'medium' | 'compact';

interface ScaleStyles {
  minHeight: string;
  headlineFontSize: string;
  subheadlineClass: string;
  containerPaddingY: string;
  containerPaddingX: string;
}

const SCALES: Record<HeroScale, ScaleStyles> = {
  monumental: {
    minHeight: '100svh',
    headlineFontSize: 'clamp(3rem, 8vw, 7.5rem)',
    subheadlineClass: 'mt-6 text-lg sm:text-2xl font-light',
    containerPaddingY: 'py-0',
    containerPaddingX: 'px-6 sm:px-12',
  },
  large: {
    minHeight: '520px',
    headlineFontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    subheadlineClass: 'mt-5 text-lg sm:text-xl',
    containerPaddingY: 'py-24 lg:py-32',
    containerPaddingX: 'px-4',
  },
  medium: {
    minHeight: '420px',
    headlineFontSize: 'clamp(2rem, 4vw, 3.5rem)',
    subheadlineClass: 'mt-5 text-lg sm:text-xl',
    containerPaddingY: 'py-20 sm:py-24',
    containerPaddingX: 'px-4',
  },
  compact: {
    minHeight: '320px',
    headlineFontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
    subheadlineClass: 'mt-4 text-base sm:text-lg',
    containerPaddingY: 'py-16',
    containerPaddingX: 'px-4',
  },
};

function isYouTubeOrVimeo(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

export default function LayoutHero({
  page,
  scale = 'medium',
  children,
}: {
  page: LandingPage;
  scale?: HeroScale;
  /** Extra absolutely-positioned children rendered inside the hero
   *  section. Used by Macro for its opt-in pill nav. Living outside the
   *  section would break the floating-on-bottom positioning. */
  children?: React.ReactNode;
}) {
  if (!page.heroEnabled || !page.heroHeadline) return null;

  const heroImage = resolveMediaUrl(page.heroImage);
  const videoUrl = page.heroVideoUrl?.trim();
  // When the editor leaves heroStyle blank, choose the most fitting
  // default given what media is present.
  const resolvedStyle =
    page.heroStyle ||
    (videoUrl ? 'video_background' : heroImage ? 'image_background' : 'centered');

  const isSplit = resolvedStyle === 'split_left' || resolvedStyle === 'split_right';
  const isFullMedia =
    resolvedStyle === 'image_background' || resolvedStyle === 'video_background';
  // ``centered`` here means "no media, just a dark color panel" — still on dark.
  const onDark = isFullMedia || resolvedStyle === 'centered';

  const styles = SCALES[scale];

  // ── Text block (shared across all variants) ─────────────────────────────
  const textBlock = (
    <>
      {page.heroBadge && (
        <p
          data-lp-badge
          className="mb-5 text-sm font-semibold uppercase tracking-[0.25em]"
        >
          {page.heroBadge}
        </p>
      )}
      <h1
        className="font-black leading-[1.05] tracking-tight"
        style={{ fontSize: styles.headlineFontSize }}
      >
        {page.heroHeadline}
      </h1>
      {page.heroSubheadline && (
        <p
          data-lp-subhead
          className={`${styles.subheadlineClass} max-w-2xl leading-relaxed ${isSplit ? '' : 'mx-auto'}`}
        >
          {page.heroSubheadline}
        </p>
      )}
      {page.heroBody && (
        <p
          data-lp-body
          className={`mt-4 text-base leading-relaxed max-w-2xl ${isSplit ? '' : 'mx-auto'}`}
          style={onDark ? undefined : { color: t.mutedText }}
        >
          {page.heroBody}
        </p>
      )}
      {(page.heroPrimaryCtaText || page.heroSecondaryCtaText) && (
        <div className={`mt-10 flex flex-wrap gap-4 ${isSplit ? '' : 'justify-center'}`}>
          {page.heroPrimaryCtaText && (
            <Link
              data-lp-primary-cta
              {...newTabProps(page.heroPrimaryCtaNewTab)}
              href={page.heroPrimaryCtaUrl || '#'}
              className="px-8 py-3.5 font-bold uppercase tracking-widest text-sm rounded-xl transition-opacity hover:opacity-90"
              style={{ background: t.accent, color: t.panel }}
            >
              {page.heroPrimaryCtaText}
            </Link>
          )}
          {page.heroSecondaryCtaText && (
            <Link
              data-lp-secondary-cta
              {...newTabProps(page.heroSecondaryCtaNewTab)}
              href={page.heroSecondaryCtaUrl || '#'}
              className="px-8 py-3.5 font-bold uppercase tracking-widest text-sm border-2 rounded-xl transition-colors"
              style={{ borderColor: t.panelBorder, color: t.ink }}
            >
              {page.heroSecondaryCtaText}
            </Link>
          )}
        </div>
      )}
    </>
  );

  // ── Variant: split_left / split_right ────────────────────────────────────
  if (isSplit) {
    return (
      <section
        className="relative overflow-hidden"
        style={{ minHeight: styles.minHeight, background: t.panel }}
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 ${
            resolvedStyle === 'split_right' ? 'lg:[direction:rtl]' : ''
          }`}
          style={{ minHeight: styles.minHeight }}
        >
          <div
            className="relative"
            style={{
              background: heroImage ? 'transparent' : t.mutedPanel,
              minHeight: '40svh',
            }}
          >
            {heroImage && (
              <Image
                src={heroImage}
                alt={page.heroHeadline}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
          <div
            className={`flex flex-col justify-center max-w-2xl mx-auto lg:mx-0 ${styles.containerPaddingX} ${styles.containerPaddingY}`}
            style={{ direction: 'ltr' }}
          >
            {textBlock}
          </div>
        </div>
        {children}
      </section>
    );
  }

  // ── Variant: centered (no media) ─────────────────────────────────────────
  if (resolvedStyle === 'centered') {
    return (
      <section
        data-lp-on-dark
        className={`relative flex flex-col items-center justify-center overflow-hidden ${styles.containerPaddingY}`}
        style={{ minHeight: styles.minHeight, background: t.ink }}
      >
        <div
          className={`relative z-10 text-center max-w-6xl mx-auto ${styles.containerPaddingX}`}
        >
          {textBlock}
        </div>
        {children}
      </section>
    );
  }

  // ── Variant: image_background / video_background (default with media) ────
  return (
    <section
      data-lp-on-dark
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: styles.minHeight }}
    >
      {resolvedStyle === 'video_background' && videoUrl ? (
        isYouTubeOrVimeo(videoUrl) ? (
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            title="Hero background video"
            style={{ border: 0 }}
          />
        ) : (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : heroImage ? (
        <Image
          src={heroImage}
          alt={page.heroHeadline}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0" style={{ background: t.ink }} />
      )}
      {/* Dark gradient overlay so headline stays legible on busy images. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.42) 60%, rgba(0,0,0,0.68) 100%)',
        }}
      />
      <div
        className={`relative z-10 text-center max-w-6xl mx-auto ${styles.containerPaddingY} ${styles.containerPaddingX}`}
      >
        {textBlock}
      </div>
      {children}
    </section>
  );
}
