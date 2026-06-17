export interface CBAMReport {
  productCarbonFootprint: number;
  cbamAdjustment: number;
  complianceStatus: "compliant" | "warning" | "non-compliant";
  recommendations: string[];
}

const DEFAULT_EU_EMISSION_PRICE_EUR_PER_TON = 85;

export function calculateCBAM(
  emissionsKg: number,
  _country: string,
  euEmissionPriceEurPerTon: number = DEFAULT_EU_EMISSION_PRICE_EUR_PER_TON,
): CBAMReport {
  const adjustment = (emissionsKg / 1000) * euEmissionPriceEurPerTon;
  const complianceStatus: CBAMReport["complianceStatus"] =
    adjustment > 100 ? "warning" : "compliant";

  return {
    productCarbonFootprint: emissionsKg,
    cbamAdjustment: adjustment,
    complianceStatus,
    recommendations:
      complianceStatus === "warning"
        ? ["Karbon ayak izinizi azaltmak için yenilenebilir enerji kullanın."]
        : [],
  };
}

export function resolveCarbonEmissionsKg(result: Record<string, unknown>): number | null {
  const directKeys = ["totalCO2", "carbonEmissions", "total", "totalEmissions", "co2Total"];
  for (const key of directKeys) {
    const value = result[key];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  const breakdown = result.breakdown;
  if (breakdown && typeof breakdown === "object" && !Array.isArray(breakdown)) {
    let sum = 0;
    let found = false;
    for (const value of Object.values(breakdown as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        sum += value;
        found = true;
      }
    }
    if (found && sum > 0) {
      return sum;
    }
  }

  return null;
}

export function schemaCbamEnabled(schema: { readonly cbam?: { readonly enabled?: boolean } }): boolean {
  return schema.cbam?.enabled === true;
}
