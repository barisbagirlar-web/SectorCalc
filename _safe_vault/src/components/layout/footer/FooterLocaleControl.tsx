"use client";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { RegionSelector } from "@/components/layout/RegionSelector";

export function FooterLocaleControl() {
  return (
    <div className="footer-locale-control">
      <RegionSelector className="language-selector language-selector--footer" />
      <LocaleSwitcher className="language-selector language-selector--footer" />
    </div>
  );
}
