import Link from 'next/link';
import { getTemplateConfig } from '../config';
import { RetroPanelBox } from './RetroPanelBox';

type RetroColors = ReturnType<typeof getTemplateConfig<'retro'>>['colors'];
type RetroCopy = ReturnType<typeof getTemplateConfig<'retro'>>['copy'];

function RetroStamp({ colors }: { colors: RetroColors }) {
  return (
    <span
      aria-hidden
      className="retro-stamp"
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: 58,
        height: 58,
        flexShrink: 0,
        borderRadius: 16,
        border: `3px solid ${colors.ink}`,
        background: colors.panelBackground,
        boxShadow: `5px 5px 0 ${colors.ink}`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: '999px',
          border: `3px solid ${colors.ink}`,
          background: colors.highlight,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 46,
          height: 10,
          background: colors.panelBackground,
          borderTop: `3px solid ${colors.ink}`,
          borderBottom: `3px solid ${colors.ink}`,
          transform: 'rotate(-28deg)',
        }}
      />
    </span>
  );
}

interface RetroHeaderProps {
  siteName: string;
  colors: RetroColors;
  copy: RetroCopy & Record<string, string>;
  navItems: { label: string; href: string }[];
  currentYear: number;
}

export function RetroHeader({ siteName, colors, copy, navItems, currentYear }: RetroHeaderProps) {
  return (
    <header className="px-3 py-3 sm:px-5 sm:py-5">
      <RetroPanelBox
        className="mx-auto max-w-7xl overflow-hidden"
        ink={colors.ink}
        background={colors.panelBackground}
      >
        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]" style={{ minHeight: 0 }}>
          {/* ── Left column: branding ── */}
          <div
            className="flex flex-col justify-between border-b p-5 lg:border-b-0 lg:border-r"
            style={{ borderColor: colors.panelBorder, background: colors.mutedPanelBackground }}
          >
            <div>
              <div className="flex items-start gap-4">
                <RetroStamp colors={colors} />
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.mutedText }}>
                    {copy.eyebrow}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.mutedText }}>
                  {copy.metaLabel}
                </p>
                <Link
                  href="/"
                  className="retro-site-name mt-2 no-underline"
                  style={{
                    color: colors.ink,
                    fontFamily: '"Arial Black", Impact, "Trebuchet MS", sans-serif',
                    fontSize: 'clamp(2.3rem, 4vw, 3.3rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.05em',
                    textShadow: `2px 2px 0 ${colors.highlight}`,
                  }}
                >
                  {siteName}
                </Link>
                <p className="mt-4 max-w-[24rem]" style={{ fontSize: '0.9rem', lineHeight: 1.7, color: colors.mutedText }}>
                  {copy.tagline}
                </p>
              </div>
            </div>

            <div
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                border: `2px solid ${colors.ink}`,
                background: colors.highlight,
                color: colors.highlightInk,
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <span>{copy.featureLabel}</span>
              <span style={{ color: colors.highlightInk, opacity: 0.6 }}>Est. {currentYear}</span>
            </div>
          </div>

          {/* ── Right column: feature hero + nav ── */}
          <div className="flex flex-col">
            <div className="p-6 sm:p-8">
              <h2
                className="max-w-4xl"
                style={{
                  fontFamily: '"Arial Black", Impact, "Trebuchet MS", sans-serif',
                  fontSize: 'clamp(1.6rem, 3vw, 3rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: colors.ink,
                }}
              >
                {copy.featureTitle}
              </h2>
              <p className="mt-5 max-w-3xl" style={{ fontSize: '1rem', lineHeight: 1.8, color: colors.mutedText }}>
                {copy.featureDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {copy.statHighlights.map((stat, i) => {
                  const n = i + 1;
                  if (copy[`showStat${n}`] === 'false') return null;
                  const value = copy[`stat${n}Value`] || stat.value;
                  const label = copy[`stat${n}Label`] || stat.label;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-3 rounded-full px-4 py-2"
                      style={{ border: `2px solid ${colors.panelBorder}`, background: colors.mutedPanelBackground }}
                    >
                      <span style={{ fontFamily: '"Arial Black", Impact, sans-serif', fontSize: '1rem', lineHeight: 1, color: colors.ink }}>
                        {value}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.mutedText }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {navItems.length > 0 && (
              <nav
                className="mt-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t"
                style={{ background: colors.navBackground, borderColor: colors.ink }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="retro-nav-link flex items-center justify-center px-4 py-4 text-center no-underline"
                    style={{
                      borderRight: `2px solid ${colors.ink}`,
                      fontFamily: '"Arial Narrow", "Trebuchet MS", sans-serif',
                      fontSize: '0.83rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </RetroPanelBox>
    </header>
  );
}
