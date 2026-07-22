/**
 * Storefront — Product-selling websites
 *
 * Full-bleed hero image with dark overlay, product grid, blog strip,
 * reviews as social proof. All static sections (features, pricing, stats,
 * testimonials, FAQ, logos, CTA).
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingPricingPlan, LandingFaqItem, LandingStatItem, LandingLogo } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, newTabProps, FeatureIcon, FeatureMedia, StarRating, type ModuleData, type Product, type Post, type Review } from './sections';
import {
  PressMentions, ComparisonTable, ReviewsAggregate, NewsletterSignup,
  BentoFeatures, IndustriesGrid, TeamGrid, ProcessTimeline,
} from './blocks';
import LayoutHero from './LayoutHero';
import LayoutCTA from './LayoutCTA';

export default function LandingPageLayoutStorefront({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topProducts = modules.products.slice(0, 6);
  const topPosts = modules.posts.slice(0, 3);
  const topReviews = modules.reviews.slice(0, 4);

  return (
    <main>
      {/* ── Hero — shared LayoutHero at "large" scale respects heroStyle. */}
      <LayoutHero page={page} scale="large" />

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      {page.statsEnabled && page.statItems.length > 0 && (
        <section className="py-14" style={{ background: t.panel, borderBottom: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            {page.statsHeading && <h2 className="text-center text-2xl font-bold mb-10" style={{ color: t.ink }}>{page.statsHeading}</h2>}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {page.statItems.map((s: LandingStatItem) => (
                <div data-lp-stat-item key={s.id}><dt className="text-4xl font-extrabold" style={{ color: t.accent }}>{s.value}</dt><dd className="mt-1 text-sm font-semibold uppercase tracking-wide" style={{ color: t.mutedText }}>{s.label}</dd></div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ── MODULE: Products grid ──────────────────────────────────────── */}
      {topProducts.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{page.productsSectionHeading || 'Our Products'}</h2>
              <Link href={page.productsSectionLinkUrl || '/products'} {...newTabProps(page.productsLinkNewTab)} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.productsSectionLinkText || 'View all →'}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProducts.map((p: Product) => {
                const img = resolveMediaUrl(p.coverImage);
                return (
                  <Link data-lp-product-card key={p.id} href={`/products/${p.slug}`} className="group rounded-2xl overflow-hidden transition-shadow hover:shadow-lg" style={{ border: `1px solid ${t.panelBorder}` }}>
                    {img && <div className="relative aspect-square bg-gray-50"><Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-5">
                      {p.category && <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: t.accent }}>{p.category.name}</p>}
                      <h3 className="font-semibold text-lg" style={{ color: t.ink }}>{p.title}</h3>
                      {p.price && <p className="mt-2 text-xl font-bold" style={{ color: t.accent }}>${p.price}{p.compareAtPrice && <span className="ml-2 text-sm line-through" style={{ color: t.mutedText }}>${p.compareAtPrice}</span>}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Features (bento layout switches to BentoFeatures component) ── */}
      {page.featuresEnabled && page.features.length > 0 && page.featuresLayout === 'bento' && (
        <BentoFeatures page={page} />
      )}
      {page.featuresEnabled && page.features.length > 0 && page.featuresLayout !== 'bento' && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-6xl mx-auto px-4">
            {(page.featuresHeading || page.featuresSubheading) && (
              <div className="text-center mb-14">
                {page.featuresHeading && <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: t.ink }}>{page.featuresHeading}</h2>}
                {page.featuresSubheading && <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: t.mutedText }}>{page.featuresSubheading}</p>}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.features.map((f: LandingFeature) => (
                <div data-lp-feature-card key={f.id} className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  {page.featuresMediaStyle === 'card' && <FeatureMedia icon={f.icon} image={f.image} alt={f.title} />}
                  <div className="p-6">
                    {page.featuresMediaStyle !== 'card' && <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: t.mutedPanel, color: t.accent }}><FeatureIcon icon={f.icon} image={f.image} alt={f.title} /></div>}
                    <h3 className="text-lg font-semibold" style={{ color: t.ink }}>{f.title}</h3>
                    <p className="mt-2 leading-relaxed" style={{ color: t.mutedText }}>{f.description}</p>
                    {f.linkText && f.linkUrl && <Link href={f.linkUrl} className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: t.accent }}>{f.linkText} →</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Industries / Process / Team (opt-in via flags) ─────────── */}
      <IndustriesGrid page={page} />
      <ProcessTimeline page={page} />

      {/* ── v2 — Reviews aggregate widget (before module reviews) ───────── */}
      <ReviewsAggregate page={page} modules={modules} />

      {/* ── MODULE: Reviews as social proof ─────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="py-16" style={{ background: t.panel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: t.ink }}>{page.reviewsSectionHeading || 'What People Are Saying'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topReviews.map((r: Review) => (
                <Link data-lp-review-card key={r.id} href={`/reviews/${r.slug}`} className="rounded-xl p-5 transition-shadow hover:shadow-md" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Number(r.rating ?? 0) ? '#facc15' : t.panelBorder }}>★</span>)}</div>
                  <h3 className="font-semibold text-sm" style={{ color: t.ink }}>{r.title}</h3>
                  <p className="mt-1 text-xs" style={{ color: t.mutedText }}>{r.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Press mentions strip ───────────────────────────────────── */}
      <PressMentions page={page} />

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      {page.testimonialsEnabled && page.testimonials.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-6xl mx-auto px-4">
            {page.testimonialsHeading && <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>{page.testimonialsHeading}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.testimonials.map((tm: LandingTestimonial) => {
                const av = resolveMediaUrl(tm.avatar);
                return (
                  <div data-lp-testimonial-card key={tm.id} className="rounded-2xl p-6 flex flex-col" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                    {tm.rating != null && <StarRating rating={tm.rating} />}
                    <blockquote className="mt-4 flex-1 italic leading-relaxed" style={{ color: t.ink, opacity: 0.85 }}>&ldquo;{tm.quote}&rdquo;</blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      {av ? <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div> : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: t.mutedPanel, color: t.accent }}>{tm.authorName.charAt(0)}</div>}
                      <div><p className="text-sm font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>{(tm.authorTitle || tm.authorCompany) && <p className="text-xs" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Comparison table (before pricing cards) ────────────────── */}
      <ComparisonTable page={page} />

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      {page.pricingEnabled && page.pricingPlans.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
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
                  {plan.features.length > 0 && <ul className="mt-6 flex flex-col gap-3 flex-1">{plan.features.map((f: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm" style={{ color: t.ink }}><span className="mt-0.5 font-bold flex-shrink-0" style={{ color: t.accent }}>✓</span>{f}</li>)}</ul>}
                  {plan.ctaText && <Link href={plan.ctaUrl || '#'} className="mt-8 block text-center px-6 py-3 rounded-xl font-semibold transition-colors" style={{ background: plan.isHighlighted ? t.accent : t.ink, color: t.panel }}>{plan.ctaText}</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Team grid ──────────────────────────────────────────────── */}
      <TeamGrid page={page} />

      {/* ── MODULE: Blog posts strip ───────────────────────────────────── */}
      {topPosts.length > 0 && (
        <section className="py-16" style={{ background: t.mutedPanel }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: t.ink }}>{page.blogSectionHeading || 'From Our Blog'}</h2>
              <Link href={page.blogSectionLinkUrl || '/blog'} {...newTabProps(page.blogLinkNewTab)} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.blogSectionLinkText || 'Read more →'}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {topPosts.map((post: Post) => {
                const img = resolveMediaUrl(post.coverImage);
                return (
                  <Link data-lp-post-card key={post.id} href={`/blog/${post.slug}`} className="group rounded-xl overflow-hidden" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                    {img && <div className="relative aspect-[16/9]"><Image src={img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div>}
                    <div className="p-4">
                      <h3 className="font-semibold" style={{ color: t.ink }}>{post.title}</h3>
                      {post.excerpt && <p className="mt-1 text-sm line-clamp-2" style={{ color: t.mutedText }}>{post.excerpt}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Newsletter (before FAQ) ────────────────────────────────── */}
      {page.newsletter?.enabled && <NewsletterSignup page={page} block={page.newsletter} />}

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      {page.faqEnabled && page.faqItems.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-3xl mx-auto px-4">
            {page.faqHeading && <h2 className="text-center text-3xl font-bold mb-10" style={{ color: t.ink }}>{page.faqHeading}</h2>}
            <div className="flex flex-col gap-3">
              {page.faqItems.map((q: LandingFaqItem) => (
                <details data-lp-faq-item key={q.id} className="group rounded-xl px-6 py-4 open:shadow-md transition-shadow" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                  <summary className="flex justify-between items-center cursor-pointer list-none font-semibold select-none" style={{ color: t.ink }}>{q.question}<span className="ml-4 group-open:rotate-180 transition-transform" style={{ color: t.mutedText }}>▾</span></summary>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: t.mutedText }}>{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Logo Bar ───────────────────────────────────────────────────── */}
      {page.logobarEnabled && page.logos.length > 0 && (
        <section className="py-12" style={{ background: t.mutedPanel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            {page.logobarHeading && <p className="text-center text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: t.mutedText }}>{page.logobarHeading}</p>}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {page.logos.map((logo: LandingLogo) => { const img = resolveMediaUrl(logo.image); const inner = img ? <div className="relative h-8 w-24"><Image src={img} alt={logo.name} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" /></div> : <span className="text-lg font-bold tracking-tight" style={{ color: t.mutedText }}>{logo.name}</span>; return logo.url ? <a key={logo.id} href={logo.url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={logo.id}>{inner}</div>; })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <LayoutCTA page={page} scale="regular" />
    </main>
  );
}
