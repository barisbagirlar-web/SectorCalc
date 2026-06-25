import { Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167InputSchema, type Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167Input } from "./iso-4406-akiskan-temizligi-partikul-sayimi-ve-filtre-verimi-calculator-167-validation";

export const calculateIso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167Contract: any = {
  id: "iso-4406-akiskan-temizligi-partikul-sayimi-ve-filtre-verimi-calculator-167",
  version: "1.0.0",
  category: "cost",
  inputSchema: Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167InputSchema,
  
  execute: async (input: any) => {
    try {
      // Input destructuring with defaults
      const particles4um = input.particles4um ?? 0;
      const particles6um = input.particles6um ?? 0;
      const particles14um = input.particles14um ?? 0;
      const filterBetaX = input.filterBetaX ?? 1;
      const targetIsoCode = input.targetIsoCode ?? 0;

      // Validate inputs to prevent math errors
      if (particles4um <= 0) {
        throw new Error("particles4um must be greater than 0");
      }
      if (particles6um <= 0) {
        throw new Error("particles6um must be greater than 0");
      }
      if (particles14um <= 0) {
        throw new Error("particles14um must be greater than 0");
      }
      if (filterBetaX <= 0) {
        throw new Error("filterBetaX must be greater than 0");
      }

      // ISO 4406 Cleanliness Codes
      // Code = CEILING(LOG10(particle_count) / LOG10(2))
      // This is the standard ISO 4406 method - each code step doubles the particle count
      const code4um = Math.ceil(Math.log10(particles4um) / Math.log10(2));
      const code6um = Math.ceil(Math.log10(particles6um) / Math.log10(2));
      const code14um = Math.ceil(Math.log10(particles14um) / Math.log10(2));

      // Filter Efficiency Percentage
      // Beta ratio = particles upstream / particles downstream
      // Efficiency = (1 - 1/Beta) * 100%
      const filterEfficiencyPct = (1 - (1 / filterBetaX)) * 100;

      // Downstream particles for 6µm size
      // particles_downstream = particles_upstream / filter_beta
      const downstreamParticles6um = particles6um / filterBetaX;

      return {
        code4um: Math.round(code4um * 100) / 100,
        code6um: Math.round(code6um * 100) / 100,
        code14um: Math.round(code14um * 100) / 100,
        filterEfficiencyPct: Math.round(filterEfficiencyPct * 100) / 100,
        downstreamParticles6um: Math.round(downstreamParticles6um * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};