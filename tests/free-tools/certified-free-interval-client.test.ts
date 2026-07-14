import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { executeCertifiedFreeIntervalCalculation } from "@/sectorcalc/formulas/free-v531/certified-free-interval-client";

const inputs = {
  cutting_speed_m_min: "180",
  tool_diameter_mm: "10",
  number_of_teeth: "4",
  feed_per_tooth_mm: "0.08",
  max_chip_load_mm: "0.12",
} as const;

function boundedOutput(id: string, unit: string, role: string) {
  return {
    id,
    unit,
    role,
    value: 1.15,
    lower_bound: 1,
    upper_bound: 1.3,
    ulp_error_margin: 0.15,
    status: "VERIFIED",
    exact_lower_bound: "1.1",
    exact_upper_bound: "1.2",
  };
}

function validResponse() {
  return {
    tool_key: "cutting-speed-feed-rpm",
    arithmetic_mode: "MPMATH_IV_OUTWARD_EXACT_BOUNDS",
    interval_precision_digits: 50,
    status: "OK",
    outputs: [
      boundedOutput("spindle_speed_rpm", "rev/min", "PRIMARY_DECISION"),
      boundedOutput("feed_rate_mm_min", "mm/min", "SECONDARY_METRIC"),
      boundedOutput("chip_load_utilization", "ratio", "BUSINESS_IMPACT"),
    ],
    normalized_inputs: { ...inputs },
    warnings: [],
  };
}

describe("certified Free interval client", () => {
  beforeEach(() => {
    vi.stubEnv("MATH_KERNEL_PROXY_ENABLED", "true");
    vi.stubEnv("MATH_KERNEL_URL", "http://kernel.internal:8081/");
    vi.stubEnv("KERNEL_AUTH_SECRET", "test-secret");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("accepts only a fully matching exact-bound response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(validResponse()), { status: 200, headers: { "Content-Type": "application/json" } }),
    );

    const result = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error.message);
    expect(result.value.outputs[0]).toMatchObject({
      exactValue: "1.15",
      exactLowerBound: "1.1",
      exactUpperBound: "1.2",
      lowerBound: 1,
      upperBound: 1.3,
    });
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("http://kernel.internal:8081/calculate/free-interval");
    expect(new Headers(request?.headers).get("X-Internal-Secret")).toBe("test-secret");
    expect(JSON.parse(String(request?.body))).toEqual({
      tool_key: "cutting-speed-feed-rpm",
      raw_inputs: inputs,
    });
  });

  it("fails closed when interval execution is disabled or authentication is absent", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    vi.stubEnv("MATH_KERNEL_PROXY_ENABLED", "false");
    const disabled = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);
    expect(disabled).toMatchObject({ ok: false, error: { code: "KERNEL_UNAVAILABLE" } });

    vi.stubEnv("MATH_KERNEL_PROXY_ENABLED", "true");
    vi.stubEnv("KERNEL_AUTH_SECRET", "");
    const unauthenticated = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);
    expect(unauthenticated).toMatchObject({ ok: false, error: { code: "KERNEL_UNAVAILABLE" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("propagates domain rejection without a local estimate", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "angle must be below 180 degrees" }), { status: 422 }),
    );
    const result = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);
    expect(result).toMatchObject({ ok: false, error: { code: "DOMAIN_VIOLATION" } });
  });

  it("rejects inward, inverted, or drifted interval contracts", async () => {
    const payload = validResponse();
    payload.outputs[0].lower_bound = 1.11;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    const result = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);
    expect(result).toMatchObject({ ok: false, error: { code: "KERNEL_CONTRACT_VIOLATION" } });
  });

  it("aborts at the deadline and returns no fallback value", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }));

    const pending = executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", inputs);
    await vi.advanceTimersByTimeAsync(3_001);
    const result = await pending;
    expect(result).toMatchObject({ ok: false, error: { code: "KERNEL_TIMEOUT" } });
  });

  it("rejects non-finite and missing inputs before network I/O", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const nonFinite = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", {
      ...inputs,
      cutting_speed_m_min: Number.NaN,
    });
    const missing = await executeCertifiedFreeIntervalCalculation("cutting-speed-feed-rpm", {
      ...inputs,
      tool_diameter_mm: undefined,
    });
    expect(nonFinite).toMatchObject({ ok: false, error: { code: "NON_FINITE_INPUT" } });
    expect(missing).toMatchObject({ ok: false, error: { code: "MISSING_INPUT" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
