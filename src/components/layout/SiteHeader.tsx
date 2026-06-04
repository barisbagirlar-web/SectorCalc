import Link from "next/link";
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
          <Link href="/" className="font-bold text-white">
            SectorCalc
          </Link>
          <MobileNav theme="dark" />
        </div>
      </header>
    );
  }

  return (
    <header id="header" className="mc-header sticky top-0 z-50">
      <div className="container">
        <Link href="/" className="mc-logo">
          Sector<em>Calc</em>
        </Link>
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
