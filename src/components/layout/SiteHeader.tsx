import { SiteLogo } from "@/components/brand/SiteLogo";
import {
  DesktopHeaderNav,
  HeaderActions,
} from "@/components/layout/HeaderNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";

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
    <header id="header" className="mc-header sticky top-0 z-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="container">
        <SiteLogo priority />
        <DesktopHeaderNav theme="light" />
        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher />
          <HeaderActions theme="light" />
        </div>
        <MobileNav theme="light" />
      </div>
    </header>
  );
}
