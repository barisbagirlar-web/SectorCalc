import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BRAND_ASSETS } from "@/config/brand";

type FooterLogoProps = {
  readonly tagline: string;
};

export function FooterLogo({ tagline }: FooterLogoProps) {
  const a11y = useTranslations("a11y");
  return (
    <div className="footer-brand">
      <Link href="/" prefetch={false} className="footer-logo" aria-label={a11y("logoHome")}>
        <img
          src={BRAND_ASSETS.logo.symbolSvg}
          alt={a11y("logoAlt")}
          width={BRAND_ASSETS.logo.displaySymbolWidth}
          height={BRAND_ASSETS.logo.displaySymbolHeight}
          className="footer-logo-icon"
        />
      </Link>
      <p className="footer-tagline">{tagline}</p>
    </div>
  );
}
