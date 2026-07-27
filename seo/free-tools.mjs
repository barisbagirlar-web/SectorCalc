/**
 * Free SEO-bait calculators SSOT.
 * These are Tier-B traffic tools — NOT Tier-A revenue gates.
 * Instant results: no sign-in, no credit debit.
 *
 * Keep in sync with:
 * - src/billing/domain/packages.ts
 * - functions/src/domain/packages.ts
 */
export const FREE_TOOLS = Object.freeze([
  {
    toolId: 'SC-028',
    sourceSlug: 'surface-finish-pro',
    entity: 'surface-finish',
    canonicalPath: '/calculator/surface-finish',
    name: 'Surface Finish (Ra / Rz)',
    problem: 'Drawing calls out Ra — shop measures Rz. Which number do you release?',
    directAnswer:
      'Convert between common roughness parameters (Ra, Rz, Rmax and related references) with explicit conversion assumptions visible on the page. Use it to align drawing language with metrology practice — not as a substitute for the governing surface-texture standard or measured process capability.',
    upsell: { href: '/calculator/tolerance-stack-up', label: 'Need stack-up risk next? Open SC-008 (credits)' },
  },
  {
    toolId: 'SC-027',
    sourceSlug: 'fits-pro',
    entity: 'iso-286-fits',
    canonicalPath: '/calculator/iso-286-fits',
    name: 'ISO 286 Fits',
    problem: 'H7/g6 looks familiar — until someone asks for the actual limit deviations.',
    directAnswer:
      'Look up ISO 286 hole/shaft tolerance zones and compute limit deviations for the selected nominal size and fit family. Use it to pick a fit before drawings freeze — not as a replacement for the full ISO 286 tables outside the exposed equation-backed families.',
    upsell: { href: '/calculator/tolerance-stack-up', label: 'Assembly still risky? Run tolerance stack-up (credits)' },
  },
  {
    toolId: 'SC-030',
    sourceSlug: 'bend-pro',
    entity: 'sheet-metal-bend',
    canonicalPath: '/calculator/sheet-metal-bend',
    name: 'Sheet Metal Bend / K-factor',
    problem: 'Flat pattern wrong by a few millimetres means the brake setup already failed.',
    directAnswer:
      'Compute bend allowance, bend deduction, and flat length from thickness, angle, inside radius, and K-factor. Use it to release a blank before the first hit — not as a substitute for shop-proven K-factors on your exact material and tooling.',
    upsell: { href: '/calculator/punching-force', label: 'Also free: punching force calculator' },
  },
  {
    toolId: 'SC-039',
    sourceSlug: 'punching-pro',
    entity: 'punching-force',
    canonicalPath: '/calculator/punching-force',
    name: 'Punching Force',
    problem: 'Press tonnage guessed from habit is how punches snap and frames ring.',
    directAnswer:
      'Estimate punching force from perimeter, thickness, and shear strength with clear unit handling. Use it to screen die and press capacity before tooling — not as a replacement for manufacturer tonnage charts or safety factors required by your press standard.',
    upsell: { href: '/calculator/sheet-metal-bend', label: 'Also free: sheet metal bend calculator' },
  },
  {
    toolId: 'SC-001',
    sourceSlug: 'weld-pro',
    entity: 'weld-thickness',
    canonicalPath: '/calculator/weld-thickness',
    name: 'Weld Thickness',
    problem: 'Throat and leg look interchangeable until the drawing review rejects the callout.',
    directAnswer:
      'Size fillet weld throat and leg relationships with formula-visible checks aligned to common AWS/ISO sizing language. Use it for early weld-size screening — not as a WPS/PQR or code stamp substitute. Heat-input / t8/5 lives on the credit-backed SC-029 tool.',
    upsell: { href: '/calculator/weld-heat-input', label: 'Need heat input / t8/5? Open SC-029 (credits)' },
  },
]);

export const FREE_TOOL_IDS = Object.freeze(new Set(FREE_TOOLS.map((t) => t.toolId)));
export const FREE_TOOL_SLUGS = Object.freeze(new Set(FREE_TOOLS.map((t) => t.sourceSlug)));
export const FREE_TOOL_ENTITIES = Object.freeze(new Set(FREE_TOOLS.map((t) => t.entity)));
export const FREE_TOOL_PATHS = Object.freeze(new Set(FREE_TOOLS.map((t) => t.canonicalPath)));

export function isFreeToolId(toolId) {
  return FREE_TOOL_IDS.has(toolId);
}

export function isFreeToolSlug(slug) {
  return FREE_TOOL_SLUGS.has(slug);
}

export function freeToolBySlug(slug) {
  return FREE_TOOLS.find((t) => t.sourceSlug === slug) || null;
}
