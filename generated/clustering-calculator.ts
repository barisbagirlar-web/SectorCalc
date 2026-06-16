// Auto-generated from clustering-calculator-schema.json
import * as z from 'zod';

export interface Clustering_calculatorInput {
  numPoints: number;
  numClusters: number;
  dimensions: number;
  maxIterations: number;
  tolerance: number;
  seed: number;
}

export const Clustering_calculatorInputSchema = z.object({
  numPoints: z.number().default(100),
  numClusters: z.number().default(3),
  dimensions: z.number().default(2),
  maxIterations: z.number().default(100),
  tolerance: z.number().default(0.0001),
  seed: z.number().default(42),
});

function evaluateAllFormulas(input: Clustering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let points = []; for(let i=0; i<input.numPoints; i++){ let p = []; for(let d=0; d<input.dimensions; d++){ p.push(Math.random()); } points.push(p); } let centroids = []; for(let k=0; k<input.numClusters; k++){ centroids.push(points[Math.floor(Math.random()*points.length)]); } let assignments = new Array(input.numPoints).fill(0); let inertia = 0; for(let iter=0; iter<input.maxIterations; iter++){ for(let i=0; i<input.numPoints; i++){ let minDist = Infinity; let bestCluster = 0; for(let k=0; k<input.numClusters; k++){ let dist = 0; for(let d=0; d<input.dimensions; d++){ dist += (points[i][d] - centroids[k][d])**2; } dist = Math.sqrt(dist); if(dist < minDist){ minDist = dist; bestCluster = k; } } assignments[i] = bestCluster; } let newCentroids = Array.from({length: input.numClusters}, () => new Array(input.dimensions).fill(0)); let counts = new Array(input.numClusters).fill(0); for(let i=0; i<input.numPoints; i++){ let cluster = assignments[i]; counts[cluster]++; for(let d=0; d<input.dimensions; d++){ newCentroids[cluster][d] += points[i][d]; } } for(let k=0; k<input.numClusters; k++){ if(counts[k] > 0){ for(let d=0; d<input.dimensions; d++){ newCentroids[k][d] /= counts[k]; } } } let maxShift = 0; for(let k=0; k<input.numClusters; k++){ let shift = 0; for(let d=0; d<input.dimensions; d++){ shift += (newCentroids[k][d] - centroids[k][d])**2; } shift = Math.sqrt(shift); if(shift > maxShift) maxShift = shift; } centroids = newCentroids; if(maxShift < input.tolerance) break; } inertia = 0; for(let i=0; i<input.numPoints; i++){ let cluster = assignments[i]; let dist = 0; for(let d=0; d<input.dimensions; d++){ dist += (points[i][d] - centroids[cluster][d])**2; } inertia += dist; return } inertia; })(); results["inertia"] = Number.isFinite(v) ? v : 0; } catch { results["inertia"] = 0; }
  try { const v = (() => { let points = []; for(let i=0; i<input.numPoints; i++){ let p = []; for(let d=0; d<input.dimensions; d++){ p.push(Math.random()); } points.push(p); } let centroids = []; for(let k=0; k<input.numClusters; k++){ centroids.push(points[Math.floor(Math.random()*points.length)]); } let assignments = new Array(input.numPoints).fill(0); for(let iter=0; iter<input.maxIterations; iter++){ for(let i=0; i<input.numPoints; i++){ let minDist = Infinity; let bestCluster = 0; for(let k=0; k<input.numClusters; k++){ let dist = 0; for(let d=0; d<input.dimensions; d++){ dist += (points[i][d] - centroids[k][d])**2; } dist = Math.sqrt(dist); if(dist < minDist){ minDist = dist; bestCluster = k; } } assignments[i] = bestCluster; } let newCentroids = Array.from({length: input.numClusters}, () => new Array(input.dimensions).fill(0)); let counts = new Array(input.numClusters).fill(0); for(let i=0; i<input.numPoints; i++){ let cluster = assignments[i]; counts[cluster]++; for(let d=0; d<input.dimensions; d++){ newCentroids[cluster][d] += points[i][d]; } } for(let k=0; k<input.numClusters; k++){ if(counts[k] > 0){ for(let d=0; d<input.dimensions; d++){ newCentroids[k][d] /= counts[k]; } } } let maxShift = 0; for(let k=0; k<input.numClusters; k++){ let shift = 0; for(let d=0; d<input.dimensions; d++){ shift += (newCentroids[k][d] - centroids[k][d])**2; } shift = Math.sqrt(shift); if(shift > maxShift) maxShift = shift; } centroids = newCentroids; if(maxShift < input.tolerance) break; } let silhouette = 0; for(let i=0; i<input.numPoints; i++){ let cluster = assignments[i]; let a = 0; let countA = 0; for(let j=0; j<input.numPoints; j++){ if(assignments[j] === cluster && i !== j){ let dist = 0; for(let d=0; d<input.dimensions; d++){ dist += (points[i][d] - points[j][d])**2; } a += Math.sqrt(dist); countA++; } } a = countA > 0 ? a / countA : 0; let b = Infinity; for(let k=0; k<input.numClusters; k++){ if(k !== cluster){ let sum = 0; let count = 0; for(let j=0; j<input.numPoints; j++){ if(assignments[j] === k){ let dist = 0; for(let d=0; d<input.dimensions; d++){ dist += (points[i][d] - points[j][d])**2; } sum += Math.sqrt(dist); count++; } } let avg = count > 0 ? sum / count : 0; if(avg < b) b = avg; } } let s = (b - a) / Math.max(a, b); silhouette += s; return } silhouette / input.numPoints; })(); results["silhouetteScore"] = Number.isFinite(v) ? v : 0; } catch { results["silhouetteScore"] = 0; }
  return results;
}


export function calculateClustering_calculator(input: Clustering_calculatorInput): Clustering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["inertia"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Clustering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
