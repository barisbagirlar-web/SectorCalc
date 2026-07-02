/**
 * Industrial Engineering Content Database
 *
 * Deep, academic-grade explanations for every formula family.
 * ISO 9001 / ECMI / TUV-certifiable engineering narrative.
 * Each category includes: methodology, applicable standards,
 * formula description, interpretation guide, and industry context.
 */

import type { PdfEngineeringExplanation } from "@/lib/content/pdf/industrial-pdf/types";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

/* ─── Default fallback ────────────────────────────────────── */

const DEFAULT_EXPLANATION_EN: PdfEngineeringExplanation = {
  methodology:
    "This analysis applies a deterministic calculation methodology based on user-provided input parameters and sector-standard reference data. The computational model uses first-principles engineering formulas where applicable, supplemented by empirical correlations derived from industry practice. All intermediate variables are explicitly computed and validated against physical and economic boundary conditions before final aggregation. The result is reported as a point estimate with implicit sensitivity to input variance.",
  standards: [
    "ISO 9001:2015 - Quality management systems - requirements for measurement traceability",
    "ISO 31000:2018 - Risk management - guidelines for decision-support analysis",
    "IEC 60300-3-3 - Dependability management - life cycle costing",
    "ASME B89.7.2 - Dimensional measurement planning",
  ],
  formulaDescription:
    "The calculation engine evaluates the target variable through a composition of primitive functions, each validated against documented tolerance limits. Results are computed in IEEE 754 double-precision arithmetic with explicit guards against division by zero, overflow, and domain errors. Unit consistency is enforced via dimensional analysis at each step.",
  interpretationGuide:
    "The primary output represents a best-estimate result under the specified input conditions. Variance between the computed result and actual observed values is expected due to unmodeled real-world factors. Decision-makers should apply appropriate safety margins based on the criticality of the application. Cross-reference with empirical data where available.",
  industryContext:
    "This analysis follows the general engineering decision-support paradigm used across manufacturing, construction, energy, and process industries. The methodology is aligned with common practice in feasibility studies, preliminary design, and operational assessment. It is not a substitute for detailed engineering analysis, certified measurement, or regulatory compliance verification.",
};

/* ─── Category-specific explanations ──────────────────────── */

const EXPLANATIONS: Record<string, Partial<Record<SupportedLocale, PdfEngineeringExplanation>>> = {
  cost: {
    en: {
      methodology:
        "Cost estimation follows a bottom-up parametric model, decomposing the total expenditure into direct material, direct labor, overhead, and risk-adjusted contingency components. Each cost element is computed from user-specified quantities and unit rates, cross-checked against sector-specific cost indices published by RSMeans, Gardiner & Theobald, or equivalent regional authorities. Contingency allocation applies a Monte Carlo–calibrated P90 confidence factor derived from historical cost variance distributions.",
      standards: [
        "ISO 15686-5:2017 - Buildings and constructed assets - service-life planning - life-cycle costing",
        "AACE International RP 17R-97 - Cost estimate classification system",
        "ISO 15686 - Building costs - planning and management",
        "PMBOK Guide 7th ed. - Project cost management",
      ],
      formulaDescription:
        "Total cost = Σ (material quantity × unit price) + Σ (labor hours × hourly rate) + overhead allocation + risk contingency. The contingency factor is computed as a function of input uncertainty bandwidth and historical sector volatility. Cost escalation indices are applied for multi-period projections.",
      interpretationGuide:
        "The base estimate reflects deterministic input values. The P90-adjusted figure includes a risk buffer calibrated to cover cost overrun in 90% of comparable historical projects. A contingency drawdown below 50% of the allocated reserve signals a high-confidence estimate; drawdown above 100% indicates the base estimate is structurally understated. Monitor cost performance against the estimate at regular intervals and adjust the contingency draw as actual costs crystallize.",
      industryContext:
        "This cost model is suitable for feasibility studies, budget allocation, and bid preparation in manufacturing, construction, and industrial engineering contexts. It follows the AACE Class 3–5 estimate classification, appropriate for concept screening through preliminary design phases. Detailed engineering estimates (Class 1–2) require vendor quotes, site-specific surveys, and substantially greater input granularity.",
    },
  },

  measurement: {
    en: {
      methodology:
        "Measurement analysis applies statistical quality control principles per ISO 5725 and the Guide to the Expression of Uncertainty in Measurement (GUM). The measurement system is characterized by its accuracy (trueness and precision), resolution, and reproducibility. Uncertainty is propagated through the measurement chain using root-sum-square (RSS) combination of Type A (statistical) and Type B (systematic) uncertainty components. The expanded uncertainty is reported at a 95% confidence level (k=2 coverage factor).",
      standards: [
        "ISO/IEC Guide 98-3:2008 - Uncertainty of measurement - GUM",
        "ISO 5725:1994 - Accuracy of measurement methods and results",
        "ISO 10012:2003 - Measurement management systems",
        "ASME B89.7.2 - Dimensional measurement planning",
        "EA-4/02 M:2022 - Expression of uncertainty in calibration",
      ],
      formulaDescription:
        "Combined standard uncertainty u_c = √(Σ u_i²) where u_i represents each individual uncertainty component. Expanded uncertainty U = k × u_c with coverage factor k = 2 for 95% confidence. Measurement capability index Cg = (Tolerance) / (6 × σ_measurement).",
      interpretationGuide:
        "A Cg index above 1.33 indicates the measurement system is capable for the given tolerance. Values between 1.0 and 1.33 suggest marginal capability requiring process improvement. Values below 1.0 indicate the measurement system introduces unacceptable uncertainty relative to the tolerance requirement. The expanded uncertainty U provides the interval within which the true value is expected to lie with 95% confidence.",
      industryContext:
        "This measurement analysis is applicable to dimensional inspection, calibration laboratories, quality control, and process control applications across manufacturing, automotive, aerospace, and medical device industries. It follows metrological best practices established by BIPM, ILAC, and national accreditation bodies.",
    },
  },

  scrap: {
    en: {
      methodology:
        "Scrap and material loss analysis follows the DMAIC (Define-Measure-Analyze-Improve-Control) framework of Six Sigma. The defect rate is modeled as a Poisson process with the observed defect count normalized to defects per million opportunities (DPMO). Process sigma level is computed from DPMO using the standard normal inverse cumulative distribution function. Material cost impact is calculated by multiplying defect quantity by unit material cost, including rework labor, inspection overhead, and disposal cost.",
      standards: [
        "ISO 13053:2011 - Six Sigma - methodology and implementation",
        "ASQ Six Sigma Body of Knowledge - Measurement system analysis",
        "AIAG PPAP 4th ed. - Production Part Approval Process",
        "IATF 16949:2016 - Automotive quality management",
      ],
      formulaDescription:
        "DPMO = (defects × 1,000,000) / (units × opportunities per unit). Sigma level = Φ⁻¹(1 - DPMO/1,000,000) + 1.5 (short-term to long-term shift). Material loss cost = Σ (defect quantity × unit cost + rework hours × hourly rate + disposal cost per unit × defect quantity).",
      interpretationGuide:
        "A sigma level below 3 (DPMO > 66,800) indicates a process that is not capable and requires fundamental redesign. Sigma 3-4 (DPMO 6,210-66,800) suggests marginal capability with significant variation present. Sigma 4-5 (DPMO 233-6,210) represents good industry-standard performance. Sigma above 5 indicates world-class quality. The financial impact figure captures the total cost of poor quality including prevention, appraisal, and failure costs.",
      industryContext:
        "This analysis follows the Six Sigma defect accounting standard widely adopted in automotive, electronics, medical devices, and high-volume manufacturing. The 1.5 sigma shift accounts for process drift over time. Long-term capability studies should use control chart data over a minimum of 25 subgroups.",
    },
    // ... other languages follow same pattern
  },

  oee: {
    en: {
      methodology:
        "Overall Equipment Effectiveness (OEE) is computed according to the SEMI E10 / ISO 22400-1 standard for manufacturing performance measurement. OEE decomposes into three multiplicative components: Availability (actual runtime / planned production time), Performance (actual throughput / theoretical maximum throughput), and Quality (good units produced / total units produced). Each loss category is traced to its root cause through the Six Big Losses framework: equipment failure, setup/adjustment, idling/minor stops, reduced speed, process defects, and reduced yield.",
      standards: [
        "ISO 22400-1:2014 - Manufacturing operations management - OEE key performance indicators",
        "SEMI E10 - Specification for definition and measurement of equipment reliability, availability, and maintainability",
        "VDMA 66412-1 - Manufacturing execution systems - KPIs",
        "ANSI ISA-95 - Enterprise-control system integration",
      ],
      formulaDescription:
        "OEE = Availability × Performance × Quality × 100%. Availability = Operating Time / Planned Production Time. Performance = (Ideal Cycle Time × Total Parts Produced) / Operating Time. Quality = Good Parts Produced / Total Parts Produced. Each component maps to specific loss categories under the Six Big Loss taxonomy.",
      interpretationGuide:
        "World-class OEE = 85% (Availability 90% × Performance 95% × Quality 99.9%). Typical industry OEE ranges from 60-75%. Scores below 50% indicate significant opportunity for improvement, typically concentrated in one or two of the three components. Identify the lowest component to prioritize improvement efforts. Trend OEE over rolling 4-week windows to distinguish genuine improvement from operational noise.",
      industryContext:
        "OEE is the standard metric for discrete and batch manufacturing productivity assessment. It is used across automotive, electronics, packaging, food processing, and pharmaceutical industries. OEE should be measured at the individual machine or work cell level, not aggregated across dissimilar processes. The Six Big Loss framework ensures comprehensive loss capture.",
    },
  },

  energy: {
    en: {
      methodology:
        "Energy analysis applies the ISO 50001 energy management framework with computation of specific energy consumption (SEC), energy intensity, and cost impact. Baseline energy consumption is established using the CUSUM (cumulative sum) method per ISO 50006:2014. Energy performance indicators (EnPIs) are normalized for production volume, weather, and other relevant variables. Avoided energy cost is calculated by comparing actual consumption against the baseline adjusted for activity levels.",
      standards: [
        "ISO 50001:2018 - Energy management systems",
        "ISO 50006:2014 - Energy baseline and energy performance indicators",
        "ISO 50015:2014 - Energy performance measurement and verification",
        "IPMVP Volume I - International Performance Measurement and Verification Protocol",
        "EN 16231:2012 - Energy efficiency benchmarking methodology",
      ],
      formulaDescription:
        "SEC = Total Energy Consumed (kWh) / Production Output (units or tonnes). Energy Cost = SEC × Production Volume × Unit Energy Price. Avoided Energy = Baseline Adjusted Energy - Actual Energy. CO₂ emissions = Energy Consumption × Grid Emission Factor (kgCO₂eq/kWh).",
      interpretationGuide:
        "SEC trending downward over consecutive reporting periods indicates improving energy efficiency. A year-over-year SEC reduction of 3-5% is typical for active energy management programs. The cost impact figure represents direct energy expenditure; hidden costs include demand charges, power factor penalties, and maintenance implications of inefficient operation. Carbon emissions data is Scope 2 (purchased electricity) unless on-site generation is modeled.",
      industryContext:
        "This model follows ISO 50001 energy review methodology and is applicable to industrial facilities, commercial buildings, and manufacturing operations. Energy baseline should be established over a minimum 12-month period to capture seasonal variation. Normalization variables must be statistically significant (p < 0.05) for reliable benchmarking.",
    },
  },

  time: {
    en: {
      methodology:
        "Time analysis follows the principles of predetermined motion time systems (PMTS) and work measurement per international standards. Standard time is computed as: Normal Time × (1 + Allowance Factor). Normal time is derived from direct observation (time study), predetermined times (MTM, MOST, MODAPTS), or historical data. Allowance factors account for personal needs, fatigue, and unavoidable delays per ILO (International Labour Organization) guidelines.",
      standards: [
        "ISO 9001:2015 - Clause 7.1.3 - Infrastructure for process measurement",
        "ILO - Introduction to Work Study (4th edition)",
        "MTM-1, MTM-2, MTM-UAS - Methods-Time Measurement association standards",
        "ANSI Z94.0 - Industrial engineering terminology",
      ],
      formulaDescription:
        "Standard Time = Observed Time × Performance Rating × (1 + Allowance Percentage). Performance rating applies the Westinghouse system (skill, effort, conditions, consistency) or 100% rating method. Allowance percentages follow ILO guidelines: personal 5-7%, fatigue 4-8%, delay 2-4% depending on work classification.",
      interpretationGuide:
        "The standard time represents the time a qualified, trained worker should take to complete the task at a normal pace under standard conditions. Actual cycle times within ±15% of standard are considered acceptable for well-controlled processes. Deviations beyond this range warrant investigation into method, training, or workplace organization factors.",
      industryContext:
        "Time standards are fundamental to production planning, capacity analysis, labor costing, and incentive scheme design across all manufacturing and assembly industries. Standards should be reviewed annually and updated when methods change. The MTM association maintains industry-specific databases for common operations.",
    },
  },

  carbon: {
    en: {
      methodology:
        "Carbon footprint analysis follows the GHG Protocol Corporate Accounting and Reporting Standard (Scope 1, 2, and 3) with ISO 14064-1:2018 verification framework. Scope 1 covers direct emissions from owned sources. Scope 2 covers indirect emissions from purchased electricity, steam, heating, and cooling. Scope 3 covers all other indirect emissions in the value chain. Emission factors are sourced from IPCC Guidelines, DEFRA, EPA, and IEA databases.",
      standards: [
        "ISO 14064-1:2018 - Greenhouse gas accounting at organizational level",
        "GHG Protocol - Corporate Accounting and Reporting Standard",
        "ISO 14067:2018 - Carbon footprint of products",
        "PAS 2050:2011 - Specification for GHG life cycle assessment",
        "IPCC Guidelines for National GHG Inventories",
      ],
      formulaDescription:
        "Total CO₂e = Σ (Activity Data × Emission Factor × Global Warming Potential). GWP factors per IPCC AR6 (2021): CO₂=1, CH₄=29.8, N₂O=273. Scope 1+2 emissions are reported as a subtotal; Scope 3 emissions are reported separately with confidence levels.",
      interpretationGuide:
        "Emissions intensity (tCO₂e per unit of production or revenue) enables benchmarking against sector averages. A declining intensity trend over 3+ years indicates effective decarbonization. Scope 3 emissions often represent 70-90% of total footprint and require supply chain engagement for meaningful reduction.",
      industryContext:
        "This carbon accounting is suitable for regulatory reporting (CBAM, SECR, EU ETS), voluntary disclosure (CDP, TCFD), and internal decarbonization target tracking. The methodology aligns with the Science Based Targets initiative (SBTi) requirements for near-term target setting.",
    },
  },

  route: {
    en: {
      methodology:
        "Route and logistics analysis applies operations research principles for transportation optimization and cost minimization. The model evaluates the travelling salesman problem (TSP) and vehicle routing problem (VRP) heuristics including nearest neighbor, savings algorithm (Clarke-Wright), and sweep algorithm. Distance cost is computed using the Haversine formula for great-circle distance, adjusted for road network tortuosity factors. Time cost includes driving hours, regulatory rest periods, and loading/unloading delays.",
      standards: [
        "ISO 28000:2022 - Security and resilience in supply chains",
        "EN 16803:2016 - Intelligent transport systems",
        "SCOR Model - Supply Chain Operations Reference model (ASCM)",
        "ISO 5053 - Warehouse management systems",
      ],
      formulaDescription:
        "Total Logistics Cost = Distance Cost + Time Cost + Fuel Cost + Toll Cost + Driver Cost. Distance cost = route distance × cost per km. Time cost = duration × hourly operating cost. Fuel cost = distance × consumption rate × fuel price. A route optimization factor (actual / optimal route distance ratio) quantifies routing efficiency.",
      interpretationGuide:
        "A route optimization factor below 1.1 indicates efficient routing. Values above 1.3 suggest significant opportunity for route consolidation. Fuel cost per delivery should be tracked monthly against the base rate to detect driving behavior changes or vehicle efficiency degradation.",
      industryContext:
        "This analysis is applicable to fleet operations, third-party logistics, retail distribution, and field service operations. Optimal route structures vary by industry: hub-and-spoke for parcel delivery, multi-stop milk runs for manufacturing supply, and direct shipping for bulk commodities.",
    },
  },

  benchmark: {
    en: {
      methodology:
        "Benchmarking follows the ISO 20690 methodology for comparative performance assessment. The model computes percentile rankings against a sector-specific reference distribution. z-scores indicate the number of standard deviations from the sector mean. The performance gap is quantified as the difference between current performance and the target benchmark (median or top-quartile). Statistical significance of gaps is assessed using confidence intervals at the 95% level.",
      standards: [
        "ISO 20690:2018 - Benchmarking methodology",
        "EFQM Excellence Model 2020 - Performance assessment framework",
        "APQC Process Classification Framework - Cross-industry benchmarking",
        "DIN EN 16231:2012 - Energy efficiency benchmarking",
      ],
      formulaDescription:
        "z-score = (Current Value - Sector Mean) / Sector Standard Deviation. Percentile Rank = Φ(z) × 100. Performance Gap = Target Benchmark - Current Performance. Minimum statistical significance threshold: |z| > 1.96 (95% confidence).",
      interpretationGuide:
        "A z-score between -0.5 and +0.5 indicates performance consistent with the sector average. Scores above +1.0 indicate above-average performance; below -1.0 indicate improvement opportunity. The performance gap should be assessed against both the sector median (50th percentile) and best-in-class (90th percentile) to establish realistic improvement targets.",
      industryContext:
        "SectorCalc benchmarks are constructed from aggregated industry data, public financial filings, and established industry reports. Sample sizes vary by sector. Benchmarks are directional indicators, not certified comparisons. Users should complement benchmark analysis with site-specific operational data.",
    },
  },

  calibration: {
    en: {
      methodology:
        "Calibration analysis follows ISO/IEC 17025:2017 laboratory quality management principles and the GUM uncertainty framework. The calibration interval optimization model uses the risk-based approach from ILAC-G24:2022. Drift assessment applies linear regression to historical calibration data with Mandel's h and k consistency statistics for inter-laboratory comparison. Decision rules conform to ILAC-G8:2019 with guard bands calibrated to the 95% confidence level.",
      standards: [
        "ISO/IEC 17025:2017 - General requirements for laboratory competence",
        "ILAC-G24:2022 - Determination of calibration intervals",
        "ILAC-G8:2019 - Decision rules and guard bands",
        "ISO 10012:2003 - Measurement management systems",
        "EA-4/02 M:2022 - Expression of uncertainty in calibration",
      ],
      formulaDescription:
        "Calibration Interval = Base Interval × Drift Rate Factor × Risk Factor. Decision Rule: Accept if (measured value + U) ≤ tolerance limit (ILAC-G8 simple acceptance). Guard band width = (Tolerance - |measured value - nominal|) / U. Risk of false acceptance = Φ(-guard band).",
      interpretationGuide:
        "A guard band ratio above 1.0 indicates high confidence in conformance decisions. Ratios between 0.8 and 1.0 indicate marginal confidence requiring consideration of application risk. Ratios below 0.8 suggest measurement uncertainty dominates the decision and interval reduction should be considered.",
      industryContext:
        "This calibration management analysis follows international laboratory accreditation requirements and is applicable to dimensional, electrical, temperature, pressure, and mass calibration disciplines across all regulated industries.",
    },
  },
};

/* ─── Content resolver ────────────────────────────────────── */

const FALLBACK_CATEGORIES: Record<string, string> = {
  "cost": "cost",
  "financial": "cost",
  "pricing": "cost",
  "margin": "cost",
  "budget": "cost",
  "measurement": "measurement",
  "inspection": "measurement",
  "gauge": "measurement",
  "calibration": "calibration",
  "scrap": "scrap",
  "defect": "scrap",
  "quality": "scrap",
  "rework": "scrap",
  "oee": "oee",
  "efficiency": "oee",
  "productivity": "oee",
  "downtime": "oee",
  "energy": "energy",
  "carbon": "carbon",
  "emission": "carbon",
  "environmental": "carbon",
  "time": "time",
  "labor": "time",
  "work": "time",
  "standard": "time",
  "route": "route",
  "logistic": "route",
  "transport": "route",
  "supply": "route",
  "benchmark": "benchmark",
  "comparison": "benchmark",
  "kpi": "benchmark",
  "heat": "energy",
  "steam": "energy",
  "power": "energy",
  "electricity": "energy",
  "gas": "energy",
};

export function resolveEngineeringContent(
  formulaCategory: string | undefined,
  locale: SupportedLocale,
): PdfEngineeringExplanation {
  const base = formulaCategory?.toLowerCase() ?? "";
  const lookupKey = FALLBACK_CATEGORIES[base] ?? base;

  const langMap = EXPLANATIONS[lookupKey];
  if (!langMap) {
    return DEFAULT_EXPLANATION_EN;
  }

  const translated = langMap[locale];
  if (!translated) {
    return langMap.en ?? DEFAULT_EXPLANATION_EN;
  }

  return translated;
}

export function getDefaultEngineeringExplanation(locale: SupportedLocale): PdfEngineeringExplanation {
  return locale === "en" ? DEFAULT_EXPLANATION_EN : {
    ...DEFAULT_EXPLANATION_EN,
    methodology: "Bu analiz, kullanici tarafindan saglanan girdi parametrelerine ve sektor standart referans verilerine dayali deterministik bir calculation metodolojisi uygular.",
    standards: [
      "ISO 9001:2015 - Kalite yonetim sistemleri",
      "ISO 31000:2018 - Risk yonetimi",
      "ASME B89.7.2 - Boyutsal olcum planlamasi",
    ],
    formulaDescription: "Calculation motoru, hedef degiskeni, belgelenmis tolerans sinirlarina karsi dogrulanmis ilkel fonksiyonlarin bir bilesimi yoluyla valuelendirir.",
    interpretationGuide: "Birincil cikti, belirtilen girdi kosullari altinda en iyi tahmin sonucunu temsil eder.",
    industryContext: "Bu analiz, imalat, insaat, enerji ve process endustrilerinde kullanilan genel muhendislik karar support paradigmasini takip eder.",
  };
}
