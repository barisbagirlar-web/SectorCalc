import type { RevenueTool, RevenueToolInput } from "@/lib/tools/revenue-tools";
import type {
  PremiumToolInputValues,
  PremiumToolResult,
} from "@/lib/tools/premium-tool-results";

export type VerdictReportInput = {
  label: string;
  value: string;
};

export type VerdictReportData = {
  toolTitle: string;
  sector: string;
  generatedAt: string;
  verdict: string;
  headline: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  riskDrivers: string[];
  suggestedAction: string;
  inputs: VerdictReportInput[];
  legalDisclaimer: string;
};

export const VERDICT_REPORT_LEGAL_DISCLAIMER =
  "This report is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Results depend on user-provided inputs. Verify all outputs before making business decisions. Digital product. No refunds.";

const SECTOR_LABELS: Record<RevenueTool["sector"], string> = {
  "cnc-manufacturing": "CNC Manufacturing",
  construction: "Construction",
  cleaning: "Cleaning",
  restaurant: "Restaurant",
  ecommerce: "E-commerce",
};

function formatInputValue(
  input: RevenueToolInput,
  value: number | string | undefined
): string {
  if (input.type === "select" && input.options) {
    const raw = typeof value === "string" ? value : String(value ?? "");
    const match = input.options.find((option) => option.value === raw);
    if (match) {
      return match.label;
    }
    return raw.trim().length > 0 ? raw.trim() : "-";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (input.type === "currency") {
      return `$${value.toFixed(2)}`;
    }
    if (input.type === "percent") {
      return `${value.toFixed(1)}%`;
    }
    if (input.unit) {
      return `${value} ${input.unit}`;
    }
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "-";
}

export function formatVerdictReportDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildVerdictReportFileName(paidSlug: string, generatedAt: string): string {
  const date = generatedAt.slice(0, 10);
  return `sectorcalc-${paidSlug}-verdict-${date}.pdf`;
}

export function buildVerdictReportData({
  tool,
  values,
  result,
}: {
  tool: RevenueTool;
  values: PremiumToolInputValues;
  result: PremiumToolResult;
}): VerdictReportData {
  return {
    toolTitle: tool.paidTitle,
    sector: SECTOR_LABELS[tool.sector],
    generatedAt: new Date().toISOString(),
    verdict: result.verdict,
    headline: result.headline,
    primaryMetricLabel: result.primaryMetricLabel,
    primaryMetricValue: result.primaryMetricValue,
    riskDrivers: result.riskDrivers,
    suggestedAction: result.suggestedAction,
    inputs: tool.paidInputs.map((input) => ({
      label: input.label,
      value: formatInputValue(input, values[input.key]),
    })),
    legalDisclaimer: VERDICT_REPORT_LEGAL_DISCLAIMER,
  };
}
