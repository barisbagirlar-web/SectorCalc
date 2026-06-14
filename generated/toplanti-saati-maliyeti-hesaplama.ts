// Auto-generated from toplanti-saati-maliyeti-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ToplantiSaatiMaliyetiHesaplamaInput {
  participantCount: number;
  meetingDuration: number;
  averageHourlyRate: number;
  preparationTime: number;
  followUpTime: number;
  meetingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  dataConfidence: number;
}

export const ToplantiSaatiMaliyetiHesaplamaInputSchema = z.object({
  participantCount: z.number().min(1).max(100).default(5),
  meetingDuration: z.number().min(1).max(480).default(60),
  averageHourlyRate: z.number().min(0).max(10000).default(100),
  preparationTime: z.number().min(0).max(120).default(15),
  followUpTime: z.number().min(0).max(120).default(10),
  meetingFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly']).default('weekly'),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface ToplantiSaatiMaliyetiHesaplamaOutput {
  annualCost: number;
  breakdown: {
    totalCostPerMeeting: number;
    totalTimePerMeeting: number;
    meetingsPerYear: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ToplantiSaatiMaliyetiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalTimePerMeeting = ((): number => { try { const __v = input.meetingDuration + input.preparationTime + input.followUpTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerMeeting = ((): number => { try { const __v = (results.totalTimePerMeeting / 60) * input.averageHourlyRate * input.participantCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.meetingsPerYear = ((): number => { try { const __v = input.meetingFrequency == 'daily' ? 260 : (input.meetingFrequency == 'weekly' ? 52 : (input.meetingFrequency == 'biweekly' ? 26 : (input.meetingFrequency == 'monthly' ? 12 : 4))); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCost = ((): number => { try { const __v = results.totalCostPerMeeting * results.meetingsPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.annualCost * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateToplantiSaatiMaliyetiHesaplama(input: ToplantiSaatiMaliyetiHesaplamaInput): ToplantiSaatiMaliyetiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const annualCost = results.annualCost ?? 0;
  const breakdown = {
    totalCostPerMeeting: results.totalCostPerMeeting,
    totalTimePerMeeting: results.totalTimePerMeeting,
    meetingsPerYear: results.meetingsPerYear,
  };

  // rule: participantCount >= 1
  // rule: meetingDuration >= 1
  // rule: averageHourlyRate >= 0
  // rule: preparationTime >= 0
  // rule: followUpTime >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): totalCostPerMeeting
  // threshold skipped (non-string): annualCost

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualCost; } })();

  return {
    annualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (benchmark)","Detayli maliyet dokumu"],
  };
}
