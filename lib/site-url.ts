/**
 * Canonical site (base) URL resolution — shared by sitemap.ts and robots.ts.
 *
 * Precedence:
 *   1. ``NEXT_PUBLIC_SITE_URL`` env var — explicit per-deployment override.
 *   2. ``Tenant.website_url`` from the public GraphQL schema — the domain the
 *      tenant configured in the CMS (auto, no per-deployment env needed).
 *   3. '' — dev fallback; consumers then emit relative paths.
 *
 * ``getTenantWebsiteUrl`` is a dedicated query (not part of ``getTenant``): if a
 * deployed backend predates the ``website_url`` field, it throws and we fall
 * back gracefully instead of breaking every page. See its doc in ``graphql.ts``.
 */
import { getTenantWebsiteUrl } from './graphql';

/** Strip trailing slashes so we can safely concatenate ``${base}${path}``. */
export function normalizeBaseUrl(url: string | null | undefined): string {
  return (url || '').replace(/\/+$/, '');
}

export async function resolveSiteUrl(): Promise<string> {
  const fromEnv = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  const fromTenant = await getTenantWebsiteUrl().catch(() => '');
  return normalizeBaseUrl(fromTenant);
}
