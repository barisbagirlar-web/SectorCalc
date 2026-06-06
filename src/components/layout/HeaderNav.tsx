"use client";

import Link from "next/link";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AUTH_NAV_ITEMS, PUBLIC_NAV_ITEMS } from "@/config/site";
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
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
        {!loading && user
          ? AUTH_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
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
          className={`inline-flex min-h-[44px] items-center px-3 text-sm font-semibold ${
            isLight ? "text-professional-blue hover:text-blue-700" : "text-cyan hover:text-white"
          }`}
        >
          Unlock Pro
        </Link>
      ) : null}
      <Link
        href={getFreeToolsHref()}
        className="sc-btn-primary !min-h-[44px] !px-4 !text-sm"
      >
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
          <Link
            href={item.href}
            onClick={onNavigate}
            className={navLinkClass(theme, true)}
          >
            {item.label}
          </Link>
        </li>
      ))}
      {!loading && user
        ? AUTH_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={navLinkClass(theme, true)}
              >
                {item.label}
              </Link>
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
          className={`block min-h-[44px] py-3 text-sm font-semibold ${
            theme === "light" ? "text-professional-blue" : "text-cyan"
          }`}
        >
          Run Free Check
        </Link>
      </li>
      <li>
        <ThemeToggle className="mt-2" />
      </li>
    </>
  );
}
