import type { TrustGateStatus } from "@/lib/features/generated-tools/trust-gate";

export type SteelCoreValidationLayer = "structural" | "industrial" | "trust";

export type SteelCoreSchemaIssue = {
  readonly layer: SteelCoreValidationLayer;
  readonly message: string;
};

export type SteelCoreSchemaValidationResult = {
  readonly file: string;
  readonly slug: string;
  readonly valid: boolean;
  readonly trustStatus: TrustGateStatus;
  readonly issues: readonly SteelCoreSchemaIssue[];
};

export type SteelCoreValidationReport = {
  readonly timestamp: string;
  readonly total: number;
  readonly valid: number;
  readonly invalid: number;
  readonly byStatus: Readonly<Record<TrustGateStatus, number>>;
  readonly results: readonly SteelCoreSchemaValidationResult[];
};

export type SteelCoreFallbackMetrics = {
  readonly timestamp: string;
  readonly total: number;
  readonly fallbackCount: number;
  readonly ratePercent: number;
  readonly thresholdPercent: number;
  readonly healthy: boolean;
};

export type SteelCoreHealthLog = {
  readonly timestamp: string;
  readonly validation: {
    readonly total: number;
    readonly valid: number;
    readonly invalid: number;
  };
  readonly fallback: SteelCoreFallbackMetrics;
  readonly pipelineVersion: string;
};
