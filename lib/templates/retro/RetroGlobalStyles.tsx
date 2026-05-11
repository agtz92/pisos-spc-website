import { getTemplateConfig } from '../config';

type RetroColors = ReturnType<typeof getTemplateConfig<'retro'>>['colors'];

export function RetroGlobalStyles({ colors }: { colors: RetroColors }) {
  return (
    <style>{`
      @keyframes retroFadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes retroWiggle {
        0%   { transform: rotate(0deg); }
        20%  { transform: rotate(-8deg); }
        40%  { transform: rotate(8deg); }
        60%  { transform: rotate(-4deg); }
        80%  { transform: rotate(4deg); }
        100% { transform: rotate(0deg); }
      }

      .retro-shell {
        --retro-ink: ${colors.ink};
        --retro-panel-border: ${colors.panelBorder};
        --template-card-radius: 0px;
        --template-hero-shadow: none;
        font-family: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
      }

      /* ── Content entrance ── */
      .retro-main-panel {
        animation: retroFadeUp 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* ── Stamp wiggle on hover ── */
      .retro-stamp:hover {
        animation: retroWiggle 0.45s ease both;
      }

      .retro-shell a {
        text-decoration-thickness: 2px;
        text-underline-offset: 0.16em;
      }

      .retro-shell h1,
      .retro-shell h2,
      .retro-shell h3,
      .retro-shell h4,
      .retro-shell h5,
      .retro-shell h6 {
        color: ${colors.ink};
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: -0.04em;
        line-height: 0.96;
      }

      .retro-shell .retro-nav-link {
        color: ${colors.ink};
      }

      .retro-shell .retro-nav-link:nth-child(2n) {
        background: ${colors.navAltBackground};
      }

      .retro-shell .retro-nav-link:hover,
      .retro-shell .retro-nav-link:nth-child(2n):hover {
        background: ${colors.highlight};
        color: ${colors.highlightInk};
      }

      .retro-shell .retro-nav-link:nth-child(2n):hover {
        background: ${colors.highlightStrong};
      }

      .retro-shell .retro-nav-link:nth-child(6n),
      .retro-shell .retro-nav-link:last-child {
        border-right: none !important;
      }

      .retro-shell .retro-nav-link {
        border-bottom: none !important;
        transition: background 0.1s, color 0.1s, transform 0.08s, box-shadow 0.08s;
      }

      /* ── Nav press: physical push-down on click ── */
      .retro-shell .retro-nav-link:active {
        transform: translateY(2px) translateX(2px);
      }

      /* ── Article/card: physical lift (flat shadow grows as card peels up) ── */
      .retro-shell article {
        transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.18s ease;
      }

      .retro-shell article:not([data-post-detail]):not([data-recipe-detail]):not([data-review-detail]):not([data-listing-detail]):not([data-review-list-row]):not([data-review-leaderboard-row]):not([data-review-rail-card]):not([data-recipe-row]):not([data-recipe-macro-lead]):not([data-review-macro-row]):not([data-review-macro-lead]):not([data-product-macro-row]):not([data-product-macro-lead]):not([data-listing-macro-row]):not([data-listing-macro-lead]):hover {
        transform: translateY(-5px) translateX(-5px);
        box-shadow: 15px 15px 0 ${colors.ink} !important;
      }

      .retro-shell article:not([data-post-detail]):not([data-recipe-detail]):not([data-review-detail]):not([data-listing-detail]):not([data-review-list-row]):not([data-review-leaderboard-row]):not([data-review-rail-card]):not([data-recipe-row]):not([data-recipe-macro-lead]):not([data-review-macro-row]):not([data-review-macro-lead]):not([data-product-macro-row]):not([data-product-macro-lead]):not([data-listing-macro-row]):not([data-listing-macro-lead]):active {
        transform: translateY(2px) translateX(2px);
        box-shadow: 3px 3px 0 ${colors.ink} !important;
      }

      .retro-shell [data-review-rail-card]:hover {
        border-color: ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
      }

      /* ── Site name hover: shadow expands ── */
      .retro-site-name {
        display: inline-block;
        transition: text-shadow 0.18s ease;
      }

      .retro-site-name:hover {
        text-shadow: 4px 4px 0 ${colors.highlight} !important;
      }

      /* ── Image hover zoom (same wrapper trick as modern) ── */
      .retro-shell article > a:first-child,
      .retro-shell [class*="aspect-"] {
        overflow: hidden;
      }

      .retro-shell article > a:first-child img,
      .retro-shell [class*="aspect-"] img {
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .retro-shell article > a:first-child:hover img,
      .retro-shell [class*="aspect-"]:hover img {
        transform: scale(1.05);
      }

      .retro-shell img {
        border-radius: 16px !important;
        border: none !important;
        box-shadow: 0 0 0 1px rgba(23, 20, 18, 0.08);
      }

      .retro-shell article,
      .retro-shell [class*="card"],
      .retro-shell .prose pre,
      .retro-shell .prose blockquote {
        border-color: ${colors.panelBorder} !important;
      }

      .retro-shell [class*="overflow-x-auto"] {
        scrollbar-width: thin;
        scrollbar-color: ${colors.ink} ${colors.mutedPanelBackground};
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"] {
        border: 2px solid ${colors.panelBorder};
        border-radius: 18px;
        background: ${colors.panelBackground} !important;
        padding-block: 0.9rem !important;
        padding-inline: 1rem !important;
        box-shadow: inset 0 -3px 0 ${colors.panelBorder};
        cursor: grab;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        scroll-snap-type: x proximity;
        touch-action: pan-x;
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"]::-webkit-scrollbar {
        height: 12px;
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"]::-webkit-scrollbar-track {
        background: ${colors.mutedPanelBackground};
        border-top: 2px solid ${colors.panelBorder};
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"]::-webkit-scrollbar-thumb {
        background: ${colors.ink};
        border-radius: 999px;
        border: 2px solid ${colors.mutedPanelBackground};
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"]:active {
        cursor: grabbing;
      }

      .retro-shell [class*="overflow-x-auto"][class*="py-3"] > * {
        scroll-snap-align: start;
      }

      .retro-shell [class*="rounded-full"],
      .retro-shell [class*="rounded-md"] {
        border-color: ${colors.panelBorder} !important;
      }

      .retro-shell [class*="bg-blue-"],
      .retro-shell [class*="bg-indigo-"],
      .retro-shell [class*="bg-purple-"],
      .retro-shell [class*="bg-pink-"],
      .retro-shell [class*="bg-red-"],
      .retro-shell [class*="bg-yellow-"],
      .retro-shell [class*="bg-green-"],
      .retro-shell [class*="bg-orange-"] {
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
      }

      .retro-shell [class*="text-blue-"],
      .retro-shell [class*="text-indigo-"],
      .retro-shell [class*="text-purple-"],
      .retro-shell [class*="text-pink-"],
      .retro-shell [class*="text-red-"],
      .retro-shell [class*="text-yellow-"],
      .retro-shell [class*="text-green-"],
      .retro-shell [class*="text-orange-"] {
        color: ${colors.ink} !important;
      }

      .retro-shell .prose a {
        color: ${colors.link};
      }

      .retro-shell [data-score-chip] {
        border-radius: 0 !important;
        border: 2px solid ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em;
      }

      .retro-shell [data-score-tier="excellent"] {
        background: #b9d7a7 !important;
        color: #171412 !important;
      }

      .retro-shell [data-score-tier="great"] {
        background: #d7d4a7 !important;
        color: #171412 !important;
      }

      .retro-shell [data-score-tier="good"] {
        background: #f0c14b !important;
        color: #171412 !important;
      }

      .retro-shell [data-score-tier="mixed"] {
        background: #e5a85c !important;
        color: #171412 !important;
      }

      .retro-shell [data-score-tier="poor"] {
        background: #d8846a !important;
        color: #171412 !important;
      }

      .retro-shell [data-review-type-chip] {
        border-radius: 0 !important;
        border: 2px solid currentColor !important;
        box-shadow: 2px 2px 0 ${colors.ink};
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em;
      }

      .retro-shell h1[class*="mt-2"] {
        line-height: 0.94 !important;
        text-decoration-thickness: 3px;
        text-underline-offset: 0.12em;
      }

      /* ── Blog spotlight hero ─────────────────────────────────────── */

      .retro-shell [data-spotlight-hero] {
        border-radius: 0 !important;
        border: 4px solid ${colors.ink} !important;
        box-shadow: 10px 10px 0 ${colors.ink} !important;
      }

      .retro-shell [data-spotlight-hero] img {
        border-radius: 0 !important;
      }

      .retro-shell [data-spotlight-scrim] {
        background: linear-gradient(to bottom, transparent 20%, rgba(23,20,18,0.92) 100%) !important;
      }

      .retro-shell [data-spotlight-category] {
        border-radius: 0 !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        border: 2px solid ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        padding: 0.3rem 0.8rem !important;
        letter-spacing: 0.1em !important;
      }

      /* ── Macro recipe layout ─────────────────────────────────────── */

      .retro-shell [data-recipe-macro-lead] img,
      .retro-shell [data-recipe-row] img {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .retro-shell [data-recipe-macro-lead] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        padding: 1.25rem 1.5rem !important;
        margin-bottom: 1rem !important;
      }

      .retro-shell [data-recipe-row] {
        border: 3px solid ${colors.ink} !important;
        border-bottom: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        margin-bottom: 1.25rem !important;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }

      .retro-shell [data-recipe-row]:hover {
        transform: translateY(-3px) translateX(-3px) !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-recipe-row] > a {
        border: none !important;
      }

      /* ── Blog featured hero ──────────────────────────────────────── */

      .retro-shell [data-post-hero] > a:first-child {
        border: 4px solid ${colors.ink} !important;
        border-radius: 0 !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
      }

      .retro-shell [data-post-hero] > div {
        border-top: 4px solid ${colors.ink};
        margin-top: 1.25rem;
        padding-top: 1.25rem;
      }

      .retro-shell [data-post-hero] [data-post-category] {
        display: inline-block !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        border: 2px solid ${colors.ink} !important;
        border-radius: 0 !important;
        padding: 0.25rem 0.8rem !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.1em !important;
        text-transform: uppercase !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        text-decoration: none !important;
        margin-bottom: 1rem !important;
      }

      .retro-shell [data-post-hero] > div > p {
        color: ${colors.mutedText} !important;
        max-width: 34rem !important;
      }

      .retro-shell [data-post-hero] > div > div:last-child {
        margin-top: 1.2rem !important;
        gap: 0.6rem !important;
        font-size: 0.78rem !important;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .retro-shell [data-post-hero] > div > div:last-child span:first-child {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif;
        color: ${colors.ink} !important;
      }

      .retro-shell .prose code {
        background: ${colors.mutedPanelBackground};
        border: 1px solid ${colors.panelBorder};
      }

      .retro-shell [class*="rounded-xl"],
      .retro-shell [class*="rounded-2xl"] {
        border-radius: 18px !important;
      }

      .retro-shell [class*="bg-primary"] {
        background: ${colors.highlightStrong} !important;
        color: ${colors.ink} !important;
        border-radius: 14px !important;
        box-shadow: none !important;
      }

      @media (max-width: 1279px) {
        .retro-shell .retro-nav-link:nth-child(3n) {
          border-right: none !important;
        }

        .retro-shell .retro-nav-link:nth-last-child(-n + 3) {
          border-bottom: none !important;
        }
      }

      @media (max-width: 639px) {
        .retro-shell .retro-nav-link:nth-child(2n) {
          border-right: none !important;
        }

        .retro-shell .retro-nav-link:nth-last-child(-n + 2) {
          border-bottom: none !important;
        }
      }

      /* ── Recipes ─────────────────────────────────────────────────── */

      .retro-shell [data-recipe-hero] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 20px !important;
      }

      .retro-shell [data-recipe-hero] > div:last-child {
        border-top: 3px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        padding: 1.5rem 1.75rem !important;
      }

      .retro-shell [data-recipe-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-recipe-card] > div:last-child {
        border-top: 3px solid var(--template-ink) !important;
        background: var(--template-panel) !important;
      }

      .retro-shell [data-recipe-category] {
        border-radius: 10px !important;
        border: 2px solid var(--template-ink) !important;
        background: var(--template-panel) !important;
        color: var(--template-ink) !important;
        box-shadow: 2px 2px 0 var(--template-ink) !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
        padding: 0.22rem 0.65rem !important;
        backdrop-filter: none !important;
        display: inline-block !important;
        width: fit-content !important;
        align-self: flex-start !important;
      }

      .retro-shell [data-recipe-difficulty] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-listing-type-badge],
      .retro-shell [data-listing-category-badge] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
        padding: 0.22rem 0.65rem !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-listing-primary-btn] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        text-shadow: none !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-listing-primary-btn]:hover {
        background: ${colors.highlightStrong} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-listing-secondary-btn] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-listing-secondary-btn]:hover {
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-listing-amenity-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-recipe-section] {
        border-bottom: 3px solid ${colors.ink} !important;
        padding-bottom: 0.6rem !important;
      }

      .retro-shell [data-recipe-section] > div:first-child {
        display: none !important;
      }

      .retro-shell [data-recipe-section] > div:last-child {
        display: none !important;
      }

      .retro-shell [data-recipe-section] > span {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.78rem !important;
        letter-spacing: 0.16em !important;
        opacity: 1 !important;
        color: ${colors.ink} !important;
      }

      .retro-shell [data-recipe-strip] {
        border: 2px solid ${colors.panelBorder} !important;
        border-radius: 18px !important;
        background: ${colors.mutedPanelBackground} !important;
        padding: 1rem !important;
        box-shadow: inset 0 -3px 0 ${colors.panelBorder} !important;
        scrollbar-width: thin;
        scrollbar-color: ${colors.ink} ${colors.mutedPanelBackground};
      }

      .retro-shell [data-recipe-strip]::-webkit-scrollbar {
        height: 10px;
      }
      .retro-shell [data-recipe-strip]::-webkit-scrollbar-track {
        background: ${colors.mutedPanelBackground};
        border-top: 2px solid ${colors.panelBorder};
      }
      .retro-shell [data-recipe-strip]::-webkit-scrollbar-thumb {
        background: ${colors.ink};
        border-radius: 999px;
        border: 2px solid ${colors.mutedPanelBackground};
      }

      /* ── Recipe detail page ──────────────────────────────────────── */

      .retro-shell [data-recipe-stat] {
        border: 2px solid ${colors.ink} !important;
        border-radius: 12px !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
      }

      .retro-shell [data-recipe-stat] span:first-child {
        letter-spacing: 0.1em !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
      }

      .retro-shell [data-recipe-difficulty-stat] {
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
      }

      .retro-shell [data-recipe-step-number] {
        border: 2px solid ${colors.ink} !important;
        border-radius: 10px !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
      }

      .retro-shell [data-recipe-ingredients] ul li > span:first-child {
        background: ${colors.ink} !important;
        width: 6px !important;
        height: 6px !important;
        border-radius: 2px !important;
      }

      .retro-shell [data-recipe-notes] {
        border: 3px solid ${colors.ink} !important;
        border-left: 5px solid ${colors.highlight} !important;
        border-radius: 14px !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-recipe-notes] h3 {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        color: ${colors.ink} !important;
      }

      /* ── Category Filter Bar ─────────────────────────────────────── */

      .retro-shell [data-category-pill] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.7rem !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        transition: box-shadow 0.1s, transform 0.1s !important;
      }

      .retro-shell [data-category-pill]:hover {
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 1px 1px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      /* ── Blog ────────────────────────────────────────────────────── */

      .retro-shell [data-post-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-post-card] > div:last-child,
      .retro-shell [data-post-card] > .pt-3,
      .retro-shell [data-post-card] > .pt-4 {
        border-top: 3px solid ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
      }

      .retro-shell [data-post-category] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
        padding: 0.22rem 0.65rem !important;
        backdrop-filter: none !important;
        text-decoration: none !important;
        display: inline-block !important;
        margin-bottom: 0.6rem !important;
      }

      .retro-shell [data-post-hero] > a:first-child {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 20px !important;
      }

      .retro-shell [data-post-hero] > div {
        border-top: none !important;
        background: transparent !important;
        padding-top: 1.25rem !important;
      }

      .retro-shell [data-post-section] {
        border-bottom: 3px solid ${colors.ink} !important;
        padding-bottom: 0.6rem !important;
      }

      .retro-shell [data-post-section] > div:first-child {
        display: none !important;
      }

      .retro-shell [data-post-section] > div:last-child {
        display: none !important;
      }

      .retro-shell [data-post-section] > span {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.78rem !important;
        letter-spacing: 0.16em !important;
        opacity: 1 !important;
        color: ${colors.ink} !important;
      }

      .retro-shell [data-latest-rail] {
        border: 2px solid ${colors.panelBorder} !important;
        border-radius: 18px !important;
        background: ${colors.mutedPanelBackground} !important;
        padding: 1.25rem !important;
        box-shadow: inset 0 -3px 0 ${colors.panelBorder} !important;
      }

      .retro-shell [data-latest-rail] > div {
        border-left: 3px solid ${colors.ink} !important;
      }

      /* ── Blog detail page ────────────────────────────────────────── */

      .retro-shell [data-post-detail-hero] {
        border: 3px solid ${colors.ink} !important;
        border-radius: 18px !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
      }

      .retro-shell [data-post-detail-byline] {
        border-top: 3px solid ${colors.ink} !important;
        border-bottom: 3px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
      }

      .retro-shell [data-post-detail-tag] {
        border: 2px solid ${colors.ink} !important;
        border-radius: 8px !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.04em !important;
      }

      .retro-shell [data-post-detail-tag]:hover {
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
      }

      .retro-shell [data-post-detail-back] {
        border: 2px solid ${colors.ink} !important;
        border-radius: 8px !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
        padding: 0.3rem 0.75rem !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
        opacity: 1 !important;
      }

      .retro-shell [data-post-detail-back]:hover {
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 1px 1px 0 ${colors.ink} !important;
      }

      /* ── Products ────────────────────────────────────────────────── */

      .retro-shell [data-product-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-product-card] > div:last-child {
        border-top: 3px solid ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
      }

      .retro-shell [data-product-category] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
        padding: 0.2rem 0.6rem !important;
        backdrop-filter: none !important;
        display: inline-block !important;
        width: fit-content !important;
      }

      .retro-shell [data-product-price] {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: -0.02em !important;
      }

      .retro-shell [data-product-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-product-hero] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-product-hero] > div:last-child {
        border-left: 3px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-product-cta] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.06em !important;
        text-shadow: none !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
        background-image: none !important;
      }

      .retro-shell [data-product-cta]:hover {
        background: ${colors.highlightStrong} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      /* ── Landing Pages ───────────────────────────────────────── */

      .retro-shell [data-lp-badge] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.1em !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-lp-primary-cta] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.04em !important;
        text-shadow: none !important;
        background-image: none !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-lp-primary-cta]:hover {
        background: ${colors.highlightStrong} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-lp-secondary-cta] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.04em !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-lp-secondary-cta]:hover {
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-lp-feature-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-post-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-product-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-review-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-testimonial-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-pricing-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-lp-pricing-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.ink} !important;
        color: ${colors.panelBackground} !important;
        box-shadow: 2px 2px 0 ${colors.panelBorder} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
      }

      .retro-shell [data-lp-faq-item] {
        border: 2px solid ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        border-radius: 14px !important;
      }

      .retro-shell [data-lp-stat-item] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 18px !important;
        padding: 1.5rem !important;
      }

      .retro-shell [data-lp-feature-link] {
        border: 2px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-lp-feature-link]:hover {
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-lp-module-link] {
        border: 2px solid ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        border-radius: 12px !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }
      .retro-shell [data-lp-module-link]:hover {
        box-shadow: 1px 1px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      /* ── Product Macro Layout ────────────────────────────────── */

      .retro-shell [data-product-macro-lead] img,
      .retro-shell [data-product-macro-row] img {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .retro-shell [data-product-macro-lead] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        padding: 1.25rem 1.5rem !important;
        margin-bottom: 1rem !important;
      }

      .retro-shell [data-product-macro-row] {
        border: 3px solid ${colors.ink} !important;
        border-bottom: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        margin-bottom: 1.25rem !important;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }

      .retro-shell [data-product-macro-row]:hover {
        transform: translateY(-3px) translateX(-3px) !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-product-macro-row] > a {
        border: none !important;
      }

      /* ── Product Catalog Row ─────────────────────────────────── */

      .retro-shell [data-product-row] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 14px !important;
      }

      /* ── Product Lookbook ────────────────────────────────────── */

      .retro-shell [data-lookbook-row] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 6px 6px 0 ${colors.ink} !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-lookbook-text] {
        background: ${colors.mutedPanelBackground} !important;
      }
      .retro-shell [data-lookbook-text="right"] {
        border-left: 3px solid ${colors.ink} !important;
      }
      .retro-shell [data-lookbook-text="left"] {
        border-right: 3px solid ${colors.ink} !important;
      }

      /* ── Product Sale Badge (QuickShop) ──────────────────────── */

      .retro-shell [data-product-sale-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        letter-spacing: 0.08em !important;
      }

      /* ── Product Detail Page ─────────────────────────────────── */

      .retro-shell [data-product-detail-image] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 20px !important;
      }

      .retro-shell [data-product-breadcrumb] {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        color: ${colors.mutedText} !important;
      }

      .retro-shell [data-product-stock] {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        color: ${colors.ink} !important;
      }

      /* ── Reviews ─────────────────────────────────────────────── */

      .retro-shell [data-review-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 6px 6px 0 ${colors.ink} !important;
        border-radius: 18px !important;
      }

      .retro-shell [data-featured-review] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 0 !important;
      }
      .retro-shell [data-featured-review] img,
      .retro-shell [data-review-card] img,
      .retro-shell [data-review-strip-card] img,
      .retro-shell [data-listing-card] img,
      .retro-shell [data-listing-hero-article] img,
      .retro-shell [data-listing-neighborhood-row] img,
      .retro-shell [data-listing-feed-row] img,
      .retro-shell [data-listing-compare-card] img {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .retro-shell [data-review-macro-lead] img,
      .retro-shell [data-review-macro-row] img {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .retro-shell [data-review-macro-lead] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        padding: 1.25rem 1.5rem !important;
        margin-bottom: 1rem !important;
      }

      .retro-shell [data-review-macro-row] {
        border: 3px solid ${colors.ink} !important;
        border-bottom: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        margin-bottom: 1.25rem !important;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }

      .retro-shell [data-review-macro-row]:hover {
        transform: translateY(-3px) translateX(-3px) !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-review-macro-row] > a {
        border: none !important;
      }

      .retro-shell [data-review-list-row] {
        border-bottom: 2px solid ${colors.ink} !important;
      }

      .retro-shell [data-review-leaderboard-row] {
        border-bottom: 2px solid ${colors.ink} !important;
      }

      .retro-shell [data-review-unscored-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 10px !important;
      }

      .retro-shell [data-review-rail-item] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 0 !important;
      }

      .retro-shell [data-review-rail-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-review-section-header] {
        border-bottom: 3px solid ${colors.ink} !important;
      }

      .retro-shell [data-review-count-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
      }

      .retro-shell [data-review-strip-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-left-width: 4px !important;
        border-radius: 0 !important;
      }

      /* ── Reviews Detail Page ─────────────────────────────────── */

      .retro-shell [data-review-breadcrumb] {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        color: ${colors.mutedText} !important;
      }

      .retro-shell [data-review-cover] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-review-pros-box] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-review-cons-box] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-review-verdict-box] {
        border: 3px solid ${colors.ink} !important;
        border-left-width: 6px !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      /* ── Listings Macro Layout ────────────────────────────────── */

      .retro-shell [data-listing-macro-lead] img,
      .retro-shell [data-listing-macro-row] img {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .retro-shell [data-listing-macro-lead] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        padding: 1.25rem 1.5rem !important;
        margin-bottom: 1rem !important;
      }

      .retro-shell [data-listing-macro-row] {
        border: 3px solid ${colors.ink} !important;
        border-bottom: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        margin-bottom: 1.25rem !important;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }

      .retro-shell [data-listing-macro-row]:hover {
        transform: translateY(-3px) translateX(-3px) !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      .retro-shell [data-listing-macro-row] > a {
        border: none !important;
      }

      /* ── Listings / Real Estate ───────────────────────────────── */

      .retro-shell [data-listing-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 24px !important;
      }

      .retro-shell [data-listing-type-badge] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-listing-category-badge] {
        border-radius: 6px !important;
        border: 1px solid ${colors.ink} !important;
        background: ${colors.panelBackground} !important;
        color: ${colors.ink} !important;
        backdrop-filter: none !important;
      }

      .retro-shell [data-listing-amenity-badge] {
        border-radius: 6px !important;
        border: 1px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
      }

      .retro-shell [data-listing-amenity-item] {
        border: none !important;
        background: transparent !important;
        color: ${colors.ink} !important;
      }

      .retro-shell [data-listing-primary-btn] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
      }

      .retro-shell [data-listing-primary-btn]:hover {
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-listing-secondary-btn] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
      }

      .retro-shell [data-listing-secondary-btn]:hover {
        box-shadow: 1px 1px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      .retro-shell [data-listing-cta] {
        border-radius: 10px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.highlight} !important;
        color: ${colors.highlightInk} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
      }

      .retro-shell [data-listing-cta]:hover {
        box-shadow: 2px 2px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      /* ListingsHero */

      .retro-shell [data-listings-hero] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 6px 6px 0 ${colors.ink} !important;
        border-radius: 24px !important;
      }

      .retro-shell [data-listings-hero-filter-btn] {
        border-radius: 8px !important;
        border: 2px solid ${colors.ink} !important;
        background: ${colors.mutedPanelBackground} !important;
        color: ${colors.ink} !important;
        box-shadow: 3px 3px 0 ${colors.ink} !important;
        transition: box-shadow 0.12s, transform 0.12s !important;
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
      }

      .retro-shell [data-listings-hero-filter-btn]:hover {
        box-shadow: 1px 1px 0 ${colors.ink} !important;
        transform: translate(2px, 2px) !important;
      }

      /* Featured layout hero */

      .retro-shell [data-listing-hero-article] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 0 !important;
        overflow: hidden !important;
      }

      .retro-shell [data-listings-section-header] {
        border-bottom: 3px solid ${colors.ink} !important;
        padding-bottom: 0.6rem !important;
        margin-bottom: 1.25rem !important;
      }

      /* Feed layout */

      .retro-shell [data-listing-feed-row] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 16px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-listing-feed-header] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 12px !important;
      }

      /* Neighborhood layout */

      .retro-shell [data-listing-neighborhood-row] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 12px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-listing-neighborhood-header] {
        border-bottom: 3px solid ${colors.ink} !important;
      }

      /* Compare layout */

      .retro-shell [data-listing-compare-card] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 6px 6px 0 ${colors.ink} !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }

      /* Listing detail page */

      .retro-shell [data-listing-breadcrumb] {
        font-family: "Arial Black", Impact, "Trebuchet MS", sans-serif !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        color: ${colors.mutedText} !important;
      }

      .retro-shell [data-listing-cover] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 8px 8px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        overflow: hidden !important;
      }

      .retro-shell [data-listing-price-box] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 5px 5px 0 ${colors.ink} !important;
        border-radius: 14px !important;
      }

      .retro-shell [data-listing-specs-box] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
      }

      .retro-shell [data-listing-amenities] {
        border: 3px solid ${colors.ink} !important;
        box-shadow: 4px 4px 0 ${colors.ink} !important;
        border-radius: 14px !important;
        background: ${colors.mutedPanelBackground} !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .retro-main-panel { animation: none; }
        .retro-stamp:hover { animation: none; }
        .retro-shell article { transition: none; }
        .retro-shell article > a:first-child img,
        .retro-shell [class*="aspect-"] img { transition: none; }
        .retro-shell .retro-nav-link { transition: none; }
      }
    `}</style>
  );
}
