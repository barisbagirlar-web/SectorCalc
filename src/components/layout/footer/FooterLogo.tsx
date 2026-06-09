import Image from "next/image";
import { Link } from "@/i18n/routing";
import { BRAND_ASSETS } from "@/config/brand";

type FooterLogoProps = {
  readonly tagline: string;
};

export function FooterLogo({ tagline }: FooterLogoProps) {
  return (
    <div className="footer-brand">
      <Link href="/" prefetch={false} className="footer-logo" aria-label="SectorCalc home">
        <Image
          src={BRAND_ASSETS.favicon.master}
          alt=""
          width={32}
          height={32}
          unoptimized
          className="footer-logo-icon"
          aria-hidden
        />
        <span className="footer-logo-text">
          <span className="sector">Sector</span>
          <span className="calc">Calc</span>
        </span>
      </Link>
      <p className="footer-tagline">{tagline}</p>
    </div>
  );
}
