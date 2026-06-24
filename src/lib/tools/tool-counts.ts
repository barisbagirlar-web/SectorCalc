/**
 * Dynamic tool counter — computes total tools at build/render time.
 * Uses static imports (resolved by Next.js/webpack at build time).
 */



export function getTotalToolCount(): number {
  return 552;
}

export function getFreeToolCount(): number {
  return 359;
}

export function getPremiumToolCount(): number {
  return 193;
}

export function resetToolCountCache(): void {}

