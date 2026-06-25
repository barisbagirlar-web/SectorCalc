/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/leads");
}
