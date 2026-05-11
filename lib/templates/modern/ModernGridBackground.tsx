import type { ModernTemplateColors } from '../config';

export function ModernGridBackground({ colors }: { colors: ModernTemplateColors }) {
  return (
    <div
      aria-hidden
      className="modern-grid-bg"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px), linear-gradient(${colors.gridLineSoft} 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.2), transparent 60%)',
      }}
    />
  );
}
