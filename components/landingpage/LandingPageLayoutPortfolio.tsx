/**
 * Portfolio / Agency / Freelancer — showcase-oriented websites
 *
 * Asymmetric hero, client logos bar, blog posts as portfolio work (2x3 grid),
 * accent-topped feature cards, bold stats grid, reviews as client feedback
 * (masonry-style), large centered testimonial quotes, refined CTA.
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingStatItem, LandingLogo } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, FeatureIcon, FeatureMedia, StarRating, type ModuleData, type Post, type Review } from './sections';
import {
  ProcessTimeline, AwardsGrid, TeamGrid, PressMentions,
  NewsletterSignup, ContactFormInline, StickySectionNav,
  ProductsGrid, pickBlock, CustomBlock,
} from './blocks';
import LayoutHero from './LayoutHero';
import LayoutCTA from './LayoutCTA';

export default function LandingPageLayoutPortfolio({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topPosts = modules.posts.slice(0, 6);
  const topReviews = modules.reviews.slice(0, 4);

  return (
    <main>
      {/* ── v2 — Sticky section nav (opt-in) ─────────────────────────────── */}
      <StickySectionNav page={page} />

      {/* ── Hero — shared LayoutHero at "medium" scale respects heroStyle. */}
      <LayoutHero page={page} scale="medium" />

      {/* ── Logo Bar: "Clients We've Worked With" ────────────────────── */}
      {page.logobarEnabled && page.logos.length > 0 && (
        <section className="py-12" style={{ background: t.panel, borderBottom: `1px solid ${t.panelBorder}` }}>
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: t.mutedText }}>
              {page.logobarHeading || 'Clients We\u2019ve Worked With'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {page.logos.map((logo: LandingLogo) => {
                const img = resolveMediaUrl(logo.image);
                const inner = img
                  ? <div className="relative h-8 w-24"><Image src={img} alt={logo.name} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" /></div>
                  : <span className="text-lg font-bold tracking-tight" style={{ color: t.mutedText }}>{logo.name}</span>;
                return logo.url
                  ? <a key={logo.id} href={logo.url} target="_blank" rel="noopener noreferrer">{inner}</a>
                  : <div key={logo.id}>{inner}</div>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── MODULE: Blog posts as portfolio work (2x3 grid) ──────────── */}
      {topPosts.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold" style={{ color: t.ink }}>{page.blogSectionHeading || 'Featured Projects'}</h2>
              <Link href={page.blogSectionLinkUrl || '/blog'} className="text-sm font-semibold hover:underline" style={{ color: t.accent }}>{page.blogSectionLinkText || 'View all work →'}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {topPosts.map((post: Post) => {
                const img = resolveMediaUrl(post.coverImage);
                return (
                  <Link data-lp-post-card key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl overflow-hidden transition-shadow hover:shadow-xl" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                    {img && (
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image src={img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg leading-snug" style={{ color: t.ink }}>{post.title}</h3>
                      {post.excerpt && <p className="mt-2 text-sm line-clamp-2 leading-relaxed" style={{ color: t.mutedText }}>{post.excerpt}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Process / Methodology (between blog work and features) ── */}
      <ProcessTimeline page={page} />

      {/* ── Products grid (opt-in) ──────────────────────────────────────── */}
      <ProductsGrid page={page} modules={modules} />

      {/* ── Features: accent-topped capability cards ──────────────────── */}
      {page.featuresEnabled && page.features.length > 0 && (
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
                  {/* Accent top bar */}
                  <div className="h-1" style={{ background: t.accent }} />
                  {page.featuresMediaStyle === 'card' && <FeatureMedia icon={f.icon} image={f.image} alt={f.title} />}
                  <div className="p-6">
                    {page.featuresMediaStyle !== 'card' && (
                      <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ background: t.mutedPanel, color: t.accent }}>
                        <FeatureIcon icon={f.icon} image={f.image} alt={f.title} size={22} />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold" style={{ color: t.ink }}>{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-sm" style={{ color: t.mutedText }}>{f.description}</p>
                    {f.linkText && f.linkUrl && <Link href={f.linkUrl} className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: t.accent }}>{f.linkText} &rarr;</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats: bold 2x2 boxed grid ───────────────────────────────── */}
      {page.statsEnabled && page.statItems.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-4xl mx-auto px-4">
            {page.statsHeading && <h2 className="text-center text-3xl font-bold mb-12" style={{ color: t.ink }}>{page.statsHeading}</h2>}
            <div className="grid grid-cols-2 gap-6">
              {page.statItems.map((s: LandingStatItem) => (
                <div data-lp-stat-item key={s.id} className="rounded-2xl p-8 text-center" style={{ background: t.mutedPanel, border: `1px solid ${t.panelBorder}` }}>
                  <dt className="text-5xl font-extrabold" style={{ color: t.accent }}>{s.value}</dt>
                  <dd className="mt-2 text-sm font-semibold uppercase tracking-wide" style={{ color: t.mutedText }}>{s.label}</dd>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Awards & Team grids ────────────────────────────────────── */}
      <AwardsGrid page={page} />
      <TeamGrid page={page} />

      {/* ── MODULE: Reviews as client feedback (masonry-style) ────────── */}
      {topReviews.length > 0 && (
        <section className="py-20" style={{ background: t.mutedPanel }}>
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: t.ink }}>{page.reviewsSectionHeading || 'Client Feedback'}</h2>
            <div className="columns-1 sm:columns-2 gap-6 space-y-6">
              {topReviews.map((r: Review) => (
                <Link data-lp-review-card key={r.id} href={`/reviews/${r.slug}`} className="block break-inside-avoid rounded-2xl p-6 transition-shadow hover:shadow-lg" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} style={{ color: n <= Number(r.rating ?? 0) ? '#facc15' : t.panelBorder }}>&#9733;</span>
                    ))}
                  </div>
                  <h3 className="font-semibold" style={{ color: t.ink }}>{r.title}</h3>
                  {r.subject && <p className="mt-2 text-sm leading-relaxed" style={{ color: t.mutedText }}>{r.subject}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials: large centered quotes ──────────────────────── */}
      {page.testimonialsEnabled && page.testimonials.length > 0 && (
        <section className="py-20" style={{ background: t.panel }}>
          <div className="max-w-4xl mx-auto px-4">
            {page.testimonialsHeading && <h2 className="text-center text-3xl font-bold mb-14" style={{ color: t.ink }}>{page.testimonialsHeading}</h2>}
            <div className="flex flex-col gap-16">
              {page.testimonials.map((tm: LandingTestimonial) => {
                const av = resolveMediaUrl(tm.avatar);
                return (
                  <div data-lp-testimonial-card key={tm.id} className="text-center max-w-3xl mx-auto">
                    {tm.rating != null && <div className="flex justify-center mb-4"><StarRating rating={tm.rating} /></div>}
                    <blockquote className="text-xl sm:text-2xl italic leading-relaxed" style={{ color: t.ink, opacity: 0.9 }}>
                      &ldquo;{tm.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      {av
                        ? <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div>
                        : <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: t.mutedPanel, color: t.accent }}>{tm.authorName.charAt(0)}</div>}
                      <div className="text-left">
                        <p className="text-sm font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>
                        {(tm.authorTitle || tm.authorCompany) && <p className="text-xs" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── v2 — Press mentions + Press kit + Contact form + Newsletter ── */}
      <PressMentions page={page} />
      {(() => {
        const block = pickBlock(page.customBlocks, 'press_kit');
        return block ? <CustomBlock block={block} /> : null;
      })()}
      <ContactFormInline page={page} />
      {page.newsletter?.enabled && <NewsletterSignup page={page} block={page.newsletter} />}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <LayoutCTA page={page} scale="regular" />
    </main>
  );
}
