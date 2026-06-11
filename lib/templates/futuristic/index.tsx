import { getTemplateConfig } from '../config';
import { resolveNavItems } from '../nav';
import { validateTemplateCssVars, type TemplateCssVarMap } from '../validate';
import ScrollerEnhancer from '../RetroScrollerEnhancer';
import { FuturisticBackgroundAdornment } from './FuturisticBackgroundAdornment';
import { FuturisticHeader } from './FuturisticHeader';
import { FuturisticContentFrame } from './FuturisticContentFrame';
import { FuturisticFooter } from './FuturisticFooter';
import { FuturisticGlobalStyles } from './FuturisticGlobalStyles';

interface TemplateLayoutProps {
  siteName: string;
  logo?: string | null;
  enabledModules: string[];
  savedConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

const futuristicConfig = getTemplateConfig('futuristic');

type FuturisticColors = typeof futuristicConfig.colors;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-f]{6})$/i.exec((hex ?? '').trim());
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function resolveFuturisticColors(
  base: FuturisticColors,
  saved: Partial<FuturisticColors>,
): FuturisticColors {
  const merged = { ...base, ...saved };
  const acc = hexToRgb(merged.accent);
  const accS = hexToRgb(merged.accentStrong) ?? acc;
  const bg = hexToRgb(merged.pageBackground);

  if (!acc || !bg) return merged;

  const { r: ar, g: ag, b: ab } = acc;
  const { r: br, g: bg2, b: bb } = bg;
  const lp = (v: number, by: number) => Math.min(255, v + by);

  return {
    ...merged,
    accentBorder: `rgba(${ar},${ag},${ab},0.25)`,
    panelBorder: `rgba(${ar},${ag},${ab},0.2)`,
    accentGlow: `rgba(${ar},${ag},${ab},0.5)`,
    imageBorder: `rgba(${ar},${ag},${ab},0.25)`,
    topGlowLine: `linear-gradient(90deg, transparent, ${merged.accent} 30%, ${merged.accentStrong} 70%, transparent)`,
    panelBackground: `rgba(${lp(br,13)},${lp(bg2,15)},${lp(bb,25)},0.82)`,
    mutedPanelBackground: `rgba(${lp(br,28)},${lp(bg2,33)},${lp(bb,47)},0.6)`,
    headerBackground: `rgba(${br},${bg2},${bb},0.95)`,
    footerBackground: `rgba(${br},${bg2},${bb},0.95)`,
  };
}

export function FuturisticLayout({ siteName, logo, enabledModules, savedConfig, children }: TemplateLayoutProps) {
  const savedColors = (savedConfig?.colors ?? {}) as Partial<FuturisticColors>;
  const colors = resolveFuturisticColors(futuristicConfig.colors, savedColors);
  const copy = { ...futuristicConfig.copy, ...(savedConfig?.copy as Partial<typeof futuristicConfig.copy> ?? {}) };

  const savedLayout = (savedConfig?.layout as Record<string, unknown> | undefined) ?? {};
  const adornment = (savedLayout.backgroundAdornment as string | undefined) ?? futuristicConfig.layout.backgroundAdornment;

  const navItems = resolveNavItems(enabledModules, savedConfig, futuristicConfig.layout.navItems);

  const cssVars: TemplateCssVarMap = {
    '--template-accent': colors.accent,
    '--template-accent-strong': colors.accentStrong,
    '--template-ink': colors.ink,
    '--template-muted-text': colors.mutedText,
    '--template-panel': colors.panelBackground,
    '--template-muted-panel': colors.mutedPanelBackground,
    '--template-panel-border': colors.panelBorder,
    '--template-text-on-accent': colors.ink,
  };
  validateTemplateCssVars('futuristic', cssVars);

  return (
    <div
      className="futuristic-shell min-h-full"
      style={{
        background: colors.pageBackground,
        color: colors.bodyText,
        ...(cssVars as React.CSSProperties),
      }}
    >
      <ScrollerEnhancer selector=".futuristic-shell [data-recipe-strip], .futuristic-shell [data-review-strip]" />
      <FuturisticBackgroundAdornment adornment={adornment} colors={colors} />

      <div className="relative z-10 flex min-h-full flex-col">
        <FuturisticHeader siteName={siteName} logo={logo} colors={colors} navItems={navItems} />

        <FuturisticContentFrame
          colors={colors}
          mainContainerClassName={futuristicConfig.layout.mainContainerClassName}
          footerPrefix={copy.footerPrefix}
        >
          {children}
        </FuturisticContentFrame>

        <FuturisticGlobalStyles colors={colors} />

        <FuturisticFooter siteName={siteName} logo={logo} colors={colors} copy={copy} navItems={navItems} />
      </div>
    </div>
  );
}
