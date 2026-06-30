import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { BRAND_ASSETS } from "@/config/brand";

type FooterLogoProps = {
  readonly tagline: string;
};

export function FooterLogo({ tagline }: FooterLogoProps) {
  const a11y = useTranslations("a11y");

  return (
    <div className="footer-brand">
      <Link href="/" prefetch={false} className="footer-logo" aria-label={a11y("logoHome")}>
        <Image
          src={BRAND_ASSETS.logo.onDark}
          alt="SectorCalc"
          width={160}
          height={42}
          unoptimized
          className="footer-logo-img"
        />
      </Link>
      <p className="footer-tagline">{tagline}</p>
    </div>
  );
}
