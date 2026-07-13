"""
SectorCalc Math Kernel — FastAPI Server (Elite Edition)
========================================================

Exposes the EliteIntervalEngine and MMS suite as a REST API.

Endpoints:
  GET  /health              — Health check + cache stats
  POST /calculate/npv       — Full NPV analysis with verified bounds
  POST /calculate/batch     — Multi-scenario sensitivity analysis
  GET  /mms/suite           — Generate and return MMS test suite
  GET  /mms/run             — Run MMS tests and return results
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure the math-kernel directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Elite engine — uses TTLCache, MathDomainError, math_models.py registry
from elite_engine import (
    EliteIntervalEngine,
    MathDomainError,
)
from interval_engine import (
    BoundedResult,
    NpvInputs,
    NpvBoundedOutput,
)
from mms_generator import (
    MmsSuiteGenerator,
    export_suite_to_json,
)

# ---------------------------------------------------------------------------
# FastAPI app setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SectorCalc Math Kernel API (Elite)",
    version="1.0.0",
    description="C-XSC compatible interval arithmetic engine with TTLCache and MathDomainError.",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sectorcalc.com",
        "https://www.sectorcalc.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Elite engine with default 10k-entry / 1h cache
engine = EliteIntervalEngine(cache_maxsize=10000, cache_ttl=3600)

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class NpvRequest(BaseModel):
    I: float = Field(..., description="Initial investment", examples=[5000500.0])
    CF: float = Field(..., description="Annual net cash flow", examples=[2450000.0])
    r: float = Field(..., description="Discount rate (decimal)", examples=[0.185])
    n: float = Field(..., description="Analysis period in years", examples=[6.5])
    RV: float = Field(..., description="Residual value at end of period", examples=[2500000.0])
    max_interval_width: float = Field(default=1e-6, description="Max allowed interval width", ge=1e-12, le=1.0)


class BoundedResultSchema(BaseModel):
    """Schema contract: lower_bound and upper_bound are REQUIRED."""
    value: float = Field(..., description="Best estimate (midpoint of verified interval)")
    lower_bound: float = Field(..., description="Guaranteed lower bound of true result")
    upper_bound: float = Field(..., description="Guaranteed upper bound of true result")
    ulp_error_margin: float = Field(..., description="Half-width of interval = +/- uncertainty")
    status: str = Field(..., description="VERIFIED | WIDE_INTERVAL | ERROR: <message> | MathDomainError: <message>")


class NpvResponse(BaseModel):
    npv: BoundedResultSchema
    irr: BoundedResultSchema
    payback_years: BoundedResultSchema
    profitability_index: BoundedResultSchema
    expanded_uncertainty: BoundedResultSchema
    decision: BoundedResultSchema
    warnings: List[str] = Field(default_factory=list)


class BatchRequest(BaseModel):
    base: NpvRequest
    scenarios: List[Dict[str, float]] = Field(..., description="Array of scenario overrides")
    max_interval_width: float = Field(default=1e-6, ge=1e-12, le=1.0)


class MmsRunResult(BaseModel):
    test_name: str
    passed: bool
    inputs: Dict[str, float]
    computed_value: float
    lower_bound: float
    upper_bound: float
    exact_analytical: Optional[float]
    within_bounds: bool
    interval_width: float
    tolerance: float
    error_message: str = ""


class MmsRunResponse(BaseModel):
    total: int
    passed: int
    failed: int
    results: List[MmsRunResult]


class HealthResponse(BaseModel):
    status: str
    version: str
    precision_digits: int
    cache: Dict[str, Any] = Field(default_factory=dict)
    model_version: str = ""

# ---------------------------------------------------------------------------
# Conversion helpers
# ---------------------------------------------------------------------------

def _dict_to_schema(d: Dict[str, Any]) -> BoundedResultSchema:
    return BoundedResultSchema(
        value=d.get("value", 0.0),
        lower_bound=d.get("lower_bound", 0.0),
        upper_bound=d.get("upper_bound", 0.0),
        ulp_error_margin=d.get("ulp_error_margin", 0.0),
        status=d.get("status", "UNKNOWN"),
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint with cache statistics."""
    import mpmath as _mpmath
    from math_models import MODEL_VERSION as _MODEL_VERSION
    return HealthResponse(
        status="ok",
        version="1.0.0",
        precision_digits=_mpmath.mp.dps,
        cache=engine.cache_stats,
        model_version=_MODEL_VERSION,
    )


@app.post("/calculate/npv", response_model=NpvResponse)
async def calculate_npv(req: NpvRequest) -> NpvResponse:
    """
    Full NPV analysis with guaranteed interval bounds.

    Uses EliteIntervalEngine with TTLCache and strict error handling.
    """
    try:
        inputs = {
            "I": req.I,
            "CF": req.CF,
            "r": req.r,
            "n": req.n,
            "RV": req.RV,
        }

        # Use EliteIntervalEngine.calculate for cached, strict calculation
        npv_result = engine.calculate("npv", inputs, req.max_interval_width)

        # For IRR and other metrics, delegate to the original engine logic
        # wrapped through BoundedResult for the response
        legacy_inputs = NpvInputs(I=req.I, CF=req.CF, r=req.r, n=req.n, RV=req.RV)

        # Create legacy engine on demand for multi-metric results
        from interval_engine import IntervalArithmeticEngine
        legacy = IntervalArithmeticEngine()
        full = legacy.calculate_npv_bounded(legacy_inputs, req.max_interval_width)

        # Override NPV with cached elite result
        full.npv = BoundedResult.from_interval(
            type('iv', (), {'mid': npv_result['value'], 'a': npv_result['lower_bound'],
                           'b': npv_result['upper_bound'], 'delta': npv_result['ulp_error_margin'] * 2})(),
            req.max_interval_width
        )

        return NpvResponse(
            npv=_dict_to_schema(npv_result),
            irr=_bounded_to_schema(full.irr),
            payback_years=_bounded_to_schema(full.payback_years),
            profitability_index=_bounded_to_schema(full.profitability_index),
            expanded_uncertainty=_bounded_to_schema(full.expanded_uncertainty),
            decision=_bounded_to_schema(full.decision),
            warnings=full.warnings,
        )
    except MathDomainError as e:
        error = BoundedResultSchema(
            value=0.0, lower_bound=0.0, upper_bound=0.0,
            ulp_error_margin=0.0, status=f"MathDomainError: {e!s}",
        )
        return NpvResponse(
            npv=error, irr=error, payback_years=error,
            profitability_index=error, expanded_uncertainty=error,
            decision=error, warnings=[f"Domain error: {e!s}"],
        )
    except Exception as e:
        error = BoundedResultSchema(
            value=0.0, lower_bound=0.0, upper_bound=0.0,
            ulp_error_margin=0.0, status=f"ERROR: {e!s}",
        )
        return NpvResponse(
            npv=error, irr=error, payback_years=error,
            profitability_index=error, expanded_uncertainty=error,
            decision=error, warnings=[f"Calculation failed: {e!s}"],
        )


@app.post("/calculate/batch")
async def calculate_batch(req: BatchRequest) -> List[NpvResponse]:
    """Multi-scenario sensitivity analysis."""
    try:
        base = NpvInputs(I=req.base.I, CF=req.base.CF, r=req.base.r, n=req.base.n, RV=req.base.RV)
        from interval_engine import IntervalArithmeticEngine
        legacy = IntervalArithmeticEngine()
        results = legacy.calculate_batch(base, req.scenarios)

        return [
            NpvResponse(
                npv=_bounded_to_schema(r.npv),
                irr=_bounded_to_schema(r.irr),
                payback_years=_bounded_to_schema(r.payback_years),
                profitability_index=_bounded_to_schema(r.profitability_index),
                expanded_uncertainty=_bounded_to_schema(r.expanded_uncertainty),
                decision=_bounded_to_schema(r.decision),
                warnings=r.warnings,
            )
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/mms/suite")
async def get_mms_suite() -> Dict[str, Any]:
    """Return the MMS test suite as JSON."""
    suite = MmsSuiteGenerator.generate_suite()
    return {
        "version": "1.0.0",
        "total_cases": len(suite),
        "cases": [tc.to_dict() for tc in suite],
    }


@app.get("/mms/run", response_model=MmsRunResponse)
async def run_mms_suite() -> MmsRunResponse:
    """Execute all MMS tests and return pass/fail results."""
    import mpmath as mp
    mp.mp.dps = 50

    from interval_engine import IntervalArithmeticEngine
    legacy = IntervalArithmeticEngine()

    suite = MmsSuiteGenerator.generate_suite()
    results: List[MmsRunResult] = []
    passed_count = 0
    failed_count = 0

    for tc in suite:
        inputs = NpvInputs(
            I=tc.inputs["I"], CF=tc.inputs["CF"],
            r=tc.inputs["r"], n=tc.inputs["n"],
            RV=tc.inputs["RV"],
        )
        try:
            result = legacy.calculate_npv_bounded(inputs)
            npv = result.npv

            test_passed = False
            within_bounds = False
            err_msg = ""

            if tc.exact_analytical_result is not None:
                exact = tc.exact_analytical_result
                within_bounds = npv.lower_bound <= exact <= npv.upper_bound
                interval_width = npv.ulp_error_margin * 2
                test_passed = within_bounds and interval_width <= tc.tolerance
                if not test_passed:
                    err_msg = (
                        f"Exact={exact:.10f} not in [{npv.lower_bound:.10f}, {npv.upper_bound:.10f}] "
                        f"or width={interval_width:.2e} > tol={tc.tolerance:.0e}"
                    )
            else:
                interval_width = npv.ulp_error_margin * 2
                within_bounds = True
                test_passed = interval_width <= tc.tolerance
                if not test_passed:
                    err_msg = f"Interval width {interval_width:.2e} > tolerance {tc.tolerance:.0e}"

            mms_result = MmsRunResult(
                test_name=tc.name, passed=test_passed, inputs=tc.inputs,
                computed_value=npv.value, lower_bound=npv.lower_bound,
                upper_bound=npv.upper_bound, exact_analytical=tc.exact_analytical_result,
                within_bounds=within_bounds, interval_width=npv.ulp_error_margin * 2,
                tolerance=tc.tolerance, error_message=err_msg,
            )
            if test_passed:
                passed_count += 1
            else:
                failed_count += 1
            results.append(mms_result)

        except Exception as e:
            failed_count += 1
            results.append(MmsRunResult(
                test_name=tc.name, passed=False, inputs=tc.inputs,
                computed_value=0.0, lower_bound=0.0, upper_bound=0.0,
                exact_analytical=tc.exact_analytical_result,
                within_bounds=False, interval_width=float("inf"),
                tolerance=tc.tolerance, error_message=f"Engine exception: {e!s}",
            ))

    return MmsRunResponse(total=len(suite), passed=passed_count, failed=failed_count, results=results)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def _bounded_to_schema(b: BoundedResult) -> BoundedResultSchema:
    return BoundedResultSchema(
        value=b.value, lower_bound=b.lower_bound,
        upper_bound=b.upper_bound, ulp_error_margin=b.ulp_error_margin,
        status=b.status,
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("MATH_KERNEL_PORT", "8081"))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=False)
