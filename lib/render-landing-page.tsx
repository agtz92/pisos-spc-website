import type * as React from 'react';
import { getPosts, getRecipes, getProducts, getListings, getReviews, type LandingPage } from '@/lib/graphql';
import { getTenantCached } from '@/lib/modules';
import type { ModuleData } from '@/components/landingpage/sections';
import LandingPageLayoutStorefront from '@/components/landingpage/LandingPageLayoutStorefront';
import LandingPageLayoutServices from '@/components/landingpage/LandingPageLayoutServices';
import LandingPageLayoutDigital from '@/components/landingpage/LandingPageLayoutDigital';
import LandingPageLayoutPortfolio from '@/components/landingpage/LandingPageLayoutPortfolio';
import LandingPageLayoutLinks from '@/components/landingpage/LandingPageLayoutLinks';
import LandingPageLayoutMacro from '@/components/landingpage/LandingPageLayoutMacro';
import { StickyBar } from '@/components/landingpage/blocks';
import Breadcrumbs from '@/components/landingpage/blocks/Breadcrumbs';
import Dateline from '@/components/landingpage/blocks/Dateline';
import StickyToc from '@/components/landingpage/blocks/StickyToc';
import { buildJsonLd } from '@/lib/landing-page-seo';

/**
 * Fetch the module content this landing page wants to render.
 *
 * Honors the per-page settings introduced in Phase 2:
 * - ``*_section_enabled`` — whether to fetch at all.
 * - ``*_source``           — what slice to pull (latest / featured / etc.).
 * - ``*_count``            — how many items.
 * - ``*_category_slug``    — narrow by category when source='category'.
 *
 * Modules disabled at the tenant level still resolve to empty lists.
 */
export async function fetchLandingPageModules(page?: LandingPage): Promise<ModuleData> {
  const tenant = await getTenantCached();
  const active = tenant?.modules ?? [];

  const blogReq = page?.blogSectionEnabled !== false && active.includes('blog')
    ? getPosts({
        categorySlug: page?.blogSource === 'category' ? (page.blogCategorySlug || undefined) : undefined,
        featured:     page?.blogSource === 'featured' ? true : undefined,
        limit:        page?.blogCount && page.blogCount > 0 ? page.blogCount : undefined,
      }).catch(() => [])
    : Promise.resolve([]);

  const productsReq = page?.productsSectionEnabled !== false && active.includes('products')
    ? getProducts({
        categorySlug: page?.productsSource === 'category' ? (page.productsCategorySlug || undefined) : undefined,
        featured:     page?.productsSource === 'featured' ? true : undefined,
        limit:        page?.productsCount && page.productsCount > 0 ? page.productsCount : undefined,
      }).catch(() => [])
    : Promise.resolve([]);

  const reviewsReq = page?.reviewsSectionEnabled !== false && active.includes('reviews')
    ? getReviews({
        orderByRating: page?.reviewsSource === 'highest' ? true : undefined,
        limit:         page?.reviewsCount && page.reviewsCount > 0 ? page.reviewsCount : undefined,
      }).catch(() => [])
    : Promise.resolve([]);

  const recipesReq = page?.recipesSectionEnabled && active.includes('recipes')
    ? getRecipes({
        limit: page.recipesCount && page.recipesCount > 0 ? page.recipesCount : undefined,
      }).catch(() => [])
    : Promise.resolve([]);

  const listingsReq = page?.listingsSectionEnabled && active.includes('realestate')
    ? getListings({
        limit: page.listingsCount && page.listingsCount > 0 ? page.listingsCount : undefined,
      }).catch(() => [])
    : Promise.resolve([]);

  const [posts, recipes, products, listings, reviews] = await Promise.all([
    blogReq, recipesReq, productsReq, listingsReq, reviewsReq,
  ]);
  return { posts, recipes, products, listings, reviews, activeModules: active };
}

// Wrapped in a function so the `<await>` is colocated; some layouts (Links)
// are async server components and we want a uniform return type for TS.
async function renderLayout(page: LandingPage, modules: ModuleData) {
  const layout = page.layout || 'storefront';
  if (layout === 'macro')     return <LandingPageLayoutMacro     page={page} modules={modules} />;
  if (layout === 'services')  return <LandingPageLayoutServices  page={page} modules={modules} />;
  if (layout === 'digital')   return <LandingPageLayoutDigital   page={page} modules={modules} />;
  if (layout === 'portfolio') return <LandingPageLayoutPortfolio page={page} modules={modules} />;
  if (layout === 'links')     return await (LandingPageLayoutLinks({ page, modules }) as Promise<React.ReactElement>);
  return <LandingPageLayoutStorefront page={page} modules={modules} />;
}

/** Top-level renderer used by every LP route.
 *
 *  Wraps the layout component with universal SEO/Schema markup and the
 *  Phase 1 sticky bar. JSON-LD blocks are async-fetched alongside the
 *  modules, so we pass the tenant in here rather than re-fetching.
 */
export async function renderLandingPage(page: LandingPage, modules: ModuleData) {
  const tenant = await getTenantCached();
  const jsonLd = buildJsonLd(page, modules, tenant);
  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          // JSON.stringify is XSS-safe for JSON-LD payloads we author.
          // External user input never enters these objects.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <StickyBar page={page} />
      <Breadcrumbs page={page} />
      <Dateline page={page} />
      <StickyToc page={page} />
      {await renderLayout(page, modules)}
      {/* PressMentions / ComparisonTable / ReviewsAggregate / NewsletterSignup
         used to live here as universal appends. They are now rendered
         in-flow by each layout so they appear in the position the wireframe
         describes (e.g. comparison BEFORE pricing, not after the CTA). */}
    </>
  );
}
