/**
 * Digital — Online courses, PDFs, digital products
 *
 * Split hero (text left, mockup right), inline trust badges,
 * horizontal curriculum-style product cards, numbered feature modules,
 * testimonial spotlight, blog resources, reviews, pricing, FAQ, CTA.
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingPricingPlan, LandingFaqItem, LandingStatItem } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, StarRating, type ModuleData, type Product, type Post, type Review } from './sections';
import {
  Outcomes, BonusStack, ProcessTimeline, ReviewsAggregate,
  PressMentions, NewsletterSignup,
} from './blocks';
import { pickBlock, CustomBlock } from './blocks';
import LayoutHero from './LayoutHero';
import LayoutCTA from './LayoutCTA';

export default function LandingPageLayoutDigital({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topProducts = modules.products.slice(0, 6);
  const topPosts = modules.posts.slice(0, 3);
  const topReviews = modules.reviews.slice(0, 3);

  return (
    <main>
      {/* ── Hero — shared LayoutHero at "medium" scale respects heroStyle. */}
      <LayoutHero page={page} scale="medium" />

      {/* ── v2 — "What you'll learn" outcomes (right after hero) ────────── */}
      <Outcomes page={page} />

      {/* ── MODULE: Products as horizontal curriculum cards ───────────── */}
      {topProducts.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold" style={{ color: t.ink }}>What You&apos;ll Get</h2>
              <p className="mt-2 text-base" style={{ color: t.mutedText }}>Everything included in your access</p>
            </div>
            <div className="flex flex-col gap-4">
              {topProducts.map((p: Product, idx: number) => {
                const img = resolveMediaUrl(p.coverImage);
                return (
                  <Link data-lp-product-card key={p.id} href={`/products/${p.slug}`} className="group flex items-center gap-5 rounded-2xl p-4 transition-all hover:shadow-lg" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                    {/* Number badge */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0" style={{ background: `color-mix(in srgb, ${t.accent} 12%, transparent)`, color: t.accent }}>
                      {idx + 1}
                    </div>
                    {/* Thumbnail */}
                    {img && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {p.category && <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: t.accent }}>{p.category.name}</p>}
                      <h3 className="font-semibold text-base truncate" style={{ color: t.ink }}>{p.title}</h3>
                      {p.description && <p className="text-sm truncate" style={{ color: t.mutedText }}>{p.description}</p>}
                    </div>
                    {/* Price */}
                    {p.price && (
                      <div className="flex-shrink-0 text-right">
                        <span className="text-lg font-bold" style={{ color: t.accent }}>${p.price}</span>
                        {p.compareAtPrice && <span className="block text-xs line-through" style={{ color: t.mutedText }}>${p.compareAtPrice}</span>}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link href={page.productsSectionLinkUrl || '/products'} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.productsSectionLinkText || 'Browse all resources →'}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Process timeline (between products and features) ───────── */}
      <ProcessTimeline page={page} />

      {/* ── Features: numbered modules ─────────────────────────────────── */}
      {page.featuresEnabled && page.features.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-5xl mx-auto px-4">
            {(page.featuresHeading || page.featuresSubheading) && (
              <div className="text-center mb-14">
                {page.featuresHeading && <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: t.ink }}>{page.featuresHeading}</h2>}
                {page.featuresSubheading && <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: t.mutedText }}>{page.featuresSubheading}</p>}
              </div>
            )}
            <div className="flex flex-col gap-6">
              {page.features.map((f: LandingFeature, idx: number) => (
                <div data-lp-feature-card key={f.id} className="flex items-start gap-5 p-6 rounded-2xl" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold flex-shrink-0" style={{ background: t.accent, color: '#fff' }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: t.ink }}>{f.title}</h3>
                    {f.description && <p className="mt-1.5 leading-relaxed" style={{ color: t.mutedText }}>{f.description}</p>}
                    {f.linkText && f.linkUrl && <Link href={f.linkUrl} className="mt-2 inline-block text-sm font-semibold hover:underline" style={{ color: t.accent }}>{f.linkText} →</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Sample video (try a free lesson) ───────────────────────── */}
      {(() => {
        const block = pickBlock(page.customBlocks, 'sample_video');
        return block ? <CustomBlock block={block} /> : null;
      })()}

      {/* ── Testimonials: spotlight cards ──────────────────────────────── */}
      {page.testimonialsEnabled && page.testimonials.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-5xl mx-auto px-4">
            {page.testimonialsHeading && <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>{page.testimonialsHeading}</h2>}
            {/* First testimonial as a large spotlight */}
            {page.testimonials.length > 0 && (() => {
              const tm = page.testimonials[0];
              const av = resolveMediaUrl(tm.avatar);
              return (
                <div data-lp-testimonial-card className="rounded-2xl p-8 mb-8 text-center" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                  {tm.rating != null && <div className="flex justify-center mb-3"><StarRating rating={tm.rating} /></div>}
                  <blockquote className="text-xl sm:text-2xl italic leading-relaxed max-w-3xl mx-auto" style={{ color: t.ink }}>&ldquo;{tm.quote}&rdquo;</blockquote>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    {av ? <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div> : <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: t.panel, color: t.accent }}>{tm.authorName.charAt(0)}</div>}
                    <div className="text-left">
                      <p className="font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>
                      {(tm.authorTitle || tm.authorCompany) && <p className="text-xs" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* Remaining testimonials in a grid */}
            {page.testimonials.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {page.testimonials.slice(1).map((tm: LandingTestimonial) => {
                  const av = resolveMediaUrl(tm.avatar);
                  return (
                    <div data-lp-testimonial-card key={tm.id} className="rounded-2xl p-6 flex flex-col" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                      {tm.rating != null && <StarRating rating={tm.rating} />}
                      <blockquote className="mt-3 flex-1 italic leading-relaxed" style={{ color: t.ink, opacity: 0.85 }}>&ldquo;{tm.quote}&rdquo;</blockquote>
                      <div className="mt-5 flex items-center gap-3">
                        {av ? <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div> : <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: t.panel, color: t.accent }}>{tm.authorName.charAt(0)}</div>}
                        <div><p className="text-sm font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>{(tm.authorTitle || tm.authorCompany) && <p className="text-xs" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── MODULE: Blog — "Free Resources" ────────────────────────────── */}
      {topPosts.length > 0 && (
        <section className="py-16" style={{ background: t.mutedPanel }}>
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: t.ink }}>{page.blogSectionHeading || 'Free Resources'}</h2>
              <Link href={page.blogSectionLinkUrl || '/blog'} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.blogSectionLinkText || 'View all →'}</Link>
            </div>
            {/* Horizontal blog cards */}
            <div className="flex flex-col gap-4">
              {topPosts.map((post: Post) => {
                const img = resolveMediaUrl(post.coverImage);
                return (
                  <Link data-lp-post-card key={post.id} href={`/blog/${post.slug}`} className="group flex items-center gap-5 rounded-xl p-3 transition-shadow hover:shadow-md" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                    {img && <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"><Image src={img} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" /></div>}
                    <div className="flex-1 min-w-0">
                      {post.category && <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: t.accent }}>{post.category.name}</p>}
                      <h3 className="font-semibold truncate" style={{ color: t.ink }}>{post.title}</h3>
                      {post.excerpt && <p className="mt-0.5 text-sm line-clamp-1" style={{ color: t.mutedText }}>{post.excerpt}</p>}
                    </div>
                    <span className="flex-shrink-0 text-sm font-semibold" style={{ color: t.accent }}>Read →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Reviews aggregate widget ───────────────────────────────── */}
      <ReviewsAggregate page={page} modules={modules} />

      {/* ── MODULE: Reviews ──────────────────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="py-16" style={{ background: t.panel, borderTop: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: t.ink }}>{page.reviewsSectionHeading || 'What Students Say'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

      {/* ── v2 — Press mentions + Bonus stack (before pricing) ──────────── */}
      <PressMentions page={page} />
      <BonusStack page={page} />

      {/* ── v2 — Guarantee badge ─────────────────────────────────────────── */}
      {(() => {
        const block = pickBlock(page.customBlocks, 'guarantee');
        return block ? <CustomBlock block={block} /> : null;
      })()}

      {/* ── Pricing: emphasized ─────────────────────────────────────────── */}
      {page.pricingEnabled && page.pricingPlans.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-5xl mx-auto px-4">
            {(page.pricingHeading || page.pricingSubheading) && (
              <div className="text-center mb-14">
                {page.pricingHeading && <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{page.pricingHeading}</h2>}
                {page.pricingSubheading && <p className="mt-3 text-lg" style={{ color: t.mutedText }}>{page.pricingSubheading}</p>}
              </div>
            )}
            <div className={`grid gap-8 items-start ${page.pricingPlans.length === 1 ? 'max-w-md mx-auto' : page.pricingPlans.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {page.pricingPlans.map((plan: LandingPricingPlan) => (
                <div data-lp-pricing-card key={plan.id} className={`relative rounded-2xl p-8 flex flex-col ${plan.isHighlighted ? 'sm:-mt-4 sm:mb-[-1rem]' : ''}`} style={{ border: plan.isHighlighted ? `2px solid ${t.accent}` : `2px solid ${t.panelBorder}`, background: t.panel, boxShadow: plan.isHighlighted ? '0 8px 32px rgba(0,0,0,0.12)' : 'none' }}>
                  {plan.badge && <span data-lp-pricing-badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full whitespace-nowrap" style={{ background: t.accent, color: '#fff' }}>{plan.badge}</span>}
                  <h3 className="text-xl font-bold" style={{ color: t.ink }}>{plan.name}</h3>
                  {plan.description && <p className="mt-1 text-sm" style={{ color: t.mutedText }}>{plan.description}</p>}
                  <div className="mt-6">{plan.monthlyPrice ? <><span className="text-4xl font-extrabold" style={{ color: t.ink }}>{plan.monthlyPrice}</span><span className="text-sm" style={{ color: t.mutedText }}>/mo</span></> : <span className="text-3xl font-extrabold" style={{ color: t.ink }}>Free</span>}</div>
                  {plan.features.length > 0 && <ul className="mt-6 flex flex-col gap-3 flex-1">{plan.features.map((f: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm" style={{ color: t.ink }}><span className="mt-0.5 font-bold flex-shrink-0" style={{ color: t.accent }}>✓</span>{f}</li>)}</ul>}
                  {plan.ctaText && <Link href={plan.ctaUrl || '#'} className="mt-8 block text-center px-6 py-3 rounded-xl font-semibold transition-colors" style={{ background: plan.isHighlighted ? t.accent : t.ink, color: '#fff' }}>{plan.ctaText}</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* ── v2 — Newsletter (before CTA) ────────────────────────────────── */}
      {page.newsletter?.enabled && <NewsletterSignup page={page} block={page.newsletter} />}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <LayoutCTA page={page} scale="regular" />
    </main>
  );
}
