/**
 * Per-module template settings resolver.
 *
 * Single place that reads ``tenant.templateConfig.modules.<mod>`` so every
 * module surface (listing pages AND detail pages) pulls layout + color
 * overrides the same way. Before this existed each page inlined the same
 * ``templateConfig?.modules?.<mod>?.layout`` digging — see app/products/page.tsx
 * for the original inline version.
 *
 * The layout config is an open ``Record`` on purpose: the CMS persists any key
 * defined in MODULE_LAYOUT_FIELDS[mod] under ``layout`` (e.g. ``variant`` for
 * the listing, ``detailVariant`` for the detail page, ``railCount`` numbers).
 * Read each one through ``getLayoutVariant`` / direct access with a fallback.
 */
import type { TenantInfo } from '@/lib/graphql';

export interface ModuleSettings {
  /** Everything saved under modules.<mod>.layout — variant, detailVariant, counts… */
  layout: Record<string, unknown>;
  /** Everything saved under modules.<mod>.colors. */
  colors: Record<string, unknown>;
  /** CSS custom properties derived from the module color overrides, ready to
   *  spread onto a wrapper element's ``style`` so children inherit the palette
   *  via ``var(--template-*)``. */
  moduleStyle: Record<string, string>;
}

export function getModuleSettings(
  tenant: Pick<TenantInfo, 'templateConfig'> | null | undefined,
  moduleKey: string,
): ModuleSettings {
  const modules = (tenant?.templateConfig?.modules ?? {}) as Record<string, Record<string, unknown>>;
  const mod = modules[moduleKey] ?? {};
  const layout = (mod.layout ?? {}) as Record<string, unknown>;
  const colors = (mod.colors ?? {}) as Record<string, unknown>;

  const moduleStyle = {
    ...(colors.accent          ? { '--template-accent':       colors.accent as string }          : {}),
    ...(colors.ink             ? { '--template-ink':          colors.ink as string }             : {}),
    ...(colors.panelBackground ? { '--template-panel':        colors.panelBackground as string } : {}),
    ...(colors.panelBorder     ? { '--template-panel-border': colors.panelBorder as string }     : {}),
  } as Record<string, string>;

  return { layout, colors, moduleStyle };
}

/** Read a string layout key (e.g. ``variant``, ``detailVariant``) with a
 *  fallback. Empty strings fall back too, matching the CMS save semantics. */
export function getLayoutVariant(
  layout: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const v = layout[key];
  return typeof v === 'string' && v.trim() !== '' ? v : fallback;
}
