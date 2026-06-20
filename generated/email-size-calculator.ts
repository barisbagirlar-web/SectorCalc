// Auto-generated from email-size-calculator-schema.json
import * as z from 'zod';

export interface Email_size_calculatorInput {
  textCharacters: number;
  attachmentCount: number;
  avgAttachmentSize: number;
  embeddedImageCount: number;
  avgImageSize: number;
  metadataSize: number;
  dataConfidence?: number;
}

export const Email_size_calculatorInputSchema = z.object({
  textCharacters: z.number().default(1000),
  attachmentCount: z.number().default(2),
  avgAttachmentSize: z.number().default(500),
  embeddedImageCount: z.number().default(3),
  avgImageSize: z.number().default(200),
  metadataSize: z.number().default(1024),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Email_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.textCharacters + (input.attachmentCount * input.avgAttachmentSize * 1024) + (input.embeddedImageCount * input.avgImageSize * 1024) + input.metadataSize; results["totalBytes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBytes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBytes"])) / 1024; results["totalKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalKB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalKB"])) / 1024; results["totalMB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMB"] = Number.NaN; }
  try { const v = input.textCharacters / 1024; results["textKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["textKB"] = Number.NaN; }
  try { const v = input.attachmentCount * input.avgAttachmentSize; results["attachmentsKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["attachmentsKB"] = Number.NaN; }
  try { const v = input.embeddedImageCount * input.avgImageSize; results["imagesKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["imagesKB"] = Number.NaN; }
  try { const v = input.metadataSize / 1024; results["metadataKB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metadataKB"] = Number.NaN; }
  return results;
}


export function calculateEmail_size_calculator(input: Email_size_calculatorInput): Email_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalKB"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Email_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
