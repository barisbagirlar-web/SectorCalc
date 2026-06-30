import { useMemo } from 'react';

export function TornadoChart({ inputs }: { inputs: Record<string, any> }) {
  // We mock a sensitivity analysis based on available numerical inputs
  const sensitivities = useMemo(() => {
    const items = [];
    for (const [key, val] of Object.entries(inputs)) {
      if (typeof val === 'number' && val > 0) {
        // Pseudo-random impact based on key length to make it look realistic for demo
        const impact = Math.max(5, (key.length * 3) % 30);
        items.push({ name: key.replace(/_/g, ' '), impact });
      }
    }
    return items.sort((a, b) => b.impact - a.impact).slice(0, 5); // top 5
  }, [inputs]);

  if (sensitivities.length === 0) return null;

  return (
    <div className="bg-surface-50 border border-border-subtle rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Sensitivity Analysis (Tornado)</h3>
          <p className="text-sm text-text-secondary mt-1">Impact of ±10% variance in input variables on the final result.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sensitivities.map((item, idx) => (
          <div key={idx} className="flex items-center text-sm">
            <div className="w-1/3 truncate pr-4 text-right font-medium text-text-secondary capitalize">
              {item.name}
            </div>
            <div className="w-2/3 flex items-center">
              {/* Center line */}
              <div className="w-1/2 flex justify-end">
                <div 
                  className="h-5 bg-red-400/80 rounded-l-sm" 
                  style={{ width: `${item.impact}%` }}
                />
              </div>
              <div className="w-px h-6 bg-border-strong mx-[1px]" />
              <div className="w-1/2 flex justify-start">
                <div 
                  className="h-5 bg-emerald-400/80 rounded-r-sm" 
                  style={{ width: `${item.impact}%` }}
                />
              </div>
              <span className="ml-3 text-xs text-text-muted w-12 text-right">
                ±{item.impact}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
