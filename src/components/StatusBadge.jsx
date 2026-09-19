import React from "react";

export default function StatusBadge({ status, size = "md" }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";

  if (["delivered", "available", "low", "applied", "completed"].includes(normalized)) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  } else if (["in transit", "on route", "active"].includes(normalized)) {
    styles = "bg-blue-50 text-blue-700 border-blue-200/80";
  } else if (["out for delivery", "medium", "express"].includes(normalized)) {
    styles = "bg-amber-50 text-amber-700 border-amber-200/80";
  } else if (["delayed", "maintenance", "high", "urgent"].includes(normalized)) {
    styles = "bg-rose-50 text-rose-700 border-rose-200/80";
  } else if (["pending", "off duty", "unassigned"].includes(normalized)) {
    styles = "bg-slate-100 text-slate-600 border-slate-200";
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs font-medium" 
    : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${sizeClasses} ${styles} tracking-wide whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
