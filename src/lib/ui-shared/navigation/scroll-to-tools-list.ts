/** Smooth scroll to the catalog tools grid (`#tools-list`) after category filter changes. */
export function scrollToToolsList(): void {
  requestAnimationFrame(() => {
    document.getElementById("tools-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
