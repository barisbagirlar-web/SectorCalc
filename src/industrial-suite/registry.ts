import type { ToolDefinition } from './engine.js';
import { CORE_ADAPTER_TOOLS } from './registry-core-adapters.js';
import { MACHINING_TOOLS } from './registry-machining.js';
import { FABRICATION_TOOLS } from './registry-fabrication.js';
import { PROCESS_TOOLS } from './registry-process.js';
import { MIGRATED_TOOLS } from './registry-migrated.js';
import { SC021_BEARING } from './registry-bearing.js';

const overrideDefaults: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  'SC-025': { allowT: 5000 },
  'SC-028': { ra: 0.0016 },
  'SC-031': { legWll: 20 },
  'SC-032': { shackleWll: 30, liftPointWll: 30 },
  'SC-036': { proof: 800 }
};

function normalizeDefinition(tool: ToolDefinition): ToolDefinition {
  const overrides = overrideDefaults[tool.code];
  if (!overrides) return tool;
  return {
    ...tool,
    fields: tool.fields.map((field) => {
      if (field.kind !== 'number') return field;
      const next = overrides[field.id];
      if (next === undefined) return field;
      return { ...field, defaultValue: next, ...(field.id === 'ra' ? { step: 0.00005 } : {}) };
    })
  };
}

export const INDUSTRIAL_TOOLS: readonly ToolDefinition[] = [
  ...CORE_ADAPTER_TOOLS,
  ...MIGRATED_TOOLS,
  SC021_BEARING,
  ...MACHINING_TOOLS,
  ...FABRICATION_TOOLS,
  ...PROCESS_TOOLS
].map(normalizeDefinition);

export function getIndustrialTool(code: string): ToolDefinition {
  const found = INDUSTRIAL_TOOLS.find((tool) => tool.code === code);
  if (!found) throw new Error(`Unknown industrial tool code: ${code}`);
  return found;
}
