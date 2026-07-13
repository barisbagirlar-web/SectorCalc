"""
SectorCalc Math Kernel — FastAPI Integration Tests

Tests every REST endpoint:
  - /health
  - /calculate/npv
  - /calculate/batch
  - /mms/suite
  - /mms/run

Verifies contract: every response includes lower_bound and upper_bound.
"""

from __future__ import annotations

import sys
import os
from typing import Any, Dict, Generator

import pytest
from fastapi.testclient import TestClient

# Ensure the math-kernel directory is on the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from api import app


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


class TestHealthEndpoint:
    """Health check endpoint."""

    def test_health_returns_ok(self, client: TestClient) -> None:
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.0"
        assert data["precision_digits"] >= 50


class TestNpvEndpoint:
    """NPV calculation endpoint."""

    NPV_PAYLOAD = {
        "I": 5000500.0,
        "CF": 2450000.0,
        "r": 0.185,
        "n": 6.5,
        "RV": 2500000.0,
    }

    def test_npv_returns_200(self, client: TestClient) -> None:
        resp = client.post("/calculate/npv", json=self.NPV_PAYLOAD)
        assert resp.status_code == 200

    def test_npv_contract_lower_upper_bound_present(self, client: TestClient) -> None:
        """Contract verification: lower_bound and upper_bound are REQUIRED in every metric."""
        resp = client.post("/calculate/npv", json=self.NPV_PAYLOAD)
        data = resp.json()

        required_metrics = ["npv", "irr", "payback_years", "profitability_index",
                            "expanded_uncertainty", "decision"]

        for metric_name in required_metrics:
            metric = data[metric_name]
            assert "lower_bound" in metric, f"{metric_name} missing lower_bound"
            assert "upper_bound" in metric, f"{metric_name} missing upper_bound"
            assert "value" in metric, f"{metric_name} missing value"
            assert "ulp_error_margin" in metric, f"{metric_name} missing ulp_error_margin"
            assert "status" in metric, f"{metric_name} missing status"

            # Contract: value must be within [lower_bound, upper_bound]
            assert metric["lower_bound"] <= metric["value"] <= metric["upper_bound"], (
                f"{metric_name}: value {metric['value']} not in "
                f"[{metric['lower_bound']}, {metric['upper_bound']}]"
            )

    def test_npv_error_margin_non_negative(self, client: TestClient) -> None:
        resp = client.post("/calculate/npv", json=self.NPV_PAYLOAD)
        data = resp.json()

        for metric_name in ["npv", "irr", "payback_years", "profitability_index"]:
            assert data[metric_name]["ulp_error_margin"] >= 0, (
                f"{metric_name} has negative error margin"
            )

    def test_npv_invalid_input_returns_error_status(self, client: TestClient) -> None:
        """Invalid inputs should not crash — they return ERROR status."""
        bad_payload = {"I": -1, "CF": 0, "r": 0, "n": 0, "RV": 0}
        resp = client.post("/calculate/npv", json=bad_payload)
        assert resp.status_code == 200  # Graceful error, not 500

    def test_npv_missing_field_returns_422(self, client: TestClient) -> None:
        """Missing required field should return 422 validation error."""
        resp = client.post("/calculate/npv", json={"I": 1000})
        assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"


class TestBatchEndpoint:
    """Batch calculation endpoint."""

    BATCH_PAYLOAD = {
        "base": {
            "I": 100000.0,
            "CF": 30000.0,
            "r": 0.10,
            "n": 5.0,
            "RV": 10000.0,
        },
        "scenarios": [
            {"r": 0.15},
            {"CF": 15000.0},
        ],
    }

    def test_batch_returns_200(self, client: TestClient) -> None:
        resp = client.post("/calculate/batch", json=self.BATCH_PAYLOAD)
        assert resp.status_code == 200

    def test_batch_returns_correct_count(self, client: TestClient) -> None:
        resp = client.post("/calculate/batch", json=self.BATCH_PAYLOAD)
        data = resp.json()
        assert len(data) == 2, f"Expected 2 results, got {len(data)}"

    def test_batch_each_result_has_lower_upper_bound(self, client: TestClient) -> None:
        resp = client.post("/calculate/batch", json=self.BATCH_PAYLOAD)
        data = resp.json()
        for i, result in enumerate(data):
            assert "lower_bound" in result["npv"], f"Result {i} npv missing lower_bound"
            assert "upper_bound" in result["npv"], f"Result {i} npv missing upper_bound"


class TestMmsEndpoints:
    """MMS suite and execution endpoints."""

    def test_mms_suite_returns_200(self, client: TestClient) -> None:
        resp = client.get("/mms/suite")
        assert resp.status_code == 200

    def test_mms_suite_has_cases(self, client: TestClient) -> None:
        resp = client.get("/mms/suite")
        data = resp.json()
        assert data["total_cases"] >= 8
        assert len(data["cases"]) == data["total_cases"]

    def test_mms_run_returns_200(self, client: TestClient) -> None:
        resp = client.get("/mms/run")
        assert resp.status_code == 200

    def test_mms_run_all_core_tests_pass(self, client: TestClient) -> None:
        """Core analytical MMS tests must pass 100%."""
        resp = client.get("/mms/run")
        data = resp.json()

        core_results = [r for r in data["results"]
                        if "zero_" in r["test_name"] or "single_" in r["test_name"]]
        for r in core_results:
            assert r["passed"], f"Core MMS test '{r['test_name']}' failed: {r['error_message']}"

    def test_mms_run_contract_all_results_have_bounds(self, client: TestClient) -> None:
        resp = client.get("/mms/run")
        data = resp.json()
        for r in data["results"]:
            assert "lower_bound" in r, f"{r['test_name']} missing lower_bound"
            assert "upper_bound" in r, f"{r['test_name']} missing upper_bound"
            assert r["lower_bound"] <= r["computed_value"] <= r["upper_bound"], (
                f"{r['test_name']}: value outside bounds"
            )
