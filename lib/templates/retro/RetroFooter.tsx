import Link from 'next/link';
import { getTemplateConfig } from '../config';
import { RetroPanelBox } from './RetroPanelBox';
import { TenantLogo } from '../TenantLogo';

type RetroColors = ReturnType<typeof getTemplateConfig<'retro'>>['colors'];
type RetroCopy = ReturnType<typeof getTemplateConfig<'retro'>>['copy'];

interface RetroFooterProps {
  siteName: string;
  logo?: string | null;
  colors: RetroColors;
  copy: RetroCopy;
  navItems: { label: string; href: string }[];
}

export function RetroFooter({ siteName, logo, colors, copy, navItems }: RetroFooterProps) {
  return (
    <footer className="px-3 pb-4 sm:px-5 sm:pb-6">
      <RetroPanelBox
        className="mx-auto max-w-7xl overflow-hidden"
        ink={colors.ink}
        background={colors.footerBackground}
        borderRadius={20}
        shadowSize={8}
      >
        <div
          className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]"
        >
          <div
            className="border-b p-6 lg:border-b-0 lg:border-r"
            style={{ borderColor: colors.panelBorder, background: colors.mutedPanelBackground }}
          >
            <p
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.mutedText,
              }}
            >
              {copy.footerEyebrow}
            </p>
            {logo ? (
              <span className="mt-3 inline-block">
                <TenantLogo src={logo} alt={siteName} variant="footer" />
              </span>
            ) : (
              <Link
                href="/"
                className="retro-site-name mt-3 inline-block no-underline"
                style={{
                  color: colors.ink,
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  fontSize: '1.7rem',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textShadow: `2px 2px 0 ${colors.highlight}`,
                }}
              >
                {siteName}
              </Link>
            )}
            <p
              className="mt-4 max-w-md"
              style={{ fontSize: '0.92rem', lineHeight: 1.7, color: colors.mutedText }}
            >
              {copy.footerDescription}
            </p>
          </div>

          {navItems.length > 0 && (
            <div
              className="border-b p-6 lg:border-b-0 lg:border-r"
              style={{ borderColor: colors.panelBorder }}
            >
              <p
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: colors.mutedText,
                }}
              >
                {copy.footerNavHeading}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="retro-nav-link inline-flex items-center gap-2 no-underline"
                      style={{
                        color: colors.ink,
                        fontFamily: '"Arial Narrow", "Trebuchet MS", sans-serif',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          border: `2px solid ${colors.ink}`,
                          background: colors.highlight,
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

          <div className="p-6">
            <p
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.mutedText,
              }}
            >
              {copy.footerHoursHeading}
            </p>
            <p className="mt-3" style={{ fontSize: '0.95rem', color: colors.ink, fontWeight: 700 }}>
              {copy.footerHoursBody}
            </p>
            <div
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                border: `2px solid ${colors.ink}`,
                background: colors.highlight,
                color: colors.highlightInk,
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                boxShadow: `3px 3px 0 ${colors.ink}`,
              }}
            >
              {copy.footerHoursBadgePrefix} {new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: colors.ink, background: colors.navAltBackground }}
        >
          <p style={{ fontSize: '0.78rem', color: colors.mutedText, fontWeight: 600 }}>
            © {new Date().getFullYear()} {siteName}. {copy.footerCopyrightTagline}
          </p>
          <p
            style={{
              fontSize: '0.7rem',
              color: colors.mutedText,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {copy.footerBottomTagline}
          </p>
        </div>
      </RetroPanelBox>
    </footer>
  );
}
