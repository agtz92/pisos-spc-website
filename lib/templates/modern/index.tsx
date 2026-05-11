import type { ModernTemplateColors } from '../config';
import { getTemplateConfig } from '../config';
import { resolveNavItems } from '../nav';
import { validateTemplateCssVars, type TemplateCssVarMap } from '../validate';
import { ModernHeader } from './ModernHeader';
import { ModernFooter } from './ModernFooter';
import { ModernGridBackground } from './ModernGridBackground';
import { ModernGlobalStyles } from './ModernGlobalStyles';

interface TemplateLayoutProps {
  siteName: string;
  enabledModules: string[];
  savedConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

const modernConfig = getTemplateConfig('modern');

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-f]{6})$/i.exec((hex ?? '').trim());
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function resolveModernColors(
  base: ModernTemplateColors,
  saved: Partial<ModernTemplateColors>,
): ModernTemplateColors {
  const merged = { ...base, ...saved };
  const acc = hexToRgb(merged.accent);
  if (!acc) return merged;
  const { r, g, b } = acc;

  if (!saved.mutedPanelBackground)
    merged.mutedPanelBackground = `rgba(${r},${g},${b},0.05)`;
  if (!saved.pageBackground)
    merged.pageBackground = `radial-gradient(circle at top left, rgba(${r},${g},${b},0.14), transparent 30%), linear-gradient(180deg, #fffdfd 0%, #ffffff 22%, #ffffff 100%)`;
  if (!saved.gridLine)
    merged.gridLine = `rgba(${r},${g},${b},0.04)`;
  if (!saved.gridLineSoft)
    merged.gridLineSoft = `rgba(${r},${g},${b},0.03)`;

  return merged;
}

export function ModernLayout({ siteName, enabledModules, savedConfig, children }: TemplateLayoutProps) {
  const savedColors = (savedConfig?.colors ?? {}) as Partial<ModernTemplateColors>;
  const colors = resolveModernColors(modernConfig.colors, savedColors);

  const navItems = resolveNavItems(enabledModules, savedConfig, modernConfig.layout.navItems);

  const copy = { ...modernConfig.copy, ...(savedConfig?.copy as Partial<typeof modernConfig.copy> ?? {}) };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const cssVars: TemplateCssVarMap = {
    '--template-accent': colors.accent,
    '--template-accent-strong': colors.accentStrong,
    '--template-ink': colors.ink,
    '--template-muted-text': colors.mutedText,
    '--template-panel': colors.panelBackground,
    '--template-muted-panel': colors.mutedPanelBackground,
    '--template-panel-border': 'rgba(22, 18, 24, 0.1)',
    '--template-text-on-accent': colors.textOnAccent,
  };
  validateTemplateCssVars('modern', cssVars);

  return (
    <div
      className="modern-shell min-h-full"
      style={{
        background: colors.pageBackground ?? modernConfig.colors.pageBackground,
        color: colors.ink,
        ...(cssVars as React.CSSProperties),
      }}
    >
      <ModernGridBackground colors={colors} />

      <div className="relative flex min-h-full flex-col">
        <ModernHeader siteName={siteName} colors={colors} copy={copy} navItems={navItems} today={today} />

        <main className="modern-content relative z-10 flex-1 w-full">
          {children}
        </main>

        <ModernFooter siteName={siteName} colors={colors} copy={copy} navItems={navItems} />
      </div>

      <ModernGlobalStyles colors={colors} />
    </div>
  );
}
