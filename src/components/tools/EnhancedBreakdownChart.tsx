"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { normalizeWasteTypeKey } from "@/lib/ui-shared/chart-helpers";
import {
  buildBreakdownChartGroups,
  type BreakdownChartItem,
} from "@/lib/ui-shared/chart-helpers/breakdown-chart-data";
import type { BreakdownChartDimension } from "@/lib/ui-shared/chart-helpers/breakdown-chart-dimensions";
import { resolveBreakdownTimeUnitSuffix } from "@/lib/ui-shared/chart-helpers/breakdown-chart-dimensions";
import { resolveGeneratedBreakdownLabel } from "@/lib/features/generated-tools/resolve-generated-display-text";
import type { GeneratedToolBreakdown } from "@/lib/features/generated-tools/types";
import { BreakdownChartGroupPanel } from "@/components/tools/BreakdownChartGroupPanel";

type ChartType = "bar" | "pie";

export type EnhancedBreakdownChartProps = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly labelMap?: Readonly<Record<string, string>>;
  readonly unitHints?: Readonly<Record<string, string>>;
  readonly locale?: string;
  readonly currency?: string;
  readonly isPro?: boolean;
  readonly onItemClick?: (item: BreakdownChartItem) => void;
  readonly onActionClick?: (action: string, item: BreakdownChartItem) => void;
};

function resolveWasteDescriptionKey(key: string): string {
  return normalizeWasteTypeKey(key);
}

export function EnhancedBreakdownChart({
  breakdown,
  labelMap,
  unitHints,
  locale: localeProp,
  currency = "USD",
  isPro = false,
  onItemClick,
  onActionClick,
}: EnhancedBreakdownChartProps) {
  const hookLocale = useLocale();
  const locale = localeProp ?? hookLocale;
  const t = useTranslations("generatedTool");
  const tChart = useTranslations("generatedTool.breakdownChart");
  const wasteT = useTranslations("wasteTypes");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const resolveBreakdownLabel = useMemo(() => {
    return (key: string): string => {
      const wasteKey = normalizeWasteTypeKey(key);
      if (wasteT.has(wasteKey)) {
        return wasteT(wasteKey);
      }
      return resolveGeneratedBreakdownLabel(key, labelMap, locale);
    };
  }, [labelMap, locale, wasteT]);

  const chartGroups = useMemo(
    () =>
      buildBreakdownChartGroups(breakdown, locale, currency, resolveBreakdownLabel, unitHints),
    [breakdown, currency, locale, resolveBreakdownLabel, unitHints],
  );

  const resolveGroupTitle = (dimension: BreakdownChartDimension): string =>
    tChart(`unitGroups.${dimension}`);

  const resolveAxisSuffix = (dimension: BreakdownChartDimension, items: readonly BreakdownChartItem[]) => {
    if (dimension !== "time") {
      return undefined;
    }
    const firstUnit = items.find((item) => item.unitHint)?.unitHint;
    const suffixKey = resolveBreakdownTimeUnitSuffix(firstUnit);
    return tChart(`unitGroups.timeUnit.${suffixKey}`);
  };

  const resolveDescription = (item: BreakdownChartItem): string => {
    const wasteKey = resolveWasteDescriptionKey(item.key);
    if (tChart.has(`descriptions.${wasteKey}`)) {
      return tChart(`descriptions.${wasteKey}`);
    }
    return tChart("descriptions.default");
  };

  const resolveAction = (item: BreakdownChartItem): string => {
    const wasteKey = resolveWasteDescriptionKey(item.key);
    if (tChart.has(`actions.${wasteKey}`)) {
      return tChart(`actions.${wasteKey}`);
    }
    return tChart("actions.default");
  };

  const handleActionRequest = (item: BreakdownChartItem) => {
    const action = resolveAction(item);
    if (isPro) {
      onActionClick?.(action, item);
      setPendingAction(action);
      return;
    }
    setPendingAction(action);
  };

  type BreakdownTooltipProps = {
    readonly active?: boolean;
    readonly payload?: ReadonlyArray<{ payload?: BreakdownChartItem }>;
  };

  const renderTooltip = ({ active, payload }: BreakdownTooltipProps) => {
    const item = payload?.[0]?.payload;
    if (!active || !item) {
      return null;
    }

    return (
      <div className="max-w-xs rounded-lg border border-technical-gray bg-kil-surface p-3 shadow-lg">
        <p className="font-semibold text-premium-velvet">{item.name}</p>
        <p className="sc-result-nowrap text-sm text-body-charcoal">
          {item.displayValue} ({item.percent}%)
        </p>
        <p className="mt-1 text-xs text-body-charcoal/80">{resolveDescription(item)}</p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleActionRequest(item);
          }}
          className="mt-2 min-h-[36px] rounded-md bg-premium-velvet px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          {isPro ? tChart("suggestedAction") : tChart("suggestedActionLocked")}
        </button>
      </div>
    );
  };

  const handleBarClick = (item: BreakdownChartItem) => {
    onItemClick?.(item);
  };

  if (chartGroups.length === 0) {
    return (
      <div className="rounded-xl border border-technical-gray bg-kil-surface p-4 text-sm text-body-charcoal/70">
        {tChart("noChartData")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-technical-gray bg-kil-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-premium-velvet">{t("breakdownTitle")}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              aria-pressed={chartType === "bar"}
              className={`min-h-[36px] rounded-md px-3 py-1 text-sm font-medium ${
                chartType === "bar"
                  ? "bg-premium-velvet text-white"
                  : "bg-surface-cream text-body-charcoal"
              }`}
            >
              {tChart("chartTypeBar")}
            </button>
            <button
              type="button"
              onClick={() => setChartType("pie")}
              aria-pressed={chartType === "pie"}
              className={`min-h-[36px] rounded-md px-3 py-1 text-sm font-medium ${
                chartType === "pie"
                  ? "bg-premium-velvet text-white"
                  : "bg-surface-cream text-body-charcoal"
              }`}
            >
              {tChart("chartTypePie")}
            </button>
          </div>
        </div>

        {chartGroups.length > 1 ? (
          <p className="mb-4 text-xs text-body-charcoal/80">{tChart("unitGroups.splitNote")}</p>
        ) : null}

        <div className="space-y-4">
          {chartGroups.map((group) => (
            <BreakdownChartGroupPanel
              key={group.dimension}
              group={group}
              chartType={chartType}
              locale={locale}
              currency={currency}
              groupTitle={resolveGroupTitle(group.dimension)}
              axisSuffix={resolveAxisSuffix(group.dimension, group.items)}
              renderTooltip={renderTooltip}
              onItemClick={handleBarClick}
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-body-charcoal">{tChart("clickHint")}</p>
        <p className="mt-1 text-xs text-body-charcoal/70">{t("breakdownFootnote")}</p>
      </div>

      {pendingAction ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="breakdown-action-title"
          onClick={() => setPendingAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-kil-surface p-4 shadow-xl sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="breakdown-action-title" className="text-base font-semibold text-premium-velvet">
                {tChart("actionModalTitle")}
              </h2>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] text-sm text-body-charcoal"
                onClick={() => setPendingAction(null)}
              >
                {tChart("close")}
              </button>
            </div>
            <p className="mt-3 text-sm text-body-charcoal">{pendingAction}</p>
            {!isPro ? (
              <p className="mt-3 text-sm text-body-charcoal">
                {tChart("actionProHint")}{" "}
                <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
                  {tChart("actionProCta")}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
