"use client";

/**
 * Field Web Vitals reporter (LCP, CLS, INP).
 * Sends metrics to GA4 via gtag/dataLayer when present; always mirrors to
 * `window.__SC_WEB_VITALS__` for local verification.
 */

import { useReportWebVitals } from "next/web-vitals";

type VitalName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    __SC_WEB_VITALS__?: Array<Record<string, unknown>>;
  }
}

function reportToAnalytics(metric: {
  id: string;
  name: string;
  value: number;
  label?: string;
  rating?: string;
  navigationType?: string;
}): void {
  const payload = {
    event: "web_vital",
    event_category: "Web Vitals",
    event_label: metric.id,
    metric_name: metric.name,
    metric_value: metric.name === "CLS" ? metric.value : Math.round(metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating ?? "",
    non_interaction: true,
  };

  if (typeof window === "undefined") return;

  window.__SC_WEB_VITALS__ = window.__SC_WEB_VITALS__ ?? [];
  window.__SC_WEB_VITALS__.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", metric.name, {
      value: payload.metric_value,
      metric_id: metric.id,
      metric_rating: metric.rating,
      event_category: "Web Vitals",
      non_interaction: true,
    });
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function WebVitalsReporter(): null {
  useReportWebVitals((metric) => {
    const name = metric.name as VitalName;
    if (name !== "LCP" && name !== "CLS" && name !== "INP" && name !== "TTFB" && name !== "FCP") {
      return;
    }
    reportToAnalytics({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      label: metric.label,
      rating: metric.rating,
      navigationType: metric.navigationType,
    });
  });

  return null;
}
