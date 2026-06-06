"use client";

import { useRef } from "react";
import { MobileHeaderNav } from "@/components/layout/HeaderNav";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getPricingHref } from "@/lib/tools/tool-links";
import Link from "next/link";

type HeaderTheme = "light" | "dark";

interface MobileNavProps {
  theme?: HeaderTheme;
}

export function MobileNav({ theme = "light" }: MobileNavProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const isLight = theme === "light";
  const { isActive, loading } = useUserSubscription();

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="lg:hidden">
      <summary
        className={`flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden ${
          isLight ? "text-[#303030] dark:text-slate-200" : "text-white"
        }`}
        aria-label="Open menu"
      >
        <ScIcon icon={UI_ICON.menu} size="default" className="text-current" />
      </summary>
      <ul
        className={`absolute left-0 right-0 top-full z-50 border-b bg-white px-4 py-3 shadow-lg dark:bg-slate-900 ${
          isLight ? "border-[#e5e5e5] dark:border-slate-700" : "border-white/10 bg-dark-navy"
        }`}
      >
        <MobileHeaderNav theme={theme} onNavigate={closeMenu} />
        {!loading && !isActive ? (
          <li>
            <Link
              href={getPricingHref()}
              onClick={closeMenu}
              className={`block min-h-[44px] py-3 text-sm font-semibold ${
                isLight ? "text-professional-blue" : "text-cyan"
              }`}
            >
              Unlock Pro
            </Link>
          </li>
        ) : null}
      </ul>
    </details>
  );
}
