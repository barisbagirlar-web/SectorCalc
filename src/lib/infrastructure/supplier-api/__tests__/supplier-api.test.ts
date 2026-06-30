import { describe, expect, it } from "vitest";
import {
  fetchBulkSupplierCarbonData,
  fetchSupplierCarbonData,
  listDemoSupplierCatalogKeys,
} from "@/lib/infrastructure/supplier-api";

describe("supplier api", () => {
  it("returns demo catalog data when no live API is configured", async () => {
    const data = await fetchSupplierCarbonData("steel-co-tr", "HRC-001");

    expect(data).not.toBeNull();
    expect(data?.co2ePerUnit).toBe(1.85);
    expect(data?.unit).toBe("kg");
  });

  it("returns null for unknown supplier product pairs", async () => {
    const data = await fetchSupplierCarbonData("unknown-supplier", "NO-SUCH-PRODUCT");
    expect(data).toBeNull();
  });

  it("fetches bulk demo items", async () => {
    const results = await fetchBulkSupplierCarbonData([
      { supplierId: "steel-co-tr", productCode: "HRC-001" },
      { supplierId: "alum-tr", productCode: "INGOT-500" },
      { supplierId: "missing", productCode: "X" },
    ]);

    expect(Object.keys(results)).toHaveLength(2);
    expect(results["steel-co-tr:HRC-001"]?.co2ePerUnit).toBe(1.85);
    expect(results["alum-tr:INGOT-500"]?.co2ePerUnit).toBe(8.2);
  });

  it("lists demo catalog keys", () => {
    expect(listDemoSupplierCatalogKeys().length).toBeGreaterThan(0);
  });
});
