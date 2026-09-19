import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Radio,
  Truck,
  Users,
  Sparkles,
  Settings,
  X,
  Compass
} from "lucide-react";
import { useLogistics } from "../context/LogisticsContext.jsx";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Shipments", path: "/shipments", icon: Package, badgeKey: "shipments" },
  { name: "Dispatch Board", path: "/dispatch", icon: Radio, badgeKey: "dispatch" },
  { name: "Fleet", path: "/fleet", icon: Truck },
  { name: "Drivers", path: "/drivers", icon: Users },
  { name: "AI ETA Insights", path: "/ai-insights", icon: Sparkles, badgeKey: "ai" },
  { name: "Settings", path: "/settings", icon: Settings }
];

export default function Sidebar({ isOpen, onClose }) {
  const { shipments, aiInsights } = useLogistics();

  // Counts for badges
  const pendingDispatchCount = shipments.filter((s) => s.status === "Pending").length;
  const activeAICount = aiInsights.filter((i) => i.status === "Active" && i.riskLevel === "High").length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                Nexus <span className="text-blue-400 font-semibold">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Logistics Fleet Platform
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Operations
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            let badge = null;

            if (item.badgeKey === "dispatch" && pendingDispatchCount > 0) {
              badge = (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingDispatchCount} unassigned
                </span>
              );
            } else if (item.badgeKey === "ai" && activeAICount > 0) {
              badge = (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeAICount} alert
                </span>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 opacity-90" />
                  <span>{item.name}</span>
                </div>
                {badge}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              Fleet Grid Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            AI Enabled Cloud Logistics & Fleet Operations
          </p>
        </div>
      </aside>
    </>
  );
}
