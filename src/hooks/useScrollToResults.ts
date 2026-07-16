"use client";

import { useEffect, useRef } from "react";

/**
 * Smooth-scrolls to an element when a condition becomes true.
 * Uses a small delay to ensure the DOM has updated with the results.
 * Idempotent — subsequent true values without a false reset are ignored.
 */
export function useScrollToResults(shouldScroll: boolean, elementId: string) {
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (shouldScroll && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      const timer = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
    if (!shouldScroll) {
      hasScrolledRef.current = false;
    }
  }, [shouldScroll, elementId]);
}
