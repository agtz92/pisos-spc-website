import Link from 'next/link';
import type { ModernTemplateColors } from '../config';
import { MobileNav } from '../MobileNav';
import { ModernPolygonMark } from './ModernPolygonMark';

function UtilityIcon({ label, colors }: { label: string; colors: ModernTemplateColors }) {
  const isProfile = label === 'Profile';
  const accent = colors.accent;
  const accentBorder = colors.accentSoft
    ? `color-mix(in srgb, ${accent} 18%, transparent)`
    : 'rgba(236, 15, 127, 0.18)';

  return (
    <span
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36, borderRadius: '999px',
        border: `1px solid ${accentBorder}`,
        color: accent,
        background: colors.panelBackground,
        boxShadow: `0 10px 30px color-mix(in srgb, ${accent} 8%, transparent)`,
      }}
    >
      {isProfile ? (
        <span aria-hidden style={{ width: 12, height: 12, borderRadius: '999px', background: accent }} />
      ) : (
        <span aria-hidden style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ width: 14, height: 2, background: accent, borderRadius: 99 }} />
          <span style={{ width: 14, height: 2, background: accent, borderRadius: 99 }} />
          <span style={{ width: 14, height: 2, background: accent, borderRadius: 99 }} />
        </span>
      )}
    </span>
  );
}

interface ModernHeaderProps {
  siteName: string;
  colors: ModernTemplateColors;
  copy: { utilityBarLabel: string; headerTagline: string };
  navItems: { label: string; href: string }[];
  today: string;
}

export function ModernHeader({ siteName, colors, copy, navItems, today }: ModernHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: `color-mix(in srgb, ${colors.panelBackground} 90%, transparent)`,
        borderColor: 'rgba(22, 18, 24, 0.05)',
      }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] sm:px-6"
        style={{ color: colors.mutedText }}
      >
        <span>{copy.utilityBarLabel}</span>
        <span>{today}</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Link href="/" className="modern-logo-link inline-flex items-center gap-4 no-underline" style={{ color: 'inherit' }}>
            <span className="modern-polygon-mark"><ModernPolygonMark colors={colors} /></span>
            <div className="leading-none">
              <div
                style={{
                  fontFamily: '"Arial Black", Impact, "Segoe UI", sans-serif',
                  fontSize: 'clamp(2.8rem, 7vw, 5.1rem)',
                  letterSpacing: '-0.07em',
                  lineHeight: 0.9,
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentStrong} 100%)`,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {siteName}
              </div>
              <p style={{ marginTop: 10, fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.mutedText }}>
                {copy.headerTagline}
              </p>
            </div>
          </Link>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            {navItems.length > 0 && (
              <nav className="hidden md:flex flex-wrap items-center gap-y-2 text-sm font-bold">
                {navItems.map((item, index) => (
                  <div key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      className="modern-nav-link px-3 py-1 no-underline"
                      style={{ color: colors.accent, fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif', fontSize: '1.05rem' }}
                    >
                      {item.label}
                    </Link>
                    {index < navItems.length - 1 && (
                      <span aria-hidden style={{ width: 1, height: 20, marginInline: 10, background: `color-mix(in srgb, ${colors.accent} 15%, transparent)` }} />
                    )}
                  </div>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex">
                <UtilityIcon label="Profile" colors={colors} />
              </span>
              <span className="hidden md:inline-flex">
                <UtilityIcon label="Menu" colors={colors} />
              </span>
              <MobileNav
                triggerClassName="md:hidden"
                navItems={navItems}
                siteName={siteName}
                panelEyebrow={copy.headerTagline}
                theme={{
                  buttonBackground: colors.panelBackground,
                  buttonBorder: `color-mix(in srgb, ${colors.accent} 18%, transparent)`,
                  buttonInk: colors.accent,
                  panelBackground: colors.panelBackground,
                  panelBorder: 'rgba(22, 18, 24, 0.08)',
                  ink: colors.ink,
                  mutedText: colors.mutedText,
                  accent: colors.accent,
                  accentStrong: colors.accentStrong,
                  linkHoverBackground: `color-mix(in srgb, ${colors.accent} 8%, transparent)`,
                  linkFontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="modern-accent-bar"
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${colors.accentSoft}, ${colors.accent}, ${colors.accentStrong}, ${colors.accent}, ${colors.accentSoft})`,
        }}
      />
    </header>
  );
}
