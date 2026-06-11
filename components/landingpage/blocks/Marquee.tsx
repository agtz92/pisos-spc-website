/**
 * Marquee — scrolling text strip (Macro layout primarily).
 *
 * ``data`` shape: ``{ text: string, speed?: number }``.
 * The animation runs purely in CSS (translateX). speed is seconds per
 * full cycle; defaults to 30s for an unobtrusive scroll.
 */
import { t } from '../sections';

type MarqueeData = { text?: string; speed?: number };

export default function Marquee({ data }: { data: Record<string, unknown> }) {
  const d = data as MarqueeData;
  const text = d.text;
  if (!text) return null;
  const speed = d.speed && d.speed > 0 ? d.speed : 30;
  // Triple the text so the loop is visually seamless.
  const repeated = `${text} · ${text} · ${text}`;
  return (
    <section
      aria-hidden
      style={{
        background: t.ink,
        color: '#fff',
        overflow: 'hidden',
        padding: '14px 0',
        whiteSpace: 'nowrap',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          animation: `lp-marquee ${speed}s linear infinite`,
        }}
      >
        {repeated}
      </div>
      <style>{`
        @keyframes lp-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
