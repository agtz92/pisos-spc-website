import Link from 'next/link';
import { getTemplateConfig } from '../config';
import { MobileNav } from '../MobileNav';
import { FuturisticFramePill } from './FuturisticFramePill';
import { TenantLogo } from '../TenantLogo';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

function SignalMark({ colors }: { colors: FuturisticColors }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'relative', display: 'inline-flex', width: 50, height: 50, flexShrink: 0,
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '18px',
        border: `1px solid ${colors.panelBorder}`,
        background: colors.panelBackground,
        boxShadow: `0 0 30px ${colors.accentBorder}`,
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: '999px', background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentStrong} 100%)`, boxShadow: `0 0 20px ${colors.accentGlow}` }} />
      <span style={{ position: 'absolute', width: 30, height: 30, borderRadius: '999px', border: `1px solid ${colors.panelBorder}` }} />
      <span style={{ position: 'absolute', inset: 6, borderRadius: '14px', border: `1px solid ${colors.accentBorder}` }} />
    </span>
  );
}

interface FuturisticHeaderProps {
  siteName: string;
  logo?: string | null;
  colors: FuturisticColors;
  navItems: { label: string; href: string }[];
}

export function FuturisticHeader({ siteName, logo, colors, navItems }: FuturisticHeaderProps) {
  return (
    <header className="px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[6px] border px-4 py-4 sm:px-6"
        style={{
          borderColor: colors.panelBorder,
          background: colors.headerBackground,
          boxShadow: `0 0 40px ${colors.accentBorder}`,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {logo ? (
            <TenantLogo src={logo} alt={siteName} variant="header" />
          ) : (
            <Link href="/" className="inline-flex items-center gap-3 no-underline" style={{ color: colors.ink }}>
              <SignalMark colors={colors} />
              <span className="min-w-0">
                <span style={{ display: 'block', color: colors.mutedText, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                  Adaptive Interface
                </span>
                <span style={{ display: 'block', fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif', fontWeight: 800, fontSize: 'clamp(1.45rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}>
                  {siteName}
                </span>
              </span>
            </Link>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <FuturisticFramePill colors={colors}>{String(navItems.length).padStart(2, '0')} Modules</FuturisticFramePill>
            <FuturisticFramePill colors={colors}>Config-Driven Theme</FuturisticFramePill>
            <MobileNav
              triggerClassName="md:hidden"
              navItems={navItems}
              siteName={siteName}
              panelEyebrow="Adaptive Interface"
              theme={{
                buttonBackground: colors.panelBackground,
                buttonBorder: colors.panelBorder,
                buttonInk: colors.ink,
                panelBackground: colors.headerBackground,
                panelBorder: colors.panelBorder,
                ink: colors.ink,
                mutedText: colors.mutedText,
                accent: colors.accent,
                accentStrong: colors.accentStrong,
                linkHoverBackground: colors.panelBackground,
                linkFontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                linkLetterSpacing: '0.08em',
                linkTextTransform: 'uppercase',
              }}
            />
          </div>
        </div>

        {navItems.length > 0 && (
          <nav
            className="futuristic-nav-wrap hidden md:flex flex-wrap items-center gap-2 rounded-[4px] p-2"
            style={{ border: `1px solid ${colors.panelBorder}`, background: colors.panelBackground }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="futuristic-nav-link rounded-[3px] px-4 py-2 no-underline"
                style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
