import { ToolDefinition } from './engine.js';
import { MACHINING_TOOLS } from './registry-machining.js';
import { FABRICATION_TOOLS } from './registry-fabrication.js';
import { PROCESS_TOOLS } from './registry-process.js';

function normalizeDefinition(tool: ToolDefinition): ToolDefinition {
  if (tool.code !== 'SC-028') return tool;
  return {
    ...tool,
    fields: tool.fields.map((field) => field.id === 'ra' && field.kind === 'number'
      ? { ...field, defaultValue: 0.0016, step: 0.00005 }
      : field)
  };
}

export const INDUSTRIAL_TOOLS: readonly ToolDefinition[] = [
  ...MACHINING_TOOLS,
  ...FABRICATION_TOOLS,
  ...PROCESS_TOOLS
].map(normalizeDefinition);

export function getIndustrialTool(code: string): ToolDefinition {
  const found = INDUSTRIAL_TOOLS.find((tool) => tool.code === code);
  if (!found) throw new Error(`Unknown industrial tool code: ${code}`);
  return found;
}
