import { runPremiumSchemaEngine } from "../src/lib/features/premium-schema/premium-schema-engine";
import { CNC_MACHINING_COST_SCHEMA } from "../src/lib/features/premium-schema/schemas/cnc-machining-cost-analyzer";
import { DOWNTIME_COST_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/downtime-cost-analyzer";
import { BOLT_TORQUE_SCHEMA } from "../src/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";
import { WELD_VOLUME_COST_SCHEMA } from "../src/lib/features/premium-schema/schemas/weld-volume-cost-analyzer";
import { OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA } from "../src/lib/features/premium-schema/schemas/oee-equipment-effectiveness-calculator";

function runSample(schema, inputs) {
  try {
    const res = runPremiumSchemaEngine(schema, inputs, "en");
    console.log(`\n=== ${schema.id} ===`);
    console.log("INPUTS:", JSON.stringify(inputs));
    console.log("OUTPUTS:");
    for (const out of res.outputs) {
      console.log(`  ${out.id} = ${out.raw}`);
    }
  } catch (e) {
    console.error(`Failed ${schema.id}:`, e);
  }
}

runSample(CNC_MACHINING_COST_SCHEMA, {
  rawVolume: 500, density: 7.85, pricePerKg: 2, scrapRate: 10,
  machineRate: 50, totalTime: 30, cutTime: 20, toolLife: 60,
  toolCost: 100, elecRate: 0.15, machinePower: 15,
  setupTime: 60, setupRate: 40, batchSize: 100
});

runSample(DOWNTIME_COST_ANALYZER_SCHEMA, {
  downtimeHours: 2, lostUnitsPerHour: 500, unitProfit: 10,
  directLaborRate: 25, laborCount: 5, overheadRate: 100,
  repairCost: 500, scrapCost: 200, penaltyCost: 0
});

runSample(BOLT_TORQUE_SCHEMA, {
  boltDiameter: 12, yieldStrength: 800, proofLoadFactor: 75, torqueCoefficient: 0.20
});

runSample(WELD_VOLUME_COST_SCHEMA, {
  jointType: "fillet", legSize: 5, weldLength: 10, density: 7.85,
  depositionRate: 2, laborRate: 30, electrodeCost: 5,
  gasCostPerHour: 2, operatingFactor: 30
});

runSample(OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA, {
  plannedProductionTime: 480, totalDowntime: 60, idealCycleTime: 1,
  totalPartsProduced: 400, goodPartsCount: 380,
  annualShiftCount: 250, machineHourlyCost: 50
});
