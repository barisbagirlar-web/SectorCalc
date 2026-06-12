"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SITE_SOCIAL } from "@/config/site";
import {
  SECTOR_FOOTER_COST_LINKS,
  SECTOR_FOOTER_LOSS_LINKS,
  SECTOR_FOOTER_TECHNICAL_LINKS,
  getSectorFooterApiHref,
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
            <Link href="/" prefetch={false} className="sch-logo" aria-label="SectorCalc home">
              <span className="sch-sq sch-sq-1" aria-hidden="true" />
              <span className="sch-sq sch-sq-2" aria-hidden="true" />
              <span className="sch-sq sch-sq-3" aria-hidden="true" />
              <span className="sch-sq sch-sq-4" aria-hidden="true" />
              <span className="sch-logo-text">{t("logoText")}</span>
            </Link>
            <span className="sch-badge">{t("badge")}</span>
          </div>
          <div className="sch-hud-right">
            <span className="sch-mono-text sch-status-ok">
              <span className="sch-dot animate-pulse" aria-hidden="true" />
              {t("hudRight1")}
            </span>
            <span className="sch-mono-text">{t("hudRight2")}</span>
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

          <div className="sch-panel sch-panel-terminal">
            <PanelSymbolSvg label={t("panel4Svg")} variant="library" />
            <div className="sch-terminal-body" style={{ width: "100%" }}>
              <label htmlFor="sch-footer-email" className="sch-label">
                {t("newsletterLabel")}
              </label>
              <input
                id="sch-footer-email"
                type="email"
                name="email"
                className="sch-input"
                placeholder={t("newsletterPlaceholder")}
                autoComplete="email"
              />
              <button type="button" className="sch-btn">
                {t("newsletterButton")}
              </button>
              <div className="sch-social-grid">
                <a
                  href={SITE_SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sch-social-node"
                  aria-label="LinkedIn"
                >
                  {t("socialIn")}
                </a>
                <Link
                  href={getSectorFooterApiHref()}
                  prefetch={false}
                  className="sch-social-node"
                >
                  {t("socialApi")}
                </Link>
                <a href="/llms.txt" className="sch-social-node">
                  {t("socialLlms")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <nav className="sch-bottom-nav" aria-label="Footer legal">
          <div className="sch-legal-links">
            {LEGAL_LINKS.map((item) => (
              <Link key={item.key} href={item.href} prefetch={false}>
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="sch-meta-info">
            <span className="sch-mono-text">{t("metaReg")}</span>
            <span className="sch-mono-text">{t("metaCur")}</span>
            <span className="sch-mono-text">{t("metaCopyright")}</span>
          </div>
        </nav>
      </div>
    </footer>
  );
}
