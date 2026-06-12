"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  SECTOR_FOOTER_COST_LINKS,
  SECTOR_FOOTER_LOSS_LINKS,
  SECTOR_FOOTER_TECHNICAL_LINKS,
  resolveSectorFooterPremiumHref,
  type SectorFooterPanelLink,
} from "@/lib/footer/sector-footer-links";

const LEGAL_LINKS = [
  { key: "legalPrivacy", href: "/privacy" },
  { key: "legalTerms", href: "/terms" },
  { key: "legalDisclaimer", href: "/disclaimer" },
] as const;

type PanelSymbolVariant = "cost" | "loss" | "technical" | "library";

function PanelSymbolSvg({
  label,
  variant,
}: {
  readonly label: string;
  readonly variant: PanelSymbolVariant;
}) {
  return (
    <div className="sch-panel-visual">
      <svg viewBox="0 0 280 280" className="sch-shape-svg" aria-hidden="true">
        <circle cx="140" cy="140" r="138" className="sch-svg-bg" />
        {variant === "cost" ? (
          <path
            d="M140 70 V210 M70 140 H210"
            className="sch-svg-icon sch-spin-hover"
          />
        ) : null}
        {variant === "loss" ? (
          <path d="M70 140 H210" className="sch-svg-icon sch-spin-hover" />
        ) : null}
        {variant === "technical" ? (
          <path
            d="M90 90 L190 190 M190 90 L90 190"
            className="sch-svg-icon sch-spin-hover"
          />
        ) : null}
        {variant === "library" ? (
          <>
            <circle cx="140" cy="90" r="8" fill="currentColor" className="sch-svg-dot" />
            <path d="M70 140 H210" className="sch-svg-icon sch-spin-hover" />
            <circle cx="140" cy="190" r="8" fill="currentColor" className="sch-svg-dot" />
          </>
        ) : null}
        <text x="140" y="145" className="sch-svg-text">
          {label}
        </text>
      </svg>
    </div>
  );
}

function FooterPanelList({
  links,
  labelFor,
  hrefFor,
}: {
  readonly links: readonly SectorFooterPanelLink[];
  readonly labelFor: (key: string) => string;
  readonly hrefFor: (link: SectorFooterPanelLink) => string;
}) {
  return (
    <ul className="sch-list">
      {links.map((link) => (
        <li key={link.labelKey}>
          <Link href={hrefFor(link)} prefetch={false}>
            {labelFor(link.labelKey)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function EnterpriseFooter() {
  const t = useTranslations("sectorFooter");

  const resolveHref = (link: SectorFooterPanelLink) =>
    resolveSectorFooterPremiumHref(link.premiumSchemaSlug, link.fallbackHref);

  return (
    <footer className="sch-footer">
      <div className="sch-container">
        <div className="sch-hud-bar">
          <div className="sch-hud-left">
            <div className="sch-footer-brand">
              <Link href="/" prefetch={false} className="sch-logo" aria-label={t("homeAria")}>
                <div className="sch-logo-icon" aria-hidden="true">
                  <span className="sch-sq sch-sq-1" />
                  <span className="sch-sq sch-sq-2" />
                  <span className="sch-sq sch-sq-3" />
                  <span className="sch-sq sch-sq-4" />
                </div>
                <span className="sch-logo-text">{t("logoText")}</span>
              </Link>
              <p className="sch-footer-tagline">{t("tagline")}</p>
            </div>
          </div>
        </div>

        <div className="sch-grid">
          <div className="sch-panel">
            <PanelSymbolSvg label={t("panel1Svg")} variant="cost" />
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_COST_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel">
            <PanelSymbolSvg label={t("panel2Svg")} variant="loss" />
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_LOSS_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel">
            <PanelSymbolSvg label={t("panel3Svg")} variant="technical" />
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_TECHNICAL_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel sch-panel-note">
            <PanelSymbolSvg label={t("panel4Svg")} variant="library" />
            <div className="sch-panel-content">
              <p className="sch-footer-note-title">{t("noteTitle")}</p>
              <p className="sch-footer-note">{t("noteBody")}</p>
            </div>
          </div>
        </div>

        <div className="sch-bottom-nav">
          <nav className="sch-legal-links" aria-label={t("legalNavAria")}>
            {LEGAL_LINKS.map((item) => (
              <Link key={item.key} href={item.href} prefetch={false}>
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="sch-meta-info">
            <span className="sch-mono-text">{t("metaCopyright")}</span>
            <span className="sch-mono-text">{t("metaRights")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
