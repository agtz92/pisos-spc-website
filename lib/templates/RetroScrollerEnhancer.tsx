'use client';

import { useEffect } from 'react';

export default function RetroScrollerEnhancer({ selector }: { selector?: string } = {}) {
  useEffect(() => {
    const q = selector ?? '.retro-shell [class*="overflow-x-auto"][class*="py-3"]';
    const elements = Array.from(document.querySelectorAll<HTMLElement>(q));

    const cleanups = elements.map((element) => {
      let isPointerDown = false;
      let startX = 0;
      let startScrollLeft = 0;

      const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        isPointerDown = true;
        startX = event.clientX;
        startScrollLeft = element.scrollLeft;
        element.setPointerCapture?.(event.pointerId);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!isPointerDown) return;
        const delta = event.clientX - startX;
        element.scrollLeft = startScrollLeft - delta;
      };

      const stopDragging = (event?: PointerEvent) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        if (event) {
          element.releasePointerCapture?.(event.pointerId);
        }
      };

      element.addEventListener('pointerdown', handlePointerDown);
      element.addEventListener('pointermove', handlePointerMove);
      element.addEventListener('pointerup', stopDragging);
      element.addEventListener('pointercancel', stopDragging);
      element.addEventListener('pointerleave', stopDragging);

      return () => {
        element.removeEventListener('pointerdown', handlePointerDown);
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerup', stopDragging);
        element.removeEventListener('pointercancel', stopDragging);
        element.removeEventListener('pointerleave', stopDragging);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [selector]);

  return null;
}
