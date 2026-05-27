import { getTemplateConfig } from '../config';
import { FuturisticFramePill } from './FuturisticFramePill';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

interface FuturisticContentFrameProps {
  children: React.ReactNode;
  colors: FuturisticColors;
  mainContainerClassName: string;
  footerPrefix: string;
}

export function FuturisticContentFrame({ children, colors, mainContainerClassName, footerPrefix }: FuturisticContentFrameProps) {
  return (
    <main className={`${mainContainerClassName} pb-16 sm:pb-24`}>
      <section
        className="overflow-hidden rounded-[4px] border"
        style={{ borderColor: colors.panelBorder, background: colors.panelBackground, boxShadow: `0 0 54px ${colors.accentBorder}` }}
      >
        <div
          className="flex flex-col gap-4 border-b px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
          style={{ borderColor: colors.panelBorder, background: colors.mutedPanelBackground }}
        >
          <div>
            <p style={{ color: colors.accent, fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Content Matrix
            </p>
            <p className="mt-2 text-sm" style={{ color: colors.mutedText }}>
              The active module layout renders inside this shared futuristic frame.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FuturisticFramePill colors={colors}>Live Surface</FuturisticFramePill>
            <FuturisticFramePill colors={colors}>{footerPrefix} Runtime</FuturisticFramePill>
          </div>
        </div>

        <div
          className="relative p-3 sm:p-5 lg:p-6"
          style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 12%), ${colors.pageBackground}` }}
        >
          <div
            className="overflow-hidden rounded-[4px] border"
            style={{ borderColor: colors.panelBorder, background: colors.panelBackground, boxShadow: `inset 0 1px 0 ${colors.accentBorder}, 0 0 32px ${colors.accentBorder}` }}
          >
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
