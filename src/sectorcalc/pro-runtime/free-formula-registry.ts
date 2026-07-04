import "server-only";
import type { CalculationResult } from "./free-formulas/ac-btu-room-size-calculator.formula";

// Free V5.3.1 Formula Registry
// Maps toolKey → calculate function for all 51 Free calculators.
// Server-only. Never imported by client.

export interface FormulaModule {
  toolKey: string;
  formulaVersion: string;
  calculate: (inputs: Record<string, number>) => CalculationResult;
}

// Lazy-loaded registry using dynamic imports (server-side require is safe here)
let registry: Map<string, FormulaModule> | null = null;

async function buildRegistry(): Promise<Map<string, FormulaModule>> {
  const m = new Map<string, FormulaModule>();

  const modules = [
    await import("./free-formulas/shop-daily-breakeven-hours.formula"),
    await import("./free-formulas/customer-breakeven-count-daily.formula"),
    await import("./free-formulas/rent-vs-buy-workshop-analysis.formula"),
    await import("./free-formulas/seasonal-cash-reserve-planner.formula"),
    await import("./free-formulas/installment-vs-cash-equipment.formula"),
    await import("./free-formulas/tool-investment-payback-jobs.formula"),
    await import("./free-formulas/repair-job-profitability-analyzer.formula"),
    await import("./free-formulas/true-hourly-labor-cost-burden.formula"),
    await import("./free-formulas/piece-rate-vs-hourly-worker.formula"),
    await import("./free-formulas/overtime-vs-new-hire-breakeven.formula"),
    await import("./free-formulas/make-vs-buy-subcontracting-breakeven.formula"),
    await import("./free-formulas/quote-markup-safety-hidden-costs.formula"),
    await import("./free-formulas/credit-payment-surcharge-inflation.formula"),
    await import("./free-formulas/accounts-receivable-risk-tracker.formula"),
    await import("./free-formulas/commodity-price-escalation-clause.formula"),
    await import("./free-formulas/steel-bar-cutting-optimizer-waste.formula"),
    await import("./free-formulas/scrap-metal-resale-value-tracker.formula"),
    await import("./free-formulas/scrap-waste-monthly-cost.formula"),
    await import("./free-formulas/batch-size-economy-optimizer.formula"),
    await import("./free-formulas/welding-electrode-consumption-cost.formula"),
    await import("./free-formulas/welding-amperage-thickness-chart.formula"),
    await import("./free-formulas/lathe-rpm-material-speeds-feeds.formula"),
    await import("./free-formulas/milling-feed-rate-calculator.formula"),
    await import("./free-formulas/gear-module-ratio-calculator.formula"),
    await import("./free-formulas/spring-rate-force-calculator.formula"),
    await import("./free-formulas/bolt-torque-spec-calculator.formula"),
    await import("./free-formulas/hydraulic-press-tonnage-calculator.formula"),
    await import("./free-formulas/solder-consumption-calculator.formula"),
    await import("./free-formulas/concrete-volume-bags-m3.formula"),
    await import("./free-formulas/tile-coverage-waste-calculator.formula"),
    await import("./free-formulas/plaster-bag-calculator-walls.formula"),
    await import("./free-formulas/paint-coverage-calculator-primer.formula"),
    await import("./free-formulas/pvc-window-cost-estimator.formula"),
    await import("./free-formulas/door-hardware-cost-buildup.formula"),
    await import("./free-formulas/roof-sheet-overlap-calculator.formula"),
    await import("./free-formulas/gutter-slope-length-calculator.formula"),
    await import("./free-formulas/water-tank-capacity-household.formula"),
    await import("./free-formulas/pump-flow-rate-calculator.formula"),
    await import("./free-formulas/ac-btu-room-size-calculator.formula"),
    await import("./free-formulas/radiator-btu-heat-loss.formula"),
    await import("./free-formulas/pipe-pressure-drop-calculator.formula"),
    await import("./free-formulas/solar-panel-payback-rooftop.formula"),
    await import("./free-formulas/generator-fuel-consumption-cost.formula"),
    await import("./free-formulas/compressor-air-demand-cfm.formula"),
    await import("./free-formulas/wire-weight-per-meter-copper.formula"),
    await import("./free-formulas/service-vehicle-km-total-cost.formula"),
    await import("./free-formulas/tire-shop-profit-per-set.formula"),
    await import("./free-formulas/v-belt-length-pulley-calculator.formula"),
    await import("./free-formulas/bearing-life-hours-l10.formula"),
    await import("./free-formulas/sprocket-chain-ratio-calculator.formula"),
    await import("./free-formulas/steel-profile-weight-price-heb.formula"),
  ];

  for (const mod of modules) {
    m.set(mod.toolKey, {
      toolKey: mod.toolKey,
      formulaVersion: mod.formulaVersion,
      calculate: mod.calculate,
    });
  }

  return m;
}

export async function getFreeFormulaModule(toolKey: string): Promise<FormulaModule | null> {
  if (!registry) {
    registry = await buildRegistry();
  }
  return registry.get(toolKey) ?? null;
}

export async function listFreeFormulaKeys(): Promise<string[]> {
  if (!registry) {
    registry = await buildRegistry();
  }
  return [...registry.keys()].sort();
}
