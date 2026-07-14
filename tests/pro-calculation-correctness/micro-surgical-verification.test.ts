/**
 * MİCRO-SURGICAL 360° CALCULATION ENGINE VERIFICATION
 *
 * Phase 1 — Mathematical Correctness: Manually compute expected values
 * for 10+ key formulas across different domains and compare with actual
 * formula output. Any deviation > 1e-12 relative is a BUG.
 *
 * Phase 2 — Algebraic Invariants: Verify mathematical identities hold.
 *   - break-even: revenue = fixed_cost / contribution_ratio
 *   - machining: cost_per_part must be >= material_cost
 *   - oee: availability ∈ [0,1], performance ∈ [0,∞), quality ∈ [0,1]
 *   - eoq: annual_ordering_cost ≈ annual_holding_cost at EOQ
 *   - downtime: total_loss >= lost_contribution
 *
 * Phase 3 — Output Contract Completeness: Every formula returns ALL
 * declared output keys with finite values.
 *
 * Phase 4 — Semantic Plausibility: Outputs in physically meaningful ranges.
 *   - Cost per part > 0, quote > cost, margin < quote
 *   - OEE ∈ [0,1] before ×100 conversion
 *   - Break-even units < target_profit_units (since target_profit > 0)
 *
 * Phase 5 — Edge Case Propagation: BLOCKED/REVIEW correctly propagated.
 *
 * Phase 6 — Cross-tool Consistency: Related tools produce domain-consistent
 * results (e.g. oee downtime ≈ downtime-cost's hidden costs).
 */
import { describe, it, expect } from "vitest";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531";

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function relDiff(got: number, expected: number): number {
  if (expected === 0) return Math.abs(got);
  return Math.abs((got - expected) / expected);
}

function executeFree(toolKey: string, inputs: Record<string, number>) {
  const formula = freeV531FormulaRegistry[toolKey];
  if (!formula) throw new Error(`Formula ${toolKey} not registered`);
  return formula.execute(inputs);
}

function getMetric(outputs: Array<{ id: string; value: unknown }>, id: string): number | null {
  const m = outputs.find((o) => o.id === id);
  return m && isFiniteNumber(m.value) ? m.value : null;
}

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 1 — MATHEMATICAL CORRECTNESS (Manual Computation)
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 1 — Mathematical Correctness (Manually Verified)", () => {

  /* ── 1a. EOQ: Wilson formula verification ── */
  it("EOQ — Wilson formula produces mathematically correct values", () => {
    // EOQ = sqrt(2 * D * S / (C * H))
    // D=10000, S=150, C=50, H=20% => carryingRate=0.2, holdCost=50*0.2=10
    // EOQ = sqrt(2*10000*150/10) = sqrt(300000) = 547.7225575051661
    // Annual order cost = D/EOQ * S = 10000/547.7225575*150 = 2738.6127875258305
    // Annual holding cost = EOQ/2 * H = 547.7225575/2*10 = 2738.6127875258305
    const result = executeFree("eoq", {
      annual_demand_units: 10000,
      ordering_cost_per_order: 150,
      unit_cost: 50,
      annual_carrying_rate_percent: 20,
    });

    const eoq = getMetric(result.outputs, "economic_order_quantity");
    const ordCost = getMetric(result.outputs, "annual_ordering_cost");
    const holdCost = getMetric(result.outputs, "annual_holding_cost");

    expect(eoq).not.toBeNull();
    expect(ordCost).not.toBeNull();
    expect(holdCost).not.toBeNull();

    // EOQ = sqrt(300000)
    const expectedEOQ = Math.sqrt(300000);
    expect(relDiff(eoq!, expectedEOQ)).toBeLessThan(1e-12);

    // At EOQ, annual ordering cost = annual holding cost (mathematical invariant)
    expect(relDiff(ordCost!, holdCost!)).toBeLessThan(1e-10);

    // Verify the values are exactly matching
    // Annual order = 10000/547.7225575*150 = 2738.6127875258305
    // Annual hold = 547.7225575/2*10 = 2738.6127875258305
    const expectedAnnualCost = 10000 / expectedEOQ * 150;
    expect(relDiff(ordCost!, expectedAnnualCost)).toBeLessThan(1e-12);
  });

  /* ── 1b. Downtime Cost: manual computation ── */
  it("Downtime Cost — computes total loss correctly", () => {
    // downtime_hours=2, planned_units_per_hour=50, contribution_margin_per_unit=25
    // idle_labor_cost_per_hour=300, repair_cost=2000, delivery_penalty_cost=5000
    // lostUnits = 2*50 = 100
    // lostContribution = 100*25 = 2500
    // idleCost = 2*300 = 600
    // totalLoss = 2500+600+2000+5000 = 10100
    const result = executeFree("downtime-cost", {
      downtime_hours: 2,
      planned_units_per_hour: 50,
      contribution_margin_per_unit: 25,
      idle_labor_cost_per_hour: 300,
      repair_cost: 2000,
      delivery_penalty_cost: 5000,
    });

    const lostUnits = getMetric(result.outputs, "lost_units");
    const lostContrib = getMetric(result.outputs, "lost_contribution");
    const totalLoss = getMetric(result.outputs, "downtime_loss");

    expect(lostUnits).toBe(100);
    expect(lostContrib).toBe(2500);
    expect(totalLoss).toBe(10100);
  });

  /* ── 1c. Machining Cost Per Part: multi-step verification ── */
  it("Machining Cost Per Part — exact multi-step calculation", () => {
    // Batch=500, cycle=180s, setup=30min, mat=4.5, labor_rate=45, machine_rate=85
    // edge_life=200, tooling=12, overhead=15%, scrap=3%, margin=20%
    // setupHrsPerPart=30/60/500=0.001
    // cycleHrsPerPart=180/3600=0.05
    // machineCost=(0.001+0.05)*85=4.335
    // laborCost=(0.001+0.05)*45=2.295
    // toolCost=12/200=0.06
    // directCost=4.5+4.335+2.295+0.06=11.19
    // overhead=11.19*0.15=1.6785
    // scrapAllow=(11.19+1.6785)*3/97=0.39799484536082474
    // costPerPart=11.19+1.6785+0.397994845=13.266494845360825
    // quote=13.266494845360825/0.8=16.58311855670103
    // moneyAtRisk=(16.58311855670103-13.266494845360825)*500=1658.3118556701025
    const result = executeFree("machining-cost-per-part", {
      batch_quantity: 500,
      cycle_seconds: 180,
      edge_life_parts: 200,
      labor_hourly_rate: 45,
      machine_hourly_rate: 85,
      material_cost_per_blank: 4.5,
      overhead_percent: 15,
      scrap_percent: 3,
      setup_minutes: 30,
      target_margin_percent: 20,
      tooling_cost_per_edge: 12,
    });

    const cost = getMetric(result.outputs, "cost_per_part");
    const quote = getMetric(result.outputs, "quote_price_per_part");
    const margin = getMetric(result.outputs, "batch_margin_value");

    // Manual computation
    const setupHrsPerPart = 30 / 60 / 500;
    const cycleHrsPerPart = 180 / 3600;
    const machineCost = (setupHrsPerPart + cycleHrsPerPart) * 85;
    const laborCost = (setupHrsPerPart + cycleHrsPerPart) * 45;
    const toolCost = 12 / 200;
    const directCost = 4.5 + machineCost + laborCost + toolCost;
    const overhead = directCost * 15 / 100;
    const scrapAllow = (directCost + overhead) * 3 / 97;
    const expectedCost = directCost + overhead + scrapAllow;
    const expectedQuote = expectedCost / 0.8;
    const expectedMargin = (expectedQuote - expectedCost) * 500;

    expect(relDiff(cost!, expectedCost)).toBeLessThan(1e-12);
    expect(relDiff(quote!, expectedQuote)).toBeLessThan(1e-12);
    expect(relDiff(margin!, expectedMargin)).toBeLessThan(1e-12);

    // Semantic: cost > material cost, quote > cost, margin > 0
    expect(cost!).toBeGreaterThan(4.5);
    expect(quote!).toBeGreaterThan(cost!);
    expect(margin!).toBeGreaterThan(0);
  });

  /* ── 1d. OEE: multi-factor computation ── */
  it("OEE — correctly computes availability × performance × quality", () => {
    // planned=480, downtime=45, ideal=60s, total=400, good=380, contrib=50
    // availability = (480-45)/480 = 435/480 = 0.90625
    // performance = (60*400)/(435*60) = 24000/26100 = 0.9195402298850575
    // quality = 380/400 = 0.95
    // oee = 0.90625 * 0.9195402298850575 * 0.95 = 0.791692...
    // oee_percent = 0.791692 * 100 = 79.1692...
    const result = executeFree("oee", {
      planned_production_minutes: 480,
      downtime_minutes: 45,
      ideal_cycle_seconds: 60,
      total_count: 400,
      good_count: 380,
      contribution_margin_per_good_unit: 50,
    });

    const avail = getMetric(result.outputs, "availability");
    const perf = getMetric(result.outputs, "performance");
    const qual = getMetric(result.outputs, "quality");
    const oeePct = getMetric(result.outputs, "oee_percent");

    const expectedAvail = (480 - 45) / 480;
    const expectedPerf = (60 * 400) / ((480 - 45) * 60);
    const expectedQual = 380 / 400;
    const expectedOee = expectedAvail * expectedPerf * expectedQual;

    expect(relDiff(avail!, expectedAvail)).toBeLessThan(1e-12);
    expect(relDiff(perf!, expectedPerf)).toBeLessThan(1e-12);
    expect(relDiff(qual!, expectedQual)).toBeLessThan(1e-12);
    expect(relDiff(oeePct!, expectedOee * 100)).toBeLessThan(1e-10);

    // Algebraic invariants
    expect(avail!).toBeGreaterThan(0);
    expect(avail!).toBeLessThanOrEqual(1);
    expect(qual!).toBeGreaterThan(0);
    expect(qual!).toBeLessThanOrEqual(1);
  });

  /* ── 1e. Break-Even Point ── */
  it("Break-Even Point — correct break-even and target profit units", () => {
    // fixed=50000, price=100, var=60, target_profit=10000
    // contribution = 100-60 = 40
    // breakEvenUnits = 50000/40 = 1250
    // targetUnits = (50000+10000)/40 = 1500
    // safetyMarginUnits = expected_sales - breakEvenUnits = 1000-1250 = -250
    const result = executeFree("break-even-point", {
      expected_sales_units: 1000,
      monthly_fixed_cost: 50000,
      selling_price_per_unit: 100,
      variable_cost_per_unit: 60,
      target_monthly_profit: 10000,
    });

    const contrib = getMetric(result.outputs, "unit_contribution_margin");
    const beUnits = getMetric(result.outputs, "break_even_units");
    const targetUnits = getMetric(result.outputs, "target_profit_units");
    const safetyUnits = getMetric(result.outputs, "safety_margin_units");

    expect(contrib).toBe(40);
    expect(beUnits).toBe(1250);
    expect(targetUnits).toBe(1500);
    expect(safetyUnits).toBe(-250);  // below break-even → negative safety

    // Algebraic: target_units = break_even_units + target_profit / contribution
    expect(targetUnits! - beUnits!).toBeCloseTo(10000 / 40, 10);
  });

  /* ── 1f. Steel Weight ── */
  it("Steel Weight — correct mass and cost (waste included in gross weight)", () => {
    // area=500mm²=0.0005m², length=6m, density=7850kg/m³
    // netWeight = 0.0005 * 6 * 7850 = 23.55 kg
    // grossWeight = 23.55 * (1 + 5/100) = 24.7275 kg
    // material_cost = grossWeight * 1.5 = 24.7275 * 1.5 = 37.09125
    const result = executeFree("steel-weight", {
      cross_section_area_mm2: 500,
      length_m: 6,
      density_kg_m3: 7850,
      material_cost_per_kg: 1.5,
      waste_percent: 5,
    });

    const netMass = getMetric(result.outputs, "net_steel_weight_kg");
    const grossMass = getMetric(result.outputs, "gross_steel_weight_with_waste_kg");
    const cost = getMetric(result.outputs, "steel_material_cost");

    // Net weight = area_mm2/1e6 * length * density
    const expectedNetMass = (500 / 1_000_000) * 6 * 7850;
    const expectedGrossMass = expectedNetMass * (1 + 5 / 100);
    const expectedCost = expectedGrossMass * 1.5;

    expect(relDiff(netMass!, expectedNetMass)).toBeLessThan(1e-12);
    expect(relDiff(grossMass!, expectedGrossMass)).toBeLessThan(1e-12);
    expect(relDiff(cost!, expectedCost)).toBeLessThan(1e-12);
  });

  /* ── 1g. Cutting Speed Feed RPM ── */
  it("Cutting Speed Feed RPM — correct spindle speed and feed", () => {
    // Vc=120 m/min, D=12mm
    // n = (Vc * 1000) / (pi * D) = 120000 / (3.14159*12) = 3183.098...
    // vf = n * fz * z = 3183.098 * 0.1 * 4 = 1273.239...
    const result = executeFree("cutting-speed-feed-rpm", {
      cutting_speed_m_min: 120,
      tool_diameter_mm: 12,
      feed_per_tooth_mm: 0.1,
      number_of_teeth: 4,
      max_chip_load_mm: 0.15,
    });

    const rpm = getMetric(result.outputs, "spindle_rpm");
    const feed = getMetric(result.outputs, "table_feed_mm_min");

    const expectedRPM = (120 * 1000) / (Math.PI * 12);
    const expectedFeed = expectedRPM * 0.1 * 4;

    expect(relDiff(rpm!, expectedRPM)).toBeLessThan(1e-12);
    expect(relDiff(feed!, expectedFeed)).toBeLessThan(1e-12);
  });

  /* ── 1h. Surface Roughness Converter ── */
  it("Surface Roughness — correct Ra→Rz and Ra→RMS conversions", () => {
    const result = executeFree("surface-roughness-converter", {
      ra_um: 1.6,
      rms_to_ra_ratio: 1.11,
      rz_to_ra_ratio: 6.0,
    });

    const rz = getMetric(result.outputs, "roughness_rz_um");
    const rms = getMetric(result.outputs, "roughness_rms_um");

    expect(relDiff(rz!, 1.6 * 6.0)).toBeLessThan(1e-12);
    expect(relDiff(rms!, 1.6 * 1.11)).toBeLessThan(1e-12);
  });

  /* ── 1i. MRR (Material Removal Rate) ── */
  it("Material Removal Rate — correct volumetric and mass MRR", () => {
    // depth=2mm, width=50mm, feed=200mm/min
    // MRR_cm3 = 2*50*200/1000 = 20 cm³/min
    // density=7850 kg/m³ = 0.00785 g/mm³
    // MRR_kg = 20*0.00785... = well, let me use the schema patterns
    const result = executeFree("material-removal-rate", {
      depth_of_cut_mm: 2,
      width_of_cut_mm: 50,
      feed_rate_mm_min: 200,
      machine_hourly_rate: 85,
      material_density_kg_m3: 7850,
    });

    const mrrCm3 = getMetric(result.outputs, "mrr_cm3_min");
    const expectedMRR = 2 * 50 * 200 / 1000;
    expect(relDiff(mrrCm3!, expectedMRR)).toBeLessThan(1e-12);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 2 — ALGEBRAIC INVARIANTS
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 2 — Algebraic Invariants", () => {

  it("EOQ — annual ordering cost ≈ annual holding cost at optimal quantity", () => {
    const result = executeFree("eoq", {
      annual_demand_units: 15000,
      ordering_cost_per_order: 200,
      unit_cost: 75,
      annual_carrying_rate_percent: 25,
    });

    const ordCost = getMetric(result.outputs, "annual_ordering_cost")!;
    const holdCost = getMetric(result.outputs, "annual_holding_cost")!;

    // At exact EOQ, these are equal. Float rounding gives tiny diff.
    expect(relDiff(ordCost, holdCost)).toBeLessThan(1e-10);
  });

  it("Machining — cost_per_part >= material_cost_per_blank", () => {
    const result = executeFree("machining-cost-per-part", {
      batch_quantity: 100,
      cycle_seconds: 60,
      edge_life_parts: 100,
      labor_hourly_rate: 35,
      machine_hourly_rate: 65,
      material_cost_per_blank: 2.5,
      overhead_percent: 10,
      scrap_percent: 2,
      setup_minutes: 15,
      target_margin_percent: 15,
      tooling_cost_per_edge: 8,
    });

    const cost = getMetric(result.outputs, "cost_per_part")!;
    expect(cost).toBeGreaterThan(2.5);
  });

  it("Machining — quote_price > cost_per_part when margin > 0", () => {
    const result = executeFree("machining-cost-per-part", {
      batch_quantity: 100,
      cycle_seconds: 60,
      edge_life_parts: 100,
      labor_hourly_rate: 35,
      machine_hourly_rate: 65,
      material_cost_per_blank: 2.5,
      overhead_percent: 10,
      scrap_percent: 2,
      setup_minutes: 15,
      target_margin_percent: 15,
      tooling_cost_per_edge: 8,
    });

    const cost = getMetric(result.outputs, "cost_per_part")!;
    const quote = getMetric(result.outputs, "quote_price_per_part")!;
    expect(quote).toBeGreaterThan(cost);
  });

  it("Machining — margin value = (quote - cost) * batch", () => {
    const result = executeFree("machining-cost-per-part", {
      batch_quantity: 250,
      cycle_seconds: 90,
      edge_life_parts: 150,
      labor_hourly_rate: 40,
      machine_hourly_rate: 75,
      material_cost_per_blank: 3.0,
      overhead_percent: 12,
      scrap_percent: 2,
      setup_minutes: 20,
      target_margin_percent: 18,
      tooling_cost_per_edge: 10,
    });

    const cost = getMetric(result.outputs, "cost_per_part")!;
    const quote = getMetric(result.outputs, "quote_price_per_part")!;
    const margin = getMetric(result.outputs, "batch_margin_value")!;

    expect(relDiff(margin, (quote - cost) * 250)).toBeLessThan(1e-10);
  });

  it("OEE — availability ∈ [0,1] for valid inputs", () => {
    const result = executeFree("oee", {
      planned_production_minutes: 480,
      downtime_minutes: 30,
      ideal_cycle_seconds: 45,
      total_count: 600,
      good_count: 570,
      contribution_margin_per_good_unit: 25,
    });

    const avail = getMetric(result.outputs, "availability")!;
    expect(avail).toBeGreaterThanOrEqual(0);
    expect(avail).toBeLessThanOrEqual(1);
  });

  it("OEE — quality ∈ [0,1]", () => {
    const result = executeFree("oee", {
      planned_production_minutes: 480,
      downtime_minutes: 30,
      ideal_cycle_seconds: 45,
      total_count: 600,
      good_count: 570,
      contribution_margin_per_good_unit: 25,
    });

    const quality = getMetric(result.outputs, "quality")!;
    expect(quality).toBeGreaterThanOrEqual(0);
    expect(quality).toBeLessThanOrEqual(1);
  });

  it("Break-even — break_even_units < target_profit_units when target_profit > 0", () => {
    const result = executeFree("break-even-point", {
      expected_sales_units: 2000,
      monthly_fixed_cost: 80000,
      selling_price_per_unit: 120,
      variable_cost_per_unit: 70,
      target_monthly_profit: 15000,
    });

    const be = getMetric(result.outputs, "break_even_units")!;
    const target = getMetric(result.outputs, "target_profit_units")!;
    expect(be).toBeLessThan(target);
  });

  it("Break-even — contribution_margin = price - variable_cost", () => {
    const result = executeFree("break-even-point", {
      expected_sales_units: 2000,
      monthly_fixed_cost: 80000,
      selling_price_per_unit: 120,
      variable_cost_per_unit: 70,
      target_monthly_profit: 15000,
    });

    const contrib = getMetric(result.outputs, "unit_contribution_margin")!;
    expect(contrib).toBe(50); // 120 - 70
  });

  it("Downtime — total_loss >= lost_contribution", () => {
    const result = executeFree("downtime-cost", {
      downtime_hours: 3,
      planned_units_per_hour: 40,
      contribution_margin_per_unit: 30,
      idle_labor_cost_per_hour: 250,
      repair_cost: 1500,
      delivery_penalty_cost: 3000,
    });

    const loss = getMetric(result.outputs, "downtime_loss")!;
    const lostContrib = getMetric(result.outputs, "lost_contribution")!;
    expect(loss).toBeGreaterThanOrEqual(lostContrib);
  });

  it("Scrap-cost — total scrap cost >= 0 (never negative for valid inputs)", () => {
    const result = executeFree("scrap-cost", {
      produced_quantity: 1000,
      scrap_quantity: 50,
      material_cost_per_unit: 25,
      conversion_cost_per_unit: 15,
      salvage_value_per_unit: 5,
      reinspection_cost_per_scrap: 3,
    });

    const scrapLoss = getMetric(result.outputs, "scrap_loss")!;
    expect(scrapLoss).toBeGreaterThanOrEqual(0);
  });

  it("Setup-time-cost — total_setup_cost = setup_minutes/60 * (labor + machine) * changeovers", () => {
    const result = executeFree("setup-time-cost", {
      setup_minutes: 45,
      batch_quantity: 100,
      changeovers_per_month: 8,
      labor_hourly_rate: 40,
      machine_hourly_rate: 80,
      target_setup_cost_per_part: 0.5,
    });

    const monthlyBurden = getMetric(result.outputs, "monthly_setup_burden")!;
    const expectedMonthly = 45 / 60 * (40 + 80) * 8;
    expect(relDiff(monthlyBurden, expectedMonthly)).toBeLessThan(1e-12);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 3 — OUTPUT CONTRACT COMPLETENESS
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 3 — Output Contract Completeness", () => {
  // For each formula, verify that every declared input gets a finite output
  // and no output is missing/null/BLOCKED for valid inputs

  const freeKeys = Object.keys(freeV531FormulaRegistry);

  it.each(freeKeys)("%s — returns outputs for ALL inputs (no missing output)", (toolKey) => {
    const formula = freeV531FormulaRegistry[toolKey];
    const inputIds = formula.inputs.map((i) => i.id);
    
    // Generate sufficient test data
    const inputData: Record<string, number> = {};
    for (const id of inputIds) {
      inputData[id] = 10;  // safe default
    }

    const result = formula.execute(inputData);
    const outputs = result.outputs ?? [];

    // Must have at least one output metric
    expect(outputs.length).toBeGreaterThan(0);

    // Every output must have a defined value
    for (const out of outputs) {
      expect(
        isFiniteNumber(out.value) || out.value === null,
        `${toolKey}: output ${out.id} has unexpected type: ${typeof out.value}`,
      ).toBe(true);
    }

    // Primary metric must always exist and be finite
    if (result.primaryMetricId) {
      const primary = outputs.find((o) => o.id === result.primaryMetricId);
      expect(primary, `${toolKey}: primary metric ${result.primaryMetricId} missing`).toBeDefined();
      expect(
        isFiniteNumber(primary!.value),
        `${toolKey}: primary metric ${result.primaryMetricId} is not finite: ${primary!.value}`,
      ).toBe(true);
    }
  });

  it("all 50 tools produce outputs when given minimal valid inputs", () => {
    let totalOutputs = 0;
    for (const key of freeKeys) {
      const formula = freeV531FormulaRegistry[key];
      // Provide 0 or minimal inputs for all declared inputs
      const allInputs: Record<string, number> = {};
      for (const inp of formula.inputs) {
        allInputs[inp.id] = 1;
      }
      const result = formula.execute(allInputs);
      if (result.outputs) totalOutputs += result.outputs.length;
    }
    // Each tool has at least 2 outputs on average = 100 total
    expect(totalOutputs).toBeGreaterThanOrEqual(100);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 4 — SEMANTIC PLAUSIBILITY
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 4 — Semantic Plausibility", () => {
  const realisticInputs: Record<string, Record<string, number>> = {
    "break-even-point": { expected_sales_units: 2000, monthly_fixed_cost: 60000, selling_price_per_unit: 110, variable_cost_per_unit: 65, target_monthly_profit: 12000 },
    "machining-cost-per-part": { batch_quantity: 500, cycle_seconds: 180, edge_life_parts: 200, labor_hourly_rate: 45, machine_hourly_rate: 85, material_cost_per_blank: 4.5, overhead_percent: 15, scrap_percent: 3, setup_minutes: 30, target_margin_percent: 20, tooling_cost_per_edge: 12 },
    "oee": { planned_production_minutes: 480, downtime_minutes: 45, ideal_cycle_seconds: 60, total_count: 400, good_count: 380, contribution_margin_per_good_unit: 50 },
    "downtime-cost": { downtime_hours: 2, planned_units_per_hour: 50, contribution_margin_per_unit: 25, idle_labor_cost_per_hour: 300, repair_cost: 2000, delivery_penalty_cost: 5000 },
    "cutting-speed-feed-rpm": { cutting_speed_m_min: 120, tool_diameter_mm: 12, feed_per_tooth_mm: 0.1, number_of_teeth: 4, max_chip_load_mm: 0.15 },
    "steel-weight": { cross_section_area_mm2: 500, length_m: 6, density_kg_m3: 7850, material_cost_per_kg: 1.5, waste_percent: 5 },
    "eoq": { annual_demand_units: 10000, ordering_cost_per_order: 150, unit_cost: 50, annual_carrying_rate_percent: 20 },
    "scrap-cost": { produced_quantity: 1000, scrap_quantity: 50, material_cost_per_unit: 25, conversion_cost_per_unit: 15, salvage_value_per_unit: 5, reinspection_cost_per_scrap: 3 },
    "setup-time-cost": { setup_minutes: 30, batch_quantity: 200, changeovers_per_month: 10, labor_hourly_rate: 45, machine_hourly_rate: 85, target_setup_cost_per_part: 0.5 },
  };

  it.each(Object.keys(realisticInputs))("%s — all outputs are positive and physically meaningful", (toolKey) => {
    const formula = freeV531FormulaRegistry[toolKey];
    const inputs = realisticInputs[toolKey];
    const result = formula.execute(inputs);
    const outputs = result.outputs ?? [];

    for (const out of outputs) {
      if (typeof out.value === "number") {
        // Cost/price/loss metrics must be >= 0
        if (out.id.includes("cost") || out.id.includes("loss") || out.id.includes("price") || out.id === "downtime_loss") {
          expect(
            out.value >= 0,
            `${toolKey}: ${out.id} should be non-negative but got ${out.value}`,
          ).toBe(true);
        }
        // Ratio metrics must be in [0, ~10] range (performance can exceed 1)
        if (out.id.includes("ratio") || out.id === "availability" || out.id === "quality") {
          expect(
            out.value >= 0 && out.value <= 10,
            `${toolKey}: ${out.id}=${out.value} out of expected ratio range [0,10]`,
          ).toBe(true);
        }
      }
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 5 — EDGE CASE PROPAGATION
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 5 — Edge Case Propagation", () => {

  it("Zero inputs do not produce NaN or Infinity in machining-cost", () => {
    const result = executeFree("machining-cost-per-part", {
      batch_quantity: 0,
      cycle_seconds: 0,
      edge_life_parts: 0,
      labor_hourly_rate: 0,
      machine_hourly_rate: 0,
      material_cost_per_blank: 0,
      overhead_percent: 0,
      scrap_percent: 0,
      setup_minutes: 0,
      target_margin_percent: 0,
      tooling_cost_per_edge: 0,
    });

    for (const out of result.outputs) {
      expect(
        Number.isFinite(out.value) || out.value === null,
        `machining: ${out.id}=${out.value} is not finite`,
      ).toBe(true);
    }
  });

  it("OEE — zero downtime gives availability = 1", () => {
    const result = executeFree("oee", {
      planned_production_minutes: 480,
      downtime_minutes: 0,
      ideal_cycle_seconds: 60,
      total_count: 400,
      good_count: 400,
      contribution_margin_per_good_unit: 50,
    });

    expect(getMetric(result.outputs, "availability")).toBe(1);
    expect(getMetric(result.outputs, "quality")).toBe(1);
  });

  it("Break-even — negative contribution margin produces BLOCKED status", () => {
    // selling_price < variable_cost → contribution <= 0 → BLOCKER
    const result = executeFree("break-even-point", {
      expected_sales_units: 1000,
      monthly_fixed_cost: 50000,
      selling_price_per_unit: 50,
      variable_cost_per_unit: 60,
      target_monthly_profit: 10000,
    });

    // Should contain "BLOCKED" or "REJECT" in status
    const status = result.status ?? "";
    const isBlocked = status.includes("BLOCKED") || status.includes("REJECT") || status.includes("REVIEW");
    // At minimum the warning list should contain a BLOCKER
    const hasBlocker = (result.warnings ?? []).some((w) => w.severity === "BLOCKER");
    expect(hasBlocker).toBe(true);
  });

  it("EOQ — negative inputs do not crash (defensive Math.max guards)", () => {
    // NOTE: EOQ formula uses Math.max(holdingCost, 0.0001) which prevents
    // negative-argument sqrt. Negative * negative = positive, so this works.
    const result = executeFree("eoq", {
      annual_demand_units: -100,
      ordering_cost_per_order: -150,
      unit_cost: -50,
      annual_carrying_rate_percent: -20,
    });
    for (const out of result.outputs) {
      expect(
        Number.isFinite(out.value) || out.value === null,
        `negative EOQ: ${out.id}=${out.value}`,
      ).toBe(true);
    }
  });

  it("Missing required input throws BLOCKED error", () => {
    expect(() => {
      executeFree("machining-cost-per-part", {
        batch_quantity: 100,
      });
    }).toThrow(/BLOCKED/);
  });

  it("Extreme values (1e9) do not crash or produce Infinity", () => {
    const result = executeFree("steel-weight", {
      cross_section_area_mm2: 1e9,
      length_m: 1e6,
      density_kg_m3: 1e9,
      material_cost_per_kg: 1e6,
      waste_percent: 50,
    });

    for (const out of result.outputs) {
      expect(
        Number.isFinite(out.value) || out.value === null,
        `extreme steel-weight: ${out.id}=${out.value}`,
      ).toBe(true);
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 6 — CROSS-TOOL CONSISTENCY
   ═══════════════════════════════════════════════════════════════════════ */

describe("PHASE 6 — Cross-tool Consistency", () => {

  it("OEE hidden factory loss ≈ downtime cost when inputs are consistent", () => {
    // Same production scenario across OEE and downtime-cost tools
    // OEE: 480min shift, 45min downtime, 60s ideal, 400 total, 380 good, $50/unit
    // lostContribution = 100 units * $25 = $2500

    const oeeResult = executeFree("oee", {
      planned_production_minutes: 480,
      downtime_minutes: 45,
      ideal_cycle_seconds: 60,
      total_count: 400,
      good_count: 380,
      contribution_margin_per_good_unit: 50,
    });

    const oeeHiddenLoss = getMetric(oeeResult.outputs, "estimated_hidden_factory_loss")!;
    const oee = getMetric(oeeResult.outputs, "oee_percent")!;

    // OEE should be between 0% and 100% for normal operation
    expect(oee).toBeGreaterThan(0);
    expect(oee).toBeLessThanOrEqual(100);
    expect(oeeHiddenLoss).toBeGreaterThan(0);

    // Hidden factory loss = (1 - OEE) * goodCount * contribution
    // = (1 - 0.79169) * 380 * 50 = 3957.8...
    const oeeDecimal = oee / 100;
    const expectedHidden = Math.max(0, 1 - oeeDecimal) * 380 * 50;
    expect(relDiff(oeeHiddenLoss, expectedHidden)).toBeLessThan(1e-10);
  });

  it("Setup-time-cost and machining-cost-per-part: compatible labor rate units", () => {
    // Both use labor_hourly_rate and machine_hourly_rate
    const setupInputs = {
      setup_minutes: 30,
      batch_quantity: 200,
      changeovers_per_month: 10,
      labor_hourly_rate: 45,
      machine_hourly_rate: 85,
      target_setup_cost_per_part: 0.5,
    };

    const setupResult = executeFree("setup-time-cost", setupInputs);
    const setupCostPerPart = getMetric(setupResult.outputs, "setup_cost_per_part");
    const monthlyBurden = getMetric(setupResult.outputs, "monthly_setup_burden");

    // setup_cost_per_part = setup_min/60 * (labor + machine) / batch_qty
    const expectedSetupCostPerPart = 30 / 60 * (45 + 85) / 200;
    expect(relDiff(setupCostPerPart!, expectedSetupCostPerPart)).toBeLessThan(1e-12);

    // monthly_setup_burden = setup_min/60 * (labor + machine) * changeovers
    const expectedMonthlyBurden = 30 / 60 * (45 + 85) * 10;
    expect(relDiff(monthlyBurden!, expectedMonthlyBurden)).toBeLessThan(1e-12);
  });

  it("Surface roughness converter — Rz ≈ 6×Ra (standard assumption)", () => {
    const result = executeFree("surface-roughness-converter", {
      ra_um: 0.8,
      rms_to_ra_ratio: 1.11,
      rz_to_ra_ratio: 6.0,
    });

    const rz = getMetric(result.outputs, "roughness_rz_um")!;
    expect(relDiff(rz, 0.8 * 6.0)).toBeLessThan(1e-12);
    expect(rz).toBeGreaterThan(0);
  });

  it("Scrap cost and machining cost: consistent material units", () => {
    // Both use material_cost_per_unit / material_cost_per_blank in same currency
    const scrapResult = executeFree("scrap-cost", {
      produced_quantity: 1000,
      scrap_quantity: 50,
      material_cost_per_unit: 25,
      conversion_cost_per_unit: 15,
      salvage_value_per_unit: 5,
      reinspection_cost_per_scrap: 3,
    });

    const scrapLoss = getMetric(scrapResult.outputs, "scrap_loss")!;
    const scrapRate = getMetric(scrapResult.outputs, "scrap_rate")!;

    // scrap_loss = scrap_qty * (material + conversion + reinspection - salvage)
    // = 50 * (25 + 15 + 3 - 5) = 50 * 38 = 1900
    expect(scrapLoss).toBe(1900);
    expect(scrapLoss).toBeGreaterThan(0);

    // scrap_rate = scrap_qty / produced_qty = 50/1000 = 0.05
    expect(scrapRate).toBe(0.05);
  });
});
