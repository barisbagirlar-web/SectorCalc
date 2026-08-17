/**
 * Compare hub catalog — SSOT for /compare enterprise hub.
 * Evidence-only framing: no invented competitor pricing, adoption counts, or accuracy claims.
 */
export const COMPARE_PAGES = Object.freeze([
  {
    slug: 'sectorcalc-vs-excel-tolerance',
    title: 'SectorCalc vs Excel for Tolerance Stack-Up',
    competitor: 'Excel spreadsheets',
    problem:
      'Spreadsheet stacks hide formulas, unit conversions, and seed assumptions until a review meeting exposes them.',
    angle:
      'When you need visible formulas, unit-safe Decimal math, seeded Monte Carlo bounds, and an A1–A5 audit trail you can defend — not another unprotected workbook.',
    bestFor: 'Engineers replacing tribal Excel stack templates with auditable client-side calculation.',
    calculator: '/calculator/tolerance-stack-up',
  },
  {
    slug: 'sectorcalc-vs-solidworks',
    title: 'SectorCalc vs SolidWorks for Design and Simulation',
    competitor: 'SolidWorks / CAD modules',
    problem:
      'CAD owns geometry and assembly context; shop-floor decision math still needs a separate audit trail outside the model tree.',
    angle:
      'Use CAD for design intent. Use SectorCalc when the question is feeds, stack-up, rates, weld size, or bearing life with formulas you can export to a traveler.',
    bestFor: 'Designers and manufacturing engineers who need calculation evidence alongside CAD models.',
    calculator: '/tools',
  },
  {
    slug: 'sectorcalc-vs-catia',
    title: 'SectorCalc vs CATIA for GD&T and Tolerance Analysis',
    competitor: 'CATIA / PLM CAD suites',
    problem:
      'Enterprise CAD suites excel at product definition; they are not always the fastest path for a deterministic shop calculation with portable audit output.',
    angle:
      'SectorCalc does not replace CATIA product definition. It owns focused industrial calculators with visible formulas and credit-backed Tier-A sessions.',
    bestFor: 'Teams that already live in CATIA but still need portable, equation-visible engineering previews.',
    calculator: '/calculator/tolerance-stack-up',
  },
  {
    slug: 'sectorcalc-vs-machinist-calculator',
    title: 'SectorCalc vs Machinist Calculator for Shop Floor Calculations',
    competitor: 'Classic machinist calculators',
    problem:
      'Pocket and app calculators are fast for one number — weak when the traveler needs assumptions, warnings, and engine identity.',
    angle:
      'SectorCalc keeps the shop-floor speed of a calculator while exposing formulas, units, warnings, and report hashes for review.',
    bestFor: 'Machinists and programmers who need both speed and defendable calculation records.',
    calculator: '/calculator/cnc-feeds-speeds',
  },
  {
    slug: 'sectorcalc-vs-minitab',
    title: 'SectorCalc vs Minitab for Statistical Analysis',
    competitor: 'Minitab / SPC suites',
    problem:
      'SPC suites own capability studies and control charts; they are not a replacement for deterministic machine, weld, or rate calculators.',
    angle:
      'Keep Minitab for statistical process work. Use SectorCalc when the job is engineering math with A1–A5 accountability, not a DOE worksheet.',
    bestFor: 'QA and process engineers who separate capability analysis from engineering calculators.',
    calculator: '/calculator/oee-teep',
  },
]);
