export type AuthorityGuideCategory =
  | "manufacturing"
  | "construction"
  | "logistics"
  | "food-retail"
  | "energy-carbon"
  | "agriculture"
  | "finance-business"
  | "conversion";

export type AuthorityGuide = {
  readonly slug: string;
  readonly localeKey: string;
  readonly category: AuthorityGuideCategory;
  readonly title: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly h1: string;
  readonly featuredQuestion: string;
  readonly featuredAnswer: string;
  readonly sections: readonly {
    readonly heading: string;
    readonly body: string;
    readonly bullets?: readonly string[];
  }[];
  readonly relatedFreeToolSlugs: readonly string[];
  readonly relatedPremiumSchemaSlugs: readonly string[];
  readonly faq: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
};

export const AUTHORITY_GUIDES: readonly AuthorityGuide[] = [
  {
    slug: "how-to-calculate-manufacturing-cost",
    localeKey: "guides.manufacturingCost",
    category: "manufacturing",
    title: "How to Calculate Manufacturing Cost",
    seoTitle: "How to Calculate Manufacturing Cost — Unit, Labor & Machine Rate Guide",
    seoDescription:
      "Learn how to calculate manufacturing cost from unit cost, machine hour rate and labor time. Free calculators and premium hidden-loss analyzers for shop-floor decisions.",
    h1: "How to calculate manufacturing cost",
    featuredQuestion: "How do you calculate manufacturing cost?",
    featuredAnswer:
      "Manufacturing cost combines direct material, direct labor and machine burden for each unit or job. Start with material per unit, add labor hours multiplied by shop rate, then allocate machine time at your hourly machine rate. SectorCalc free calculators estimate unit cost, machine time and hour rate; premium analyzers surface hidden setup loss, scrap and capacity exposure before you quote or schedule.",
    sections: [
      {
        heading: "What counts as manufacturing cost?",
        body:
          "Manufacturing cost is the fully loaded cost to produce one unit or complete one job before overhead allocation and profit. Direct material, direct labor and machine burden are the three pillars most shops track daily.",
        bullets: [
          "Direct material: raw stock, consumables and purchased parts tied to the job",
          "Direct labor: setup, run and inspection hours at loaded wage rates",
          "Machine burden: spindle or press hours at an hourly machine rate",
        ],
      },
      {
        heading: "How do you calculate unit manufacturing cost?",
        body:
          "Divide total job cost by good units produced. When scrap or rework is significant, use good output only so the unit cost reflects what you actually ship.",
        bullets: [
          "Unit cost = (material + labor + machine) ÷ good units",
          "Add setup time once per batch, then spread across batch quantity",
          "Compare unit cost to quoted price before accepting repeat work",
        ],
      },
      {
        heading: "Why machine hour rate matters",
        body:
          "Machine hour rate converts spindle or press time into dollars. Underestimating run time or burden rate is a common source of margin leak on CNC, fabrication and assembly jobs.",
      },
      {
        heading: "When to move from estimate to decision report",
        body:
          "Use free calculators for quick sanity checks during quoting or scheduling. Use a premium analyzer when the estimate affects pricing, capacity planning or a management sign-off and you need hidden drivers, thresholds and export-ready output.",
      },
      {
        heading: "Related SectorCalc tools",
        body:
          "Start with free unit cost, machine hour rate and machine time calculators. Escalate to premium CNC OEE or tool-wear analyzers when capacity loss or recurring scrap threatens margin.",
      },
    ],
    relatedFreeToolSlugs: [
      "unit-cost-calculator",
      "machine-hour-rate-calculator",
      "machine-time-calculator",
      "scrap-rate-calculator",
    ],
    relatedPremiumSchemaSlugs: ["cnc-oee-loss", "cnc-tool-wear-cost"],
    faq: [
      {
        question: "What is included in manufacturing cost?",
        answer:
          "Direct material, direct labor and machine burden tied to production. Overhead, sales and admin are usually allocated separately unless your shop uses a fully absorbed standard cost.",
      },
      {
        question: "How is machine hour rate calculated?",
        answer:
          "Divide annual machine ownership and operating costs by productive hours available per year. Include power, maintenance, tooling reserve and operator-attended time where applicable.",
      },
      {
        question: "Are SectorCalc manufacturing calculators free?",
        answer:
          "Yes. Free manufacturing calculators run in your browser with no sign-up. Premium analyzers add hidden-loss diagnostics and export-ready decision reports on paid access.",
      },
      {
        question: "When should I use a premium manufacturing analyzer?",
        answer:
          "Use premium when the estimate affects a quote, schedule or investment decision and you need threshold checks, hidden drivers and a report you can share with management.",
      },
    ],
  },
  {
    slug: "what-is-oee-and-how-to-calculate-it",
    localeKey: "guides.oee",
    category: "manufacturing",
    title: "What Is OEE and How to Calculate It",
    seoTitle: "What Is OEE? How to Calculate Overall Equipment Effectiveness",
    seoDescription:
      "Learn what OEE means and how to calculate availability, performance and quality. Free OEE calculator plus premium CNC capacity loss analyzer on SectorCalc.",
    h1: "What is OEE and how to calculate it",
    featuredQuestion: "What is OEE and how do you calculate it?",
    featuredAnswer:
      "OEE measures how effectively a machine or production line turns planned time into good output. It is calculated by multiplying availability, performance and quality. A lower OEE usually points to downtime, speed loss, scrap or setup problems that reduce true production capacity.",
    sections: [
      {
        heading: "What does OEE measure?",
        body:
          "OEE compresses downtime, slow cycles and scrap into one percentage. World-class shops often target 85% OEE, but many CNC and fabrication lines operate closer to 50–65% without realizing the revenue impact.",
      },
      {
        heading: "How do you calculate OEE step by step?",
        body:
          "Collect planned production time, downtime, ideal cycle time, actual output and scrap count for the same period.",
        bullets: [
          "Availability = (planned time − downtime) ÷ planned time",
          "Performance = (ideal cycle time × total units) ÷ run time",
          "Quality = good units ÷ total units",
          "OEE = availability × performance × quality",
        ],
      },
      {
        heading: "What causes low OEE on shop floors?",
        body:
          "Micro-stops, slow feeds, tool changes, first-piece scrap and unplanned maintenance are common drivers. OEE highlights where to investigate before adding shifts or capital equipment.",
      },
      {
        heading: "OEE versus TEEP and utilization",
        body:
          "Utilization measures scheduled use of calendar time. OEE measures productive effectiveness during scheduled production. TEEP extends the view to all calendar hours including unscheduled time.",
      },
      {
        heading: "When the basic calculator is not enough",
        body:
          "Use the free OEE calculator for shift-level checks. Open the premium CNC OEE loss analyzer when low OEE threatens quoted margin, delivery dates or capacity plans and you need hidden drivers, thresholds and export-ready output.",
      },
    ],
    relatedFreeToolSlugs: [
      "oee-calculator",
      "machine-time-calculator",
      "cnc-cycle-time-calculator",
      "scrap-rate-calculator",
    ],
    relatedPremiumSchemaSlugs: ["cnc-oee-loss"],
    faq: [
      {
        question: "What is a good OEE score?",
        answer:
          "Many discrete manufacturing lines operate between 55% and 75% OEE. World-class benchmarks near 85% are aspirational; compare against your own baseline over time rather than a single industry number.",
      },
      {
        question: "Does OEE include setup time?",
        answer:
          "Setup during scheduled production usually counts as downtime unless your standard explicitly treats it as planned stop time. Be consistent across shifts when tracking availability.",
      },
      {
        question: "Can I calculate OEE with a free calculator?",
        answer:
          "Yes. The OEE calculator accepts availability, performance and quality inputs or component times and returns the composite score in your browser.",
      },
      {
        question: "When should I use a premium OEE analyzer?",
        answer:
          "Use a premium analyzer when OEE affects quoting, scheduling or management reporting and you need hidden driver breakdown with export-ready decision output.",
      },
    ],
  },
  {
    slug: "how-to-calculate-scrap-rate",
    localeKey: "guides.scrapRate",
    category: "manufacturing",
    title: "How to Calculate Scrap Rate",
    seoTitle: "How to Calculate Scrap Rate — Yield & Material Loss Guide",
    seoDescription:
      "Calculate scrap rate and material yield for manufacturing jobs. Free scrap calculators and premium sheet-metal scrap risk analyzer on SectorCalc.",
    h1: "How to calculate scrap rate",
    featuredQuestion: "How do you calculate scrap rate in manufacturing?",
    featuredAnswer:
      "Scrap rate is lost material or failed units expressed as a share of expected output. Material scrap rate equals scrap weight or units divided by total material issued. Process scrap rate equals defective units divided by total units started. Multiply scrap rate by material cost and rework labor to estimate margin exposure. SectorCalc free scrap and waste calculators give quick ratios; premium analyzers connect scrap to hidden margin loss and threshold alerts.",
    sections: [
      {
        heading: "Material scrap versus process scrap",
        body:
          "Material scrap is cutoffs, skeletons and damaged stock before value-added steps. Process scrap is units that fail inspection after machining, welding or assembly.",
      },
      {
        heading: "How to calculate scrap rate as a percentage",
        body:
          "Choose the denominator carefully so the rate matches how you manage yield.",
        bullets: [
          "Scrap rate = scrap quantity ÷ (good output + scrap quantity)",
          "Alternate view: scrap cost ÷ total material cost for the job",
          "Track by material grade and operation to find repeat offenders",
        ],
      },
      {
        heading: "Why scrap rate affects quoted margin",
        body:
          "A 5% scrap rate on high-value alloy or long cycle parts can erase profit faster than a small price discount. Quote calculators should include expected yield, not best-case yield.",
      },
      {
        heading: "When the basic calculator is not enough",
        body:
          "Use free scrap calculators for batch-level ratios. Open the premium sheet metal scrap risk analyzer when recurring loss threatens quoted margin and you need threshold checks, hidden drivers and export-ready decision output.",
      },
    ],
    relatedFreeToolSlugs: [
      "scrap-rate-calculator",
      "material-waste-calculator",
      "batch-yield-calculator",
      "sheet-metal-weight-calculator",
    ],
    relatedPremiumSchemaSlugs: ["sheet-metal-scrap-risk"],
    faq: [
      {
        question: "What is an acceptable scrap rate?",
        answer:
          "Acceptable scrap varies by process and material. Sheet metal nesting might target under 10% skeleton loss while precision machining targets low single-digit reject rates. Compare to your historical baseline.",
      },
      {
        question: "How is scrap rate different from yield?",
        answer:
          "Yield is good output divided by input. Scrap rate is the complement when expressed against the same denominator. A 95% yield equals a 5% scrap rate on that basis.",
      },
      {
        question: "Does SectorCalc have a scrap rate calculator?",
        answer:
          "Yes. The free scrap rate calculator estimates loss ratios from your inputs. The premium sheet metal scrap risk analyzer adds hidden driver breakdown and decision report output.",
      },
      {
        question: "When should I escalate from free scrap math to a premium report?",
        answer:
          "Escalate when scrap rate affects quoted margin on repeat jobs and you need threshold interpretation, hidden drivers and export-ready output for management review.",
      },
    ],
  },
  {
    slug: "how-to-calculate-construction-cost-overrun",
    localeKey: "guides.constructionOverrun",
    category: "construction",
    title: "How to Calculate Construction Cost Overrun",
    seoTitle: "Construction Cost Overrun Calculator — Estimate Budget Exposure",
    seoDescription:
      "Estimate construction cost overrun from scope, labor and material drift. Free renovation and concrete calculators plus premium project overrun analyzer.",
    h1: "How to calculate construction cost overrun",
    featuredQuestion: "How do you calculate construction cost overrun?",
    featuredAnswer:
      "Construction cost overrun is actual or forecast project cost minus the approved budget, often expressed as a percentage of budget. Track material quantity drift, labor hour growth and change-order accumulation separately so you see which driver dominates. SectorCalc free renovation area and concrete calculators sanity-check quantities; the premium construction project overrun analyzer models margin leak, delay exposure and threshold risk before you absorb another change order.",
    sections: [
      {
        heading: "What triggers construction overruns?",
        body:
          "Scope creep, underestimated quantities, weather delays and subcontractor rework are frequent causes. Overrun percentage alone hides whether the problem is volume, rate or schedule.",
      },
      {
        heading: "How to estimate overrun before final closeout",
        body:
          "Compare committed costs plus forecast-to-complete against the original budget by cost code.",
        bullets: [
          "Overrun amount = forecast final cost − approved budget",
          "Overrun % = overrun amount ÷ approved budget",
          "Split material, labor, equipment and subcontractor buckets",
        ],
      },
      {
        heading: "Quantity takeoff errors drive early overrun",
        body:
          "Concrete volume, floor area and finish coverage mistakes compound across trades. Validate takeoffs with independent calculators before locking subcontractor packages.",
      },
      {
        heading: "When overrun threatens project margin",
        body:
          "If forecast overrun exceeds your contingency, pause discretionary scope and re-baseline labor productivity. Premium overrun analysis helps prioritize which cost codes to negotiate first.",
      },
    ],
    relatedFreeToolSlugs: [
      "home-renovation-m2-calculator",
      "concrete-volume-calculator",
      "profit-margin-calculator",
      "paint-coverage-calculator",
    ],
    relatedPremiumSchemaSlugs: ["construction-project-overrun"],
    faq: [
      {
        question: "What is a typical construction contingency?",
        answer:
          "Many contractors carry 5–10% contingency on hard costs depending on project complexity and contract type. Contingency is not profit—it absorbs expected variability.",
      },
      {
        question: "How do change orders affect overrun?",
        answer:
          "Approved change orders increase budget and should not count as overrun. Unapproved scope growth without budget adjustment is the usual overrun source.",
      },
      {
        question: "Can free calculators help prevent overrun?",
        answer:
          "Free area, concrete and coverage calculators reduce quantity risk during estimating. Premium overrun analyzer adds decision-report output when margin is at stake.",
      },
    ],
  },
  {
    slug: "how-to-calculate-route-cost",
    localeKey: "guides.routeCost",
    category: "logistics",
    title: "How to Calculate Route Cost",
    seoTitle: "Route Cost Calculator — Delivery & Fuel Cost Guide",
    seoDescription:
      "Calculate route cost from distance, fuel rate and stop count. Free logistics calculators and premium route loss analyzer on SectorCalc.",
    h1: "How to calculate route cost",
    featuredQuestion: "How do you calculate delivery route cost?",
    featuredAnswer:
      "Route cost sums fuel, driver labor, tolls and vehicle wear for a trip or daily loop. Start with total distance multiplied by cost per kilometer, add stop time at your hourly driver rate, and include deadhead legs that run empty. SectorCalc free route and delivery cost calculators produce quick per-trip estimates; premium logistics route loss analyzer exposes deadhead, fuel drift and margin leak across recurring routes.",
    sections: [
      {
        heading: "Components of route cost",
        body:
          "Fuel and driver time dominate most last-mile and regional routes. Maintenance reserve and tolls matter on longer lanes.",
        bullets: [
          "Fuel cost = distance × consumption rate × fuel price",
          "Labor cost = drive time + stop time at loaded hourly rate",
          "Deadhead adds cost without matching revenue load",
        ],
      },
      {
        heading: "Per-stop versus per-kilometer pricing",
        body:
          "Per-km models fit linehaul; per-stop models fit dense urban delivery. Hybrid models allocate a base trip cost plus incremental stop cost.",
      },
      {
        heading: "Why deadhead erodes margin",
        body:
          "Empty return legs and repositioning between low-density stops burn fuel and hours without revenue. Track deadhead percentage separately from loaded miles.",
      },
      {
        heading: "Validate quotes with calculators before signing lanes",
        body:
          "Use free route cost calculators when bidding new accounts. Escalate to premium route loss analysis when fuel volatility or stop density threatens contracted margin.",
      },
    ],
    relatedFreeToolSlugs: [
      "route-cost-calculator",
      "delivery-cost-calculator",
      "fuel-consumption-calculator",
      "trip-budget-calculator",
    ],
    relatedPremiumSchemaSlugs: ["logistics-route-loss", "logistics-fuel-route-drift"],
    faq: [
      {
        question: "How do you allocate cost per delivery stop?",
        answer:
          "Divide total route cost by billable stops after subtracting deadhead-only miles. Add a minimum stop charge when drop density is low.",
      },
      {
        question: "Should tolls be included in route cost?",
        answer:
          "Yes when they are predictable for the lane. Pass-through toll billing to customers when contracts allow; otherwise include in your cost floor.",
      },
      {
        question: "What is route deadhead cost?",
        answer:
          "Deadhead cost is expense from running empty or under-loaded legs—fuel, driver hours and tolls without matching freight revenue on that segment.",
      },
    ],
  },
  {
    slug: "how-to-calculate-restaurant-food-cost",
    localeKey: "guides.foodCost",
    category: "food-retail",
    title: "How to Calculate Restaurant Food Cost",
    seoTitle: "Restaurant Food Cost Calculator — Menu Margin Guide",
    seoDescription:
      "Calculate restaurant food cost percentage and menu margin. Free food cost calculators and premium menu margin leak analyzer on SectorCalc.",
    h1: "How to calculate restaurant food cost",
    featuredQuestion: "How do you calculate restaurant food cost percentage?",
    featuredAnswer:
      "Restaurant food cost percentage equals ingredient cost for a dish divided by menu selling price, multiplied by 100. Track ideal cost from recipes separately from actual cost from inventory depletion to spot waste, portion drift and theft. SectorCalc free food cost and margin calculators estimate plate economics quickly; premium menu margin leak analyzer connects food cost drift to hidden loss and threshold alerts for pricing decisions.",
    sections: [
      {
        heading: "Ideal food cost versus actual food cost",
        body:
          "Ideal cost uses standardized recipes and current vendor prices. Actual cost comes from purchases minus inventory change. The gap reveals operational leakage.",
      },
      {
        heading: "How to calculate food cost per menu item",
        body:
          "Sum ingredient costs per plated portion including garnish, oil and disposables allocated to the dish.",
        bullets: [
          "Food cost % = ingredient cost ÷ menu price × 100",
          "Target margin = 100% − food cost % − labor and overhead allocation",
          "Recalculate when vendor prices or portion sizes change",
        ],
      },
      {
        heading: "Why food cost drift happens",
        body:
          "Portion creep, unrecorded comps, prep waste and vendor price spikes move actual cost without a menu price update. Weekly spot checks catch drift early.",
      },
      {
        heading: "When to reprice versus re-portion",
        body:
          "If actual food cost exceeds target by more than two points for multiple weeks, adjust portions or prices. Premium analysis helps prioritize high-volume items first.",
      },
    ],
    relatedFreeToolSlugs: [
      "food-cost-calculator",
      "profit-margin-calculator",
      "break-even-calculator",
      "discount-calculator",
    ],
    relatedPremiumSchemaSlugs: ["restaurant-menu-margin-leak", "food-waste-margin-loss"],
    faq: [
      {
        question: "What is a good food cost percentage?",
        answer:
          "Full-service restaurants often target 28–35% food cost depending on concept and beverage mix. Fast casual may run lower; fine dining may run higher with premium pricing power.",
      },
      {
        question: "Does food cost include labor?",
        answer:
          "Classic food cost percentage covers ingredients only. Prime cost combines food and labor and is the usual operational control metric alongside food cost alone.",
      },
      {
        question: "Can SectorCalc help with menu pricing?",
        answer:
          "Free calculators estimate food cost ratio and margin. Premium menu margin leak analyzer adds hidden driver diagnostics and export-ready decision reports.",
      },
    ],
  },
  {
    slug: "how-to-calculate-energy-cost-and-carbon-exposure",
    localeKey: "guides.energyCarbon",
    category: "energy-carbon",
    title: "How to Calculate Energy Cost and Carbon Exposure",
    seoTitle: "Energy Cost & Carbon Exposure Calculator Guide",
    seoDescription:
      "Calculate electricity cost, kWh exposure and carbon footprint. Free energy calculators and premium peak cost analyzer on SectorCalc.",
    h1: "How to calculate energy cost and carbon exposure",
    featuredQuestion: "How do you calculate energy cost and carbon exposure?",
    featuredAnswer:
      "Energy cost multiplies kilowatt-hours consumed by your effective tariff, including demand charges when applicable. Carbon exposure multiplies energy use by emission factor for your grid or fuel source. Peak hours can double effective unit cost even when average kWh looks stable. SectorCalc free kWh and bill calculators estimate cost; premium peak cost and carbon compliance analyzers reveal hidden exposure behind averages for operational and reporting decisions.",
    sections: [
      {
        heading: "From meter reading to monthly bill",
        body:
          "kWh times energy rate gives commodity cost. Demand charges, fixed fees and time-of-use multipliers change the true marginal cost of running equipment during peak windows.",
      },
      {
        heading: "How to estimate carbon exposure",
        body:
          "Apply published kg CO₂ per kWh or per liter of fuel to measured consumption. Scope 1 covers onsite fuel; Scope 2 covers purchased electricity.",
        bullets: [
          "Electricity CO₂ = kWh × grid emission factor",
          "Fuel CO₂ = liters × fuel emission factor",
          "Track peak load separately—it drives both cost and compliance risk",
        ],
      },
      {
        heading: "Why average kWh misleads",
        body:
          "Compressors, ovens and HVAC clusters during peak windows inflate demand charges. Average cost per kWh hides the penalty of running heavy loads at the wrong hour.",
      },
      {
        heading: "Link energy and carbon to operational decisions",
        body:
          "Shift schedulable loads off peak when tariffs reward it. Use premium analysis when export compliance or customer carbon questionnaires require documented exposure ranges.",
      },
    ],
    relatedFreeToolSlugs: [
      "kwh-cost-calculator",
      "electricity-bill-calculator",
      "carbon-footprint-quick",
      "energy-consumption-check",
    ],
    relatedPremiumSchemaSlugs: ["energy-peak-cost", "carbon-footprint-compliance-risk"],
    faq: [
      {
        question: "What is energy peak exposure?",
        answer:
          "Peak exposure is extra cost hidden inside average kWh when high-demand periods trigger demand charges or time-of-use multipliers on your utility bill.",
      },
      {
        question: "How is carbon footprint calculated for a facility?",
        answer:
          "Sum emissions from purchased energy and onsite fuel using standard emission factors, then add process emissions if your reporting boundary requires them.",
      },
      {
        question: "Are energy calculators on SectorCalc free?",
        answer:
          "Yes. Free kWh, bill and quick carbon calculators run in the browser. Premium analyzers add peak load diagnostics and decision-report export.",
      },
    ],
  },
  {
    slug: "how-to-use-area-converter",
    localeKey: "guides.areaConverter",
    category: "conversion",
    title: "How to Use an Area Converter",
    seoTitle: "Area Converter — m² to ft², Hectares to Acres Guide",
    seoDescription:
      "Convert area units between metric and imperial: m², ft², hectares and acres. Free area converter and related measurement calculators on SectorCalc.",
    h1: "How to use an area converter",
    featuredQuestion: "How do you convert m² to ft² and hectares to acres?",
    featuredAnswer:
      "Area conversion multiplies by a fixed factor between units. One square meter equals 10.7639 square feet; one hectare equals 2.471 acres. To convert m² to ft², multiply by 10.7639. To convert hectares to acres, multiply by 2.471. SectorCalc free area converter handles metric and imperial area units instantly in your browser—useful for floor plans, land quotes and material coverage checks before construction or logistics decisions.",
    sections: [
      {
        heading: "Common area units in construction and land",
        body:
          "Metric projects use square meters and hectares. US and UK drawings often use square feet and acres. Mixed documents require consistent conversion before ordering materials.",
      },
      {
        heading: "Conversion factors to remember",
        body:
          "Exact factors prevent ordering errors on large sites.",
        bullets: [
          "1 m² = 10.7639 ft²",
          "1 ft² = 0.092903 m²",
          "1 hectare = 10,000 m² = 2.471 acres",
          "1 acre = 4,046.86 m²",
        ],
      },
      {
        heading: "When area conversion affects cost",
        body:
          "Floor coverage, paint, tile and rental rate quotes often use different units than your takeoff. Convert once at the estimate stage to avoid compounding error across trades.",
      },
      {
        heading: "When the basic calculator is not enough",
        body:
          "Use the free area converter for unit checks on plans and quotes. Open a premium warehouse space cost analyzer when converted area drives occupancy cost decisions that need threshold checks and export-ready reporting.",
      },
    ],
    relatedFreeToolSlugs: [
      "area-converter",
      "square-meter-calculator",
      "square-footage-calculator",
      "flooring-calculator",
    ],
    relatedPremiumSchemaSlugs: ["warehouse-space-cost-leak"],
    faq: [
      {
        question: "How many square feet are in a square meter?",
        answer:
          "One square meter equals 10.7639 square feet. Multiply m² by 10.7639 to get ft².",
      },
      {
        question: "How do you convert hectares to acres?",
        answer:
          "Multiply hectares by 2.471 to get acres. One hectare is exactly 10,000 square meters.",
      },
      {
        question: "Is the area converter free?",
        answer:
          "Yes. The area converter runs in your browser with no sign-up and supports common metric and imperial area units.",
      },
      {
        question: "When do area conversion mistakes affect project cost?",
        answer:
          "Mixed units on floor coverage, paint, tile or land quotes compound into material ordering errors. Convert once at the estimate stage before multiplying by unit rates.",
      },
    ],
  },
] as const;

const GUIDE_BY_SLUG = new Map<string, AuthorityGuide>(
  AUTHORITY_GUIDES.map((guide) => [guide.slug, guide]),
);

export function listAuthorityGuideSlugs(): readonly string[] {
  return AUTHORITY_GUIDES.map((guide) => guide.slug);
}

export function getAuthorityGuideBySlug(slug: string): AuthorityGuide | null {
  return GUIDE_BY_SLUG.get(slug) ?? null;
}

export function getAuthorityGuidesByCategory(
  category: AuthorityGuideCategory,
): readonly AuthorityGuide[] {
  return AUTHORITY_GUIDES.filter((guide) => guide.category === category);
}

export function countAuthorityGuides(): number {
  return AUTHORITY_GUIDES.length;
}
