export type SchemaInput = {
  readonly id: string;
  readonly unit?: string;
  readonly label?: string;
  readonly type?: string;
};

export type SchemaRecord = Record<string, unknown> & {
  toolName?: string;
  premiumRequired?: boolean;
  title?: string;
  description?: string;
  inputs?: SchemaInput[];
  formulas?: Record<string, string>;
  outputs?: Record<string, unknown>;
};

export type RepairPatch = {
  formulas: Record<string, string>;
  outputs: Record<string, unknown>;
};

export type RepairResult = {
  slug: string;
  method: "archetype" | "deepseek" | "skipped";
  ok: boolean;
  reason?: string;
};
