import { formatCurrency } from "@/lib/core/format/currency";
import type {
 PremiumScenarioRow,
 ScenarioTableLabels,
} from "@/lib/features/calculators/premium-types";

interface ScenarioAnalysisPanelProps {
 scenarios: PremiumScenarioRow[];
 labels: ScenarioTableLabels;
}

function formatSecondary(row: PremiumScenarioRow): string {
 if (row.secondaryFormat === "percent") {
 return `${row.secondaryValue.toFixed(1)}%`;
 }
 return formatCurrency(row.secondaryValue);
}

export function ScenarioAnalysisPanel({
 scenarios,
 labels,
}: ScenarioAnalysisPanelProps) {
 return (
 <section className="rounded-sm border border-border-subtle bg-white p-5 shadow-card sm:p-6">
 <h2 className="text-lg font-bold text-text-primary">Scenario calculation</h2>
 <p className="mt-1 text-sm text-text-secondary">{labels.subtitle}</p>
 <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-1">
 <table className="w-full min-w-[520px] text-left text-sm">
 <thead>
 <tr className="border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-secondary">
 <th className="pb-3 pr-4">Scenario</th>
 <th className="pb-3 pr-4">{labels.metric}</th>
 <th className="pb-3 pr-4">{labels.primary}</th>
 <th className="pb-3 pr-4">{labels.secondary}</th>
 <th className="pb-3">{labels.profit}</th>
 </tr>
 </thead>
 <tbody>
 {scenarios.map((scenario) => (
 <tr
 key={scenario.id}
 className="border-b border-border-subtle last:border-0"
 >
 <td className="py-3 pr-4 font-medium text-text-primary">
 {scenario.label}
 </td>
 <td className="py-3 pr-4 text-text-secondary">{scenario.metricDisplay}</td>
 <td className="py-3 pr-4 font-medium text-text-primary">
 {formatCurrency(scenario.primaryValue)}
 </td>
 <td className="py-3 pr-4 text-text-secondary">
 {formatSecondary(scenario)}
 </td>
 <td className="py-3 font-medium text-deep-navy">
 {formatCurrency(scenario.profitValue)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </section>
 );
}
