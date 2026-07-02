"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Shrinks font-size until text fits its container in a single line.
 * Never wraps, never overflows.
 *
 * @param options.minPx   Hard floor (default 0.5rem ≈ 8px)
 * @param options.stepPx  Decrement step (default 1px)
 * @returns               [ref, ready] - attach ref to the text element, use `ready` to avoid FOUC
 */
export function useFitText({ minPx = 8, stepPx = 1 }: { minPx?: number; stepPx?: number } = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Reset to natural size first
    el.style.fontSize = "";
    el.style.whiteSpace = "nowrap";
    el.style.overflow = "hidden";

    const parent = el.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth;
    // Use a small buffer to avoid edge-case overflow
    const maxWidth = parentWidth - 1;

    let fontSize = parseFloat(getComputedStyle(el).fontSize);
    if (isNaN(fontSize)) fontSize = 14;

    let safety = 0;
    while (el.scrollWidth > maxWidth && fontSize > minPx && safety < 50) {
      fontSize -= stepPx;
      el.style.fontSize = `${fontSize}px`;
      safety++;
    }

    setReady(true);
  }, [minPx, stepPx]);

  useLayoutEffect(() => {
    fit();

    const ro = new ResizeObserver(() => fit());
    if (ref.current?.parentElement) {
      ro.observe(ref.current.parentElement);
    }
    return () => ro.disconnect();
  }, [fit]);

  return { ref, ready };
}
