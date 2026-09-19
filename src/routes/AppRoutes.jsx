import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ShipmentsPage from "../pages/ShipmentsPage.jsx";
import ShipmentDetailsPage from "../pages/ShipmentDetailsPage.jsx";
import DispatchBoardPage from "../pages/DispatchBoardPage.jsx";
import FleetPage from "../pages/FleetPage.jsx";
import DriversPage from "../pages/DriversPage.jsx";
import AIInsightsPage from "../pages/AIInsightsPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Demo */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main Operations Dashboard Layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="shipments/:id" element={<ShipmentDetailsPage />} />
        <Route path="dispatch" element={<DispatchBoardPage />} />
        <Route path="fleet" element={<FleetPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="ai-insights" element={<AIInsightsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
