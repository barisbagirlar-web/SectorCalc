"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PremiumLoginPrompt } from "@/components/billing/CustomerSignInPanel";
import { PremiumPaywall } from "@/components/billing/PremiumPaywall";
import { PremiumSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { buildVerdictReportData } from "@/lib/reports/verdict-report";
import { getPricingHref } from "@/lib/tools/tool-links";
import {
  arePremiumToolInputsValid,
  calculatePremiumToolResult,
  type PremiumSeverity,
  type PremiumToolInputValues,
  type PremiumToolResult,
} from "@/lib/tools/premium-tool-results";
import {
  PAID_TOOL_SAVE_PRIVACY_NOTE,
  revenueLegalDisclaimer,
  type RevenueTool,
  type RevenueToolInput,
} from "@/lib/tools/revenue-tools";

const DownloadVerdictPdfButton = dynamic(
  () =>
    import("@/components/reports/DownloadVerdictPdfButton").then(
      (mod) => mod.DownloadVerdictPdfButton
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex min-h-[44px] items-center text-sm text-slate">
        Preparing PDF…
      </span>
    ),
  }
);

const SaveVerdictReportButton = dynamic(
  () =>
    import("@/components/reports/SaveVerdictReportButton").then(
      (mod) => mod.SaveVerdictReportButton
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex min-h-[44px] items-center text-sm text-slate">
        Loading save…
      </span>
    ),
  }
);

const severityStyles: Record<
  PremiumSeverity,
  { border: string; bg: string; verdict: string }
> = {
  safe: {
    border: "border-emerald/35",
    bg: "bg-emerald/[0.06]",
    verdict: "text-emerald",
  },
  watch: {
    border: "border-amber/35",
    bg: "bg-amber/[0.06]",
    verdict: "text-amber",
  },
  danger: {
    border: "border-soft-red/35",
    bg: "bg-soft-red/[0.06]",
    verdict: "text-soft-red",
  },
};

function buildInitialValues(tool: RevenueTool): PremiumToolInputValues {
  const values: PremiumToolInputValues = {};
  for (const input of tool.paidInputs) {
    if (input.type === "select") {
      values[input.key] = input.options?.[0]?.value ?? "";
      continue;
    }
    if (input.defaultValue !== undefined) {
      values[input.key] = input.defaultValue;
      continue;
    }
    values[input.key] = 0;
  }
  return values;
}

interface PremiumToolInputFieldProps {
  input: RevenueToolInput;
  value: number | string;
  error?: string;
  onChange: (key: string, value: number | string) => void;
}

function PremiumToolInputField({
  input,
  value,
  error,
  onChange,
}: PremiumToolInputFieldProps) {
  const inputId = `premium-tool-${input.key}`;

  if (input.type === "select" && input.options) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy">
          {input.label}
          {input.required ? <span className="ml-0.5 text-soft-red">*</span> : null}
        </label>
        <select
          id={inputId}
          value={String(value)}
          onChange={(event) => onChange(input.key, event.target.value)}
          className={`min-h-[48px] w-full rounded-lg border bg-white px-4 text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20 ${
            error ? "border-soft-red" : "border-slate/25"
          }`}
        >
          {input.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-sm text-soft-red" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const isCurrency = input.type === "currency";
  const showUnit = Boolean(input.unit) && input.type !== "currency";

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy">
        {input.label}
        {input.required ? <span className="ml-0.5 text-soft-red">*</span> : null}
      </label>
      <div className="relative">
        {isCurrency ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate">
            $
          </span>
        ) : null}
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={0}
          step={input.type === "percent" ? 0.1 : 1}
          value={value}
          onChange={(event) => {
            const next =
              event.target.value === "" ? 0 : Number(event.target.value);
            onChange(input.key, next);
          }}
          className={`min-h-[48px] w-full rounded-lg border bg-white py-2.5 text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20 ${
            isCurrency ? "pl-8 pr-4" : "px-4"
          } ${showUnit ? "pr-14" : ""} ${error ? "border-soft-red" : "border-slate/25"}`}
        />
        {showUnit ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate">
            {input.unit}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-soft-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PremiumToolResultCard({
  result,
  legalDisclaimer,
}: {
  result: PremiumToolResult;
  legalDisclaimer: string;
}) {
  const styles = severityStyles[result.severity];

  return (
    <article
      className={`rounded-2xl border p-6 sm:p-8 ${styles.border} ${styles.bg}`}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate">
        Decision verdict
      </p>
      <p className={`mt-3 text-xl font-bold leading-snug sm:text-2xl ${styles.verdict}`}>
        {result.verdict}
      </p>
      <h3 className="mt-5 text-lg font-semibold text-deep-navy">{result.headline}</h3>
      <div className="mt-4 rounded-xl border border-slate/15 bg-white p-5">
        <p className="text-sm font-medium text-slate">{result.primaryMetricLabel}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-deep-navy">
          {result.primaryMetricValue}
        </p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">
          Key risk drivers
        </p>
        <ul className="mt-3 space-y-2">
          {result.riskDrivers.map((driver) => (
            <li key={driver} className="text-sm text-deep-navy">
              {driver}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 rounded-xl border border-slate/10 bg-white/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">
          Suggested action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-deep-navy">
          {result.suggestedAction}
        </p>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate">{legalDisclaimer}</p>
    </article>
  );
}

interface PremiumToolPageProps {
  tool: RevenueTool;
}

export function PremiumToolPage({ tool }: PremiumToolPageProps) {
  const { user, isActive, loading, error } = useUserSubscription();

  const [values, setValues] = useState<PremiumToolInputValues>(() =>
    buildInitialValues(tool)
  );
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const result = useMemo(() => {
    if (!submitted || !isActive) {
      return null;
    }
    return calculatePremiumToolResult(tool, values);
  }, [submitted, isActive, tool, values]);

  const verdictReportData = useMemo(() => {
    if (!result || !isActive) {
      return null;
    }
    return buildVerdictReportData({ tool, values, result });
  }, [result, isActive, tool, values]);

  const resultTracked = useRef(false);

  useEffect(() => {
    trackRevenueEvent(REVENUE_EVENTS.premium_analyzer_viewed, {
      toolSlug: tool.paidSlug,
    });
  }, [tool.paidSlug]);

  useEffect(() => {
    if (!loading && user && !isActive) {
      trackRevenueEvent(REVENUE_EVENTS.paywall_viewed, {
        toolSlug: tool.paidSlug,
      });
    }
  }, [loading, user, isActive, tool.paidSlug]);

  useEffect(() => {
    if (result && isActive && !resultTracked.current) {
      resultTracked.current = true;
      trackRevenueEvent(REVENUE_EVENTS.premium_result_generated, {
        toolSlug: tool.paidSlug,
        severity: result.severity,
      });
    }
    if (!result) {
      resultTracked.current = false;
    }
  }, [result, isActive, tool.paidSlug]);

  const legalDisclaimer = tool.legalDisclaimer ?? revenueLegalDisclaimer;
  const pricingHref = getPricingHref(tool);

  const handleChange = (key: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!arePremiumToolInputsValid(tool, values)) {
      const nextErrors: Record<string, string> = {};
      for (const input of tool.paidInputs) {
        if (!input.required) {
          continue;
        }
        if (input.type === "select") {
          if (typeof values[input.key] !== "string" || values[input.key] === "") {
            nextErrors[input.key] = "Required";
          }
          continue;
        }
        const numeric =
          typeof values[input.key] === "number"
            ? values[input.key]
            : Number(values[input.key]);
        if (
          typeof numeric !== "number" ||
          !Number.isFinite(numeric) ||
          numeric < 0
        ) {
          nextErrors[input.key] = "Enter a valid number";
        }
      }
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
            SectorCalc Pro analyzer
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            {tool.paidTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate">
            {tool.painStatement}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-deep-navy">
            {tool.paidValue}
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate">
            {PAID_TOOL_SAVE_PRIVACY_NOTE}
          </p>
        </Container>
      </section>

      <section className="bg-off-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          {loading ? (
            <div className="rounded-xl border border-slate/15 bg-white p-6 text-sm text-slate">
              Checking your SectorCalc Pro access…
            </div>
          ) : !user ? (
            <PremiumLoginPrompt paidSlug={tool.paidSlug} />
          ) : !isActive ? (
            <div className="mx-auto max-w-2xl">
              <Suspense fallback={null}>
                <PremiumSubscribedBanner toolSlug={tool.paidSlug} />
              </Suspense>
              <PremiumPaywall tool={tool} pricingHref={pricingHref} />
              {error ? (
                <p className="mt-4 text-sm text-soft-red" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="mt-6 text-xs leading-relaxed text-slate">{legalDisclaimer}</p>
            </div>
          ) : (
            <>
              <Suspense fallback={null}>
                <PremiumSubscribedBanner toolSlug={tool.paidSlug} />
              </Suspense>
              <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start">
                <div className="min-w-0 rounded-xl border border-slate/15 bg-white p-6 shadow-card sm:p-7">
                  <h2 className="text-lg font-bold text-deep-navy">Analyzer inputs</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {tool.paidResultPromise}
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                    {tool.paidInputs.map((input) => (
                      <PremiumToolInputField
                        key={input.key}
                        input={input}
                        value={values[input.key] ?? (input.type === "select" ? "" : 0)}
                        error={errors[input.key]}
                        onChange={handleChange}
                      />
                    ))}
                    <button
                      type="submit"
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                      Run analyzer
                    </button>
                  </form>
                </div>

                <div className="min-w-0">
                  {result && verdictReportData ? (
                    <>
                      <PremiumToolResultCard
                        result={result}
                        legalDisclaimer={legalDisclaimer}
                      />
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                        <DownloadVerdictPdfButton
                          data={verdictReportData}
                          slug={tool.paidSlug}
                          severity={result.severity}
                        />
                        {user ? (
                          <SaveVerdictReportButton
                            uid={user.uid}
                            tool={tool}
                            values={values}
                            result={result}
                          />
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate/20 bg-white p-6 text-sm leading-relaxed text-slate">
                      Enter inputs and run the analyzer to receive a pricing, margin or
                      bid verdict. No formulas are shown — only the decision output.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
