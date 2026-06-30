import NextLink from "next/link";
import type { ComponentProps } from "react";

/** Platform policy: internal next/link navigation defaults prefetch off. */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
