/** ISO 9001:2015 & ECMI reference constants for DeepSeek schema generation. */
export const INDUSTRIAL_STANDARDS = {
  iso: ["ISO 3685", "ISO 3002/1", "ISO 841", "ISO 50001", "ISO 14001"] as const,
  ecmi:
    "European Consortium for Mathematics in Industry – Industrial Mathematics Framework",
  quality: "ISO 9001:2015 – Design & Development (8.3)",
} as const;

export const INDUSTRIAL_DOMAIN_REFERENCES = `
Industrial standards reference (apply when domain matches):
- Mechanical: ASME BPVC, ISO 3685 (cutting), ISO 3002/1 (machining)
- Electrical: IEC 60038, IEC 60364
- Thermodynamics: ISO 8301, Stefan-Boltzmann
- Finance: IFRS, GAAP principles
`.trim();

export const ALLOWED_FORMULA_OPERATORS = `
Allowed in formulas ONLY:
+ - * / ** ( ) Math.sin Math.cos Math.sqrt Math.log Math.exp Math.pow
Math.ceil Math.floor Math.round Math.min Math.max Math.abs Math.PI
Ternary ? : for conditional logic.
FORBIDDEN: f(), g(), calculate(), solve(), assignment statements, undefined functions.
`.trim();
