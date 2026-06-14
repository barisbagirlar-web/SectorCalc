/**
 * P7 domain-specific DeepSeek prompt packs — keep in sync with
 * src/lib/ai/deepseek/p7-domain-prompt-packs.ts
 */
import {
  matchDomainPrompt,
  toDomainMatchInput,
} from "./p7-domain-prompt-dispatcher.mjs";

export const DOMAIN_PROMPT_IDS = [
  "MANUFACTURING_AND_MACHINING",
  "LEAN_WASTE_AND_OEE",
  "COSTING_MARGIN_AND_PRICING",
  "LOGISTICS_AND_TRANSPORT",
  "ENERGY_AND_UTILITIES",
  "INVENTORY_AND_STOCK",
  "MAINTENANCE_AND_DOWNTIME",
  "CONSTRUCTION_AND_FIELD_SERVICE",
  "FOOD_AGRI_AND_PROCESS",
  "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
  "GENERAL_INDUSTRIAL_COST_ANALYTICS",
];

export const P7_DOMAIN_PROMPT_PACKS = {
  GENERAL_INDUSTRIAL_COST_ANALYTICS: `You are evaluating a SectorCalc industrial/business calculator.
Design calculation-grade inputs, formula steps, validation boundaries, oracle tests, assumptions, limitations and decision outputs.
All inputs must be tool-specific, unit-aware, measurable in field practice and suitable for TypeScript generation.
Reject generic input names, shallow formulas and outputs without decision value.`,

  MANUFACTURING_AND_MACHINING: `Act as a senior manufacturing engineer and cost estimator.
For this tool, consider machine time, setup time, cycle time, labor time, machine hourly rate, material cost, scrap, rework, tooling cost, overhead, utilization and target margin where relevant.

Required input quality:
* productionVolume or batchSize
* machineTimeMinutes or machineTimeHours
* setupTimeMinutes
* laborTimeMinutes or laborHours
* machineHourlyRate
* laborHourlyRate
* materialCostPerUnit
* scrapRatePercent or scrapUnits
* overheadPercent
* targetMarginPercent where pricing is involved

Formula depth:
* base production cost
* setup allocation
* direct labor and machine cost
* material and scrap/rework adjustment
* overhead allocation
* unit cost / batch cost / quote price / margin output

Validation:
No negative hours, costs, units or rates.
Percent values must be bounded.
Target margin cannot create division by zero.
Outputs must be finite.

Oracle:
Create normal, high-scrap and high-setup scenarios.`,

  LEAN_WASTE_AND_OEE: `Act as a lean manufacturing and industrial operations auditor.
For this tool, calculate the operational and monetary impact of hidden losses.

Required context:
Use the 7 Muda categories where relevant:
overproduction, waiting, transport, overprocessing, inventory, motion, defects.

Required formula components:
* time loss cost
* material loss cost
* rework/scrap cost
* waiting machine/labor cost
* inventory/holding/obsolescence exposure
* total waste cost
* waste cost per production unit
* waste as percent of period revenue or production cost

OEE tools must consider:
availability, performance, quality, planned production time, downtime, ideal cycle time and good units.

Validation:
Production units > 0 where per-unit output is calculated.
Percent inputs 0..100.
Time and monetary values >= 0.
All denominators guarded.

Oracle:
Create low-loss, high-waiting and defect-heavy scenarios.`,

  COSTING_MARGIN_AND_PRICING: `Act as a senior cost accountant and pricing analyst.
For this tool, design a margin-safe pricing or bid-risk calculation.

Required input quality:
* directMaterialCost
* directLaborCost
* subcontractCost where relevant
* machineOrEquipmentCost
* overheadPercent or overheadAmount
* contingencyPercent
* targetGrossMarginPercent
* quotedPrice or requiredPrice
* expectedUnits or jobQuantity

Formula depth:
* direct cost
* indirect/overhead cost
* contingency/risk allowance
* total job cost
* required quote price
* gross profit
* gross margin percent
* break-even or bid-risk status where relevant

Validation:
Costs >= 0.
Target margin must be between 1 and 85 unless business case requires another limit.
Quoted price must be positive when margin is calculated.
No division by zero.

Oracle:
Create normal-margin, low-price-risk and high-overhead scenarios.`,

  LOGISTICS_AND_TRANSPORT: `Act as a logistics cost engineer.
For this tool, calculate route, shipment, delivery, warehouse or handling cost using field-measurable variables.

Required input quality:
* distanceKm or routeDistance
* tripCount
* vehicleLoadCapacity
* loadFactorPercent
* fuelConsumptionPer100Km or energyConsumptionKwh
* fuelOrEnergyUnitCost
* driverHourlyRate
* waitingTimeMinutes
* handlingCostPerShipment
* deliveryCount or shipmentCount

Formula depth:
* route distance cost
* fuel/energy cost
* driver time cost
* waiting cost
* handling cost
* total logistics cost
* cost per delivery/shipment
* utilization or load inefficiency metric

Validation:
Distance, trips, time and costs >= 0.
Load factor 1..100 when used as denominator.
Shipment count > 0 for per-shipment metrics.

Oracle:
Create short-route, low-load-factor and high-waiting scenarios.`,

  ENERGY_AND_UTILITIES: `Act as an industrial energy analyst.
For this tool, calculate energy use, loss, efficiency, tariff impact, heating/cooling exposure or payback where relevant.

Required input quality:
* powerKw
* runtimeHours
* energyConsumptionKwh
* tariffPerKwh
* peakDemandKw
* efficiencyPercent
* lossPercent
* operatingDays
* baselineConsumptionKwh
* improvedConsumptionKwh
* investmentCost where payback is relevant

Formula depth:
* baseline energy cost
* adjusted energy consumption
* efficiency or loss calculation
* cost saving or exposure
* annualized impact
* payback period where relevant

Validation:
kWh, kW, hours, tariffs and costs >= 0.
Efficiency 1..100.
Loss percent 0..100.
Payback denominator guarded.

Oracle:
Create baseline, high-tariff and efficiency-improvement scenarios.`,

  INVENTORY_AND_STOCK: `Act as an inventory control and working-capital analyst.
For this tool, calculate holding cost, excess stock, obsolescence, reorder exposure or warehouse space impact.

Required input quality:
* averageInventoryValue
* inventoryUnits
* unitCost
* holdingCostRatePercent
* obsolescenceRatePercent
* excessUnits
* monthlyDemandUnits
* leadTimeDays
* warehouseCostPerSquareMeter
* storageAreaSquareMeters

Formula depth:
* inventory carrying cost
* obsolescence/write-down exposure
* excess stock exposure
* space cost
* total stock cost
* cost per unit
* turnover or days coverage where relevant

Validation:
Inventory value, units and costs >= 0.
Rates 0..100.
Demand > 0 where turnover or coverage is calculated.

Oracle:
Create normal inventory, excess-stock and high-obsolescence scenarios.`,

  MAINTENANCE_AND_DOWNTIME: `Act as a maintenance reliability and downtime cost engineer.
For this tool, calculate downtime, repair, reliability or production loss exposure.

Required input quality:
* downtimeMinutes
* machineHourlyRate
* laborHourlyRate
* lostProductionUnits
* contributionMarginPerUnit
* repairCost
* mtbfHours
* mttrHours
* plannedProductionHours
* failureCount

Formula depth:
* downtime labor/machine cost
* lost contribution margin
* repair cost
* total downtime exposure
* cost per downtime hour
* availability or reliability metric where relevant

Validation:
Time, rates, counts and costs >= 0.
Production hours > 0 where availability is calculated.
MTBF/MTTR denominators guarded.

Oracle:
Create short-downtime, high-production-loss and high-repair-cost scenarios.`,

  CONSTRUCTION_AND_FIELD_SERVICE: `Act as a field service estimator and project cost controller.
For roofing, plumbing, HVAC, painting, cleaning, landscaping and similar tools, calculate job cost, bid price and margin risk.

Required input quality:
* jobArea or jobQuantity
* materialCost
* laborHours
* laborHourlyRate
* equipmentCost
* travelCost
* disposalCost
* subcontractCost
* overheadPercent
* targetMarginPercent

Formula depth:
* direct job cost
* labor/equipment/travel allocation
* overhead and contingency
* total job cost
* recommended bid price
* margin percent
* risk flag if bid is underpriced

Validation:
Area, quantity, hours and costs >= 0.
Margin bounded.
No denominator risk.

Oracle:
Create standard job, high-labor job and high-overhead job scenarios.`,

  FOOD_AGRI_AND_PROCESS: `Act as a food/agriculture/process cost analyst.
For crop, dairy, recipe, menu and yield tools, calculate unit economics, waste, yield loss or profit impact.

Required input quality:
* inputQuantity
* outputQuantity
* yieldPercent
* rawMaterialCost
* laborCost
* processingCost
* wasteUnits
* wasteCostPerUnit
* sellingPricePerUnit
* batchSize

Formula depth:
* raw material cost
* process/labor cost
* yield or waste adjustment
* total batch cost
* cost per sellable unit
* revenue
* gross profit and margin

Validation:
Quantities and costs >= 0.
Yield 1..100.
Output quantity > 0 for per-unit cost.

Oracle:
Create normal-yield, low-yield and high-waste scenarios.`,

  FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK: `This is a high-risk or expert-validation domain.
Do not produce an auto-approved calculator unless the formula is deterministic, non-advisory and safe as an estimation-only tool.

For tax, legal, employment, severance, FX hedge, credit/loan decision, regulatory, CBAM, AML/KYC, AI Act, pressure vessel, bolted/welded safety-critical or human-safety related tools:
* status must be FAIL unless verified deterministic public calculation rules exist.
* canGenerateCalculator should normally be false.
* produce required input list.
* produce formula/source requirements.
* produce expert validation checklist.
* produce oracle test design plan.
* explain why automatic approval is blocked.

Never produce operationally dangerous certainty.
Never mark Formula Gate approved.`,
};

const EXPERT_CHECKLIST_APPENDIX = [
  "HIGH-RISK SIGNAL ACTIVE:",
  "- Do not generate or approve a production calculator.",
  "- Return expertChecklist with: requiredInputs, requiredSources, jurisdictionNotes, validationPlan, oraclePlan, humanReviewSteps.",
  "- Set canGenerateCalculator=false and overallDecision=REJECTED unless checklist-only draft is requested.",
].join("\n");

function buildDomainSystemPrompt(match) {
  const packPrompt = P7_DOMAIN_PROMPT_PACKS[match.domainId];
  if (!packPrompt) {
    throw new Error(`Missing domain prompt pack for id: ${match.domainId}`);
  }

  const sections = [
    "=== P7 DOMAIN PROMPT PACK (single domain only) ===",
    `DOMAIN: ${match.domainId}`,
    packPrompt,
    "",
    `domainId: ${match.domainId}`,
    `matchSource: ${match.matchSource}`,
    `matchedKeywords: ${match.matchedKeywords.join(", ") || "none"}`,
  ];

  if (match.requiresExpertChecklist) {
    sections.push("", EXPERT_CHECKLIST_APPENDIX);
  }

  return sections.join("\n");
}

/**
 * Resolve the domain-specific system prompt for a tool context.
 * @param {Record<string, unknown>} toolContext
 */
export function resolveDomainPrompt(toolContext) {
  const match = matchDomainPrompt(toDomainMatchInput(toolContext));
  const content = buildDomainSystemPrompt(match);

  return {
    domainId: match.domainId,
    match,
    pack: P7_DOMAIN_PROMPT_PACKS[match.domainId],
    content,
  };
}

export function runDomainPromptPackSelfTests() {
  const cases = [
    {
      name: "cost-category-pack",
      context: { slug: "wiring-check", title: "Wiring Check", category: "cost", existingMetadata: {} },
      expectDomain: "COSTING_MARGIN_AND_PRICING",
    },
    {
      name: "cnc-manufacturing-pack",
      context: { slug: "cnc-quote-risk-analyzer", category: "manufacturing", existingMetadata: {} },
      expectDomain: "MANUFACTURING_AND_MACHINING",
    },
    {
      name: "tax-high-risk-pack",
      context: { slug: "corporate-tax-estimator", category: "finance", existingMetadata: {} },
      expectDomain: "FINANCE_LEGAL_TAX_REGULATORY_HIGH_RISK",
      expectExpert: true,
    },
    {
      name: "fallback-pack",
      context: { slug: "random-industrial-metric", category: "misc", existingMetadata: {} },
      expectDomain: "GENERAL_INDUSTRIAL_COST_ANALYTICS",
    },
  ];

  const results = cases.map((testCase) => {
    const resolved = resolveDomainPrompt(testCase.context);
    const domainOk = resolved.domainId === testCase.expectDomain;
    const contentOk =
      typeof resolved.content === "string" &&
      resolved.content.includes(`DOMAIN: ${testCase.expectDomain}`) &&
      resolved.content.includes(`domainId: ${testCase.expectDomain}`);
    const expertOk = testCase.expectExpert
      ? resolved.content.includes("HIGH-RISK SIGNAL ACTIVE")
      : true;
    const packOk = typeof resolved.pack === "string" && resolved.pack.length > 50;
    const pass = domainOk && contentOk && expertOk && packOk;
    return {
      name: testCase.name,
      pass,
      expected: testCase.expectDomain,
      actual: resolved.domainId,
    };
  });

  const packCoverageOk = Object.keys(P7_DOMAIN_PROMPT_PACKS).length === 11;

  return {
    allPass: results.every((r) => r.pass) && packCoverageOk,
    packCount: Object.keys(P7_DOMAIN_PROMPT_PACKS).length,
    results,
  };
}
