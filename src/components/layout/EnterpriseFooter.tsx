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

const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "disclaimer", href: "/disclaimer" },
] as const;

export function EnterpriseFooter() {
  const t = useTranslations("enterpriseFooter");
  const year = new Date().getFullYear();

  return (
    <footer className="apple-footer apple-footer--v2 apple-footer--simple">
      <div className="apple-footer__inner">
        <FooterLogo tagline={t("tagline")} />

        <div className="footer-columns footer-columns--simple">
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

        <div className="footer-bottom footer-bottom--simple">
          <FooterLocaleControl />
          <p className="copyright">{t("copyrightSimple", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
