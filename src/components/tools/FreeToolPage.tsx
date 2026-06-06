"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import {
  getPremiumToolHref,
  getPricingHref,
} from "@/lib/tools/tool-links";
import {
  areFreeToolInputsValid,
  calculateFreeToolResult,
  type FreeRiskLevel,
  type FreeToolInputValues,
  type FreeToolResult,
} from "@/lib/tools/free-tool-results";
import {
  FREE_TOOL_PRIVACY_NOTE,
  revenueLegalDisclaimer,
  type RevenueTool,
  type RevenueToolInput,
} from "@/lib/tools/revenue-tools";

const QUICK_CHECK_NOTE =
  "This is only a quick check — not a safe price, minimum bid, or final paid verdict.";

const riskStyles: Record<
  FreeRiskLevel,
  { border: string; bg: string; text: string }
> = {
  LOW: {
    border: "border-emerald/30",
    bg: "bg-emerald/5",
    text: "text-emerald",
  },
  MEDIUM: {
    border: "border-amber/30",
    bg: "bg-amber/5",
    text: "text-amber",
  },
  HIGH: {
    border: "border-soft-red/30",
    bg: "bg-soft-red/5",
    text: "text-soft-red",
  },
};

function buildInitialValues(tool: RevenueTool): FreeToolInputValues {
  const values: FreeToolInputValues = {};
  for (const input of tool.freeInputs) {
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

interface FreeToolInputFieldProps {
  input: RevenueToolInput;
  value: number | string;
  error?: string;
  onChange: (key: string, value: number | string) => void;
}

function FreeToolInputField({
  input,
  value,
  error,
  onChange,
}: FreeToolInputFieldProps) {
  const inputId = `free-tool-${input.key}`;

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
        {input.helperText ? (
          <p className="text-xs leading-relaxed text-slate">{input.helperText}</p>
        ) : null}
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
      {input.helperText ? (
        <p className="text-xs leading-relaxed text-slate">{input.helperText}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-soft-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FreeToolResultCard({
  result,
  tool,
}: {
  result: FreeToolResult;
  tool: RevenueTool;
}) {
  const styles = riskStyles[result.riskLevel];
  const premiumHref = getPremiumToolHref(tool);
  const pricingHref = getPricingHref(tool);

  return (
    <article
      className={`rounded-xl border p-6 ${styles.border} ${styles.bg}`}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate">
        Risk signal
      </p>
      <p className={`mt-2 text-2xl font-bold ${styles.text}`}>{result.riskLevel}</p>
      <h3 className="mt-4 text-lg font-semibold text-deep-navy">{result.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate">{result.summary}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate">{QUICK_CHECK_NOTE}</p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">
          Not included in free check
        </p>
        <ul className="mt-3 space-y-2">
          {result.missingFactors.map((factor) => (
            <li key={factor} className="flex gap-2 text-sm text-deep-navy">
              <span className="text-amber" aria-hidden>
                ○
              </span>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-slate/15 bg-white p-5">
        <h4 className="text-base font-semibold text-deep-navy">
          Your quick check shows visible risk.
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          The free calculator gives a quick estimate. The premium analyzer shows the
          safe price, risk drivers and suggested action.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={pricingHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Unlock the Full Analyzer
          </Link>
          <Link
            href={premiumHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
          >
            View premium analyzer
          </Link>
        </div>
      </div>
    </article>
  );
}

interface FreeToolPageProps {
  tool: RevenueTool;
}

export function FreeToolPage({ tool }: FreeToolPageProps) {
  const [values, setValues] = useState<FreeToolInputValues>(() =>
    buildInitialValues(tool)
  );
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedTracked = useRef(false);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    return calculateFreeToolResult(tool, values);
  }, [submitted, tool, values]);

  const handleChange = (key: string, value: number | string) => {
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
        toolSlug: tool.freeSlug,
      });
    }
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
    if (!areFreeToolInputsValid(tool, values)) {
      const nextErrors: Record<string, string> = {};
      for (const input of tool.freeInputs) {
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
    trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
      toolSlug: tool.freeSlug,
    });
  };

  const pricingHref = getPricingHref(tool);
  const premiumHref = getPremiumToolHref(tool);

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
            Free calculator
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            {tool.freeTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate">
            {tool.painStatement}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-deep-navy">
            {tool.freeValue}
          </p>
        </Container>
      </section>

      <section className="bg-off-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:items-start">
            <div className="min-w-0 rounded-xl border border-slate/15 bg-white p-6 shadow-card sm:p-7">
              <h2 className="text-lg font-bold text-deep-navy">Quick check inputs</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {tool.freeResultPromise}
              </p>
              <p className="mt-4 rounded-lg border border-slate/10 bg-off-white px-4 py-3 text-xs leading-relaxed text-slate">
                <strong className="font-semibold text-deep-navy">Privacy:</strong>{" "}
                {FREE_TOOL_PRIVACY_NOTE}
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                {tool.freeInputs.map((input) => (
                  <FreeToolInputField
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
                  Run quick check
                </button>
              </form>
            </div>

            <div className="min-w-0 space-y-4">
              {result ? (
                <FreeToolResultCard result={result} tool={tool} />
              ) : (
                <div className="rounded-xl border border-dashed border-slate/20 bg-white p-6 text-sm leading-relaxed text-slate">
                  Enter inputs and run the quick check to see a directional risk
                  signal. No safe price or final verdict is shown on the free tier.
                </div>
              )}

              <aside className="rounded-xl border border-slate/15 bg-white p-6">
                <h3 className="text-base font-semibold text-deep-navy">
                  Need the full decision?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{tool.paidValue}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={pricingHref}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Unlock the Full Analyzer
                  </Link>
                  <Link
                    href={premiumHref}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
                  >
                    View premium analyzer
                  </Link>
                </div>
              </aside>

              <p className="rounded-lg border border-slate/15 bg-white px-4 py-3 text-xs leading-relaxed text-slate">
                {tool.legalDisclaimer ?? revenueLegalDisclaimer}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
