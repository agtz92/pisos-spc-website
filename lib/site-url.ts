/**
 * Canonical site (base) URL resolution — shared by sitemap.ts and robots.ts.
 *
 * Precedence:
 *   1. ``NEXT_PUBLIC_SITE_URL`` env var — explicit per-deployment override.
 *   2. ``Tenant.website_url`` from the public GraphQL schema — the domain the
 *      tenant configured in the CMS (auto, no per-deployment env needed).
 *   3. '' — dev fallback; consumers then emit relative paths.
 *
 * ``getTenantCached`` is React-``cache``d, so calling this alongside the page's
 * own tenant fetch does not trigger a second network request.
 */
import { getTenantCached } from './modules';

/** Strip trailing slashes so we can safely concatenate ``${base}${path}``. */
export function normalizeBaseUrl(url: string | null | undefined): string {
  return (url || '').replace(/\/+$/, '');
}

export async function resolveSiteUrl(): Promise<string> {
  const fromEnv = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  const tenant = await getTenantCached().catch(() => null);
  return normalizeBaseUrl(tenant?.websiteUrl);
}
