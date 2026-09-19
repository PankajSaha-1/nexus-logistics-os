import React from "react";
import { Sparkles, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function AIInsightCard({
  insight,
  onReview,
  onApply,
  onDismiss
}) {
  const isHighRisk = insight.riskLevel === "High";
  const isApplied = insight.status === "Applied";
  const isDismissed = insight.status === "Dismissed";

  return (
    <div
      className={`bg-white rounded-lg border p-5 transition-all shadow-xs ${
        isHighRisk
          ? "border-rose-200/80 bg-linear-to-b from-rose-50/20 to-white"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider">
              {insight.shipmentId}
            </span>
            <p className="text-sm font-semibold text-slate-800">
              {insight.customer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={insight.riskLevel} size="sm" />
          {isApplied && <StatusBadge status="Applied" size="sm" />}
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5">
        <span>{insight.route}</span>
      </p>

      {/* ETA Comparison Bar */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 mb-3.5 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Scheduled ETA
          </span>
          <span className="font-semibold text-slate-700">{insight.currentETA}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            AI Predicted ETA
          </span>
          <span
            className={`font-bold ${
              insight.delayMinutes > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {insight.predictedETA}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Delay Variance
          </span>
          <span
            className={`font-semibold ${
              insight.delayMinutes > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {insight.delayMinutes > 0 ? `+${insight.delayMinutes} min` : `${insight.delayMinutes} min`}
          </span>
        </div>
      </div>

      {/* Reason text */}
      <div className="flex items-start gap-2 text-xs text-slate-600 mb-3.5 leading-relaxed">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>{insight.reason}</span>
      </div>

      {/* Suggested Action Box */}
      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100/80 mb-4">
        <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase block mb-0.5">
          Suggested Action
        </span>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {insight.suggestedAction}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 text-[11px]">
          Confidence: <strong className="text-slate-600">{insight.confidence || "92%"}</strong>
        </span>

        <div className="flex items-center gap-2">
          {onReview && (
            <button
              onClick={() => onReview(insight)}
              type="button"
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-md transition-colors"
            >
              Details
            </button>
          )}

          {!isApplied && !isDismissed && onApply && (
            <button
              onClick={() => onApply(insight.id)}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-xs transition-colors"
            >
              <span>Apply Fix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isApplied && (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs py-1">
              <CheckCircle2 className="w-4 h-4" />
              Rerouted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
