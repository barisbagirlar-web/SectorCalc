import Image from "next/image";
import { Link } from "@/i18n/routing";
import { BRAND_ASSETS } from "@/config/brand";
import { SITE } from "@/config/site";

type FooterTrustTraceProps = {
  readonly title: string;
  readonly linkLabel: string;
  readonly subtext: string;
};

/** SectorCalc verify mark — brand favicon in a stable frame (replaces broken decorative QR grid). */
function TrustVerifyMark() {
  return (
    <div className="verify-report-box__mark" aria-hidden>
      <Image
        src={BRAND_ASSETS.favicon.master}
        alt=""
        width={56}
        height={56}
        unoptimized
        className="verify-report-box__mark-img"
      />
    </div>
  );
}

export function FooterTrustTrace({ title, linkLabel, subtext }: FooterTrustTraceProps) {
  const verifyUrl = `${SITE.domain}/verify`;

  return (
    <section className="verify-report-box" aria-labelledby="footer-trust-trace-heading">
      <TrustVerifyMark />
      <div className="verify-report-box__copy">
        <h2 id="footer-trust-trace-heading" className="verify-report-box__title">
          {title}
        </h2>
        <Link href="/verify" className="verify-link footer-link">
          {linkLabel}
        </Link>
        <p className="verify-subtext">{subtext}</p>
        <p className="verify-url">{verifyUrl}</p>
      </div>
    </section>
  );
}
