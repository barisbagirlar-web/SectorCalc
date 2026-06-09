"use client";

import { useRef } from "react";
import { MobileHeaderNav } from "@/components/layout/HeaderNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { RegionSelector } from "@/components/layout/RegionSelector";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";

export function MobileNav() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="relative lg:hidden">
      <summary className="apple-nav__menu-btn min-h-[44px] min-w-[44px]" aria-label="Open menu">
        <ScIcon icon={UI_ICON.menu} size="compact" className="text-current" />
      </summary>
      <ul className="apple-nav__dropdown">
        <li className="px-4 py-2">
          <div className="sc-header-locale-group flex w-full flex-wrap gap-2">
            <RegionSelector className="min-w-0 flex-1" />
            <LocaleSwitcher className="min-w-0 flex-1" />
          </div>
        </li>
        <MobileHeaderNav onNavigate={closeMenu} />
      </ul>
    </details>
  );
}
