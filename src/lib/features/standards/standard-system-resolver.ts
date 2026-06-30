import type {
  EngineeringStandardFamily,
  StandardSelection,
  StandardSystem,
} from "@/lib/features/standards/engineering-standards-types";
import { isRegionalEngineCode, resolveRegionalCode } from "@/lib/features/regional/regions";

const FAMILY_DEFAULTS: Readonly<Record<string, Readonly<Partial<Record<EngineeringStandardFamily, StandardSystem>>>>> = {
  US: {
    welding: "AWS",
    thread: "UNC_UNF",
    "pressure-vessel": "ASME_BPVC",
    material: "ASTM_AISI",
    gdt: "ASME_Y14_5",
    "steel-section": "AISC",
  },
  TR: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "PED_EN_13445",
    material: "EN_DIN",
    gdt: "ISO_GPS",
    "steel-section": "EUROCODE",
  },
  DE: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "PED_EN_13445",
    material: "EN_DIN",
    gdt: "ISO_GPS",
    "steel-section": "EUROCODE",
  },
  FR: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "PED_EN_13445",
    material: "EN_DIN",
    gdt: "ISO_GPS",
    "steel-section": "EUROCODE",
  },
  ES: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "PED_EN_13445",
    material: "EN_DIN",
    gdt: "ISO_GPS",
    "steel-section": "EUROCODE",
  },
  AR: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "ASME_BPVC",
    material: "ASTM_AISI",
    gdt: "ISO_GPS",
    "steel-section": "AISC",
  },
  GLOBAL: {
    welding: "ISO_EN",
    thread: "ISO_METRIC",
    "pressure-vessel": "PED_EN_13445",
    material: "EN_DIN",
    gdt: "ISO_GPS",
    "steel-section": "EUROCODE",
  },
};

const SLUG_FAMILY_HINTS: ReadonlyArray<{ pattern: RegExp; family: EngineeringStandardFamily }> = [
  { pattern: /weld|fillet|groove/i, family: "welding" },
  { pattern: /bolt|thread|torque|nut/i, family: "thread" },
  { pattern: /pressure|vessel|tank/i, family: "pressure-vessel" },
  { pattern: /material|steel|aluminum|alloy/i, family: "material" },
  { pattern: /gdt|tolerance|flatness|parallelism/i, family: "gdt" },
  { pattern: /beam|section|i-beam|h-beam|column/i, family: "steel-section" },
];

export function inferStandardFamily(toolSlug: string): EngineeringStandardFamily | undefined {
  for (const hint of SLUG_FAMILY_HINTS) {
    if (hint.pattern.test(toolSlug)) {
      return hint.family;
    }
  }
  return undefined;
}

export function resolveDefaultStandardSystem(
  regionInput: string,
  family: EngineeringStandardFamily,
): StandardSystem {
  const regionCode = isRegionalEngineCode(regionInput.toUpperCase())
    ? regionInput.toUpperCase()
    : resolveRegionalCode({ regionCode: undefined, locale: "en" });
  const defaults = FAMILY_DEFAULTS[regionCode] ?? FAMILY_DEFAULTS.GLOBAL;
  return defaults[family] ?? "ISO_EN";
}

export function listStandardOptions(family: EngineeringStandardFamily): readonly StandardSelection[] {
  const byFamily: Readonly<Partial<Record<EngineeringStandardFamily, readonly StandardSystem[]>>> = {
    welding: ["AWS", "ISO_EN", "JIS"],
    thread: ["UNC_UNF", "ISO_METRIC", "JIS"],
    "pressure-vessel": ["ASME_BPVC", "PED_EN_13445"],
    material: ["ASTM_AISI", "EN_DIN", "JIS"],
    gdt: ["ASME_Y14_5", "ISO_GPS"],
    "steel-section": ["AISC", "EUROCODE"],
  };

  return (byFamily[family] ?? ["ISO_EN"]).map((system) => ({
    family,
    system,
    labelKey: `standards.systems.${system}`,
  }));
}

export function toolUsesEngineeringStandards(toolSlug: string): boolean {
  return inferStandardFamily(toolSlug) !== undefined;
}
