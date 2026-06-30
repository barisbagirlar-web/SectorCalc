import { formatCurrency } from "@/lib/core/format/currency";
import { remapUserFacingLabel } from "@/lib/content/terminology/margincore-identity";
import type { ToolResult } from "@/data/tool-schema";

const toneClasses = {
 neutral: "border-border-subtle bg-bg-subtle",
 success: "border-deep-navy/20 bg-bg-subtle",
 warning: "border-amber/30 bg-amber/5",
 danger: "border-amber/30 bg-amber/[0.06]",
};

const toneValueClasses = {
 neutral: "text-text-primary",
 success: "text-deep-navy",
 warning: "text-amber",
 danger: "text-amber",
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
 className={`rounded-sm border p-5 ${toneClasses[result.tone]}`}
 >
 <h3 className="text-sm font-medium text-text-secondary">
 {remapUserFacingLabel(result.label)}
 </h3>
 <p
 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${toneValueClasses[result.tone]}`}
 >
 {formatResultValue(result)}
 </p>
 {result.description && (
 <p className="mt-2 text-xs text-text-secondary leading-relaxed">{result.description}</p>
 )}
 </article>
 );
}
