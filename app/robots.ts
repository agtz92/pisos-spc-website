/**
 * robots.txt — Phase 7.
 *
 * Default crawl-allow policy with a sitemap reference. Per-LP noindex /
 * nofollow is handled via the ``robots`` meta tag set by ``buildMetadata``
 * (Phase 3); robots.txt is the broader, site-wide guidance.
 *
 * The base URL is resolved per tenant (env override → ``Tenant.website_url``),
 * so the sitemap link is absolute without any per-deployment config. See
 * ``lib/site-url.ts``.
 */
import type { MetadataRoute } from 'next';
import { resolveSiteUrl } from '@/lib/site-url';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await resolveSiteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : '/sitemap.xml',
  };
}
