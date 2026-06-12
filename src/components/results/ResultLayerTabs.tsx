"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { QuickResultPanel } from "@/components/results/QuickResultPanel";
import { DeepTracePanel } from "@/components/results/DeepTracePanel";

type ResultLayerTabsProps = {
  readonly quickContent: ReactNode;
  readonly deepContent?: ReactNode;
  readonly quickHeadline?: string;
  readonly quickUnitLabel?: string;
  readonly quickSummary?: string;
  readonly quickWarning?: string;
  readonly defaultLayer?: "quick" | "deep";
};

export function ResultLayerTabs({
  quickContent,
  deepContent,
  quickHeadline,
  quickUnitLabel,
  quickSummary,
  quickWarning,
  defaultLayer = "quick",
}: ResultLayerTabsProps) {
  const t = useTranslations("resultLayers");
  const [layer, setLayer] = useState<"quick" | "deep">(defaultLayer);

  return (
    <div className="space-y-4" data-result-layer-tabs="true">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            layer === "quick"
              ? "bg-slate-900 text-white"
              : "border border-slate-300 bg-white text-slate-700"
          }`}
          onClick={() => setLayer("quick")}
        >
          {t("quickTab")}
        </button>
        {deepContent ? (
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              layer === "deep"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
            onClick={() => setLayer("deep")}
          >
            {t("deepTab")}
          </button>
        ) : null}
      </div>

      {layer === "quick" ? (
        <QuickResultPanel
          headline={quickHeadline}
          unitLabel={quickUnitLabel}
          summary={quickSummary}
          warning={quickWarning}
        >
          {quickContent}
        </QuickResultPanel>
      ) : (
        <DeepTracePanel title={t("deepTitle")}>{deepContent}</DeepTracePanel>
      )}
    </div>
  );
}
