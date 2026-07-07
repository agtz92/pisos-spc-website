/**
 * Sitemap — auto-generated per tenant.
 *
 * Next.js serves this file at ``/sitemap.xml``. Because every deployment is
 * scoped to a single tenant (``NEXT_PUBLIC_TENANT_SLUG`` → ``/t/<slug>/graphql/``),
 * the sitemap is inherently tenant-specific: it only ever contains the URLs of
 * the modules THIS tenant has enabled and the content THIS tenant has published.
 *
 * What it includes:
 *   - Homepage (``/``)
 *   - Landing pages with ``include_in_sitemap=True`` (canonical URL or root/lp path)
 *   - For each enabled module: the list page + every published detail page
 *   - Category pages for modules that expose them (blog, products, recipes, reviews)
 *   - Secondary taxonomies / filter pages: blog tags & authors, review types,
 *     listings rent/sale
 *   - Utility pages (``/u/<slug>``)
 *
 * Deliberately excluded: ``/posts/<slug>`` and ``/categories/<slug>`` are legacy
 * redirect stubs (→ /blog/…), not canonical URLs, so they never belong here.
 *
 * Every URL is deduped so a homepage LP and the implicit ``/`` entry don't clash.
 * All fetches are individually guarded — a single failing module never blanks
 * the whole sitemap.
 */
import type { MetadataRoute } from 'next';
import {
  getTenantCached,
} from '@/lib/modules';
import { resolveSiteUrl } from '@/lib/site-url';
import {
  getLandingPages,
  getPosts,
  getRecipes,
  getProducts,
  getListings,
  getReviews,
  getUtilityPages,
  getCategories,
  getTags,
  getAuthors,
  type LandingPageSummary,
} from '@/lib/graphql';

/** Path → absolute-URL prefixer, bound to the tenant's resolved base URL. */
type Abs = (path: string) => string;
const makeAbs = (baseUrl: string): Abs => (path) => (baseUrl ? `${baseUrl}${path}` : path);

type Timestamped = { publishedAt?: string | null; createdAt?: string | null };

/** Most-recent known timestamp for a content item, as a Date (or undefined). */
function lastModified(item: Timestamped): Date | undefined {
  const ts = item.publishedAt || item.createdAt;
  return ts ? new Date(ts) : undefined;
}

/** Resolve a landing page to its public URL (mirrors the routing in app/). */
function landingUrl(abs: Abs, p: LandingPageSummary): string {
  if (p.canonicalUrl) return p.canonicalUrl;
  const root = p.rootPath || 'none';
  const path = root === 'home' ? '/' : root === 'root' ? `/${p.slug}` : `/lp/${p.slug}`;
  return abs(path);
}

/** Static sitemap entry with a fixed change-frequency/priority. */
const staticEntry = (abs: Abs, path: string, priority = 0.5): MetadataRoute.Sitemap[number] => ({
  url: abs(path),
  changeFrequency: 'weekly',
  priority,
});

/**
 * Module → route wiring. ``key`` is the tenant-module flag (see requireModule
 * calls in app/<mod>/layout.tsx); ``base`` is the URL segment; ``taxonomy`` is
 * the getCategories() module filter, or null when the module has no category
 * route in app/. ``extra`` emits any additional routes the module owns beyond
 * its list/detail/category pages (secondary taxonomies, static filter pages);
 * it receives the already-fetched items so it can derive URLs without refetching.
 */
const MODULES: ReadonlyArray<{
  key: string;
  base: string;
  fetch: () => Promise<Array<Timestamped & { slug?: string }>>;
  taxonomy: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: (items: any[], abs: Abs) => Promise<MetadataRoute.Sitemap>;
}> = [
  {
    key: 'blog',
    base: '/blog',
    fetch: getPosts,
    taxonomy: 'blog',
    // Blog has author (/blog/author/<slug>) and tag (/blog/tag/<slug>) routes.
    extra: async (_items, abs) => {
      const [authors, tags] = await Promise.all([
        getAuthors().catch(() => []),
        getTags('blog').catch(() => []),
      ]);
      return [
        ...authors.filter((a) => a.slug).map((a) => staticEntry(abs, `/blog/author/${a.slug}`, 0.4)),
        ...tags.filter((t) => t.slug).map((t) => staticEntry(abs, `/blog/tag/${t.slug}`, 0.4)),
      ];
    },
  },
  { key: 'recipes', base: '/recipes', fetch: getRecipes, taxonomy: 'recipes' },
  { key: 'products', base: '/products', fetch: getProducts, taxonomy: 'products' },
  {
    key: 'realestate',
    base: '/listings',
    fetch: getListings,
    taxonomy: null,
    // Static rent/sale marketplace filter pages.
    extra: async (_items, abs) => [
      staticEntry(abs, '/listings/rent', 0.6),
      staticEntry(abs, '/listings/sale', 0.6),
    ],
  },
  {
    key: 'reviews',
    base: '/reviews',
    fetch: getReviews,
    taxonomy: 'reviews',
    // Review type pages (/reviews/type/<type>) — derive from types actually in use.
    extra: async (items, abs) => {
      const types = new Set<string>(
        items.map((r) => (typeof r.reviewType === 'string' ? r.reviewType : '')).filter(Boolean),
      );
      return [...types].map((t) => staticEntry(abs, `/reviews/type/${t}`, 0.4));
    },
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL and modules both come from the tenant; getTenantCached is memoised
  // so resolveSiteUrl() and getTenantCached() below share a single fetch.
  const [baseUrl, tenant] = await Promise.all([
    resolveSiteUrl(),
    getTenantCached().catch(() => null),
  ]);
  const abs = makeAbs(baseUrl);
  const enabled = new Set(tenant?.modules ?? []);

  const entries: MetadataRoute.Sitemap = [];

  // Homepage — always present (deduped later if a 'home' landing page also maps to '/').
  entries.push({ url: abs('/'), changeFrequency: 'daily', priority: 1.0 });

  // ── Landing pages ───────────────────────────────────────────────────────────
  if (enabled.has('landingpage')) {
    const pages = await getLandingPages().catch(() => [] as LandingPageSummary[]);
    for (const p of pages) {
      if (p.includeInSitemap === false) continue;
      entries.push({
        url: landingUrl(abs, p),
        changeFrequency: 'weekly',
        priority: p.rootPath === 'home' ? 1.0 : 0.7,
      });
    }
  }

  // ── Content modules (list page + detail pages + categories) ──────────────────
  await Promise.all(
    MODULES.map(async (mod) => {
      if (!enabled.has(mod.key)) return;

      const items = await mod.fetch().catch(() => [] as Timestamped[]);

      // List page.
      entries.push({ url: abs(mod.base), changeFrequency: 'daily', priority: 0.8 });

      // Detail pages.
      for (const item of items as Array<Timestamped & { slug: string }>) {
        if (!item.slug) continue;
        entries.push({
          url: abs(`${mod.base}/${item.slug}`),
          lastModified: lastModified(item),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }

      // Category pages (only modules that expose a /<base>/category/<slug> route).
      if (mod.taxonomy) {
        const cats = await getCategories(mod.taxonomy).catch(() => []);
        for (const c of cats) {
          if (!c.slug) continue;
          entries.push({
            url: abs(`${mod.base}/category/${c.slug}`),
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        }
      }

      // Module-specific extra routes (secondary taxonomies, static filter pages).
      if (mod.extra) {
        const extra = await mod.extra(items, abs).catch(() => [] as MetadataRoute.Sitemap);
        entries.push(...extra);
      }
    }),
  );

  // ── Utility pages (/u/<slug>) ────────────────────────────────────────────────
  if (enabled.has('utilitypage')) {
    const pages = await getUtilityPages().catch(() => []);
    for (const p of pages) {
      if (!p.slug) continue;
      entries.push({ url: abs(`/u/${p.slug}`), changeFrequency: 'monthly', priority: 0.5 });
    }
  }

  // Dedupe by URL, keeping the first (highest-intent) entry for each.
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
