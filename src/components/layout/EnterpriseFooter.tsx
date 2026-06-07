"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SITE } from "@/config/site";

const SECTOR_LINKS = [
  { key: "manufacturing", href: "/audit/cnc" },
  { key: "logistics", href: "/audit/logistics" },
  { key: "construction", href: "/audit/construction" },
] as const;

const COMPLIANCE_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "disclaimer", href: "/disclaimer" },
] as const;

export function EnterpriseFooter() {
  const t = useTranslations("enterpriseFooter");
  const year = new Date().getFullYear();

  return (
    <footer className="apple-footer">
      <div className="apple-footer__inner">
        <div className="apple-footer__grid">
          <div>
            <h2 className="apple-footer__title">{t("brand")}</h2>
            <p className="apple-footer__text">{t("tagline")}</p>
          </div>

          <div>
            <h2 className="apple-footer__title">{t("sectorsTitle")}</h2>
            <ul className="apple-footer__list">
              {SECTOR_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{t(`sectors.${item.key}`)}</Link>
                </li>
              ))}
              <li>
                <Link href="/">{t("allSectors")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="apple-footer__title">{t("complianceTitle")}</h2>
            <ul className="apple-footer__list">
              {COMPLIANCE_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{t(`compliance.${item.key}`)}</Link>
                </li>
              ))}
              <li>{t("compliance.iso")}</li>
              <li>{t("compliance.sla")}</li>
            </ul>
          </div>

          <div>
            <h2 className="apple-footer__title">{t("authorityTitle")}</h2>
            <p className="apple-footer__text">{t("authorityLine")}</p>
            <ul className="apple-footer__list mt-2">
              <li>
                <Link href="/account/archive">{t("vaultLink")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="apple-footer__fine-print">
          <p>
            {t("copyright", { year, site: SITE.siteName })}
          </p>
        </div>
      </div>
    </footer>
  );
}
