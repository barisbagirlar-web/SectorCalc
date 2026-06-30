import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type { CarbonEmissionFactorMap } from "@/lib/carbon/carbon-footprint-report";
import { DEFAULT_CARBON_EMISSION_FACTOR_MAP } from "@/lib/carbon/carbon-footprint-report";

export type EmissionFactorCategory =
  | "electricity"
  | "naturalGas"
  | "diesel"
  | "gasoline"
  | "lpg"
  | "coal"
  | "freight_road"
  | "freight_sea"
  | "freight_air"
  | "employee_commute"
  | "business_flight"
  | "waste"
  | "purchasedGoods";

export type EmissionFactor = {
  readonly category: EmissionFactorCategory;
  readonly unit: string;
  readonly factor: number;
  readonly source: string;
  readonly lastUpdated: Date;
};

export type UserEmissionFactorOverride = {
  readonly category: EmissionFactorCategory;
  readonly factor: number;
  readonly lastUpdated: Date;
};

const GLOBAL_FACTORS_COLLECTION = "emissionFactors";

export const DEFAULT_EMISSION_FACTORS: readonly EmissionFactor[] = [
  {
    category: "electricity",
    unit: "kWh",
    factor: 0.45,
    source: "Türkiye Ortalama",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "naturalGas",
    unit: "kWh",
    factor: 0.202,
    source: "IPCC",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "diesel",
    unit: "litre",
    factor: 2.68,
    source: "IPCC",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "gasoline",
    unit: "litre",
    factor: 2.31,
    source: "IPCC",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "lpg",
    unit: "litre",
    factor: 1.51,
    source: "IPCC",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "coal",
    unit: "kg",
    factor: 2.42,
    source: "IPCC",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "freight_road",
    unit: "tkm",
    factor: 0.1,
    source: "DEFRA",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "freight_sea",
    unit: "tkm",
    factor: 0.01,
    source: "DEFRA",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "freight_air",
    unit: "tkm",
    factor: 0.8,
    source: "DEFRA",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "employee_commute",
    unit: "km",
    factor: 0.05,
    source: "TÜİK",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "business_flight",
    unit: "km",
    factor: 0.25,
    source: "ICAO",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    category: "waste",
    unit: "kg",
    factor: 0.5,
    source: "EPA",
    lastUpdated: new Date("2024-01-01T00:00:00.000Z"),
  },
] as const;

const CATEGORY_TO_CALCULATION_KEY: Readonly<
  Record<EmissionFactorCategory, keyof CarbonEmissionFactorMap | null>
> = {
  electricity: "electricity",
  naturalGas: "naturalGas",
  diesel: "diesel",
  gasoline: "gasoline",
  lpg: "lpg",
  coal: "coal",
  freight_road: "freightRoad",
  freight_sea: "freightSea",
  freight_air: "freightAir",
  employee_commute: "employeeCommute",
  business_flight: "businessFlight",
  waste: "waste",
  purchasedGoods: null,
};

function parseTimestamp(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}

function normalizeEmissionFactor(
  category: string,
  data: Record<string, unknown>,
): EmissionFactor | null {
  const factor = Number(data.factor);
  const unit = typeof data.unit === "string" ? data.unit.trim() : "";
  const source = typeof data.source === "string" ? data.source.trim() : "custom";

  if (!unit || !Number.isFinite(factor) || factor < 0) {
    return null;
  }

  if (!(category in CATEGORY_TO_CALCULATION_KEY)) {
    return null;
  }

  return {
    category: category as EmissionFactorCategory,
    unit,
    factor,
    source,
    lastUpdated: parseTimestamp(data.lastUpdated),
  };
}

export function mergeEmissionFactorLists(
  globalFactors: readonly EmissionFactor[],
  userOverrides: readonly UserEmissionFactorOverride[],
): EmissionFactor[] {
  const byCategory = new Map<EmissionFactorCategory, EmissionFactor>();

  for (const factor of globalFactors) {
    byCategory.set(factor.category, factor);
  }

  for (const override of userOverrides) {
    const existing = byCategory.get(override.category);
    byCategory.set(override.category, {
      category: override.category,
      unit: existing?.unit ?? "unit",
      factor: override.factor,
      source: "custom",
      lastUpdated: override.lastUpdated,
    });
  }

  return Array.from(byCategory.values());
}

export function emissionFactorsToCalculationMap(
  factors: readonly EmissionFactor[],
): CarbonEmissionFactorMap {
  const map: CarbonEmissionFactorMap = { ...DEFAULT_CARBON_EMISSION_FACTOR_MAP };

  for (const entry of factors) {
    const key = CATEGORY_TO_CALCULATION_KEY[entry.category];
    if (key) {
      map[key] = entry.factor;
    }
  }

  return map;
}

async function fetchGlobalEmissionFactorsFromFirestore(): Promise<EmissionFactor[] | null> {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  try {
    const snapshot = await getDocs(collection(db, GLOBAL_FACTORS_COLLECTION));
    if (snapshot.empty) {
      return null;
    }

    const factors = snapshot.docs
      .map((docSnapshot) =>
        normalizeEmissionFactor(docSnapshot.id, docSnapshot.data() as Record<string, unknown>),
      )
      .filter((factor): factor is EmissionFactor => factor !== null);

    return factors.length > 0 ? factors : null;
  } catch {
    return null;
  }
}

async function fetchUserEmissionFactorOverrides(
  userId: string,
): Promise<UserEmissionFactorOverride[]> {
  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  try {
    const snapshot = await getDocs(collection(db, "users", userId, "emissionFactors"));
    const overrides: UserEmissionFactorOverride[] = [];

    for (const docSnapshot of snapshot.docs) {
      const factor = Number(docSnapshot.data().factor);
      if (!Number.isFinite(factor) || factor < 0) {
        continue;
      }

      if (!(docSnapshot.id in CATEGORY_TO_CALCULATION_KEY)) {
        continue;
      }

      overrides.push({
        category: docSnapshot.id as EmissionFactorCategory,
        factor,
        lastUpdated: parseTimestamp(docSnapshot.data().lastUpdated),
      });
    }

    return overrides;
  } catch {
    return [];
  }
}

export async function getEmissionFactors(userId?: string | null): Promise<EmissionFactor[]> {
  const firestoreFactors = await fetchGlobalEmissionFactorsFromFirestore();
  const baseFactors = firestoreFactors ?? [...DEFAULT_EMISSION_FACTORS];

  if (!userId) {
    return baseFactors;
  }

  const overrides = await fetchUserEmissionFactorOverrides(userId);
  return mergeEmissionFactorLists(baseFactors, overrides);
}

export async function setUserEmissionFactor(
  userId: string,
  category: EmissionFactorCategory,
  factor: number,
): Promise<boolean> {
  if (!Number.isFinite(factor) || factor < 0) {
    return false;
  }

  const db = getFirestoreDb();
  if (!db) {
    return false;
  }

  try {
    await setDoc(doc(db, "users", userId, "emissionFactors", category), {
      factor,
      lastUpdated: Timestamp.now(),
    });
    return true;
  } catch {
    return false;
  }
}

export function getCalculationMapFromFactors(
  factors: readonly EmissionFactor[],
): CarbonEmissionFactorMap {
  return emissionFactorsToCalculationMap(factors);
}
