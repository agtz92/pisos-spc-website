/**
 * Template runtime validators.
 *
 * The public website is driven by CSS custom properties set on the root
 * `<div class="<name>-shell">` of each template. Shared cards (`PostCard`,
 * `RecipeCard`, etc.) read these variables via `var(--template-*)`. If a
 * template layout forgets to set one, the cards fall back to hardcoded
 * defaults (e.g. `#e5e7eb`) and the bug ships silently — no runtime error,
 * no build error, just wrong colors.
 *
 * This module provides:
 *   - REQUIRED_TEMPLATE_CSS_VARS   — the contract every template must honor
 *   - TemplateCssVarName           — typed name union
 *   - TemplateCssVarMap            — inline-style compatible record type
 *   - validateTemplateCssVars(...) — dev-mode checker invoked from each layout
 *
 * When adding a new template, import `TemplateCssVarMap` and call
 * `validateTemplateCssVars(templateName, cssVars)` inside your layout.
 * See `website/lib/templates/NEW_TEMPLATE_GUIDE.md` for the full workflow.
 */

export const REQUIRED_TEMPLATE_CSS_VARS = [
  '--template-accent',
  '--template-accent-strong',
  '--template-ink',
  '--template-muted-text',
  '--template-panel',
  '--template-muted-panel',
  '--template-panel-border',
  '--template-text-on-accent',
] as const;

export type TemplateCssVarName = (typeof REQUIRED_TEMPLATE_CSS_VARS)[number];

/**
 * Inline-style-compatible map. Use as the type of the CSS-var portion of
 * a template's root-div `style` prop:
 *
 *     const cssVars: TemplateCssVarMap = {
 *       '--template-accent': colors.accent,
 *       // ...all 8 required keys...
 *     };
 *     return <div style={{ background: ..., ...cssVars }}>...
 *
 * `Required<...>` forces the compiler to complain if a key is missing.
 */
export type TemplateCssVarMap = Required<Record<TemplateCssVarName, string>>;

/**
 * Dev-mode runtime check. Warns (once per render) if any required CSS
 * variable is missing or empty. Production builds skip the check entirely.
 *
 * Call at the top of your `<Name>Layout` function, right before returning
 * the JSX that spreads `cssVars` into the root `<div>` style.
 */
export function validateTemplateCssVars(
  templateName: string,
  cssVars: Partial<Record<string, string | undefined>>,
): void {
  if (process.env.NODE_ENV !== 'development') return;

  const missing = REQUIRED_TEMPLATE_CSS_VARS.filter(
    (name) => !cssVars[name] || String(cssVars[name]).trim() === '',
  );

  if (missing.length === 0) return;

  // eslint-disable-next-line no-console
  console.warn(
    `[template:${templateName}] missing required CSS variables: ${missing.join(
      ', ',
    )}. Shared components will fall back to default colors and render incorrectly. ` +
      `See website/lib/templates/validate.ts for the full contract.`,
  );
}
