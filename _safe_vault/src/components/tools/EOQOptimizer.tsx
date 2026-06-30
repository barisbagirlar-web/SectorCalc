"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import {
  buildEOQCostCurve,
  calculateEOQOptimizer,
  DEFAULT_EOQ_OPTIMIZER_INPUTS,
  type EOQOptimizerInputs,
  type EOQOptimizerOutput,
  type EOQSeedInputs,
} from "@/lib/inventory/eoq-optimizer";

export type EOQOptimizerProps = {
  readonly initialInputs?: EOQSeedInputs;
  readonly onSave?: (output: EOQOptimizerOutput) => void;
};

const SERVICE_LEVELS = [90, 95, 96, 97, 98, 99, 99.9] as const;

function mergeInitialInputs(initial?: EOQSeedInputs): EOQOptimizerInputs {
  return {
    ...DEFAULT_EOQ_OPTIMIZER_INPUTS,
    ...initial,
  };
}

export function EOQOptimizer({ initialInputs, onSave }: EOQOptimizerProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.eoqOptimizer");
  const [inputs, setInputs] = useState<EOQOptimizerInputs>(() => mergeInitialInputs(initialInputs));
  const [output, setOutput] = useState<EOQOptimizerOutput | null>(null);

  const costCurveData = useMemo(
    () => buildEOQCostCurve(inputs, output),
    [inputs, output],
  );

  const handleChange = <K extends keyof EOQOptimizerInputs>(
    field: K,
    value: EOQOptimizerInputs[K],
  ) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  const handleCalculate = () => {
    const nextOutput = calculateEOQOptimizer(inputs);
    setOutput(nextOutput);
    onSave?.(nextOutput);
  };

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-premium-velvet">{t("title")}</h3>
        <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("annualDemand")}</span>
          <input
            type="number"
            min={1}
            value={inputs.annualDemand}
            onChange={(event) => handleChange("annualDemand", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("orderingCost")}</span>
          <input
            type="number"
            min={0}
            value={inputs.orderingCost}
            onChange={(event) => handleChange("orderingCost", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("holdingCostRate")}</span>
          <input
            type="number"
            min={0}
            max={100}
            value={inputs.holdingCostRate}
            onChange={(event) => handleChange("holdingCostRate", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("unitCost")}</span>
          <input
            type="number"
            min={0}
            value={inputs.unitCost}
            onChange={(event) => handleChange("unitCost", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("leadTimeDays")}</span>
          <input
            type="number"
            min={0}
            value={inputs.leadTimeDays}
            onChange={(event) => handleChange("leadTimeDays", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("workingDaysPerYear")}</span>
          <input
            type="number"
            min={1}
            max={365}
            value={inputs.workingDaysPerYear}
            onChange={(event) => handleChange("workingDaysPerYear", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("demandStdDev")}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={inputs.demandStdDev}
            onChange={(event) => handleChange("demandStdDev", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-body-charcoal">{t("leadTimeStdDev")}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={inputs.leadTimeStdDev}
            onChange={(event) => handleChange("leadTimeStdDev", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="font-medium text-body-charcoal">{t("serviceLevel")}</span>
          <select
            value={inputs.serviceLevel}
            onChange={(event) => handleChange("serviceLevel", Number(event.target.value))}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
          >
            {SERVICE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}%
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCalculate}
          className="sc-ledger-cta-primary sc-cta-primary min-h-[44px] px-6 py-2 text-sm"
        >
          {t("calculate")}
        </button>
      </div>

      {output ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
            <p className="text-sm text-green-900">{t("eoq")}</p>
            <p className="mt-1 text-2xl font-bold text-green-950">{formatNumber(output.eoq)}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-center">
            <p className="text-sm text-amber-900">{t("reorderPoint")}</p>
            <p className="mt-1 text-2xl font-bold text-amber-950">
              {formatNumber(output.reorderPoint)}
            </p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-violet-50 p-4 text-center">
            <p className="text-sm text-violet-900">{t("safetyStock")}</p>
            <p className="mt-1 text-2xl font-bold text-violet-950">
              {formatNumber(output.safetyStock)}
            </p>
          </div>
        </div>
      ) : null}

      {output ? (
        <p className="text-sm text-body-charcoal">
          {t("totalAnnualCost")}:{" "}
          <span className="font-semibold text-premium-velvet">
            {formatCurrency(output.totalCost)}
          </span>
        </p>
      ) : null}

      {costCurveData.length > 0 && output ? (
        <div className="rounded-lg border border-technical-gray bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-premium-velvet">{t("costCurveTitle")}</h4>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...costCurveData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orderQuantity" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => t("orderQuantityLabel", { value: label })}
                />
                <Bar dataKey="totalCost" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
