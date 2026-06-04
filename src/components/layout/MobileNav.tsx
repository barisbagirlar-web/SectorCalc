"use client";

import Link from "next/link";
import { useRef } from "react";
import { NAV_ITEMS } from "@/config/site";

type HeaderTheme = "light" | "dark";

interface MobileNavProps {
  theme?: HeaderTheme;
}

export function MobileNav({ theme = "light" }: MobileNavProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const isLight = theme === "light";

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="lg:hidden">
      <summary
        className={`flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden ${
          isLight ? "text-[#303030]" : "text-white"
        }`}
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </summary>
      <ul
        className={`absolute left-0 right-0 top-full z-50 border-b bg-white px-4 py-3 shadow-lg ${
          isLight ? "border-[#e5e5e5]" : "border-white/10 bg-dark-navy"
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={closeMenu}
              className={`block min-h-[44px] py-3 text-sm font-semibold uppercase tracking-wide ${
                isLight ? "text-[#303030]" : "text-slate-300"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/login"
            onClick={closeMenu}
            className={`block min-h-[44px] py-3 text-sm font-semibold ${
              isLight ? "text-[#808080]" : "text-slate-300"
            }`}
          >
            Login
          </Link>
        </li>
      </ul>
    </details>
  );
}
