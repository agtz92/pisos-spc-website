/**
 * Macro — Everything is big.
 *
 * Full-viewport hero with background image and oversized headline overlay.
 * Floating pill navigation shows active modules at the bottom of the hero.
 * All subsequent sections use massive typography and generous spacing.
 * Features as a numbered list with giant numerals. Testimonials as
 * full-width quote blocks. Pricing cards with oversized price figures.
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingPricingPlan, LandingFaqItem, LandingLogo } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, FeatureIcon, StarRating, type ModuleData, type Post, type Review } from './sections';
import {
  ReviewsAggregate, PressMentions, NewsletterSignup, TeamGrid,
  ProductsGrid, pickBlock, CustomBlock,
} from './blocks';
import LayoutHero from './LayoutHero';

const MODULE_LABELS: Record<string, string> = {
  blog:       'Blog',
  recipes:    'Recipes',
  products:   'Products',
  realestate: 'Real Estate',
  reviews:    'Reviews',
};

const MODULE_HREFS: Record<string, string> = {
  blog:       '/blog',
  recipes:    '/recipes',
  products:   '/products',
  realestate: '/listings',
  reviews:    '/reviews',
};

export default function LandingPageLayoutMacro({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topPosts   = modules.posts.slice(0, 3);
  const topReviews = modules.reviews.slice(0, 3);

  // Pill nav items — only modules the tenant has active
  const pillNav = modules.activeModules
    .filter((m) => MODULE_LABELS[m])
    .map((m) => ({ label: MODULE_LABELS[m], href: MODULE_HREFS[m] }));

  return (
    <main>
      {/* ── HERO — shared LayoutHero at monumental scale, with opt-in pill nav. */}
      <LayoutHero page={page} scale="monumental">
        {page.macroPillNavEnabled && pillNav.length > 0 && (
          <nav
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1"
            style={{
              background: 'rgba(20,20,20,0.82)',
              backdropFilter: 'blur(12px)',
              borderRadius: '999px',
              padding: '6px 8px',
            }}
          >
            {pillNav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-white rounded-full transition-colors hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </LayoutHero>

      {/* ── v2 — Marquee + Manifesto (right after hero) ──────────────────── */}
      {(() => {
        const block = pickBlock(page.customBlocks, 'marquee');
        return block ? <CustomBlock block={block} /> : null;
      })()}
      {(() => {
        const block = pickBlock(page.customBlocks, 'manifesto');
        return block ? <CustomBlock block={block} /> : null;
      })()}

      {/* ── FEATURES: numbered, stacked, giant numerals ──────────────────── */}
      {page.featuresEnabled && page.features.length > 0 && (
        <section className="py-32" style={{ background: t.panel }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            {(page.featuresHeading || page.featuresSubheading) && (
              <div className="mb-20">
                {page.featuresHeading && (
                  <h2
                    className="font-black leading-[0.9] tracking-tight"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: t.ink }}
                  >
                    {page.featuresHeading}
                  </h2>
                )}
                {page.featuresSubheading && (
                  <p className="mt-4 text-xl max-w-2xl" style={{ color: t.mutedText }}>
                    {page.featuresSubheading}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col">
              {page.features.map((f: LandingFeature, idx: number) => {
                // When the editor uploaded an image OR picked an icon, we
                // hide the decorative big number and grow the visual into
                // the slot the number used to occupy. When neither is
                // present, keep the giant outline number as the visual.
                const hasVisual = !!(f.icon || f.image);
                return (
                  <div
                    key={f.id}
                    className="flex flex-col sm:flex-row items-start gap-8 py-12"
                    style={{ borderTop: `1px solid ${t.panelBorder}` }}
                  >
                    {/* Left slot — visual OR giant number, never both. */}
                    {hasVisual ? (
                      <div
                        className="flex items-center justify-center flex-shrink-0 rounded-2xl"
                        style={{
                          width: 'clamp(72px, 9vw, 112px)',
                          height: 'clamp(72px, 9vw, 112px)',
                          background: t.mutedPanel,
                          color: t.accent,
                        }}
                      >
                        <FeatureIcon
                          icon={f.icon}
                          image={f.image}
                          alt={f.title}
                          size={56}
                        />
                      </div>
                    ) : (
                      <span
                        className="font-black leading-none select-none flex-shrink-0 w-20 text-right"
                        style={{ fontSize: 'clamp(4rem, 7vw, 6rem)', color: t.panelBorder }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    )}
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3
                        className="font-bold text-2xl sm:text-3xl"
                        style={{ color: t.ink }}
                      >
                        {f.title}
                      </h3>
                      <p className="mt-3 text-lg leading-relaxed" style={{ color: t.mutedText }}>
                        {f.description}
                      </p>
                      {f.linkText && f.linkUrl && (
                        <Link
                          href={f.linkUrl}
                          className="mt-4 inline-block font-semibold text-sm uppercase tracking-widest hover:underline"
                          style={{ color: t.accent }}
                        >
                          {f.linkText} &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Products grid (opt-in) ──────────────────────────────────────── */}
      <ProductsGrid page={page} modules={modules} />

      {/* ── MODULE: Blog posts — two-column, large cards ─────────────────── */}
      {topPosts.length > 0 && (
        <section className="py-28" style={{ background: t.mutedPanel }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
              <h2
                className="font-black leading-[0.9] tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: t.ink }}
              >
                {page.blogSectionHeading || (<>Insights &amp;<br />Resources</>)}
              </h2>
              <Link
                href={page.blogSectionLinkUrl || '/blog'}
                className="font-semibold text-sm uppercase tracking-widest hover:underline flex-shrink-0"
                style={{ color: t.accent }}
              >
                {page.blogSectionLinkText || 'All articles →'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPosts.map((post: Post, idx: number) => {
                const img = resolveMediaUrl(post.coverImage);
                const isLarge = idx === 0;
                return (
                  <Link
                    data-lp-post-card
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`group rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-2xl ${isLarge ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                    style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}
                  >
                    {img && (
                      <div className={`relative overflow-hidden ${isLarge ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}>
                        <Image
                          src={img}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-7 flex-1 flex flex-col">
                      <h3
                        className={`font-bold leading-tight ${isLarge ? 'text-3xl' : 'text-xl'}`}
                        style={{ color: t.ink }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 leading-relaxed line-clamp-2" style={{ color: t.mutedText }}>
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials: full-width blockquotes, stacked ────────────────── */}
      {page.testimonialsEnabled && page.testimonials.length > 0 && (
        <section className="py-28" style={{ background: t.panel }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            {page.testimonialsHeading && (
              <h2
                className="font-black leading-[0.9] tracking-tight mb-16"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: t.ink }}
              >
                {page.testimonialsHeading}
              </h2>
            )}
            <div className="flex flex-col gap-0">
              {page.testimonials.map((tm: LandingTestimonial) => {
                const av = resolveMediaUrl(tm.avatar);
                return (
                  <div
                    data-lp-testimonial-card
                    key={tm.id}
                    className="py-14"
                    style={{ borderTop: `1px solid ${t.panelBorder}` }}
                  >
                    {tm.rating != null && (
                      <div className="mb-6">
                        <StarRating rating={tm.rating} />
                      </div>
                    )}
                    <blockquote
                      className="font-bold leading-[1.1] tracking-tight"
                      style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: t.ink }}
                    >
                      &ldquo;{tm.quote}&rdquo;
                    </blockquote>
                    <div className="mt-8 flex items-center gap-4">
                      {av ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={av} alt={tm.authorName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0"
                          style={{ background: t.mutedPanel, color: t.accent }}
                        >
                          {tm.authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg" style={{ color: t.ink }}>{tm.authorName}</p>
                        {(tm.authorTitle || tm.authorCompany) && (
                          <p className="text-sm" style={{ color: t.mutedText }}>
                            {[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Reviews aggregate widget + Team ─────────────────────────── */}
      <ReviewsAggregate page={page} modules={modules} />
      <TeamGrid page={page} />

      {/* ── MODULE: Reviews strip ─────────────────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            <h2
              className="font-black mb-12"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: t.ink }}
            >
              {page.reviewsSectionHeading || 'What Our Clients Say'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {topReviews.map((r: Review) => (
                <Link
                  data-lp-review-card
                  key={r.id}
                  href={`/reviews/${r.slug}`}
                  className="rounded-2xl p-7 transition-shadow hover:shadow-lg"
                  style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} style={{ color: n <= Number(r.rating ?? 0) ? '#facc15' : t.panelBorder }}>&#9733;</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-xl" style={{ color: t.ink }}>{r.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: t.mutedText }}>{r.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing: big numbers, stacked on mobile, row on desktop ─────── */}
      {page.pricingEnabled && page.pricingPlans.length > 0 && (
        <section className="py-28" style={{ background: t.panel }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            {(page.pricingHeading || page.pricingSubheading) && (
              <div className="mb-16">
                {page.pricingHeading && (
                  <h2
                    className="font-black leading-[0.9] tracking-tight"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: t.ink }}
                  >
                    {page.pricingHeading}
                  </h2>
                )}
                {page.pricingSubheading && (
                  <p className="mt-4 text-xl max-w-2xl" style={{ color: t.mutedText }}>
                    {page.pricingSubheading}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {page.pricingPlans.map((plan: LandingPricingPlan) => (
                <div
                  data-lp-pricing-card
                  key={plan.id}
                  className="relative rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6"
                  style={{
                    border: plan.isHighlighted ? `2px solid ${t.accent}` : `1px solid ${t.panelBorder}`,
                    background: plan.isHighlighted ? t.mutedPanel : t.panel,
                  }}
                >
                  {plan.badge && (
                    <span
                      data-lp-pricing-badge
                      className="absolute top-6 right-6 px-3 py-1 text-xs font-bold rounded-full"
                      style={{ background: t.accent, color: t.panel }}
                    >
                      {plan.badge}
                    </span>
                  )}
                  {/* Plan info */}
                  <div className="flex-1">
                    <h3 className="font-black text-2xl sm:text-3xl" style={{ color: t.ink }}>{plan.name}</h3>
                    {plan.description && (
                      <p className="mt-1 text-base" style={{ color: t.mutedText }}>{plan.description}</p>
                    )}
                    {plan.features.length > 0 && (
                      <ul className="mt-4 flex flex-col gap-2">
                        {plan.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm" style={{ color: t.ink }}>
                            <span className="font-bold flex-shrink-0" style={{ color: t.accent }}>&#10003;</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Price + CTA */}
                  <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-4">
                    <div>
                      {plan.monthlyPrice ? (
                        <>
                          <span
                            className="font-black leading-none"
                            style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: t.ink }}
                          >
                            {plan.monthlyPrice}
                          </span>
                          <span className="text-base ml-1" style={{ color: t.mutedText }}>/mo</span>
                        </>
                      ) : (
                        <span
                          className="font-black leading-none"
                          style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: t.ink }}
                        >
                          Free
                        </span>
                      )}
                    </div>
                    {plan.ctaText && (
                      <Link
                        href={plan.ctaUrl || '#'}
                        className="px-8 py-3.5 font-bold uppercase tracking-wider text-sm transition-opacity hover:opacity-90"
                        style={{
                          background: plan.isHighlighted ? t.accent : t.ink,
                          color: t.panel,
                        }}
                      >
                        {plan.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ: big question text, clean expand ─────────────────────────── */}
      {page.faqEnabled && page.faqItems.length > 0 && (
        <section className="py-28" style={{ background: t.mutedPanel }}>
          <div className="max-w-4xl mx-auto px-6 sm:px-12">
            {page.faqHeading && (
              <h2
                className="font-black leading-[0.9] tracking-tight mb-14"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: t.ink }}
              >
                {page.faqHeading}
              </h2>
            )}
            <div className="flex flex-col gap-0">
              {page.faqItems.map((q: LandingFaqItem) => (
                <details
                  data-lp-faq-item
                  key={q.id}
                  className="group py-8"
                  style={{ borderTop: `1px solid ${t.panelBorder}` }}
                >
                  <summary
                    className="flex justify-between items-start gap-6 cursor-pointer list-none select-none font-bold text-xl sm:text-2xl"
                    style={{ color: t.ink }}
                  >
                    <span>{q.question}</span>
                    <span className="mt-1 flex-shrink-0 group-open:rotate-45 transition-transform text-2xl" style={{ color: t.mutedText }}>+</span>
                  </summary>
                  <p className="mt-5 text-lg leading-relaxed" style={{ color: t.mutedText }}>{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Press mentions + Press kit (before Logo bar) ────────────── */}
      <PressMentions page={page} />
      {(() => {
        const block = pickBlock(page.customBlocks, 'press_kit');
        return block ? <CustomBlock block={block} /> : null;
      })()}

      {/* ── Logo Bar ─────────────────────────────────────────────────────── */}
      {page.logobarEnabled && page.logos.length > 0 && (
        <section className="py-16" style={{ background: t.panel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            {page.logobarHeading && (
              <p
                className="text-center text-xs font-bold uppercase tracking-[0.25em] mb-12"
                style={{ color: t.mutedText }}
              >
                {page.logobarHeading}
              </p>
            )}
            <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
              {page.logos.map((logo: LandingLogo) => {
                const img = resolveMediaUrl(logo.image);
                const inner = img ? (
                  <div className="relative h-10 w-28">
                    <Image src={img} alt={logo.name} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                  </div>
                ) : (
                  <span className="text-xl font-black tracking-tight" style={{ color: t.mutedText }}>{logo.name}</span>
                );
                return logo.url ? (
                  <a key={logo.id} href={logo.url} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <div key={logo.id}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Newsletter monumental (between logos and CTA) ───────────── */}
      {page.newsletter?.enabled && <NewsletterSignup page={page} block={page.newsletter} />}

      {/* ── CTA: full-bleed, massive text ──────────────────────────────────
          ``data-lp-on-dark`` is emitted when the background of this CTA
          is the template's ink or accent — both are dark colors that
          require light text. The active template's GlobalStyles handle
          the actual color tokens. */}
      {page.ctaEnabled && page.ctaHeading && (
        <section
          data-lp-on-dark={page.ctaStyle === 'dark' || page.ctaStyle === 'brand' ? '' : undefined}
          className="py-32 px-6"
          style={{
            background: page.ctaStyle === 'dark'  ? t.ink
                      : page.ctaStyle === 'brand' ? t.accent
                      : t.panel,
          }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2
              className="font-black leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              {page.ctaHeading}
            </h2>
            {page.ctaSubheading && (
              <p
                data-lp-subhead
                className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
              >
                {page.ctaSubheading}
              </p>
            )}
            {(page.ctaPrimaryText || page.ctaSecondaryText) && (
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {page.ctaPrimaryText && (
                  <Link
                    data-lp-primary-cta
                    href={page.ctaPrimaryUrl || '#'}
                    className="px-10 py-4 font-bold uppercase tracking-widest text-sm transition-opacity hover:opacity-90"
                    style={{ background: t.accent, color: t.panel }}
                  >
                    {page.ctaPrimaryText}
                  </Link>
                )}
                {page.ctaSecondaryText && (
                  <Link
                    data-lp-secondary-cta
                    href={page.ctaSecondaryUrl || '#'}
                    className="px-10 py-4 font-bold uppercase tracking-widest text-sm border-2 transition-colors"
                    style={{ borderColor: t.panelBorder, color: t.ink }}
                  >
                    {page.ctaSecondaryText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

    </main>
  );
}
