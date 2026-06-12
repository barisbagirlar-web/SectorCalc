import type {
  ReferenceGraphicTemplate,
  ResolveReferenceGraphicInput,
  ResolvedReferenceGraphic,
} from "@/lib/guidance/reference-graphic-types";
import {
  buildNormalizedFieldSet,
  collectCanonicalIds,
  normalizeFieldKey,
} from "@/lib/guidance/reference-field-normalizer";
import {
  CATEGORY_TEMPLATE_MAP,
  FIELD_SIGNATURE_TEMPLATES,
  KEYWORD_TEMPLATE_HINTS,
  SECTOR_TEMPLATE_MAP,
  SLUG_TEMPLATE_OVERRIDES,
  UNIT_GROUP_TEMPLATE_MAP,
} from "@/lib/guidance/reference-graphic-taxonomy";

const TEMPLATE_FIELD_IDS: Readonly<Record<ReferenceGraphicTemplate, readonly string[]>> = {
  "box-dimension": ["length", "width", "height", "depth"],
  area: ["length", "width", "area"],
  volume: ["length", "width", "height", "volume", "depth"],
  "cylinder-pipe": ["diameter", "radius", "length", "pressure", "flow"],
  stair: ["steps", "rise", "run", "angle", "thickness"],
  "bend-radius": ["materialThickness", "insideRadius", "bendAngle", "neutralAxis"],
  angle: ["angle", "rise", "run"],
  route: ["distance", "fuel", "stops", "routeCost"],
  "energy-flow": ["power", "energy", "runtime", "pressure", "flow", "carbon"],
  "machine-time": ["setupTime", "cycleTime", "quantity", "downtime", "availability", "setup", "time"],
  "financial-flow": ["cost", "price", "margin", "tax", "payment", "revenue", "profit"],
  generic: ["input", "process", "result", "decision"],
};

const FINANCE_CANONICAL = new Set(["cost", "price", "margin", "tax", "payment", "revenue", "profit"]);
const DIMENSION_CANONICAL = new Set(["length", "width", "height", "depth"]);
const AREA_CANONICAL = new Set(["area", "length", "width"]);
const VOLUME_CANONICAL = new Set(["volume", "length", "width", "height", "depth"]);
const PIPE_CANONICAL = new Set(["diameter", "radius", "pressure", "flow", "length"]);
const ANGLE_CANONICAL = new Set(["angle", "thickness", "insideRadius", "materialThickness", "bendAngle"]);
const ROUTE_CANONICAL = new Set(["distance", "fuel", "stops", "routeCost"]);
const ENERGY_CANONICAL = new Set(["energy", "power", "runtime", "pressure", "flow", "carbon"]);
const MACHINE_CANONICAL = new Set(["setup", "setupTime", "cycleTime", "time", "quantity", "downtime", "availability"]);

function hasAny(canonical: Set<string>, ids: Set<string>): boolean {
  for (const id of ids) {
    if (canonical.has(id)) {
      return true;
    }
  }
  return false;
}

function hasAll(canonical: Set<string>, ids: Set<string>): boolean {
  for (const id of canonical) {
    if (!ids.has(id)) {
      return false;
    }
  }
  return true;
}

function buildFieldMap(
  fields: ResolveReferenceGraphicInput["fields"],
  template: ReferenceGraphicTemplate,
): Record<string, string> {
  const map: Record<string, string> = {};
  const templateIds = new Set(TEMPLATE_FIELD_IDS[template]);

  for (const field of fields) {
    const canonical = normalizeFieldKey(field.key, field.label);
    if (canonical && templateIds.has(canonical)) {
      map[field.key] = canonical;
      continue;
    }
    if (template === "generic") {
      if (field.key.toLowerCase().includes("result") || field.key.toLowerCase().includes("output")) {
        map[field.key] = "result";
      } else if (field.key.toLowerCase().includes("decision") || field.key.toLowerCase().includes("verdict")) {
        map[field.key] = "decision";
      } else if (!map[field.key]) {
        const unmapped = Object.keys(map).length;
        if (unmapped === 0) {
          map[field.key] = "input";
        } else if (unmapped === 1) {
          map[field.key] = "process";
        } else if (unmapped === 2) {
          map[field.key] = "result";
        } else {
          map[field.key] = "decision";
        }
      }
    }
  }

  return map;
}

function matchFieldSignature(canonicalIds: Set<string>): ReferenceGraphicTemplate | null {
  for (const signature of FIELD_SIGNATURE_TEMPLATES) {
    const requiredOk = signature.required.every((id) => canonicalIds.has(id));
    if (!requiredOk) {
      continue;
    }
    if (signature.optional && !signature.optional.some((id) => canonicalIds.has(id))) {
      if (signature.optional.length > 0 && signature.template === "area") {
        continue;
      }
    }
    return signature.template;
  }
  return null;
}

function matchUnitGroups(
  fields: ResolveReferenceGraphicInput["fields"],
): ReferenceGraphicTemplate | null {
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

function fallbackFromCanonical(canonicalIds: Set<string>): ReferenceGraphicTemplate {
  if (hasAny(FINANCE_CANONICAL, canonicalIds)) {
    return "financial-flow";
  }
  if (hasAll(DIMENSION_CANONICAL, canonicalIds) || (canonicalIds.has("length") && canonicalIds.has("width") && canonicalIds.has("height"))) {
    return "box-dimension";
  }
  if (hasAny(AREA_CANONICAL, canonicalIds) && canonicalIds.has("area")) {
    return "area";
  }
  if (hasAny(VOLUME_CANONICAL, canonicalIds) && (canonicalIds.has("volume") || (canonicalIds.has("length") && canonicalIds.has("width") && canonicalIds.has("depth")))) {
    return "volume";
  }
  if (hasAny(PIPE_CANONICAL, canonicalIds)) {
    return "cylinder-pipe";
  }
  if (hasAny(ANGLE_CANONICAL, canonicalIds)) {
    return canonicalIds.has("bendAngle") || canonicalIds.has("materialThickness") ? "bend-radius" : "angle";
  }
  if (hasAny(ROUTE_CANONICAL, canonicalIds)) {
    return "route";
  }
  if (hasAny(ENERGY_CANONICAL, canonicalIds)) {
    return "energy-flow";
  }
  if (hasAny(MACHINE_CANONICAL, canonicalIds)) {
    return "machine-time";
  }
  if (canonicalIds.has("length") && canonicalIds.has("width")) {
    return "area";
  }
  if (canonicalIds.has("length") || canonicalIds.has("width") || canonicalIds.has("height") || canonicalIds.has("depth")) {
    return "box-dimension";
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
    const signatureMatch = matchFieldSignature(canonicalIds);
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
