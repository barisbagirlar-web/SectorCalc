"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GeneratedToolResult } from "@/lib/generated-tools/types";

type ScenarioState = {
  readonly name: string;
  readonly inputs: Record<string, unknown>;
  result: GeneratedToolResult | null;
};

type TornadoDatum = {
  readonly name: string;
  readonly impact: number;
};

type ComparisonDatum = {
  readonly name: string;
  readonly value: number;
};

export type ScenarioComparisonProps = {
  readonly calculateFn: (inputs: Record<string, unknown>) => GeneratedToolResult;
  readonly currentInputs: Record<string, unknown>;
  readonly inputLabels: Readonly<Record<string, string>>;
  readonly numericInputIds: readonly string[];
  readonly primaryOutputKey: string;
};

function cloneInputs(inputs: Record<string, unknown>): Record<string, unknown> {
  return { ...inputs };
}

function extractPrimaryValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  const raw = result[primaryOutputKey];
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof result.dataConfidenceAdjusted === "number" && Number.isFinite(result.dataConfidenceAdjusted)) {
    return result.dataConfidenceAdjusted;
  }
  return null;
}

function buildScenarioInputs(base: Record<string, unknown>): Record<string, unknown> {
  return cloneInputs(base);
}

function parseNumericInput(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ScenarioComparison({
  calculateFn,
  currentInputs,
  inputLabels,
  numericInputIds,
  primaryOutputKey,
}: ScenarioComparisonProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.scenarioComparison");

  const defaultScenarioNames = useMemo(
    () => [t("realistic"), t("optimistic"), t("pessimistic")],
    [t],
  );

  const [scenarios, setScenarios] = useState<ScenarioState[]>(() =>
    defaultScenarioNames.map((name) => ({
      name,
      inputs: buildScenarioInputs(currentInputs),
      result: null,
    })),
  );
  const [showTornado, setShowTornado] = useState(false);

  const formatValue = useCallback(
    (value: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(value),
    [locale],
  );

  const updateScenarioInput = (index: number, inputId: string, value: number) => {
    setScenarios((current) =>
      current.map((scenario, scenarioIndex) =>
        scenarioIndex === index
          ? { ...scenario, inputs: { ...scenario.inputs, [inputId]: value }, result: null }
          : scenario,
      ),
    );
  };

  const calculateAll = () => {
    setScenarios((current) =>
      current.map((scenario) => ({
        ...scenario,
        result: calculateFn(scenario.inputs),
      })),
    );
  };

  const tornadoData = useMemo((): TornadoDatum[] => {
    const baseResult = calculateFn(currentInputs);
    const baseValue = extractPrimaryValue(baseResult, primaryOutputKey);
    if (baseValue === null || baseValue === 0) {
      return [];
    }

    const sensitivities: TornadoDatum[] = [];
    for (const inputId of numericInputIds) {
      const value = currentInputs[inputId];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }
      const altered = { ...currentInputs, [inputId]: value * 1.2 };
      const newResult = calculateFn(altered);
      const newValue = extractPrimaryValue(newResult, primaryOutputKey);
      if (newValue === null) {
        continue;
      }
      const impact = Math.abs((newValue - baseValue) / baseValue) * 100;
      sensitivities.push({
        name: inputLabels[inputId] ?? inputId,
        impact,
      });
    }

    return sensitivities.sort((a, b) => b.impact - a.impact).slice(0, 5);
  }, [calculateFn, currentInputs, inputLabels, numericInputIds, primaryOutputKey]);

  const comparisonData = useMemo((): ComparisonDatum[] => {
    return scenarios.flatMap((scenario) => {
      if (!scenario.result) {
        return [];
      }
      const value = extractPrimaryValue(scenario.result, primaryOutputKey);
      if (value === null) {
        return [];
      }
      return [{ name: scenario.name, value }];
    });
  }, [primaryOutputKey, scenarios]);

  const allCalculated = scenarios.every((scenario) => scenario.result !== null);

  if (numericInputIds.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-xl border border-technical-gray bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-premium-velvet">{t("title")}</h3>
      <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {scenarios.map((scenario, index) => {
          const primaryValue =
            scenario.result !== null
              ? extractPrimaryValue(scenario.result, primaryOutputKey)
              : null;

          return (
            <div
              key={scenario.name}
              className="rounded-lg border border-technical-gray bg-surface-cream p-3"
            >
              <h4 className="text-sm font-semibold text-premium-velvet">{scenario.name}</h4>
              <div className="mt-3 space-y-2">
                {numericInputIds.map((inputId) => (
                  <div key={`${scenario.name}-${inputId}`}>
                    <label
                      htmlFor={`scenario-${index}-${inputId}`}
                      className="text-xs font-medium text-body-charcoal"
                    >
                      {inputLabels[inputId] ?? inputId}
                    </label>
                    <input
                      id={`scenario-${index}-${inputId}`}
                      type="number"
                      step="any"
                      value={
                        typeof scenario.inputs[inputId] === "number"
                          ? String(scenario.inputs[inputId])
                          : "0"
                      }
                      onChange={(event) =>
                        updateScenarioInput(index, inputId, parseNumericInput(event.target.value))
                      }
                      className="sc-ledger-input-boxed sc-industrial-input mt-1 w-full text-sm"
                    />
                  </div>
                ))}
              </div>

              {primaryValue !== null ? (
                <p className="sc-result-nowrap mt-3 text-center text-sm font-semibold text-premium-velvet">
                  {t("scenarioTotal", { value: formatValue(primaryValue) })}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={calculateAll}
          className="sc-ledger-cta-primary sc-cta-primary min-h-[44px]"
        >
          {t("calculateAll")}
        </button>
      </div>

      {allCalculated && comparisonData.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-premium-velvet">{t("comparisonTitle")}</h4>
          <div className="mt-3 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => formatValue(Number(value))} width={96} />
                <Tooltip formatter={(value) => formatValue(Number(value))} />
                <Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowTornado((current) => !current)}
          className="text-sm font-semibold text-premium-copper hover:underline"
        >
          {showTornado ? t("hideTornado") : t("showTornado")}
        </button>

        {showTornado && tornadoData.length > 0 ? (
          <div className="mt-3 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={tornadoData}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${Number(value).toFixed(1)}%`} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => t("tornadoImpact", { value: Number(value).toFixed(1) })} />
                <Bar dataKey="impact" fill="#b45309" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {showTornado && tornadoData.length === 0 ? (
          <p className="mt-2 text-sm text-body-charcoal">{t("tornadoUnavailable")}</p>
        ) : null}
      </div>
    </section>
  );
}
