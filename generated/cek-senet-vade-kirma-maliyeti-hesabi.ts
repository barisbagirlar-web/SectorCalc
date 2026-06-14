// Auto-generated from cek-senet-vade-kirma-maliyeti-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CekSenetVadeKirmaMaliyetiHesabiInput {
  nominalTutar: number;
  vadeGun: number;
  iskontoOrani: number;
  komisyonOrani: number;
  bankaKesintisi: number;
  vergiOrani: number;
}

export const CekSenetVadeKirmaMaliyetiHesabiInputSchema = z.object({
  nominalTutar: z.number().min(0).default(10000),
  vadeGun: z.number().min(1).max(365).default(90),
  iskontoOrani: z.number().min(0).max(100).default(1.5),
  komisyonOrani: z.number().min(0).max(10).default(0.5),
  bankaKesintisi: z.number().min(0).default(0),
  vergiOrani: z.number().min(0).max(100).default(10),
});

export interface CekSenetVadeKirmaMaliyetiHesabiOutput {
  netOdeme: number;
  breakdown: {
    iskontoTutari: number;
    komisyonTutari: number;
    bankaKesintisi: number;
    stopajVergisi: number;
    netKesinti: number;
    efektifMaliyetOrani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CekSenetVadeKirmaMaliyetiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.iskontoTutari = (() => { try { return input.nominalTutar * (input.iskontoOrani / 100) * (input.vadeGun / 30); } catch { return 0; } })();
  results.komisyonTutari = (() => { try { return input.nominalTutar * (input.komisyonOrani / 100); } catch { return 0; } })();
  results.brutKesinti = (() => { try { return results.iskontoTutari + results.komisyonTutari + input.bankaKesintisi; } catch { return 0; } })();
  results.stopajVergisi = (() => { try { return results.iskontoTutari * (input.vergiOrani / 100); } catch { return 0; } })();
  results.netKesinti = (() => { try { return results.brutKesinti + results.stopajVergisi; } catch { return 0; } })();
  results.netOdeme = (() => { try { return input.nominalTutar - results.netKesinti; } catch { return 0; } })();
  results.efektifMaliyetOrani = (() => { try { return (results.netKesinti / input.nominalTutar) * (360 / input.vadeGun) * 100; } catch { return 0; } })();
  return results;
}

export function calculateCekSenetVadeKirmaMaliyetiHesabi(input: CekSenetVadeKirmaMaliyetiHesabiInput): CekSenetVadeKirmaMaliyetiHesabiOutput {
  const results = evaluateFormulas(input);
  const netOdeme = results.netOdeme ?? 0;
  const breakdown = {
    iskontoTutari: results.iskontoTutari,
    komisyonTutari: results.komisyonTutari,
    bankaKesintisi: results.bankaKesintisi,
    stopajVergisi: results.stopajVergisi,
    netKesinti: results.netKesinti,
    efektifMaliyetOrani: results.efektifMaliyetOrani,
  };

  // rule: nominalTutar > 0
  // rule: vadeGun >= 1 && vadeGun <= 365
  // rule: iskontoOrani >= 0 && iskontoOrani <= 100
  // rule: komisyonOrani >= 0 && komisyonOrani <= 10
  // rule: bankaKesintisi >= 0
  // rule: vergiOrani >= 0 && vergiOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.iskontoOrani > 5) hiddenLossDrivers.push("iskontoOrani");
  if (input.komisyonOrani > 3) hiddenLossDrivers.push("komisyonOrani");

  const dataConfidenceAdjusted = (() => { try { return results.netOdeme; } catch { return netOdeme; } })();

  return {
    netOdeme,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis kirdirma islemleri)","Karsilastirma (farkli banka/oran senaryolari)","Detayli rapor (vergi ve kesinti dokumu)"],
  };
}
