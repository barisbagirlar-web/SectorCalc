import { RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109InputSchema, type RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109Input } from "./rulman-omru-l10h-ve-gelistirilmis-modifiye-omur-iso-281-calculator-109-validation";

export const calculateRulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109Contract: any = {
  id: "rulman-omru-l10h-ve-gelistirilmis-modifiye-omur-iso-281-calculator-109",
  version: "1.0.0",
  category: "cost",
  inputSchema: RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure input with validation
      const {
        dynamicLoadC,
        equivLoadP,
        rpm,
        bearingType,
        reliabilityA1,
        viscosityRatioKappa,
        contaminationEc,
        fatigueLimitPu
      } = input as RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109Input;

      // Guard against division by zero
      if (equivLoadP === 0 || rpm === 0) {
        throw new Error("Eşdeğer Dinamik Yük (P) ve Çalışma Devri (n) sıfır olamaz.");
      }

      // Formula: L10_Revs = (C / P)^p
      const l10Revs = Math.pow(dynamicLoadC / equivLoadP, bearingType);

      // Formula: L10h_Hours = (L10_Revs * 1,000,000) / (60 * rpm)
      const l10hHours = (l10Revs * 1000000) / (60 * rpm);

      // Formula: a_iso_factor = 0.1 * (1 - (Pu * ec / P))^1.5 * sqrt(κ)
      // Clamp the inner term to prevent negative values in power calculation
      const innerTerm = 1 - (fatigueLimitPu * contaminationEc / equivLoadP);
      const clampedInnerTerm = Math.max(0, innerTerm);
      const aIsoFactor = 0.1 * Math.pow(clampedInnerTerm, 1.5) * Math.sqrt(viscosityRatioKappa);

      // Formula: Lnm_Modified_Hours = a1 * a_iso * L10h_Hours
      const lnmModifiedHours = reliabilityA1 * aIsoFactor * l10hHours;

      // Formula: Life_Reduction_Pct = (1 - (Lnm / L10h)) * 100
      const lifeReductionPct = l10hHours > 0 
        ? (1 - (lnmModifiedHours / l10hHours)) * 100 
        : 0;

      return {
        l10Revs: Math.round(l10Revs * 100) / 100,
        l10hHours: Math.round(l10hHours * 100) / 100,
        aIsoFactor: Math.round(aIsoFactor * 10000) / 10000,
        lnmModifiedHours: Math.round(lnmModifiedHours * 100) / 100,
        lifeReductionPct: Math.round(lifeReductionPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};