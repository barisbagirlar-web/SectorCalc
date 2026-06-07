export {
  FormulaRepository,
  Formulas,
  formulaRepository,
  runSectorFormula,
  standardEfficiencyFormula,
  type FormulaExecutionResult,
  type FormulaInputs,
  type FormulaRegistry,
  type SectorFormula,
} from "@/lib/os/core/formulas/formula-repository";

export {
  buildExpertFieldSpecs,
  resolveExpertInputs,
  runExpertCalculation,
  type ExpertCalcInputValues,
  type ExpertCalcPremiumLayer,
  type ExpertCalcResult,
  type ExpertCalcTier,
  type ExpertCalcVerdict,
  type ExpertFieldSpec,
  type ExpertHiddenVariable,
  type ExpertLogicTerm,
  type ExpertPhysicsCheck,
} from "@/lib/os/core/formulas/expert-calc";
