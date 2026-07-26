#!/usr/bin/env node
/**
 * Fill SEO sprint template placeholders in glossary / guides / compare pages.
 * Pure English. Idempotent: skips files with no known placeholders.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const GLOSSARY = {
  'tolerance-stack-up': {
    term: 'Tolerance Stack-Up',
    def: 'A 1D linear analysis that sums independent dimensional contributors to predict whether an assembly gap or interference stays within specification.',
    p1: 'Each contributor is entered as a nominal value, a tolerance band, and a sign. The stack predicts the resulting gap, interference, or overall length before tooling is cut.',
    p2: 'Three accumulation philosophies are common: worst-case (guaranteed but conservative), RSS (statistical shortcut for capable processes), and Monte Carlo (empirical simulation for mixed distributions).',
    vars: [
      ['Nominal (n_i)', 'Centered dimension of each contributor in the chain.'],
      ['Tolerance (t_i)', 'Plus/minus or bilateral band assigned to that contributor.'],
      ['Sign (+/−)', 'Whether the contributor adds to or subtracts from the closed dimension.'],
    ],
    mistakes: [
      'Treating every contributor as independent when machining and fixtures share common datums — this understates correlated variation and can hide scrap risk.',
      'Using worst-case alone for high-volume production — it drives unnecessary cost when process capability supports RSS or Monte Carlo.',
    ],
    related: [
      ['rss-tolerance', 'RSS Tolerance'],
      ['monte-carlo-simulation', 'Monte Carlo Simulation'],
      ['worst-case-analysis', 'Worst-Case Analysis'],
    ],
  },
  'rss-tolerance': {
    term: 'RSS Tolerance',
    def: 'Root-sum-square statistical tolerancing that combines contributor tolerances as the square root of the sum of squares, assuming independent random variation.',
    p1: 'RSS is appropriate when processes are centered and capable, and contributors can be treated as statistically independent. It produces a tighter predicted stack than worst-case.',
    p2: 'The method does not replace capability studies. If a process is not near-normal or is strongly biased, RSS can understate risk.',
    vars: [
      ['t_i', 'Tolerance half-width of contributor i.'],
      ['T_RSS', 'Predicted stack tolerance equal to sqrt(sum(t_i^2)).'],
      ['Independence', 'Assumption that contributors do not share correlated error sources.'],
    ],
    mistakes: [
      'Applying RSS when fixtures, temperature, or shared datums correlate multiple features — predicted yield becomes optimistic.',
      'Confusing RSS with a guarantee — RSS is a statistical estimate, not a hard limit like worst-case.',
    ],
    related: [
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['worst-case-analysis', 'Worst-Case Analysis'],
      ['process-capability-cpk', 'Process Capability Cpk'],
    ],
  },
  'monte-carlo-simulation': {
    term: 'Monte Carlo Simulation',
    def: 'A numerical method that samples each contributor from a chosen distribution many times to build an empirical histogram of the closed dimension.',
    p1: 'Monte Carlo handles mixed distributions (normal, truncated normal, uniform, triangular) that RSS cannot represent cleanly.',
    p2: 'Deterministic engines fix the random seed so the same inputs always produce the same histogram — required for audit and customer review.',
    vars: [
      ['N', 'Number of iterations (commonly 10,000 for stack-up screening).'],
      ['Distribution', 'Probability model assigned to each contributor.'],
      ['Seed', 'Fixed starting state for reproducible random sampling.'],
    ],
    mistakes: [
      'Using an unseeded random stream — two runs with identical inputs disagree and fail audit.',
      'Too few iterations for rare tail events — PPM predictions become unstable.',
    ],
    related: [
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['rss-tolerance', 'RSS Tolerance'],
      ['deterministic-engine', 'Deterministic Engine'],
    ],
  },
  'worst-case-analysis': {
    term: 'Worst-Case Analysis',
    def: 'A tolerance accumulation method that assumes every contributor sits at its most adverse limit at the same time.',
    p1: 'Worst-case is the safest geometric guarantee: if the closed dimension works at the extremes, every intermediate combination also works under the 1D model.',
    p2: 'The cost is conservatism. For many contributors, worst-case tolerances become impractical and force expensive process controls.',
    vars: [
      ['T_WC', 'Sum of absolute contributor tolerances.'],
      ['Limit state', 'Most adverse combination of plus and minus extremes.'],
      ['Safety', 'Guaranteed fit under the modeled chain, not statistical yield.'],
    ],
    mistakes: [
      'Defaulting to worst-case for every high-volume stack — scrap risk is low but unit cost rises.',
      'Ignoring sign direction — wrong signs flip the closed dimension and invalidate the guarantee.',
    ],
    related: [
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['rss-tolerance', 'RSS Tolerance'],
      ['asme-y14-5', 'ASME Y14.5'],
    ],
  },
  'process-capability-cpk': {
    term: 'Process Capability Cpk',
    def: 'A capability index that measures how centered and tight a process is relative to specification limits.',
    p1: 'Cpk combines mean location and process spread. A higher Cpk means more of the distribution sits inside the specification.',
    p2: 'Stack-up tools often report predicted Cpk or PPM from Monte Carlo results so manufacturing can judge whether the design is producible.',
    vars: [
      ['USL / LSL', 'Upper and lower specification limits.'],
      ['σ', 'Estimated process standard deviation.'],
      ['Cpk', 'min((USL−μ)/(3σ), (μ−LSL)/(3σ)).'],
    ],
    mistakes: [
      'Computing Cpk from non-stable process data — the index becomes meaningless during special-cause variation.',
      'Treating Cpk alone as proof of customer quality without distribution shape checks.',
    ],
    related: [
      ['monte-carlo-simulation', 'Monte Carlo Simulation'],
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['rss-tolerance', 'RSS Tolerance'],
    ],
  },
  'iso-286-fits': {
    term: 'ISO 286 Fits',
    def: 'The ISO system of limits and fits that defines hole and shaft tolerance grades and fundamental deviations for clearance, transition, and interference fits.',
    p1: 'Designers pick a hole basis (for example H7) and a shaft deviation (for example g6) to create a standardized fit class.',
    p2: 'ISO 286 tables replace ad-hoc bilateral tolerances with interchangeable, globally recognized classes.',
    vars: [
      ['IT grade', 'Tolerance magnitude class (IT6, IT7, …).'],
      ['Fundamental deviation', 'Letter code locating the tolerance zone (H, g, p, …).'],
      ['Fit type', 'Clearance, transition, or interference resulting from the pair.'],
    ],
    mistakes: [
      'Mixing hole-basis and shaft-basis conventions in one assembly without documenting which features own the basis.',
      'Selecting an interference fit without checking material stress or assembly temperature.',
    ],
    related: [
      ['asme-y14-5', 'ASME Y14.5'],
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
    ],
  },
  'asme-y14-5': {
    term: 'ASME Y14.5',
    def: 'The ASME standard for dimensioning and tolerancing, including geometric dimensioning and tolerancing (GD&T) language on engineering drawings.',
    p1: 'Y14.5 defines datums, feature control frames, and material modifiers that communicate allowable variation unambiguously.',
    p2: '1D stack-up analysis often starts from linear dimensions extracted from a Y14.5 drawing before full 3D GD&T variation analysis.',
    vars: [
      ['Datum', 'Reference feature establishing origin and orientation.'],
      ['Feature control frame', 'GD&T callout controlling form, orientation, location, or profile.'],
      ['MMC / LMC', 'Material condition modifiers that affect bonus tolerance.'],
    ],
    mistakes: [
      'Interpreting plus/minus dimensions as equivalent to position tolerances without checking datum structure.',
      'Ignoring bonus tolerance at MMC when converting drawing requirements into stack contributors.',
    ],
    related: [
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['iso-286-fits', 'ISO 286 Fits'],
      ['worst-case-analysis', 'Worst-Case Analysis'],
    ],
  },
  'taylor-tool-life': {
    term: 'Taylor Tool Life',
    def: 'The empirical relationship V·T^n = C linking cutting speed to tool life for a given tool–workpiece pair.',
    p1: 'Taylor’s equation lets process planners trade cutting speed against tool change frequency and cost per part.',
    p2: 'Constants n and C are calibrated from tool life tests or vendor data and must match the coating, material, and coolant condition.',
    vars: [
      ['V', 'Cutting speed.'],
      ['T', 'Tool life to a defined wear criterion.'],
      ['n, C', 'Material/tool constants from life testing.'],
    ],
    mistakes: [
      'Using handbook n and C for a different coating or coolant condition — predicted life is wrong.',
      'Optimizing only for maximum metal removal without including tool cost and changeover time.',
    ],
    related: [
      ['cnc-feeds-and-speeds', 'CNC Feeds and Speeds'],
      ['chip-thinning', 'Chip Thinning'],
      ['machine-hour-rate', 'Machine Hour Rate'],
    ],
  },
  'bearing-l10-life': {
    term: 'Bearing L10 Life',
    def: 'The basic rating life at which 90% of a bearing population is expected to survive under a stated load and speed (ISO 281).',
    p1: 'L10 is computed from dynamic load rating C and equivalent dynamic load P using L10 = (C/P)^p with exponent p depending on bearing type.',
    p2: 'Modified rating life adjusts L10 with aISO factors for lubrication quality, contamination, and fatigue load limit.',
    vars: [
      ['C', 'Basic dynamic load rating.'],
      ['P', 'Equivalent dynamic bearing load.'],
      ['aISO', 'Life modification factor from operating conditions.'],
    ],
    mistakes: [
      'Using catalog C without converting loads into the equivalent dynamic load P for the actual duty cycle.',
      'Ignoring contamination and viscosity ratio — L10m can be far below basic L10.',
    ],
    related: [
      ['iso-281', 'ISO 281'],
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
      ['deterministic-engine', 'Deterministic Engine'],
    ],
  },
  'iso-281': {
    term: 'ISO 281',
    def: 'The international standard for calculating dynamic load ratings and rating life of rolling bearings.',
    p1: 'ISO 281 defines basic rating life and the framework for modified rating life with lubrication and contamination factors.',
    p2: 'Engineers use it to size bearings for required reliability at a stated load spectrum and speed.',
    vars: [
      ['L10', 'Basic rating life (90% reliability).'],
      ['Lnm', 'Modified rating life with aISO adjustments.'],
      ['κ (kappa)', 'Viscosity ratio of actual to required lubricant viscosity.'],
    ],
    mistakes: [
      'Applying ISO 281 static formulas to heavily oscillating or heavily contaminated service without checking limits.',
      'Mixing units between kN catalog ratings and N application loads.',
    ],
    related: [
      ['bearing-l10-life', 'Bearing L10 Life'],
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
      ['oee-overall-equipment-effectiveness', 'OEE'],
    ],
  },
  'weld-throat': {
    term: 'Weld Throat',
    def: 'The effective throat thickness of a fillet weld — the shortest distance from the root to the face — used for strength sizing.',
    p1: 'For an equal-leg fillet, throat is commonly taken as 0.707 times leg size under idealized geometry.',
    p2: 'Codes such as AWS D1.1 and ISO fillet weld rules define minimum throat, allowable stress, and inspection criteria.',
    vars: [
      ['a (throat)', 'Effective throat thickness.'],
      ['z (leg)', 'Fillet leg length along each member.'],
      ['Utilization', 'Applied stress divided by allowable stress.'],
    ],
    mistakes: [
      'Sizing from leg length alone without converting to throat for stress checks.',
      'Ignoring convexity/concavity and root gaps that reduce effective throat in production welds.',
    ],
    related: [
      ['heat-input-t85', 'Heat Input t8/5'],
      ['asme-viii-pressure-vessel', 'ASME VIII Pressure Vessel'],
      ['labor-burden-rate', 'Labor Burden Rate'],
    ],
  },
  'heat-input-t85': {
    term: 'Heat Input t8/5',
    def: 'Welding heat input and the cooling time between 800 °C and 500 °C used to control microstructure and hardness in the heat-affected zone.',
    p1: 'Heat input is typically HI = (V·I·60)/(1000·travel speed) in kJ/mm for arc processes, with process efficiency applied when required.',
    p2: 't8/5 estimates how quickly the HAZ cools through the critical transformation range and is used in WPS/PQR screening.',
    vars: [
      ['HI', 'Arc energy delivered per unit length.'],
      ['t8/5', 'Cooling time from 800 °C to 500 °C.'],
      ['Efficiency', 'Process factor converting electrical energy to weld heat.'],
    ],
    mistakes: [
      'Omitting process efficiency when comparing MAG, TIG, and SAW heat inputs.',
      'Using a single-pass formula for multi-pass joints without accounting for interpass temperature.',
    ],
    related: [
      ['weld-throat', 'Weld Throat'],
      ['asme-viii-pressure-vessel', 'ASME VIII Pressure Vessel'],
      ['asme-b31-pipe-wall', 'ASME B31 Pipe Wall'],
    ],
  },
  'sheet-metal-k-factor': {
    term: 'Sheet Metal K-Factor',
    def: 'The ratio locating the neutral bend axis inside the material thickness, used to compute bend allowance and flat pattern length.',
    p1: 'Bend allowance depends on thickness, inside radius, bend angle, and K-factor. Wrong K-factor creates wrong flat blanks.',
    p2: 'K-factor is calibrated by material, tooling, and process; handbook defaults are only a starting point.',
    vars: [
      ['K', 'Neutral axis location as a fraction of thickness.'],
      ['BA', 'Bend allowance added to flat pattern.'],
      ['IR', 'Inside bend radius.'],
    ],
    mistakes: [
      'Using one K-factor for every material and radius — blanks become systematically long or short.',
      'Forgetting to convert bend angle conventions (included vs complementary) before applying BA formulas.',
    ],
    related: [
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
      ['iso-286-fits', 'ISO 286 Fits'],
      ['cnc-feeds-and-speeds', 'CNC Feeds and Speeds'],
    ],
  },
  'sling-angle-factor': {
    term: 'Sling Angle Factor',
    def: 'The load amplification factor applied to sling legs when the hitch angle reduces vertical capacity.',
    p1: 'As sling angle from horizontal decreases, tension in each leg rises for the same payload.',
    p2: 'Rigging charts publish angle derating; calculators convert hitch geometry into per-leg tension and utilization.',
    vars: [
      ['θ', 'Sling angle from horizontal or vertical, per chart convention.'],
      ['Tension', 'Force in each sling leg.'],
      ['WLL', 'Working load limit of the sling assembly.'],
    ],
    mistakes: [
      'Reading the wrong angle reference (from horizontal vs vertical) and applying the wrong derate.',
      'Ignoring multi-leg load sharing when one leg is longer or the CG is offset.',
    ],
    related: [
      ['bolt-preload', 'Bolt Preload'],
      ['vdi-2230-bolted-joint', 'VDI 2230 Bolted Joint'],
      ['deterministic-engine', 'Deterministic Engine'],
    ],
  },
  'asme-viii-pressure-vessel': {
    term: 'ASME VIII Pressure Vessel',
    def: 'ASME Boiler and Pressure Vessel Code Section VIII rules for designing pressure vessel shells and heads under internal or external pressure.',
    p1: 'UG-27 and related paragraphs define required thickness from pressure, radius, allowable stress, and joint efficiency.',
    p2: 'Calculators screen shell thickness and MAWP before detailed vessel design and stamp paperwork.',
    vars: [
      ['P', 'Design pressure.'],
      ['R / D', 'Inside radius or diameter per formula form.'],
      ['E', 'Joint efficiency or quality factor.'],
    ],
    mistakes: [
      'Using tensile ultimate strength instead of code allowable stress for the material and temperature.',
      'Ignoring corrosion allowance and mill tolerance when converting design thickness to ordered plate.',
    ],
    related: [
      ['asme-b31-pipe-wall', 'ASME B31 Pipe Wall'],
      ['weld-throat', 'Weld Throat'],
      ['heat-input-t85', 'Heat Input t8/5'],
    ],
  },
  'asme-b31-pipe-wall': {
    term: 'ASME B31 Pipe Wall',
    def: 'Pressure design thickness rules for process piping under ASME B31.3 (and related B31 sections) including corrosion and mill tolerance.',
    p1: 'Wall thickness must resist internal pressure while leaving allowance for corrosion, mechanical strength, and manufacturing undertolerance.',
    p2: 'MAWP checks reverse the thickness formula to confirm a selected schedule is adequate.',
    vars: [
      ['t', 'Pressure design thickness.'],
      ['S', 'Allowable stress at design temperature.'],
      ['c', 'Corrosion / mechanical allowance.'],
    ],
    mistakes: [
      'Selecting pipe schedule from pressure alone without temperature-dependent allowable stress.',
      'Forgetting mill tolerance when converting minimum wall to nominal ordered wall.',
    ],
    related: [
      ['asme-viii-pressure-vessel', 'ASME VIII Pressure Vessel'],
      ['weld-throat', 'Weld Throat'],
      ['heat-input-t85', 'Heat Input t8/5'],
    ],
  },
  'vdi-2230-bolted-joint': {
    term: 'VDI 2230 Bolted Joint',
    def: 'The VDI 2230 guideline for systematic calculation of bolted joints under static and dynamic loading.',
    p1: 'It covers preload, embedding losses, stiffness of bolt and clamped parts, and fatigue safety.',
    p2: 'Engineers use it to verify that assembly torque produces enough residual clamp load after embedding and external load.',
    vars: [
      ['F_M', 'Assembly preload.'],
      ['δ', 'Elastic resilience of bolt and clamped parts.'],
      ['Safety factors', 'Against yielding, fatigue, and clamp loss.'],
    ],
    mistakes: [
      'Ignoring embedding (Setzbetrag) — residual preload after assembly is overstated.',
      'Using dry friction coefficients for lubricated threads — torque produces the wrong preload.',
    ],
    related: [
      ['bolt-preload', 'Bolt Preload'],
      ['sling-angle-factor', 'Sling Angle Factor'],
      ['deterministic-engine', 'Deterministic Engine'],
    ],
  },
  'bolt-preload': {
    term: 'Bolt Preload',
    def: 'The tensile force intentionally introduced into a fastener during tightening to clamp joint members together.',
    p1: 'Preload creates friction capacity and prevents separation under external tensile or shear loads.',
    p2: 'Torque-to-preload conversion depends on thread and underhead friction; scatter bands must be considered for joint reliability.',
    vars: [
      ['T', 'Tightening torque.'],
      ['K / μ', 'Nut factor or friction coefficients.'],
      ['F_p', 'Achieved preload.'],
    ],
    mistakes: [
      'Assuming torque alone guarantees preload without controlling lubrication and tool calibration.',
      'Overlooking preload scatter — mean preload may be fine while the low tail separates.',
    ],
    related: [
      ['vdi-2230-bolted-joint', 'VDI 2230 Bolted Joint'],
      ['iso-286-fits', 'ISO 286 Fits'],
      ['worst-case-analysis', 'Worst-Case Analysis'],
    ],
  },
  'oee-overall-equipment-effectiveness': {
    term: 'OEE',
    def: 'Overall Equipment Effectiveness — Availability × Performance × Quality — measuring how much of planned production time yields good parts.',
    p1: 'OEE isolates losses from downtime, speed loss, and defects so improvement work targets the largest waste.',
    p2: 'TEEP extends the idea to calendar time by including schedule losses.',
    vars: [
      ['Availability', 'Run time / planned production time.'],
      ['Performance', 'Actual throughput / ideal throughput.'],
      ['Quality', 'Good count / total count.'],
    ],
    mistakes: [
      'Inflating Availability by excluding changeovers that are truly production losses.',
      'Comparing OEE across dissimilar machines without normalizing ideal cycle time definitions.',
    ],
    related: [
      ['machine-hour-rate', 'Machine Hour Rate'],
      ['labor-burden-rate', 'Labor Burden Rate'],
      ['cnc-feeds-and-speeds', 'CNC Feeds and Speeds'],
    ],
  },
  'machine-hour-rate': {
    term: 'Machine Hour Rate',
    def: 'The fully loaded cost of one machine hour including depreciation, occupancy, energy, maintenance, and allocated overhead.',
    p1: 'Accurate machine rates prevent underquoting CNC and fabrication work when only direct labor is considered.',
    p2: 'Utilization assumptions dominate the rate — idle capital still costs money.',
    vars: [
      ['Depreciation', 'Capital recovery per hour of planned use.'],
      ['Utilization', 'Productive hours / available hours.'],
      ['Overhead', 'Allocated facility and support costs.'],
    ],
    mistakes: [
      'Using purchase price without residual value and real utilization — rate is fiction.',
      'Leaving out power, tooling amortization, or floor space when comparing cells.',
    ],
    related: [
      ['labor-burden-rate', 'Labor Burden Rate'],
      ['oee-overall-equipment-effectiveness', 'OEE'],
      ['taylor-tool-life', 'Taylor Tool Life'],
    ],
  },
  'labor-burden-rate': {
    term: 'Labor Burden Rate',
    def: 'The markup on base wages covering statutory taxes, insurance, benefits, and often indirect time.',
    p1: 'True labor cost is never the paycheck alone. Burden converts gross pay into employer cost per productive hour.',
    p2: 'Shop quotes that omit burden silently destroy margin.',
    vars: [
      ['Gross wage', 'Base pay before employer on-costs.'],
      ['Burden %', 'On-cost as a fraction of gross.'],
      ['Billable hours', 'Hours actually chargeable after indirect time.'],
    ],
    mistakes: [
      'Applying a generic burden percentage that ignores local statutory rates.',
      'Dividing annual cost by paid hours instead of productive hours — rate looks artificially low.',
    ],
    related: [
      ['machine-hour-rate', 'Machine Hour Rate'],
      ['oee-overall-equipment-effectiveness', 'OEE'],
      ['deterministic-engine', 'Deterministic Engine'],
    ],
  },
  'cnc-feeds-and-speeds': {
    term: 'CNC Feeds and Speeds',
    def: 'The cutting speed and feed parameters that set spindle RPM, table feed, chip load, and resulting tool engagement.',
    p1: 'Correct feeds and speeds balance metal removal rate, tool life, surface finish, and spindle power limits.',
    p2: 'Chip thinning corrections adjust programmed feed when radial engagement is reduced in milling.',
    vars: [
      ['Vc', 'Cutting speed.'],
      ['fz', 'Feed per tooth.'],
      ['n', 'Spindle speed derived from Vc and diameter.'],
    ],
    mistakes: [
      'Copying speeds from a different tool diameter or material without recalculating RPM and chip load.',
      'Ignoring chip thinning in light radial cuts — tool rubs and wears prematurely.',
    ],
    related: [
      ['chip-thinning', 'Chip Thinning'],
      ['taylor-tool-life', 'Taylor Tool Life'],
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
    ],
  },
  'chip-thinning': {
    term: 'Chip Thinning',
    def: 'The reduction in actual chip thickness when radial depth of cut is less than the tool radius in milling.',
    p1: 'Programmed feed per tooth overstates chip thickness in light engagements; effective feed must increase to restore intended load.',
    p2: 'Without correction, tools rub, heat rises, and tool life collapses despite “conservative” programmed feeds.',
    vars: [
      ['ae', 'Radial depth of cut.'],
      ['D', 'Tool diameter.'],
      ['fz_eff', 'Effective feed after thinning compensation.'],
    ],
    mistakes: [
      'Leaving CAM feed at full-slot values during finishing passes with small ae.',
      'Compensating only for radial thinning while ignoring lead-angle thinning in some cutters.',
    ],
    related: [
      ['cnc-feeds-and-speeds', 'CNC Feeds and Speeds'],
      ['taylor-tool-life', 'Taylor Tool Life'],
      ['surface-finish-ra-rz', 'Surface Finish Ra/Rz'],
    ],
  },
  'surface-finish-ra-rz': {
    term: 'Surface Finish Ra / Rz',
    def: 'Common roughness parameters: Ra is arithmetic average roughness; Rz is average peak-to-valley height over sampling lengths.',
    p1: 'Drawings specify finish to control sealing, fatigue, appearance, and bearing performance.',
    p2: 'Converters map between Ra, Rz, and related parameters using reference correlations — not exact physics identities.',
    vars: [
      ['Ra', 'Arithmetic mean deviation of the profile.'],
      ['Rz', 'Average maximum height of the profile.'],
      ['Cutoff', 'Sampling length used during measurement.'],
    ],
    mistakes: [
      'Treating Ra↔Rz conversion factors as exact for every process — correlations are approximate.',
      'Specifying ultra-fine finishes that the process cannot hold, inflating cycle time without function gain.',
    ],
    related: [
      ['cnc-feeds-and-speeds', 'CNC Feeds and Speeds'],
      ['bearing-l10-life', 'Bearing L10 Life'],
      ['iso-286-fits', 'ISO 286 Fits'],
    ],
  },
  'deterministic-engine': {
    term: 'Deterministic Engine',
    def: 'A calculation engine that returns identical outputs for identical inputs, including seeded stochastic methods and decimal arithmetic.',
    p1: 'Determinism is required for audits: two reviewers must reproduce the same report hashes and numeric results.',
    p2: 'SectorCalc uses client-side Decimal arithmetic and fixed seeds so floating-point drift and unseeded randomness do not appear in reports.',
    vars: [
      ['Seed', 'Fixed RNG state for Monte Carlo.'],
      ['Decimal math', 'Base-10 arithmetic avoiding binary float surprises.'],
      ['Audit hash', 'Fingerprint of inputs/outputs for verification.'],
    ],
    mistakes: [
      'Accepting floating-point spreadsheet results as audit truth without versioned formulas.',
      'Running Monte Carlo without a seed and treating divergent runs as “close enough.”',
    ],
    related: [
      ['monte-carlo-simulation', 'Monte Carlo Simulation'],
      ['tolerance-stack-up', 'Tolerance Stack-Up'],
      ['process-capability-cpk', 'Process Capability Cpk'],
    ],
  },
};

const GUIDES = {
  'tolerance-stack-up-complete': {
    standards: [
      ['ASME Y14.5-2018: Dimensioning and Tolerancing', 'Defines drawing language, datums, and GD&T so stack contributors are interpreted consistently.'],
      ['ISO 286-1: ISO Tolerance System', 'Provides standardized hole/shaft tolerance grades used as contributor bands in linear stacks.'],
      ['AIAG PPAP 4th Edition', 'Customer PPAP reviews often require evidence that critical dimensions remain capable after tolerance allocation.'],
    ],
    formulas: [
      ['T_WC = sum(t_i)', 'Worst-case stack tolerance sums every contributor band. It guarantees fit under the 1D model but is often too conservative for high-volume work.'],
      ['T_RSS = sqrt(sum(t_i^2))', 'RSS combines independent tolerances statistically. Use it when processes are capable and contributors are not strongly correlated.'],
      ['Empirical histogram from N iterations', 'Monte Carlo samples each distribution repeatedly to estimate yield, Cpk, and PPM for mixed or non-normal contributors.'],
    ],
  },
  'cnc-optimization-complete': {
    standards: [
      ['Taylor (1907)', 'Classic tool-life model relating cutting speed to tool life for cost and productivity trade-offs.'],
      ['ISO 3685', 'Tool-life testing framework used to generate comparable wear data for turning tools.'],
      ['VDI 3321', 'Guidance on cutting data selection and economic machining parameters for production planning.'],
    ],
    formulas: [
      ['V * T^n = C', 'Taylor tool life: raising cutting speed shortens life by the exponent n. Calibrate C and n to the tool–workpiece pair.'],
      ['ae/D < 0.5 -> fz_effective = fz / (2 * sqrt(ae/D - (ae/D)^2))', 'Radial chip-thinning compensation restores intended chip thickness when width of cut is less than full slot.'],
      ['P = (MRR * kc) / (60 * eta)', 'Spindle power estimate from material removal rate, specific cutting force, and machine efficiency.'],
    ],
  },
  'bearing-life-complete': {
    standards: [
      ['ISO 281:2007', 'Dynamic load ratings and rating life calculation for rolling bearings, including modified life factors.'],
      ['ISO 4406', 'Contamination coding for lubricating oil cleanliness that feeds eC contamination factors.'],
      ['DIN 51825', 'Lubricating grease specifications affecting viscosity and film formation in bearing service.'],
    ],
    formulas: [
      ['L10 = (C/P)^p', 'Basic rating life from dynamic capacity and equivalent load. Exponent p is 3 for ball bearings and 10/3 for roller bearings.'],
      ['kappa = nu / nu1', 'Viscosity ratio comparing actual lubricant viscosity to the required viscosity for adequate film thickness.'],
      ['aISO = f(kappa, eC, Cu/P)', 'Life modification factor combining lubrication quality, contamination, and fatigue load limit ratio.'],
    ],
  },
  'weld-sizing-complete': {
    standards: [
      ['AWS D1.1', 'Structural welding code requirements for fillet sizing, inspection, and allowable stresses in steel construction.'],
      ['ISO 5817', 'Quality levels for imperfections in fusion-welded joints used in fabrication acceptance.'],
      ['ISO 9606', 'Welder qualification standards that govern who may produce code welds on production work.'],
    ],
    formulas: [
      ['a = 0.707 * z', 'Ideal throat for an equal-leg fillet from leg length z, used as the starting strength section.'],
      ['sigma = F / (a * L)', 'Average throat stress from applied load over throat area for screening utilization.'],
      ['HI = (V*I*60)/(1000*v)', 'Arc heat input per unit length used with t8/5 cooling checks for HAZ control.'],
    ],
  },
  'labor-costing-complete': {
    standards: [
      ['Local labor law', 'Statutory employer costs (taxes, social insurance) that must enter true burden calculations.'],
      ['Company policy', 'Internal benefits, overtime rules, and indirect-time definitions that change billable hours.'],
      ['GAAP / IFRS', 'Accounting frameworks for allocating overhead consistently into product cost.'],
    ],
    formulas: [
      ['Base = Gross Salary / Billable Hours', 'Converts annual or monthly pay into a productive hourly base before burden.'],
      ['Burden = (Taxes + Insurance + Benefits) / Gross Salary', 'Employer on-cost ratio applied on top of base wage.'],
      ['Overhead = (Shop Rent + Utilities + Admin) / Total Labor Hours', 'Facility and support allocation per labor hour for full absorption costing.'],
    ],
  },
};

const COMPARE = {
  'sectorcalc-vs-excel-tolerance': {
    formula: 'Excel stores formulas inside cells. Reviewers cannot see a structured A3 formula list unless someone rebuilds the sheet by hand, so auditability depends on the author’s discipline.',
    audit: 'Spreadsheets rarely emit engine version, input hashes, warning lists, or assumption registers. SectorCalc’s A1–A5 modules exist specifically for customer and QA review.',
    privacy: 'Desktop files can be emailed, synced to cloud drives, or left on shared machines. SectorCalc keeps calculation inputs in the browser session unless the user exports a report.',
  },
  'sectorcalc-vs-minitab': {
    formula: 'Minitab is excellent for statistics, but many engineering reviewers still need the exact algebraic steps used for a stack or process check. SectorCalc prints those steps in the report.',
    audit: 'Session logs are not the same as an engineering audit package with deterministic hashes and explicit model boundaries.',
    privacy: 'Cloud-assisted workflows can move process data off the device. SectorCalc’s core engines do not upload calculation payloads.',
  },
  'sectorcalc-vs-catia': {
    formula: 'CATIA tolerance and analysis modules are powerful inside the PLM/CAD context, but formula visibility outside that ecosystem is limited for shop-floor reviewers.',
    audit: 'PLM traceability tracks documents and revisions; it is not automatically a calculator audit trail with Decimal engine identity and seeded Monte Carlo hashes.',
    privacy: 'Enterprise PLM centralizes geometry and metadata on servers. Client-side SectorCalc tools avoid sending stack numbers to a remote calculation host.',
  },
  'sectorcalc-vs-solidworks': {
    formula: 'SolidWorks analysis tools are integrated with CAD geometry. Standalone audit of the numeric method still requires exporting and explaining assumptions to non-CAD stakeholders.',
    audit: 'CAD revision history does not replace a portable A1–A5 calculation report for purchasing, quality, or customer APQP packages.',
    privacy: 'CAD vaults store proprietary models centrally. SectorCalc lets engineers screen numbers without uploading the model tree.',
  },
  'sectorcalc-vs-machinist-calculator': {
    formula: 'Classic machinist calculators often return a number without showing the intermediate formula, units conversion, or reference value used.',
    audit: 'Phone/desktop gadget apps typically provide no exportable audit trail for ISO or customer review.',
    privacy: 'Consumer apps may collect usage telemetry. SectorCalc’s engineering engines are designed to keep calculation data on-device.',
  },
};

function fillGlossary(file, slug, data) {
  let html = readFileSync(file, 'utf8');
  html = html.replaceAll('TERM_DEFINITION', data.def.replaceAll('"', '\\"'));
  html = html.replace('<p>EXPLANATION_PARAGRAPH_1</p>', `<p>${data.p1}</p>`);
  html = html.replace('<p>EXPLANATION_PARAGRAPH_2</p>', `<p>${data.p2}</p>`);
  html = html.replace(
    `<li><strong>VAR_1:</strong> DESCRIPTION_1</li>\n        <li><strong>VAR_2:</strong> DESCRIPTION_2</li>\n        <li><strong>VAR_3:</strong> DESCRIPTION_3</li>`,
    data.vars.map(([n, d]) => `<li><strong>${n}:</strong> ${d}</li>`).join('\n        '),
  );
  html = html.replace(
    `<li>MISTAKE_1 and why it leads to ERROR_1.</li>\n        <li>MISTAKE_2 and why it leads to ERROR_2.</li>`,
    data.mistakes.map((m) => `<li>${m}</li>`).join('\n        '),
  );
  for (const [relSlug, relName] of data.related) {
    html = html.replaceAll(`${relSlug}_NAME`, relName);
  }
  // Repair truncated FAQ bodies with concrete answers
  html = html.replace(
    /<p>Tolerance Stack-Up focuses on a 1D linear analysis method that sums independent dimensiona\.\.\., while RSS Tolerance addresses a different aspect of engineering analysis\.<\/p>/,
    '<p>Tolerance stack-up is the overall method (worst-case, RSS, or Monte Carlo). RSS is one statistical accumulation option inside that method.</p>',
  );
  html = html.replace(
    /Use Tolerance Stack-Up when is used in mechanical design to validate critical functional dimensions such as \.\.\. Monte Carlo Simulation is more appropriate for specialized scenarios\./,
    'Use worst-case or RSS first for quick screening. Switch to Monte Carlo when distributions differ, tails matter, or you need predicted PPM/Cpk.',
  );
  writeFileSync(file, html);
  console.log('glossary', slug);
}

function fillGuide(file, slug, data) {
  let html = readFileSync(file, 'utf8');
  for (const [name, desc] of data.standards) {
    html = html.replaceAll(`${name}_DESC`, desc);
    // templates sometimes duplicate the name before _DESC already inside the strong tag label
    html = html.replaceAll(`> ${name}_DESC`, `> ${desc}`);
    html = html.replace(`<strong>${name}:</strong> ${name}_DESC`, `<strong>${name}:</strong> ${desc}`);
  }
  for (const [formula, expl] of data.formulas) {
    html = html.replaceAll(`${formula}_EXPLANATION`, expl);
    html = html.replace(`<p>${formula}_EXPLANATION</p>`, `<p>${expl}</p>`);
  }
  writeFileSync(file, html);
  console.log('guide', slug);
}

function fillCompare(file, slug, data) {
  let html = readFileSync(file, 'utf8');
  // Replace any leftover competitor sentence + _EXPLANATION suffix patterns
  html = html.replace(/<p>([^<]+)_EXPLANATION<\/p>/g, (full, prefix) => {
    const key = prefix.trim();
    if (key.includes('formula') || key.includes('Hidden') || key.includes('Embedded') || key.includes('Statistical') || key.includes('Results only') || key.includes('not standalone') || key.includes('Formula')) {
      return `<p>${data.formula}</p>`;
    }
    if (key.includes('audit') || key.includes('Audit') || key.includes('Session') || key.includes('PLM') || key.includes('No structured') || key.includes('No audit') || key.includes('traceability')) {
      return `<p>${data.audit}</p>`;
    }
    if (key.includes('privacy') || key.includes('Privacy') || key.includes('Data') || key.includes('Cloud') || key.includes('Enterprise') || key.includes('App may')) {
      return `<p>${data.privacy}</p>`;
    }
    return `<p>${data.formula}</p>`;
  });
  writeFileSync(file, html);
  console.log('compare', slug);
}

function main() {
  for (const [slug, data] of Object.entries(GLOSSARY)) {
    const file = join(ROOT, 'public/glossary', `${slug}.html`);
    fillGlossary(file, slug, data);
  }
  for (const [slug, data] of Object.entries(GUIDES)) {
    const file = join(ROOT, 'public/guides', `${slug}.html`);
    fillGuide(file, slug, data);
  }
  for (const [slug, data] of Object.entries(COMPARE)) {
    const file = join(ROOT, 'public/compare', `${slug}.html`);
    fillCompare(file, slug, data);
  }

  // Final sweep: fail if residual template tokens remain
  const dirs = ['public/glossary', 'public/guides', 'public/compare'];
  const bad = [];
  for (const dir of dirs) {
    for (const name of readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.html'))) {
      const text = readFileSync(join(ROOT, dir, name), 'utf8');
      if (/EXPLANATION_PARAGRAPH_|DESCRIPTION_[123]|MISTAKE_[12]|VAR_[123]|TERM_DEFINITION|_EXPLANATION|_DESC|_NAME/.test(text)) {
        bad.push(`${dir}/${name}`);
      }
    }
  }
  if (bad.length) {
    console.error('REMAINING PLACEHOLDERS IN:');
    for (const b of bad) console.error(' -', b);
    process.exit(1);
  }
  console.log('ALL PLACEHOLDERS FILLED');
}

main();
