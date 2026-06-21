"use client";

import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ORGANIZATION_TRUST, organizationDescriptionForLocale } from "@/config/organization-trust";
import { hasCanonicalToolCatalog } from "@/lib/tools/canonical-tool-slugs";
import { FOOTER_PLATFORM_NAV, SITE_SOCIAL } from "@/config/site";
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

function FooterUtilityBar() {
  const t = useTranslations("sectorFooter");
  const tNav = useTranslations("nav");

  return (
    <div className="sch-footer-utility" aria-label={t("actionsAria")}>
      <section
        className="sch-footer-utility-col"
        aria-labelledby="sch-footer-social-heading"
      >
        <h3 id="sch-footer-social-heading" className="sch-footer-col-title">
          {t("socialAria")}
        </h3>
        <div className="sch-social-links">
          <a
            href={SITE_SOCIAL.linkedin}
            className="sch-social-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("linkedinAria")}
          >
            <svg viewBox="0 0 24 24" className="sch-social-svg" aria-hidden="true">
              <path
                fill="currentColor"
                d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.4 8h4.2v14H.4V8zm7.1 0h4v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V22h-4.2v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7v7H7.5V8z"
              />
            </svg>
            <span className="sch-social-text">{t("linkedinLabel")}</span>
          </a>
          <a
            href={SITE_SOCIAL.twitter}
            className="sch-social-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("twitterAria")}
          >
            <svg viewBox="0 0 24 24" className="sch-social-svg" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            <span className="sch-social-text">{t("twitterLabel")}</span>
          </a>
        </div>
      </section>

      <section
        className="sch-footer-utility-col sch-footer-utility-col-center"
        aria-labelledby="sch-footer-platform-heading"
      >
        <h3 id="sch-footer-platform-heading" className="sch-footer-col-title">
          {t("platformNavAria")}
        </h3>
        <nav className="sch-platform-links">
          {FOOTER_PLATFORM_NAV.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {tNav(item.key)}
            </Link>
          ))}
        </nav>
      </section>

      <section
        className="sch-footer-utility-col sch-footer-utility-col-end"
        aria-labelledby="sch-footer-resource-heading"
      >
        <h3 id="sch-footer-resource-heading" className="sch-footer-col-title">
          {t("resourceAria")}
        </h3>
        <nav className="sch-resource-links">
          <a href="/llms.txt" className="sch-resource-link">
            {t("llmIndexLabel")}
          </a>
          <a href="/sitemap.xml" className="sch-resource-link">
            {t("sitemapLabel")}
          </a>
        </nav>
      </section>
    </div>
  );
}

export function EnterpriseFooter() {
  const t = useTranslations("sectorFooter");
  const locale = useLocale();
  const trustDescription = organizationDescriptionForLocale(locale);
  const showToolPanels = hasCanonicalToolCatalog();

  const resolveHref = (link: SectorFooterPanelLink) =>
    resolveSectorFooterPremiumHref(link.premiumSchemaSlug, link.fallbackHref);

  return (
    <footer className="sch-footer" itemScope itemType="https://schema.org/LocalBusiness">
      <div className="sr-only" aria-hidden="true">
        <span itemProp="name">{ORGANIZATION_TRUST.displayName}</span>
        <span itemProp="description">{trustDescription}</span>
        <span itemProp="telephone">{ORGANIZATION_TRUST.phone}</span>
        <span itemProp="email">{ORGANIZATION_TRUST.email}</span>
        <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">{ORGANIZATION_TRUST.address.streetAddress}</span>
          <span itemProp="addressLocality">{ORGANIZATION_TRUST.address.addressLocality}</span>
          <span itemProp="addressCountry">{ORGANIZATION_TRUST.address.addressCountry}</span>
        </span>
      </div>
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

        {showToolPanels ? (
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
        ) : null}

        <FooterUtilityBar />

        <div className="sch-bottom-nav">
          <nav className="sch-legal-links" aria-label={t("legalNavAria")}>
            {LEGAL_LINKS.map((item) => (
              <Link key={item.key} href={item.href} prefetch={false}>
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <p className="sch-meta-info">
            <span className="sch-mono-text">{t("metaCopyright")}</span>
            <span className="sch-meta-sep" aria-hidden="true">
              ·
            </span>
            <span className="sch-mono-text">{t("metaRights")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
