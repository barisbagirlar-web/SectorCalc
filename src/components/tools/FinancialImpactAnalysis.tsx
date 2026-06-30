import { RULE_ENGINE_DB } from '@/lib/features/engine/mock-db';

export function FinancialImpactAnalysis({ inputs }: { inputs: Record<string, any> }) {
  // Mock financial impact based on input values (for demo purposes as requested by user)
  const hourlyRate = RULE_ENGINE_DB.iso_vdi_reference.VDI_2067_hourly_rates['CNC Lathe'];
  const cycleTime = 4.2; // mock minutes
  const costPerPart = (hourlyRate / 60) * cycleTime + 2.30;
  const annualVol = 10000;
  const annualCost = costPerPart * annualVol;
  
  // Calculate mock savings based on 'vc' (cutting speed) if present
  let savings = 0;
  const vc = inputs['vc'] || inputs['cutting_speed'] || inputs['Cutting_Speed'];
  if (vc) {
    const vcNum = Number(vc);
    if (!isNaN(vcNum) && vcNum > 100) {
      savings = annualCost * 0.12; // 12% savings if vc > 100
    }
  } else {
    savings = annualCost * 0.08; // 8% generic savings
  }

  return (
    <div className="bg-surface-50 border border-border-subtle rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Financial Impact Analysis</h3>
          <p className="text-sm text-text-secondary mt-1">Cost implications based on VDI 2067 standard rates.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-100 rounded-lg">
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">Hourly Rate</p>
          <p className="text-xl font-bold">€{hourlyRate}<span className="text-sm font-normal text-text-muted">/hr</span></p>
        </div>
        <div className="p-4 bg-surface-100 rounded-lg">
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">Cost / Part</p>
          <p className="text-xl font-bold">€{costPerPart.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-surface-100 rounded-lg">
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">Annual Cost</p>
          <p className="text-xl font-bold">€{Math.round(annualCost).toLocaleString()}</p>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wide font-medium mb-1">Potential Savings</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">€{Math.round(savings).toLocaleString()}<span className="text-sm font-normal">/yr</span></p>
        </div>
      </div>
    </div>
  );
}
