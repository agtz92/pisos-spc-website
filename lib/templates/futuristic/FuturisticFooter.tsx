import Link from 'next/link';
import { getTemplateConfig } from '../config';
import { FuturisticFramePill } from './FuturisticFramePill';
import { TenantLogo } from '../TenantLogo';

type FuturisticColors = ReturnType<typeof getTemplateConfig<'futuristic'>>['colors'];

interface FuturisticFooterProps {
  siteName: string;
  logo?: string | null;
  colors: FuturisticColors;
  copy: {
    footerPrefix: string;
    footerSubtitle: string;
    footerDescription: string;
    footerNavHeading: string;
    footerSystemHeading: string;
    footerSystemStatus: string;
    footerSystemTheme: string;
    footerInterfaceLabel: string;
    footerBottomTagline: string;
  };
  navItems: { label: string; href: string }[];
}

export function FuturisticFooter({ siteName, logo, colors, copy, navItems }: FuturisticFooterProps) {
  const footerPrefix = copy.footerPrefix;
  return (
    <footer className="relative z-10 px-4 pb-6 pt-2 sm:px-6">
      <div
        className="mx-auto max-w-7xl overflow-hidden rounded-[6px] border"
        style={{
          borderColor: colors.panelBorder,
          background: colors.footerBackground,
          boxShadow: `0 0 40px ${colors.accentBorder}`,
        }}
      >
        <div
          aria-hidden
          style={{ height: 2, background: colors.topGlowLine }}
        />

        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p
              style={{
                color: colors.accent,
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              {footerPrefix} {copy.footerSubtitle}
            </p>
            {logo ? (
              <span className="mt-2 inline-block">
                <TenantLogo src={logo} alt={siteName} variant="footer" />
              </span>
            ) : (
              <Link
                href="/"
                className="mt-2 inline-block no-underline"
                style={{
                  color: colors.ink,
                  fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  letterSpacing: '-0.04em',
                }}
              >
                {siteName}
              </Link>
            )}
            <p className="mt-3 max-w-md text-sm leading-7" style={{ color: colors.mutedText }}>
              {copy.footerDescription}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <FuturisticFramePill colors={colors}>{String(navItems.length).padStart(2, '0')} Modules</FuturisticFramePill>
              <FuturisticFramePill colors={colors}>Online</FuturisticFramePill>
            </div>
          </div>

          {navItems.length > 0 && (
            <div>
              <p
                style={{
                  color: colors.accent,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                {footerPrefix} {copy.footerNavHeading}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="futuristic-nav-link inline-flex items-center gap-2 rounded-[3px] px-2 py-1 no-underline"
                      style={{
                        color: colors.ink,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: colors.accent,
                          boxShadow: `0 0 8px ${colors.accentGlow}`,
                          display: 'inline-block',
                        }}
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p
              style={{
                color: colors.accent,
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              {footerPrefix} {copy.footerSystemHeading}
            </p>
            <dl className="mt-3 flex flex-col gap-2">
              {[
                { k: 'Status', v: copy.footerSystemStatus },
                { k: 'Build', v: `Y${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}` },
                { k: 'Theme', v: copy.footerSystemTheme },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-center justify-between rounded-[3px] border px-3 py-1.5"
                  style={{
                    borderColor: colors.panelBorder,
                    background: colors.mutedPanelBackground,
                  }}
                >
                  <dt
                    style={{
                      color: colors.mutedText,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {row.k}
                  </dt>
                  <dd
                    style={{
                      color: colors.ink,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          style={{ borderColor: colors.panelBorder, background: colors.mutedPanelBackground }}
        >
          <p
            style={{
              color: colors.mutedText,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: colors.accent }}>{footerPrefix}</span> {siteName} {copy.footerInterfaceLabel}
          </p>
          <p
            style={{
              color: colors.mutedText,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            © {new Date().getFullYear()} · {copy.footerBottomTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
