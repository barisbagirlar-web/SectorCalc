import { buildSmartFormFieldSpecsFromContract } from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";
import type {
  DynamicSmartFormPilotSlug,
  SmartFormDefinition,
  SmartFormMode,
  SmartInputKind,
  SmartInputRequirement,
} from "@/lib/smart-form/dynamic-form-types";
import { slugToSmartFormToolKey } from "@/lib/smart-form/dynamic-form-types";

function mapFieldKind(type: "number" | "currency" | "percent"): SmartInputKind {
  if (type === "currency") {
    return "currency";
  }
  if (type === "percent") {
    return "percentage";
  }
  return "number";
}

function inputDef(
  slug: string,
  key: string,
  kind: SmartInputKind,
  config: Omit<SmartInputRequirement, "key" | "labelKey" | "helpKey" | "kind">,
): SmartInputRequirement {
  const toolKey = slugToSmartFormToolKey(slug);
  return {
    key,
    labelKey: `tools.${toolKey}.inputs.${key}.label`,
    helpKey: `tools.${toolKey}.inputs.${key}.help`,
    kind,
    ...config,
  };
}

function buildInputsFromContract(
  slug: DynamicSmartFormPilotSlug,
  modeByKey: Record<string, SmartFormMode>,
): SmartInputRequirement[] {
  const plan = buildSmartFormFieldSpecsFromContract(slug);
  if (!plan) {
    return [];
  }

  return plan.fields.map((field) =>
    inputDef(slug, field.key, mapFieldKind(field.type), {
      required: field.required,
      unit: field.unit,
      min: field.min,
      max: field.max,
      mode: modeByKey[field.key] ?? "simple",
    }),
  );
}

const CNC_MODE_BY_KEY: Record<string, SmartFormMode> = {
  setupTime: "simple",
  cycleTime: "simple",
  quantity: "simple",
  machineRate: "simple",
  riskMargin: "simple",
  toolCost: "advanced",
  materialCost: "advanced",
};

const WELDING_MODE_BY_KEY: Record<string, SmartFormMode> = {
  materialCost: "simple",
  laborHours: "simple",
  laborRate: "simple",
  fitUpHours: "simple",
  targetMargin: "simple",
  gasConsumableCost: "advanced",
  reworkRiskPercent: "advanced",
};

const HVAC_MODE_BY_KEY: Record<string, SmartFormMode> = {
  equipmentCost: "simple",
  laborHours: "simple",
  laborRate: "simple",
  callbackRiskPercent: "simple",
  targetMargin: "simple",
  ductworkCost: "advanced",
  commissioningCost: "advanced",
};

const CNC_DEFINITION: SmartFormDefinition = {
  toolSlug: "cnc-quote-risk-analyzer",
  defaultScenarioId: "quick_quote_check",
  scenarios: [
    {
      id: "quick_quote_check",
      labelKey: "tools.cncQuoteRiskAnalyzer.scenarios.quick_quote_check.label",
      descriptionKey: "tools.cncQuoteRiskAnalyzer.scenarios.quick_quote_check.description",
      inputKeys: ["setupTime", "cycleTime", "quantity", "machineRate", "riskMargin", "toolCost", "materialCost"],
    },
    {
      id: "detailed_margin_review",
      labelKey: "tools.cncQuoteRiskAnalyzer.scenarios.detailed_margin_review.label",
      descriptionKey: "tools.cncQuoteRiskAnalyzer.scenarios.detailed_margin_review.description",
      inputKeys: [
        "setupTime",
        "cycleTime",
        "quantity",
        "toolCost",
        "materialCost",
        "machineRate",
        "riskMargin",
      ],
    },
  ],
  inputs: buildInputsFromContract("cnc-quote-risk-analyzer", CNC_MODE_BY_KEY),
};

const WELDING_DEFINITION: SmartFormDefinition = {
  toolSlug: "welding-bid-risk-analyzer",
  defaultScenarioId: "field_repair",
  scenarios: [
    {
      id: "field_repair",
      labelKey: "tools.weldingBidRiskAnalyzer.scenarios.field_repair.label",
      descriptionKey: "tools.weldingBidRiskAnalyzer.scenarios.field_repair.description",
      inputKeys: [
        "materialCost",
        "laborHours",
        "laborRate",
        "fitUpHours",
        "targetMargin",
        "gasConsumableCost",
        "reworkRiskPercent",
      ],
    },
    {
      id: "production_weld_bid",
      labelKey: "tools.weldingBidRiskAnalyzer.scenarios.production_weld_bid.label",
      descriptionKey: "tools.weldingBidRiskAnalyzer.scenarios.production_weld_bid.description",
      inputKeys: [
        "materialCost",
        "laborHours",
        "laborRate",
        "gasConsumableCost",
        "fitUpHours",
        "reworkRiskPercent",
        "targetMargin",
      ],
    },
  ],
  inputs: buildInputsFromContract("welding-bid-risk-analyzer", WELDING_MODE_BY_KEY),
};

const HVAC_DEFINITION: SmartFormDefinition = {
  toolSlug: "hvac-project-margin-guard",
  defaultScenarioId: "small_service_job",
  scenarios: [
    {
      id: "small_service_job",
      labelKey: "tools.hvacProjectMarginGuard.scenarios.small_service_job.label",
      descriptionKey: "tools.hvacProjectMarginGuard.scenarios.small_service_job.description",
      inputKeys: [
        "equipmentCost",
        "laborHours",
        "laborRate",
        "callbackRiskPercent",
        "targetMargin",
        "ductworkCost",
        "commissioningCost",
      ],
    },
    {
      id: "commercial_project",
      labelKey: "tools.hvacProjectMarginGuard.scenarios.commercial_project.label",
      descriptionKey: "tools.hvacProjectMarginGuard.scenarios.commercial_project.description",
      inputKeys: [
        "equipmentCost",
        "ductworkCost",
        "laborHours",
        "laborRate",
        "commissioningCost",
        "callbackRiskPercent",
        "targetMargin",
      ],
    },
  ],
  inputs: buildInputsFromContract("hvac-project-margin-guard", HVAC_MODE_BY_KEY),
};

const DEFINITIONS: Record<DynamicSmartFormPilotSlug, SmartFormDefinition> = {
  "cnc-quote-risk-analyzer": CNC_DEFINITION,
  "welding-bid-risk-analyzer": WELDING_DEFINITION,
  "hvac-project-margin-guard": HVAC_DEFINITION,
};

export function getSmartFormDefinition(slug: string): SmartFormDefinition | null {
  if (!(slug in DEFINITIONS)) {
    return null;
  }
  return DEFINITIONS[slug as DynamicSmartFormPilotSlug];
}

export function getDefaultScenarioId(slug: string): string {
  return getSmartFormDefinition(slug)?.defaultScenarioId ?? "";
}
