"""
SectorCalc Interval Arithmetic Engine — Unit Tests

Tests every method of IntervalArithmeticEngine for mathematical correctness.
Uses both exact analytical comparisons and property-based (Hypothesis) testing.
"""

from __future__ import annotations

from typing import Any, Dict, List

import mpmath as mp
import pytest
from hypothesis import assume, given, strategies as st
from mpmath import iv

from conftest import IntervalArithmeticEngine, NpvInputs  # type: ignore

# ---------------------------------------------------------------------------
# Fixed-precision analytical tests
# ---------------------------------------------------------------------------

class TestEngineInitialization:
    """Engine creates correctly with proper precision."""

    def test_precision_is_set(self, engine: IntervalArithmeticEngine) -> None:
        assert mp.mp.dps >= 50, f"Expected dps >= 50, got {mp.mp.dps}"
        assert iv.dps >= 50, f"Expected interval dps >= 50, got {iv.dps}"
        assert float(iv.pi.delta) < 1e-40, "Interval pi precision is below the certified threshold"

    def test_engine_creates_without_error(self, engine: IntervalArithmeticEngine) -> None:
        assert engine is not None


class TestNpvBounded:
    """NPV calculation with guaranteed bounds — analytical verification."""

    # ── T1: Finite near-zero rate analytical value ──────────────────────
    def test_zero_rate_limit(self, engine: IntervalArithmeticEngine) -> None:
        inputs = NpvInputs(I=1000.0, CF=200.0, r=1e-15, n=5.0, RV=100.0)
        result = engine.calculate_npv_bounded(inputs)

        r = mp.mpf(inputs.r)
        expected = float(
            (mp.mpf(inputs.CF) / r) * (1 - mp.exp(-r * inputs.n))
            + mp.mpf(inputs.RV) * mp.exp(-r * inputs.n)
            - mp.mpf(inputs.I)
        )
        npv = result.npv

        # MMS: analytical result must be within the computed interval
        assert npv.lower_bound <= expected <= npv.upper_bound, (
            f"MMS FAIL: Analytical result {expected} not in interval "
            f"[{npv.lower_bound}, {npv.upper_bound}]"
        )
        assert npv.status in ("VERIFIED", "WIDE_INTERVAL"), (
            f"Unexpected status: {npv.status}"
        )

    # ── T2: Zero cash flow ──────────────────────────────────────────────
    def test_zero_cash_flow(self, engine: IntervalArithmeticEngine) -> None:
        inputs = NpvInputs(I=5000.0, CF=0.0, r=0.10, n=3.0, RV=2000.0)
        result = engine.calculate_npv_bounded(inputs)

        r = mp.mpf(inputs.r)
        expected = float(mp.mpf(inputs.RV) * mp.exp(-r * inputs.n) - mp.mpf(inputs.I))
        npv = result.npv

        assert npv.lower_bound <= expected <= npv.upper_bound, (
            f"Analytical result {expected:.10f} not in interval "
            f"[{npv.lower_bound:.10f}, {npv.upper_bound:.10f}]"
        )

    # ── T3: Zero residual value ─────────────────────────────────────────
    def test_zero_residual_value(self, engine: IntervalArithmeticEngine) -> None:
        inputs = NpvInputs(I=10000.0, CF=3000.0, r=0.12, n=5.0, RV=0.0)
        result = engine.calculate_npv_bounded(inputs)

        r = mp.mpf(inputs.r)
        expected = float(
            (mp.mpf(inputs.CF) / r) * (1 - mp.exp(-r * inputs.n)) - mp.mpf(inputs.I)
        )
        npv = result.npv

        assert npv.lower_bound <= expected <= npv.upper_bound, (
            f"Analytical result {expected:.10f} not in interval "
            f"[{npv.lower_bound:.10f}, {npv.upper_bound:.10f}]"
        )

    # ── T4: Single period (continuous discounting model) ─────────────────
    #   For n=1: NPV = (CF/r) * (1 - exp(-r)) + RV * exp(-r) - I
    #   NOT (CF + RV) * exp(-r) - I (which is discrete annual compounding)
    def test_single_period(self, engine: IntervalArithmeticEngine) -> None:
        inputs = NpvInputs(I=100000.0, CF=50000.0, r=0.15, n=1.0, RV=20000.0)
        result = engine.calculate_npv_bounded(inputs)

        # Continuous discounting formula for n=1
        r = mp.mpf(inputs.r)
        exp_term = mp.exp(-r * inputs.n)
        expected = float(
            (mp.mpf(inputs.CF) / r) * (1 - exp_term)
            + mp.mpf(inputs.RV) * exp_term
            - mp.mpf(inputs.I)
        )
        npv = result.npv

        assert npv.lower_bound <= expected <= npv.upper_bound, (
            f"Analytical result {expected:.10f} not in interval "
            f"[{npv.lower_bound:.10f}, {npv.upper_bound:.10f}]"
        )

    # ── T5: SectorCalc production data ──────────────────────────────────
    def test_sectorcalc_production(self, engine: IntervalArithmeticEngine,
                                    sectorcalc_production_inputs: NpvInputs) -> None:
        result = engine.calculate_npv_bounded(sectorcalc_production_inputs)

        npv = result.npv
        irr = result.irr

        # All bounded results must have status VERIFIED or WIDE_INTERVAL
        assert npv.status in ("VERIFIED", "WIDE_INTERVAL"), f"NPV status: {npv.status}"
        assert irr.status in ("VERIFIED", "WIDE_INTERVAL"), f"IRR status: {irr.status}"

        # Interval bounds must be internally consistent
        assert npv.lower_bound <= npv.value <= npv.upper_bound
        assert irr.lower_bound <= irr.value <= irr.upper_bound

        # ULP error margin must be non-negative
        assert npv.ulp_error_margin >= 0
        assert irr.ulp_error_margin >= 0

    # ── T6: Output structure completeness ────────────────────────────────
    def test_all_metrics_present(self, engine: IntervalArithmeticEngine,
                                  standard_inputs: NpvInputs) -> None:
        result = engine.calculate_npv_bounded(standard_inputs)

        metrics = ["npv", "irr", "payback_years", "profitability_index",
                    "expanded_uncertainty", "decision"]
        for metric_name in metrics:
            metric = getattr(result, metric_name)
            assert metric is not None, f"Missing metric: {metric_name}"
            assert isinstance(metric.value, float), f"{metric_name}.value not float"
            assert isinstance(metric.ulp_error_margin, float), (
                f"{metric_name}.ulp_error_margin not float"
            )


class TestIrrBounded:
    """IRR calculation with interval arithmetic."""

    def test_irr_production_data(self, engine: IntervalArithmeticEngine,
                                  sectorcalc_production_inputs: NpvInputs) -> None:
        result = engine.calculate_npv_bounded(sectorcalc_production_inputs)
        irr = result.irr

        # IRR should be positive for this production scenario
        assert irr.value > 0, f"Expected positive IRR, got {irr.value}"
        # IRR should be within reasonable range
        assert 0.0 < irr.value < 2.0, f"IRR {irr.value} outside expected range"

    def test_irr_interval_consistency(self, engine: IntervalArithmeticEngine) -> None:
        """IRR interval must be self-consistent: lower <= value <= upper."""
        inputs = NpvInputs(I=5000.0, CF=1500.0, r=0.10, n=5.0, RV=500.0)
        result = engine.calculate_npv_bounded(inputs)

        assert result.irr.lower_bound <= result.irr.value <= result.irr.upper_bound


class TestPaybackBounded:
    """Payback period with interval arithmetic."""

    def test_payback_rough_estimate(self, engine: IntervalArithmeticEngine) -> None:
        """For equal CF, payback ≈ I / CF."""
        inputs = NpvInputs(I=100000.0, CF=25000.0, r=0.10, n=10.0, RV=0.0)
        result = engine.calculate_npv_bounded(inputs)

        expected = 100000.0 / 25000.0  # = 4.0 years
        payback = result.payback_years

        # The payback should be around 4 years
        assert payback.value == pytest.approx(expected, abs=0.5), (
            f"Payback {payback.value} too far from expected {expected}"
        )


class TestDecisionBounded:
    """Decision logic with interval arithmetic."""

    def test_positive_npv_pass_decision(self, engine: IntervalArithmeticEngine) -> None:
        """NPV > 0 and IRR > r → decision = 0 (PASS)."""
        inputs = NpvInputs(I=50000.0, CF=20000.0, r=0.05, n=5.0, RV=5000.0)
        result = engine.calculate_npv_bounded(inputs)

        assert result.npv.value > 0, "Expected positive NPV"
        assert result.decision.value == 0.0, (
            f"Expected PASS (0), got {result.decision.value}"
        )

    def test_negative_npv_hold_decision(self, engine: IntervalArithmeticEngine) -> None:
        """NPV <= 0 → decision = 2 (HOLD)."""
        inputs = NpvInputs(I=100000.0, CF=10000.0, r=0.20, n=3.0, RV=0.0)
        result = engine.calculate_npv_bounded(inputs)

        assert result.decision.value == 2.0, (
            f"Expected HOLD (2) for negative NPV, got {result.decision.value}"
        )


# ---------------------------------------------------------------------------
# Property-based tests (Hypothesis)
# ---------------------------------------------------------------------------

class TestHypothesisProperties:
    """
    Property-based tests using Hypothesis.

    These discover edge cases that fixed test cases might miss.
    """

    @given(
        I=st.floats(min_value=1000, max_value=10_000_000, allow_nan=False, allow_infinity=False),
        CF=st.floats(min_value=1000, max_value=5_000_000, allow_nan=False, allow_infinity=False),
        r=st.floats(min_value=0.01, max_value=0.50, allow_nan=False, allow_infinity=False),
        n=st.floats(min_value=1.0, max_value=20.0, allow_nan=False, allow_infinity=False),
        RV=st.floats(min_value=0, max_value=5_000_000, allow_nan=False, allow_infinity=False),
    )
    def test_interval_always_contains_midpoint(
        self, engine: IntervalArithmeticEngine,
        I: float, CF: float, r: float, n: float, RV: float,
    ) -> None:
        """For any valid inputs, the midpoint must always be within [lower, upper]."""
        inputs = NpvInputs(I=I, CF=CF, r=r, n=n, RV=RV)
        result = engine.calculate_npv_bounded(inputs)
        npv = result.npv

        assert npv.lower_bound <= npv.value <= npv.upper_bound, (
            f"Midpoint {npv.value} outside [{npv.lower_bound}, {npv.upper_bound}]"
        )

    @given(
        I=st.floats(min_value=1000, max_value=10_000_000, allow_nan=False, allow_infinity=False),
        CF=st.floats(min_value=1000, max_value=5_000_000, allow_nan=False, allow_infinity=False),
        r=st.floats(min_value=0.01, max_value=0.50, allow_nan=False, allow_infinity=False),
        n=st.floats(min_value=1.0, max_value=20.0, allow_nan=False, allow_infinity=False),
        RV=st.floats(min_value=0, max_value=5_000_000, allow_nan=False, allow_infinity=False),
    )
    def test_error_margin_non_negative(
        self, engine: IntervalArithmeticEngine,
        I: float, CF: float, r: float, n: float, RV: float,
    ) -> None:
        """ULP error margin must never be negative."""
        inputs = NpvInputs(I=I, CF=CF, r=r, n=n, RV=RV)
        result = engine.calculate_npv_bounded(inputs)

        for metric in [result.npv, result.irr, result.payback_years,
                        result.profitability_index, result.expanded_uncertainty]:
            assert metric.ulp_error_margin >= 0, (
                f"Negative error margin: {metric.ulp_error_margin}"
            )

    @given(
        I=st.floats(min_value=1000, max_value=10_000_000, allow_nan=False, allow_infinity=False),
        CF=st.floats(min_value=1000, max_value=5_000_000, allow_nan=False, allow_infinity=False),
        r=st.floats(min_value=0.01, max_value=0.50, allow_nan=False, allow_infinity=False),
        n=st.floats(min_value=1.0, max_value=20.0, allow_nan=False, allow_infinity=False),
        RV=st.floats(min_value=0, max_value=5_000_000, allow_nan=False, allow_infinity=False),
    )
    def test_output_contract_all_fields_present(
        self, engine: IntervalArithmeticEngine,
        I: float, CF: float, r: float, n: float, RV: float,
    ) -> None:
        """Every metric must have the 5 required fields (contract check)."""
        inputs = NpvInputs(I=I, CF=CF, r=r, n=n, RV=RV)
        result = engine.calculate_npv_bounded(inputs)

        required_fields = ["value", "lower_bound", "upper_bound", "ulp_error_margin", "status"]
        metrics = [result.npv, result.irr, result.payback_years,
                    result.profitability_index, result.expanded_uncertainty,
                    result.decision]

        for metric in metrics:
            d = metric.to_dict()
            for field in required_fields:
                assert field in d, f"Missing required field '{field}' in {d}"


class TestBatchCalculation:
    """Multi-scenario batch calculation."""

    def test_batch_with_two_scenarios(self, engine: IntervalArithmeticEngine) -> None:
        base = NpvInputs(I=100000.0, CF=30000.0, r=0.10, n=5.0, RV=10000.0)
        scenarios = [
            {"r": 0.15},  # Higher discount rate
            {"CF": 15000.0},  # Lower cash flow
        ]
        results = engine.calculate_batch(base, scenarios)

        assert len(results) == 2, f"Expected 2 results, got {len(results)}"

        # Both results must be valid (verified or wide interval)
        for i, r in enumerate(results):
            assert r.npv.status in ("VERIFIED", "WIDE_INTERVAL"), (
                f"Result {i}: unexpected status {r.npv.status}"
            )
            assert r.npv.lower_bound <= r.npv.value <= r.npv.upper_bound, (
                f"Result {i}: value outside bounds"
            )
            # All metrics must be present
            for metric in [r.npv, r.irr, r.payback_years, r.profitability_index]:
                assert metric.ulp_error_margin >= 0, (
                    f"Result {i}: negative error margin"
                )


class TestBoundedResultConstruction:
    """BoundedResult dataclass construction and validation."""

    def test_from_interval(self) -> None:
        """BoundedResult.from_interval creates correct structure."""
        mp.mp.dps = 50
        interval = iv.mpf([1.0, 2.0])
        result = BoundedResult.from_interval(interval)

        assert result.value == pytest.approx(1.5)
        assert result.lower_bound == 1.0
        assert result.upper_bound == 2.0
        assert result.ulp_error_margin == 0.5  # half-width

    def test_error_constructor(self) -> None:
        """BoundedResult.error creates error status."""
        result = BoundedResult.error("test error")
        assert result.status.startswith("ERROR:")
        assert result.value == 0.0
        assert result.ulp_error_margin == 0.0

    def test_to_dict_includes_all_fields(self) -> None:
        """to_dict() must include numeric and exact interval bounds."""
        result = BoundedResult(value=1.0, lower_bound=0.5, upper_bound=1.5,
                                ulp_error_margin=0.5, status="VERIFIED")
        d = result.to_dict()
        assert set(d.keys()) == {"value", "lower_bound", "upper_bound",
                                  "ulp_error_margin", "status",
                                  "exact_lower_bound", "exact_upper_bound"}


# Import for test above
from interval_engine import BoundedResult  # noqa: E402
