"use client";

import { useTranslations } from "next-intl";

type ProFeatureNoticeProps = {
  readonly messageKey:
    | "lockedExport"
    | "lockedReportHistory"
    | "lockedTrustTrace"
    | "fullReportRequiresPro";
};

export function ProFeatureNotice({ messageKey }: ProFeatureNoticeProps) {
  const t = useTranslations("premiumAccess");

  return (
    <p className="sc-pro-feature-notice text-sm leading-relaxed text-body-charcoal" role="note">
      {t(messageKey)}
    </p>
  );
}
