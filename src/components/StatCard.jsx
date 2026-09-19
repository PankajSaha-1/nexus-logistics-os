import React from "react";

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral", // "positive" | "negative" | "neutral"
  icon: Icon,
  description
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`font-semibold ${
                changeType === "positive"
                  ? "text-emerald-600"
                  : changeType === "negative"
                  ? "text-rose-600"
                  : "text-slate-600"
              }`}
            >
              {change}
            </span>
          )}
          {description && (
            <span className="text-slate-500 truncate ml-auto">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
