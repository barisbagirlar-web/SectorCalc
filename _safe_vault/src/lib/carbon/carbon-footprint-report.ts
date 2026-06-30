export type CarbonEmissionFactorMap = {
  electricity: number;
  naturalGas: number;
  diesel: number;
  gasoline: number;
  lpg: number;
  coal: number;
  waste: number;
  freightRoad: number;
  freightSea: number;
  freightAir: number;
  employeeCommute: number;
  businessFlight: number;
};

export const DEFAULT_CARBON_EMISSION_FACTOR_MAP: CarbonEmissionFactorMap = {
  electricity: 0.45,
  naturalGas: 0.202,
  diesel: 2.68,
  gasoline: 2.31,
  lpg: 1.51,
  coal: 2.42,
  waste: 0.5,
  freightRoad: 0.1,
  freightSea: 0.01,
  freightAir: 0.8,
  employeeCommute: 0.05,
  businessFlight: 0.25,
};

/** @deprecated Use DEFAULT_CARBON_EMISSION_FACTOR_MAP */
export const CARBON_EMISSION_FACTORS = DEFAULT_CARBON_EMISSION_FACTOR_MAP;

export const DEFAULT_CBAM_CERTIFICATE_PRICE_EUR = 80;
export const DEFAULT_CBAM_EXPOSURE_RATIO = 0.7;

export type CarbonEmissionInputs = {
  naturalGasKWh: number;
  dieselLitres: number;
  gasolineLitres: number;
  lpgLitres: number;
  coalKg: number;
  electricityKWh: number;
  purchasedGoodsCo2e: number;
  freightRoadTkm: number;
  freightSeaTkm: number;
  freightAirTkm: number;
  employeeCommuteKm: number;
  businessFlightsKm: number;
  wasteKg: number;
};

export type CarbonEmissionResults = {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  cbamExposure: number;
  cbamCostEur: number;
};

export type CarbonReportSeedInputs = Partial<CarbonEmissionInputs>;

export type CarbonReportCalculationOptions = {
  cbamCertificatePriceEurPerTon?: number;
  cbamExposureRatio?: number;
  emissionFactors?: CarbonEmissionFactorMap;
};

export const DEFAULT_CARBON_EMISSION_INPUTS: CarbonEmissionInputs = {
  naturalGasKWh: 0,
  dieselLitres: 0,
  gasolineLitres: 0,
  lpgLitres: 0,
  coalKg: 0,
  electricityKWh: 0,
  purchasedGoodsCo2e: 0,
  freightRoadTkm: 0,
  freightSeaTkm: 0,
  freightAirTkm: 0,
  employeeCommuteKm: 0,
  businessFlightsKm: 0,
  wasteKg: 0,
};

export function mergeCarbonEmissionInputs(
  seed?: CarbonReportSeedInputs,
): CarbonEmissionInputs {
  return {
    ...DEFAULT_CARBON_EMISSION_INPUTS,
    ...seed,
  };
}

export function calculateCarbonFootprintReport(
  inputs: CarbonEmissionInputs,
  options: CarbonReportCalculationOptions = {},
): CarbonEmissionResults {
  const factors = options.emissionFactors ?? DEFAULT_CARBON_EMISSION_FACTOR_MAP;
  const certificatePrice =
    options.cbamCertificatePriceEurPerTon ?? DEFAULT_CBAM_CERTIFICATE_PRICE_EUR;
  const exposureRatio = options.cbamExposureRatio ?? DEFAULT_CBAM_EXPOSURE_RATIO;

  const scope1 =
    inputs.naturalGasKWh * factors.naturalGas +
    inputs.dieselLitres * factors.diesel +
    inputs.gasolineLitres * factors.gasoline +
    inputs.lpgLitres * factors.lpg +
    inputs.coalKg * factors.coal;

  const scope2 = inputs.electricityKWh * factors.electricity;

  const scope3 =
    inputs.purchasedGoodsCo2e +
    inputs.freightRoadTkm * factors.freightRoad +
    inputs.freightSeaTkm * factors.freightSea +
    inputs.freightAirTkm * factors.freightAir +
    inputs.employeeCommuteKm * factors.employeeCommute +
    inputs.businessFlightsKm * factors.businessFlight +
    inputs.wasteKg * factors.waste;

  const total = scope1 + scope2 + scope3;
  const cbamExposure = total * exposureRatio;
  const cbamCostEur = (cbamExposure / 1000) * certificatePrice;

  return {
    scope1,
    scope2,
    scope3,
    total,
    cbamExposure,
    cbamCostEur,
  };
}

export function isCarbonFootprintReportTool(slug: string): boolean {
  return slug.includes("carbon-footprint") || slug.includes("cbam");
}

export function mapCarbonToolInputsToReport(
  slug: string,
  inputs: Readonly<Record<string, unknown>>,
): {
  seed: CarbonReportSeedInputs;
  options: CarbonReportCalculationOptions;
} {
  const seed: CarbonReportSeedInputs = {};
  const options: CarbonReportCalculationOptions = {};

  const cbamCertificatePrice = Number(inputs.cbamCertificatePrice);
  const carbonPrice = Number(inputs.carbonPrice);
  if (Number.isFinite(cbamCertificatePrice) && cbamCertificatePrice > 0) {
    options.cbamCertificatePriceEurPerTon = cbamCertificatePrice;
  } else if (Number.isFinite(carbonPrice) && carbonPrice > 0) {
    options.cbamCertificatePriceEurPerTon = carbonPrice;
  }

  if (slug.includes("cbam")) {
    options.cbamExposureRatio = DEFAULT_CBAM_EXPOSURE_RATIO;
  }

  if (slug === "carbon-footprint-quick") {
    const activityType = String(inputs.activityType ?? "");
    const quantity = Number(inputs.quantity) || 0;
    switch (activityType) {
      case "electricity":
        seed.electricityKWh = quantity;
        break;
      case "naturalGas":
        seed.naturalGasKWh = quantity;
        break;
      case "diesel":
        seed.dieselLitres = quantity;
        break;
      case "gasoline":
        seed.gasolineLitres = quantity;
        break;
      case "propane":
        seed.lpgLitres = quantity;
        break;
      case "coal":
        seed.coalKg = quantity;
        break;
      case "waste":
        seed.wasteKg = quantity;
        break;
      case "businessTravel":
        seed.businessFlightsKm = quantity;
        break;
      case "commuting":
        seed.employeeCommuteKm = quantity;
        break;
      default:
        break;
    }
  }

  const productionEnergy = Number(inputs.productionEnergy);
  if (Number.isFinite(productionEnergy) && productionEnergy > 0) {
    seed.electricityKWh = (seed.electricityKWh ?? 0) + productionEnergy;
  }

  const electricityKWh = Number(inputs.electricityKWh ?? inputs.electricityConsumption);
  if (Number.isFinite(electricityKWh) && electricityKWh > 0) {
    seed.electricityKWh = electricityKWh;
  }

  const embeddedEmissionsPerTon = Number(inputs.embeddedEmissionsPerTon);
  const productionVolume = Number(inputs.productionVolume);
  if (
    Number.isFinite(embeddedEmissionsPerTon) &&
    Number.isFinite(productionVolume) &&
    productionVolume > 0
  ) {
    seed.purchasedGoodsCo2e = embeddedEmissionsPerTon * productionVolume * 1000;
  }

  const totalEmissions = Number(inputs.totalEmissions);
  if (Number.isFinite(totalEmissions) && totalEmissions > 0) {
    seed.purchasedGoodsCo2e = totalEmissions * 1000;
  }

  const transportDistance = Number(inputs.transportDistance);
  if (Number.isFinite(transportDistance) && transportDistance > 0) {
    const transportMode = String(inputs.transportMode ?? "road");
    const tonnes = Number(inputs.productWeight) > 0 ? Number(inputs.productWeight) / 1000 : 1;
    const tkm = tonnes * transportDistance;
    if (transportMode === "sea") {
      seed.freightSeaTkm = tkm;
    } else if (transportMode === "air") {
      seed.freightAirTkm = tkm;
    } else {
      seed.freightRoadTkm = tkm;
    }
  }

  return { seed, options };
}

export function buildScopeChartData(
  results: CarbonEmissionResults,
): readonly { name: string; value: number }[] {
  return [
    { name: "scope1", value: results.scope1 },
    { name: "scope2", value: results.scope2 },
    { name: "scope3", value: results.scope3 },
  ];
}

export function buildCbamChartData(
  results: CarbonEmissionResults,
): readonly { name: string; value: number }[] {
  return [
    { name: "cbamExposure", value: results.cbamExposure },
    { name: "otherEmissions", value: Math.max(0, results.total - results.cbamExposure) },
  ];
}
