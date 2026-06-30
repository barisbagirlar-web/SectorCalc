import type {
  ReferenceGraphicTemplate,
  ResolveReferenceGraphicInput,
  ResolvedReferenceGraphic,
} from "@/lib/content/guidance/reference-graphic-types";
import type { NormalizedReferenceField } from "@/lib/content/guidance/reference-field-normalizer";
import {
  buildNormalizedFieldSet,
  collectCanonicalIds,
  normalizeReferenceField,
} from "@/lib/content/guidance/reference-field-normalizer";
import {
  CATEGORY_TEMPLATE_MAP,
  FIELD_SIGNATURE_TEMPLATES,
  KEYWORD_TEMPLATE_HINTS,
  SECTOR_TEMPLATE_MAP,
  SLUG_TEMPLATE_OVERRIDES,
  UNIT_GROUP_TEMPLATE_MAP,
} from "@/lib/content/guidance/reference-graphic-taxonomy";

const TEMPLATE_FIELD_IDS: Readonly<Record<ReferenceGraphicTemplate, readonly string[]>> = {
  "box-dimension": ["length", "width", "height", "depth", "volume"],
  "wall-area": ["length", "width", "height", "area"],
  volume: ["length", "width", "height", "depth", "volume"],
  "cylinder-pipe": ["diameter", "radius", "length", "pressure", "flow"],
  stair: ["steps", "riserRise", "treadRun", "stairThickness", "angle", "height", "width"],
  "bend-radius": ["materialThickness", "insideRadius", "bendAngle", "neutralAxis", "thickness", "angle", "radius"],
  "compressor-leak": ["pressure", "leakDiameter", "runtime", "energy", "cost", "flow"],
  angle: ["angle", "riserRise", "treadRun"],
  route: ["distance", "fuel", "cost"],
  "energy-flow": ["power", "energy", "runtime", "pressure", "flow", "cost"],
  "machine-time": ["setupTime", "cycleTime", "quantity", "downtime", "runtime"],
  "financial-flow": ["cost", "price", "margin", "tax", "labor", "quantity"],
  "oee-flow": [
    "availability",
    "performance",
    "quality",
    "plannedHours",
    "downtimeHours",
    "machineRate",
    "materialCost",
    "scrapRate",
    "quotedPrice",
  ],
  generic: ["input", "process", "result", "decision"],
};

function hasAny(canonical: Set<NormalizedReferenceField>, ids: readonly string[]): boolean {
  return ids.some((id) => canonical.has(id as NormalizedReferenceField));
}

function hasAll(canonical: Set<NormalizedReferenceField>, ids: readonly string[]): boolean {
  return ids.every((id) => canonical.has(id as NormalizedReferenceField));
}

function buildFieldMap(
  fields: ResolveReferenceGraphicInput["fields"],
  template: ReferenceGraphicTemplate,
): Record<string, string> {
  const map: Record<string, string> = {};
  const templateIds = new Set(TEMPLATE_FIELD_IDS[template]);

  for (const field of fields) {
    const canonical = normalizeReferenceField(field.key, field.label);
    if (canonical !== "unknown" && templateIds.has(canonical)) {
      map[field.key] = canonical;
      continue;
    }
    if (template === "generic") {
      if (field.key.toLowerCase().includes("result") || field.key.toLowerCase().includes("output")) {
        map[field.key] = "result";
      } else if (field.key.toLowerCase().includes("decision") || field.key.toLowerCase().includes("verdict")) {
        map[field.key] = "decision";
      } else if (!map[field.key]) {
        const mappedCount = Object.keys(map).length;
        map[field.key] =
          mappedCount === 0 ? "input" : mappedCount === 1 ? "process" : mappedCount === 2 ? "result" : "decision";
      }
    }
  }

  return map;
}

function matchFieldSignature(canonicalIds: Set<NormalizedReferenceField>): ReferenceGraphicTemplate | null {
  for (const signature of FIELD_SIGNATURE_TEMPLATES) {
    const requiredOk = signature.required.every((id) => canonicalIds.has(id as NormalizedReferenceField));
    if (!requiredOk) {
      continue;
    }
    if (signature.optional && signature.optional.length > 0) {
      const hasOptional = signature.optional.some((id) => canonicalIds.has(id as NormalizedReferenceField));
      if (signature.template === "wall-area" && !hasOptional && !canonicalIds.has("area")) {
        if (!canonicalIds.has("length") || !canonicalIds.has("width")) {
          continue;
        }
      }
    }
    return signature.template;
  }
  return null;
}

function matchFieldSignatureRules(canonicalIds: Set<NormalizedReferenceField>): ReferenceGraphicTemplate | null {
  if (
    hasAll(canonicalIds, ["length", "width", "height"]) ||
    hasAll(canonicalIds, ["length", "width", "depth"]) ||
    (hasAny(canonicalIds, ["depth", "volume"]) && hasAny(canonicalIds, ["length", "width"]))
  ) {
    return "box-dimension";
  }
  if (hasAll(canonicalIds, ["length", "width"]) && hasAny(canonicalIds, ["area", "height"])) {
    return "wall-area";
  }
  if (hasAny(canonicalIds, ["insideRadius", "materialThickness", "bendAngle", "neutralAxis"])) {
    return "bend-radius";
  }
  if (hasAny(canonicalIds, ["steps", "riserRise", "treadRun"])) {
    return "stair";
  }
  if (hasAny(canonicalIds, ["pressure", "leakDiameter", "runtime"]) && hasAny(canonicalIds, ["pressure", "leakDiameter"])) {
    return "compressor-leak";
  }
  if (hasAny(canonicalIds, ["setupTime", "cycleTime", "downtime"]) || (hasAny(canonicalIds, ["setupTime", "cycleTime"]) && hasAny(canonicalIds, ["quantity"]))) {
    return "machine-time";
  }
  if (hasAny(canonicalIds, ["cost", "price", "margin", "tax", "labor"])) {
    return "financial-flow";
  }
  if (hasAny(canonicalIds, ["energy", "power", "runtime"])) {
    return "energy-flow";
  }
  if (hasAny(canonicalIds, ["distance", "fuel"])) {
    return "route";
  }
  return null;
}

function matchUnitGroups(fields: ResolveReferenceGraphicInput["fields"]): ReferenceGraphicTemplate | null {
  const scores = new Map<ReferenceGraphicTemplate, number>();
  for (const field of fields) {
    if (!field.unitGroup) {
      continue;
    }
    const template = UNIT_GROUP_TEMPLATE_MAP[field.unitGroup.toLowerCase()];
    if (template) {
      scores.set(template, (scores.get(template) ?? 0) + 1);
    }
  }
  let best: ReferenceGraphicTemplate | null = null;
  let bestScore = 0;
  for (const [template, score] of scores) {
    if (score > bestScore) {
      best = template;
      bestScore = score;
    }
  }
  return best;
}

function matchKeywords(input: ResolveReferenceGraphicInput): ReferenceGraphicTemplate | null {
  const haystack = [
    input.toolSlug,
    input.toolTitle ?? "",
    input.toolCategory ?? "",
    input.toolSector ?? "",
    ...input.fields.map((f) => `${f.key} ${f.label ?? ""}`),
  ]
    .join(" ")
    .toLowerCase();

  for (const hint of KEYWORD_TEMPLATE_HINTS) {
    if (hint.keywords.some((kw) => haystack.includes(kw.toLowerCase()))) {
      return hint.template;
    }
  }
  return null;
}

function fallbackFromCanonical(canonicalIds: Set<NormalizedReferenceField>): ReferenceGraphicTemplate {
  const signature = matchFieldSignatureRules(canonicalIds);
  if (signature) {
    return signature;
  }
  if (hasAny(canonicalIds, ["length", "width", "height", "depth"])) {
    return "box-dimension";
  }
  if (hasAny(canonicalIds, ["area", "length", "width"])) {
    return "wall-area";
  }
  if (hasAny(canonicalIds, ["diameter", "radius", "pressure", "flow"])) {
    return "cylinder-pipe";
  }
  return "generic";
}

export function resolveReferenceGraphic(input: ResolveReferenceGraphicInput): ResolvedReferenceGraphic {
  const normalized = buildNormalizedFieldSet(input.fields);
  const canonicalIds = collectCanonicalIds(normalized);

  let template: ReferenceGraphicTemplate = "generic";
  let confidence: ResolvedReferenceGraphic["confidence"] = "fallback";

  const slugOverride = SLUG_TEMPLATE_OVERRIDES[input.toolSlug];
  if (slugOverride) {
    template = slugOverride;
    confidence = "high";
  } else if (input.toolCategory && CATEGORY_TEMPLATE_MAP[input.toolCategory]) {
    template = CATEGORY_TEMPLATE_MAP[input.toolCategory];
    confidence = "medium";
  } else if (input.toolSector && SECTOR_TEMPLATE_MAP[input.toolSector.toLowerCase()]) {
    template = SECTOR_TEMPLATE_MAP[input.toolSector.toLowerCase()];
    confidence = "medium";
  } else {
    const signatureMatch = matchFieldSignature(canonicalIds) ?? matchFieldSignatureRules(canonicalIds);
    if (signatureMatch) {
      template = signatureMatch;
      confidence = "high";
    } else {
      const unitMatch = matchUnitGroups(input.fields);
      if (unitMatch) {
        template = unitMatch;
        confidence = "medium";
      } else {
        const keywordMatch = matchKeywords(input);
        if (keywordMatch) {
          template = keywordMatch;
          confidence = "medium";
        } else {
          template = fallbackFromCanonical(canonicalIds);
          confidence = template === "generic" ? "fallback" : "medium";
        }
      }
    }
  }

  const fieldMap = buildFieldMap(input.fields, template);
  const activeFieldIds = [...new Set(Object.values(fieldMap))];

  return {
    template,
    title: "",
    description: "",
    fieldMap,
    activeFieldIds,
    confidence,
  };
}
