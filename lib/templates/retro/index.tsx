import { getTemplateConfig } from '../config';
import { resolveNavItems } from '../nav';
import { validateTemplateCssVars, type TemplateCssVarMap } from '../validate';
import RetroScrollerEnhancer from '../RetroScrollerEnhancer';
import { RetroBackgroundAdornment } from './RetroBackgroundAdornment';
import { RetroHeader } from './RetroHeader';
import { RetroFooter } from './RetroFooter';
import { RetroPanelBox } from './RetroPanelBox';
import { RetroGlobalStyles } from './RetroGlobalStyles';

interface TemplateLayoutProps {
  siteName: string;
  enabledModules: string[];
  savedConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

const retroConfig = getTemplateConfig('retro');

export function RetroLayout({ siteName, enabledModules, savedConfig, children }: TemplateLayoutProps) {
  const savedColors = (savedConfig?.colors ?? {}) as Partial<typeof retroConfig.colors>;
  const colors = { ...retroConfig.colors, ...savedColors };

  const savedLayout = (savedConfig?.layout as Record<string, unknown> | undefined) ?? {};
  const adornment = (savedLayout.backgroundAdornment as string | undefined) ?? retroConfig.layout.backgroundAdornment;

  const navItems = resolveNavItems(enabledModules, savedConfig, retroConfig.layout.navItems);

  const currentYear = new Date().getFullYear();
  const copy = {
    ...retroConfig.copy,
    ...(savedConfig?.copy as Partial<typeof retroConfig.copy> ?? {}),
  } as typeof retroConfig.copy & Record<string, string>;

  const cssVars: TemplateCssVarMap = {
    '--template-accent': colors.highlight,
    '--template-accent-strong': colors.highlightStrong,
    '--template-ink': colors.ink,
    '--template-muted-text': colors.mutedText,
    '--template-panel': colors.panelBackground,
    '--template-muted-panel': colors.mutedPanelBackground,
    '--template-panel-border': colors.panelBorder,
    '--template-text-on-accent': colors.textOnAccent,
  };
  validateTemplateCssVars('retro', cssVars);

  return (
    <div
      className="retro-shell min-h-full text-stone-900"
      style={{
        background: 'var(--template-page-background)',
        color: colors.ink,
        ['--template-page-background' as string]: colors.pageBackground,
        ...(cssVars as React.CSSProperties),
      }}
    >
      <RetroScrollerEnhancer />
      <RetroScrollerEnhancer selector=".retro-shell [data-review-strip]" />

      <RetroBackgroundAdornment adornment={adornment} colors={colors} />

      <div className="relative flex min-h-full flex-col">
        <RetroHeader
          siteName={siteName}
          colors={colors}
          copy={copy}
          navItems={navItems}
          currentYear={currentYear}
        />

        <main className="relative z-10 flex-1 px-3 pb-16 sm:px-5 sm:pb-24">
          <RetroPanelBox
            className="retro-main-panel mx-auto max-w-7xl"
            ink={colors.ink}
            background={colors.contentBackground}
          >
            <section className="p-4 sm:p-6 lg:p-8">
              {children}
            </section>
          </RetroPanelBox>

          <RetroGlobalStyles colors={colors} />
        </main>

        <RetroFooter siteName={siteName} colors={colors} copy={copy} navItems={navItems} />
      </div>
    </div>
  );
}
