"use client";

import React, { useMemo } from "react";
import { DynamicFormEngine } from "./DynamicFormEngine";
import { adaptToolSchema, type AnyToolSchema } from "./schema-adapter";

export type DynamicToolFormWrapperProps = {
  /** Any tool schema (GeneratedToolSchema or native ToolData format) */
  schema: AnyToolSchema;
  /** Optional slug for identification */
  slug?: string;
  /** Show the tool-level masthead (default: false - use site header instead) */
  showMasthead?: boolean;
};

/**
 * Universal wrapper that accepts any tool schema and renders it through
 * the DynamicFormEngine. Works with both:
 * - Existing GeneratedToolSchema format (free & premium generated tools)
 * - Native ToolData format (full featured)
 * - Premium PRO tool JSON format
 */
export function DynamicToolFormWrapper({
  schema,
  slug,
  showMasthead = false,
}: DynamicToolFormWrapperProps) {
  const tool = useMemo(() => {
    // Detect if this is already in ToolData format (has ui_contract)
    if (schema.ui_contract && schema.inputs && schema.formulas) {
      return schema as Parameters<typeof DynamicFormEngine>[0]["tool"];
    }
    // Otherwise adapt from GeneratedToolSchema
    return adaptToolSchema(schema, slug);
  }, [schema, slug]);

  if (!tool || !tool.inputs || tool.inputs.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "rgba(26,25,21,0.4)",
          fontFamily: "ui-monospace, monospace",
          fontSize: 13,
        }}
      >
        DynamicFormEngine: No valid tool schema provided.
      </div>
    );
  }

  return <DynamicFormEngine tool={tool} showMasthead={showMasthead} />;
}
