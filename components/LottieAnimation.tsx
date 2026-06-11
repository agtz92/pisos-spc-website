'use client';

/**
 * LottieAnimation — Client component wrapper around lottie-react.
 *
 * Loads a Lottie JSON from /public/animations/ at runtime so the JSON is
 * not bundled with every server response. The dynamic import also keeps
 * lottie-web out of the server bundle entirely.
 *
 * Usage:
 *   <LottieAnimation src="/animations/whatsapp-call.json" size={48} />
 *
 * Pre-requisite (run once in /website):
 *   pnpm add lottie-react
 *
 * Notes:
 *   • Default is autoplay + loop. Pass loop={false} or autoplay={false}
 *     to control. The bundled file is 50 frames @ 25fps = 2 s, so looping
 *     reads as a heartbeat.
 *   • The animation file is small (~5 KB gzipped). We still lazy-load it
 *     so it doesn't compete with hero LCP.
 *   • SSR-safe: the lottie-react import is dynamic, so it never runs on
 *     the server. A blank placeholder of the requested size renders until
 *     the JSON loads (typically <100 ms on a warm cache).
 */
import { useEffect, useState } from 'react';

interface LottieAnimationProps {
  /** URL relative to /public — e.g. "/animations/whatsapp-call.json". */
  src: string;
  /** Pixel size of the square viewport. Defaults to 48. */
  size?: number;
  /** Loop the animation. Default true. */
  loop?: boolean;
  /** Autoplay on mount. Default true. */
  autoplay?: boolean;
  /** Optional className for the wrapper div. */
  className?: string;
  /** Accessibility label. Required if the icon is the sole CTA affordance. */
  ariaLabel?: string;
}

export default function LottieAnimation({
  src,
  size = 48,
  loop = true,
  autoplay = true,
  className,
  ariaLabel,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [LottieComponent, setLottieComponent] = useState<React.ComponentType<{
    animationData: object;
    loop?: boolean;
    autoplay?: boolean;
    style?: React.CSSProperties;
  }> | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Lazy-load the JSON and the library in parallel.
    Promise.all([
      fetch(src).then((r) => r.json()),
      import('lottie-react').then((m) => m.default),
    ])
      .then(([json, Lottie]) => {
        if (cancelled) return;
        setAnimationData(json);
        setLottieComponent(() => Lottie);
      })
      .catch((err) => {
        // Silent fail — the static fallback (empty box) stays visible.
        // Avoid throwing because this is purely cosmetic.
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[LottieAnimation] Failed to load', src, err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  const box = { width: size, height: size };

  if (!LottieComponent || !animationData) {
    // Reserve the layout slot to prevent jank when the JSON lands.
    return <div className={className} style={box} aria-hidden />;
  }

  return (
    <div
      className={className}
      style={box}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      <LottieComponent
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
