"""
SectorCalc MMS Suite — Verification Tests

Tests that the MMS suite generator produces correct test cases
and that the interval engine satisfies all MMS constraints.
"""

from __future__ import annotations

import math
import json
import os
import tempfile
from typing import Any, Dict, List

import mpmath as mp
import pytest

from conftest import IntervalArithmeticEngine, NpvInputs  # type: ignore
from mms_generator import MmsSuiteGenerator, MmsTestCase, export_suite_to_json


class TestMmsSuiteGenerator:
    """MMS suite generator produces correct test cases."""

    def test_generates_all_cases(self) -> None:
        suite = MmsSuiteGenerator.generate_suite()
        assert len(suite) >= 8, f"Expected >= 8 test cases, got {len(suite)}"

    def test_all_categories_present(self) -> None:
        suite = MmsSuiteGenerator.generate_suite()
        categories = {tc.category for tc in suite}
        assert "core" in categories, "Missing 'core' category"
        assert "stress" in categories, "Missing 'stress' category"
        assert "edge" in categories, "Missing 'edge' category"

    def test_all_cases_have_required_fields(self) -> None:
        suite = MmsSuiteGenerator.generate_suite()
        for tc in suite:
            assert tc.name, f"Case missing name: {tc}"
            assert tc.description, f"Case missing description: {tc.name}"
            assert tc.inputs, f"Case missing inputs: {tc.name}"
            assert tc.tolerance > 0, f"Case has zero/negative tolerance: {tc.name}"

    def test_core_cases_have_analytical_results(self) -> None:
        suite = MmsSuiteGenerator.generate_suite()
        core_cases = [tc for tc in suite if tc.category == "core"]
        for tc in core_cases:
            assert tc.exact_analytical_result is not None, (
                f"Core case '{tc.name}' missing exact_analytical_result"
            )


class TestMmsExecution:
    """MMS test cases actually pass against the engine."""

    def test_all_core_mms_tests_pass(self, engine: IntervalArithmeticEngine) -> None:
        mp.mp.dps = 80
        suite = MmsSuiteGenerator.generate_suite()
        core_cases = [tc for tc in suite if tc.category == "core"]

        failures: List[str] = []
        for tc in core_cases:
            inputs = NpvInputs(
                I=tc.inputs["I"],
                CF=tc.inputs["CF"],
                r=tc.inputs["r"],
                n=tc.inputs["n"],
                RV=tc.inputs["RV"],
            )
            result = engine.calculate_npv_bounded(inputs, tc.tolerance / 10)
            npv = result.npv

            assert tc.exact_analytical_result is not None
            exact = tc.exact_analytical_result

            if not (npv.lower_bound <= exact <= npv.upper_bound):
                failures.append(
                    f"{tc.name}: exact={exact:.10f} ∉ "
                    f"[{npv.lower_bound:.10f}, {npv.upper_bound:.10f}]"
                )
            elif npv.ulp_error_margin * 2 > tc.tolerance:
                failures.append(
                    f"{tc.name}: width={npv.ulp_error_margin*2:.2e} > tol={tc.tolerance:.0e}"
                )

        assert not failures, "MMS core failures:\n" + "\n".join(failures)

    def test_stress_tests_produce_valid_intervals(
        self, engine: IntervalArithmeticEngine
    ) -> None:
        """Stress tests must at least produce self-consistent intervals."""
        mp.mp.dps = 80
        suite = MmsSuiteGenerator.generate_suite()
        stress_cases = [tc for tc in suite if tc.category == "stress"]

        for tc in stress_cases:
            inputs = NpvInputs(
                I=tc.inputs["I"],
                CF=tc.inputs["CF"],
                r=tc.inputs["r"],
                n=tc.inputs["n"],
                RV=tc.inputs["RV"],
            )
            result = engine.calculate_npv_bounded(inputs, tc.tolerance)
            npv = result.npv

            assert npv.lower_bound <= npv.value <= npv.upper_bound, (
                f"{tc.name}: midpoint outside interval"
            )
            assert npv.ulp_error_margin >= 0, (
                f"{tc.name}: negative error margin"
            )

    def test_edge_cases_produce_valid_intervals(
        self, engine: IntervalArithmeticEngine
    ) -> None:
        """Edge cases must produce valid bounded results."""
        mp.mp.dps = 80
        suite = MmsSuiteGenerator.generate_suite()
        edge_cases = [tc for tc in suite if tc.category == "edge"]

        for tc in edge_cases:
            inputs = NpvInputs(
                I=tc.inputs["I"],
                CF=tc.inputs["CF"],
                r=tc.inputs["r"],
                n=tc.inputs["n"],
                RV=tc.inputs["RV"],
            )
            result = engine.calculate_npv_bounded(inputs, tc.tolerance)
            npv = result.npv

            assert npv.lower_bound <= npv.value <= npv.upper_bound, (
                f"{tc.name}: midpoint outside interval"
            )
            assert npv.status in ("VERIFIED", "WIDE_INTERVAL"), (
                f"{tc.name}: unexpected status {npv.status}"
            )


class TestMmsExport:
    """MMS suite export to JSON."""

    def test_export_to_json(self) -> None:
        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f:
            tmp_path = f.name

        try:
            out_path = export_suite_to_json(tmp_path)
            assert os.path.exists(out_path), "Export file not created"

            with open(out_path) as f:
                data = json.load(f)

            assert "version" in data, "Missing version field"
            assert "cases" in data, "Missing cases field"
            assert data["total_cases"] == len(data["cases"]), (
                f"total_cases ({data['total_cases']}) != len(cases) ({len(data['cases'])})"
            )
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_exported_cases_retain_all_fields(self) -> None:
        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f:
            tmp_path = f.name

        try:
            out_path = export_suite_to_json(tmp_path)
            with open(out_path) as f:
                data = json.load(f)

            required_fields = {"name", "description", "inputs", "exact_analytical_result",
                               "tolerance", "analytical_formula", "category"}
            for case in data["cases"]:
                missing = required_fields - set(case.keys())
                assert not missing, f"Case '{case.get('name', '?')}' missing: {missing}"
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
