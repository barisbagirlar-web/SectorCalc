import type { Request, Response } from "express";
import { ALLOWED_ORIGINS } from "./constants";

export function applyCors(req: Request, res: Response): boolean {
  const origin = req.get("Origin");
  if (origin && (ALLOWED_ORIGINS as readonly string[]).includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "PATCH, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-admin-lead-secret"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true;
  }

  return false;
}
