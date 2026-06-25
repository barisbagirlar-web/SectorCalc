import { LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111InputSchema, type LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111Input } from "./lazer-kesim-odak-spot-capi-ve-enerji-yogunlugu-calculator-111-validation";

export const calculateLazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111Contract: any = {
  id: "lazer-kesim-odak-spot-capi-ve-enerji-yogunlugu-calculator-111",
  version: "1.0.0",
  category: "cost",
  inputSchema: LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111InputSchema,
  
  execute: async (input: any) => {
    try {
      const PI = Math.PI;
      
      // Parse inputs with default values
      const laserPower = Number(input.laserPower) || 0; // W
      const wavelength = Number(input.wavelength) || 0; // µm
      const beamQualityM2 = Number(input.beamQualityM2) || 0; // M² factor (dimensionless)
      const focalLength = Number(input.focalLength) || 0; // mm
      const inputBeamDia = Number(input.inputBeamDia) || 0; // mm
      const feedRate = Number(input.feedRate) || 0; // m/dk

      // Validate inputs to avoid division by zero
      if (inputBeamDia === 0 || feedRate === 0 || wavelength === 0 || beamQualityM2 === 0) {
        throw new Error("Input values cannot be zero. Please provide valid positive numbers.");
      }

      // Step 1: Spot Diameter in µm
      // Formula: Spot_Diameter_um = (4 * wavelength * focal_length * beam_quality_m2) / (PI * input_beam_dia)
      const spotDiameterUm = (4 * wavelength * focalLength * beamQualityM2) / (PI * inputBeamDia);

      // Step 2: Spot Area in cm²
      // Convert spot diameter from µm to cm (1 cm = 10000 µm)
      const spotDiameterCm = spotDiameterUm / 10000;
      // Formula: Spot_Area_cm2 = (PI / 4) * (spot_diameter_cm)^2
      const spotAreaCm2 = (PI / 4) * Math.pow(spotDiameterCm, 2);

      // Step 3: Power Density in MW/cm²
      // Convert laser power from W to MW (1 MW = 1,000,000 W)
      const laserPowerMW = laserPower / 1000000;
      // Formula: Power_Density_MW_cm2 = laser_power_MW / Spot_Area_cm2
      const powerDensityMWCm2 = spotAreaCm2 > 0 ? laserPowerMW / spotAreaCm2 : 0;

      // Step 4: Specific Energy in J/mm
      // Convert feed rate from m/min to mm/s: 1 m/min = 1000 mm / 60 s = 1000/60 mm/s
      const feedRateMmPerSec = (feedRate * 1000) / 60;
      // Formula: Specific_Energy_J_mm = laser_power / (feed_rate_mm_per_sec)
      const specificEnergyJMm = feedRateMmPerSec > 0 ? laserPower / feedRateMmPerSec : 0;

      // Step 5: Rayleigh Length in mm
      // Convert spot diameter from µm to mm (1 mm = 1000 µm)
      const spotDiameterMm = spotDiameterUm / 1000;
      // Convert wavelength from µm to mm (1 mm = 1000 µm)
      const wavelengthMm = wavelength / 1000;
      // Formula: Rayleigh_Length_mm = (PI * (spot_diameter_mm)^2) / (4 * (wavelength_mm) * beam_quality_m2)
      const rayleighLengthMm = (PI * Math.pow(spotDiameterMm, 2)) / (4 * wavelengthMm * beamQualityM2);

      return {
        spotDiameterUm,
        spotAreaCm2,
        powerDensityMWCm2,
        specificEnergyJMm,
        rayleighLengthMm
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};