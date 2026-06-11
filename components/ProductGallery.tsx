'use client';

/**
 * ProductGallery — main image + thumbnail strip carousel for the product detail
 * page. Cover image is always slide 0 (see lib/product-gallery.ts).
 *
 * Why client-side: the gallery needs interactivity (click thumbnail, keyboard
 * arrows, swipe). The rest of the detail page stays server-rendered.
 *
 * Behavior:
 *   • Single slide → renders one image, hides thumbnails.
 *   • Multi-slide → main image + thumbnails below. Click thumbnail to
 *     change active slide. Arrow-left/arrow-right cycle when focused.
 *     Touch swipe on the main image moves to the next/prev slide.
 *
 * No lightbox / zoom / autoplay in v1. If requested, add via a small
 * portal-based modal in a follow-up.
 */
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CarouselSlide } from '@/lib/product-gallery';

const templateMutedPanel = 'var(--template-muted-panel, #f3f4f6)';
const templateAccent = 'var(--template-accent, #e5201b)';
const templatePanelBorder = 'var(--template-panel-border, #e5e7eb)';

interface ProductGalleryProps {
  slides: CarouselSlide[];
  /** Used as fallback when a slide has no alt. */
  productTitle: string;
}

export default function ProductGallery({ slides, productTitle }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Reset active index if the slide set changes (e.g. ISR revalidation).
  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      // Wrap-around. Cycle predictably with both arrows + swipe.
      const wrapped = ((next % slides.length) + slides.length) % slides.length;
      setActiveIndex(wrapped);
    },
    [slides.length],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (slides.length <= 1) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    },
    [activeIndex, goTo, slides.length],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || slides.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) return;
    const dx = endX - touchStartX.current;
    // 50 px threshold — feels right on a 375 px iPhone width without
    // triggering on slight finger drift during a tap.
    if (Math.abs(dx) > 50) {
      goTo(activeIndex + (dx < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  // ── Empty state ────────────────────────────────────────────────────────
  if (slides.length === 0) {
    return (
      <div
        data-product-detail-image
        className="aspect-square rounded-xl border flex items-center justify-center"
        style={{ background: templateMutedPanel, color: 'var(--template-muted-text, #9ca3af)' }}
      >
        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
    );
  }

  const active = slides[activeIndex];
  const single = slides.length === 1;

  return (
    <div
      ref={containerRef}
      data-product-gallery
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="focus:outline-none"
      role="region"
      aria-label="Product images"
    >
      {/* Main image */}
      <div
        data-product-detail-image
        className="relative aspect-square rounded-xl overflow-hidden border"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={active.src}
          alt={active.alt || productTitle}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {!single && (
        <ul
          data-product-gallery-thumbs
          className="mt-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li key={slide.key}>
                <button
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Show image ${idx + 1} of ${slides.length}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative aspect-square w-full overflow-hidden rounded-md border transition-opacity hover:opacity-90"
                  style={{
                    borderColor: isActive ? templateAccent : templatePanelBorder,
                    borderWidth: isActive ? 2 : 1,
                    background: templateMutedPanel,
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt || productTitle}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
