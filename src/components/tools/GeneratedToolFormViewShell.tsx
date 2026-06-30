import { GeneratedToolFormView } from "@/components/tools/GeneratedToolFormView";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

export type GeneratedToolFormViewShellProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
};

export function GeneratedToolFormViewShell({ slug, schema }: GeneratedToolFormViewShellProps) {
  return <GeneratedToolFormView slug={slug} schema={schema} />;
}
