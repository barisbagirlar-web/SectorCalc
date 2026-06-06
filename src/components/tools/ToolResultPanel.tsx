import { ResultCard } from "@/components/tools/ResultCard";
import type { ToolResult } from "@/data/tool-schema";

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
      <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-bold text-text-primary">Results</h2>
        {hasErrors ? (
          <p className="mt-4 text-sm text-slate">
            Fix the highlighted inputs to see your estimates.
          </p>
        ) : results.length === 0 ? (
          <p className="mt-4 text-sm text-slate">Enter values to calculate results.</p>
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
      <p className="rounded-lg border border-border-subtle bg-bg-subtle px-4 py-3 text-sm leading-relaxed text-slate">
        {interpretationNote}
      </p>
    </aside>
  );
}
