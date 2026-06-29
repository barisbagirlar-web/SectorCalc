/**
 * Shared calculation helpers for roadmap free batch-1 calculators.
 */
import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  normalizeLocale,
  type SupportedLocale,
} from "@/lib/format/localization";
import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";

export type Batch1CalcPartial = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly explanation: string;
  readonly missingFactors: readonly string[];
};

let _locale: SupportedLocale = "en";

export function setBatch1FormatLocale(locale: SupportedLocale | string): void {
  _locale = normalizeLocale(locale);
}

function n(values: FreeTrafficInputValues, key: string): number {
  const raw = values[key];
  const parsed = typeof raw === "number" ? raw : Number(String(raw ?? "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function fmtNum(value: number, digits = 2): string {
  return formatLocalizedNumber(value, _locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function fmtCur(value: number, digits = 2): string {
  return formatLocalizedCurrency(value, _locale, "USD", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : undefined,
  });
}

function safeDivide(a: number, b: number): number {
  if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
    return 0;
  }
  const result = a / b;
  return Number.isFinite(result) ? result : 0;
}

function str(values: FreeTrafficInputValues, key: string): string {
  const raw = values[key];
  return typeof raw === "string" ? raw : String(raw ?? "");
}

function convertAllUnits(
  value: number,
  fromUnit: string,
  factors: Record<string, number>,
  labels: Record<string, string>,
  digits = 4,
): { readonly label: string; readonly value: string }[] {
  const fromFactor = factors[fromUnit];
  if (!Number.isFinite(value) || fromFactor === undefined) {
    return [];
  }
  const base = value * fromFactor;
  return Object.entries(factors).map(([unit, factor]) => ({
    label: labels[unit] ?? unit,
    value: fmtNum(safeDivide(base, factor), digits),
  }));
}

export type Batch1UnitSpec = {
  readonly kind: "unit";
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryUnit: string;
  readonly explanation: string;
  readonly factors: Record<string, number>;
  readonly labels: Record<string, string>;
};

export type Batch1FormulaSpec =
  | Batch1UnitSpec
  | {
      readonly kind: "multiply";
      readonly headline: string;
      readonly primaryLabel: string;
      readonly keys: readonly [string, string];
      readonly format: "number" | "currency";
      readonly explanation: string;
    }
  | {
      readonly kind: "multiply3";
      readonly headline: string;
      readonly primaryLabel: string;
      readonly keys: readonly [string, string, string];
      readonly format: "number" | "currency";
      readonly explanation: string;
    }
  | {
      readonly kind: "divide";
      readonly headline: string;
      readonly primaryLabel: string;
      readonly numerator: string;
      readonly denominator: string;
      readonly format: "number" | "currency";
      readonly explanation: string;
    }
  | {
      readonly kind: "circle";
      readonly headline: string;
      readonly radiusKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "cylinder";
      readonly headline: string;
      readonly radiusKey: string;
      readonly heightKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "triangle";
      readonly headline: string;
      readonly baseKey: string;
      readonly heightKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "weighted_avg";
      readonly headline: string;
      readonly valueKeys: readonly [string, string, string];
      readonly weightKeys: readonly [string, string, string];
      readonly explanation: string;
    }
  | {
      readonly kind: "random_int";
      readonly headline: string;
      readonly minKey: string;
      readonly maxKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "subtract";
      readonly headline: string;
      readonly primaryLabel: string;
      readonly aKey: string;
      readonly bKey: string;
      readonly format: "number" | "currency";
      readonly explanation: string;
    }
  | {
      readonly kind: "power_kw_from_amps";
      readonly headline: string;
      readonly ampsKey: string;
      readonly voltsKey: string;
      readonly powerFactorKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "identity";
      readonly headline: string;
      readonly primaryLabel: string;
      readonly key: string;
      readonly format: "number" | "currency";
      readonly explanation: string;
    }
  | {
      readonly kind: "btu_hvac";
      readonly headline: string;
      readonly areaKey: string;
      readonly heightKey: string;
      readonly factorKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "trapezoid";
      readonly headline: string;
      readonly baseAKey: string;
      readonly baseBKey: string;
      readonly heightKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "sphere";
      readonly headline: string;
      readonly radiusKey: string;
      readonly explanation: string;
    }
  | {
      readonly kind: "cone";
      readonly headline: string;
      readonly radiusKey: string;
      readonly heightKey: string;
      readonly explanation: string;
    };

export function runBatch1Formula(
  spec: Batch1FormulaSpec,
  values: FreeTrafficInputValues,
): Batch1CalcPartial {
  if (spec.kind === "unit") {
    const value = n(values, "value");
    const fromUnit = str(values, "fromUnit");
    const fromFactor = spec.factors[fromUnit] ?? 0;
    const base = value * fromFactor;
    const primaryFactor = spec.factors[spec.primaryUnit] ?? 1;
    const primary = safeDivide(base, primaryFactor);
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: `${fmtNum(primary, 6)} ${spec.primaryUnit}`,
      secondaryValues: convertAllUnits(value, fromUnit, spec.factors, spec.labels),
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "multiply") {
    const result = n(values, spec.keys[0]) * n(values, spec.keys[1]);
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: spec.format === "currency" ? fmtCur(result) : fmtNum(result),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "multiply3") {
    const result =
      n(values, spec.keys[0]) * n(values, spec.keys[1]) * n(values, spec.keys[2]);
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: spec.format === "currency" ? fmtCur(result) : fmtNum(result),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "divide") {
    const result = safeDivide(n(values, spec.numerator), n(values, spec.denominator));
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: spec.format === "currency" ? fmtCur(result) : fmtNum(result),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "subtract") {
    const result = n(values, spec.aKey) - n(values, spec.bKey);
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: spec.format === "currency" ? fmtCur(result) : fmtNum(result),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "circle") {
    const radius = n(values, spec.radiusKey);
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    return {
      headline: spec.headline,
      primaryLabel: "Area",
      primaryValue: `${fmtNum(area, 4)} m²`,
      secondaryValues: [{ label: "Circumference", value: `${fmtNum(circumference, 4)} m` }],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "cylinder") {
    const radius = n(values, spec.radiusKey);
    const height = n(values, spec.heightKey);
    const volume = Math.PI * radius * radius * height;
    return {
      headline: spec.headline,
      primaryLabel: "Volume",
      primaryValue: `${fmtNum(volume, 4)} m³`,
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "triangle") {
    const base = n(values, spec.baseKey);
    const height = n(values, spec.heightKey);
    const area = (base * height) / 2;
    return {
      headline: spec.headline,
      primaryLabel: "Area",
      primaryValue: `${fmtNum(area, 4)} m²`,
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "weighted_avg") {
    const valuesArr = spec.valueKeys.map((key) => n(values, key));
    const weights = spec.weightKeys.map((key) => n(values, key));
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    const weighted =
      weightSum > 0
        ? valuesArr.reduce((sum, val, idx) => sum + val * weights[idx], 0) / weightSum
        : 0;
    return {
      headline: spec.headline,
      primaryLabel: "Weighted average",
      primaryValue: fmtNum(weighted, 4),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "random_int") {
    const min = Math.floor(n(values, spec.minKey));
    const max = Math.floor(n(values, spec.maxKey));
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    const span = high - low + 1;
    const result = span > 0 ? low + Math.floor(Math.random() * span) : low;
    return {
      headline: spec.headline,
      primaryLabel: "Random integer",
      primaryValue: fmtNum(result, 0),
      secondaryValues: [{ label: "Range", value: `${low} – ${high}` }],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "power_kw_from_amps") {
    const kw = (n(values, spec.ampsKey) * n(values, spec.voltsKey) * n(values, spec.powerFactorKey)) / 1000;
    return {
      headline: spec.headline,
      primaryLabel: "Power",
      primaryValue: `${fmtNum(kw, 3)} kW`,
      secondaryValues: [{ label: "Watts", value: fmtNum(kw * 1000, 1) }],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "identity") {
    const result = n(values, spec.key);
    return {
      headline: spec.headline,
      primaryLabel: spec.primaryLabel,
      primaryValue: spec.format === "currency" ? fmtCur(result) : fmtNum(result, 4),
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "btu_hvac") {
    const btu = n(values, spec.areaKey) * n(values, spec.heightKey) * n(values, spec.factorKey);
    return {
      headline: spec.headline,
      primaryLabel: "Cooling load",
      primaryValue: `${fmtNum(btu, 0)} BTU/h`,
      secondaryValues: [{ label: "kW approx.", value: fmtNum(btu / 3412.142, 2) }],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "trapezoid") {
    const baseA = n(values, spec.baseAKey);
    const baseB = n(values, spec.baseBKey);
    const height = n(values, spec.heightKey);
    const area = ((baseA + baseB) / 2) * height;
    return {
      headline: spec.headline,
      primaryLabel: "Area",
      primaryValue: `${fmtNum(area, 4)} m²`,
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "sphere") {
    const radius = n(values, spec.radiusKey);
    const volume = (4 / 3) * Math.PI * radius ** 3;
    return {
      headline: spec.headline,
      primaryLabel: "Volume",
      primaryValue: `${fmtNum(volume, 4)} m³`,
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  if (spec.kind === "cone") {
    const radius = n(values, spec.radiusKey);
    const height = n(values, spec.heightKey);
    const volume = (1 / 3) * Math.PI * radius ** 2 * height;
    return {
      headline: spec.headline,
      primaryLabel: "Volume",
      primaryValue: `${fmtNum(volume, 4)} m³`,
      secondaryValues: [],
      explanation: spec.explanation,
      missingFactors: [],
    };
  }

  throw new Error(`Unknown batch-1 formula kind: ${(spec as { kind: string }).kind}`);
}
