/**
 * robots.txt — Phase 7.
 *
 * Default crawl-allow policy with sitemap reference. Per-LP noindex /
 * nofollow is handled via the ``robots`` meta tag set by ``buildMetadata``
 * (Phase 3); robots.txt is the broader, site-wide guidance.
 */
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: BASE_URL ? `${BASE_URL}/sitemap.xml` : '/sitemap.xml',
  };
}
