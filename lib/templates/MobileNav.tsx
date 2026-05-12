'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface MobileNavTheme {
  buttonBackground: string;
  buttonBorder: string;
  buttonInk: string;
  panelBackground: string;
  panelBorder: string;
  ink: string;
  mutedText: string;
  accent: string;
  accentStrong: string;
  linkHoverBackground: string;
  /** Optional css used as the link font-family declaration. */
  linkFontFamily?: string;
  /** Optional css used as the link letter-spacing. */
  linkLetterSpacing?: string;
  /** Optional css used as the link text-transform (e.g. 'uppercase'). */
  linkTextTransform?: string;
}

export interface MobileNavProps {
  navItems: { label: string; href: string }[];
  siteName: string;
  theme: MobileNavTheme;
  /** Optional label rendered above the link list. */
  panelEyebrow?: string;
  /** Extra classes on the trigger wrapper (e.g. to control breakpoint visibility). */
  triggerClassName?: string;
  /** Optional aria-label for the trigger button. */
  ariaLabel?: string;
}

export function MobileNav({
  navItems,
  siteName,
  theme,
  panelEyebrow,
  triggerClassName,
  ariaLabel = 'Open navigation menu',
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (navItems.length === 0) return null;

  return (
    <div className={triggerClassName}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls="template-mobile-nav-panel"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 10,
          border: `1px solid ${theme.buttonBorder}`,
          background: theme.buttonBackground,
          color: theme.buttonInk,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span aria-hidden style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 99 }} />
          <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 99 }} />
          <span style={{ display: 'block', width: 18, height: 2, background: 'currentColor', borderRadius: 99 }} />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{ position: 'fixed', inset: 0, zIndex: 60 }}
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.45)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
          <div
            id="template-mobile-nav-panel"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(86vw, 320px)',
              background: theme.panelBackground,
              borderLeft: `1px solid ${theme.panelBorder}`,
              boxShadow: '-20px 0 40px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              animation: 'mobileNavSlideIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ minWidth: 0 }}>
                {panelEyebrow && (
                  <div
                    style={{
                      fontSize: '0.66rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: theme.mutedText,
                      marginBottom: 4,
                    }}
                  >
                    {panelEyebrow}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: theme.linkFontFamily ?? 'inherit',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: theme.ink,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {siteName}
                </div>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `1px solid ${theme.buttonBorder}`,
                  background: theme.buttonBackground,
                  color: theme.buttonInk,
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 7,
                      left: 0,
                      width: 16,
                      height: 2,
                      background: 'currentColor',
                      borderRadius: 99,
                      transform: 'rotate(45deg)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 7,
                      left: 0,
                      width: 16,
                      height: 2,
                      background: 'currentColor',
                      borderRadius: 99,
                      transform: 'rotate(-45deg)',
                    }}
                  />
                </span>
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="template-mobile-nav-link"
                  style={{
                    display: 'block',
                    padding: '0.85rem 0.75rem',
                    borderRadius: 8,
                    color: theme.ink,
                    fontFamily: theme.linkFontFamily ?? 'inherit',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: theme.linkLetterSpacing,
                    textTransform: (theme.linkTextTransform as 'uppercase' | undefined) ?? 'none',
                    textDecoration: 'none',
                    borderBottom: `1px solid ${theme.panelBorder}`,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <style>{`
            @keyframes mobileNavSlideIn {
              from { transform: translateX(100%); }
              to   { transform: translateX(0); }
            }
            .template-mobile-nav-link:hover,
            .template-mobile-nav-link:focus-visible {
              background: ${theme.linkHoverBackground};
              color: ${theme.accentStrong} !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
