"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { AuditHistoryPanel } from "@/components/os/AuditHistoryPanel";
import { useAuditArchive } from "@/lib/os/hooks/use-audit-archive";
import { getArchiveHref, getLoginHref } from "@/lib/tools/tool-links";

export interface AuditArchiveSectionProps {
  showSampleNote?: boolean;
  showViewAllLink?: boolean;
  maxRecords?: number;
}

export function AuditArchiveSection({
  showSampleNote = true,
  showViewAllLink = true,
  maxRecords = 50,
}: AuditArchiveSectionProps) {
  const t = useTranslations("auditArchive");
  const { records, loading, error, isSample } = useAuditArchive(maxRecords);

  return (
    <div className="space-y-2 font-mono">
      {loading ? (
        <p className="text-xs text-body-charcoal">{t("loading")}</p>
      ) : null}

      {error ? (
        <p className="text-xs text-soft-red terminal-status-crit" role="alert">
          {error}
        </p>
      ) : null}

      {!loading ? <AuditHistoryPanel records={records} /> : null}

      {showSampleNote && isSample ? (
        <p className="text-[10px] text-body-charcoal">
          {t("sampleNote")}{" "}
          <Link href={getLoginHref(getArchiveHref())} className="underline text-premium-velvet">
            {t("signInCta")}
          </Link>
        </p>
      ) : null}

      {showViewAllLink ? (
        <div>
          <Link href={getArchiveHref()} className="text-xs font-semibold uppercase tracking-wide text-body-charcoal hover:text-premium-velvet">
            {t("viewFullArchive")} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
