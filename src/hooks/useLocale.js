export function useLocale() {
  if (typeof window === "undefined") return "en";
  const path = window.location.pathname;
  const match = path.match(/^\/(tr|de|fr|es|ar)(\/|$)/);
  return match ? match[1] : "en";
}
