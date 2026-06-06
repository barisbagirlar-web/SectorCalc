"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { FieldHint } from "@/components/ui/FieldHint";
import { StatusIconBadge } from "@/components/icons/ScIcon";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import {
  getPremiumToolHref,
  getSingleVerdictPricingHref,
} from "@/lib/tools/tool-links";
import { FreeToolEmailCaptureButton } from "@/components/tools/FreeToolEmailCaptureButton";
import { SingleVerdictUpsellButton } from "@/components/pricing/PlanCheckoutAction";
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

const FREE_UPSELL_COPY =
  "This free check shows visible risk only. Unlock the full verdict to see minimum safe price, margin leak breakdown, action recommendation and PDF-ready decision report.";

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

function validationMessage(input: RevenueToolInput, value: number | string): string {
  if (input.type === "select") {
    return `Please select ${input.label.toLowerCase()} before continuing.`;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return `${input.label} must be a valid number.`;
  }
  if (numeric <= 0) {
    return `${input.label} must be greater than 0.`;
  }
  return `${input.label} must be a valid number.`;
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
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  if (input.type === "select" && input.options) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy dark:text-off-white">
            {input.label}
            {input.required ? <span className="ml-0.5 text-soft-red">*</span> : null}
          </label>
          {input.helperText ? <FieldHint text={input.helperText} /> : null}
        </div>
        <select
          id={inputId}
          value={String(value)}
          onChange={(event) => onChange(input.key, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={`sc-input ${error ? "sc-input-error" : ""}`}
        >
          {input.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {input.helperText ? (
          <p id={helperId} className="text-xs leading-relaxed text-slate">
            {input.helperText}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-sm text-soft-red" role="alert">
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
      <div className="flex items-center gap-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy dark:text-off-white">
          {input.label}
          {input.required ? <span className="ml-0.5 text-soft-red">*</span> : null}
        </label>
        {input.helperText ? <FieldHint text={input.helperText} /> : null}
      </div>
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
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={`sc-input ${isCurrency ? "pl-8 pr-4" : "px-4"} ${showUnit ? "pr-14" : ""} ${
            error ? "sc-input-error" : ""
          }`}
        />
        {showUnit ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate">
            {input.unit}
          </span>
        ) : null}
      </div>
      {input.helperText ? (
        <p id={helperId} className="text-xs leading-relaxed text-slate">
          {input.helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-soft-red" role="alert">
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

  return (
    <article
      className={`sc-card sc-result-reveal ${styles.border} ${styles.bg}`}
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-emerald dark:text-emerald">
        Risk analysis complete.
      </p>
      <StatusIconBadge
        status={result.riskLevel === "HIGH" ? "highRisk" : result.riskLevel === "LOW" ? "safe" : "review"}
        label={
          result.riskLevel === "HIGH"
            ? "HIGH RISK"
            : result.riskLevel === "LOW"
              ? "LOW RISK"
              : "MEDIUM RISK"
        }
        className="mt-3"
      />
      <p className={`mt-2 text-2xl font-bold ${styles.text}`}>{result.riskLevel}</p>
      <h3 className="mt-4 text-lg font-semibold text-deep-navy dark:text-off-white">
        {result.headline}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate">{result.summary}</p>

      <div className="mt-6 rounded-xl border border-slate/15 bg-white p-5 dark:border-slate-600 dark:bg-slate-800">
        <p className="text-sm leading-relaxed text-slate">{FREE_UPSELL_COPY}</p>
        <div className="mt-4 flex flex-col gap-3">
          <SingleVerdictUpsellButton
            toolTitle={tool.freeTitle}
            pagePath={`/tools/free/${tool.freeSlug}`}
            className="sc-btn-primary inline-flex w-full justify-center"
          />
          <FreeToolEmailCaptureButton toolTitle={tool.freeTitle} />
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedTracked = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

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
        const value = values[input.key] ?? (input.type === "select" ? "" : 0);
        if (input.type === "select") {
          if (typeof value !== "string" || value === "") {
            nextErrors[input.key] = validationMessage(input, value);
          }
          continue;
        }
        const numeric =
          typeof value === "number" ? value : Number(value);
        if (
          typeof numeric !== "number" ||
          !Number.isFinite(numeric) ||
          numeric <= 0
        ) {
          nextErrors[input.key] = validationMessage(input, value);
        }
      }
      setErrors(nextErrors);
      setSubmitted(false);
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey && formRef.current) {
        const el = formRef.current.querySelector(`#free-tool-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setErrors({});
    setIsCalculating(true);
    setSubmitted(false);
    window.setTimeout(() => {
      setIsCalculating(false);
      setSubmitted(true);
      trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
        toolSlug: tool.freeSlug,
      });
    }, 400);
  };

  const singleVerdictHref = getSingleVerdictPricingHref(tool);
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
            <div className="min-w-0 sc-card">
              <h2 className="text-lg font-bold text-deep-navy dark:text-off-white">Quick check inputs</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {tool.freeResultPromise}
              </p>
              <p className="mt-4 rounded-lg border border-slate/10 bg-off-white px-4 py-3 text-xs leading-relaxed text-slate">
                <strong className="font-semibold text-deep-navy">Privacy:</strong>{" "}
                {FREE_TOOL_PRIVACY_NOTE}
              </p>
              <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
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
                  disabled={isCalculating}
                  className="sc-btn-primary w-full sm:w-auto disabled:opacity-60"
                >
                  {isCalculating ? "Calculating your margin risk..." : "Run quick check"}
                </button>
              </form>
            </div>

            <div className="min-w-0 space-y-4">
              {isCalculating ? (
                <div className="sc-card animate-pulse">
                  <p className="text-sm font-medium text-slate">
                    Calculating your margin risk...
                  </p>
                  <div className="mt-4 h-24 rounded-lg bg-slate/10" />
                </div>
              ) : null}
              {!isCalculating && result ? (
                <FreeToolResultCard result={result} tool={tool} />
              ) : null}
              {!isCalculating && !result ? (
                <div className="sc-card border-dashed text-sm leading-relaxed text-slate">
                  Enter inputs and run the quick check to see a directional risk
                  signal. No safe price or final verdict is shown on the free tier.
                </div>
              ) : null}

              <aside className="sc-card">
                <h3 className="text-base font-semibold text-deep-navy dark:text-off-white">
                  Need the full decision?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{FREE_UPSELL_COPY}</p>
                <div className="mt-5 flex flex-col gap-3">
                  <SingleVerdictUpsellButton
                    toolTitle={tool.freeTitle}
                    pagePath={`/tools/free/${tool.freeSlug}`}
                    className="sc-btn-primary inline-flex w-full justify-center sm:w-auto"
                  />
                  <FreeToolEmailCaptureButton toolTitle={tool.freeTitle} />
                  <Link
                    href={premiumHref}
                    className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-professional-blue hover:underline"
                  >
                    View premium analyzer →
                  </Link>
                  <Link
                    href={singleVerdictHref}
                    className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-slate hover:text-professional-blue"
                  >
                    Compare pricing plans →
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
