"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_EMISSION_FACTORS,
  getCalculationMapFromFactors,
  getEmissionFactors,
  type EmissionFactor,
} from "@/lib/emission-factors";
import type { CarbonEmissionFactorMap } from "@/lib/carbon/carbon-footprint-report";

export type UseEmissionFactorsState = {
  readonly factors: EmissionFactor[];
  readonly calculationMap: CarbonEmissionFactorMap;
  readonly loading: boolean;
  readonly source: "firestore" | "default";
  readonly error: string | null;
};

const INITIAL_STATE: UseEmissionFactorsState = {
  factors: [...DEFAULT_EMISSION_FACTORS],
  calculationMap: getCalculationMapFromFactors(DEFAULT_EMISSION_FACTORS),
  loading: true,
  source: "default",
  error: null,
};

export function useEmissionFactors(userId?: string | null): UseEmissionFactorsState {
  const [state, setState] = useState<UseEmissionFactorsState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    async function loadFactors() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const factors = await getEmissionFactors(userId);
        if (cancelled) {
          return;
        }

        const usedDefaults =
          factors.length === DEFAULT_EMISSION_FACTORS.length &&
          factors.every((factor, index) => factor.category === DEFAULT_EMISSION_FACTORS[index]?.category);

        setState({
          factors,
          calculationMap: getCalculationMapFromFactors(factors),
          loading: false,
          source: usedDefaults ? "default" : "firestore",
          error: null,
        });
      } catch {
        if (cancelled) {
          return;
        }

        setState({
          factors: [...DEFAULT_EMISSION_FACTORS],
          calculationMap: getCalculationMapFromFactors(DEFAULT_EMISSION_FACTORS),
          loading: false,
          source: "default",
          error: "Emission factors could not be loaded.",
        });
      }
    }

    void loadFactors();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
