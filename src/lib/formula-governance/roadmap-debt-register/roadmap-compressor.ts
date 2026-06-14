export type RoadmapBatchSummary = {
  readonly batchId: string;
  readonly id: string;
  readonly title: string;
  readonly itemCount: number;
};

export function compressRoadmapToNext3Batches(
  _input?: readonly unknown[],
): readonly RoadmapBatchSummary[] {
  return [];
}
