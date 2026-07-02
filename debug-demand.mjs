import { evaluateExpr } from "./src/lib/features/tool-schemas/runtime.ts";
import { num } from "./src/lib/features/tool-schemas/runtime.ts";
console.log(num({ peakDemandKW: 500, demandRatePerKW: 12, months: 12 }, "peakDemandKW"));
console.log(num({ peakDemandKW: 500, demandRatePerKW: 12, months: 12 }, "demandRatePerKW"));
console.log(num({ peakDemandKW: 500, demandRatePerKW: 12, months: 12 }, "months"));
