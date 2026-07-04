import type { Metadata } from 'next';
import type { TenantInfo } from './graphql';

/**
 * Per-tenant SEO overrides live in `Tenant.template_config` (JSON) — no dedicated
 * columns. Site-wide SEO sits at `template_config.seo`; per-module SEO at
 * `template_config.modules.<mod>.seo`. Both are edited in the CMS (Settings → SEO
 * and the SEO panel atop each module list page) and saved through the existing
 * `updateTemplateConfig` mutation, so this needed no backend/migration change.
 */

export type SeoFields = {
  title?: string;
  description?: string;
};

export type SiteSeo = SeoFields & {
  canonicalUrl?: string;
  /** Defaults to true; only an explicit `false` blocks indexing. */
  indexable: boolean;
};

function cleanStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Read per-module SEO overrides from `template_config.modules.<mod>.seo`. */
export function getModuleSeo(tenant: TenantInfo | null | undefined, mod: string): SeoFields {
  const modules = (tenant?.templateConfig?.modules ?? {}) as Record<string, Record<string, unknown>>;
  const seo = (modules?.[mod]?.seo ?? {}) as Record<string, unknown>;
  return { title: cleanStr(seo.title), description: cleanStr(seo.description) };
}

/** Read site-wide SEO from `template_config.seo`. */
export function getSiteSeo(tenant: TenantInfo | null | undefined): SiteSeo {
  const seo = (tenant?.templateConfig?.seo ?? {}) as Record<string, unknown>;
  return {
    title: cleanStr(seo.title),
    description: cleanStr(seo.description),
    canonicalUrl: cleanStr(seo.canonicalUrl),
    indexable: seo.indexable !== false,
  };
}

/**
 * Build `Metadata` for a module listing page (e.g. `/products`).
 *
 * `defaultTitle` is the fallback segment (e.g. "Products"); when the tenant sets
 * no SEO title it flows through the root layout's title template → "Products |
 * Site Name". A tenant-provided SEO title becomes the absolute `<title>` (full
 * control, no site-name suffix).
 */
export function buildModuleMetadata(
  tenant: TenantInfo | null | undefined,
  mod: string,
  defaultTitle: string,
): Metadata {
  const seo = getModuleSeo(tenant, mod);
  const meta: Metadata = {
    title: seo.title ? { absolute: seo.title } : defaultTitle,
  };
  if (seo.description) meta.description = seo.description;
  return meta;
}
