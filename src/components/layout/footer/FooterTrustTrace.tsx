import { Link } from "@/i18n/routing";
import { SITE } from "@/config/site";

type FooterTrustTraceProps = {
  readonly title: string;
  readonly linkLabel: string;
  readonly subtext: string;
};

/** Decorative QR grid — links to public verify flow. */
function VerifyQrMark() {
  const modules = [
    "11100111",
    "10100101",
    "10111101",
    "10100101",
    "11100111",
    "00000000",
    "11011011",
    "10101010",
    "11011011",
  ];

  return (
    <svg
      className="verify-qr"
      viewBox="0 0 64 64"
      width={64}
      height={64}
      role="img"
      aria-hidden
    >
      <rect width="64" height="64" fill="#ffffff" />
      {modules.map((row, rowIndex) =>
        row.split("").map((cell, colIndex) =>
          cell === "1" ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * 8}
              y={rowIndex * 8}
              width={7}
              height={7}
              fill="#1e40af"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function FooterTrustTrace({ title, linkLabel, subtext }: FooterTrustTraceProps) {
  const verifyUrl = `${SITE.domain}/verify`;

  return (
    <section className="verify-report-box" aria-labelledby="footer-trust-trace-heading">
      <VerifyQrMark />
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
