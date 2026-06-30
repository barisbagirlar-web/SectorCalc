export type SupplierCarbonData = {
  readonly productId: string;
  readonly co2ePerUnit: number;
  readonly unit: string;
  readonly source: string;
  readonly date: Date;
};

type SupplierApiResponse = {
  carbonFootprint?: number;
  co2ePerUnit?: number;
  unit?: string;
  source?: string;
  date?: string;
};

const DEMO_SUPPLIER_CATALOG: Readonly<Record<string, SupplierCarbonData>> = {
  "steel-co-tr:HRC-001": {
    productId: "HRC-001",
    co2ePerUnit: 1.85,
    unit: "kg",
    source: "demo-supplier",
    date: new Date("2024-06-01T00:00:00.000Z"),
  },
  "steel-co-tr:COIL-002": {
    productId: "COIL-002",
    co2ePerUnit: 2.1,
    unit: "kg",
    source: "demo-supplier",
    date: new Date("2024-06-01T00:00:00.000Z"),
  },
  "alum-tr:INGOT-500": {
    productId: "INGOT-500",
    co2ePerUnit: 8.2,
    unit: "kg",
    source: "demo-supplier",
    date: new Date("2024-06-01T00:00:00.000Z"),
  },
};

function resolveSupplierApiBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SUPPLIER_CARBON_API_BASE?.trim();
  if (!configured) {
    return null;
  }
  return configured.replace(/\/$/, "");
}

function normalizeSupplierResponse(
  productCode: string,
  payload: SupplierApiResponse,
): SupplierCarbonData | null {
  const co2ePerUnit = Number(payload.co2ePerUnit ?? payload.carbonFootprint);
  if (!Number.isFinite(co2ePerUnit) || co2ePerUnit < 0) {
    return null;
  }

  const unit = typeof payload.unit === "string" && payload.unit.trim() ? payload.unit.trim() : "kg";
  const source = typeof payload.source === "string" && payload.source.trim() ? payload.source.trim() : "supplier-api";
  const date =
    typeof payload.date === "string" && payload.date.trim()
      ? new Date(payload.date)
      : new Date();

  return {
    productId: productCode,
    co2ePerUnit,
    unit,
    source,
    date: Number.isNaN(date.getTime()) ? new Date() : date,
  };
}

function lookupDemoSupplierData(
  supplierId: string,
  productCode: string,
): SupplierCarbonData | null {
  const key = `${supplierId.trim()}:${productCode.trim()}`;
  return DEMO_SUPPLIER_CATALOG[key] ?? null;
}

export async function fetchSupplierCarbonData(
  supplierId: string,
  productCode: string,
): Promise<SupplierCarbonData | null> {
  const normalizedSupplierId = supplierId.trim();
  const normalizedProductCode = productCode.trim();

  if (!normalizedSupplierId || !normalizedProductCode) {
    return null;
  }

  const apiBase = resolveSupplierApiBaseUrl();
  if (apiBase) {
    try {
      const url = new URL("/v1/carbon", apiBase);
      url.searchParams.set("supplier", normalizedSupplierId);
      url.searchParams.set("product", normalizedProductCode);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const payload = (await response.json()) as SupplierApiResponse;
        const normalized = normalizeSupplierResponse(normalizedProductCode, payload);
        if (normalized) {
          return normalized;
        }
      }
    } catch {
      // Fall through to demo catalog.
    }
  }

  return lookupDemoSupplierData(normalizedSupplierId, normalizedProductCode);
}

export async function fetchBulkSupplierCarbonData(
  items: readonly { supplierId: string; productCode: string }[],
): Promise<Record<string, SupplierCarbonData>> {
  const results: Record<string, SupplierCarbonData> = {};

  await Promise.all(
    items.map(async (item) => {
      const key = `${item.supplierId.trim()}:${item.productCode.trim()}`;
      const data = await fetchSupplierCarbonData(item.supplierId, item.productCode);
      if (data) {
        results[key] = data;
      }
    }),
  );

  return results;
}

export function listDemoSupplierCatalogKeys(): readonly string[] {
  return Object.keys(DEMO_SUPPLIER_CATALOG);
}
