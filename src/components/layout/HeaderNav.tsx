"use client";

import { useTranslations } from "next-intl";
import { DESKTOP_HEADER_NAV, PRIMARY_HEADER_NAV } from "@/config/site";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { ActiveNavLink } from "@/components/layout/ActiveNavLink";

interface HeaderNavProps {
  onNavigate?: () => void;
  linkClassName?: string;
  activeLinkClassName?: string;
}

export function DesktopHeaderNav() {
  const t = useTranslations("nav");

  return (
    <nav id="main-navigation" aria-label="Main">
      <ul className="apple-nav__links">
        {DESKTOP_HEADER_NAV.map((item) => (
          <li key={item.href}>
            <ActiveNavLink
              href={item.href}
              label={t(item.key)}
              className="apple-nav__link"
              showIcon={false}
              prefetch={false}
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

export function MobileHeaderNav({
  onNavigate,
  linkClassName = "apple-nav__dropdown-link",
  activeLinkClassName = "apple-nav__dropdown-link--active",
}: HeaderNavProps) {
  const t = useTranslations("nav");

  return (
    <>
      {PRIMARY_HEADER_NAV.map((item) => (
        <li key={item.href}>
          <ActiveNavLink
            href={item.href}
            label={t(item.key)}
            onClick={onNavigate}
            className={linkClassName}
            activeClassName={activeLinkClassName}
            showIcon={false}
            prefetch={false}
          />
        </li>
      ))}
      <li>
        <HeaderAuthCta onNavigate={onNavigate} mobile />
      </li>
    </>
  );
}
