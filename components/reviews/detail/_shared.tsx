import { getModuleConfig } from '@/lib/templates/config';

export const templateInk = 'var(--template-ink, #111111)';
export const templateMutedText = 'var(--template-muted-text, #6b7280)';
export const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';
export const templateAccent = 'var(--template-accent, #e5201b)';

export const reviewsConfig = getModuleConfig('reviews');

export function TypeBadge({ type }: { type: string }) {
  const style = reviewsConfig.colors.typeStyles[type] ?? reviewsConfig.colors.typeStyles['other' as keyof typeof reviewsConfig.colors.typeStyles];
  if (!style) return null;
  return (
    <span
      data-review-type-chip
      style={{
        background: style.bg,
        color: style.text,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '0.2rem 0.6rem',
        borderRadius: 999,
        textTransform: 'capitalize',
      }}
    >
      {type}
    </span>
  );
}

export function StarRating({ rating }: { rating: string | null }) {
  if (!rating) return null;
  const score = parseFloat(rating);
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex">
        <span style={{ color: templatePanelBorder, fontSize: '1.875rem', letterSpacing: '-0.025em' }}>★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap"
          style={{ color: '#facc15', fontSize: '1.875rem', letterSpacing: '-0.025em', width: `${pct}%` }}
        >★★★★★</span>
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: templateInk, fontVariantNumeric: 'tabular-nums' }}>
        {score.toFixed(1)}
      </span>
      <span style={{ color: templateMutedText }}>/ 10</span>
    </div>
  );
}
