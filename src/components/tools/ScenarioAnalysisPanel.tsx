import { formatCurrency } from "@/lib/format/currency";
import type {
  PremiumScenarioRow,
  ScenarioTableLabels,
} from "@/lib/calculators/premium-types";

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
    <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-bold text-deep-navy">Scenario analysis</h2>
      <p className="mt-1 text-sm text-slate">{labels.subtitle}</p>
      <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-1">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate/20 text-xs font-semibold uppercase tracking-wider text-slate">
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
                className="border-b border-slate/10 last:border-0"
              >
                <td className="py-3 pr-4 font-medium text-deep-navy">
                  {scenario.label}
                </td>
                <td className="py-3 pr-4 text-slate">{scenario.metricDisplay}</td>
                <td className="py-3 pr-4 font-medium text-deep-navy">
                  {formatCurrency(scenario.primaryValue)}
                </td>
                <td className="py-3 pr-4 text-slate">
                  {formatSecondary(scenario)}
                </td>
                <td className="py-3 font-medium text-emerald">
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
