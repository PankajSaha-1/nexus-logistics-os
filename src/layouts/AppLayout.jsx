import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import ToastContainer from "../components/ToastContainer.jsx";
import AddShipmentModal from "../components/AddShipmentModal.jsx";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddShipmentOpen, setIsAddShipmentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content wrapper */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Topbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onOpenAddShipment={() => setIsAddShipmentOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openAddShipment: () => setIsAddShipmentOpen(true) }} />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <AddShipmentModal
        isOpen={isAddShipmentOpen}
        onClose={() => setIsAddShipmentOpen(false)}
      />
      <ToastContainer />
    </div>
  );
}
