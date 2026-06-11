/**
 * Services — Agencies, consultants, service businesses
 *
 * Split hero (text left, image right), alternating service offerings,
 * blog posts as authority content, testimonials, reviews strip,
 * pricing tiers, FAQ accordion, client logos, CTA block.
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingPricingPlan, LandingFaqItem, LandingLogo } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, FeatureIcon, StarRating, type ModuleData, type Post, type Review } from './sections';
import {
  StickySectionNav, ProcessTimeline, IndustriesGrid, TeamGrid,
  PressMentions, ComparisonTable, ReviewsAggregate, NewsletterSignup,
  ContactFormInline, ProductsGrid,
} from './blocks';
import LayoutHero from './LayoutHero';
import LayoutCTA from './LayoutCTA';

export default function LandingPageLayoutServices({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topPosts = modules.posts.slice(0, 3);
  const topReviews = modules.reviews.slice(0, 3);

  return (
    <main>
      {/* ── Phase 6 — Sticky section nav (only renders when enabled) ───── */}
      <StickySectionNav page={page} />

      {/* ── Hero — shared LayoutHero at "medium" scale respects heroStyle. */}
      <LayoutHero page={page} scale="medium" />

      {/* ── Features as service offerings: alternating rows ────────────── */}
      {page.featuresEnabled && page.features.length > 0 && (
        <section id="services" className="py-20" style={{ background: t.panel }}>
          <div className="max-w-6xl mx-auto px-4">
            {(page.featuresHeading || page.featuresSubheading) && (
              <div className="text-center mb-16">
                {page.featuresHeading && <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: t.ink }}>{page.featuresHeading}</h2>}
                {page.featuresSubheading && <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: t.mutedText }}>{page.featuresSubheading}</p>}
              </div>
            )}
            <div className="flex flex-col gap-16">
              {page.features.map((f: LandingFeature, idx: number) => {
                const isReversed = idx % 2 === 1;
                return (
                  <div key={f.id} className={`flex flex-col lg:flex-row items-center gap-10 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: t.mutedPanel, color: t.accent }}>
                      <FeatureIcon icon={f.icon} image={f.image} alt={f.title} size={36} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold" style={{ color: t.ink }}>{f.title}</h3>
                      <p className="mt-2 leading-relaxed" style={{ color: t.mutedText }}>{f.description}</p>
                      {f.linkText && f.linkUrl && <Link href={f.linkUrl} className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: t.accent }}>{f.linkText} &rarr;</Link>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Phase 6 — Process timeline + Industries (between Features and Blog) ── */}
      <section id="process"><ProcessTimeline page={page} /></section>
      <IndustriesGrid page={page} />

      {/* ── Products section (generic — Storefront/Digital use their own) ── */}
      <ProductsGrid page={page} modules={modules} />

      {/* ── MODULE: Blog posts — Insights & Resources ─────────────────── */}
      {topPosts.length > 0 && (
        <section id="cases" className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{page.blogSectionHeading || 'Insights & Resources'}</h2>
              <Link href={page.blogSectionLinkUrl || '/blog'} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.blogSectionLinkText || 'View all →'}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {topPosts.map((post: Post) => {
                const img = resolveMediaUrl(post.coverImage);
                return (
                  <Link data-lp-post-card key={post.id} href={`/blog/${post.slug}`} className="group rounded-xl overflow-hidden transition-shadow hover:shadow-lg" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                    {img && <div className="relative aspect-[16/9]"><Image src={img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg" style={{ color: t.ink }}>{post.title}</h3>
                      {post.excerpt && <p className="mt-2 text-sm line-clamp-2" style={{ color: t.mutedText }}>{post.excerpt}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Phase 6 — Team grid (between Blog and Testimonials) ────────── */}
      <TeamGrid page={page} />

      {/* ── v2 — Press mentions strip ───────────────────────────────────── */}
      <PressMentions page={page} />

      {/* ── v2 — Reviews aggregate widget ───────────────────────────────── */}
      <ReviewsAggregate page={page} modules={modules} />

      {/* ── Testimonials: large quote cards, 2-column grid ────────────── */}
      {page.testimonialsEnabled && page.testimonials.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-6xl mx-auto px-4">
            {page.testimonialsHeading && <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>{page.testimonialsHeading}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {page.testimonials.map((tm: LandingTestimonial) => {
                const av = resolveMediaUrl(tm.avatar);
                return (
                  <div data-lp-testimonial-card key={tm.id} className="rounded-2xl p-8 flex flex-col" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                    {tm.rating != null && <StarRating rating={tm.rating} />}
                    <blockquote className="mt-4 flex-1 text-lg italic leading-relaxed" style={{ color: t.ink, opacity: 0.85 }}>&ldquo;{tm.quote}&rdquo;</blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      {av ? <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div> : <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: t.panel, color: t.accent }}>{tm.authorName.charAt(0)}</div>}
                      <div><p className="font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>{(tm.authorTitle || tm.authorCompany) && <p className="text-sm" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── MODULE: Reviews strip ─────────────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="py-16" style={{ background: t.mutedPanel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: t.ink }}>{page.reviewsSectionHeading || 'What Our Clients Say'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {topReviews.map((r: Review) => (
                <Link data-lp-review-card key={r.id} href={`/reviews/${r.slug}`} className="rounded-xl p-5 transition-shadow hover:shadow-md" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Number(r.rating ?? 0) ? '#facc15' : t.panelBorder }}>&#9733;</span>)}</div>
                  <h3 className="font-semibold text-sm" style={{ color: t.ink }}>{r.title}</h3>
                  <p className="mt-1 text-xs" style={{ color: t.mutedText }}>{r.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Comparison table (before pricing) ──────────────────────── */}
      <ComparisonTable page={page} />

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      {page.pricingEnabled && page.pricingPlans.length > 0 && (
        <section id="pricing" className="py-20" style={{ background: t.panel }}>
          <div className="max-w-6xl mx-auto px-4">
            {(page.pricingHeading || page.pricingSubheading) && (
              <div className="text-center mb-14">
                {page.pricingHeading && <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{page.pricingHeading}</h2>}
                {page.pricingSubheading && <p className="mt-3 text-lg" style={{ color: t.mutedText }}>{page.pricingSubheading}</p>}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {page.pricingPlans.map((plan: LandingPricingPlan) => (
                <div data-lp-pricing-card key={plan.id} className="relative rounded-2xl p-8 flex flex-col" style={{ border: plan.isHighlighted ? `2px solid ${t.accent}` : `2px solid ${t.panelBorder}`, background: plan.isHighlighted ? t.mutedPanel : t.panel, boxShadow: plan.isHighlighted ? '0 8px 32px rgba(0,0,0,0.1)' : 'none' }}>
                  {plan.badge && <span data-lp-pricing-badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full whitespace-nowrap" style={{ background: t.accent, color: t.panel }}>{plan.badge}</span>}
                  <h3 className="text-xl font-bold" style={{ color: t.ink }}>{plan.name}</h3>
                  {plan.description && <p className="mt-1 text-sm" style={{ color: t.mutedText }}>{plan.description}</p>}
                  <div className="mt-6">{plan.monthlyPrice ? <><span className="text-4xl font-extrabold" style={{ color: t.ink }}>{plan.monthlyPrice}</span><span className="text-sm" style={{ color: t.mutedText }}>/mo</span></> : <span className="text-3xl font-extrabold" style={{ color: t.ink }}>Free</span>}</div>
                  {plan.features.length > 0 && <ul className="mt-6 flex flex-col gap-3 flex-1">{plan.features.map((f: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm" style={{ color: t.ink }}><span className="mt-0.5 font-bold flex-shrink-0" style={{ color: t.accent }}>&#10003;</span>{f}</li>)}</ul>}
                  {plan.ctaText && <Link href={plan.ctaUrl || '#'} className="mt-8 block text-center px-6 py-3 rounded-xl font-semibold transition-colors" style={{ background: plan.isHighlighted ? t.accent : t.ink, color: t.panel }}>{plan.ctaText}</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      {page.faqEnabled && page.faqItems.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-3xl mx-auto px-4">
            {page.faqHeading && <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>{page.faqHeading}</h2>}
            <div className="flex flex-col gap-3">
              {page.faqItems.map((q: LandingFaqItem) => (
                <details data-lp-faq-item key={q.id} className="group rounded-xl px-6 py-4 open:shadow-md transition-shadow" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  <summary className="flex justify-between items-center cursor-pointer list-none font-semibold select-none" style={{ color: t.ink }}>{q.question}<span className="ml-4 group-open:rotate-180 transition-transform" style={{ color: t.mutedText }}>&blacktriangledown;</span></summary>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: t.mutedText }}>{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Logo Bar ──────────────────────────────────────────────────── */}
      {page.logobarEnabled && page.logos.length > 0 && (
        <section className="py-12" style={{ background: t.panel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            {page.logobarHeading && <p className="text-center text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: t.mutedText }}>{page.logobarHeading}</p>}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {page.logos.map((logo: LandingLogo) => { const img = resolveMediaUrl(logo.image); const inner = img ? <div className="relative h-8 w-24"><Image src={img} alt={logo.name} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" /></div> : <span className="text-lg font-bold tracking-tight" style={{ color: t.mutedText }}>{logo.name}</span>; return logo.url ? <a key={logo.id} href={logo.url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={logo.id}>{inner}</div>; })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Contact form + Newsletter (before CTA) ─────────────────── */}
      <ContactFormInline page={page} />
      {page.newsletter?.enabled && <NewsletterSignup page={page} block={page.newsletter} />}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <LayoutCTA page={page} scale="regular" />
    </main>
  );
}
