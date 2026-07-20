"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// SSR-safe layout effect: behaves as useLayoutEffect in the browser and as a
// no-op during server rendering (avoids React hydration warnings).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Progressive-enhancement entrance animation.
 *
 * DESIGN CONTRACT (permanent, non-regressing):
 * - The DEFAULT rendered state of every block is fully VISIBLE.
 * - This component only ever ADDS the `sc-fade-animate` class to replay an
 *   entrance animation. It never persists a hidden state.
 * - Therefore, if JavaScript is disabled, hydration fails, the
 *   IntersectionObserver never fires, or the browser lacks
 *   IntersectionObserver support, content can NEVER remain hidden.
 */
export function ScrollFade({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-fade]")
    );
    if (sections.length === 0) return;

    // Marks the tree so the entrance-animation CSS rules become active.
    // Base (unready) state stays fully visible.
    root.classList.add("sc-fade-ready");

    const animate = (el: HTMLElement) => {
      // Guard against re-triggering (StrictMode double-invoke, re-renders).
      if (el.dataset.faded === "1") return;
      el.dataset.faded = "1";
      el.classList.add("sc-fade-animate");
    };

    const viewportH = window.innerHeight || document.documentElement.clientHeight;

    // Sections already in view animate immediately (before paint → no flash).
    // Below-fold sections are queued for the observer.
    const queued: HTMLElement[] = [];
    sections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH - 40) {
        animate(el);
      } else {
        queued.push(el);
      }
    });

    if (queued.length === 0) return;

    // If IntersectionObserver is unavailable, reveal everything now. Content is
    // already visible by default, so this simply plays the entrance once.
    if (typeof IntersectionObserver === "undefined") {
      queued.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    queued.forEach((el) => observer.observe(el));

    // Independent safety net: any still-unanimated block is force-played after
    // a short delay (covers backgrounded tabs, layout quirks, missed
    // intersections). Even without this, blocks remain visible by default.
    const fallback = window.setTimeout(() => {
      queued.forEach(animate);
    }, 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
