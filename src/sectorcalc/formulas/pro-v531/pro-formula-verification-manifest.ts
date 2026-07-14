import "server-only";
import {
  INVESTMENT_APPRAISAL_ARITHMETIC_MODE,
  INVESTMENT_APPRAISAL_FORMULA_VERSION,
  INVESTMENT_APPRAISAL_MODEL_ID,
  INVESTMENT_APPRAISAL_SCHEMA_VERSION,
} from "./investment-appraisal-core";
import type { ProFormulaModule } from "./pro-formula-contract";
import {
  DOWNTIME_LOSS_ARITHMETIC_MODE,
  DOWNTIME_LOSS_FORMULA_VERSION,
  DOWNTIME_LOSS_MODEL_ID,
  DOWNTIME_LOSS_SCHEMA_VERSION,
} from "./downtime-loss-core";
import {
  QUALITY_LOSS_ARITHMETIC_MODE,
  QUALITY_LOSS_FORMULA_VERSION,
  QUALITY_LOSS_MODEL_ID,
  QUALITY_LOSS_SCHEMA_VERSION,
} from "./quality-loss-core";
import {
  OEE_LOSS_ARITHMETIC_MODE,
  OEE_LOSS_FORMULA_VERSION,
  OEE_LOSS_MODEL_ID,
  OEE_LOSS_SCHEMA_VERSION,
} from "./oee-loss-core";
import {
  MACHINE_HOURLY_RATE_ARITHMETIC_MODE,
  MACHINE_HOURLY_RATE_FORMULA_VERSION,
  MACHINE_HOURLY_RATE_MODEL_ID,
  MACHINE_HOURLY_RATE_SCHEMA_VERSION,
} from "./machine-hourly-rate-core";
import {
  MOTOR_REPLACEMENT_ARITHMETIC_MODE,
  MOTOR_REPLACEMENT_FORMULA_VERSION,
  MOTOR_REPLACEMENT_MODEL_ID,
  MOTOR_REPLACEMENT_SCHEMA_VERSION,
} from "./motor-replacement-roi-core";
import {
  MAKE_BUY_ARITHMETIC_MODE,
  MAKE_BUY_FORMULA_VERSION,
  MAKE_BUY_MODEL_ID,
  MAKE_BUY_SCHEMA_VERSION,
} from "./make-buy-core";
import {
  PLANT_SHOP_RATE_ARITHMETIC_MODE,
  PLANT_SHOP_RATE_FORMULA_VERSION,
  PLANT_SHOP_RATE_MODEL_ID,
  PLANT_SHOP_RATE_SCHEMA_VERSION,
} from "./plant-shop-rate-core";
import {
  SMED_ROI_ARITHMETIC_MODE,
  SMED_ROI_FORMULA_VERSION,
  SMED_ROI_MODEL_ID,
  SMED_ROI_SCHEMA_VERSION,
} from "./smed-roi-core";
import {
  EMPLOYEE_COST_ARITHMETIC_MODE,
  EMPLOYEE_COST_FORMULA_VERSION,
  EMPLOYEE_COST_MODEL_ID,
  EMPLOYEE_COST_SCHEMA_VERSION,
} from "./employee-cost-core";
import {
  JOB_QUOTE_ARITHMETIC_MODE,
  JOB_QUOTE_FORMULA_VERSION,
  JOB_QUOTE_MODEL_ID,
  JOB_QUOTE_SCHEMA_VERSION,
} from "./job-quote-core";
import {
  SKU_MARGIN_ARITHMETIC_MODE,
  SKU_MARGIN_FORMULA_VERSION,
  SKU_MARGIN_MODEL_ID,
  SKU_MARGIN_SCHEMA_VERSION,
} from "./sku-margin-core";
import {
  LOSS_MAKING_JOB_ARITHMETIC_MODE,
  LOSS_MAKING_JOB_FORMULA_VERSION,
  LOSS_MAKING_JOB_MODEL_ID,
  LOSS_MAKING_JOB_SCHEMA_VERSION,
} from "./loss-making-job-core";
import {
  CASH_SURVIVAL_ARITHMETIC_MODE,
  CASH_SURVIVAL_FORMULA_VERSION,
  CASH_SURVIVAL_MODEL_ID,
  CASH_SURVIVAL_SCHEMA_VERSION,
} from "./cash-survival-core";
import {
  RECEIVABLES_COST_ARITHMETIC_MODE,
  RECEIVABLES_COST_FORMULA_VERSION,
  RECEIVABLES_COST_MODEL_ID,
  RECEIVABLES_COST_SCHEMA_VERSION,
} from "./receivables-cost-core";
import {
  MACHINE_OPTION_ARITHMETIC_MODE,
  MACHINE_OPTION_FORMULA_VERSION,
  MACHINE_OPTION_MODEL_ID,
  MACHINE_OPTION_SCHEMA_VERSION,
} from "./machine-option-core";
import {
  CUSTOMER_SKU_ARITHMETIC_MODE,
  CUSTOMER_SKU_FORMULA_VERSION,
  CUSTOMER_SKU_MODEL_ID,
  CUSTOMER_SKU_SCHEMA_VERSION,
} from "./customer-sku-profitability-core";
import {
  ENERGY_INCENTIVE_ARITHMETIC_MODE,
  ENERGY_INCENTIVE_FORMULA_VERSION,
  ENERGY_INCENTIVE_MODEL_ID,
  ENERGY_INCENTIVE_SCHEMA_VERSION,
} from "./energy-incentive-core";
import { FX_COMMODITY_ARITHMETIC_MODE, FX_COMMODITY_FORMULA_VERSION, FX_COMMODITY_MODEL_ID, FX_COMMODITY_SCHEMA_VERSION } from "./fx-commodity-core";
import {
  WELD_COST_ARITHMETIC_MODE,
  WELD_COST_FORMULA_VERSION,
  WELD_COST_MODEL_ID,
  WELD_COST_SCHEMA_VERSION,
} from "./weld-cost-core";

export interface FormulaVerificationRecord {
  toolKey: string;
  formulaVersion: string;
  modelId: string;
  arithmeticMode: NonNullable<ProFormulaModule["arithmeticMode"]>;
  schemaContractVersion: string;
  propertyEvidenceId: string;
  status: "CERTIFIED_FOR_EXECUTION";
}

const VERIFIED_FORMULAS = new Map<string, FormulaVerificationRecord>([
  [
    "weld-procedure-cost-consumable-estimation-suite",
    {
      toolKey: "weld-procedure-cost-consumable-estimation-suite",
      formulaVersion: WELD_COST_FORMULA_VERSION,
      modelId: WELD_COST_MODEL_ID,
      arithmeticMode: WELD_COST_ARITHMETIC_MODE,
      schemaContractVersion: WELD_COST_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/weld-cost.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  ["fx-commodity-pass-through-pricer", { toolKey: "fx-commodity-pass-through-pricer", formulaVersion: FX_COMMODITY_FORMULA_VERSION, modelId: FX_COMMODITY_MODEL_ID, arithmeticMode: FX_COMMODITY_ARITHMETIC_MODE, schemaContractVersion: FX_COMMODITY_SCHEMA_VERSION, propertyEvidenceId: "tests/pro-calculation-correctness/fx-commodity.property.test.ts", status: "CERTIFIED_FOR_EXECUTION" }],
  [
    "energy-efficiency-grant-incentive-feasibility-pack",
    {
      toolKey: "energy-efficiency-grant-incentive-feasibility-pack",
      formulaVersion: ENERGY_INCENTIVE_FORMULA_VERSION,
      modelId: ENERGY_INCENTIVE_MODEL_ID,
      arithmeticMode: ENERGY_INCENTIVE_ARITHMETIC_MODE,
      schemaContractVersion: ENERGY_INCENTIVE_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/energy-incentive.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "customer-sku-profitability-forensics",
    {
      toolKey: "customer-sku-profitability-forensics",
      formulaVersion: CUSTOMER_SKU_FORMULA_VERSION,
      modelId: CUSTOMER_SKU_MODEL_ID,
      arithmeticMode: CUSTOMER_SKU_ARITHMETIC_MODE,
      schemaContractVersion: CUSTOMER_SKU_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/customer-sku.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "machine-investment-feasibility-buy-lease-keep",
    {
      toolKey: "machine-investment-feasibility-buy-lease-keep",
      formulaVersion: MACHINE_OPTION_FORMULA_VERSION,
      modelId: MACHINE_OPTION_MODEL_ID,
      arithmeticMode: MACHINE_OPTION_ARITHMETIC_MODE,
      schemaContractVersion: MACHINE_OPTION_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/machine-option.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "receivables-cost-payment-term-addendum",
    {
      toolKey: "receivables-cost-payment-term-addendum",
      formulaVersion: RECEIVABLES_COST_FORMULA_VERSION,
      modelId: RECEIVABLES_COST_MODEL_ID,
      arithmeticMode: RECEIVABLES_COST_ARITHMETIC_MODE,
      schemaContractVersion: RECEIVABLES_COST_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/receivables-cost.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "break-even-survival-cash-calculator",
    {
      toolKey: "break-even-survival-cash-calculator",
      formulaVersion: CASH_SURVIVAL_FORMULA_VERSION,
      modelId: CASH_SURVIVAL_MODEL_ID,
      arithmeticMode: CASH_SURVIVAL_ARITHMETIC_MODE,
      schemaContractVersion: CASH_SURVIVAL_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/cash-survival.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "loss-making-job-detector",
    {
      toolKey: "loss-making-job-detector",
      formulaVersion: LOSS_MAKING_JOB_FORMULA_VERSION,
      modelId: LOSS_MAKING_JOB_MODEL_ID,
      arithmeticMode: LOSS_MAKING_JOB_ARITHMETIC_MODE,
      schemaContractVersion: LOSS_MAKING_JOB_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/loss-making-job.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "product-sku-margin-ranker",
    {
      toolKey: "product-sku-margin-ranker",
      formulaVersion: SKU_MARGIN_FORMULA_VERSION,
      modelId: SKU_MARGIN_MODEL_ID,
      arithmeticMode: SKU_MARGIN_ARITHMETIC_MODE,
      schemaContractVersion: SKU_MARGIN_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/sku-margin.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "job-quote-builder-pro-pack",
    {
      toolKey: "job-quote-builder-pro-pack",
      formulaVersion: JOB_QUOTE_FORMULA_VERSION,
      modelId: JOB_QUOTE_MODEL_ID,
      arithmeticMode: JOB_QUOTE_ARITHMETIC_MODE,
      schemaContractVersion: JOB_QUOTE_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/job-quote.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "true-employee-cost-statement",
    {
      toolKey: "true-employee-cost-statement",
      formulaVersion: EMPLOYEE_COST_FORMULA_VERSION,
      modelId: EMPLOYEE_COST_MODEL_ID,
      arithmeticMode: EMPLOYEE_COST_ARITHMETIC_MODE,
      schemaContractVersion: EMPLOYEE_COST_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/employee-cost.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "setup-time-reduction-roi-smed",
    {
      toolKey: "setup-time-reduction-roi-smed",
      formulaVersion: SMED_ROI_FORMULA_VERSION,
      modelId: SMED_ROI_MODEL_ID,
      arithmeticMode: SMED_ROI_ARITHMETIC_MODE,
      schemaContractVersion: SMED_ROI_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/smed-roi.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "plant-wide-shop-rate-cost-structure-audit",
    {
      toolKey: "plant-wide-shop-rate-cost-structure-audit",
      formulaVersion: PLANT_SHOP_RATE_FORMULA_VERSION,
      modelId: PLANT_SHOP_RATE_MODEL_ID,
      arithmeticMode: PLANT_SHOP_RATE_ARITHMETIC_MODE,
      schemaContractVersion: PLANT_SHOP_RATE_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/plant-shop-rate.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "outsource-vs-in-house-analyzer",
    {
      toolKey: "outsource-vs-in-house-analyzer",
      formulaVersion: MAKE_BUY_FORMULA_VERSION,
      modelId: MAKE_BUY_MODEL_ID,
      arithmeticMode: MAKE_BUY_ARITHMETIC_MODE,
      schemaContractVersion: MAKE_BUY_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/make-buy.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "motor-compressor-replacement-roi",
    {
      toolKey: "motor-compressor-replacement-roi",
      formulaVersion: MOTOR_REPLACEMENT_FORMULA_VERSION,
      modelId: MOTOR_REPLACEMENT_MODEL_ID,
      arithmeticMode: MOTOR_REPLACEMENT_ARITHMETIC_MODE,
      schemaContractVersion: MOTOR_REPLACEMENT_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/motor-replacement-roi.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "machine-hourly-rate-proof-report",
    {
      toolKey: "machine-hourly-rate-proof-report",
      formulaVersion: MACHINE_HOURLY_RATE_FORMULA_VERSION,
      modelId: MACHINE_HOURLY_RATE_MODEL_ID,
      arithmeticMode: MACHINE_HOURLY_RATE_ARITHMETIC_MODE,
      schemaContractVersion: MACHINE_HOURLY_RATE_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/machine-hourly-rate.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "oee-loss-monetization-improvement-business-case",
    {
      toolKey: "oee-loss-monetization-improvement-business-case",
      formulaVersion: OEE_LOSS_FORMULA_VERSION,
      modelId: OEE_LOSS_MODEL_ID,
      arithmeticMode: OEE_LOSS_ARITHMETIC_MODE,
      schemaContractVersion: OEE_LOSS_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/oee-loss.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "scrap-rework-cost-tracker",
    {
      toolKey: "scrap-rework-cost-tracker",
      formulaVersion: QUALITY_LOSS_FORMULA_VERSION,
      modelId: QUALITY_LOSS_MODEL_ID,
      arithmeticMode: QUALITY_LOSS_ARITHMETIC_MODE,
      schemaContractVersion: QUALITY_LOSS_SCHEMA_VERSION,
      propertyEvidenceId: "tests/pro-calculation-correctness/quality-loss.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "downtime-scrap-loss-statement",
    {
      toolKey: "downtime-scrap-loss-statement",
      formulaVersion: DOWNTIME_LOSS_FORMULA_VERSION,
      modelId: DOWNTIME_LOSS_MODEL_ID,
      arithmeticMode: DOWNTIME_LOSS_ARITHMETIC_MODE,
      schemaContractVersion: DOWNTIME_LOSS_SCHEMA_VERSION,
      propertyEvidenceId:
        "tests/pro-calculation-correctness/downtime-loss.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
  [
    "capital-equipment-investment-appraisal-npv-irr",
    {
      toolKey: "capital-equipment-investment-appraisal-npv-irr",
      formulaVersion: INVESTMENT_APPRAISAL_FORMULA_VERSION,
      modelId: INVESTMENT_APPRAISAL_MODEL_ID,
      arithmeticMode: INVESTMENT_APPRAISAL_ARITHMETIC_MODE,
      schemaContractVersion: INVESTMENT_APPRAISAL_SCHEMA_VERSION,
      propertyEvidenceId:
        "tests/pro-calculation-correctness/investment-appraisal.property.test.ts",
      status: "CERTIFIED_FOR_EXECUTION",
    },
  ],
]);

export function getFormulaVerificationRecord(
  toolKey: string,
): FormulaVerificationRecord | null {
  return VERIFIED_FORMULAS.get(toolKey) ?? null;
}

export function isFormulaCertifiedForExecution(toolKey: string): boolean {
  return VERIFIED_FORMULAS.has(toolKey);
}

export function verifyFormulaModuleCertification(
  formulaModule: ProFormulaModule,
  schemaFormulaVersion: string | undefined,
  schemaContractVersion: string | undefined,
): { ok: true; record: FormulaVerificationRecord } | {
  ok: false;
  errors: string[];
} {
  const record = getFormulaVerificationRecord(formulaModule.toolKey);
  if (!record) {
    return {
      ok: false,
      errors: [
        "No certified Decimal/property verification record exists for " +
          formulaModule.toolKey +
          ".",
      ],
    };
  }

  const errors: string[] = [];
  if (formulaModule.formulaVersion !== record.formulaVersion) {
    errors.push("Formula version does not match the verification record.");
  }
  if (schemaFormulaVersion !== record.formulaVersion) {
    errors.push("Schema formula version does not match the verification record.");
  }
  if (schemaContractVersion !== record.schemaContractVersion) {
    errors.push("Schema contract version does not match the verification record.");
  }
  if (formulaModule.modelId !== record.modelId) {
    errors.push("Formula model id does not match the verification record.");
  }
  if (formulaModule.arithmeticMode !== record.arithmeticMode) {
    errors.push("Formula arithmetic mode is not certified.");
  }
  if (formulaModule.verificationEvidenceId !== record.propertyEvidenceId) {
    errors.push("Formula property evidence id does not match the verification record.");
  }

  return errors.length === 0
    ? { ok: true, record }
    : { ok: false, errors };
}

export function listCertifiedFormulaKeys(): string[] {
  return [...VERIFIED_FORMULAS.keys()].sort();
}
