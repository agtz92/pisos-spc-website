import { getTemplateConfig } from '../config';

type RetroColors = ReturnType<typeof getTemplateConfig<'retro'>>['colors'];

export function RetroBackgroundAdornment({
  adornment,
  colors,
}: {
  adornment: string;
  colors: RetroColors;
}) {
  if (adornment === 'paper') {
    return (
      <>
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.26, backgroundImage: colors.paperNoise, mixBlendMode: 'multiply' }} />
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.08, backgroundImage: `linear-gradient(${colors.ink} 1px, transparent 1px), linear-gradient(90deg, ${colors.ink} 1px, transparent 1px)`, backgroundSize: '112px 112px' }} />
      </>
    );
  }
  if (adornment === 'grid') {
    return (
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.12, backgroundImage: `linear-gradient(${colors.ink} 1px, transparent 1px), linear-gradient(90deg, ${colors.ink} 1px, transparent 1px)`, backgroundSize: '72px 72px' }} />
    );
  }
  if (adornment === 'dots') {
    return (
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, backgroundImage: `radial-gradient(circle, ${colors.ink} 1.5px, transparent 1.5px)`, backgroundSize: '28px 28px' }} />
    );
  }
  return null;
}
