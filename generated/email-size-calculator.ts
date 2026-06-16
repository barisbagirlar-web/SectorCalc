// Auto-generated from email-size-calculator-schema.json
import * as z from 'zod';

export interface Email_size_calculatorInput {
  textCharacters: number;
  attachmentCount: number;
  avgAttachmentSize: number;
  embeddedImageCount: number;
  avgImageSize: number;
  metadataSize: number;
}

export const Email_size_calculatorInputSchema = z.object({
  textCharacters: z.number().default(1000),
  attachmentCount: z.number().default(2),
  avgAttachmentSize: z.number().default(500),
  embeddedImageCount: z.number().default(3),
  avgImageSize: z.number().default(200),
  metadataSize: z.number().default(1024),
});

function evaluateAllFormulas(input: Email_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.textCharacters + (input.attachmentCount * input.avgAttachmentSize * 1024) + (input.embeddedImageCount * input.avgImageSize * 1024) + input.metadataSize; results["totalBytes"] = Number.isFinite(v) ? v : 0; } catch { results["totalBytes"] = 0; }
  try { const v = (results["totalBytes"] ?? 0) / 1024; results["totalKB"] = Number.isFinite(v) ? v : 0; } catch { results["totalKB"] = 0; }
  try { const v = (results["totalKB"] ?? 0) / 1024; results["totalMB"] = Number.isFinite(v) ? v : 0; } catch { results["totalMB"] = 0; }
  try { const v = input.textCharacters / 1024; results["textKB"] = Number.isFinite(v) ? v : 0; } catch { results["textKB"] = 0; }
  try { const v = input.attachmentCount * input.avgAttachmentSize; results["attachmentsKB"] = Number.isFinite(v) ? v : 0; } catch { results["attachmentsKB"] = 0; }
  try { const v = input.embeddedImageCount * input.avgImageSize; results["imagesKB"] = Number.isFinite(v) ? v : 0; } catch { results["imagesKB"] = 0; }
  try { const v = input.metadataSize / 1024; results["metadataKB"] = Number.isFinite(v) ? v : 0; } catch { results["metadataKB"] = 0; }
  return results;
}


export function calculateEmail_size_calculator(input: Email_size_calculatorInput): Email_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalKB"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
