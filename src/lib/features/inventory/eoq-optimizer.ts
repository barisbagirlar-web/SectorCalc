export type EOQOptimizerInputs = {
  readonly annualDemand: number;
  readonly orderingCost: number;
  readonly holdingCostRate: number;
  readonly unitCost: number;
  readonly leadTimeDays: number;
  readonly workingDaysPerYear: number;
  readonly demandStdDev: number;
  readonly leadTimeStdDev: number;
  readonly serviceLevel: number;
};

export type EOQOptimizerOutput = {
  readonly eoq: number;
  readonly reorderPoint: number;
  readonly safetyStock: number;
  readonly totalCost: number;
};

export type EOQCostCurvePoint = {
  readonly orderQuantity: number;
  readonly totalCost: number;
};

const Z_SCORES: Readonly<Record<number, number>> = {
  90: 1.28,
  95: 1.645,
  96: 1.75,
  97: 1.88,
  98: 2.05,
  99: 2.33,
  99.9: 3.09,
};

export function resolveServiceLevelZScore(serviceLevel: number): number {
  return Z_SCORES[serviceLevel] ?? 1.645;
}

export function calculateEOQOptimizer(inputs: EOQOptimizerInputs): EOQOptimizerOutput {
  const holdingCostPerUnit =
    (inputs.holdingCostRate / 100) * Math.max(inputs.unitCost, 0);
  const denominator = holdingCostPerUnit > 0 ? holdingCostPerUnit : 0.0001;

  const eoq = Math.sqrt((2 * inputs.annualDemand * inputs.orderingCost) / denominator);
  const dailyDemand = inputs.annualDemand / Math.max(inputs.workingDaysPerYear, 1);
  const reorderPointBase = dailyDemand * inputs.leadTimeDays;

  let safetyStock = 0;
  if (inputs.demandStdDev > 0 || inputs.leadTimeStdDev > 0) {
    const z = resolveServiceLevelZScore(inputs.serviceLevel);
    if (inputs.demandStdDev > 0 && inputs.leadTimeStdDev > 0) {
      safetyStock =
        z *
        Math.sqrt(
          inputs.leadTimeDays * inputs.demandStdDev ** 2 +
            dailyDemand ** 2 * inputs.leadTimeStdDev ** 2,
        );
    } else if (inputs.demandStdDev > 0) {
      safetyStock = z * inputs.demandStdDev * Math.sqrt(inputs.leadTimeDays);
    }
  }

  const reorderPoint = reorderPointBase + safetyStock;
  const totalCost =
    (inputs.annualDemand / eoq) * inputs.orderingCost +
    (eoq / 2) * holdingCostPerUnit;

  return {
    eoq: Math.ceil(eoq),
    reorderPoint: Math.ceil(reorderPoint),
    safetyStock: Math.ceil(safetyStock),
    totalCost,
  };
}

export function buildEOQCostCurve(
  inputs: EOQOptimizerInputs,
  output: EOQOptimizerOutput | null,
  pointCount = 12,
): readonly EOQCostCurvePoint[] {
  const holdingCostPerUnit =
    (inputs.holdingCostRate / 100) * Math.max(inputs.unitCost, 0);
  const center = output?.eoq ?? Math.sqrt((2 * inputs.annualDemand * inputs.orderingCost) / Math.max(holdingCostPerUnit, 0.0001));
  const minQ = Math.max(1, Math.floor(center * 0.5));
  const maxQ = Math.max(minQ + 1, Math.ceil(center * 2));
  const step = Math.max(1, Math.round((maxQ - minQ) / pointCount));

  const points: EOQCostCurvePoint[] = [];
  for (let quantity = minQ; quantity <= maxQ; quantity += step) {
    const totalCost =
      (inputs.annualDemand / quantity) * inputs.orderingCost +
      (quantity / 2) * holdingCostPerUnit;
    points.push({ orderQuantity: quantity, totalCost });
  }

  return points;
}

export type EOQSeedInputs = {
  annualDemand?: number;
  orderingCost?: number;
  holdingCostRate?: number;
  unitCost?: number;
  leadTimeDays?: number;
  workingDaysPerYear?: number;
};

export function mapInventoryToolInputsToEOQ(
  inputs: Readonly<Record<string, unknown>>,
): EOQSeedInputs {
  const annualDemand = Number(inputs.annualDemand);
  const orderingCost = Number(inputs.orderingCost);
  const unitCost = Number(inputs.unitCost);
  const carryingCostRate = Number(inputs.carryingCostRate);
  const holdingCostPerUnitPerYear = Number(inputs.holdingCostPerUnitPerYear);
  const leadTimeDays = Number(inputs.leadTimeDays);
  const workingDaysPerYear = Number(inputs.workingDaysPerYear);

  const mapped: EOQSeedInputs = {};

  if (Number.isFinite(annualDemand) && annualDemand > 0) {
    mapped.annualDemand = annualDemand;
  }
  if (Number.isFinite(orderingCost) && orderingCost >= 0) {
    mapped.orderingCost = orderingCost;
  }
  if (Number.isFinite(unitCost) && unitCost > 0) {
    mapped.unitCost = unitCost;
  }
  if (Number.isFinite(carryingCostRate) && carryingCostRate >= 0) {
    mapped.holdingCostRate = carryingCostRate;
  } else if (
    Number.isFinite(holdingCostPerUnitPerYear) &&
    Number.isFinite(unitCost) &&
    unitCost > 0
  ) {
    mapped.holdingCostRate = (holdingCostPerUnitPerYear / unitCost) * 100;
  }
  if (Number.isFinite(leadTimeDays) && leadTimeDays >= 0) {
    mapped.leadTimeDays = leadTimeDays;
  }
  if (Number.isFinite(workingDaysPerYear) && workingDaysPerYear > 0) {
    mapped.workingDaysPerYear = workingDaysPerYear;
  }

  return mapped;
}

export const DEFAULT_EOQ_OPTIMIZER_INPUTS: EOQOptimizerInputs = {
  annualDemand: 10000,
  orderingCost: 50,
  holdingCostRate: 20,
  unitCost: 10,
  leadTimeDays: 7,
  workingDaysPerYear: 250,
  demandStdDev: 0,
  leadTimeStdDev: 0,
  serviceLevel: 95,
};
