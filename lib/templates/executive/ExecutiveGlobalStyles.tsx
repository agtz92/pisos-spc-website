import type { ExecutiveTemplateColors } from '../config';

export function ExecutiveGlobalStyles({ colors }: { colors: ExecutiveTemplateColors }) {
  return (
    <style>{`
      @keyframes execFadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes execShimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      @keyframes execLogoPulse {
        0%,100% { box-shadow: 0 2px 8px color-mix(in srgb, ${colors.accent} 40%, transparent); }
        50%     { box-shadow: 0 2px 18px color-mix(in srgb, ${colors.accent} 65%, transparent); }
      }

      .executive-shell {
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        display: flex;
        flex-direction: column;
      }

      /* ── Content entrance ── */
      .executive-content {
        animation: execFadeUp 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* ── Accent stripe shimmer ── */
      .executive-accent-bar {
        background-size: 200% auto;
        animation: execShimmer 3.5s linear infinite;
      }

      /* ── Logo mark pulse on hover ── */
      .executive-logo-link:hover .executive-logo-mark {
        animation: execLogoPulse 1.2s ease-in-out infinite;
      }

      .executive-logo-link {
        transition: opacity 0.15s ease;
      }

      .executive-logo-link:hover {
        opacity: 0.88;
      }

      .executive-nav-link {
        position: relative;
        transition: opacity 0.15s ease, color 0.15s ease;
        border-radius: 6px;
      }

      .executive-nav-link::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0.875rem;
        right: 0.875rem;
        height: 2px;
        border-radius: 999px;
        background: ${colors.accent};
        transform: scaleX(0);
        transition: transform 0.18s ease;
      }

      .executive-nav-link:hover {
        opacity: 1 !important;
        color: ${colors.accent} !important;
      }

      .executive-nav-link:hover::after {
        transform: scaleX(1);
      }

      .executive-shell h1,
      .executive-shell h2,
      .executive-shell h3,
      .executive-shell h4,
      .executive-shell h5,
      .executive-shell h6 {
        color: ${colors.ink};
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .executive-shell a {
        text-underline-offset: 0.15em;
      }

      .executive-shell .prose a {
        color: ${colors.accent};
      }

      .executive-shell [class*="bg-white"] {
        background-color: ${colors.panelBackground} !important;
      }

      .executive-shell [class*="bg-gray-50"],
      .executive-shell [class*="bg-gray-100"],
      .executive-shell [class*="bg-slate-50"],
      .executive-shell [class*="bg-slate-100"] {
        background-color: ${colors.mutedPanelBackground} !important;
      }

      .executive-shell [class*="border-gray-200"],
      .executive-shell [class*="border-slate-200"] {
        border-color: ${colors.panelBorder} !important;
      }

      .executive-shell [class*="text-blue-600"],
      .executive-shell [class*="text-indigo-600"] {
        color: ${colors.accent} !important;
      }

      .executive-shell [class*="hover:text-blue-600"]:hover,
      .executive-shell [class*="hover:text-indigo-600"]:hover {
        color: ${colors.accentStrong} !important;
      }

      .executive-shell img {
        border-radius: 10px;
      }

      .executive-shell [class*="rounded-full"] {
        border-radius: 999px !important;
      }

      .executive-shell [class*="shadow-md"],
      .executive-shell [class*="hover:shadow-md"]:hover {
        box-shadow: 0 4px 16px rgba(30, 41, 59, 0.08) !important;
      }

      /* ── Landing page secondary CTA — always visible in executive ── */
      .executive-shell [data-lp-secondary-cta] {
        color: ${colors.accent} !important;
        border-color: ${colors.accent} !important;
        background: transparent !important;
      }

      .executive-shell [data-lp-secondary-cta]:hover {
        background: color-mix(in srgb, ${colors.accent} 10%, transparent) !important;
        color: ${colors.accentStrong} !important;
        border-color: ${colors.accentStrong} !important;
      }

      .executive-shell [data-review-type-chip] {
        background: ${colors.ink} !important;
        color: #ffffff !important;
        border-radius: 999px !important;
        font-size: 0.65rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        padding: 0.2rem 0.55rem !important;
        border: none !important;
      }

      .executive-shell [data-score-chip] {
        background: ${colors.accent} !important;
        color: #ffffff !important;
        box-shadow: 0 2px 8px color-mix(in srgb, ${colors.accent} 28%, transparent) !important;
        border-radius: 999px !important;
      }

      .executive-shell [data-score-chip] span {
        color: #ffffff !important;
      }

      /* ── Card hover lift ── */
      .executive-shell article {
        transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
      }

      .executive-shell article:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px color-mix(in srgb, ${colors.accent} 10%, rgba(30,41,59,0.1)) !important;
      }

      /* ── Image hover zoom ── */
      .executive-shell article > a:first-child,
      .executive-shell [class*="aspect-"] {
        overflow: hidden;
        border-radius: 10px;
      }

      .executive-shell article > a:first-child img,
      .executive-shell [class*="aspect-"] img {
        transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .executive-shell article > a:first-child:hover img,
      .executive-shell [class*="aspect-"]:hover img {
        transform: scale(1.04);
      }

      @media (max-width: 767px) {
        .executive-content {
          padding-bottom: 1.5rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .executive-content { animation: none; }
        .executive-accent-bar { animation: none; }
        .executive-shell article { transition: none; }
        .executive-shell article > a:first-child img,
        .executive-shell [class*="aspect-"] img { transition: none; }
        .executive-logo-link:hover .executive-logo-mark { animation: none; }
      }

      /* ──────────────────────────────────────────────────────────────────
         Landing Page · data-lp-on-dark contract.

         Layouts mark a section that sits on a dark background with
         data-lp-on-dark. The template is responsible for swapping
         headings, badges, and CTA chrome to its own LIGHT palette.
         The layout never picks colors itself — that keeps each tenant
         template fully in control of the resulting look.

         For Executive, "light" maps to panelBackground (the template's
         near-white surface) so the result is template-coherent instead
         of raw #fff.
      */
      .executive-shell [data-lp-on-dark] h1,
      .executive-shell [data-lp-on-dark] h2,
      .executive-shell [data-lp-on-dark] h3,
      .executive-shell [data-lp-on-dark] h4,
      .executive-shell [data-lp-on-dark] h5,
      .executive-shell [data-lp-on-dark] h6 {
        color: ${colors.panelBackground} !important;
      }

      .executive-shell [data-lp-on-dark] [data-lp-badge],
      .executive-shell [data-lp-on-dark] [data-lp-subhead] {
        color: color-mix(in srgb, ${colors.panelBackground} 85%, transparent) !important;
      }
      /* Body paragraphs sit one step more muted than subhead so the
         visual hierarchy reads correctly on dark backdrops. */
      .executive-shell [data-lp-on-dark] [data-lp-body] {
        color: color-mix(in srgb, ${colors.panelBackground} 75%, transparent) !important;
      }

      /* Secondary CTA on dark — swap the panel/accent override that
         applies on light backgrounds (defined above) for a light-on-dark
         palette. Border + text use the template's panel color so the
         button stays template-coherent, not raw white. */
      .executive-shell [data-lp-on-dark] [data-lp-secondary-cta] {
        color: ${colors.panelBackground} !important;
        border-color: color-mix(in srgb, ${colors.panelBackground} 55%, transparent) !important;
        background: transparent !important;
      }
      .executive-shell [data-lp-on-dark] [data-lp-secondary-cta]:hover {
        background: color-mix(in srgb, ${colors.panelBackground} 12%, transparent) !important;
        color: ${colors.panelBackground} !important;
        border-color: ${colors.panelBackground} !important;
      }

      /* Primary CTA on dark — flip to panelBackground bg + ink text so
         the button still passes contrast against the dark backdrop. */
      .executive-shell [data-lp-on-dark] [data-lp-primary-cta] {
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
      }
    `}</style>
  );
}
