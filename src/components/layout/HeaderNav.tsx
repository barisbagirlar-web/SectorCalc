"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavLinkWithIcon } from "@/components/icons/NavLinkWithIcon";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

type HeaderTheme = "light" | "dark";

interface HeaderNavProps {
  theme?: HeaderTheme;
  onNavigate?: () => void;
}

const PUBLIC_NAV_KEYS = [
  { key: "freeTools", href: "/free-tools" },
  { key: "premiumTools", href: "/premium-tools" },
  { key: "industries", href: "/industries" },
  { key: "pricing", href: "/pricing" },
] as const;

const AUTH_NAV_KEYS = [
  { key: "reports", href: "/account/reports" },
  { key: "account", href: "/account" },
] as const;

function navLinkClass(theme: HeaderTheme, mobile: boolean): string {
  if (mobile) {
    return theme === "light"
      ? "block min-h-[44px] py-3 text-sm font-semibold uppercase tracking-wide text-[#303030]"
      : "block min-h-[44px] py-3 text-sm font-semibold uppercase tracking-wide text-slate-300";
  }
  return "";
}

export function DesktopHeaderNav({ theme = "light" }: { theme?: HeaderTheme }) {
  const t = useTranslations("nav");
  const { user, loading } = useUserSubscription();

  return (
    <nav id="main-navigation" aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {PUBLIC_NAV_KEYS.map((item) => (
          <li key={item.href}>
            <NavLinkWithIcon href={item.href} label={t(item.key)} />
          </li>
        ))}
        {!loading && user
          ? AUTH_NAV_KEYS.map((item) => (
              <li key={item.href}>
                <NavLinkWithIcon href={item.href} label={t(item.key)} />
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
  const t = useTranslations("nav");
  const { isActive, loading } = useUserSubscription();
  const isLight = theme === "light";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <ThemeToggle />
      {!loading && !isActive ? (
        <Link
          href="/pricing"
          className={`inline-flex min-h-[44px] items-center gap-1.5 px-3 text-sm font-semibold ${
            isLight ? "text-professional-blue hover:text-blue-700" : "text-cyan hover:text-white"
          }`}
        >
          <ScIcon icon={UI_ICON.security} size="compact" className="text-current" />
          {t("unlockPro")}
        </Link>
      ) : null}
      <Link
        href="/free-tools"
        className="sc-btn-primary inline-flex !min-h-[44px] items-center gap-2 !px-4 !text-sm"
      >
        <ScIcon icon={MagnifyingGlassCircleIcon} size="compact" className="text-white" />
        {t("runFreeCheck")}
      </Link>
    </div>
  );
}

export function MobileHeaderNav({ theme = "light", onNavigate }: HeaderNavProps) {
  const t = useTranslations("nav");
  const { user, loading } = useUserSubscription();

  return (
    <>
      {PUBLIC_NAV_KEYS.map((item) => (
        <li key={item.href}>
          <NavLinkWithIcon
            href={item.href}
            label={t(item.key)}
            onClick={onNavigate}
            className={navLinkClass(theme, true)}
          />
        </li>
      ))}
      {!loading && user
        ? AUTH_NAV_KEYS.map((item) => (
            <li key={item.href}>
              <NavLinkWithIcon
                href={item.href}
                label={t(item.key)}
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
          href="/free-tools"
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
          {t("runFreeCheck")}
        </Link>
      </li>
      <li>
        <ThemeToggle className="mt-2" />
      </li>
    </>
  );
}
