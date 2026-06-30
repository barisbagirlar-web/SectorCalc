import type { JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export type SemanticSchemaInput = {
  readonly locale: string;
  readonly url: string;
};

export type CalculatorSchemaInput = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly locale: string;
  readonly url: string;
  readonly inputParameters?: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly unitText?: string;
    readonly required?: boolean;
  }>;
  readonly outputParameters?: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly unitText?: string;
  }>;
};

export type { JsonLdRecord };
