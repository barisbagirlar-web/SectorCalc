import type {
  SmartFormCondition,
  SmartFormDefinition,
  SmartFormMode,
  SmartFormScenario,
  SmartInputRequirement,
} from "@/lib/smart-form/dynamic-form-types";

function evaluateConditions(
  conditions: readonly SmartFormCondition[] | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  return conditions.every((condition) => {
    const raw = values[condition.key];
    if (condition.equals !== undefined) {
      return raw === condition.equals || String(raw) === String(condition.equals);
    }
    if (condition.notEquals !== undefined) {
      return raw !== condition.notEquals && String(raw) !== String(condition.notEquals);
    }
    return true;
  });
}

function resolveScenario(
  definition: SmartFormDefinition,
  scenarioId: string,
): SmartFormScenario | undefined {
  return definition.scenarios.find((scenario) => scenario.id === scenarioId);
}

function isInputInScenario(input: SmartInputRequirement, scenario: SmartFormScenario): boolean {
  return scenario.inputKeys.includes(input.key);
}

function isInputVisibleForMode(input: SmartInputRequirement, mode: SmartFormMode): boolean {
  if (mode === "advanced") {
    return true;
  }
  return input.mode !== "advanced";
}

export function getVisibleInputs(
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): SmartInputRequirement[] {
  const scenario = resolveScenario(definition, scenarioId) ?? definition.scenarios[0];
  if (!scenario) {
    return [];
  }

  return definition.inputs.filter((input) => {
    if (!isInputInScenario(input, scenario)) {
      return false;
    }
    if (!isInputVisibleForMode(input, mode)) {
      return false;
    }
    return evaluateConditions(input.visibleWhen, values);
  });
}

export function getRequiredInputs(
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): SmartInputRequirement[] {
  const visible = getVisibleInputs(definition, values, mode, scenarioId);

  return visible.filter((input) => {
    if (input.required) {
      return true;
    }
    return evaluateConditions(input.requiredWhen, values);
  });
}

export function getScenarioById(
  definition: SmartFormDefinition,
  scenarioId: string,
): SmartFormScenario | undefined {
  return resolveScenario(definition, scenarioId);
}
