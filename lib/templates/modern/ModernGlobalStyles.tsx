import type { ModernTemplateColors } from '../config';

export function ModernGlobalStyles({ colors }: { colors: ModernTemplateColors }) {
  return (
    <style>{`
      @keyframes modernFadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes modernShimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      @keyframes modernGlow {
        0%, 100% { filter: drop-shadow(0 0 4px color-mix(in srgb, ${colors.accent} 0%, transparent)); }
        50%       { filter: drop-shadow(0 0 12px color-mix(in srgb, ${colors.accent} 70%, transparent)); }
      }

      @keyframes modernGridDrift {
        0%   { background-position: 0px 0px; }
        100% { background-position: 120px 120px; }
      }

      .modern-shell {
        --modern-accent: ${colors.accent};
        --modern-accent-soft: ${colors.accentSoft};
        --modern-accent-strong: ${colors.accentStrong};
        --modern-ink: ${colors.ink};
        --modern-border: rgba(22, 18, 24, 0.1);
        font-family: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
      }

      /* ── Content entrance ── */
      .modern-content {
        animation: modernFadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* ── Nav links: sliding underline ── */
      .modern-nav-link {
        position: relative;
        transition: color 0.18s ease;
        text-decoration: none !important;
      }

      .modern-nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: ${colors.accent};
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        border-radius: 99px;
      }

      .modern-nav-link:hover {
        opacity: 1;
        transform: none;
        color: ${colors.accentStrong} !important;
      }

      .modern-nav-link:hover::after {
        transform: scaleX(1);
      }

      /* ── Logo glow on hover ── */
      .modern-logo-link {
        transition: transform 0.22s ease;
      }

      .modern-logo-link:hover {
        transform: translateX(2px);
      }

      .modern-logo-link:hover .modern-polygon-mark {
        animation: modernGlow 1.4s ease-in-out infinite;
      }

      /* ── Shimmer accent bar ── */
      .modern-accent-bar {
        background-size: 200% auto;
        animation: modernShimmer 2.8s linear infinite;
      }

      /* ── Grid background drift ── */
      .modern-grid-bg {
        animation: modernGridDrift 28s linear infinite;
      }

      /* ── Card/article hover lift ── */
      .modern-shell article {
        color: var(--modern-ink);
        transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease;
      }

      .modern-shell article:hover {
        transform: translateY(-5px);
        box-shadow: 0 24px 48px color-mix(in srgb, ${colors.accent} 10%, rgba(22,18,24,0.1)) !important;
      }

      .modern-shell article h2,
      .modern-shell article h3 {
        text-wrap: balance;
      }

      /* ── Article links: accent color sweep ── */
      .modern-shell article a {
        color: inherit;
        transition: color 0.18s ease;
      }

      .modern-shell article a:hover {
        color: ${colors.accent};
      }

      /* ── Image hover zoom ── */
      .modern-shell article > a:first-child,
      .modern-shell [class*="aspect-"] {
        border-radius: 18px;
        overflow: hidden;
      }

      .modern-shell article > a:first-child img,
      .modern-shell [class*="aspect-"] img {
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .modern-shell article > a:first-child:hover img,
      .modern-shell [class*="aspect-"]:hover img {
        transform: scale(1.05);
      }

      .modern-shell a {
        text-decoration-thickness: 2px;
        text-underline-offset: 0.15em;
      }

      .modern-shell h1,
      .modern-shell h2,
      .modern-shell h3,
      .modern-shell h4,
      .modern-shell h5,
      .modern-shell h6 {
        color: var(--modern-ink);
        font-family: "Arial Black", Impact, "Segoe UI", sans-serif !important;
        letter-spacing: -0.04em;
        line-height: 0.96;
      }

      .modern-shell p,
      .modern-shell li,
      .modern-shell span {
        color: inherit;
      }

      .modern-shell img {
        border-radius: 18px;
      }

      .modern-shell [class*="rounded-full"] {
        border-radius: 999px !important;
      }

      .modern-shell [class*="border-gray-200"],
      .modern-shell [class*="border-slate-200"] {
        border-color: var(--modern-border) !important;
      }

      .modern-shell [class*="bg-white"] {
        background-color: ${colors.panelBackground} !important;
      }

      .modern-shell [class*="bg-gray-50"],
      .modern-shell [class*="bg-gray-100"],
      .modern-shell [class*="bg-slate-100"] {
        background-color: ${colors.mutedPanelBackground} !important;
      }

      .modern-shell [class*="text-blue-600"],
      .modern-shell [class*="text-indigo-600"] {
        color: var(--modern-accent) !important;
      }

      .modern-shell [class*="hover:text-blue-600"]:hover,
      .modern-shell [class*="hover:text-indigo-600"]:hover {
        color: var(--modern-accent-strong) !important;
      }

      .modern-shell [class*="shadow-md"],
      .modern-shell [class*="hover:shadow-md"]:hover {
        box-shadow: 0 20px 45px rgba(22, 18, 24, 0.08) !important;
      }

      .modern-shell .prose {
        padding: 1.5rem 2rem;
        background: ${colors.panelBackground};
        border-radius: 12px;
      }

      .modern-shell .prose h1,
      .modern-shell .prose h2,
      .modern-shell .prose h3 {
        line-height: 1.02;
      }

      .modern-shell .prose h2,
      .modern-shell .prose h3 {
        display: table !important;
        background: ${colors.accentSoft} !important;
        padding: 0.5rem 1rem !important;
        border-radius: 5px !important;
      }

      @media (max-width: 767px) {
        .modern-content {
          padding-bottom: 2rem;
        }

        .modern-shell h1,
        .modern-shell h2,
        .modern-shell h3 {
          letter-spacing: -0.03em;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .modern-content { animation: none; }
        .modern-accent-bar { animation: none; }
        .modern-grid-bg { animation: none; }
        .modern-shell article { transition: none; }
        .modern-shell article > a:first-child img,
        .modern-shell [class*="aspect-"] img { transition: none; }
      }

      /* ──────────────────────────────────────────────────────────────────
         Landing Page · "data-lp-on-dark" contract — see ExecutiveGlobalStyles
         for the full rationale. Layouts mark <section> elements that sit
         on a dark backdrop; this block flips the heading + chrome to a
         light palette derived from the template's own panel color, so
         the result is template-coherent, not raw white.
      */
      .modern-shell [data-lp-on-dark] h1,
      .modern-shell [data-lp-on-dark] h2,
      .modern-shell [data-lp-on-dark] h3,
      .modern-shell [data-lp-on-dark] h4,
      .modern-shell [data-lp-on-dark] h5,
      .modern-shell [data-lp-on-dark] h6 {
        color: ${colors.panelBackground} !important;
      }

      .modern-shell [data-lp-on-dark] [data-lp-badge],
      .modern-shell [data-lp-on-dark] [data-lp-subhead] {
        color: color-mix(in srgb, ${colors.panelBackground} 85%, transparent) !important;
      }
      /* Body paragraphs sit one step more muted than subhead so the
         visual hierarchy reads correctly on dark backdrops. */
      .modern-shell [data-lp-on-dark] [data-lp-body] {
        color: color-mix(in srgb, ${colors.panelBackground} 75%, transparent) !important;
      }

      .modern-shell [data-lp-on-dark] [data-lp-primary-cta] {
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
      }

      .modern-shell [data-lp-on-dark] [data-lp-secondary-cta] {
        color: ${colors.panelBackground} !important;
        border-color: color-mix(in srgb, ${colors.panelBackground} 55%, transparent) !important;
        background: transparent !important;
      }
      .modern-shell [data-lp-on-dark] [data-lp-secondary-cta]:hover {
        background: color-mix(in srgb, ${colors.panelBackground} 12%, transparent) !important;
        color: ${colors.panelBackground} !important;
        border-color: ${colors.panelBackground} !important;
      }
    `}</style>
  );
}
