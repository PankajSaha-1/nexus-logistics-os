import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Plus
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import AIInsightCard from "../components/AIInsightCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";
import { performanceTrends } from "../data/mockData.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function DashboardPage() {
  const { shipments, aiInsights, applyAIAction } = useLogistics();
  const outletContext = useOutletContext();

  // Dynamic statistics
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === "In Transit").length;
  const outForDeliveryCount = shipments.filter((s) => s.status === "Out for Delivery").length;
  const activeDeliveries = inTransitCount + outForDeliveryCount;
  const deliveredCount = shipments.filter((s) => s.status === "Delivered").length;
  const delayedCount = shipments.filter((s) => s.status === "Delayed").length;
  const pendingCount = shipments.filter((s) => s.status === "Pending").length;

  const onTimeRate =
    totalShipments > 0
      ? Math.round(((totalShipments - delayedCount) / totalShipments) * 100)
      : "--";

  // Active high risk AI insights
  const highRiskInsights = aiInsights.filter(
    (i) => i.status === "Active" && (i.riskLevel === "High" || i.riskLevel === "Medium")
  ).slice(0, 2);

  const recentShipments = shipments.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet & Operations Dashboard"
        description="Real-time status overview of active manifests, driver corridors, and automated ETA predictions."
        actions={
          <button
            onClick={outletContext?.openAddShipment}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Shipment</span>
          </button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Shipments"
          value={totalShipments}
          change={totalShipments > 0 ? `${totalShipments} registered` : "No shipments"}
          changeType={totalShipments > 0 ? "positive" : "neutral"}
          icon={Package}
          description="Tracked across all sectors"
        />
        <StatCard
          title="Active Deliveries"
          value={activeDeliveries}
          change={activeDeliveries > 0 ? `${activeDeliveries} en route` : "None active"}
          changeType="neutral"
          icon={Truck}
          description="In transit & out for delivery"
        />
        <StatCard
          title="Delivered Total"
          value={deliveredCount}
          change={deliveredCount > 0 ? `${deliveredCount} verified` : "Awaiting drops"}
          changeType={deliveredCount > 0 ? "positive" : "neutral"}
          icon={CheckCircle}
          description="POD records confirmed"
        />
        <StatCard
          title="On-Time Delivery Rate"
          value={typeof onTimeRate === "number" ? `${onTimeRate}%` : onTimeRate}
          change={delayedCount > 0 ? `${delayedCount} active delays` : totalShipments > 0 ? "All on schedule" : "Standby"}
          changeType={delayedCount > 0 ? "negative" : "positive"}
          icon={Clock}
          description="Target benchmark: >92%"
        />
      </div>

      {/* Operations Quick Status Pipeline */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
          <span className="text-xs font-semibold text-slate-800">
            Current Freight Pipeline:
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Pending Dispatch:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
              {pendingCount}
            </span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">In Transit:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
              {activeDeliveries}
            </span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Delayed:</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs">
              {delayedCount}
            </span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Delivered:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
              {deliveredCount}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Delivery Chart & AI Delay Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Weekly Delivery Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                On-time completed deliveries vs traffic delay occurrences
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                On-Time
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block" />
                Delayed
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {performanceTrends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 border border-dashed border-slate-200 rounded-lg">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No performance trends recorded</p>
                <p className="text-slate-400 text-[11px] mt-1 max-w-xs">
                  Weekly delivery velocity will graph here automatically as completed shipment records are processed.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="onTime" name="On Time" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayed" name="Delayed" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Delay Alerts Sidebar */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">
                  AI Delay Alerts
                </h2>
              </div>
              <Link
                to="/ai-insights"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Real-time machine learning prediction based on corridor congestion and driver pacing.
            </p>

            <div className="space-y-3">
              {highRiskInsights.length === 0 ? (
                <div className="p-6 rounded-lg bg-slate-50 text-center text-xs text-slate-500 border border-slate-100">
                  <p className="font-semibold text-slate-700">No AI insights available</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No active delay risks detected on current routes.
                  </p>
                </div>
              ) : (
                highRiskInsights.map((insight) => (
                  <AIInsightCard
                    key={insight.id}
                    insight={insight}
                    onApply={applyAIAction}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Shipments Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Recent Manifests & Active Shipments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live records managed by current fleet operations desk
            </p>
          </div>

          <Link
            to="/shipments"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>All shipments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Package}
              title="No shipments available"
              description="There are currently no shipments registered in the system."
              action={
                <button
                  onClick={outletContext?.openAddShipment}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Shipment</span>
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Shipment ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Origin / Destination</th>
                  <th className="px-5 py-3">Driver & Vehicle</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">ETA</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentShipments.map((shp) => (
                  <tr key={shp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-blue-600 whitespace-nowrap">
                      <Link to={`/shipments/${shp.id}`} className="hover:underline">
                        {shp.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {shp.customer}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate text-slate-500">
                      <span className="text-slate-800">{shp.pickupLocation?.split(",")[0] || "Origin"}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="text-slate-800">{shp.deliveryLocation?.split(",")[0] || "Destination"}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{shp.assignedDriverName}</span>
                      <span className="text-slate-400 text-[11px] block">{shp.vehiclePlate}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={shp.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-600">
                      {shp.eta}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Link
                        to={`/shipments/${shp.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
