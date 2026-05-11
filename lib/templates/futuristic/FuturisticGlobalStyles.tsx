import { getTemplateConfig } from '../config';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

export function FuturisticGlobalStyles({ colors }: { colors: FuturisticColors }) {
  return (
    <style>{`
      .futuristic-shell {
        font-family: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
      }

      .futuristic-shell a {
        text-underline-offset: 0.16em;
        text-decoration-thickness: 2px;
      }

      .futuristic-shell h1,
      .futuristic-shell h2,
      .futuristic-shell h3,
      .futuristic-shell h4,
      .futuristic-shell h5,
      .futuristic-shell h6 {
        color: ${colors.ink};
        font-family: "Trebuchet MS", "Segoe UI", sans-serif !important;
        letter-spacing: -0.03em;
      }

      .futuristic-shell p,
      .futuristic-shell li,
      .futuristic-shell span {
        color: inherit;
      }

      .futuristic-nav-link {
        color: ${colors.mutedText};
        border: 1px solid transparent;
        transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
      }

      .futuristic-nav-link:hover {
        color: ${colors.ink};
        border-color: ${colors.panelBorder};
        background: ${colors.mutedPanelBackground};
        transform: translateY(-1px);
        box-shadow: 0 0 20px ${colors.accentBorder};
      }

      .futuristic-primary-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 30px ${colors.accentGlow};
      }

      .futuristic-shell article:not([data-post-row]):not([data-post-hero]):not([data-recipe-row]):not([data-recipe-macro-lead]):not([data-review-macro-row]):not([data-review-macro-lead]):not([data-product-macro-row]):not([data-product-macro-lead]):not([data-listing-macro-row]):not([data-listing-macro-lead]),
      .futuristic-shell article:not([data-post-row]):not([data-post-hero]):not([data-recipe-row]):not([data-recipe-macro-lead]):not([data-review-macro-row]):not([data-review-macro-lead]):not([data-product-macro-row]):not([data-product-macro-lead]):not([data-listing-macro-row]):not([data-listing-macro-lead]) > a,
      .futuristic-shell [class*="rounded-[1"],
      .futuristic-shell [class*="rounded-[2"],
      .futuristic-shell [class*="rounded-[3"],
      .futuristic-shell .rounded-lg,
      .futuristic-shell .rounded-xl,
      .futuristic-shell .rounded-2xl,
      .futuristic-shell .rounded-3xl {
        border-color: ${colors.panelBorder} !important;
        border-radius: 4px !important;
      }

      .futuristic-shell article:not([data-post-row]):not([data-post-hero]):not([data-recipe-row]):not([data-recipe-macro-lead]):not([data-review-macro-row]):not([data-review-macro-lead]):not([data-product-macro-row]):not([data-product-macro-lead]):not([data-listing-macro-row]):not([data-listing-macro-lead]) {
        background: ${colors.panelBackground} !important;
      }

      .futuristic-shell [data-featured-review] {
        box-shadow: 0 0 0 1px var(--score-shadow, transparent), 0 24px 48px var(--score-shadow, transparent) !important;
      }

      .futuristic-shell [data-score-chip] {
        box-shadow: 0 2px 8px var(--score-shadow, transparent);
      }

      .futuristic-shell img {
        border: 1px solid ${colors.imageBorder};
        filter: saturate(0.92) brightness(0.9);
      }

      .futuristic-shell [class*="bg-gray-100"],
      .futuristic-shell [class*="bg-slate-100"],
      .futuristic-shell [class*="bg-neutral-100"] {
        background: ${colors.mutedPanelBackground} !important;
      }

      .futuristic-shell [class*="bg-primary"],
      .futuristic-shell [class*="bg-blue-"],
      .futuristic-shell [class*="bg-indigo-"],
      .futuristic-shell [class*="bg-cyan-"] {
        background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentStrong} 100%) !important;
        color: ${colors.ink} !important;
        box-shadow: 0 0 24px ${colors.accentBorder} !important;
      }

      .futuristic-shell .prose a {
        color: ${colors.accent};
      }

      .futuristic-shell ::selection {
        background: ${colors.accent};
        color: ${colors.ink};
      }

      .futuristic-shell .scrollbar-none {
        scrollbar-width: thin;
        scrollbar-color: ${colors.accentBorder} transparent;
        padding-bottom: 0.35rem;
      }

      .futuristic-shell .scrollbar-none::-webkit-scrollbar {
        height: 10px;
      }

      .futuristic-shell .scrollbar-none::-webkit-scrollbar-track {
        background: ${colors.mutedPanelBackground};
        border-radius: 999px;
        border: 1px solid ${colors.panelBorder};
      }

      .futuristic-shell .scrollbar-none::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, ${colors.accentBorder} 0%, ${colors.accentGlow} 100%);
        border-radius: 999px;
        border: 2px solid ${colors.mutedPanelBackground};
      }

      .futuristic-shell .scrollbar-none::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentStrong} 100%);
      }

      .futuristic-shell [data-recipes-page] {
        background: transparent !important;
      }
      .futuristic-shell [data-recipe-hero],
      .futuristic-shell [data-recipe-card] {
        border-radius: 4px !important;
      }
      .futuristic-shell [data-recipe-hero] > div,
      .futuristic-shell [data-recipe-card] > div:last-child {
        background: ${colors.panelBackground} !important;
        border-top-color: ${colors.panelBorder} !important;
      }

      .futuristic-shell [data-recipe-category] {
        background: ${colors.panelBackground} !important;
        color: ${colors.accent} !important;
        border: 1px solid ${colors.accentBorder} !important;
        box-shadow: 0 0 8px ${colors.accentBorder} !important;
        border-radius: 6px !important;
        backdrop-filter: blur(8px) !important;
        font-size: 0.65rem !important;
        letter-spacing: 0.1em !important;
        font-weight: 700 !important;
      }

      .futuristic-shell [data-recipe-difficulty] {
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.mutedText} !important;
        border: 1px solid ${colors.panelBorder} !important;
        box-shadow: none !important;
        border-radius: 6px !important;
        backdrop-filter: none !important;
      }
    `}</style>
  );
}
