"use client";

import { AlertTriangle, History, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AuditRecord } from "@/lib/os/data/audit-archive-data";
import { MANUFACTURING_OS_I18N_NS } from "@/lib/os/registry/sectors";

export interface AuditHistoryPanelProps {
  records: readonly AuditRecord[];
}

function formatAuditTimestamp(iso: string, locale: string): string {
  if (!iso) {
    return "—";
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }

  return parsed.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditHistoryPanel({ records }: AuditHistoryPanelProps) {
  const locale = useLocale();
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);

  return (
    <div className="ind-terminal ind-terminal--inverse p-8 font-mono shadow-2xl">
      <div className="mb-6 flex items-center gap-3">
        <History className="h-6 w-6 text-white" aria-hidden />
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
          {t("auditHistory.title")}
        </h2>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-white/85">{t("auditHistory.empty")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-white">
            <caption className="sr-only">{t("auditHistory.title")}</caption>
            <thead>
              <tr className="border-b border-white/20 text-[10px] uppercase text-white/75">
                <th scope="col" className="pb-4 pr-4">
                  {t("auditHistory.columns.timestamp")}
                </th>
                <th scope="col" className="pb-4 pr-4">
                  {t("auditHistory.columns.sector")}
                </th>
                <th scope="col" className="pb-4 pr-4">
                  {t("auditHistory.columns.financialImpact")}
                </th>
                <th scope="col" className="pb-4">
                  {t("auditHistory.columns.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-white/15 transition-all hover:bg-white/5"
                >
                  <td className="py-4 pr-4 font-mono text-xs text-white/75">
                    {formatAuditTimestamp(record.timestamp, locale)}
                  </td>
                  <td className="py-4 pr-4 text-xs text-white">{record.sector}</td>
                  <td className="py-4 pr-4 text-xs font-bold text-white">
                    {record.financialImpact}
                  </td>
                  <td className="py-4 text-xs text-white">
                    {record.status === "CRITICAL" ? (
                      <span className="flex items-center text-white">
                        <AlertTriangle className="mr-1 h-3 w-3 text-white" aria-hidden />
                        {t("auditHistory.statusCritical")}
                      </span>
                    ) : (
                      <span className="flex items-center text-white">
                        <ShieldCheck className="mr-1 h-3 w-3 text-white" aria-hidden />
                        {t("auditHistory.statusOptimal")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export type { AuditRecord };
