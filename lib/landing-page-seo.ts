/**
 * SEO helpers for Landing Pages — Phase 3.
 *
 * Two responsibilities:
 *  - ``buildMetadata(page, tenant)`` — produces the Next.js ``Metadata``
 *    object used by ``generateMetadata`` on the LP routes. Mirrors the
 *    fields on the LandingPage SEO/Social/Schema tabs, with sensible
 *    fallbacks when an OG-specific field is empty.
 *  - ``buildJsonLd(page, modules, tenant)`` — produces an array of
 *    JSON-LD objects to inject in ``<head>``. The shape is layout-aware
 *    when ``schema_type === 'auto'`` and respects per-type overrides
 *    via ``page.schemaOverrides``.
 *
 * The renderer in ``render-landing-page.tsx`` emits each object as a
 * ``<script type="application/ld+json">`` tag.
 */

import type { Metadata } from 'next';
import type { LandingPage, TenantInfo } from '@/lib/graphql';
import type { ModuleData } from '@/components/landingpage/sections';
import { resolveMediaUrl } from '@/lib/graphql';

// ── Metadata ────────────────────────────────────────────────────────────────

export function buildMetadata(page: LandingPage, _tenant?: TenantInfo | null): Metadata {
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const ogImageUrl = resolveMediaUrl(page.ogImage || page.heroImage);

  return {
    title,
    description,
    alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
    robots: {
      index: page.robotsIndex !== false,
      follow: page.robotsFollow !== false,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: page.twitterCardType === 'summary' ? 'summary' : 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

// ── JSON-LD ─────────────────────────────────────────────────────────────────

/** Map ``schema_type='auto'`` to a layout-appropriate primary type. */
function autoTypeForLayout(layout: string): string {
  switch (layout) {
    case 'storefront': return 'organization';
    case 'services':   return 'organization';
    case 'digital':    return 'course';
    case 'portfolio':  return 'creative_work';
    case 'links':      return 'person';
    case 'macro':      return 'organization';
    default:           return 'organization';
  }
}

type JsonLd = Record<string, unknown> & { '@type': string };

function webPage(page: LandingPage, tenant: TenantInfo | null | undefined): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    inLanguage: 'en',
    publisher: tenant ? { '@type': 'Organization', name: tenant.name } : undefined,
  };
}

function organization(page: LandingPage, tenant: TenantInfo | null | undefined): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: tenant?.name || page.title,
    description: page.metaDescription || undefined,
    url: page.canonicalUrl || undefined,
  };
}

function person(page: LandingPage): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: page.heroHeadline || page.title,
    description: page.heroSubheadline || page.metaDescription || undefined,
    url: page.canonicalUrl || undefined,
  };
}

function course(page: LandingPage, modules: ModuleData): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.heroHeadline || page.title,
    description: page.heroSubheadline || page.metaDescription || undefined,
    provider: { '@type': 'Organization', name: page.title },
    hasCourseInstance: modules.products.length > 0 ? modules.products.map((p) => ({
      '@type': 'CourseInstance',
      name: p.title,
    })) : undefined,
  };
}

function creativeWork(page: LandingPage): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: page.heroHeadline || page.title,
    description: page.heroSubheadline || page.metaDescription || undefined,
  };
}

function faqPage(page: LandingPage): JsonLd | null {
  if (!page.faqItems || page.faqItems.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqItems.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

function aggregateRating(modules: ModuleData): JsonLd | null {
  if (!modules.reviews || modules.reviews.length === 0) return null;
  const rated = modules.reviews.filter((r) => r.rating != null);
  if (rated.length === 0) return null;
  const avg = rated.reduce((s, r) => s + Number(r.rating ?? 0), 0) / rated.length;
  // Reviews carry a 1-10 rating in this codebase; clamp to schema.org 0-5.
  const ratingValue = Math.round((avg / 2) * 10) / 10;
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount: rated.length,
    bestRating: 5,
    worstRating: 0,
  };
}

function itemListProducts(modules: ModuleData): JsonLd | null {
  if (!modules.products || modules.products.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: modules.products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/products/${p.slug}`,
      name: p.title,
    })),
  };
}

function breadcrumbList(page: LandingPage): JsonLd | null {
  if (!page.showBreadcrumbs) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: page.title, item: `/lp/${page.slug}` },
    ],
  };
}

/** Apply per-@type overrides from ``page.schemaOverrides`` on top of the
 *  auto-generated objects. The override key matches ``@type`` (case-sensitive). */
function applyOverrides(obj: JsonLd, overrides: Record<string, unknown>): JsonLd {
  const type = obj['@type'];
  const o = overrides[type];
  if (o && typeof o === 'object') {
    return { ...obj, ...(o as Record<string, unknown>) };
  }
  return obj;
}

export function buildJsonLd(
  page: LandingPage,
  modules: ModuleData,
  tenant: TenantInfo | null | undefined,
): JsonLd[] {
  const overrides = page.schemaOverrides || {};
  const out: JsonLd[] = [webPage(page, tenant)];

  const breadcrumbs = breadcrumbList(page);
  if (breadcrumbs) out.push(breadcrumbs);

  // Primary type — either explicit or auto-resolved from the layout.
  const primary = page.schemaType === 'auto' ? autoTypeForLayout(page.layout) : page.schemaType;
  if (primary === 'organization')   out.push(organization(page, tenant));
  if (primary === 'person')         out.push(person(page));
  if (primary === 'course')         out.push(course(page, modules));
  if (primary === 'creative_work')  out.push(creativeWork(page));

  // Always-on data-driven additions.
  const faq = faqPage(page);
  if (faq) out.push(faq);
  if (page.reviewsShowAggregate !== false) {
    const ar = aggregateRating(modules);
    if (ar) out.push(ar);
  }
  if (page.layout === 'storefront' || page.layout === 'digital') {
    const items = itemListProducts(modules);
    if (items) out.push(items);
  }

  return out.map((o) => applyOverrides(o, overrides as Record<string, unknown>));
}
