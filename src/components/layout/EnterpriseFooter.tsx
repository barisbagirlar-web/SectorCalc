"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FooterLocaleControl } from "@/components/layout/footer/FooterLocaleControl";
import { FooterLogo } from "@/components/layout/footer/FooterLogo";
import { FooterNewsletter } from "@/components/layout/footer/FooterNewsletter";
import { FooterSocialLinks } from "@/components/layout/footer/FooterSocialLinks";
import { FooterTrustBar } from "@/components/layout/footer/FooterTrustBar";
import { FooterTrustTrace } from "@/components/layout/footer/FooterTrustTrace";

const PRODUCT_LINKS = [
  { key: "freeChecks", href: "/free-tools" },
  { key: "premiumTools", href: "/premium-tools" },
  { key: "industries", href: "/industries" },
  { key: "pricing", href: "/pricing" },
  { key: "categories", href: "/categories" },
] as const;

const SECTOR_LINKS = [
  { key: "manufacturing", href: "/industries/cnc-manufacturing" },
  { key: "logistics", href: "/industries/logistics-transport" },
  { key: "construction", href: "/industries/construction" },
] as const;

const COMPANY_LINKS = [
  { key: "about", href: "/about" },
  { key: "manifesto", href: "/manifesto" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "methodology", href: "/methodology" },
  { key: "blog", href: "/case-studies" },
] as const;

const TRUST_LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "disclaimer", href: "/disclaimer" },
] as const;

const AUTHORITY_LINKS = [
  { key: "trust", href: "/trust" },
  { key: "vault", href: "/account/archive" },
  { key: "investorDemo", href: "/investor-demo" },
  { key: "operatingSystem", href: "/operating-system" },
] as const;

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="footer-column">
      <h2 className="footer-column-title">{title}</h2>
      {children}
    </div>
  );
}

export function EnterpriseFooter() {
  const t = useTranslations("enterpriseFooter");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const trustBadges = [
    { icon: "🔒", label: t("trustBar.iso") },
    { icon: "⚡", label: t("trustBar.sla") },
    { icon: "🛡", label: t("trustBar.kvkk") },
    { icon: "✓", label: t("trustBar.gdpr") },
  ] as const;

  return (
    <footer className="apple-footer apple-footer--v2">
      <div className="apple-footer__inner">
        <div className="footer-top">
          <FooterLogo tagline={t("tagline")} />
          <Link href="/pricing" prefetch={false} className="footer-cta get-pro-btn">
            {tNav("getPro")}
          </Link>
        </div>

        <FooterNewsletter
          title={t("newsletter.title")}
          placeholder={t("newsletter.placeholder")}
          buttonLabel={t("newsletter.button")}
          note={t("newsletter.note")}
        />

        <div className="footer-columns">
          <FooterColumn title={t("productTitle")}>
            <ul className="footer-link-list">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link">
                    {t(`product.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t("sectorsTitle")}>
            <ul className="footer-link-list">
              {SECTOR_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link">
                    {t(`sectors.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/industries" className="footer-link">
                  {t("allSectors")}
                </Link>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn title={t("companyTitle")}>
            <ul className="footer-link-list">
              {COMPANY_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link">
                    {t(`company.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t("trustLegalTitle")}>
            <ul className="footer-link-list">
              {TRUST_LEGAL_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link">
                    {t(`compliance.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t("authorityTitle")}>
            <ul className="footer-link-list">
              {AUTHORITY_LINKS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="footer-link">
                    {t(`authority.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <FooterTrustTrace
          title={t("trustTrace.title")}
          linkLabel={t("trustTrace.link")}
          subtext={t("trustTrace.subtext")}
        />

        <FooterTrustBar badges={trustBadges} />

        <div className="footer-bottom">
          <FooterLocaleControl />
          <p className="copyright">{t("copyrightManifesto", { year })}</p>
          <FooterSocialLinks
            linkedinLabel={t("social.linkedin")}
            twitterLabel={t("social.twitter")}
            githubLabel={t("social.github")}
          />
        </div>
      </div>
    </footer>
  );
}
