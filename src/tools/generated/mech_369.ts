/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: MECH_369
 * Name: Rulman Sınır Hızı (Limiting Speed)
 */

export const InputSchema_MECH_369 = z.object({
  katalog_hizi: z.number(),
  calisma_hizi: z.number(),
  yaglama_tipi: z.enum(["Gres", "Sıvı Yağ (Banyo/Damla)"]),
});

export type Input_MECH_369 = z.infer<typeof InputSchema_MECH_369>;

export interface Output_MECH_369 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_369(input: Input_MECH_369): Output_MECH_369 {
  const validData = InputSchema_MECH_369.parse(input);
  const { katalog_hizi, calisma_hizi, yaglama_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (calisma_hizi > katalog_hizi) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF / FAG Kinematik Limitler",
        message: "Kritik İhlal: Çalışma hızı, rulmanın mekanik sınır hızını (Limiting Speed) aşmıştır. Kafes (Cage) merkezkaç kuvvetlerinden dolayı parçalanacak, bilyeler kanallardan fırlayacaktır. Çok yüksek hassasiyetli Spindle rulmanlarına geçiş yapın."
      });
    }

    if (yaglama_tipi === 'Gres' && calisma_hizi > (katalog_hizi * 0.8)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Triboloji Limitleri",
        message: "Uyarı: Gres yağı kullanarak sınır hızın %80'ine ulaştınız. Bu hızlarda gres kanallardan savrulur ve sürtünme ısısı atılamaz. Yağ banyosu, damlatma veya hava-yağ (Oil-Air) püskürtme sistemine geçmeniz önerilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
