import { FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58InputSchema, type FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58Input } from "./fmea-risk-oncelik-sayisi-rpn-ve-aksiyon-matrisi-calculator-58-validation";

export const calculateFmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58Contract: any = {
  id: "fmea-risk-oncelik-sayisi-rpn-ve-aksiyon-matrisi-calculator-58",
  version: "1.0.0",
  category: "cost",
  inputSchema: FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract validated input values
      const severity = input.severity;
      const occurrence = input.occurrence;
      const detection = input.detection;
      const mitigationCost = input.mitigationCost;
      const newSeverity = input.newSeverity;
      const newOccurrence = input.newOccurrence;
      const newDetection = input.newDetection;

      // Formula: RPN_Current = severity * occurrence * detection
      const rPNCurrent = severity * occurrence * detection;

      // Formula: Criticality_Index = severity * occurrence
      const criticalityIndex = severity * occurrence;

      // Formula: RPN_New = new_severity * new_occurrence * new_detection
      const rPNNew = newSeverity * newOccurrence * newDetection;

      // Formula: Risk_Reduction_Pct = ((RPN_Current - RPN_New) / RPN_Current) * 100
      const riskReductionPct = rPNCurrent > 0 
        ? ((rPNCurrent - rPNNew) / rPNCurrent) * 100 
        : 0;

      // Formula: Action_Priority = IF(severity >= 9, 'ACİL İSG', IF(RPN_Current >= 100, 'YÜKSEK - AKSİYON ŞART', IF(RPN_Current >= 50, 'ORTA - İYİLEŞTİR', 'DÜŞÜK - İZLE')))
      // Note: Return numeric value for action priority: 4=ACİL İSG, 3=YÜKSEK, 2=ORTA, 1=DÜŞÜK
      let actionPriority: number;
      if (severity >= 9) {
        actionPriority = 4; // ACİL İSG - Immediate action required
      } else if (rPNCurrent >= 100) {
        actionPriority = 3; // YÜKSEK - AKSİYON ŞART (High - Action Required)
      } else if (rPNCurrent >= 50) {
        actionPriority = 2; // ORTA - İYİLEŞTİR (Medium - Improvement)
      } else {
        actionPriority = 1; // DÜŞÜK - İZLE (Low - Monitor)
      }

      return {
        rPNCurrent: Math.round(rPNCurrent * 100) / 100,
        criticalityIndex: Math.round(criticalityIndex * 100) / 100,
        rPNNew: Math.round(rPNNew * 100) / 100,
        riskReductionPct: Math.round(riskReductionPct * 100) / 100,
        actionPriority: actionPriority
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};