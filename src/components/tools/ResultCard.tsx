import { formatCurrency } from "@/lib/format/currency";
import type { ToolResult } from "@/data/tool-schema";

const toneClasses = {
  neutral: "border-slate/20 bg-off-white",
  success: "border-emerald/30 bg-emerald/5",
  warning: "border-amber/30 bg-amber/5",
  danger: "border-soft-red/30 bg-soft-red/5",
};

const toneValueClasses = {
  neutral: "text-deep-navy",
  success: "text-emerald",
  warning: "text-amber",
  danger: "text-soft-red",
};

interface ResultCardProps {
  result: ToolResult;
}

function formatResultValue(result: ToolResult): string {
  if (result.currency) {
    return formatCurrency(result.value, { maximumFractionDigits: 2 });
  }
  const formatted = Number.isInteger(result.value)
    ? result.value.toLocaleString("en-US")
    : result.value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return result.unit ? `${formatted} ${result.unit}` : formatted;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 ${toneClasses[result.tone]}`}
    >
      <h3 className="text-sm font-medium text-slate">{result.label}</h3>
      <p
        className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${toneValueClasses[result.tone]}`}
      >
        {formatResultValue(result)}
      </p>
      {result.description && (
        <p className="mt-2 text-xs text-slate leading-relaxed">{result.description}</p>
      )}
    </article>
  );
}
