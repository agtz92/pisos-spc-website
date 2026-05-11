/**
 * Shared helper: resolve the final nav items shown in the public header.
 *
 * Priority:
 *   1. `savedConfig.layout.navItemsList` — a user-controlled array edited in
 *      CMS Settings → Navbar. Fully replaces module derivation when present.
 *   2. Fallback: enabled modules mapped through the template's static config,
 *      with optional per-module label overrides from `savedConfig.layout.navItems`.
 */

export interface NavItem {
  label: string;
  href: string;
}

export function resolveNavItems(
  enabledModules: string[],
  savedConfig: Record<string, unknown> | undefined,
  staticNavItems: Record<string, NavItem>,
): NavItem[] {
  const layout = (savedConfig?.layout as Record<string, unknown> | undefined) ?? {};

  const rawList = layout.navItemsList;
  if (Array.isArray(rawList)) {
    return rawList
      .map((entry) => {
        const item = entry as { label?: unknown; href?: unknown } | null;
        if (!item || typeof item !== 'object') return null;
        const label = typeof item.label === 'string' ? item.label.trim() : '';
        const href = typeof item.href === 'string' ? item.href.trim() : '';
        if (!label || !href) return null;
        return { label, href };
      })
      .filter((i): i is NavItem => i !== null);
  }

  const savedMap = (layout.navItems ?? {}) as Record<string, { label?: string; href?: string }>;
  return enabledModules
    .map((key) => {
      const staticItem = staticNavItems[key];
      if (!staticItem) return undefined;
      const override = savedMap[key];
      return override?.label ? { ...staticItem, label: override.label } : staticItem;
    })
    .filter((item): item is NavItem => Boolean(item));
}
