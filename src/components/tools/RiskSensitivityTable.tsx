import type { SensitivityMatrixRow } from "@/lib/premium/parse-premium-verdict-txt";

interface RiskSensitivityTableProps {
 rows: SensitivityMatrixRow[];
 className?: string;
}

export function RiskSensitivityTable({ rows, className = "" }: RiskSensitivityTableProps) {
 if (rows.length === 0) {
 return (
 <p className="text-sm text-text-secondary">
 Sensitivity scenarios will appear after margin risk calculation completes.
 </p>
 );
 }

 return (
 <div className={`min-w-0 overflow-x-auto ${className}`}>
 <table className="w-full min-w-[520px] border-collapse text-left text-sm">
 <caption className="sr-only">Margin risk sensitivity matrix</caption>
 <thead>
 <tr className="border-b border-amber/30 bg-white/[0.06]">
 <th
 scope="col"
 className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber"
 >
 Scenario
 </th>
 <th
 scope="col"
 className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
 >
 Cost shift
 </th>
 <th
 scope="col"
 className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
 >
 Delta amount
 </th>
 <th
 scope="col"
 className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber"
 >
 P90 adjusted
 </th>
 </tr>
 </thead>
 <tbody>
 {rows.map((row) => (
 <tr
 key={row.scenario}
 className="border-b border-border-subtle/60 last:border-b-0"
 >
 <td className="px-4 py-3 font-medium text-premium-velvet">{row.scenario}</td>
 <td className="px-4 py-3 text-right font-mono text-amber">{row.deltaPercent}</td>
 <td className="px-4 py-3 text-right font-mono text-text-secondary">
 {row.deltaAmount}
 </td>
 <td className="px-4 py-3 text-right font-mono font-semibold text-premium-velvet">
 {row.p90Adjusted}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}
