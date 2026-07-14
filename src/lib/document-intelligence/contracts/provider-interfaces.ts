/**
 * Document Intelligence — Provider Abstraction Layer
 *
 * Extraction provider contract and mock implementation.
 * All providers must satisfy ExtractionProvider before being wired into the pipeline.
 */

/* ── Geometry ──────────────────────────────────────────────────── */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ── Document Metadata (returned by diagnostic scan) ───────────── */

export interface DocumentMetadata {
  pageCount: number;
  detectedLanguage: string;
  nativeTextAvailable: boolean;
  passwordProtected: boolean;
  warnings: string[];
}

/* ── Table & Cell Extraction Results ───────────────────────────── */

export interface TableRegion {
  page: number;
  tableIndex: number;
  boundingBox?: BoundingBox;
  detectedColumns: string[];
  header: string;
}

export interface ExtractedCell {
  page: number;
  tableIndex: number;
  rowIndex: number;
  columnIndex: number;
  rawValue: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface ExtractedRow {
  page: number;
  tableIndex: number;
  rowIndex: number;
  cells: Record<string, ExtractedCell>;
}

/* ── Processing Metrics ────────────────────────────────────────── */

export interface ProcessingMetrics {
  durationMs: number;
  provider: string;
  tokensUsed?: number;
}

/* ── Full Extraction Result ────────────────────────────────────── */

export interface ExtractionResult {
  metadata: DocumentMetadata;
  tables: TableRegion[];
  rows: ExtractedRow[];
  processingMetrics: ProcessingMetrics;
}

/* ── Provider Contract ─────────────────────────────────────────── */

export interface ExtractionProvider {
  /**
   * Quick diagnostic scan of a PDF document.
   * Must not perform full extraction — only metadata + eligibility signals.
   */
  diagnose(pdfBuffer: ArrayBuffer, filename: string): Promise<DocumentMetadata>;

  /**
   * Full table/cell extraction from a PDF document.
   * Optional maxPages limits the number of pages processed.
   */
  extract(
    pdfBuffer: ArrayBuffer,
    filename: string,
    options?: { maxPages?: number },
  ): Promise<ExtractionResult>;
}

/* ── Mock Provider Configuration ───────────────────────────────── */

export interface MockProviderConfig {
  /** Override the default page count returned by diagnose(). */
  diagnosticPageCount?: number;
  /** Override the default detected language. */
  diagnosticLanguage?: string;
  /** Simulate password-protected PDF. */
  passwordProtected?: boolean;
  /** Additional warnings to append. */
  extraWarnings?: string[];
  /** Number of synthetic tables to generate (diagnose returns detected column count). */
  syntheticTableCount?: number;
  /** Columns to generate in each synthetic table. */
  syntheticColumns?: string[];
  /** Rows per synthetic table. */
  syntheticRowsPerTable?: number;
  /** Simulate extraction failure. */
  simulateFailure?: boolean;
  /** Force specific processing metrics. */
  processingMetrics?: Partial<ProcessingMetrics>;
}

/* ── Symbolic constants for deterministic mock data ────────────── */

const MOCK_LANGUAGE = "en";
const MOCK_COLUMNS = [
  "item",
  "part_number",
  "description",
  "quantity",
  "unit",
  "material",
  "manufacturer",
  "manufacturer_part_number",
  "revision",
  "equipment",
  "subassembly",
];

/* ── Mock Provider Implementation ──────────────────────────────── */

/**
 * MockExtractionProvider returns fully deterministic, configurable synthetic data.
 *
 * No real PDF parsing is performed. This provider exists for:
 *  - Unit / integration tests that exercise the pipeline without real documents.
 *  - Development and staging environments that lack cloud provider credentials.
 *  - UI development where extraction latency must not block view iteration.
 *
 * The constructor accepts an optional MockProviderConfig to control fixture shape.
 * Every call with the same config + filename produces identical output.
 */
export class MockExtractionProvider implements ExtractionProvider {
  private readonly cfg: Required<MockProviderConfig>;

  constructor(config?: MockProviderConfig) {
    this.cfg = {
      diagnosticPageCount: config?.diagnosticPageCount ?? 8,
      diagnosticLanguage: config?.diagnosticLanguage ?? MOCK_LANGUAGE,
      passwordProtected: config?.passwordProtected ?? false,
      extraWarnings: config?.extraWarnings ?? [],
      syntheticTableCount: config?.syntheticTableCount ?? 2,
      syntheticColumns:
        config?.syntheticColumns?.length ? config.syntheticColumns : MOCK_COLUMNS,
      syntheticRowsPerTable: config?.syntheticRowsPerTable ?? 5,
      simulateFailure: config?.simulateFailure ?? false,
      processingMetrics: {
        durationMs: config?.processingMetrics?.durationMs ?? 1423,
        provider: config?.processingMetrics?.provider ?? "mock-extractor-v1",
        tokensUsed: config?.processingMetrics?.tokensUsed ?? 0,
      },
    };
  }

  async diagnose(
    _pdfBuffer: ArrayBuffer,
    _filename: string,
  ): Promise<DocumentMetadata> {
    if (this.cfg.simulateFailure) {
      throw new Error(
        `[MockExtractionProvider] Simulated diagnostic failure`,
      );
    }

    const warnings: string[] = [
      ...(this.cfg.passwordProtected
        ? ["Document is password protected — OCR quality degraded"]
        : []),
      ...this.cfg.extraWarnings,
    ];

    return {
      pageCount: this.cfg.diagnosticPageCount,
      detectedLanguage: this.cfg.diagnosticLanguage,
      nativeTextAvailable: !this.cfg.passwordProtected,
      passwordProtected: this.cfg.passwordProtected,
      warnings,
    };
  }

  async extract(
    _pdfBuffer: ArrayBuffer,
    filename: string,
    _options?: { maxPages?: number },
  ): Promise<ExtractionResult> {
    if (this.cfg.simulateFailure) {
      throw new Error(
        `[MockExtractionProvider] Simulated extraction failure for ${filename}`,
      );
    }

    const columns = this.cfg.syntheticColumns;
    const tableCount = this.cfg.syntheticTableCount;
    const rowsPerTable = this.cfg.syntheticRowsPerTable;

    const tables: TableRegion[] = [];
    const rows: ExtractedRow[] = [];

    let globalRowIndex = 0;

    for (let t = 0; t < tableCount; t++) {
      const tableIndex = t;
      const page = t + 1;

      tables.push({
        page,
        tableIndex,
        detectedColumns: [...columns],
        header: `Synthetic Table ${t + 1} — Mock fixture`,
      });

      for (let r = 0; r < rowsPerTable; r++) {
        const rowIndex = r;
        const cells: Record<string, ExtractedCell> = {};

        for (let c = 0; c < columns.length; c++) {
          const colKey = columns[c];
          const cell: ExtractedCell = {
            page,
            tableIndex,
            rowIndex,
            columnIndex: c,
            rawValue: this.syntheticCellValue(colKey, t, r),
            confidence: r < rowsPerTable - 1 ? 0.95 - r * 0.02 : 0.35,
            boundingBox: {
              x: 50 + c * 80,
              y: 100 + r * 20 + t * 300,
              width: 75,
              height: 18,
            },
          };
          cells[colKey] = cell;
        }

        rows.push({
          page,
          tableIndex,
          rowIndex,
          cells,
        });

        globalRowIndex++;
      }
    }

    return {
      metadata: {
        pageCount: this.cfg.diagnosticPageCount,
        detectedLanguage: this.cfg.diagnosticLanguage,
        nativeTextAvailable: !this.cfg.passwordProtected,
        passwordProtected: this.cfg.passwordProtected,
        warnings: [
          ...(this.cfg.passwordProtected
            ? ["Password protected — OCR fallback used"]
            : []),
          "Synthetic data — not from a real document",
          ...this.cfg.extraWarnings,
        ],
      },
      tables,
      rows,
      processingMetrics: {
        durationMs: this.cfg.processingMetrics.durationMs ?? 1423,
        provider: this.cfg.processingMetrics.provider ?? "mock-extractor-v1",
        tokensUsed: this.cfg.processingMetrics.tokensUsed,
      },
    };
  }

  /* ── Deterministic synthetic value generator ───────────────── */

  private syntheticCellValue(column: string, tableIndex: number, rowIndex: number): string {
    const id = `${tableIndex}-${rowIndex}`;

    switch (column) {
      case "item":
        return String(tableIndex * 100 + rowIndex + 1);
      case "part_number":
        return `MOCK-PART-${id.padStart(4, "0")}`;
      case "description":
        return `Synthetic BOM item ${id} — bearing assembly`;
      case "quantity":
        return String((rowIndex + 1) * 2);
      case "unit":
        return ["pcs", "kg", "m", "l", "set"][rowIndex % 5];
      case "material":
        return [
          "Steel 4140",
          "Stainless 304",
          "Aluminum 6061",
          "Brass C360",
          "Nylon 6/6",
        ][rowIndex % 5];
      case "manufacturer":
        return ["SKF", "NSK", "FAG", "Timken", "NTN"][rowIndex % 5];
      case "manufacturer_part_number":
        return `MFG-${id.padStart(6, "0")}`;
      case "revision":
        return ["A", "B", "C", "", "Rev. 2"][rowIndex % 5];
      case "equipment":
        return tableIndex === 0 ? "Conveyor System A" : "Pump Station B";
      case "subassembly":
        return `Sub-${String.fromCharCode(65 + tableIndex)}-${String(rowIndex + 1).padStart(2, "0")}`;
      default:
        return `mock-${column}-${id}`;
    }
  }
}
