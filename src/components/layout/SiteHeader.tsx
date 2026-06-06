import { SiteLogo } from "@/components/brand/SiteLogo";
import {
  DesktopHeaderNav,
  HeaderActions,
} from "@/components/layout/HeaderNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";

export function SiteHeader() {
  return (
    <header id="header" className="mc-header sticky top-0 z-50 border-b border-border-subtle bg-white">
      <div className="container">
        <SiteLogo priority />
        <DesktopHeaderNav />
        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher />
          <HeaderActions />
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
