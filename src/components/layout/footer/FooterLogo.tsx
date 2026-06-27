import { Link } from "@/i18n/routing";

type FooterLogoProps = {
  readonly tagline: string;
};

export function FooterLogo({ tagline }: FooterLogoProps) {
  return (
    <div className="footer-brand">
      <Link href="/" prefetch={false} className="footer-logo" aria-label="SectorCalc home">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden
          className="footer-logo-icon"
        >
          <rect x="2" y="2" width="13" height="13" fill="#1A1915"/>
          <rect x="17" y="2" width="13" height="13" fill="#BD5D3A"/>
          <rect x="2" y="17" width="13" height="13" fill="#1A1915" fillOpacity="0.30"/>
          <rect x="17" y="17" width="13" height="13" fill="#BD5D3A" fillOpacity="0.30"/>
        </svg>
        <span className="footer-logo-text">SectorCalc</span>
      </Link>
      <p className="footer-tagline">{tagline}</p>
    </div>
  );
}
