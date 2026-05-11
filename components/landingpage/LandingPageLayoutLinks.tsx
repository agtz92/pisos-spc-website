/**
 * Links — Instagram / Podcast link-in-bio
 *
 * Compact single-column layout. Profile-style hero (image as avatar, headline as
 * name, subtitle as bio). Features rendered as large link buttons. Auto-generated
 * links to each active module. Reviews strip for social proof. No pricing/FAQ/stats.
 */

import type { LandingPage, LandingFeature, LandingTestimonial, LandingLogo } from '@/lib/graphql';
import { resolveMediaUrl } from '@/lib/graphql';
import Image from 'next/image';
import Link from 'next/link';
import { t, FeatureIcon, StarRating, type ModuleData, type Review } from './sections';
import {
  PenTool, Utensils, ShoppingBag, Home, Star,
} from 'lucide-react';

const MODULE_LINKS: Record<string, { label: string; href: string; Icon: typeof PenTool }> = {
  blog:       { label: 'Blog',        href: '/blog',       Icon: PenTool },
  recipes:    { label: 'Recipes',     href: '/recipes',    Icon: Utensils },
  products:   { label: 'Shop',        href: '/products',   Icon: ShoppingBag },
  realestate: { label: 'Properties',  href: '/properties', Icon: Home },
  reviews:    { label: 'Reviews',     href: '/reviews',    Icon: Star },
};

export default function LandingPageLayoutLinks({ page, modules }: { page: LandingPage; modules: ModuleData }) {
  const heroImage = resolveMediaUrl(page.heroImage);
  const topReviews = modules.reviews.slice(0, 3);
  const activeModuleLinks = modules.activeModules
    .filter((m) => m !== 'landingpage' && MODULE_LINKS[m])
    .map((m) => MODULE_LINKS[m]);

  return (
    <main className="min-h-screen" style={{ background: t.mutedPanel }}>
      <div className="max-w-lg mx-auto px-4 py-12">

        {/* ── Profile hero ─────────────────────────────────────────────── */}
        {page.heroEnabled && (
        <div className="text-center mb-10">
          {heroImage && (
            <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 shadow-lg" style={{ border: `3px solid ${t.accent}` }}>
              <Image src={heroImage} alt={page.heroHeadline || 'Profile'} fill className="object-cover" priority />
            </div>
          )}
          {page.heroBadge && (
            <span className="inline-block mb-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full" style={{ background: t.accent, color: '#fff' }}>
              {page.heroBadge}
            </span>
          )}
          {page.heroHeadline && (
            <h1 className="text-2xl font-extrabold" style={{ color: t.ink }}>{page.heroHeadline}</h1>
          )}
          {page.heroSubheadline && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: t.mutedText }}>{page.heroSubheadline}</p>
          )}
          {page.heroBody && (
            <p className="mt-2 text-xs leading-relaxed max-w-xs mx-auto" style={{ color: t.mutedText, opacity: 0.7 }}>{page.heroBody}</p>
          )}

          {/* Primary CTA as a prominent button */}
          {page.heroPrimaryCtaText && (
            <div className="mt-5">
              <Link data-lp-primary-cta href={page.heroPrimaryCtaUrl || '#'} className="inline-block w-full max-w-xs px-6 py-3 font-bold rounded-xl shadow-lg text-center transition-transform hover:scale-105" style={{ background: t.accent, color: '#fff' }}>
                {page.heroPrimaryCtaText}
              </Link>
            </div>
          )}
        </div>
        )}

        {/* ── Features as link buttons ──────────────────────────────────── */}
        {page.featuresEnabled && page.features.length > 0 && (
          <div className="flex flex-col gap-3 mb-8">
            {page.features.map((f: LandingFeature) => (
              <Link
                data-lp-feature-link
                key={f.id}
                href={f.linkUrl || '#'}
                className="flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all hover:shadow-md hover:scale-[1.02]"
                style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.mutedPanel, color: t.accent }}>
                  <FeatureIcon icon={f.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{f.title}</span>
                  {f.description && <span className="block text-xs truncate" style={{ color: t.mutedText }}>{f.description}</span>}
                </div>
                <span style={{ color: t.mutedText }}>→</span>
              </Link>
            ))}
          </div>
        )}

        {/* ── Module links (auto-generated) ─────────────────────────────── */}
        {activeModuleLinks.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: t.mutedText }}>Explore</p>
            <div className="grid grid-cols-2 gap-3">
              {activeModuleLinks.map(({ label, href, Icon }) => (
                <Link
                  data-lp-module-link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md hover:scale-[1.02]"
                  style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.ink }}
                >
                  <Icon size={18} style={{ color: t.accent }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Secondary CTA ────────────────────────────────────────────── */}
        {page.heroEnabled && page.heroSecondaryCtaText && (
          <div className="mb-8 text-center">
            <Link data-lp-secondary-cta href={page.heroSecondaryCtaUrl || '#'} className="inline-block w-full max-w-xs px-6 py-3 font-semibold rounded-xl text-center transition-colors" style={{ border: `2px solid ${t.panelBorder}`, color: t.ink }}>
              {page.heroSecondaryCtaText}
            </Link>
          </div>
        )}

        {/* ── MODULE: Reviews strip ─────────────────────────────────────── */}
        {topReviews.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: t.mutedText }}>Reviews</p>
            <div className="flex flex-col gap-3">
              {topReviews.map((r: Review) => (
                <Link data-lp-review-card key={r.id} href={`/reviews/${r.slug}`} className="rounded-xl p-4 transition-shadow hover:shadow-md" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <span key={n} className="text-xs" style={{ color: n <= Number(r.rating ?? 0) ? '#facc15' : t.panelBorder }}>★</span>)}</div>
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: t.ink }}>{r.title}</h3>
                  {r.subject && <p className="text-xs mt-0.5" style={{ color: t.mutedText }}>{r.subject}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Testimonials (compact) ────────────────────────────────────── */}
        {page.testimonialsEnabled && page.testimonials.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col gap-3">
              {page.testimonials.map((tm: LandingTestimonial) => {
                const av = resolveMediaUrl(tm.avatar);
                return (
                  <div data-lp-testimonial-card key={tm.id} className="rounded-xl p-4" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
                    <div className="flex items-center gap-3 mb-2">
                      {av ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"><Image src={av} alt={tm.authorName} fill className="object-cover" /></div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: t.mutedPanel, color: t.accent }}>{tm.authorName.charAt(0)}</div>
                      )}
                      <div>
                        <p className="text-sm font-semibold" style={{ color: t.ink }}>{tm.authorName}</p>
                        {(tm.authorTitle || tm.authorCompany) && <p className="text-[10px]" style={{ color: t.mutedText }}>{[tm.authorTitle, tm.authorCompany].filter(Boolean).join(', ')}</p>}
                      </div>
                      {tm.rating != null && <div className="ml-auto"><StarRating rating={tm.rating} /></div>}
                    </div>
                    <p className="text-sm italic leading-relaxed" style={{ color: t.ink, opacity: 0.85 }}>&ldquo;{tm.quote}&rdquo;</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Logo Bar (compact) ────────────────────────────────────────── */}
        {page.logobarEnabled && page.logos.length > 0 && (
          <div className="mb-8">
            {page.logobarHeading && <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: t.mutedText }}>{page.logobarHeading}</p>}
            <div className="flex flex-wrap justify-center items-center gap-6">
              {page.logos.map((logo: LandingLogo) => {
                const img = resolveMediaUrl(logo.image);
                const inner = img ? <div className="relative h-6 w-16"><Image src={img} alt={logo.name} fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" /></div> : <span className="text-sm font-bold" style={{ color: t.mutedText }}>{logo.name}</span>;
                return logo.url ? <a key={logo.id} href={logo.url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={logo.id}>{inner}</div>;
              })}
            </div>
          </div>
        )}

        {/* ── CTA (bottom) ──────────────────────────────────────────────── */}
        {page.ctaEnabled && page.ctaHeading && (
          <div className="text-center py-8 rounded-2xl" style={{ background: t.panel, border: `1px solid ${t.panelBorder}` }}>
            <h2 className="text-xl font-bold" style={{ color: t.ink }}>{page.ctaHeading}</h2>
            {page.ctaSubheading && <p className="mt-2 text-sm" style={{ color: t.mutedText }}>{page.ctaSubheading}</p>}
            {page.ctaPrimaryText && (
              <div className="mt-4">
                <Link data-lp-primary-cta href={page.ctaPrimaryUrl || '#'} className="inline-block px-8 py-3 font-bold rounded-xl shadow transition-transform hover:scale-105" style={{ background: t.accent, color: '#fff' }}>
                  {page.ctaPrimaryText}
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
