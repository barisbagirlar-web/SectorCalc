"use client";

import { useTranslations } from "next-intl";
import type { SensitivityMatrixRow } from "@/lib/features/premium/parse-premium-verdict-txt";

interface RiskSensitivityTableProps {
  rows: SensitivityMatrixRow[];
  className?: string;
}

export function RiskSensitivityTable({ rows, className = "" }: RiskSensitivityTableProps) {
  const t = useTranslations("riskSensitivityTable");

  if (rows.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        {t("emptyMessage")}
      </p>
    );
  }

  return (
    <div className={`min-w-0 overflow-x-auto ${className}`}>
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <caption className="sr-only">{t("srCaption")}</caption>
        <thead>
          <tr className="border-b border-amber/30 bg-white/[0.06]">
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber"
            >
              {t("scenario")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
            >
              {t("costShift")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
            >
              {t("deltaAmount")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
            >
              {t("p90Adjusted")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.scenario}
              className="border-b border-border-subtle/60 last:border-b-0"
            >
              <td className="px-4 py-3 font-medium text-premium-velvet">{row.scenario}</td>
              <td className="px-4 py-3 text-right font-mono text-amber">{row.deltaPercent}</td>
              <td className="px-4 py-3 text-right font-mono text-text-secondary">
                {row.deltaAmount}
              </td>
              <td className="sc-result-nowrap px-4 py-3 text-right font-mono font-semibold text-premium-velvet">
                {row.p90Adjusted}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
