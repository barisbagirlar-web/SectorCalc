import {
  CASE_STUDY_DISCLAIMER,
  CASE_STUDY_REPRESENTATIVE_LABEL,
  type CaseStudyEntry,
} from "@/lib/features/case-studies/case-study-types";
import { listP7First5CaseStudySlugs } from "@/lib/features/case-studies/case-study-p7-first-5";
import { listPublishedCaseStudySlugs } from "@/lib/features/case-studies/published-case-study-locale";

export const CASE_STUDY_REGISTRY: readonly CaseStudyEntry[] = [
  {
    slug: "representative-cnc-job-shop",
    sector: "cnc",
    sectorLabel: "CNC / Machine Shop",
    title: "Representative CNC machine shop scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "A job shop prices spindle time and material but leaves programming, setup, and expected downtime out of the quick quote — the bid looks healthy until hidden machine minutes erode margin.",
    toolSlug: "cnc-quote-risk-analyzer",
    toolTitle: "CNC Quote Risk Analyzer",
    inputSummary: [
      "Machine rate $92/h, planned run 14 h, expected downtime 2.1 h",
      "Material $680, tooling wear $95, scrap allowance 4%",
      "Target margin 20%",
    ],
    hiddenLoss:
      "Setup/programming minutes and non-productive downtime are not loaded into the customer-facing quote — roughly $290–$340 per job in this illustrative input set.",
    calculationResult:
      "Modeled loaded job cost ~$2,180 vs a $1,920 quote — about a 12-point gap versus the 20% target margin floor (representative model output only).",
    calculationLogic:
      "Direct machine and material cost loaded with downtime, scrap, and tooling buffers; minimum safe price computed at the entered target margin.",
    methodologyNote:
      "SectorCalc's governed premium engine applies deterministic inputs → formula pipeline → threshold read. This scenario uses synthetic numbers to show decision structure only.",
    lossType: "schedule_delay",
    lossTypeLabel: "Setup, programming & downtime leak",
    suggestedAction:
      "Reprice or tighten scope if the customer offer sits below the modeled safe floor before accepting the lot.",
    expectedImpact:
      "Illustrative per-job margin pressure in the modeled band above — not a measured client outcome.",
    assumptions: [
      "Machine rate includes operator burden as entered",
      "Scrap and downtime hours are user estimates",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-construction-bid-margin",
    sector: "construction",
    sectorLabel: "Construction / Bid Margin",
    title: "Representative construction bid margin scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "A subcontractor prices labor and materials on the base bid but under-reserves for mobilization, inspection cycles, and schedule slip — margin looks intact on paper until field burn catches up.",
    toolSlug: "change-order-impact-analyzer",
    toolTitle: "Change Order Impact Analyzer",
    inputSummary: [
      "Base contract $620,000, bid margin target 18%",
      "Crew 8, field burn $2,850/day, 12-day slip risk on critical path",
      "Allowance $18,000 for rework / re-inspection",
    ],
    hiddenLoss:
      "Delay burn and re-mobilization are excluded from the headline bid — modeled hidden exposure ~$34,000–$42,000 on this illustrative schedule input.",
    calculationResult:
      "Headline bid implies ~17.5% margin; loaded field burn and slip reserve pull modeled net margin toward ~11–13% vs the 18% target (representative simulation).",
    calculationLogic:
      "Contract value minus loaded direct cost, schedule-disruption reserve, and remobilization buffer; net margin compared to target band.",
    methodologyNote:
      "Deterministic construction overrun model with user-entered burn and slip days — illustrative framing for bid review, not a guarantee of field outcome.",
    lossType: "schedule_delay",
    lossTypeLabel: "Schedule & mobilization margin leak",
    suggestedAction:
      "Increase bid reserve or tighten schedule assumptions before tender submission if modeled net margin falls below target.",
    expectedImpact:
      "Modeled margin compression band on this synthetic bid — not verified project savings.",
    assumptions: [
      "Burn rate flat across slip days",
      "Rework allowance entered explicitly",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-cleaning-contract",
    sector: "cleaning",
    sectorLabel: "Commercial Cleaning",
    title: "Representative cleaning contract scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "A cleaning contractor quotes square meters and visit frequency but under-models supplies, travel between sites, and non-billable setup — monthly contracts turn thin after the first audit.",
    toolSlug: "office-cleaning-bid-optimizer",
    toolTitle: "Office Cleaning Bid Optimizer",
    inputSummary: [
      "Service area 9,500 m², frequency 5× weekly",
      "Hourly rate $26, supplies $380/mo, travel $210/mo",
      "Target margin 15%",
    ],
    hiddenLoss:
      "Supplies, travel, and setup minutes missing from the client proposal — roughly $590/mo in this illustrative overhead stack.",
    calculationResult:
      "Client budget $5,100/mo vs modeled safe monthly floor ~$5,920/mo — about 14% under the margin target before overhead (representative model).",
    calculationLogic:
      "Monthly labor from area × frequency × productivity, plus supplies and travel; minimum safe monthly bid at target margin.",
    methodologyNote:
      "Browser-side deterministic bid model with user productivity assumptions — decision-support only, not a contractual quote.",
    lossType: "margin_leak",
    lossTypeLabel: "Overhead & supply leak",
    suggestedAction:
      "Adjust monthly bid or reduce scope if the client cap sits below the modeled safe floor.",
    expectedImpact:
      "Illustrative monthly margin pressure range — not a verified account result.",
    assumptions: [
      "Productivity and visit frequency as entered",
      "Travel aggregated per route, not per site detail",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-logistics-route",
    sector: "logistics",
    sectorLabel: "Logistics / Route Loss",
    title: "Representative logistics route loss scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Dispatch prices planned miles and fuel but under-models deadhead return legs, stop-time burn, and route drift against the plan — lane margin erodes in aggregate.",
    toolSlug: "route-optimization-analyzer",
    toolTitle: "Route Optimization Analyzer",
    inputSummary: [
      "Planned distance 380 mi, actual 455 mi, fuel $3.95/gal",
      "6 stops, 22% deadhead share, driver cost $32/h",
    ],
    hiddenLoss:
      "Extra miles and stop-time not in the customer rate card — modeled overrun ~$165–$210 per run in this illustrative set.",
    calculationResult:
      "Planned lane cost ~$620 vs modeled actual ~$790 per run; at 36 runs/month the illustrative exposure band is ~$6.1k–$6.8k (representative model only).",
    calculationLogic:
      "Fuel and time cost from planned vs actual distance, stop count, and deadhead share; loss exposure vs planned economics.",
    methodologyNote:
      "Logistics route-loss model with user-entered drift — surfaces drivers for repricing review, not GPS-verified audit.",
    lossType: "route_deadhead",
    lossTypeLabel: "Route drift & deadhead exposure",
    suggestedAction:
      "Review lane pricing or stop sequencing if modeled drift exceeds your tolerance band.",
    expectedImpact:
      "Indicative monthly route-loss exposure band — representative scenario only.",
    assumptions: [
      "Fuel price and deadhead share as entered",
      "Stop time averaged per route",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-energy-compressor-peak",
    sector: "energy",
    sectorLabel: "Energy / Compressor & Peak",
    title: "Representative compressor leak & peak cost scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Facilities track kWh spend but treat compressor leaks and peak-tariff demand as fixed overhead — avoidable load stays invisible until the bill arrives.",
    toolSlug: "energy-compressor-leak-cost",
    toolTitle: "Compressor Leak Cost Calculator",
    toolRoute: "premium-schema",
    inputSummary: [
      "Baseline 52,000 kWh/mo, tariff $0.13/kWh",
      "Peak demand share 24%, modeled leak load ~90 CFM equivalent",
      "Operating hours 5,800 h/yr, target review threshold 10% avoidable load",
    ],
    hiddenLoss:
      "Leak load and peak-tariff overlap not separated in budgeting — modeled avoidable cost band ~$980–$1,240/mo on these inputs.",
    calculationResult:
      "Total bill ~$6,760/mo; modeled avoidable leak + peak component ~$1,100/mo mid-band (~16% of bill in this synthetic scenario).",
    calculationLogic:
      "Leak power draw converted to kWh cost, overlaid with peak-share tariff pressure; compared to user threshold for action prioritization.",
    methodologyNote:
      "Engineering-style estimate from entered leak proxy and tariff — verify with meter data and maintenance records before capital decisions.",
    lossType: "energy_demand",
    lossTypeLabel: "Compressor leak & peak demand",
    suggestedAction:
      "Prioritize leak survey and peak-shaving review on the highest modeled drivers before equipment upgrades.",
    expectedImpact:
      "Illustrative monthly avoidable-cost band — not measured facility savings.",
    assumptions: [
      "CFM leak proxy and tariff flat across month",
      "Peak share entered as percent of bill",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-welding-shop",
    sector: "welding",
    sectorLabel: "Welding",
    title: "Representative welding shop scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "A fab shop quotes labor and material but under-loads fit-up, rework, and gas consumables — visible margin erodes after callbacks.",
    toolSlug: "welding-bid-risk-analyzer",
    toolTitle: "Welding Bid Risk Analyzer",
    inputSummary: [
      "Material cost, labor hours, labor rate",
      "Gas/consumables, fit-up hours, rework risk %",
      "Target margin",
    ],
    hiddenLoss: "Fit-up, rework buffer, and consumables under-loaded in the headline weld quote.",
    calculationResult:
      "Modeled loaded weld cost exceeds quick quote by an illustrative margin gap — see tool for threshold read.",
    calculationLogic:
      "Base weld cost loaded with hidden multipliers for fit-up, rework buffer, and volatility band; minimum safe price at target margin.",
    methodologyNote:
      "Deterministic weld bid model with user rework risk — representative framing only.",
    lossType: "labor_rework",
    lossTypeLabel: "Rework & fit-up buffer",
    suggestedAction: "Compare quoted price to minimum safe floor before accepting the job.",
    expectedImpact: "Modeled waste exposure if quoted below P90 cost band — illustrative range only.",
    assumptions: [
      "Flat labor rate; consumables as entered",
      "Rework risk percent drives tolerance multiplier",
      CASE_STUDY_REPRESENTATIVE_LABEL,
    ],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-hvac-install",
    sector: "hvac",
    sectorLabel: "HVAC",
    title: "Representative HVAC project scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Equipment and duct costs are visible; callback risk and commissioning buffers often missing from bids.",
    toolSlug: "hvac-project-margin-guard",
    toolTitle: "HVAC Project Margin Guard",
    inputSummary: [
      "Equipment, ductwork, labor hours/rate",
      "Commissioning cost, callback risk %",
    ],
    hiddenLoss: "Callback and commissioning reserves omitted from install bid.",
    calculationResult:
      "Modeled net margin sits below target when callback reserve applied — illustrative tool output.",
    calculationLogic: "Equipment + labor + callback reserve; P90 floor and safe price at target margin.",
    methodologyNote: "HVAC margin guard with user callback risk — not field-verified performance.",
    lossType: "margin_leak",
    lossTypeLabel: "Callback & commissioning exposure",
    suggestedAction: "Hold margin band before signing install contract.",
    expectedImpact: "Modeled waste exposure if bid ignores callback buffer.",
    assumptions: [CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-plumbing-panel",
    sector: "plumbing-electrical",
    sectorLabel: "Plumbing / Electrical",
    title: "Representative panel & plumbing job scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Parts and labor quoted separately; inspection risk and callback trips compress net margin.",
    toolSlug: "plumbing-job-margin-verdict",
    toolTitle: "Plumbing Job Margin Verdict",
    inputSummary: ["Parts cost, labor hours, fixture count", "Callback risk %, target margin"],
    hiddenLoss: "Inspection and callback trips not reserved in fixture-price quote.",
    calculationResult:
      "Safe price floor above customer offer in modeled scenario — illustrative per-job read.",
    calculationLogic: "Direct cost stack with inspection/callback multipliers and safe price floor.",
    methodologyNote: "Deterministic service-job margin model — verify parts and labor locally.",
    lossType: "labor_rework",
    lossTypeLabel: "Callback & inspection risk",
    suggestedAction: "Reprice or reduce scope if quote below safe floor.",
    expectedImpact: "Illustrative per-job margin pressure range.",
    assumptions: [CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-sheet-metal-fab",
    sector: "sheet-metal",
    sectorLabel: "Sheet Metal",
    title: "Representative sheet metal quote scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem: "Scrap rate and programming time excluded from laser-cut quotes.",
    toolSlug: "sheet-metal-quote-risk-tool",
    toolTitle: "Sheet Metal Quote Risk Tool",
    inputSummary: [
      "Programming, setup, cut time, bends",
      "Material, scrap %, finishing, target margin",
    ],
    hiddenLoss: "Programming minutes and scrap allowance missing from fab package price.",
    calculationResult:
      "Scrap-adjusted material and programming load widen margin gap in modeled quote — illustrative.",
    calculationLogic:
      "Labor minutes + scrap-adjusted material + finishing; margin floor via governance oracle path.",
    methodologyNote: "Sheet metal quote risk with user scrap percent — representative only.",
    lossType: "material_scrap",
    lossTypeLabel: "Scrap & programming leak",
    suggestedAction: "Use safe quote floor before releasing fab package.",
    expectedImpact: "Modeled scrap-driven margin erosion — representative only.",
    assumptions: [CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-restaurant-menu",
    sector: "restaurant",
    sectorLabel: "Restaurant",
    title: "Representative menu margin scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem: "Menu price set from ingredient list alone; waste and prep variance ignored.",
    toolSlug: "menu-profit-leak-detector",
    toolTitle: "Menu Profit Leak Detector",
    inputSummary: ["Selling price, food cost, waste rate", "Target margin"],
    hiddenLoss: "Prep waste and yield loss excluded from menu price.",
    calculationResult:
      "Actual margin below target when waste buffer applied — illustrative menu read.",
    calculationLogic: "Loaded food cost with waste buffer; actual vs target margin verdict.",
    methodologyNote: "Menu margin model with user waste rate — not POS-verified.",
    lossType: "food_waste",
    lossTypeLabel: "Food waste & prep leak",
    suggestedAction: "Reprice item or adjust portion if margin below target band.",
    expectedImpact: "Modeled weekly margin leak range — illustrative.",
    assumptions: [CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-ecommerce-returns",
    sector: "ecommerce",
    sectorLabel: "E-commerce",
    title: "Representative return erosion scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem: "Product margin looks healthy until return rate and handling erode net profit.",
    toolSlug: "return-profit-erosion-tool",
    toolTitle: "Return Profit Erosion Tool",
    inputSummary: ["Product price, cost, return rate %", "Expected revenue, target margin"],
    hiddenLoss: "Return handling and restock cost not in SKU margin view.",
    calculationResult:
      "Return-adjusted net margin below headline product margin — illustrative erosion band.",
    calculationLogic: "Return-adjusted net profit and margin vs target; erosion drivers surfaced.",
    methodologyNote: "Return erosion model from user return rate — not marketplace verified.",
    lossType: "return_erosion",
    lossTypeLabel: "Return & handling erosion",
    suggestedAction: "Adjust pricing or return policy if net margin below threshold.",
    expectedImpact: "Estimated monthly profit erosion range — synthetic scenario.",
    assumptions: [CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-change-order-impact",
    sector: "construction",
    sectorLabel: "Construction",
    title: "Representative change order scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Change orders are approved on scope alone; schedule disruption, re-mobilization, and margin dilution are not priced in.",
    toolSlug: "change-order-impact-analyzer",
    toolTitle: "Change Order Impact Analyzer",
    inputSummary: [
      "Original contract value, change order value",
      "Added days, crew size, daily burn",
      "Target margin",
    ],
    hiddenLoss: "Schedule slip and remobilization excluded from change-order price.",
    calculationResult:
      "Cost-only change pricing compresses net margin vs target in modeled scenario.",
    calculationLogic:
      "Direct change cost loaded with schedule-disruption and re-mobilization buffers; net margin impact vs target band.",
    methodologyNote: "Change-order impact model — illustrative schedule inputs only.",
    lossType: "schedule_delay",
    lossTypeLabel: "Schedule disruption leak",
    suggestedAction: "Reprice the change order if net margin falls below the target floor.",
    expectedImpact: "Modeled margin dilution range from delay exposure — illustrative only.",
    assumptions: ["User-provided schedule and burn rate", CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-energy-efficiency",
    sector: "energy",
    sectorLabel: "Energy",
    title: "Representative energy efficiency scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Facilities track energy spend but not avoidable demand from idle load, off-spec operation, and peak tariff exposure.",
    toolSlug: "energy-efficiency-report",
    toolTitle: "Energy Efficiency Report",
    inputSummary: [
      "Baseline consumption, tariff, peak share",
      "Idle load %, target reduction",
    ],
    hiddenLoss: "Idle load and peak tariff share treated as fixed cost.",
    calculationResult:
      "Avoidable demand band modeled against baseline — illustrative annual exposure range.",
    calculationLogic:
      "Baseline demand split into avoidable vs structural load; indicative savings band against reference intensity.",
    methodologyNote: "Energy peak-cost model — confirm with meter data before upgrades.",
    lossType: "energy_demand",
    lossTypeLabel: "Avoidable energy demand",
    suggestedAction: "Prioritize the highest avoidable-demand drivers before capital upgrades.",
    expectedImpact: "Estimated annual energy cost exposure range — representative only.",
    assumptions: ["Tariff and consumption as entered", CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
  {
    slug: "representative-cbam-compliance",
    sector: "sustainability",
    sectorLabel: "Sustainability / Compliance",
    title: "Representative CBAM exposure scenario",
    scenarioKind: "representative_scenario",
    evidenceLevel: "representative-scenario",
    problem:
      "Exporters price product cost but overlook embedded-carbon cost exposure under carbon border mechanisms.",
    toolSlug: "cbam-compliance-verdict",
    toolTitle: "CBAM Compliance Verdict",
    inputSummary: [
      "Product tonnage, embedded emissions factor",
      "Carbon price, exported volume",
    ],
    hiddenLoss: "Embedded-carbon cost not in export price build-up.",
    calculationResult:
      "Carbon cost exposure band modeled from tonnage × factor × price — illustrative verdict.",
    calculationLogic:
      "Embedded-carbon cost estimate from tonnage × emissions factor × carbon price; exposure verdict vs margin.",
    methodologyNote: "CBAM exposure estimator — not a regulatory determination.",
    lossType: "carbon_cost",
    lossTypeLabel: "Embedded carbon cost exposure",
    suggestedAction: "Factor embedded-carbon cost into export pricing before committing volumes.",
    expectedImpact: "Indicative carbon cost exposure range — not a regulatory determination.",
    assumptions: ["Emissions factor and carbon price as entered", CASE_STUDY_REPRESENTATIVE_LABEL],
    disclaimer: CASE_STUDY_DISCLAIMER,
  },
];

export function listCaseStudies(): readonly CaseStudyEntry[] {
  return CASE_STUDY_REGISTRY;
}

export function listP7FeaturedCaseStudies(): readonly CaseStudyEntry[] {
  const order = listP7First5CaseStudySlugs();
  return order
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((entry): entry is CaseStudyEntry => entry !== undefined);
}

export function getCaseStudyBySlug(slug: string): CaseStudyEntry | undefined {
  return CASE_STUDY_REGISTRY.find((entry) => entry.slug === slug);
}

export function listCaseStudySlugs(): readonly string[] {
  return CASE_STUDY_REGISTRY.map((entry) => entry.slug);
}

export function listAllCaseStudySlugs(): readonly string[] {
  return [...listPublishedCaseStudySlugs(), ...listCaseStudySlugs()];
}
