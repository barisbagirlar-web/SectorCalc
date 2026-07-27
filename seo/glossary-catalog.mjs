/**
 * Glossary hub catalog — SSOT for /glossary enterprise hub.
 * English-only. Each term links to a published glossary article + related calculator when known.
 */
export const GLOSSARY_GROUPS = Object.freeze([
  {
    id: 'tolerance-metrology',
    title: 'Tolerance, GD&T & metrology',
    intro:
      'Terms that decide whether an assembly closes, a fit slides, or a finish callout survives first-article review.',
    terms: [
      {
        slug: 'tolerance-stack-up',
        title: 'Tolerance Stack-Up',
        blurb: '1D linear analysis that sums dimensional contributors to predict gap or interference risk.',
        calculator: '/calculator/tolerance-stack-up',
      },
      {
        slug: 'rss-tolerance',
        title: 'RSS Tolerance',
        blurb: 'Root-sum-square statistical stack method used when contributors are treated as independent.',
        calculator: '/calculator/tolerance-stack-up',
      },
      {
        slug: 'monte-carlo-simulation',
        title: 'Monte Carlo Simulation',
        blurb: 'Seeded statistical sampling of stacked contributors for distribution-aware assembly risk.',
        calculator: '/calculator/tolerance-stack-up',
      },
      {
        slug: 'worst-case-analysis',
        title: 'Worst-Case Analysis',
        blurb: 'Arithmetic extreme-material stack that assumes every contributor sits at its legal extreme.',
        calculator: '/calculator/tolerance-stack-up',
      },
      {
        slug: 'asme-y14-5',
        title: 'ASME Y14.5',
        blurb: 'Drawing language and datum practice that frames GD&T callouts on North American prints.',
        calculator: null,
      },
      {
        slug: 'iso-286-fits',
        title: 'ISO 286 Fits',
        blurb: 'Hole and shaft tolerance zones whose limit deviations change with diameter band.',
        calculator: '/calculator/iso-286-fits',
      },
      {
        slug: 'surface-finish-ra-rz',
        title: 'Surface Finish (Ra / Rz)',
        blurb: 'Roughness parameters that are not interchangeable without an explicit conversion basis.',
        calculator: '/calculator/surface-finish',
      },
      {
        slug: 'process-capability-cpk',
        title: 'Process Capability Cpk',
        blurb: 'Capability index that compares process spread and centering against specification limits.',
        calculator: null,
      },
    ],
  },
  {
    id: 'cnc-machining',
    title: 'CNC machining & tool life',
    intro: 'Feeds, speeds, chip load, and tool-life vocabulary used when a cut must release on the spindle you own.',
    terms: [
      {
        slug: 'cnc-feeds-and-speeds',
        title: 'CNC Feeds and Speeds',
        blurb: 'Surface speed, spindle RPM, feed per tooth, and material-removal rate for a stable cut.',
        calculator: '/calculator/cnc-feeds-speeds',
      },
      {
        slug: 'chip-thinning',
        title: 'Chip Thinning',
        blurb: 'Effective chip thickness drop in light radial engagement that requires feed compensation.',
        calculator: '/calculator/cnc-feeds-speeds',
      },
      {
        slug: 'taylor-tool-life',
        title: 'Taylor Tool Life',
        blurb: 'Classic VTⁿ = C relationship used to screen how cutting speed trades against tool life.',
        calculator: '/calculator/cnc-feeds-speeds',
      },
    ],
  },
  {
    id: 'reliability',
    title: 'Bearings & rotating equipment',
    intro: 'Life and rating language for bearings when load, speed, and lubrication define release risk.',
    terms: [
      {
        slug: 'bearing-l10-life',
        title: 'Bearing L10 Life',
        blurb: 'Basic rating life at which 90% of a bearing population is expected to survive under stated load.',
        calculator: '/calculator/bearing-life-l10',
      },
      {
        slug: 'iso-281',
        title: 'ISO 281',
        blurb: 'International basis for rolling-bearing dynamic load ratings and basic rating life.',
        calculator: '/calculator/bearing-life-l10',
      },
    ],
  },
  {
    id: 'fastening',
    title: 'Bolted joints & preload',
    intro: 'Preload, friction, and joint stiffness terms that decide whether a clamp load survives service.',
    terms: [
      {
        slug: 'bolt-preload',
        title: 'Bolt Preload',
        blurb: 'Initial tensile force introduced by tightening — the clamp load that holds the joint.',
        calculator: '/calculator/bolt-torque-preload',
      },
      {
        slug: 'vdi-2230-bolted-joint',
        title: 'VDI 2230 Bolted Joint',
        blurb: 'Guideline framework for bolted-joint verification including stiffness and load sharing.',
        calculator: '/calculator/bolted-joint',
      },
    ],
  },
  {
    id: 'pressure',
    title: 'Pressure equipment & piping',
    intro: 'Code-facing thickness and vessel vocabulary used for internal-pressure screening — not a PE stamp.',
    terms: [
      {
        slug: 'asme-b31-pipe-wall',
        title: 'ASME B31 Pipe Wall',
        blurb: 'Pipe wall thickness language for internal-pressure design under ASME B31 piping codes.',
        calculator: '/calculator/pipe-wall-thickness',
      },
      {
        slug: 'asme-viii-pressure-vessel',
        title: 'ASME VIII Pressure Vessel',
        blurb: 'Pressure-vessel shell thickness language under ASME Section VIII scope assumptions.',
        calculator: '/calculator/pressure-vessel-shell',
      },
    ],
  },
  {
    id: 'welding',
    title: 'Welding & fabrication',
    intro: 'Throat, heat input, bend, and punch terms that gate drawing callouts and process windows.',
    terms: [
      {
        slug: 'weld-throat',
        title: 'Weld Throat',
        blurb: 'Effective throat dimension that governs fillet-weld strength on the drawing.',
        calculator: '/calculator/weld-thickness',
      },
      {
        slug: 'heat-input-t85',
        title: 'Heat Input t8/5',
        blurb: 'Cooling-time estimate between 800 °C and 500 °C used to screen weld thermal cycles.',
        calculator: '/calculator/weld-heat-input',
      },
      {
        slug: 'sheet-metal-k-factor',
        title: 'Sheet Metal K-Factor',
        blurb: 'Neutral-axis location factor used to compute bend allowance and flat pattern length.',
        calculator: '/calculator/sheet-metal-bend',
      },
    ],
  },
  {
    id: 'lifting',
    title: 'Lifting & rigging',
    intro: 'Angle and hardware terms that derate sling capacity when legs leave vertical.',
    terms: [
      {
        slug: 'sling-angle-factor',
        title: 'Sling Angle Factor',
        blurb: 'Geometric derating of sling capacity as the included angle moves away from vertical.',
        calculator: '/calculator/sling-capacity',
      },
    ],
  },
  {
    id: 'economics',
    title: 'Manufacturing economics & OEE',
    intro: 'Rate, burden, and effectiveness terms that decide whether a quote recovers real cost.',
    terms: [
      {
        slug: 'labor-burden-rate',
        title: 'Labor Burden Rate',
        blurb: 'Fully burdened labor cost including taxes, benefits, and shop overhead allocation.',
        calculator: '/calculator/true-labor-cost',
      },
      {
        slug: 'machine-hour-rate',
        title: 'Machine Hour Rate',
        blurb: 'Shop rate that recovers ownership, operating, and overhead cost per productive machine hour.',
        calculator: '/calculator/machine-hour-rate',
      },
      {
        slug: 'oee-overall-equipment-effectiveness',
        title: 'OEE (Overall Equipment Effectiveness)',
        blurb: 'Availability × performance × quality product used to quantify productive equipment time.',
        calculator: '/calculator/oee-teep',
      },
    ],
  },
  {
    id: 'platform',
    title: 'SectorCalc platform language',
    intro: 'How SectorCalc describes deterministic calculation ownership — not AI-generated math.',
    terms: [
      {
        slug: 'deterministic-engine',
        title: 'Deterministic Engine',
        blurb: 'Client-side calculation runtime with visible formulas, Decimal-native math, and A1–A5 audit trails.',
        calculator: '/tools.html',
      },
    ],
  },
]);

export const GLOSSARY_TERMS = Object.freeze(GLOSSARY_GROUPS.flatMap((g) => g.terms));
