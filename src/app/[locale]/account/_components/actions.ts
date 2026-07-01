"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  redirect("/");
}
