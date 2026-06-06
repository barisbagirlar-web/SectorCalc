"use client";

import Link from "next/link";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavLinkWithIcon } from "@/components/icons/NavLinkWithIcon";
import { ScIcon } from "@/components/icons/ScIcon";
import { AUTH_NAV_ITEMS, PUBLIC_NAV_ITEMS } from "@/config/site";
import { UI_ICON } from "@/lib/icons/icon-registry";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getFreeToolsHref, getPricingHref } from "@/lib/tools/tool-links";

type HeaderTheme = "light" | "dark";

interface HeaderNavProps {
  theme?: HeaderTheme;
  onNavigate?: () => void;
}

function navLinkClass(theme: HeaderTheme, mobile: boolean): string {
  if (mobile) {
    return theme === "light"
      ? "block min-h-[44px] py-3 text-sm font-semibold uppercase tracking-wide text-[#303030]"
      : "block min-h-[44px] py-3 text-sm font-semibold uppercase tracking-wide text-slate-300";
  }
  return "";
}

export function DesktopHeaderNav({ theme = "light" }: { theme?: HeaderTheme }) {
  const { user, loading } = useUserSubscription();

  return (
    <nav id="main-navigation" aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {PUBLIC_NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavLinkWithIcon href={item.href} label={item.label} />
          </li>
        ))}
        {!loading && user
          ? AUTH_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLinkWithIcon href={item.href} label={item.label} />
              </li>
            ))
          : null}
        {!loading && !user ? (
          <li>
            <HeaderAuthCta theme={theme} />
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export function HeaderActions({ theme = "light" }: { theme?: HeaderTheme }) {
  const { isActive, loading } = useUserSubscription();
  const isLight = theme === "light";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <ThemeToggle />
      {!loading && !isActive ? (
        <Link
          href={getPricingHref()}
          className={`inline-flex min-h-[44px] items-center gap-1.5 px-3 text-sm font-semibold ${
            isLight ? "text-professional-blue hover:text-blue-700" : "text-cyan hover:text-white"
          }`}
        >
          <ScIcon icon={UI_ICON.security} size="compact" className="text-current" />
          Unlock Pro
        </Link>
      ) : null}
      <Link
        href={getFreeToolsHref()}
        className="sc-btn-primary inline-flex !min-h-[44px] items-center gap-2 !px-4 !text-sm"
      >
        <ScIcon icon={MagnifyingGlassCircleIcon} size="compact" className="text-white" />
        Run Free Check
      </Link>
    </div>
  );
}

export function MobileHeaderNav({ theme = "light", onNavigate }: HeaderNavProps) {
  const { user, loading } = useUserSubscription();

  return (
    <>
      {PUBLIC_NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <NavLinkWithIcon
            href={item.href}
            label={item.label}
            onClick={onNavigate}
            className={navLinkClass(theme, true)}
          />
        </li>
      ))}
      {!loading && user
        ? AUTH_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLinkWithIcon
                href={item.href}
                label={item.label}
                onClick={onNavigate}
                className={navLinkClass(theme, true)}
              />
            </li>
          ))
        : null}
      {!loading && !user ? (
        <li>
          <HeaderAuthCta theme={theme} onNavigate={onNavigate} />
        </li>
      ) : null}
      <li>
        <Link
          href={getFreeToolsHref()}
          onClick={onNavigate}
          className={`inline-flex min-h-[44px] items-center gap-2 py-3 text-sm font-semibold ${
            theme === "light" ? "text-professional-blue" : "text-cyan"
          }`}
        >
          <ScIcon
            icon={MagnifyingGlassCircleIcon}
            size="compact"
            className={theme === "light" ? "text-professional-blue" : "text-cyan"}
          />
          Run Free Check
        </Link>
      </li>
      <li>
        <ThemeToggle className="mt-2" />
      </li>
    </>
  );
}
