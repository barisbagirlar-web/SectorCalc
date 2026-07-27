/**
 * Editorial contract for free-tool guides (money-parity fields, no fake ROI).
 */
export const FREE_GUIDE_CONTENT = {
  'iso-286-fits': {
    problem:
      'H7/g6 looks familiar — until someone asks for the actual limit deviations on your diameter band.',
    directAnswer:
      'ISO 286 hole/shaft letters are zone identities whose limit deviations change with size range. SC-027 screens equation-backed families with visible deviations — free — then escalate to stack-up when assembly closure is the real question.',
    decision:
      'Decide whether a proposed fit letter pair produces the clearance/transition/interference class you intend at the actual nominal diameter before drawings freeze.',
    inputs:
      'Nominal diameter, hole/shaft basis, and an exposed fit family that matches print language.',
    formula:
      'ES/EI (hole) and es/ei (shaft) from ISO 286 size-range logic for the selected family; extremes define clearance or interference.',
    interpretation:
      'Read min/max clearance or interference, not just the letter pair. Same letters at a new diameter are a new calculation.',
    sensitivity:
      'Diameter band and IT grade dominate. Plating and temperature deltas can consume the entire clearance if ignored.',
    assumptions:
      'Exposed equation-backed families only. Hole- or shaft-basis as selected. No invented unsupported zones.',
    limitations:
      'Not a full ISO 286 edition substitute. Not press-fit load analysis. Not a stack-up for multi-contributor gaps.',
    mistakes:
      'Treating H7/g6 as constant clearance; mixing basis systems; skipping stack-up after local fit pick.',
    standards:
      'Aligned with ISO 286 hole/shaft tolerance concepts in the implemented UI scope. Keep the governing edition for contract release.',
    audit:
      'Record diameter, family, deviations, and intended fit class on the traveler. Free tools still deserve reproducible notes.',
    commercial:
      'Screen free on SC-027. When the assembly chain matters, unlock SC-008 with credits for WC/RSS/Monte Carlo on the same job.',
  },
  'surface-finish': {
    problem: 'The drawing calls out Ra — the shop measures Rz. Which number do you release?',
    directAnswer:
      'Ra and Rz are different statistics of the same profile. SC-028 converts with a visible assumption — free — while measured capability on the accepted parameter still owns release.',
    decision:
      'Align drawing language with metrology practice before first article, without silently rewriting the acceptance parameter.',
    inputs: 'Known roughness value, source parameter, target parameter, and governing standard name.',
    formula: 'Parameter translation only with documented conversion basis shown on the page.',
    interpretation: 'Converted numbers are screening language — not a substitute for measuring the accepted parameter.',
    sensitivity: 'Filter settings, tip radius, and evaluation length move reported values as much as conversion.',
    assumptions: 'Conversion basis is explicit. Customer standards can override generic ratios.',
    limitations: 'Not PPAP proof alone. Not instrument capability certification.',
    mistakes: 'Ra released as Rz; converting by feel; ignoring instrument limits.',
    standards: 'Surface texture practice (ISO/ASME families) as referenced on the print — calculator does not invent acceptance.',
    audit: 'Copy conversion assumption + standard reference onto the traveler.',
    commercial: 'Free forever on SC-028. Pair with free fits; escalate stack-up when assembly risk dominates.',
  },
  'sheet-metal-bend': {
    problem: 'Flat pattern wrong by a few millimetres means the brake setup already failed.',
    directAnswer:
      'SC-030 computes bend allowance, deduction, and flat length from thickness, angle, inside radius, and K-factor — free — then you calibrate K-factor on your brake.',
    decision: 'Release a blank length credible enough for first hit before nesting steel.',
    inputs: 'Thickness, bend angle, inside radius, K-factor, and chosen BA vs BD accounting style.',
    formula: 'Flat ≈ legs + BA (or legs − BD) with K-factor locating the neutral axis.',
    interpretation: 'Catalog K-factors are starts. Coupon-calibrated K-factors own production.',
    sensitivity: 'Inside radius and K-factor move allowance nonlinearly; alloy temper changes springback.',
    assumptions: 'Single-bend screening model; shop K-factor overrides defaults when provided.',
    limitations: 'Not a full forming simulation; does not replace OEM minimum flange charts.',
    mistakes: 'One K-factor for all alloys; mixing BA/BD; skipping punch capacity checks.',
    standards: 'Shop tooling practice + customer flat-pattern specs when locked on the print.',
    audit: 'Record K-factor basis, radius, and accounting style with the nest.',
    commercial: 'Free on SC-030. Pair with free punching force before die spend.',
  },
  'punching-force': {
    problem: 'Press tonnage guessed from habit is how punches snap and frames ring.',
    directAnswer:
      'SC-039 estimates punching force from perimeter, thickness, and shear strength — free — for capacity screening before tooling. OEM charts still govern purchase.',
    decision: 'Screen whether press and tooling ratings cover the hit before ordering steel.',
    inputs: 'Perimeter, thickness, shear strength for material state, and required safety factor from your press standard.',
    formula: 'F ≈ perimeter × thickness × shear strength (units explicit).',
    interpretation: 'Near-limit estimates demand redesign or OEM confirmation — not hope.',
    sensitivity: 'Perimeter geometry and shear strength dominate; clearance affects edge quality and effective load.',
    assumptions: 'Shear strength matches material state; perimeter is true shear length.',
    limitations: 'Not OEM tonnage certification; not a substitute for stripper/energy checks.',
    mistakes: 'Area instead of perimeter; wrong material state; skipping OEM charts.',
    standards: 'Press/tooling OEM capacity practice with your required safety factors.',
    audit: 'Record F, ratings, clearance intent, and material state together.',
    commercial: 'Free on SC-039. Keep bend + punch free tools on the same traveler.',
  },
};
