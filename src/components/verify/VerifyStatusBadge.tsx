"use client";

type Status = "verified" | "hash_mismatch" | "revoked" | "not_found" | "loading" | "idle" | "error";

type Props = {
  status: Status;
};

const CONFIG: Record<Status, { label: string; className: string }> = {
  verified: {
    label: "VERIFIED",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  hash_mismatch: {
    label: "HASH MISMATCH",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  revoked: {
    label: "REVOKED",
    className: "bg-red-100 text-red-800 border-red-300",
  },
  not_found: {
    label: "NOT FOUND",
    className: "bg-gray-100 text-gray-700 border-gray-300",
  },
  loading: {
    label: "VERIFYING…",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  idle: {
    label: "PENDING",
    className: "bg-gray-50 text-gray-500 border-gray-200",
  },
  error: {
    label: "ERROR",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function VerifyStatusBadge({ status }: Props) {
  const config = CONFIG[status] ?? CONFIG.idle;
  return (
    <span
      className={
        "inline-block rounded border px-3 py-1 text-xs font-bold tracking-wide " +
        config.className
      }
    >
      {config.label}
    </span>
  );
}