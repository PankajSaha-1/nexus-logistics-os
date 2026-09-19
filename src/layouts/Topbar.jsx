import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  User,
  LogOut,
  RotateCcw,
  Settings as SettingsIcon,
  Plus,
  Sparkles,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { useLogistics } from "../context/LogisticsContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick, onOpenAddShipment }) {
  const { currentUser, logout, resetToDemoData, aiInsights } = useLogistics();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeAlerts = aiInsights.filter((i) => i.status === "Active");

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          type="button"
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-800">Operations Hub</span>
          <span>/</span>
          <span>Kolkata Central Hub (Eastern Regional Fleet)</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Add Shipment Button */}
        {onOpenAddShipment && (
          <button
            onClick={onOpenAddShipment}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Shipment</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeAlerts.length} active alerts
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activeAlerts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-500">
                    No active delay alerts. All routes nominal.
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/ai-insights");
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{alert.shipmentId}</span>
                        <span className="text-slate-400 font-normal">·</span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {alert.riskLevel} Delay Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                        {alert.reason}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 text-center">
                <Link
                  to="/ai-insights"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all AI insights →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            type="button"
            className="flex items-center gap-2 p-1.5 text-left rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
              {currentUser?.name
                ? currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "PS"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {currentUser?.name || "Pankaj Saha"}
              </span>
              <span className="text-[10px] text-slate-500 block leading-none">
                {currentUser?.role || "Fleet Operations"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">
                  {currentUser?.name || "Pankaj Saha"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || "pankaj.saha@nexuslogistics.in"}
                </p>
              </div>

              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  resetToDemoData();
                }}
                type="button"
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear Local Data</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate("/login");
                }}
                type="button"
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
