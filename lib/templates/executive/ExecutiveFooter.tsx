import Link from 'next/link';
import type { ExecutiveTemplateColors } from '../config';
import { TenantLogo } from '../TenantLogo';

interface ExecutiveFooterProps {
  siteName: string;
  logo?: string | null;
  colors: ExecutiveTemplateColors;
  copy: {
    footerTagline: string;
    footerDescription: string;
    footerStatusText: string;
    footerNavHeading: string;
    footerBriefingHeading: string;
    footerBriefingTitle: string;
    footerBriefingBody: string;
    footerBriefingCta: string;
    footerBottomTagline: string;
  };
  navItems: { label: string; href: string }[];
}

function LogoMark({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        boxShadow: `0 2px 8px color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
        <circle cx="10" cy="10" r="3.5" fill="white" />
      </svg>
    </span>
  );
}

export function ExecutiveFooter({ siteName, logo, colors, copy, navItems }: ExecutiveFooterProps) {
  return (
    <footer
      style={{
        background: colors.footerBackground,
        borderTop: `1px solid ${colors.panelBorder}`,
      }}
    >
      <div
        aria-hidden
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentStrong}, ${colors.accent}, ${colors.accentStrong})`,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            {logo ? (
              <TenantLogo src={logo} alt={siteName} variant="footer" />
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 no-underline"
                style={{ color: 'inherit' }}
              >
                <LogoMark color={colors.accent} />
                <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: colors.ink }}>
                  {siteName}
                </span>
              </Link>
            )}
            <p
              className="mt-4 max-w-md"
              style={{ fontSize: '0.875rem', lineHeight: 1.7, color: colors.mutedText }}
            >
              {copy.footerDescription}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: colors.notificationDot,
                  boxShadow: `0 0 0 3px color-mix(in srgb, ${colors.notificationDot} 18%, transparent)`,
                }}
              />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: colors.mutedText,
                }}
              >
                {copy.footerStatusText}
              </span>
            </div>
          </div>

          {navItems.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.mutedText,
                }}
              >
                {copy.footerNavHeading}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="executive-nav-link inline-flex items-center gap-2 no-underline"
                      style={{
                        color: colors.ink,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        opacity: 0.85,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 999,
                          background: colors.accent,
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
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: colors.mutedText,
              }}
            >
              {copy.footerBriefingHeading}
            </p>
            <div
              className="mt-4 rounded-lg border p-4"
              style={{ borderColor: colors.panelBorder, background: colors.mutedPanelBackground }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.ink }}>
                {copy.footerBriefingTitle}
              </p>
              <p className="mt-1" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: colors.mutedText }}>
                {copy.footerBriefingBody}
              </p>
              <span
                className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-1.5"
                style={{
                  background: colors.accent,
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {copy.footerBriefingCta}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: colors.panelBorder }}
        >
          <p style={{ fontSize: '0.8rem', color: colors.mutedText }}>
            © {new Date().getFullYear()} {siteName}. {copy.footerTagline}
          </p>
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: colors.mutedText,
            }}
          >
            {copy.footerBottomTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
