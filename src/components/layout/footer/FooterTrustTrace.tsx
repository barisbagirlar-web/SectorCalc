import Image from "next/image";
import { Link } from "@/i18n/routing";
import { BRAND_ASSETS } from "@/config/brand";
import { SITE } from "@/config/site";

type FooterTrustTraceProps = {
  readonly title: string;
  readonly linkLabel: string;
  readonly subtext: string;
};

/** Brand mark — stable favicon frame (QR lives on PDF reports only). */
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

function TrustTraceCheckIcon() {
  return (
    <svg
      className="verify-report-box__check"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function FooterTrustTrace({ title, linkLabel, subtext }: FooterTrustTraceProps) {
  const verifyUrl = `${SITE.domain}/verify`;

  return (
    <section className="verify-report-box" aria-labelledby="footer-trust-trace-heading">
      <TrustVerifyMark />
      <div className="verify-report-box__copy">
        <div className="verify-report-box__label">
          <TrustTraceCheckIcon />
          <h2 id="footer-trust-trace-heading" className="verify-report-box__title">
            {title}
          </h2>
        </div>
        <h3 className="verify-report-box__heading">{linkLabel}</h3>
        <p className="verify-subtext">{subtext}</p>
        <Link href="/verify" prefetch={false} className="verify-report-box__url">
          {verifyUrl}
        </Link>
      </div>
    </section>
  );
}
