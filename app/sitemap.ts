/**
 * Sitemap — Phase 3.
 *
 * Lists every published LandingPage with ``include_in_sitemap=True``,
 * plus the homepage. Each URL uses the LP's canonical URL when set,
 * otherwise the appropriate route based on ``root_path``:
 *   - 'home' → '/'
 *   - 'root' → '/<slug>'
 *   - 'none' → '/lp/<slug>'
 *
 * Picked up automatically by Next.js (file-based ``sitemap`` route).
 */
import type { MetadataRoute } from 'next';
import { getLandingPages, type LandingPageSummary } from '@/lib/graphql';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

function resolveUrl(p: LandingPageSummary): string {
  if (p.canonicalUrl) return p.canonicalUrl;
  const root = p.rootPath || 'none';
  const path = root === 'home' ? '/' : root === 'root' ? `/${p.slug}` : `/lp/${p.slug}`;
  return BASE_URL ? `${BASE_URL}${path}` : path;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = await getLandingPages().catch(() => [] as LandingPageSummary[]);
  return all
    .filter((p) => p.includeInSitemap !== false)
    .map((p) => ({
      url: resolveUrl(p),
      changeFrequency: 'weekly',
      priority: p.rootPath === 'home' ? 1.0 : 0.7,
    }));
}
