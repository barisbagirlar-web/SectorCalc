"use client";

import { useTranslations } from "next-intl";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { ActiveNavLink } from "@/components/layout/ActiveNavLink";

interface HeaderNavProps {
  onNavigate?: () => void;
}

const OS_NAV_KEYS = [
  { key: "tools", href: "/free-tools" },
  { key: "industries", href: "/industries" },
  { key: "categories", href: "/categories" },
  { key: "reports", href: "/account/reports" },
  { key: "pricing", href: "/pricing" },
] as const;

export function DesktopHeaderNav() {
  const t = useTranslations("nav");

  return (
    <nav id="main-navigation" aria-label="Main">
      <ul className="apple-nav__links">
        {OS_NAV_KEYS.map((item) => (
          <li key={item.href}>
            <ActiveNavLink
              href={item.href}
              label={t(item.key)}
              className="apple-nav__link"
              showIcon={false}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function HeaderActions() {
  return null;
}

export function MobileHeaderNav({ onNavigate }: HeaderNavProps) {
  const t = useTranslations("nav");

  return (
    <>
      {OS_NAV_KEYS.map((item) => (
        <li key={item.href}>
          <ActiveNavLink
            href={item.href}
            label={t(item.key)}
            onClick={onNavigate}
            className="apple-nav__dropdown-link"
            activeClassName="apple-nav__dropdown-link--active"
            showIcon={false}
          />
        </li>
      ))}
      <li>
        <HeaderAuthCta onNavigate={onNavigate} mobile />
      </li>
    </>
  );
}
