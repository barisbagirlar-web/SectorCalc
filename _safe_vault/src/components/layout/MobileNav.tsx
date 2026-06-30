"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { HeaderAuthCta } from "@/components/layout/HeaderAuthCta";
import { MobileHeaderNav } from "@/components/layout/HeaderNav";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { RegionSelector } from "@/components/layout/RegionSelector";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";

const DEFAULT_PANEL_TOP_PX = 58;

function readHeaderBottomOffset(): number {
  if (typeof document === "undefined") {
    return DEFAULT_PANEL_TOP_PX;
  }

  const header = document.getElementById("header");
  if (!header) {
    return DEFAULT_PANEL_TOP_PX;
  }

  return Math.round(header.getBoundingClientRect().bottom);
}

export function MobileNav() {
  const a11y = useTranslations("a11y");
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelTop, setPanelTop] = useState(DEFAULT_PANEL_TOP_PX);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setPanelTop(readHeaderBottomOffset());
    setOpen((current) => !current);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const syncPanelTop = () => {
      setPanelTop(readHeaderBottomOffset());
    };

    syncPanelTop();
    window.addEventListener("resize", syncPanelTop);
    window.addEventListener("scroll", syncPanelTop, { passive: true });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncPanelTop);
      window.removeEventListener("scroll", syncPanelTop);
    };
  }, [closeMenu, open]);

  const drawer =
    open && mounted
      ? createPortal(
          <div className="sc-mobile-drawer lg:hidden" data-open>
            <button
              type="button"
              className="sc-mobile-drawer__backdrop"
              aria-label={a11y("closeMenu")}
              onClick={closeMenu}
            />
            <nav
              id={panelId}
              className="sc-mobile-drawer__panel"
              role="navigation"
              aria-label={a11y("mobileNavigation")}
              style={{ top: panelTop }}
            >
              <div className="sc-mobile-drawer__section sc-mobile-drawer__section--locale">
                <div className="sc-header-locale-group flex w-full items-center justify-end gap-2">
                  <RegionSelector className="sc-header-locale-control" variant="compact" />
                  <LocaleSwitcher className="sc-header-locale-control" variant="compact" />
                </div>
              </div>
              <ul className="sc-mobile-drawer__links">
                <MobileHeaderNav
                  onNavigate={closeMenu}
                  linkClassName="sc-mobile-drawer__link"
                  activeLinkClassName="sc-mobile-drawer__link sc-mobile-drawer__link--active"
                />
              </ul>
              <div className="sc-mobile-drawer__section sc-mobile-drawer__section--auth">
                <HeaderAuthCta mobile onNavigate={closeMenu} />
              </div>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="apple-nav__mobile-menu relative z-[2] shrink-0 lg:hidden">
        <button
          type="button"
          className="apple-nav__menu-btn sc-mobile-menu-trigger min-h-[44px] min-w-[44px]"
          aria-label={open ? a11y("closeMenu") : a11y("openMenu")}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggleMenu}
        >
          <ScIcon
            icon={open ? UI_ICON.close : UI_ICON.menu}
            size="compact"
            className="text-current"
          />
        </button>
      </div>
      {drawer}
    </>
  );
}
