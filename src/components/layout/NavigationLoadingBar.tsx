"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

/**
 * Thin top loading bar that provides immediate visual feedback during navigation.
 * Uses pathname changes to detect route transitions.
 * Mount once at the RootShell level.
 */
export function NavigationLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pathname changed → navigation completed
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoading(false);
    }
  }, [pathname]);

  // Listen for link clicks to start loading bar immediately
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      try {
        const url = new URL(href, window.location.origin);
        // Skip external links
        if (url.hostname !== window.location.hostname) return;
        // Skip same-page navigation
        if (url.pathname === pathname) return;
      } catch {
        return;
      }

      setLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLoading(false), 3000);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={`nav-loading-bar${loading ? " active" : ""}`}
        aria-hidden="true"
      />
      <style>{`
        .nav-loading-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: #BD5D3A;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: width 0.4s ease, opacity 0.2s ease;
        }
        .nav-loading-bar.active {
          width: 70%;
          opacity: 1;
          animation: nav-loading-progress 1.2s ease-in-out infinite;
        }
        @keyframes nav-loading-progress {
          0% { width: 5%; }
          50% { width: 70%; }
          100% { width: 90%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-loading-bar.active {
            width: 100%;
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
