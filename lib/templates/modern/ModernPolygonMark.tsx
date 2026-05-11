import type { ModernTemplateColors } from '../config';

export function ModernPolygonMark({ colors }: { colors: ModernTemplateColors }) {
  const accent = colors.accent;
  return (
    <span
      aria-hidden
      style={{ position: 'relative', display: 'inline-flex', width: 42, height: 52, flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', inset: '0 8px 10px 0', border: `3px solid ${accent}`, transform: 'rotate(45deg)', borderRadius: 2 }} />
      <span style={{ position: 'absolute', left: 18, top: 0, bottom: 10, width: 3, background: accent }} />
      <span style={{ position: 'absolute', left: 0, right: 8, top: 20, height: 3, background: accent }} />
      <span style={{ position: 'absolute', left: 0, bottom: 10, width: 24, height: 24, borderLeft: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`, transform: 'skewY(45deg)', transformOrigin: 'left bottom' }} />
    </span>
  );
}
