import Link from "next/link";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_ITEMS } from "@/config/site";

type HeaderTheme = "light" | "dark";

interface SiteHeaderProps {
  theme?: HeaderTheme;
}

export function SiteHeader({ theme = "light" }: SiteHeaderProps) {
  if (theme === "dark") {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#155079]">
        <div className="container flex h-16 items-center justify-between">
          <SiteLogo variant="on-dark" priority />
          <MobileNav theme="dark" />
        </div>
      </header>
    );
  }

  return (
    <header id="header" className="mc-header sticky top-0 z-50">
      <div className="container">
        <SiteLogo priority />
        <nav id="main-navigation" aria-label="Main">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <MobileNav theme="light" />
      </div>
    </header>
  );
}
