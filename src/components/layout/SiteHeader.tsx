import { useTranslations } from "next-intl";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { DesktopHeaderNav } from "@/components/layout/HeaderNav";
import { HeaderNavPrefetch } from "@/components/layout/HeaderNavPrefetch";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { RegionSelector } from "@/components/layout/RegionSelector";

export function SiteHeader() {
  const a11y = useTranslations("a11y");
  return (
    <>
      <header id="header" className="apple-nav sc-header-craft" role="banner">
      <HeaderNavPrefetch />
      <div className="apple-nav__inner">
        <SiteLogo priority />

        <div className="apple-nav__main">
          <DesktopHeaderNav />
        </div>

        <div className="apple-nav__utilities">
          <div className="sc-header-util-compact hidden lg:flex">
            <div className="sc-header-locale-group" aria-label={a11y("regionLanguage")}>
              <div className="hidden xl:block">
                <RegionSelector className="sc-header-locale-control" variant="compact" />
              </div>
              <LocaleSwitcher className="sc-header-locale-control" variant="compact" />
            </div>
            <HeaderAuthCta />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
    </>
  );
}
