"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ScIcon } from "@/components/icons/ScIcon";
import { resolveNavIcon } from "@/lib/ui-shared/icons/icon-registry";
import { isNavLinkActive } from "@/lib/ui-shared/navigation/nav-active";
import { stripLocalePrefix } from "@/i18n/routing";

type ActiveNavLinkProps = {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  showIcon?: boolean;
  prefetch?: boolean;
};

export function ActiveNavLink({
  href,
  label,
  className = "",
  activeClassName = "apple-nav__link--active",
  onClick,
  showIcon = true,
  prefetch = false,
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const isActive = isNavLinkActive(pathname, href);
  const Icon = resolveNavIcon(stripLocalePrefix(href));

  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex items-center gap-2 ${className}${isActive ? ` ${activeClassName}` : ""}`}
    >
      {showIcon && Icon ? (
        <ScIcon icon={Icon} size="compact" className="text-current opacity-80" />
      ) : null}
      {label}
    </Link>
  );
}
