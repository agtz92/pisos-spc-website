import Link from 'next/link';
import type { ModernTemplateColors } from '../config';
import { ModernPolygonMark } from './ModernPolygonMark';

interface ModernFooterProps {
  siteName: string;
  colors: ModernTemplateColors;
  copy: {
    footerDescription: string;
    footerEyebrow: string;
    footerNavHeading: string;
    footerNoteChip: string;
    footerNoteBody: string;
    footerCopyrightTagline: string;
    footerBottomTagline: string;
  };
  navItems: { label: string; href: string }[];
}

export function ModernFooter({ siteName, colors, copy, navItems }: ModernFooterProps) {
  const ruleColor = `color-mix(in srgb, ${colors.ink} 12%, transparent)`;
  const eyebrowColor = `color-mix(in srgb, ${colors.ink} 40%, transparent)`;
  const navHoverBorder = `color-mix(in srgb, ${colors.accent} 18%, transparent)`;

  return (
    <footer
      className="relative z-10 border-t"
      style={{ borderColor: ruleColor, background: colors.mutedPanelBackground }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <ModernPolygonMark colors={colors} />
              <span
                style={{
                  fontFamily: '"Arial Black", Impact, "Segoe UI", sans-serif',
                  fontSize: '1.8rem',
                  letterSpacing: '-0.06em',
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentStrong} 100%)`,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {siteName}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7" style={{ color: colors.mutedText }}>
              {copy.footerDescription}
            </p>
          </div>

          {navItems.length > 0 && (
            <div>
              <p
                className="text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
                style={{ color: eyebrowColor }}
              >
                {copy.footerNavHeading}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="modern-footer-nav-link inline-flex items-center gap-2 no-underline"
                      style={{
                        color: colors.ink,
                        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: colors.accent,
                          transform: 'rotate(45deg)',
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
              className="text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
              style={{ color: eyebrowColor }}
            >
              {copy.footerEyebrow}
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: navHoverBorder,
                background: colors.panelBackground,
                color: colors.accent,
              }}
            >
              <span
                aria-hidden
                style={{ width: 8, height: 8, borderRadius: 999, background: colors.accent }}
              />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {copy.footerNoteChip}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6" style={{ color: colors.mutedText }}>
              {copy.footerNoteBody}
            </p>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: ruleColor, color: colors.mutedText }}
        >
          <p className="text-sm">© {new Date().getFullYear()} {siteName}. {copy.footerCopyrightTagline}</p>
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-[0.24em]"
            style={{ color: eyebrowColor }}
          >
            {copy.footerBottomTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
