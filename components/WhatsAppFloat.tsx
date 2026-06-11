'use client';

/**
 * WhatsAppFloat — bottom-right floating WhatsApp CTA, tenant-configurable.
 *
 * Mounted once in app/layout.tsx with the values resolved server-side from
 * the tenant query. When ``page`` props are added later (Phase 2), the
 * page renderer will compose its own overrides on top of these defaults.
 *
 * Renders nothing when disabled or when no phone is set — both are required
 * to compose a usable wa.me URL.
 *
 * Visual:
 *   • Round 56×56 green button (#25D366, WhatsApp's brand green)
 *   • Subtle box-shadow + hover scale
 *   • Lottie heartbeat animation inside (loops), or static SVG when the
 *     tenant disables Lottie to save JS weight
 *   • Respects `prefers-reduced-motion`: falls back to static even if
 *     Lottie is enabled
 *
 * URL composition:
 *   https://wa.me/<digits>?text=<URI-encoded message>
 */
import LottieAnimation from './LottieAnimation';

interface WhatsAppFloatProps {
  /** Tenant-level default — required for the button to render. */
  enabled: boolean;
  phone: string;            // digits, country code first, no `+`
  message: string;
  lottieEnabled: boolean;
}

// Inline SVG fallback for the static path. Hand-rolled so it doesn't
// pull a 3rd-party icon lib into the root layout bundle.
function WhatsAppGlyph({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.001 2C6.479 2 2 6.479 2 12c0 1.857.508 3.59 1.391 5.078L2 22l5.078-1.391A9.96 9.96 0 0 0 12.001 22C17.523 22 22 17.523 22 12s-4.477-10-9.999-10zm5.834 14.166c-.243.682-1.244 1.301-1.92 1.418-.492.085-1.134.152-3.297-.719-2.771-1.115-4.555-3.93-4.695-4.114-.135-.183-1.122-1.494-1.122-2.85 0-1.357.712-2.024.964-2.302.252-.279.55-.349.733-.349.183 0 .367.002.526.01.169.008.395-.064.618.471.227.541.77 1.876.838 2.012.068.135.114.295.022.477-.091.183-.137.295-.27.453-.135.158-.284.354-.406.477-.135.135-.276.281-.119.55.158.27.7 1.157 1.504 1.873 1.034.92 1.906 1.206 2.176 1.341.27.135.428.113.589-.068.16-.181.679-.792.86-1.063.181-.27.362-.226.611-.135.249.091 1.583.747 1.853.882.27.135.451.203.518.317.067.115.067.66-.175 1.339z"/>
    </svg>
  );
}

export default function WhatsAppFloat({
  enabled,
  phone,
  message,
  lottieEnabled,
}: WhatsAppFloatProps) {
  // ── Guard rails ──────────────────────────────────────────────────────
  if (!enabled) return null;
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return null;

  const finalMessage = (message || '').trim();

  // URL composition. Empty `text` is fine — WA opens with no prefill.
  const href = finalMessage
    ? `https://wa.me/${digits}?text=${encodeURIComponent(finalMessage)}`
    : `https://wa.me/${digits}`;

  const SIZE = 56;
  const ICON = 28;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat por WhatsApp"
      data-whatsapp-float
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 motion-reduce:transition-none motion-reduce:hover:scale-100"
      style={{
        width: SIZE,
        height: SIZE,
        // WhatsApp brand green. The animation art uses the same green
        // (0.137, 0.702, 0.227 → #23B33A); the button bg is a hair brighter
        // so the artwork's ring renders crisp on top.
        background: '#25D366',
        color: '#ffffff',
      }}
    >
      {lottieEnabled ? (
        // motion-reduce:hidden makes the inert static glyph below take
        // over for users who opted out of motion at the OS level.
        <>
          <span className="motion-reduce:hidden">
            <LottieAnimation
              src="/animations/whatsapp-call.json"
              size={SIZE - 4}
            />
          </span>
          <span className="hidden motion-reduce:inline-flex">
            <WhatsAppGlyph size={ICON} />
          </span>
        </>
      ) : (
        <WhatsAppGlyph size={ICON} />
      )}
    </a>
  );
}
