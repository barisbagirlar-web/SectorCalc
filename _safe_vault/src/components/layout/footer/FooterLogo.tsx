import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type FooterLogoProps = {
  readonly tagline: string;
};

export function FooterLogo({ tagline }: FooterLogoProps) {
  const a11y = useTranslations("a11y");
  const t = useTranslations("sectorFooter");
  return (
    <div className="footer-brand">
      <Link href="/" prefetch={false} className="footer-logo" aria-label={a11y("logoHome")}>
        <svg className="footer-logo-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true" width={24} height={24}>
          <rect x="2"  y="2"  width="13" height="13" rx="3" fill="#0F172A"/>
          <rect x="17" y="2"  width="13" height="13" rx="3" fill="#2563EB"/>
          <rect x="2"  y="17" width="13" height="13" rx="3" fill="#10B981"/>
          <rect x="17" y="17" width="13" height="13" rx="3" fill="#F59E0B"/>
        </svg>
        <span className="footer-logo-text">
          <span className="sector">Sector</span>
          <span className="calc">Calc</span>
        </span>
      </Link>
      <p className="footer-tagline">{tagline}</p>
    </div>
  );
}
