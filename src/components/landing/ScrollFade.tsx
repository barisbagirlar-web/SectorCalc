"use client";

import { useLayoutEffect, useRef } from "react";

export function ScrollFade({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
