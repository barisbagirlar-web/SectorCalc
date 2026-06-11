"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FooterLocaleControl } from "@/components/layout/footer/FooterLocaleControl";
import { FooterLogo } from "@/components/layout/footer/FooterLogo";

const PRODUCT_LINKS = [
  { key: "freeChecks", href: "/free-tools" },
  { key: "premiumTools", href: "/premium-tools" },
  { key: "industries", href: "/industries" },
  { key: "pricing", href: "/pricing" },
] as const;

const AREA_LINKS = [
  { key: "costMargin", href: "/free-tools" },
  { key: "scrapOee", href: "/free-tools" },
  { key: "energyCarbon", href: "/free-tools" },
  { key: "routingLogistics", href: "/free-tools" },
  { key: "constructionField", href: "/free-tools" },
] as const;

const ACCOUNT_LINKS = [
  { key: "login", href: "/login" },
  { key: "signUp", href: "/login?next=/pricing" },
  { key: "premiumTools", href: "/premium-tools" },
  { key: "pricing", href: "/pricing" },
] as const;

const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "disclaimer", href: "/disclaimer" },
] as const;

export function EnterpriseFooter() {
  const t = useTranslations("enterpriseFooter");
  const year = new Date().getFullYear();

  return (
    <footer className="apple-footer apple-footer--v2">
      <div className="apple-footer__inner">
        <div className="footer-columns footer-columns--omni">
          <div className="footer-column footer-column--brand">
            <FooterLogo tagline={t("tagline")} />
          </div>

          <div className="footer-column">
            <h2 className="footer-column-title">{t("productTitle")}</h2>
            <ul className="footer-link-list">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} prefetch={false} className="footer-link">
                    {t(`product.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h2 className="footer-column-title">{t("areasTitle")}</h2>
            <ul className="footer-link-list">
              {AREA_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} prefetch={false} className="footer-link">
                    {t(`areas.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h2 className="footer-column-title">{t("accountTitle")}</h2>
            <ul className="footer-link-list">
              {ACCOUNT_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} prefetch={false} className="footer-link">
                    {t(`account.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h2 className="footer-column-title">{t("legalTitle")}</h2>
            <ul className="footer-link-list">
              {LEGAL_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} prefetch={false} className="footer-link">
                    {t(`compliance.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom footer-bottom--omni">
          <FooterLocaleControl />
          <p className="copyright">{t("copyrightSimple", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
