import { getTemplateConfig } from '../config';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

export function FuturisticFramePill({ children, colors }: { children: React.ReactNode; colors: FuturisticColors }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-4 py-2"
      style={{
        border: `1px solid ${colors.panelBorder}`,
        background: colors.mutedPanelBackground,
        color: colors.ink,
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}
