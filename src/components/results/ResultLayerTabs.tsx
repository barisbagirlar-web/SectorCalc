"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { QuickResultPanel } from "@/components/results/QuickResultPanel";
import { DeepTracePanel } from "@/components/results/DeepTracePanel";

type TabId = "quick" | "deep" | "interpretation";

type TabButton = {
  readonly id: TabId;
  readonly labelKey: string;
};

type ResultLayerTabsProps = {
  readonly quickContent: ReactNode;
  readonly deepContent?: ReactNode;
  readonly interpretationContent?: ReactNode;
  readonly quickHeadline?: string;
  readonly quickUnitLabel?: string;
  readonly quickSummary?: string;
  readonly quickWarning?: string;
  readonly defaultLayer?: TabId;
};

const ALL_TABS: readonly TabButton[] = [
  { id: "quick", labelKey: "quickTab" },
  { id: "deep", labelKey: "deepTab" },
  { id: "interpretation", labelKey: "interpretationTab" },
];

export function ResultLayerTabs({
  quickContent,
  deepContent,
  interpretationContent,
  quickHeadline,
  quickUnitLabel,
  quickSummary,
  quickWarning,
  defaultLayer = "quick",
}: ResultLayerTabsProps) {
  const t = useTranslations("resultLayers");
  const [layer, setLayer] = useState<TabId>(defaultLayer);

  const availableTabs = ALL_TABS.filter((tab) => {
    if (tab.id === "quick") return true;
    if (tab.id === "deep") return Boolean(deepContent);
    if (tab.id === "interpretation") return interpretationContent !== undefined;
    return false;
  });

  return (
    <div className="space-y-4" data-result-layer-tabs="true">
      <div className="flex flex-wrap gap-2">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              layer === tab.id
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
            onClick={() => setLayer(tab.id)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
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
      ) : null}

      {layer === "deep" && deepContent ? (
        <DeepTracePanel title={t("deepTitle")}>{deepContent}</DeepTracePanel>
      ) : null}

      {layer === "interpretation" && interpretationContent ? (
        <DeepTracePanel title={t("interpretationTitle")}>{interpretationContent}</DeepTracePanel>
      ) : null}
    </div>
  );
}
