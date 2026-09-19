import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Zap
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import AIInsightCard from "../components/AIInsightCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";
import { etaComparisonData } from "../data/mockData.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AIInsightsPage() {
  const { aiInsights, applyAIAction, dismissAIAction } = useLogistics();

  const [selectedInsight, setSelectedInsight] = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");

  const filteredInsights = aiInsights.filter((item) => {
    if (filterRisk === "all") return true;
    return item.riskLevel?.toLowerCase() === filterRisk.toLowerCase();
  });

  const highRiskCount = aiInsights.filter((i) => i.riskLevel === "High" && i.status === "Active").length;
  const totalPredictedDelays = aiInsights.reduce(
    (acc, cur) => acc + (cur.delayMinutes > 0 ? cur.delayMinutes : 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI ETA Prediction & Delay Insights"
        description="Machine learning-driven corridor forecasting engine predicting traffic anomalies, route bottlenecks, and dispatch interventions."
        badge={
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Engine v2.4</span>
          </span>
        }
      />

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              High Risk Corridors
            </span>
            <span className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-bold text-rose-600 mt-1 block">
            {highRiskCount} Active Alerts
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Immediate dispatch reroute recommendations
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cumulative Delay Risk
            </span>
            <span className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {totalPredictedDelays > 0 ? `+${totalPredictedDelays} Minutes` : "0 Minutes"}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Across active regional transportation corridors
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Model Accuracy Benchmark
            </span>
            <span className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {aiInsights.length > 0 ? "94.8% Confidence" : "Standby"}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Historical vs actual corridor arrival validation
          </p>
        </div>
      </div>

      {/* Chart: Scheduled vs AI Predicted ETA */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Scheduled Arrival vs. AI Neural Forecast (Hour of Day)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison illustrating predicted transit drift across key active manifests.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
              Scheduled Time
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block" />
              AI Predicted Time
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          {etaComparisonData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
              <Sparkles className="w-7 h-7 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No corridor forecast data available</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Arrival drift calculations will populate when active route telematics are streamed.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={etaComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  domain={[8, 24]}
                  unit=":00"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Math.floor(value)}:${Math.round((value % 1) * 60).toString().padStart(2, "0")}`,
                    "ETA"
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="scheduled" name="Scheduled" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aiPredicted" name="AI Predicted" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRisk("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filterRisk === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Insights ({aiInsights.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk("high")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filterRisk === "high"
                ? "bg-rose-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            High Risk
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk("medium")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filterRisk === "medium"
                ? "bg-amber-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Medium Risk
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk("low")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filterRisk === "low"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Low Risk
          </button>
        </div>
      </div>

      {/* Grid of AI Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-slate-200 p-8">
            <EmptyState
              icon={Sparkles}
              title="No AI insights available"
              description="There are currently no active predictive route or delay alerts generated."
            />
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <AIInsightCard
              key={insight.id}
              insight={insight}
              onReview={setSelectedInsight}
              onApply={applyAIAction}
              onDismiss={dismissAIAction}
            />
          ))
        )}
      </div>

      {/* Detailed Suggestion Review Modal */}
      {selectedInsight && (
        <Modal
          isOpen={Boolean(selectedInsight)}
          onClose={() => setSelectedInsight(null)}
          title={`AI Route Intervention: ${selectedInsight.shipmentId}`}
          subtitle={`${selectedInsight.customer} · Confidence: ${selectedInsight.confidenceScore || 90}%`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-bold block mb-1">Detected Anomaly:</span>
              <p>{selectedInsight.reason}</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
              <span className="font-bold block mb-1">Machine Recommendation:</span>
              <p>{selectedInsight.suggestedAction}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  dismissAIAction(selectedInsight.id);
                  setSelectedInsight(null);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  applyAIAction(selectedInsight.id);
                  setSelectedInsight(null);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs"
              >
                Apply Reroute Recommendation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
