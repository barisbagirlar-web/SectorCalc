export type SmartFormFieldSpec = {
  readonly key: string;
  readonly label?: string;
  readonly type?: string;
  readonly unit?: string;
  readonly displayUnit?: string;
};

export type SmartFormContractFieldPlan = {
  readonly key: string;
  readonly slug?: string;
  readonly fields: readonly SmartFormFieldSpec[];
};

export function buildSmartFormFieldSpecsFromContract(): readonly SmartFormContractFieldPlan[] {
  return [];
}

export function buildSmartFormContractFieldPlan(): readonly SmartFormContractFieldPlan[] {
  return [];
}

export function adaptSmartFormContractFields(): readonly SmartFormContractFieldPlan[] {
  return [];
}

export function planSmartFormContractFields(): readonly SmartFormContractFieldPlan[] {
  return [];
}
