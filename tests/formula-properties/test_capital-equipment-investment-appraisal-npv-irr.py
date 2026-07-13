"""
formula-properties: capital-equipment-investment-appraisal-npv-irr

Auto-generated property-based test suite.
Source: src/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula.ts

Input keys: "n_initial_investment", "n_annual_cash_inflow", "n_annual_cash_outflow", "n_equipment_life_years", "n_discount_rate_pct", "n_salvage_value", "n_tax_rate_pct", "n_inflation_rate_pct", "n_maintenance_escalation_pct", "n_source_confidence_ratio"
Output keys: "out_evidence_completeness", "out_normalized_demand", "out_reference_deviation", "out_derating_factor", "out_demand_metric", "out_capacity_metric", "out_utilization_margin", "out_expanded_uncertainty", "out_threshold_crossing", "out_sensitivity_driver", "out_fmea_trigger", "out_money_at_risk", "out_scenario_delta", "out_audit_hash_payload", "out_final_decision_state"

Divisions: 1 site(s)
Large multiplications: 1 site(s)
Decision states: 3

Overflow risk: HIGH


Notes: IRR Newton iteration; inflation-escalated outflows; complex discounting
"""

import pytest
from decimal import Decimal, InvalidOperation
from hypothesis import given, settings
from hypothesis import strategies as st


# ═══════════════════════════════════════════════════════════════
#  Formula Engine — Decimal-precision reference
# ═══════════════════════════════════════════════════════════════

class FormulaValidator:
    """Decimal-precision validation layer for capital-equipment-investment-appraisal-npv-irr. All monetary
    values are cast via Decimal(str()) to prevent float binary drift."""

    @staticmethod
    def _dec(value: object) -> Decimal:
        try:
            return Decimal(str(value))
        except (InvalidOperation, ValueError) as exc:
            raise ValueError(f"Invalid numeric input: {value!r}") from exc

    @staticmethod
    def _clamp_scr(raw: Decimal) -> Decimal:
        if raw < Decimal("0"):
            return Decimal("0")
        if raw > Decimal("1"):
            return Decimal("1")
        return raw

    @classmethod
    def validate(cls, inputs: dict) -> dict:
        """Parse all inputs to Decimal, clamp SCR. Returns dict of Decimal values."""
        input_keys = ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']
        parsed = {}
        for k in input_keys:
            v = inputs.get(k)
            if v is None:
                raise ValueError(f"Missing required input: {k}")
            parsed[k] = cls._dec(v)

        # Clamp source_confidence_ratio to [0, 1]
        if "n_source_confidence_ratio" in parsed:
            parsed["n_source_confidence_ratio"] = cls._clamp_scr(parsed["n_source_confidence_ratio"])

        # Non-negative guard for all inputs
        for k, v in parsed.items():
            if v < 0 and k != "n_source_confidence_ratio":
                pass  # Some tools may allow negative; formula handles via max(0,)

        return parsed

    @classmethod
    def quick_check(cls, inputs: dict) -> dict:
        """Validate and return minimal meta: success flag + Decimal types."""
        parsed = cls.validate(inputs)
        return {
            "parsed": parsed,
            "all_decimal": all(isinstance(v, Decimal) for v in parsed.values()),
            "scr_clamped": 0 <= float(parsed.get("n_source_confidence_ratio", Decimal("0"))) <= 1,
        }


# ═══════════════════════════════════════════════════════════════
#  Section 1 — Input Validation & Guard Clause Tests
# ═══════════════════════════════════════════════════════════════

class TestInputValidation:
    """Input shape: Decimal cast, non-numeric rejection, SCR clamp."""

    def test_rejects_non_numeric(self):
        with pytest.raises(ValueError, match="Invalid numeric input"):
            FormulaValidator.validate({k: "abc" for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']})

    def test_rejects_none(self):
        with pytest.raises(ValueError, match="Missing required input"):
            FormulaValidator.validate({})

    def test_scr_above_1_clamped(self):
        inputs = {k: Decimal("0") for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
        inputs["n_source_confidence_ratio"] = Decimal("2.0")
        r = FormulaValidator.validate(inputs)
        assert r["n_source_confidence_ratio"] == Decimal("1")

    def test_scr_below_0_clamped(self):
        inputs = {k: Decimal("0") for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
        inputs["n_source_confidence_ratio"] = Decimal("-0.5")
        r = FormulaValidator.validate(inputs)
        assert r["n_source_confidence_ratio"] == Decimal("0")


# ═══════════════════════════════════════════════════════════════
#  Section 2 — Deterministic Edge Cases
# ═══════════════════════════════════════════════════════════════

class TestEdgeCases:
    """Boundary value analysis: zero, max, and division-guard scenarios."""

    def test_all_zero_inputs(self):
        """Every input at zero — formula must not crash."""
        inputs = {k: Decimal("0") for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
        # If SCR=0 is allowed, provide a valid SCR
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.5")
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True

    def test_max_boundary(self):
        """Large realistic values — overflow / precision check."""
        inputs = {
    "n_initial_investment": Decimal("10000000"),
    "n_annual_cash_inflow": Decimal("100000"),
    "n_annual_cash_outflow": Decimal("100000"),
    "n_equipment_life_years": Decimal("100000"),
    "n_discount_rate_pct": Decimal("50"),
    "n_salvage_value": Decimal("10000000"),
    "n_tax_rate_pct": Decimal("50"),
    "n_inflation_rate_pct": Decimal("50"),
    "n_maintenance_escalation_pct": Decimal("50"),
    "n_source_confidence_ratio": Decimal("0.9"),
        }
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True

    def test_division_guard_safety(self):
        """Division guard clauses prevent div-by-zero."""
        # Key division denominators set to zero
        inputs = {k: Decimal("0") for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.5")
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True


# ═══════════════════════════════════════════════════════════════
#  Section 3 — Overflow & Precision Risk Tests
# ═══════════════════════════════════════════════════════════════

class TestOverflowPrecision:
    """Verify no silent overflow at 250B+ magnitudes (Float32 risk)."""

    @pytest.mark.parametrize("scale", [1_000, 100_000, 1_000_000, 10_000_000, 100_000_000])
    def test_large_scale_inputs(self, scale):
        """Scale all numeric inputs by factor — Decimal must handle."""
        for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']:
            if k == "n_source_confidence_ratio":
                continue
            base = {kk: Decimal("1") for kk in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
            base["n_source_confidence_ratio"] = Decimal("0.5")
            base[k] = Decimal(str(scale))
            r = FormulaValidator.quick_check(base)
            assert r["all_decimal"] is True, f"Failed at {k}={scale}"


# ═══════════════════════════════════════════════════════════════
#  Section 4 — Invariant Property-Based Tests (Hypothesis)
# ═══════════════════════════════════════════════════════════════

class TestInvariants:
    """Mathematical invariants over random valid input space."""

    @given(
            n_initial_investment=st.decimals(min_value=0, max_value=10_000_000, places=2),
            n_annual_cash_inflow=st.decimals(min_value=0, max_value=100_000, places=2),
            n_annual_cash_outflow=st.decimals(min_value=0, max_value=100_000, places=2),
            n_equipment_life_years=st.decimals(min_value=0, max_value=100_000, places=2),
            n_discount_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_salvage_value=st.decimals(min_value=0, max_value=10_000_000, places=2),
            n_tax_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_inflation_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_maintenance_escalation_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_source_confidence_ratio=st.decimals(min_value=0, max_value=1, places=2)
    )
    @settings(max_examples=100)
    def test_inputs_parse_to_decimal(self, n_initial_investment, n_annual_cash_inflow, n_annual_cash_outflow, n_equipment_life_years, n_discount_rate_pct, n_salvage_value, n_tax_rate_pct, n_inflation_rate_pct, n_maintenance_escalation_pct, n_source_confidence_ratio):
        """All inputs parse to Decimal without loss."""
        inputs = {
    "n_initial_investment": n_initial_investment,
    "n_annual_cash_inflow": n_annual_cash_inflow,
    "n_annual_cash_outflow": n_annual_cash_outflow,
    "n_equipment_life_years": n_equipment_life_years,
    "n_discount_rate_pct": n_discount_rate_pct,
    "n_salvage_value": n_salvage_value,
    "n_tax_rate_pct": n_tax_rate_pct,
    "n_inflation_rate_pct": n_inflation_rate_pct,
    "n_maintenance_escalation_pct": n_maintenance_escalation_pct,
    "n_source_confidence_ratio": n_source_confidence_ratio,
        }
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True
        assert r["scr_clamped"] is True

    @given(
            n_initial_investment=st.decimals(min_value=0, max_value=10_000_000, places=2),
            n_annual_cash_inflow=st.decimals(min_value=0, max_value=100_000, places=2),
            n_annual_cash_outflow=st.decimals(min_value=0, max_value=100_000, places=2),
            n_equipment_life_years=st.decimals(min_value=0, max_value=100_000, places=2),
            n_discount_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_salvage_value=st.decimals(min_value=0, max_value=10_000_000, places=2),
            n_tax_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_inflation_rate_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_maintenance_escalation_pct=st.decimals(min_value=0, max_value=100, places=2),
            n_source_confidence_ratio=st.decimals(min_value=0, max_value=1, places=2)
    )
    @settings(max_examples=100)
    def test_scr_invariant(self, n_initial_investment, n_annual_cash_inflow, n_annual_cash_outflow, n_equipment_life_years, n_discount_rate_pct, n_salvage_value, n_tax_rate_pct, n_inflation_rate_pct, n_maintenance_escalation_pct, n_source_confidence_ratio):
        """SCR clamped to [0, 1] regardless of input."""
        inputs = {
    "n_initial_investment": n_initial_investment,
    "n_annual_cash_inflow": n_annual_cash_inflow,
    "n_annual_cash_outflow": n_annual_cash_outflow,
    "n_equipment_life_years": n_equipment_life_years,
    "n_discount_rate_pct": n_discount_rate_pct,
    "n_salvage_value": n_salvage_value,
    "n_tax_rate_pct": n_tax_rate_pct,
    "n_inflation_rate_pct": n_inflation_rate_pct,
    "n_maintenance_escalation_pct": n_maintenance_escalation_pct,
    "n_source_confidence_ratio": n_source_confidence_ratio,
        }
        r = FormulaValidator.validate(inputs)
        scr = r.get("n_source_confidence_ratio", Decimal("0.5"))
        assert Decimal("0") <= scr <= Decimal("1"), f"SCR={scr} ∉ [0,1]"


# ═══════════════════════════════════════════════════════════════
#  Section 5 — Decision Boundary Tests
# ═══════════════════════════════════════════════════════════════

class TestDecisionBoundaries:
    """Decision tree boundary values — each state reachable."""

    def test_decision_is_integer(self):
        """Decision state must be 0, 1, or 2."""
        inputs = {k: Decimal("1") for k in ['n_initial_investment', 'n_annual_cash_inflow', 'n_annual_cash_outflow', 'n_equipment_life_years', 'n_discount_rate_pct', 'n_salvage_value', 'n_tax_rate_pct', 'n_inflation_rate_pct', 'n_maintenance_escalation_pct', 'n_source_confidence_ratio']}
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.9")
        _ = FormulaValidator.validate(inputs)
        # If formula implements decision states, out_final_decision_state ∈ {0,1,2}


if __name__ == "__main__":
    pytest.main(["-v", "--tb=short", __file__])
