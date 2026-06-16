// Auto-generated from stamp-duty-calculator-uk-schema.json
import * as z from 'zod';

export interface Stamp_duty_calculator_ukInput {
  propertyPrice: number;
  isFirstTimeBuyer: number;
  isAdditionalProperty: number;
  isNonUKResident: number;
}

export const Stamp_duty_calculator_ukInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalProperty: z.number().default(0),
  isNonUKResident: z.number().default(0),
});

function evaluateAllFormulas(input: Stamp_duty_calculator_ukInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let price = input.propertyPrice; let ftb = input.isFirstTimeBuyer; let additional = input.isAdditionalProperty; let nonUK = input.isNonUKResident; let sd = 0; let remaining = price; let bands = []; if (price <= 125000) { sd = 0; } else if (price <= 250000) { if (ftb === 1) { sd = 0; } else { sd = (price - 125000) * 0.02; } } else if (price <= 925000) { if (ftb === 1) { sd = (price - 250000) * 0.05; } else { sd = 125000 * 0 + (250000 - 125000) * 0.02 + (price - 250000) * 0.05; } } else if (price <= 1500000) { sd = 125000 * 0 + (250000 - 125000) * 0.02 + (925000 - 250000) * 0.05 + (price - 925000) * 0.1; } else { sd = 125000 * 0 + (250000 - 125000) * 0.02 + (925000 - 250000) * 0.05 + (1500000 - 925000) * 0.1 + (price - 1500000) * 0.12; } if (additional === 1) { sd += price * 0.03; } if (nonUK === 1) { sd += price * 0.02; return } sd; })(); results["calculateStampDuty"] = Number.isFinite(v) ? v : 0; } catch { results["calculateStampDuty"] = 0; }
  try { const v = (() => { let price = input.propertyPrice; let ftb = input.isFirstTimeBuyer; let additional = input.isAdditionalProperty; let nonUK = input.isNonUKResident; let breakdown = []; let sd = 0; let remaining = price; let band1 = Math.min(price, 125000); let tax1 = 0; breakdown.push('0% on first £125,000: £' + tax1.toFixed(2)); remaining -= band1; if (remaining > 0) { let band2 = Math.min(remaining, 125000); let tax2 = 0; if (ftb === 1) { tax2 = 0; } else { tax2 = band2 * 0.02; } breakdown.push('2% on next £125,000: £' + tax2.toFixed(2)); sd += tax2; remaining -= band2; } if (remaining > 0) { let band3 = Math.min(remaining, 675000); let tax3 = band3 * 0.05; breakdown.push('5% on next £675,000: £' + tax3.toFixed(2)); sd += tax3; remaining -= band3; } if (remaining > 0) { let band4 = Math.min(remaining, 575000); let tax4 = band4 * 0.1; breakdown.push('10% on next £575,000: £' + tax4.toFixed(2)); sd += tax4; remaining -= band4; } if (remaining > 0) { let tax5 = remaining * 0.12; breakdown.push('12% on remaining: £' + tax5.toFixed(2)); sd += tax5; } if (additional === 1) { let surcharge = price * 0.03; breakdown.push('Additional property surcharge (3%): £' + surcharge.toFixed(2)); sd += surcharge; } if (nonUK === 1) { let nonUKsurcharge = price * 0.02; breakdown.push('Non-UK resident surcharge (2%): £' + nonUKsurcharge.toFixed(2)); sd += nonUKsurcharge; return } breakdown; })(); results["calculateBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["calculateBreakdown"] = 0; }
  return results;
}


export function calculateStamp_duty_calculator_uk(input: Stamp_duty_calculator_ukInput): Stamp_duty_calculator_ukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Stamp_duty_calculator_ukOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
