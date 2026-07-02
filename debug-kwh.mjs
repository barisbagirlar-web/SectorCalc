import { runPremiumSchemaEngine } from "./src/lib/features/premium-schema/premium-schema-engine.ts";
import { KWH_COST_SCHEMA } from "./src/lib/features/premium-schema/schemas/kwh-cost-analyzer.ts";

const inputs = {
  annualKwh: 120000,
  energyRate: 0.15,
  peakDemand: 500,
  demandRate: 12,
  months: 12,
  penaltyRate: 0,
  fixedCharge: 50
};

const res = runPremiumSchemaEngine(KWH_COST_SCHEMA, inputs, "en");
console.log(JSON.stringify(res.outputs.map(o => ({ id: o.id, raw: o.raw })), null, 2));
