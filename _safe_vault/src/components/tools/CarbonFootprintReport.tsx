"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { useSubscription } from "@/hooks/useSubscription";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import {
  buildCbamChartData,
  buildScopeChartData,
  calculateCarbonFootprintReport,
  mergeCarbonEmissionInputs,
  type CarbonEmissionInputs,
  type CarbonEmissionResults,
  type CarbonReportCalculationOptions,
  type CarbonReportSeedInputs,
} from "@/lib/carbon/carbon-footprint-report";
import { useEmissionFactors } from "@/lib/emission-factors/use-emission-factors";
import { fetchSupplierCarbonData, type SupplierCarbonData } from "@/lib/supplier-api";

const SCOPE_COLORS = ["#b45309", "#bd5d3a", "#1e3a5f"] as const;
const CBAM_COLORS = ["#166534", "#94a3b8"] as const;

export type CarbonFootprintReportProps = {
  readonly initialInputs?: CarbonReportSeedInputs;
  readonly calculationOptions?: CarbonReportCalculationOptions;
  readonly onSave?: (results: CarbonEmissionResults) => void;
};

type NumericFieldProps = {
  readonly label: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
};

function NumericField({ label, value, onChange }: NumericFieldProps) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-body-charcoal">{label}</span>
      <input
        type="number"
        min={0}
        step="any"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(handleNumericInputChange(event.target.value).numeric)}
        className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
      />
    </label>
  );
}

export function CarbonFootprintReport({
  initialInputs,
  calculationOptions,
  onSave,
}: CarbonFootprintReportProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.carbonFootprintReport");
  const { user } = useSubscription();
  const {
    factors,
    calculationMap,
    loading: loadingFactors,
    source: factorSource,
  } = useEmissionFactors(user?.uid);
  const [inputs, setInputs] = useState<CarbonEmissionInputs>(() =>
    mergeCarbonEmissionInputs(initialInputs),
  );
  const [results, setResults] = useState<CarbonEmissionResults | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFactors, setShowFactors] = useState(false);
  const [certificatePrice, setCertificatePrice] = useState(
    calculationOptions?.cbamCertificatePriceEurPerTon ?? 80,
  );
  const [supplierId, setSupplierId] = useState("");
  const [supplierProductCode, setSupplierProductCode] = useState("");
  const [supplierQuantity, setSupplierQuantity] = useState(1000);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierMessage, setSupplierMessage] = useState<string | null>(null);
  const [lastSupplierData, setLastSupplierData] = useState<SupplierCarbonData | null>(null);

  const scopeChartData = useMemo(
    () => (results ? buildScopeChartData(results) : []),
    [results],
  );
  const cbamChartData = useMemo(
    () => (results ? buildCbamChartData(results) : []),
    [results],
  );

  const handleChange = <K extends keyof CarbonEmissionInputs>(
    field: K,
    value: CarbonEmissionInputs[K],
  ) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  const handleCalculate = () => {
    const nextResults = calculateCarbonFootprintReport(inputs, {
      ...calculationOptions,
      cbamCertificatePriceEurPerTon: certificatePrice,
      emissionFactors: calculationMap,
    });
    setResults(nextResults);
    onSave?.(nextResults);
  };

  const handleFetchSupplierData = async () => {
    if (!supplierId.trim() || !supplierProductCode.trim()) {
      setSupplierMessage(t("supplierMissingFields"));
      return;
    }

    setSupplierLoading(true);
    setSupplierMessage(null);

    try {
      const data = await fetchSupplierCarbonData(supplierId, supplierProductCode);
      if (!data) {
        setLastSupplierData(null);
        setSupplierMessage(t("supplierFetchFailed"));
        return;
      }

      const quantity = supplierQuantity > 0 ? supplierQuantity : 0;
      const totalEmissions = data.co2ePerUnit * quantity;

      setInputs((current) => ({
        ...current,
        purchasedGoodsCo2e: (current.purchasedGoodsCo2e || 0) + totalEmissions,
      }));
      setLastSupplierData(data);
      setSupplierMessage(
        t("supplierFetchSuccess", {
          value: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(totalEmissions),
          unit: data.unit,
          source: data.source,
        }),
      );
    } finally {
      setSupplierLoading(false);
    }
  };

  const formatTonnes = (kg: number) =>
    t("tonnesValue", {
      value: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(kg / 1000),
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const scopeLabel = (key: string): string => {
    if (key === "scope1") return t("scope1");
    if (key === "scope2") return t("scope2");
    if (key === "scope3") return t("scope3");
    if (key === "cbamExposure") return t("cbamExposureLabel");
    return t("otherEmissionsLabel");
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-premium-velvet">{t("title")}</h3>
        <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-900">
          {t("scope1Heading")}
        </p>
        <NumericField
          label={t("naturalGasKWh")}
          value={inputs.naturalGasKWh}
          onChange={(value) => handleChange("naturalGasKWh", value)}
        />
        <NumericField
          label={t("dieselLitres")}
          value={inputs.dieselLitres}
          onChange={(value) => handleChange("dieselLitres", value)}
        />
        <NumericField
          label={t("gasolineLitres")}
          value={inputs.gasolineLitres}
          onChange={(value) => handleChange("gasolineLitres", value)}
        />
        <NumericField
          label={t("lpgLitres")}
          value={inputs.lpgLitres}
          onChange={(value) => handleChange("lpgLitres", value)}
        />
        <NumericField
          label={t("coalKg")}
          value={inputs.coalKg}
          onChange={(value) => handleChange("coalKg", value)}
        />

        <p className="md:col-span-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-900">
          {t("scope2Heading")}
        </p>
        <NumericField
          label={t("electricityKWh")}
          value={inputs.electricityKWh}
          onChange={(value) => handleChange("electricityKWh", value)}
        />

        <p className="md:col-span-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
          {t("scope3Heading")}
        </p>
        <NumericField
          label={t("purchasedGoodsCo2e")}
          value={inputs.purchasedGoodsCo2e}
          onChange={(value) => handleChange("purchasedGoodsCo2e", value)}
        />

        <div className="md:col-span-2 rounded-lg border border-technical-gray bg-kil-surface p-4">
          <h4 className="text-sm font-semibold text-premium-velvet">{t("supplierSectionTitle")}</h4>
          <p className="mt-1 text-xs text-body-charcoal/80">{t("supplierSectionDescription")}</p>
          <p className="mt-2 text-xs text-body-charcoal/70">{t("supplierDemoHint")}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-body-charcoal">{t("supplierIdLabel")}</span>
              <input
                type="text"
                value={supplierId}
                onChange={(event) => setSupplierId(event.target.value)}
                placeholder={t("supplierIdPlaceholder")}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-body-charcoal">{t("supplierProductCodeLabel")}</span>
              <input
                type="text"
                value={supplierProductCode}
                onChange={(event) => setSupplierProductCode(event.target.value)}
                placeholder={t("supplierProductCodePlaceholder")}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-body-charcoal">{t("supplierQuantityLabel")}</span>
              <input
                type="number"
                min={0}
                step="any"
                value={supplierQuantity}
                onChange={(event) =>
                  setSupplierQuantity(handleNumericInputChange(event.target.value).numeric || 0)
                }
                className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2 sm:max-w-xs"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => void handleFetchSupplierData()}
            disabled={supplierLoading}
            className="mt-3 min-h-[44px] rounded-lg bg-premium-velvet px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {supplierLoading ? t("supplierFetching") : t("supplierFetchButton")}
          </button>
          {supplierMessage ? (
            <p
              className={`mt-2 text-sm ${
                lastSupplierData ? "text-emerald-800" : "text-red-800"
              }`}
              role="status"
            >
              {supplierMessage}
            </p>
          ) : null}
          {lastSupplierData ? (
            <p className="mt-2 text-xs text-body-charcoal/70">
              {t("supplierLastFetch", {
                product: lastSupplierData.productId,
                factor: lastSupplierData.co2ePerUnit,
                unit: lastSupplierData.unit,
              })}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2 rounded-lg border border-technical-gray bg-surface-cream p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-premium-velvet">{t("emissionFactorsTitle")}</h4>
            <button
              type="button"
              onClick={() => setShowFactors((current) => !current)}
              className="text-xs font-semibold text-premium-copper hover:underline"
            >
              {showFactors ? t("emissionFactorsHide") : t("emissionFactorsShow")}
            </button>
          </div>
          <p className="mt-1 text-xs text-body-charcoal/80">
            {loadingFactors
              ? t("emissionFactorsLoading")
              : factorSource === "firestore"
                ? t("emissionFactorsSourceFirestore")
                : t("emissionFactorsSourceDefault")}
          </p>
          {showFactors && !loadingFactors ? (
            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {factors.map((factor) => (
                <li key={factor.category} className="text-xs text-body-charcoal/80">
                  {t("emissionFactorRow", {
                    category: factor.category,
                    factor: factor.factor,
                    unit: factor.unit,
                    source: factor.source,
                  })}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <NumericField
          label={t("freightRoadTkm")}
          value={inputs.freightRoadTkm}
          onChange={(value) => handleChange("freightRoadTkm", value)}
        />
        <NumericField
          label={t("freightSeaTkm")}
          value={inputs.freightSeaTkm}
          onChange={(value) => handleChange("freightSeaTkm", value)}
        />
        <NumericField
          label={t("freightAirTkm")}
          value={inputs.freightAirTkm}
          onChange={(value) => handleChange("freightAirTkm", value)}
        />
        <NumericField
          label={t("employeeCommuteKm")}
          value={inputs.employeeCommuteKm}
          onChange={(value) => handleChange("employeeCommuteKm", value)}
        />
        <NumericField
          label={t("businessFlightsKm")}
          value={inputs.businessFlightsKm}
          onChange={(value) => handleChange("businessFlightsKm", value)}
        />
        <NumericField
          label={t("wasteKg")}
          value={inputs.wasteKg}
          onChange={(value) => handleChange("wasteKg", value)}
        />

        <label className="block text-sm md:col-span-2">
          <span className="font-medium text-body-charcoal">{t("cbamCertificatePrice")}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={certificatePrice}
            onChange={(event) =>
              setCertificatePrice(handleNumericInputChange(event.target.value).numeric || 80)
            }
            className="mt-1 min-h-[44px] w-full rounded-lg border border-technical-gray px-3 py-2 md:max-w-xs"
          />
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

      {results ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-technical-gray bg-surface-cream p-3 text-center">
              <p className="text-sm text-body-charcoal">{t("totalEmissions")}</p>
              <p className="mt-1 text-xl font-bold text-premium-velvet">
                {formatTonnes(results.total)}
              </p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center">
              <p className="text-sm text-red-900">{t("scope1")}</p>
              <p className="mt-1 text-xl font-bold text-red-950">{formatTonnes(results.scope1)}</p>
            </div>
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-center">
              <p className="text-sm text-orange-900">{t("scope2")}</p>
              <p className="mt-1 text-xl font-bold text-orange-950">
                {formatTonnes(results.scope2)}
              </p>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
              <p className="text-sm text-blue-900">{t("scope3")}</p>
              <p className="mt-1 text-xl font-bold text-blue-950">{formatTonnes(results.scope3)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-technical-gray bg-kil-surface p-4">
              <h4 className="mb-3 text-sm font-semibold text-premium-velvet">{t("scopeChartTitle")}</h4>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[...scopeChartData]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={88}
                      label={({ name, value }) =>
                        `${scopeLabel(String(name))}: ${formatTonnes(Number(value))}`
                      }
                    >
                      {scopeChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={SCOPE_COLORS[index % SCOPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTonnes(Number(value))} />
                    <Legend formatter={(value) => scopeLabel(String(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-technical-gray bg-kil-surface p-4">
              <h4 className="mb-3 text-sm font-semibold text-premium-velvet">{t("cbamAnalysisTitle")}</h4>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-950">
                <p>
                  <span className="font-semibold">{t("cbamExposure")}:</span>{" "}
                  {formatTonnes(results.cbamExposure)}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">{t("cbamCost")}:</span>{" "}
                  {formatCurrency(results.cbamCostEur)}
                </p>
                <p className="mt-2 text-xs text-amber-900/80">{t("cbamDisclaimer")}</p>
              </div>
              <div className="mt-4 h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...cbamChartData]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)} t`} />
                    <YAxis type="category" dataKey="name" tickFormatter={(value) => scopeLabel(String(value))} width={120} />
                    <Tooltip formatter={(value) => formatTonnes(Number(value))} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {cbamChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={CBAM_COLORS[index % CBAM_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetail((current) => !current)}
            className="text-sm font-semibold text-premium-copper hover:underline"
          >
            {showDetail ? t("hideDetail") : t("showDetail")}
          </button>

          {showDetail ? (
            <pre className="max-h-60 overflow-auto rounded-lg bg-surface-cream p-3 text-xs text-body-charcoal">
              {JSON.stringify(results, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
