import { useTranslations } from "@/lib/i18n-stub";

type FooterTrustBarProps = {
  readonly badges: readonly {
    readonly icon: string;
    readonly label: string;
  }[];
};

export function FooterTrustBar({ badges }: FooterTrustBarProps) {
  const a11y = useTranslations("a11y");
  return (
    <div className="trust-bar" role="list" aria-label={a11y("trustCompliance")}>
      {badges.map((badge) => (
        <div key={badge.label} className="trust-badge" role="listitem">
          <span className="trust-badge-icon" aria-hidden>
            {badge.icon}
          </span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
