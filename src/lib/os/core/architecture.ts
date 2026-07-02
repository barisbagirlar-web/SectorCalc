/**
 * SectorCalc Industrial OS - architecture contract.
 * Registry-Driven / Logic-Decoupled pattern.
 */

export const INDUSTRIAL_OS_ARCHITECTURE = {
  pattern: "registry-driven-logic-decoupled",
  layers: {
    data: "SectorRegistry",
    logic: "U-Engine + FormulaRepository",
    intelligence: "Benchmark & Prescription Engine",
  },
  directories: {
    core: "src/lib/os/core",
    registry: "src/lib/os/registry",
    terminalUi: "src/components/os",
  },
  constraints: {
    typeSafety: "strict-typescript",
    formulas: "modular-no-hardcoding",
    ui: "terminal-ux",
    offline: "offline-first-ready",
  },
} as const;

export type IndustrialOsLayer = keyof typeof INDUSTRIAL_OS_ARCHITECTURE.layers;
