import type { ExecutiveTemplateColors } from '../config';
import { getTemplateConfig } from '../config';
import { resolveNavItems } from '../nav';
import { validateTemplateCssVars, type TemplateCssVarMap } from '../validate';
import { ExecutiveHeader } from './ExecutiveHeader';
import { ExecutiveFooter } from './ExecutiveFooter';
import { ExecutiveGlobalStyles } from './ExecutiveGlobalStyles';

interface TemplateLayoutProps {
  siteName: string;
  enabledModules: string[];
  savedConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

const executiveConfig = getTemplateConfig('executive');

export function ExecutiveLayout({ siteName, enabledModules, savedConfig, children }: TemplateLayoutProps) {
  const savedColors = (savedConfig?.colors ?? {}) as Partial<ExecutiveTemplateColors>;
  const colors: ExecutiveTemplateColors = { ...executiveConfig.colors, ...savedColors };

  const copy = { ...executiveConfig.copy, ...(savedConfig?.copy as Partial<typeof executiveConfig.copy> ?? {}) };

  const navItems = resolveNavItems(enabledModules, savedConfig, executiveConfig.layout.navItems);

  const cssVars: TemplateCssVarMap = {
    '--template-accent': colors.accent,
    '--template-accent-strong': colors.accentStrong,
    '--template-ink': colors.ink,
    '--template-muted-text': colors.mutedText,
    '--template-panel': colors.panelBackground,
    '--template-muted-panel': colors.mutedPanelBackground,
    '--template-panel-border': colors.panelBorder,
    '--template-text-on-accent': '#ffffff',
  };
  validateTemplateCssVars('executive', cssVars);

  return (
    <div
      className="executive-shell min-h-full"
      style={{
        background: colors.pageBackground,
        color: colors.ink,
        ...(cssVars as React.CSSProperties),
      }}
    >
      <ExecutiveHeader siteName={siteName} colors={colors} navItems={navItems} />

      <main className="executive-content relative z-10 flex-1 w-full">
        {children}
      </main>

      <ExecutiveFooter siteName={siteName} colors={colors} copy={copy} navItems={navItems} />

      <ExecutiveGlobalStyles colors={colors} />
    </div>
  );
}
