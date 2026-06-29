import { describe, expect, test } from "vitest";
import {
  calculateIndicatedHorsepower,
  validateIndicatedHorsepower,
} from "../indicated-horsepower-calculator";

describe("indicated-horsepower-calculator", () => {
  test("validates input correctly", () => {
    const invalidInput = {
      meanEffectivePressure: -1,
      strokeLength: 0,
      cylinderBore: 80,
      engineRpm: 3000,
      cylinderCount: 4,
      cycleType: 5,
    };
    const errors = validateIndicatedHorsepower(invalidInput);
    expect(errors.meanEffectivePressure).toBeDefined();
    expect(errors.strokeLength).toBeDefined();
    expect(errors.cycleType).toBeDefined();
    expect(errors.cylinderBore).toBeUndefined();
  });

  test("calculates horsepower, speed and displacement correctly for 4-stroke", () => {
    const input = {
      meanEffectivePressure: 8.5, // bar
      strokeLength: 90, // mm
      cylinderBore: 80, // mm
      engineRpm: 3200, // rpm
      cylinderCount: 4,
      cycleType: 4, // 4-stroke
    };

    const output = calculateIndicatedHorsepower(input);
    expect(output).not.toBeNull();
    if (output) {
      // 1.8L Engine (1.8096 Litres)
      expect(output.totalDisplacement).toBeCloseTo(1.80955, 3);
      // Piston Speed = 2 * 0.09 * (3200 / 60) = 9.6 m/s
      expect(output.pistonSpeed).toBeCloseTo(9.6, 2);
      // Theoretical IHP (approx 55.77 hp)
      expect(output.indicatedHorsepower).toBeCloseTo(55.77, 1);
      // Power kW (approx 41.02 kW)
      expect(output.powerOutputKw).toBeCloseTo(41.02, 1);
    }
  });

  test("calculates horsepower correctly for 2-stroke (double the power strokes of 4-stroke)", () => {
    const input = {
      meanEffectivePressure: 8.5,
      strokeLength: 90,
      cylinderBore: 80,
      engineRpm: 3200,
      cylinderCount: 4,
      cycleType: 2, // 2-stroke
    };

    const output = calculateIndicatedHorsepower(input);
    expect(output).not.toBeNull();
    if (output) {
      expect(output.totalDisplacement).toBeCloseTo(1.80955, 3);
      expect(output.pistonSpeed).toBeCloseTo(9.6, 2);
      // Should be double the IHP of 4-stroke (approx 111.53 hp)
      expect(output.indicatedHorsepower).toBeCloseTo(111.53, 1);
      expect(output.powerOutputKw).toBeCloseTo(82.03, 1);
    }
  });
});
