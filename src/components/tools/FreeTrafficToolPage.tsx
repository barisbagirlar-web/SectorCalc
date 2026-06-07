"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";
import { getToolHref } from "@/lib/tools/paths";
import {
  calculateFreeTrafficTool,
  type FreeTrafficInputValues,
} from "@/lib/tools/free-traffic-calculators";
import {
  listRelatedTrafficTools,
  type FreeTrafficTool,
} from "@/lib/tools/free-traffic-catalog";

const INPUT_CLASS =
  "w-full min-h-[44px] rounded-none border border-[#A0A0A0] bg-white px-3 font-mono text-base tabular-nums text-[#0A0A0A] focus:border-[#0A0A0A] focus:outline-none focus:ring-0";

function buildInitialValues(tool: FreeTrafficTool): FreeTrafficInputValues {
  const values: FreeTrafficInputValues = {};
  for (const input of tool.inputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "";
      continue;
    }
    values[input.key] = input.defaultValue ?? "";
  }
  return values;
}

function verdictTone(headline: string): "neutral" | "positive" | "caution" {
  if (headline.toLowerCase().includes("break-even")) {
    return "caution";
  }
  return "positive";
}

export interface FreeTrafficToolPageProps {
  tool: FreeTrafficTool;
}

export function FreeTrafficToolPage({ tool }: FreeTrafficToolPageProps) {
  const t = useTranslations("freeTrafficCatalog");
  const [values, setValues] = useState<FreeTrafficInputValues>(() => buildInitialValues(tool));
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedTracked = useRef(false);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.tool_view, {
      toolSlug: tool.slug,
      tier: "free",
      source: "traffic_catalog",
    });
  }, [tool.slug]);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    return calculateFreeTrafficTool(tool.slug, values);
  }, [submitted, tool.slug, values]);

  const relatedTools = listRelatedTrafficTools(tool);
  const isConversion = tool.resultType === "conversion";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
        toolSlug: tool.slug,
        source: "traffic_catalog",
      });
    }
    const nextErrors: Record<string, string> = {};

    for (const input of tool.inputs) {
      const raw = values[input.key];
      if (input.type === "select") {
        if (typeof raw !== "string" || raw === "") {
          nextErrors[input.key] = t("validation.required");
        }
        continue;
      }
      const numeric = typeof raw === "number" ? raw : Number(raw);
      if (raw === "" || !Number.isFinite(numeric)) {
        nextErrors[input.key] = t("validation.number");
        continue;
      }
      if (input.min !== undefined && numeric < input.min) {
        nextErrors[input.key] = t("validation.min", { min: input.min });
      }
      if (input.max !== undefined && numeric > input.max) {
        nextErrors[input.key] = t("validation.max", { max: input.max });
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
    trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
      toolSlug: tool.slug,
      source: "traffic_catalog",
    });
  };

  const tone = result ? verdictTone(result.headline) : "neutral";

  return (
    <PageLayout>
      <section className="border-b border-[#A0A0A0]/40 bg-white py-4">
        <Container size="wide">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]">
            {t(`categories.${tool.category}`)}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
            {tool.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#2B2B2B]">{tool.description}</p>
        </Container>
      </section>

      <section className="overflow-x-hidden bg-[#FBFBFA] py-4">
        <Container size="wide" className="min-w-0">
          <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:items-start">
            <form onSubmit={handleSubmit} className="min-w-0 space-y-3" noValidate>
              {tool.inputs.map((input) => {
                const id = `ft-${tool.slug}-${input.key}`;
                const error = errors[input.key];
                const label = input.unit ? `${input.label} (${input.unit})` : input.label;

                if (input.type === "select" && input.options) {
                  return (
                    <div key={input.key} className="space-y-1">
                      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-wide text-[#2B2B2B]">
                        {label}
                      </label>
                      <select
                        id={id}
                        value={String(values[input.key] ?? "")}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, [input.key]: e.target.value }));
                          setSubmitted(false);
                        }}
                        className={INPUT_CLASS}
                      >
                        {input.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-[#2B2B2B]">{input.helper}</p>
                      {error ? <p className="text-xs text-[#DC2626]">{error}</p> : null}
                    </div>
                  );
                }

                return (
                  <div key={input.key} className="space-y-1">
                    <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-wide text-[#2B2B2B]">
                      {label}
                    </label>
                    <input
                      id={id}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={values[input.key] ?? ""}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, [input.key]: e.target.value }));
                        setSubmitted(false);
                      }}
                      className={INPUT_CLASS}
                      aria-invalid={Boolean(error)}
                    />
                    <p className="text-xs text-[#2B2B2B]">{input.helper}</p>
                    {error ? <p className="text-xs text-[#DC2626]">{error}</p> : null}
                  </div>
                );
              })}

              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center justify-center rounded-none bg-[#E65100] px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#BF360C]"
              >
                {t("tool.calculate")}
              </button>
            </form>

            <div className="min-w-0 space-y-4" aria-live="polite">
              {result ? (
                <>
                  <div className="bg-white p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#2B2B2B]">
                      {result.headline}
                    </p>
                    <p className="mt-1 text-xs text-[#2B2B2B]">{result.primaryLabel}</p>
                    <p
                      className={`font-mono text-4xl font-medium tabular-nums tracking-tight ${
                        tone === "positive"
                          ? "text-[#10B981]"
                          : tone === "caution"
                            ? "text-[#F59E0B]"
                            : "text-[#0A0A0A]"
                      }`}
                    >
                      {result.primaryValue}
                    </p>
                    {result.secondaryValues.length > 0 ? (
                      <dl
                        className={`mt-3 grid gap-2 ${
                          isConversion
                            ? "grid-cols-2 sm:grid-cols-3"
                            : "sm:grid-cols-2"
                        }`}
                      >
                        {result.secondaryValues.map((row) => (
                          <div key={row.label}>
                            <dt className="text-[10px] uppercase tracking-wide text-[#2B2B2B]">
                              {row.label}
                            </dt>
                            <dd className="font-mono text-sm tabular-nums text-[#0A0A0A]">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <p className="mt-3 text-sm leading-relaxed text-[#2B2B2B]">{result.explanation}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-white p-4">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0A0A0A]">
                        {t("tool.includesTitle")}
                      </h2>
                      <ul className="mt-2 space-y-1 text-sm text-[#2B2B2B]">
                        <li>{t("tool.includes1")}</li>
                        <li>{t("tool.includes2")}</li>
                        <li>{t("tool.includes3")}</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0A0A0A]">
                        {t("tool.excludesTitle")}
                      </h2>
                      <ul className="mt-2 space-y-1 text-sm text-[#2B2B2B]">
                        <li>{t("tool.excludes1")}</li>
                        <li>{t("tool.excludes2")}</li>
                        <li>{t("tool.excludes3")}</li>
                        <li>{t("tool.excludes4")}</li>
                      </ul>
                    </div>
                  </div>

                  {(result.relatedPremiumSlug ?? tool.relatedPremiumSlug) ? (
                    <div className="bg-white p-4">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0A0A0A]">
                        {t("tool.premiumBlockTitle")}
                      </h2>
                      <p className="mt-2 text-sm text-[#2B2B2B]">{t("tool.premiumBlockBody")}</p>
                      <Link
                        href={getToolHref("premium", result.relatedPremiumSlug ?? tool.relatedPremiumSlug ?? "")}
                        onClick={() => {
                          trackEvent(ANALYTICS_EVENTS.premium_preview_viewed, {
                            toolSlug: tool.slug,
                            premiumSlug: result.relatedPremiumSlug ?? tool.relatedPremiumSlug ?? "",
                          });
                        }}
                        className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-[#0A0A0A] underline underline-offset-2"
                      >
                        {t("tool.premiumCta")}
                      </Link>
                    </div>
                  ) : null}

                  <p className="text-xs leading-relaxed text-[#2B2B2B]">{result.legalNote}</p>
                </>
              ) : (
                <p className="text-sm text-[#2B2B2B]">{t("tool.awaiting")}</p>
              )}
            </div>
          </div>

          {relatedTools.length > 0 ? (
            <div className="mt-4 min-w-0 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0A0A0A]">
                {t("tool.relatedTitle")}
              </h2>
              <ul className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
                {relatedTools.map((related) => (
                  <li key={related.slug} className="min-w-0">
                    <Link
                      href={getToolHref("free", related.slug)}
                      className="block truncate text-sm font-medium text-[#0A0A0A] underline underline-offset-2 hover:text-[#E65100]"
                    >
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>
    </PageLayout>
  );
}
