"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BRAND_ASSETS } from "@/config/brand";
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

function PanelShapeSvg({ label }: { readonly label: string }) {
  return (
    <svg className="sch-shape-svg" viewBox="0 0 120 80" aria-hidden="true">
      <circle cx="60" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M26 40 H94" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <text x="60" y="44" textAnchor="middle">
        {label}
      </text>
    </svg>
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
              <Image
                src={BRAND_ASSETS.favicon.master}
                alt=""
                width={28}
                height={28}
                unoptimized
                className="sch-logo-icon"
                aria-hidden
              />
              <span className="sch-logo-text">{t("logoText")}</span>
            </Link>
            <span className="sch-badge">{t("badge")}</span>
          </div>
          <div className="sch-hud-right">
            <span>{t("hudRight1")}</span>
            <span>{t("hudRight2")}</span>
          </div>
        </div>

        <div className="sch-grid">
          <div className="sch-panel">
            <div className="sch-panel-visual">
              <PanelShapeSvg label={t("panel1Svg")} />
            </div>
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_COST_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel">
            <div className="sch-panel-visual">
              <PanelShapeSvg label={t("panel2Svg")} />
            </div>
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_LOSS_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel">
            <div className="sch-panel-visual">
              <PanelShapeSvg label={t("panel3Svg")} />
            </div>
            <div className="sch-panel-content">
              <FooterPanelList
                links={SECTOR_FOOTER_TECHNICAL_LINKS}
                labelFor={(key) => t(key)}
                hrefFor={resolveHref}
              />
            </div>
          </div>

          <div className="sch-panel sch-panel-terminal">
            <div className="sch-panel-visual">
              <PanelShapeSvg label={t("panel4Svg")} />
            </div>
            <div className="sch-terminal-body">
              <form className="sch-form" onSubmit={(event) => event.preventDefault()} noValidate>
                <label htmlFor="sch-footer-email">{t("newsletterLabel")}</label>
                <input
                  id="sch-footer-email"
                  type="email"
                  name="email"
                  placeholder={t("newsletterPlaceholder")}
                  autoComplete="email"
                />
                <button type="button">{t("newsletterButton")}</button>
              </form>
              <div className="sch-social-grid">
                <a
                  href={SITE_SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  {t("socialIn")}
                </a>
                <Link href={getSectorFooterApiHref()} prefetch={false}>
                  {t("socialApi")}
                </Link>
                <a href="/llms.txt">{t("socialLlms")}</a>
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
            <span>{t("metaReg")}</span>
            <span>{t("metaCur")}</span>
            <span>{t("metaCopyright")}</span>
          </div>
        </nav>
      </div>
    </footer>
  );
}
