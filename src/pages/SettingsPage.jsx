import React, { useState } from "react";
import {
  User,
  Bell,
  Palette,
  RotateCcw,
  CheckCircle2,
  Shield,
  Save,
  Trash2
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function SettingsPage() {
  const { currentUser, clearAllData, showToast } = useLogistics();

  const [profileName, setProfileName] = useState(currentUser?.name || "Pankaj Saha");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "pankaj.saha@nexuslogistics.in");
  const [hubLocation, setHubLocation] = useState("Kolkata Central Hub A (Eastern Regional Sector)");

  const [notifDelay, setNotifDelay] = useState(true);
  const [notifDispatch, setNotifDispatch] = useState(true);
  const [notifPod, setNotifPod] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast("Profile settings saved successfully");
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all locally cached operational records?")) {
      clearAllData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="System & Operations Settings"
        description="Configure dispatch workstation parameters, notifications, and local data storage."
      />

      {/* Operator Profile Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Operations Operator Profile
            </h3>
            <p className="text-xs text-slate-500">
              Personal credentials for the current terminal session
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Regional Hub Assignment
            </label>
            <input
              type="text"
              value={hubLocation}
              onChange={(e) => setHubLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Telemetry & Delay Notification Triggers
            </h3>
            <p className="text-xs text-slate-500">
              Manage automatic alerts for route drift and staging events
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                AI Traffic Bottleneck & Delay Forecasts
              </span>
              <span className="text-[11px] text-slate-500">
                Receive proactive alerts when corridor delay exceeds 15 minutes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifDelay}
              onChange={(e) => {
                setNotifDelay(e.target.checked);
                showToast("Notification preferences updated");
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Unassigned Manifest Reminders
              </span>
              <span className="text-[11px] text-slate-500">
                Notify when booked orders remain in queue for over 30 minutes without carrier.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifDispatch}
              onChange={(e) => {
                setNotifDispatch(e.target.checked);
                showToast("Notification preferences updated");
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Proof-of-Delivery Instant Audio Ping
              </span>
              <span className="text-[11px] text-slate-500">
                Play alert chime upon recipient signature capture.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifPod}
              onChange={(e) => {
                setNotifPod(e.target.checked);
                showToast("Notification preferences updated");
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Appearance & Theme Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Optimized for daylight readability and operational desktop monitors
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-white border border-slate-300 shadow-2xs flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Enterprise Clean Light Theme (Active)
              </span>
              <span className="text-[11px] text-slate-500">
                White and soft slate palette with navy text and primary blue accents.
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-100 text-blue-700">
            Default Standard
          </span>
        </div>
      </div>

      {/* Local Storage Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Clear Local Data Store
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear locally cached operational state, shipments, driver allocations, and staging data from browser storage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearData}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Store</span>
          </button>
        </div>
      </div>
    </div>
  );
}
