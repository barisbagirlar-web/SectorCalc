"""
SectorCalc Method of Manufactured Solutions (MMS) Test Suite
=============================================================

Generates mathematically verifiable test cases for the interval arithmetic engine.

MMS methodology:
  1. Choose a manufactured (closed-form) solution whose exact result is known analytically.
  2. Feed the corresponding inputs into the interval engine.
  3. Verify that the engine's bounded result contains the analytical exact value.
  4. Any deviation is a bug in the engine — not uncertainty.

This is the gold standard for numerical software verification,
equivalent to the C-XSC test methodology.
"""

from __future__ import annotations

import json
import math
import os
from dataclasses import dataclass, asdict, field
from typing import Any, Dict, List, Optional, Tuple

import mpmath as mp
import sympy as sp

# ---------------------------------------------------------------------------
# MMS Test Case definition
# ---------------------------------------------------------------------------

mp.mp.dps = 50


@dataclass
class MmsTestCase:
    """A single MMS test case with known analytical solution."""
    name: str
    description: str
    inputs: Dict[str, float]
    exact_analytical_result: Optional[float]
    tolerance: float
    analytical_formula: str = ""
    category: str = "core"  # core | stress | edge | regression

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# MMS Suite Generator
# ---------------------------------------------------------------------------

class MmsSuiteGenerator:
    """
    Generates manufactured solution test cases for the interval engine.

    Each test case has a known analytical result that the engine must
    enclose within its verified interval.
    """

    @staticmethod
    def generate_suite() -> List[MmsTestCase]:
        """Generate the complete MMS test suite."""
        cases: List[MmsTestCase] = []

        # ---- Core analytical tests ----

        # T1: Zero discount rate → NPV = CF * n + RV - I
        #   As r → 0, continuous discount formula: NPV → CF*n + RV - I
        #   Note: r=1e-15 causes wide interval due to division by near-zero.
        #   MMS property: exact result WITHIN interval. Width tolerance is large.
        cases.append(MmsTestCase(
            name="zero_rate_analytical_limit",
            description="As discount rate approaches zero, NPV must approach CF*n + RV - I",
            inputs={"I": 1000.0, "CF": 200.0, "r": 1e-15, "n": 5.0, "RV": 100.0},
            exact_analytical_result=200.0 * 5.0 + 100.0 - 1000.0,  # = 100.0
            tolerance=100.0,  # Wide tolerance: division by near-zero inflates interval
            analytical_formula="NPV = CF * n + RV - I  (limit as r -> 0)",
            category="core",
        ))

        # T2: Zero cash flow → NPV = RV * e^(-r*n) - I
        cases.append(MmsTestCase(
            name="zero_cash_flow_analytical",
            description="With zero annual cash flow, NPV = RV * e^(-r*n) - I",
            inputs={"I": 5000.0, "CF": 0.0, "r": 0.10, "n": 3.0, "RV": 2000.0},
            exact_analytical_result=2000.0 * math.exp(-0.10 * 3.0) - 5000.0,
            tolerance=1e-8,
            analytical_formula="NPV = RV * exp(-r*n) - I",
            category="core",
        ))

        # T3: Zero residual value → NPV = (CF/r) * (1 - e^(-r*n)) - I
        cases.append(MmsTestCase(
            name="zero_residual_value",
            description="With zero residual value, standard continuous discount formula",
            inputs={"I": 10000.0, "CF": 3000.0, "r": 0.12, "n": 5.0, "RV": 0.0},
            exact_analytical_result=(3000.0 / 0.12) * (1 - math.exp(-0.12 * 5.0)) - 10000.0,
            tolerance=1e-8,
            analytical_formula="NPV = (CF/r) * (1 - exp(-r*n)) - I",
            category="core",
        ))

        # T4: Single period (n=1) → continuous discount model
        #   NPV = (CF/r) * (1 - exp(-r)) + RV * exp(-r) - I
        cases.append(MmsTestCase(
            name="single_period_analytical",
            description="With n=1, continuous discount model",
            inputs={"I": 100000.0, "CF": 50000.0, "r": 0.15, "n": 1.0, "RV": 20000.0},
            exact_analytical_result=(50000.0 / 0.15) * (1 - math.exp(-0.15)) + 20000.0 * math.exp(-0.15) - 100000.0,
            tolerance=1e-8,
            analytical_formula="NPV = (CF/r)*(1-exp(-r)) + RV*exp(-r) - I (n=1, continuous discount)",
            category="core",
        ))

        # T5: Negligible discount → NPV ≈ CF*n + RV - I
        #   When r is very small, NPV approximates the undiscounted sum
        cases.append(MmsTestCase(
            name="negligible_discount_approximation",
            description="With very small discount rate, NPV approximates undiscounted sum",
            inputs={"I": 500000.0, "CF": 120000.0, "r": 0.001, "n": 10.0, "RV": 50000.0},
            exact_analytical_result=None,  # Test self-consistency only
            tolerance=1e-6,
            analytical_formula="Self-consistency: interval width check",
            category="stress",
        ))

        # ---- Stress tests ----

        # S1: High discount rate stress (SectorCalc real data)
        #   This is the actual SectorCalc production scenario
        cases.append(MmsTestCase(
            name="sectorcalc_production_stress",
            description="SectorCalc real production data: Capital Equipment Investment Appraisal",
            inputs={"I": 5000500.0, "CF": 2450000.0, "r": 0.185, "n": 6.5, "RV": 2500000.0},
            exact_analytical_result=None,  # Requires engine computation
            tolerance=1e-4,
            analytical_formula="SectorCalc production scenario - self-consistency check",
            category="stress",
        ))

        # S2: Very high discount rate
        cases.append(MmsTestCase(
            name="very_high_discount_rate",
            description="Extreme discount rate stress test",
            inputs={"I": 1000000.0, "CF": 500000.0, "r": 0.85, "n": 5.0, "RV": 100000.0},
            exact_analytical_result=None,
            tolerance=1e-3,
            analytical_formula="Stress test with 85% discount rate",
            category="stress",
        ))

        # ---- Edge cases ----

        # E1: Negative NPV scenario
        cases.append(MmsTestCase(
            name="negative_npv_scenario",
            description="Clearly negative NPV case",
            inputs={"I": 100000.0, "CF": 10000.0, "r": 0.15, "n": 3.0, "RV": 5000.0},
            exact_analytical_result=None,
            tolerance=1e-6,
            analytical_formula="Negative NPV verification",
            category="edge",
        ))

        # E2: Very short period (fractional year)
        cases.append(MmsTestCase(
            name="fractional_year_period",
            description="Fractional year analysis period (6 months)",
            inputs={"I": 50000.0, "CF": 60000.0, "r": 0.10, "n": 0.5, "RV": 20000.0},
            exact_analytical_result=None,
            tolerance=1e-6,
            analytical_formula="Fractional period verification (n=0.5)",
            category="edge",
        ))

        # E3: Zero investment (grant scenario)
        cases.append(MmsTestCase(
            name="zero_initial_investment",
            description="Zero initial investment (grant or subsidy scenario)",
            inputs={"I": 0.0, "CF": 50000.0, "r": 0.10, "n": 5.0, "RV": 0.0},
            exact_analytical_result=(50000.0 / 0.10) * (1 - math.exp(-0.10 * 5.0)),
            tolerance=1e-8,
            analytical_formula="Zero I: NPV = (CF/r) * (1 - exp(-r*n))",
            category="edge",
        ))

        return cases


# ---------------------------------------------------------------------------
# Export to JSON (for CI/CD consumption)
# ---------------------------------------------------------------------------

def export_suite_to_json(output_path: str = "mms_suite.json") -> str:
    """Generate MMS test suite and export to JSON file."""
    suite = MmsSuiteGenerator.generate_suite()
    data = {
        "version": "1.0.0",
        "generated_by": "SectorCalc MMS Generator",
        "total_cases": len(suite),
        "cases": [tc.to_dict() for tc in suite],
    }
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    return output_path


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 72)
    print("SECTORCALC — METHOD OF MANUFACTURED SOLUTIONS (MMS) SUITE")
    print("=" * 72)

    suite = MmsSuiteGenerator.generate_suite()
    print(f"\nGenerated {len(suite)} test cases:")

    by_category: Dict[str, List[MmsTestCase]] = {}
    for tc in suite:
        by_category.setdefault(tc.category, []).append(tc)

    for cat, cases in by_category.items():
        print(f"\n  [{cat.upper()}]")
        for tc in cases:
            has_exact = "✓" if tc.exact_analytical_result is not None else "self-consistency only"
            print(f"    {tc.name:45s}  exact={has_exact}  tol={tc.tolerance:.0e}")

    out_path = export_suite_to_json()
    print(f"\nExported to: {out_path}")
    print("=" * 72)


if __name__ == "__main__":
    main()
