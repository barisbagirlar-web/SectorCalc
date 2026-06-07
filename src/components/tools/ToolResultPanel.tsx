import { ResultCard } from "@/components/tools/ResultCard";
import type { ToolResult } from "@/data/tool-schema";
import { MARGINCORE_TERMS } from "@/lib/terminology/margincore-identity";

interface ToolResultPanelProps {
 results: ToolResult[];
 interpretationNote: string;
 hasErrors: boolean;
 /** Denser grid for premium tools with more result cards */
 dense?: boolean;
}

export function ToolResultPanel({
 results,
 interpretationNote,
 hasErrors,
 dense = false,
}: ToolResultPanelProps) {
 return (
 <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
 <div className="rounded-sm border border-border-subtle bg-white p-5 shadow-card sm:p-6">
 <h2 className="text-lg font-bold text-text-primary">{MARGINCORE_TERMS.decisionVerdict}</h2>
 {hasErrors ? (
 <p className="mt-4 text-sm text-text-secondary">
 Fix highlighted risk variables to run the analysis.
 </p>
 ) : results.length === 0 ? (
 <p className="mt-4 text-sm text-text-secondary">
 Enter risk variables to surface margin leak signals.
 </p>
 ) : (
 <div
 className={
 dense
 ? "mt-4 grid gap-4 sm:grid-cols-2"
 : "mt-4 space-y-4"
 }
 >
 {results.map((result) => (
 <ResultCard key={result.id} result={result} />
 ))}
 </div>
 )}
 </div>
 <p className="rounded-lg border border-border-subtle bg-bg-subtle px-4 py-3 text-sm leading-relaxed text-text-secondary">
 {interpretationNote}
 </p>
 </aside>
 );
}
