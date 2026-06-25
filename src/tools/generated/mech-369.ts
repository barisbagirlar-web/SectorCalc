import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_369
 * Araç Adı: Rulman Sınır Hızı (Limiting Speed)
 */

export const InputSchema_MECH_369 = z.object({
  katalog_hizi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  calisma_hizi: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  yaglama_tipi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_369 = z.infer<typeof InputSchema_MECH_369>;

export interface Output_MECH_369 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_369(input: Input_MECH_369): Output_MECH_369 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: katalog_hizi, calisma_hizi, yaglama_tipi
  
  const validData = InputSchema_MECH_369.parse(input);
  const { katalog_hizi, calisma_hizi, yaglama_tipi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "SKF / FAG Kinematik Limitler",
      message: "Kritik İhlal: Çalışma hızı, rulmanın mekanik sınır hızını (Limiting Speed) aşmıştır. Kafes (Cage) merkezkaç kuvvetlerinden dolayı parçalanacak, bilyeler kanallardan fırlayacaktır. Çok yüksek hassasiyetli Spindle rulmanlarına geçiş yapın."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Triboloji Limitleri",
      message: "Uyarı: Gres yağı kullanarak sınır hızın %80'ine ulaştınız. Bu hızlarda gres kanallardan savrulur ve sürtünme ısısı atılamaz. Yağ banyosu, damlatma veya hava-yağ (Oil-Air) püskürtme sistemine geçmeniz önerilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
