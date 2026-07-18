"use client";

import { useLayoutEffect, useRef } from "react";

export function ScrollFade({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Landing animations run on every device, including those with the OS
    // "reduce motion" preference enabled (product decision).
    // Enable JS-driven hiding only once we know the effect will run: without
    // JS or on hydration failure, staggered content stays visible by default.
    root.classList.add("sc-fade-ready");

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-fade]"));

    // Step 1: Determine visibility BEFORE paint — zero flash
    sections.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight - 40) {
        el.classList.add("sc-fade-prep");
      } else {
        el.classList.add("sc-fade-visible");
      }
    });

    // Step 2: Observer for scroll-in on hidden sections only
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sc-fade-visible");
            entry.target.classList.remove("sc-fade-prep");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    sections
      .filter((el) => el.classList.contains("sc-fade-prep"))
      .forEach((el) => observer.observe(el));

    // Fail-safe: if the observer never fires for a section (backgrounded tab
    // during load, layout quirks, unsupported environments), force-reveal any
    // section still queued so its content can never remain permanently hidden.
    const fallback = window.setTimeout(() => {
      root.querySelectorAll<HTMLElement>(".sc-fade-prep").forEach((el) => {
        el.classList.add("sc-fade-visible");
        el.classList.remove("sc-fade-prep");
      });
    }, 2200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
