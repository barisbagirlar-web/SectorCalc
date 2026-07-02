import NextLink from "next/link";
import { usePathname as nextUsePathname, useRouter as nextUseRouter } from "next/navigation";

export const routing = {
  locales: ["en"],
  defaultLocale: "en"
};

export type AppLocale = "en";

export const Link = NextLink;
export const usePathname = nextUsePathname;
export const useRouter = nextUseRouter;

export function stripLocalePrefix(path: string): string {
  if (path.startsWith("/en/") || path === "/en") {
    return path.replace(/^\/en/, "") || "/";
  }
  return path;
}
