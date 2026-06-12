import path from "node:path";

export const ROOT = process.cwd();
export const ACTIVATION_DIR = path.join(ROOT, ".sectorcalc", "tool-activation");
export const SCAN_REPORT_PATH = path.join(ACTIVATION_DIR, "scan-report.json");
export const DRAFTS_DIR = path.join(ACTIVATION_DIR, "drafts");
export const REVIEWS_DIR = path.join(ACTIVATION_DIR, "reviews");
export const APPLIED_DIR = path.join(ACTIVATION_DIR, "applied");
export const STAGING_DIR = path.join(ACTIVATION_DIR, "staging");

/** P53 hard-locked reference tool slug. */
export const P53_REFERENCE_SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";

export function draftPath(slug) {
  return path.join(DRAFTS_DIR, `${slug}.json`);
}

export function reviewPath(slug) {
  return path.join(REVIEWS_DIR, `${slug}.md`);
}

export function appliedManifestPath(slug) {
  return path.join(APPLIED_DIR, `${slug}.json`);
}

export function stagingPath(slug) {
  return path.join(STAGING_DIR, `${slug}.json`);
}
