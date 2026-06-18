"use client";

import { useLocale, useTranslations } from "next-intl";
import type { BreakdownChartItem } from "@/lib/chart-helpers/breakdown-chart-data";
import type { RelatedBreakdownInput } from "@/lib/chart-helpers/resolve-waste-related-inputs";

type BreakdownWasteDetailModalProps = {
  readonly item: BreakdownChartItem;
  readonly relatedInputs: readonly RelatedBreakdownInput[];
  readonly onClose: () => void;
};

function formatInputValue(value: unknown, locale: string): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

export function BreakdownWasteDetailModal({
  item,
  relatedInputs,
  onClose,
}: BreakdownWasteDetailModalProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.breakdownChart");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breakdown-waste-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="breakdown-waste-detail-title" className="text-base font-semibold text-premium-velvet">
              {item.name}
            </h2>
            <p className="sc-result-nowrap mt-1 text-sm text-body-charcoal">
              {item.displayValue} ({item.percent}%)
            </p>
          </div>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] text-sm text-body-charcoal"
            onClick={onClose}
          >
            {t("close")}
          </button>
        </div>

        <p className="mt-4 text-sm text-body-charcoal">{t("detailIntro")}</p>

        {relatedInputs.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {relatedInputs.map((input) => (
              <li
                key={input.id}
                className="rounded-lg border border-technical-gray bg-surface-cream px-3 py-2 text-sm"
              >
                <p className="font-medium text-body-charcoal">{input.label}</p>
                <p className="sc-result-nowrap mt-0.5 font-mono text-xs text-body-charcoal/80">
                  {formatInputValue(input.value, locale)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-body-charcoal/80">{t("noRelatedInputs")}</p>
        )}
      </div>
    </div>
  );
}
