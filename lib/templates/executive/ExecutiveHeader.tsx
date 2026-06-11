import Link from 'next/link';
import type { ExecutiveTemplateColors } from '../config';
import { MobileNav } from '../MobileNav';
import { TenantLogo } from '../TenantLogo';

function LogoMark({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="executive-logo-mark"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 36, height: 36, borderRadius: '50%', background: color, flexShrink: 0,
        boxShadow: `0 2px 8px color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
        <circle cx="10" cy="10" r="3.5" fill="white" />
      </svg>
    </span>
  );
}

interface ExecutiveHeaderProps {
  siteName: string;
  logo?: string | null;
  colors: ExecutiveTemplateColors;
  navItems: { label: string; href: string }[];
}

export function ExecutiveHeader({ siteName, logo, colors, navItems }: ExecutiveHeaderProps) {
  return (
    <header
      className="executive-header sticky top-0 z-30"
      style={{ background: colors.headerBackground, borderBottom: `1px solid ${colors.panelBorder}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      {/* Accent top stripe */}
      <div
        aria-hidden
        className="executive-accent-bar"
        style={{ height: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentStrong}, ${colors.accent}, ${colors.accentStrong})` }}
      />

      <div className="mx-auto flex max-w-7xl items-center gap-0 px-4 py-2.5 sm:px-6">
        {logo ? (
          <span className="flex-shrink-0">
            <TenantLogo src={logo} alt={siteName} variant="header" />
          </span>
        ) : (
          <Link href="/" className="executive-logo-link inline-flex items-center gap-2.5 no-underline flex-shrink-0" style={{ color: 'inherit' }}>
            <LogoMark color={colors.accent} />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: colors.ink }}>
              {siteName}
            </span>
          </Link>
        )}

        {navItems.length > 0 && (
          <span aria-hidden className="hidden md:block" style={{ width: 1, height: 22, background: colors.panelBorder, margin: '0 1.5rem', flexShrink: 0 }} />
        )}

        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="executive-nav-link px-3.5 py-2 no-underline"
                style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.ink, opacity: 0.65 }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <MobileNav
          triggerClassName="md:hidden ml-auto"
          navItems={navItems}
          siteName={siteName}
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
            linkHoverBackground: colors.mutedPanelBackground,
          }}
        />
      </div>
    </header>
  );
}
