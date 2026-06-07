/**
 * FormulaRepository — Logic Layer (U-Engine pattern).
 * Formüller registry id ile eşleşir; sektör kodu hard-code edilmez.
 */

import { computeEfficiencyScore } from "@/lib/os/core/intel-engine";
import {
  listSectorRegistryKeys,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

export interface FormulaInputs {
  target: number;
  actual: number;
  cost: number;
}

export interface FormulaExecutionResult {
  sectorId: SectorRegistryKey;
  efficiencyScore: number;
  varianceRatio: number;
  financialLoss: number;
}

export type SectorFormula = (inputs: FormulaInputs) => number;

export type FormulaRegistry = Record<SectorRegistryKey, SectorFormula>;

function computeVarianceRatio(target: number, actual: number): number {
  if (!Number.isFinite(target) || !Number.isFinite(actual)) {
    return 0;
  }
  if (target === 0) {
    return actual === 0 ? 0 : Math.sign(actual) || 1;
  }
  return (actual - target) / target;
}

/** Standart verimlilik formülü — registry override edebilir. */
export function standardEfficiencyFormula(inputs: FormulaInputs): number {
  if (
    !Number.isFinite(inputs.target) ||
    !Number.isFinite(inputs.actual) ||
    !Number.isFinite(inputs.cost)
  ) {
    return 0;
  }

  return computeEfficiencyScore(inputs.target, inputs.actual);
}

function buildDefaultRegistry(): FormulaRegistry {
  return Object.fromEntries(
    listSectorRegistryKeys().map((sectorId) => [sectorId, standardEfficiencyFormula]),
  ) as FormulaRegistry;
}

export class FormulaRepository {
  private readonly registry: FormulaRegistry;

  constructor(registry: FormulaRegistry = buildDefaultRegistry()) {
    this.registry = registry;
  }

  has(sectorId: SectorRegistryKey): boolean {
    return typeof this.registry[sectorId] === "function";
  }

  resolve(sectorId: SectorRegistryKey): SectorFormula {
    const formula = this.registry[sectorId];
    if (!formula) {
      throw new Error(`FORMULA_NOT_FOUND: No formula registered for sector "${sectorId}".`);
    }
    return formula;
  }

  register(sectorId: SectorRegistryKey, formula: SectorFormula): void {
    this.registry[sectorId] = formula;
  }

  execute(sectorId: SectorRegistryKey, inputs: FormulaInputs): number {
    return this.resolve(sectorId)(inputs);
  }

  executeFull(
    sectorId: SectorRegistryKey,
    inputs: FormulaInputs,
  ): FormulaExecutionResult {
    const varianceRatio = computeVarianceRatio(inputs.target, inputs.actual);
    const financialLoss =
      Math.abs(inputs.actual - inputs.target) * Math.max(0, inputs.cost);

    return {
      sectorId,
      efficiencyScore: this.execute(sectorId, inputs),
      varianceRatio,
      financialLoss: Number.isFinite(financialLoss) ? financialLoss : 0,
    };
  }

  listSectorIds(): SectorRegistryKey[] {
    return Object.keys(this.registry) as SectorRegistryKey[];
  }
}

/** Singleton — MasterOS / U-Engine giriş noktası. */
export const formulaRepository = new FormulaRepository();

/** Geriye dönük — registry-logic Formulas haritası. */
export const Formulas = Object.fromEntries(
  formulaRepository.listSectorIds().map((sectorId) => [
    sectorId,
    (inputs: FormulaInputs) => formulaRepository.execute(sectorId, inputs),
  ]),
) as FormulaRegistry;

export function runSectorFormula(
  sectorId: SectorRegistryKey,
  inputs: FormulaInputs,
): number {
  return formulaRepository.execute(sectorId, inputs);
}
