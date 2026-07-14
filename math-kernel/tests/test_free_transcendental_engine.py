"""Property and API tests for certified Free transcendental interval models."""

from __future__ import annotations

import os
from decimal import Decimal, getcontext

import pytest
from fastapi.testclient import TestClient
from hypothesis import given, strategies as st

os.environ.setdefault("KERNEL_AUTH_SECRET", "test-kernel-secret")

from api import app
from free_transcendental_engine import (
    FreeIntervalDomainError,
    execute_free_interval_model,
    list_free_interval_models,
)

getcontext().prec = 100


VALID = {
    "cutting-speed-feed-rpm": {
        "cutting_speed_m_min": "180", "tool_diameter_mm": "10", "number_of_teeth": "4",
        "feed_per_tooth_mm": "0.08", "max_chip_load_mm": "0.12",
    },
    "fillet-weld-size-strength": {
        "fillet_leg_size_mm": "6", "effective_weld_length_mm": "120",
        "user_verified_allowable_stress_mpa": "100", "applied_load_kn": "35", "load_angle_factor": "1.2",
    },
    "knurling-drill-point-depth": {
        "drill_diameter_mm": "12", "drill_point_angle_deg": "118",
        "knurl_pitch_mm": "1", "workpiece_diameter_mm": "30",
    },
    "sheet-metal-bend-allowance": {
        "bend_angle_deg": "90", "inside_radius_mm": "2", "material_thickness_mm": "1.5",
        "k_factor": "0.33", "flange_a_mm": "30", "flange_b_mm": "40",
    },
    "tool-life-tool-cost-per-part": {
        "taylor_c": "300", "taylor_n": "0.25", "cutting_speed_m_min": "150",
        "edge_cost": "20", "cutting_time_seconds_per_part": "60",
        "tool_change_minutes": "5", "machine_hourly_rate": "90",
    },
}


def output(result: dict, output_id: str) -> dict:
    return next(item for item in result["outputs"] if item["id"] == output_id)


def assert_bounded(metric: dict) -> None:
    assert metric["lower_bound"] <= metric["value"] <= metric["upper_bound"]
    assert Decimal(metric["exact_lower_bound"]) <= Decimal(metric["exact_upper_bound"])
    assert metric["ulp_error_margin"] >= 0
    assert metric["status"] in {"VERIFIED", "WIDE_INTERVAL"}


class TestFreeIntervalRegistry:
    def test_registry_is_complete_and_deterministic(self) -> None:
        assert list_free_interval_models() == tuple(sorted(VALID))
        for tool_key, inputs in VALID.items():
            first = execute_free_interval_model(tool_key, inputs)
            second = execute_free_interval_model(tool_key, inputs)
            assert first == second
            assert first["interval_precision_digits"] >= 50
            for metric in first["outputs"]:
                assert_bounded(metric)

    def test_rejects_float_and_domain_singularities(self) -> None:
        with pytest.raises(FreeIntervalDomainError):
            execute_free_interval_model("cutting-speed-feed-rpm", {**VALID["cutting-speed-feed-rpm"], "cutting_speed_m_min": 180.0})
        with pytest.raises(FreeIntervalDomainError):
            execute_free_interval_model("sheet-metal-bend-allowance", {**VALID["sheet-metal-bend-allowance"], "bend_angle_deg": "180"})
        with pytest.raises(FreeIntervalDomainError):
            execute_free_interval_model("tool-life-tool-cost-per-part", {**VALID["tool-life-tool-cost-per-part"], "taylor_n": "0"})


@given(st.integers(min_value=1, max_value=10_000))
def test_cutting_speed_rpm_is_linear_in_speed(factor: int) -> None:
    base = VALID["cutting-speed-feed-rpm"]
    scaled = {**base, "cutting_speed_m_min": str(Decimal(base["cutting_speed_m_min"]) * factor)}
    base_rpm = output(execute_free_interval_model("cutting-speed-feed-rpm", base), "spindle_speed_rpm")
    scaled_rpm = output(execute_free_interval_model("cutting-speed-feed-rpm", scaled), "spindle_speed_rpm")
    expected_low = Decimal(base_rpm["exact_lower_bound"]) * factor
    expected_high = Decimal(base_rpm["exact_upper_bound"]) * factor
    assert Decimal(scaled_rpm["exact_lower_bound"]) <= expected_high
    assert Decimal(scaled_rpm["exact_upper_bound"]) >= expected_low


@given(st.integers(min_value=1, max_value=1_000))
def test_fillet_capacity_and_sheet_geometry_scale_linearly(factor: int) -> None:
    fillet = VALID["fillet-weld-size-strength"]
    scaled_fillet = {**fillet, "effective_weld_length_mm": str(Decimal(fillet["effective_weld_length_mm"]) * factor)}
    base_capacity = output(execute_free_interval_model("fillet-weld-size-strength", fillet), "screening_capacity_kn")
    scaled_capacity = output(execute_free_interval_model("fillet-weld-size-strength", scaled_fillet), "screening_capacity_kn")
    assert Decimal(scaled_capacity["exact_lower_bound"]) <= Decimal(base_capacity["exact_upper_bound"]) * factor
    assert Decimal(scaled_capacity["exact_upper_bound"]) >= Decimal(base_capacity["exact_lower_bound"]) * factor

    sheet = VALID["sheet-metal-bend-allowance"]
    scaled_sheet = {
        **sheet,
        **{key: str(Decimal(sheet[key]) * factor) for key in (
            "inside_radius_mm", "material_thickness_mm", "flange_a_mm", "flange_b_mm"
        )},
    }
    base_flat = output(execute_free_interval_model("sheet-metal-bend-allowance", sheet), "flat_blank_length_mm")
    scaled_flat = output(execute_free_interval_model("sheet-metal-bend-allowance", scaled_sheet), "flat_blank_length_mm")
    assert Decimal(scaled_flat["exact_lower_bound"]) <= Decimal(base_flat["exact_upper_bound"]) * factor
    assert Decimal(scaled_flat["exact_upper_bound"]) >= Decimal(base_flat["exact_lower_bound"]) * factor


class TestFreeIntervalApi:
    def test_endpoint_requires_auth_and_returns_exact_bounds(self) -> None:
        with TestClient(app) as client:
            unauthorized = client.post("/calculate/free-interval", json={"tool_key": "cutting-speed-feed-rpm", "raw_inputs": VALID["cutting-speed-feed-rpm"]})
            assert unauthorized.status_code == 401
            response = client.post(
                "/calculate/free-interval",
                headers={"X-Internal-Secret": "test-kernel-secret"},
                json={"tool_key": "cutting-speed-feed-rpm", "raw_inputs": VALID["cutting-speed-feed-rpm"]},
            )
            assert response.status_code == 200
            for metric in response.json()["outputs"]:
                assert "exact_lower_bound" in metric and "exact_upper_bound" in metric

    def test_endpoint_returns_422_without_fallback(self) -> None:
        with TestClient(app, headers={"X-Internal-Secret": "test-kernel-secret"}) as client:
            response = client.post(
                "/calculate/free-interval",
                json={"tool_key": "sheet-metal-bend-allowance", "raw_inputs": {**VALID["sheet-metal-bend-allowance"], "bend_angle_deg": "180"}},
            )
            assert response.status_code == 422
            assert "Interval domain error" in response.json()["detail"]
