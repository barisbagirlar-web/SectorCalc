/**
 * Tier-A money-page editorial contract (blocks 01, 03–16).
 * Block 02 = live calculator UI. Block 06 narrative uses seo/worked-examples/*.json.
 */
export const MONEY_CONTENT = {
  'tolerance-stack-up': {
    directAnswer:
      'When a critical gap must still close after every contributor hits its legal extreme, a 1D tolerance stack-up predicts assembly risk with worst-case, RSS, and seeded Monte Carlo on the same stack. Use it to choose tolerances before tooling — not as a substitute for measured SPC on production parts.',
    decision:
      'Decide whether a proposed tolerance set can close a critical gap, which contributors dominate risk, and whether worst-case, RSS, or Monte Carlo is the right release criterion for the drawing.',
    inputs:
      'Each contributor needs a nominal, bilateral tolerance, sign/direction, and distribution model. The assembly needs upper/lower specification limits, iteration count, and a seed when Monte Carlo is used.',
    formula:
      'Stack nominal X = Σ nᵢ. Worst-case spread sums extremes. RSS uses √(Σ tᵢ²) under independent centered normals. Monte Carlo draws from assigned distributions with a fixed seed for audit reproducibility.',
    interpretation:
      'Higher predicted Cpk means more margin to the gap limits under your distribution assumptions. A large WC–RSS gap signals rare simultaneous extremes. If Monte Carlo disagrees with RSS, at least one distribution is poorly approximated by ±3σ normal.',
    sensitivity:
      'The largest tolerances and the loosest distributions move predicted PPM the most. Tightening a small contributor rarely helps if a single wide uniform contributor dominates the stack.',
    assumptions:
      'Contributors are independent along one measurement axis. Distributions you assign are honest models of process behavior. Form, orientation, and 2D position tolerances are outside this model.',
    limitations:
      'Screening calculation for 1D linear stacks only. Not a GD&T datum-frame solver. Predicted Cpk is not measured SPC. Does not replace a licensed engineer’s drawing release judgment.',
    mistakes:
      'Treating every drawing ± block as uniform; mixing absolute and deviation limits; forgetting sign direction; trusting Monte Carlo without fixing the seed for audits.',
    standards:
      'Uses classical WC/RSS stack arithmetic and statistical tolerancing ideas aligned with common ASME Y14.5 practice. It does not claim full Y14.5 compliance for complex datum schemes.',
    audit:
      'A1 identifies the engine and seed. A2 snapshots inputs. A3 records WC/RSS/MC formulas. A4 states distribution assumptions. A5 lists warnings when predictions leave validated bands.',
    glossary: ['/glossary/tolerance-stack-up', '/glossary/rss-tolerance', '/glossary/monte-carlo-simulation'],
    guide: '/guides/tolerance-stack-up-complete',
    commercial:
      'Run the stack, read the predicted risk, then open the A1–A5 trail when you need a shareable audit for drawing release. Credit packs unlock full report workflows without inventing fake certifications.',
  },
  'cnc-feeds-speeds': {
    directAnswer:
      'Before you burn a tool or stall a spindle, CNC feeds and speeds convert material group, tool geometry, and machine limits into spindle speed, table feed, chip thickness, and power/torque demand — then flag whether the cut should be released, run with caution, or rejected.',
    decision:
      'Choose starting Vc/fz for a tool–material pair, check spindle power and torque headroom, and estimate whether the cut is production-credible before you burn a tool or stall the spindle.',
    inputs:
      'Material group, cutter diameter and teeth, Vc, fz, ae/ap, spindle power and torque, stick-out, coolant/interruption mode, and optional tool/machine cost rates.',
    formula:
      'n = (1000·Vc)/(π·D). vf = n·z·fz (with chip-thinning compensation when ae < D). Power and torque demand come from specific cutting force models in the FS-ENGINE core.',
    interpretation:
      'Released means demand sits inside spindle limits with credible chip load. Caution means a limit is close. Do not run means power, torque, or chip thickness is outside the validated band for the selected material table.',
    sensitivity:
      'Diameter and Vc dominate rpm. Radial engagement and fz dominate chip thickness and force. Stick-out raises deflection risk faster than operators expect.',
    assumptions:
      'Reference mid-band material constants. Machine efficiency and coolant factors are screening defaults. Supplier datasheets override tables for contract work.',
    limitations:
      'Not a CAM toolpath simulator. Does not model chatter stability lobes, coated-grade specifics, or adaptive control. Calibrate to toolmaker data before production release.',
    mistakes:
      'Using catalog Vc with full-slot ae while entering a finishing ae; ignoring torque at low rpm; treating verdict as a warranty.',
    standards:
      'Material grouping follows ISO 513-style categories. Cutting equations are engineering practice, not a claim of full ISO machining-standard compliance for every grade.',
    audit:
      'A1–A5 capture engine identity, SI inputs, formula trace, assumptions, and warnings so two shops can reproduce the same starting recommendation.',
    glossary: ['/glossary/cnc-feeds-and-speeds', '/glossary/chip-thinning', '/glossary/taylor-tool-life'],
    guide: '/guides/cnc-optimization-complete',
    commercial:
      'Lock a released cut, keep the audit trail with the job traveler, and use Pro reporting when you need deterministic exports across the cell.',
  },
  'machine-hour-rate': {
    directAnswer:
      'If quotes keep losing money despite “busy” spindles, machine hour rate is the fully loaded cost of one productive hour — ownership, maintenance, energy, attended labor share, and overhead diluted by realistic annual hours rather than wishful capacity.',
    decision:
      'Set an honest shop rate for quoting, compare assets, and see how utilization and residual-value assumptions change the €/h you must recover.',
    inputs:
      'Purchase price, residual, life, annual hours, imputed interest, floor space and rate, power and duty, energy tariff, maintenance %, tooling/other annuals, operator wage and machines-per-operator, overhead %, optional cycle time.',
    formula:
      'Fixed/yr = depreciation + interest + space + maint%·price + tools + other. Machine €/h = fixed/hours + power·duty·tariff. Labor €/h = wage / share. Total = (machine + labor)·(1 + OH%).',
    interpretation:
      'Higher utilization lowers €/h by diluting the fixed block. A rate that looks cheap at 5,500 h/yr may be dishonest on a single-shift meter reading. Cost/part only appears when cycle time is provided.',
    sensitivity:
      'Annual hours and capital cost dominate. Maintenance % and residual assumptions move the rate next. Operator share swings labor when lights-out claims are aggressive.',
    assumptions:
      'Linear depreciation to residual. Imputed interest on average capital. Constant average power duty. Overhead is a simple uplift, not a full ABC model.',
    limitations:
      'Screening cost model. Not tax depreciation, IFRS impairment, or a replacement for a controller’s rate letter. Zero interest flatters the rate.',
    mistakes:
      'Using planned hours instead of metered hours; residual ≥ price; counting overhead twice in labor and OH%.',
    standards:
      'Cost-engineering practice for machine-hour build-up. No ISO/ASME compliance claim — it is an internal costing method with explicit assumptions.',
    audit:
      'A1–A5 record engine identity, unit-normalized inputs, formula block, assumptions, and utilization warnings.',
    glossary: ['/glossary/machine-hour-rate', '/glossary/labor-burden-rate'],
    guide: '/guides/labor-costing-complete',
    commercial:
      'Export the rate into quote pricing next, then use Pro audit packs when customers ask how your €/h was built.',
  },
  'quote-pricing': {
    directAnswer:
      'When a competitive sell price still somehow kills margin after delivery, quote pricing rebuilds full manufacturing cost — material with scrap, labor, machine time, setup, overhead, and payment finance — then marks up to a target margin you can defend.',
    decision:
      'Decide a sell price and unit price that still hit margin after scrap, setup amortization, and cash-cycle finance — before you lock a customer promise.',
    inputs:
      'Material, scrap rate, labor/machine hours and rates, setup, overhead rate, energy/consumables/shipping, payment days, interest, target margin, quantity.',
    formula:
      'Effective material = material / (1 − scrap). Direct = material + labor + machine + setup + energy + consumables + shipping. Finance from payment days. Sell = cost / (1 − margin).',
    interpretation:
      'If margin looks high but scrap or finance was ignored, the quote is optimistic. Unit price should be checked against quantity breaks and setup intensity.',
    sensitivity:
      'Scrap rate, machine €/h, and target margin dominate. Long payment terms quietly erode profit via finance charge.',
    assumptions:
      'Scrap is yield loss on material only. Overhead is a rate on cost base defined by the engine. Margin is on sell price, not cost-plus markup confusion.',
    limitations:
      'Not an ERP quote module. Does not model volume discounts, FX, or contractual LD clauses. Requires honest labor and machine rates from upstream tools.',
    mistakes:
      'Entering margin as markup; forgetting setup on short runs; double-counting overhead already inside machine rate.',
    standards:
      'Manufacturing cost-accounting practice. No claim of GAAP/IFRS quote compliance.',
    audit:
      'Conservation-locked cost breakdown and step list form the A1–A5 style trail for the quote.',
    glossary: ['/glossary/labor-burden-rate', '/glossary/machine-hour-rate'],
    guide: '/guides/labor-costing-complete',
    commercial:
      'Attach the cost breakdown to the quote PDF workflow when you need customer-facing cost transparency without exposing proprietary rate tables wholesale.',
  },
  'true-labor-cost': {
    directAnswer:
      'If labor in the quote looks cheap against payroll reality, true labor cost is the fully loaded employer hour — grossed-up pay plus employer social charges, benefits, severance accrual, overtime, and amortized recruitment — not the net wage on the payslip.',
    decision:
      'Price labor honestly into machine rates and quotes, compare country burden, and see the hidden cost percentage above net pay.',
    inputs:
      'Country profile, net pay and frequency, hours/week, optional rate overrides, benefits, bonus, overtime, recruitment cost and tenure.',
    formula:
      'Normalize net → monthly, gross-up by employee rate, add employer charges and benefits, accrue severance, add overtime and amortized recruitment, then divide by paid hours.',
    interpretation:
      'Cost multiplier > 1.5 is common. If your quote uses net wage as labor €/h, you are understating cost by the hidden percentage the engine reports.',
    sensitivity:
      'Employer social rates and net pay dominate. Recruitment amortization matters on short tenure. Overtime multiplies quickly.',
    assumptions:
      'Country defaults are reference profiles. Overrides replace defaults when provided. Tenure amortizes recruitment linearly.',
    limitations:
      'Not payroll, tax advice, or a CBA interpreter. Local statutory rules can differ from the screening profile.',
    mistakes:
      'Using net instead of true hourly cost in quotes; ignoring employer charges; setting tenure to zero.',
    standards:
      'Cost-engineering labor burden model. Not a claim of full statutory payroll compliance for every jurisdiction.',
    audit:
      'Steps and conservation lock provide the reproducible trail from net pay to true monthly/hourly cost.',
    glossary: ['/glossary/labor-burden-rate', '/glossary/machine-hour-rate'],
    guide: '/guides/labor-costing-complete',
    commercial:
      'Feed true hourly cost into machine-hour and quote tools, then keep the burden breakdown when finance asks why shop labor is not “just the wage”.',
  },
  'oee-teep': {
    directAnswer:
      'When the line “feels busy” but output disappoints, OEE multiplies availability, performance, and quality into one effectiveness ratio for the window — so you can see how much planned time became good output at the ideal cycle.',
    decision:
      'Separate downtime, speed loss, and scrap so improvement work targets the real loss bucket instead of a vague “efficiency” percentage.',
    inputs:
      'Planned production time, run time, ideal cycle time, total count, good count — in consistent units.',
    formula:
      'Availability = run / planned. Performance = (ideal cycle × total count) / run. Quality = good / total. OEE = A × P × Q.',
    interpretation:
      'A single OEE number is not a target theater metric — read the three factors. Performance above 100% usually means ideal cycle or counts are wrong, not heroics.',
    sensitivity:
      'Short run time crushes availability. Inflated ideal cycle flatters performance. Scrap hits quality and hides in the product.',
    assumptions:
      'Counts and times refer to the same window. Ideal cycle is the theoretical best, not average historical cycle.',
    limitations:
      'Not TEEP unless calendar time is used as the planned base. Does not diagnose root causes — only quantifies loss buckets.',
    mistakes:
      'Mixing shifts; using average cycle as ideal; excluding changeover from planned time inconsistently.',
    standards:
      'Classic OEE definition used in manufacturing excellence practice. Not a certified ISO OEE audit by itself.',
    audit:
      'Factor steps and warnings when rates exceed 100% keep the calculation honest for tier reviews.',
    glossary: ['/glossary/oee-overall-equipment-effectiveness', '/glossary/machine-hour-rate'],
    guide: '/guides/labor-costing-complete',
    commercial:
      'Convert OEE reality into machine-hour and quote adjustments when the cell cannot hit the planned utilization baked into rates.',
  },
  'bearing-life-l10': {
    directAnswer:
      'Before you lock a housing around a catalog bearing, L10 life estimates the millions of revolutions (or hours) at which 90% of a population is expected to survive under stated equivalent load, with optional aISO modification for lubrication and contamination.',
    decision:
      'Screen whether a catalog bearing capacity is credible for speed and load before locking a housing design or greasing interval story.',
    inputs:
      'Dynamic capacity C, equivalent load P, speed, bearing type exponent, and aISO (or factors used to form it).',
    formula:
      'L10 = (C/P)^p × 10⁶ revolutions; L10h = L10 / (60·n). Modified life multiplies by aISO when lubrication/contamination adjustment is applied.',
    interpretation:
      'L10 is a reliability statistic, not a warranty clock. Short L10 under steady load means resize, derate, or fix lubrication — not “hope”.',
    sensitivity:
      'Load ratio C/P dominates. Speed converts revolutions to hours. aISO can swing life by orders of magnitude when mis-set.',
    assumptions:
      'ISO 281 basic rating framework. Equivalent load already includes radial/axial combination per catalog method.',
    limitations:
      'Screening model. Manufacturer tables, clearance fits, misalignment, and grease life can govern. Not a substitute for supplier selection software on safety-critical spindles.',
    mistakes:
      'Using Fr as P without axial factors; confusing L10h with calendar maintenance intervals; setting aISO = 1 in dirty oil.',
    standards:
      'Implements ISO 281 rating-life equations in the stated scope. Does not claim full ISO 281 annex coverage for every adjustment factor table.',
    audit:
      'A1–A5 document capacity inputs, exponents, aISO, and warnings when life leaves credible bands.',
    glossary: ['/glossary/bearing-l10-life', '/glossary/iso-281'],
    guide: '/guides/bearing-life-complete',
    commercial:
      'Keep the life audit with the shaft design package when customers ask why a larger bearing was selected.',
  },
  'bolt-torque-preload': {
    directAnswer:
      'When assembly torque is treated as a clamp-load guarantee, bolt torque–preload estimates the torque needed for a target preload using a nut factor, and reports mean tensile stress so you can see whether the tighten target sits in a plausible strength band.',
    decision:
      'Set a first-pass tightening torque for assembly instructions before full VDI joint analysis, and sanity-check friction assumptions.',
    inputs:
      'Target preload, nominal diameter, nut factor K (or friction inputs used to form K), and material strength context from the UI.',
    formula:
      'T ≈ K · F · d. Mean tensile stress ≈ F / (π d² / 4) for a screening check against proof strength bands.',
    interpretation:
      'Torque is a poor preload meter when K is uncertain. Treat ±20–30% preload scatter as normal unless you measure tension.',
    sensitivity:
      'K and target F dominate torque. Diameter errors square into stress. Lubrication changes K more than operators expect.',
    assumptions:
      'Nut factor encapsulates friction. Thread and bearing friction are not separately instrumented in the simple path.',
    limitations:
      'Assembly screening only. Not a full VDI 2230 embedment/relaxation/fatigue joint design. Not a substitute for calibrated tension tools on critical joints.',
    mistakes:
      'Copying dry K onto lubricated hardware; confusing torque with clamp load guarantee; ignoring embedment loss.',
    standards:
      'Engineering assembly practice related to VDI-style bolted joint work. Full VDI 2230 compliance requires the joint calculator path and verified inputs.',
    audit:
      'A1–A5 capture K, preload, diameter basis, and warnings when stress approaches proof limits.',
    glossary: ['/glossary/bolt-preload', '/glossary/vdi-2230-bolted-joint'],
    guide: null,
    commercial:
      'Move from torque screening to the bolted-joint calculator when the joint sees significant working load or fatigue.',
  },
  'bolted-joint': {
    directAnswer:
      'Before a joint that “felt tight” opens under working load, a bolted-joint load-factor model splits external load between bolt and clamped parts, estimating maximum and minimum bolt force for a VDI-style first-pass check before embedment or fatigue detailing.',
    decision:
      'Check whether preload and stiffness ratio keep the joint closed and the bolt inside credible force limits before detailing the connection.',
    inputs:
      'Bolt and member stiffnesses (or geometry used to form them), preload, and external working load.',
    formula:
      'Φ = Ck / (Ck + Cp). Fmax = Fpre + Φ·Fext. Fmin = Fpre − (1−Φ)·Fext.',
    interpretation:
      'High Φ means the bolt takes more of the working load. Fmin ≤ 0 signals opening risk under the stated load.',
    sensitivity:
      'Stiffness ratio and preload dominate. External load spikes drive Fmax into yield if preload was already aggressive.',
    assumptions:
      'Linear elastic load sharing. Eccentricity and prying may be simplified depending on UI path.',
    limitations:
      'Screening / educational VDI-style model. Does not replace a full VDI 2230 dossier with embedment, thermal, and fatigue chapters for safety-critical joints.',
    mistakes:
      'Ignoring prying; using torque-only preload without scatter; treating Fmin > 0 as proof against fatigue.',
    standards:
      'Aligned with VDI 2230 load-factor concepts in the implemented scope. Not a claim of complete VDI 2230 edition coverage.',
    audit:
      'A1–A5 record stiffness inputs, Φ, force results, and opening/yield warnings.',
    glossary: ['/glossary/vdi-2230-bolted-joint', '/glossary/bolt-preload'],
    guide: null,
    commercial:
      'Pair with torque–preload for assembly values, then keep the joint audit when the connection is customer-witnessed.',
  },
  'pipe-wall-thickness': {
    directAnswer:
      'Before you buy a schedule by habit, ASME B31.3-style pipe wall sizing estimates design thickness for straight pipe under internal pressure from design pressure, diameter, allowable stress, quality factors, and Y — then adds corrosion allowance before schedule selection.',
    decision:
      'Choose a schedule or order thickness that meets pressure design before branch reinforcement and flexibility analysis.',
    inputs:
      'Design pressure, diameter basis, allowable stress, E/W quality factors, Y, corrosion/mechanical allowances.',
    formula:
      't = P·D / (2·(S·E·W + P·Y)); tmin = t + allowances (straight pipe, internal pressure).',
    interpretation:
      'tmin is a pressure-design floor, not an automatic purchase thickness. Mill tolerance and manufacturer minimums still apply.',
    sensitivity:
      'Pressure and diameter dominate. Allowable stress and E weld factor move t next. Y matters more as P approaches S bands.',
    assumptions:
      'Straight pipe under internal pressure. Factors match the selected B31.3 path in the UI.',
    limitations:
      'Does not cover external pressure, Occasional loads, branch reinforcement, or material certificate substitution. Not a licensed piping engineer stamp.',
    mistakes:
      'Using OD vs ID inconsistently; forgetting corrosion allowance; treating calculator output as hydrotest pressure.',
    standards:
      'Implements ASME B31.3 internal-pressure thickness equations in the stated UI scope/edition notes. Not full B31.3 code compliance for an entire piping system.',
    audit:
      'A1–A5 capture pressure basis, factors, allowances, and out-of-scope warnings.',
    glossary: ['/glossary/asme-b31-pipe-wall', '/glossary/asme-viii-pressure-vessel'],
    guide: '/guides/weld-sizing-complete',
    commercial:
      'Carry the thickness audit into fabrication packages when clients ask which code equation produced tmin.',
  },
  'pressure-vessel-shell': {
    directAnswer:
      'Before plate is ordered and the stamp conversation starts, ASME VIII Div.1 cylindrical shell thickness estimates required wall for internal pressure from design pressure, radius, allowable stress, and joint efficiency — for early vessel screening, not a complete U-stamp package.',
    decision:
      'Screen shell thickness early so head, nozzle, and material choices stay consistent before detailed vessel design.',
    inputs:
      'Design pressure, radius/diameter basis, allowable stress, joint efficiency, and corrosion allowance as exposed in the UI.',
    formula:
      't = P·R / (S·E − 0.6·P) for the circumferential stress path implemented (plus allowances when enabled).',
    interpretation:
      'Required t is a Code screening thickness for the stated path — not a complete U-stamp design package.',
    sensitivity:
      'Pressure and radius dominate. Joint efficiency E moves thickness when weld quality basis changes.',
    assumptions:
      'Cylindrical shell, internal pressure, formula path selected in the UI. Material allowable is user-supplied/tabled as shown.',
    limitations:
      'Heads, external pressure, wind/seismic, nozzles, and MDMT checks are out of scope unless explicitly enabled in-product. Not a PE stamp replacement.',
    mistakes:
      'Using gage pressure inconsistently; ignoring joint efficiency; treating screening t as final purchase thickness without mill under-tolerance.',
    standards:
      'Implements ASME VIII Div.1 circumferential shell equation in the stated scope. Not full Div.1 coverage for an entire vessel.',
    audit:
      'A1–A5 document pressure basis, efficiency, formula path, and scope warnings.',
    glossary: ['/glossary/asme-viii-pressure-vessel', '/glossary/asme-b31-pipe-wall'],
    guide: '/guides/weld-sizing-complete',
    commercial:
      'Keep the shell audit with the vessel datasheet when fabricators request the equation basis.',
  },
  'weld-heat-input': {
    directAnswer:
      'When “we always run it this way” fails a WPS review, weld heat input estimates arc energy per unit length from voltage, current, and travel speed with process efficiency — a control for metallurgy and distortion risk against a qualified window.',
    decision:
      'Check whether a proposed parameter set stays inside a WPS heat-input window before you weld production coupons.',
    inputs:
      'Arc voltage, current, travel speed, and process efficiency (or process preset that sets efficiency).',
    formula:
      'HI (kJ/mm) = (V · I · 60) / (1000 · travel_mm_per_min) · η.',
    interpretation:
      'Higher heat input usually means slower cooling and more distortion risk. Compare against the qualified WPS range — not against a generic “good weld” myth.',
    sensitivity:
      'Travel speed dominates. Current is next. Efficiency differences between processes shift HI even at identical V/I/v.',
    assumptions:
      'Constant parameters along the bead. Efficiency is a process factor, not measured calorimetry.',
    limitations:
      'Not a WPS/PQR replacement. Does not compute t8/5 cooling time metallurgy by itself unless that module path is used. Not a Code stamp.',
    mistakes:
      'Mixing in/min and mm/min; using η = 1 for GMAW; treating HI as penetration guarantee.',
    standards:
      'Arc energy practice used with AWS/ISO welding procedure control. Does not claim full ISO 3834 or ASME IX compliance alone.',
    audit:
      'A1–A5 capture parameters, efficiency, HI result, and procedure-scope warnings.',
    glossary: ['/glossary/heat-input-t85', '/glossary/weld-throat'],
    guide: '/guides/weld-sizing-complete',
    commercial:
      'Pair heat-input checks with weld sizing when procedure packages need both geometry and energy evidence.',
  },
};
