/**
 * Lean Manufacturing Concepts + Metrics SSOT (RM-LEAN-001)
 *
 * Authority calculators live at /calculators/{metric}.
 * Legacy /lean/{concept}/{metric} spokes permanently redirect to those hubs.
 * This registry retains concept/metric metadata for the /lean methodology hub
 * and for redirect/sitemap verification.
 */

export interface LeanConcept {
  slug: string;
  name: string;
  description: string;
}

export interface LeanMetric {
  slug: string;
  name: string;
  unit: string;
  description: string;
  formula: string;
}

export interface LeanCalcEntry {
  concept: LeanConcept;
  metric: LeanMetric;
  slug: string;
  /** @deprecated Legacy spoke path — permanently redirects to canonicalPath */
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
}

export const LEAN_CONCEPTS_PUBLIC: readonly LeanConcept[] = [
  {
    slug: "pdca",
    name: "PDCA Cycle (Plan-Do-Check-Act)",
    description:
      "Systematic four-step continuous improvement methodology for process control and problem-solving.",
  },
  {
    slug: "gemba",
    name: "Gemba Walk",
    description: "Go to the actual place where work happens to observe, understand, and identify waste.",
  },
  {
    slug: "a3",
    name: "A3 Problem Solving",
    description:
      "Structured problem-solving on a single A3 sheet: root cause analysis, countermeasure, follow-up.",
  },
  {
    slug: "muda",
    name: "Muda (Waste Reduction)",
    description:
      "Identify and eliminate the seven wastes: transport, inventory, motion, waiting, over-processing, over-production, defects.",
  },
];

export const LEAN_METRICS_PUBLIC: readonly LeanMetric[] = [
  {
    slug: "takt-time",
    name: "Takt Time",
    unit: "minutes",
    description: "Available production time divided by customer demand — the heartbeat of a lean line.",
    formula: "Takt Time = Available Production Time / Customer Demand",
  },
  {
    slug: "oee",
    name: "OEE",
    unit: "%",
    description:
      "Availability × Performance × Quality — the gold standard for measuring manufacturing productivity.",
    formula: "OEE = Availability × Performance × Quality",
  },
  {
    slug: "scrap-rate",
    name: "Scrap Rate",
    unit: "%",
    description: "Percentage of production units discarded as waste — a direct measure of Muda.",
    formula: "Scrap Rate = (Scrap Units / Total Units) × 100",
  },
  {
    slug: "cycle-time",
    name: "Cycle Time",
    unit: "minutes",
    description: "Total time from operation start to finish for one unit — targeted for reduction in Gemba Kaizen.",
    formula: "Cycle Time = Total Production Time / Units Produced",
  },
  {
    slug: "capacity-utilization",
    name: "Capacity Utilization",
    unit: "%",
    description: "Actual output divided by maximum possible output — reveals hidden capacity loss.",
    formula: "Capacity Utilization = (Actual Output / Maximum Output) × 100",
  },
];

/** @deprecated Prefer LEAN_CONCEPTS_PUBLIC */
const LEAN_CONCEPTS = LEAN_CONCEPTS_PUBLIC;
/** @deprecated Prefer LEAN_METRICS_PUBLIC */
const LEAN_METRICS = LEAN_METRICS_PUBLIC;

function buildMatrix(): readonly LeanCalcEntry[] {
  const entries: LeanCalcEntry[] = [];
  for (const concept of LEAN_CONCEPTS) {
    for (const metric of LEAN_METRICS) {
      const slug = `${concept.slug}-${metric.slug}`;
      const canonicalPath = `/calculators/${metric.slug}`;
      entries.push({
        concept,
        metric,
        slug,
        path: `/lean/${concept.slug}/${metric.slug}`,
        canonicalPath,
        title: `${metric.name} for ${concept.name}`,
        // RM-LEAN-001 GAP-2: no near-duplicate marketing boilerplate across the 20 legacy spokes.
        // Legacy path only exists for redirect SSOT; description is metric+framework role, not a template.
        description: `${metric.name} (${metric.formula}) in ${concept.name} context.`,
      });
    }
  }
  return Object.freeze(entries) as readonly LeanCalcEntry[];
}

export const LEAN_CALC_MATRIX: readonly LeanCalcEntry[] = buildMatrix();

export const LEAN_CONCEPT_SLUGS: readonly string[] = LEAN_CONCEPTS.map((c) => c.slug);

export const LEAN_METRIC_SLUGS: readonly string[] = LEAN_METRICS.map((m) => m.slug);

export function resolveLeanCalcEntry(concept: string, metric: string): LeanCalcEntry | undefined {
  return LEAN_CALC_MATRIX.find((e) => e.concept.slug === concept && e.metric.slug === metric);
}

/** Legacy spoke param pairs — retained for redirect verification and docs. */
export function getAllLeanCalcParams(): Array<{ concept: string; metric: string }> {
  return LEAN_CALC_MATRIX.map((e) => ({ concept: e.concept.slug, metric: e.metric.slug }));
}

export function getLeanSpokeLegacyPaths(): readonly string[] {
  return LEAN_CALC_MATRIX.map((e) => e.path);
}
