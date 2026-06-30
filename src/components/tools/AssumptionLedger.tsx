import { RULE_ENGINE_DB } from '@/lib/features/engine/mock-db';

export function AssumptionLedger() {
  return (
    <div className="bg-surface-50 border border-border-subtle rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Assumption Ledger</h3>
          <p className="text-sm text-text-secondary mt-1">Variables kept constant to calculate impact accurately.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-surface-100 border-b border-border-subtle text-xs uppercase text-text-primary">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-tl-lg">Assumption</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold rounded-tr-lg">Source / Standard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {RULE_ENGINE_DB.assumptions.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-100/50 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{item.name}</td>
                <td className="px-4 py-3 font-mono">{item.value}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {item.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
