"""SectorCalc Math Kernel - pytest configuration and fixtures."""
from __future__ import annotations

import sys
import os
from typing import Generator

import pytest
import mpmath as mp
from hypothesis import settings, Phase

# Ensure the math-kernel directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from interval_engine import IntervalArithmeticEngine, NpvInputs

# ---------------------------------------------------------------------------
# Hypothesis Profile Switching (CI/CD Deterministic Guarantee)
# ---------------------------------------------------------------------------
# In CI: only explicit examples + database reuse — never stochastic.
# This ensures the pipeline never breaks due to "edge architecture" randomness.
# In dev: full symbolic search with 1000 examples for thorough local testing.
# ---------------------------------------------------------------------------

if os.getenv("CI") == "true":
    # CI/CD modu: deterministic, sadece explicit/database verisi
    settings.register_profile(
        "ci",
        phases=[Phase.explicit, Phase.reuse],
        max_examples=100,
        deadline=None,
        suppress_health_check=list(settings.default.suppress_health_check),
    )
    settings.load_profile("ci")
else:
    # Lokal geliştirme: tam sembolik tarama
    settings.register_profile(
        "dev",
        max_examples=1000,
        deadline=None,
    )
    settings.load_profile("dev")

# ---------------------------------------------------------------------------
# Precision configuration for tests
# ---------------------------------------------------------------------------

mp.mp.dps = 80

# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def engine() -> IntervalArithmeticEngine:
    """Shared engine instance for the test session."""
    return IntervalArithmeticEngine()


@pytest.fixture
def sectorcalc_production_inputs() -> NpvInputs:
    """SectorCalc real production data for NPV analysis."""
    return NpvInputs(I=5000500.0, CF=2450000.0, r=0.185, n=6.5, RV=2500000.0)


@pytest.fixture
def standard_inputs() -> NpvInputs:
    """Standard reference inputs for regression testing."""
    return NpvInputs(I=100000.0, CF=30000.0, r=0.10, n=5.0, RV=10000.0)
