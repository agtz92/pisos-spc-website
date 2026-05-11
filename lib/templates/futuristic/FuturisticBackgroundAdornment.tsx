import { getTemplateConfig } from '../config';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

export function FuturisticBackgroundAdornment({
  adornment,
  colors,
}: {
  adornment: string;
  colors: FuturisticColors;
}) {
  const base = { position: 'fixed' as const, inset: 0, zIndex: 0, pointerEvents: 'none' as const };

  const adornmentLayer = (() => {
    if (adornment === 'none') return null;
    if (adornment === 'grid') return (
      <>
        <div aria-hidden style={{ ...base, backgroundImage: colors.scanlineOverlay, opacity: 0.72 }} />
        <div aria-hidden style={{ ...base, backgroundImage: colors.gridOverlay, backgroundSize: '72px 72px', maskImage: `linear-gradient(180deg, transparent 0%, ${colors.ink} 16%, ${colors.ink} 68%, transparent 100%)`, opacity: 0.38 }} />
      </>
    );
    if (adornment === 'scanlines') return (
      <div aria-hidden style={{ ...base, backgroundImage: colors.scanlineOverlay, opacity: 1 }} />
    );
    if (adornment === 'dots') return (
      <div aria-hidden style={{ ...base, backgroundImage: `radial-gradient(circle, ${colors.accentBorder} 1.5px, transparent 1.5px)`, backgroundSize: '28px 28px', opacity: 0.7 }} />
    );
    if (adornment === 'circuit') return (
      <>
        <div aria-hidden style={{ ...base, backgroundImage: `linear-gradient(${colors.accentBorder} 1px, transparent 1px), linear-gradient(90deg, ${colors.accentBorder} 1px, transparent 1px)`, backgroundSize: '36px 36px', opacity: 0.22 }} />
        <div aria-hidden style={{ ...base, backgroundImage: `linear-gradient(${colors.accentBorder} 1px, transparent 1px), linear-gradient(90deg, ${colors.accentBorder} 1px, transparent 1px)`, backgroundSize: '144px 144px', opacity: 0.38 }} />
      </>
    );
    return null;
  })();

  return (
    <>
      {adornmentLayer}
      {/* Radial glow blobs */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `
            radial-gradient(circle at 0% 34%, ${colors.accentGlow} 0%, transparent 18%),
            radial-gradient(circle at 100% 36%, ${colors.accentGlow} 0%, transparent 18%),
            radial-gradient(circle at 50% 0%, ${colors.accentBorder} 0%, transparent 28%)
          `,
          opacity: 0.92,
        }}
      />
      {/* Top glow line */}
      <div
        aria-hidden
        style={{
          position: 'fixed', left: 0, right: 0, top: 0, height: 2, zIndex: 0, pointerEvents: 'none',
          background: colors.topGlowLine,
          boxShadow: `0 0 22px ${colors.accentGlow}`,
        }}
      />
    </>
  );
}
