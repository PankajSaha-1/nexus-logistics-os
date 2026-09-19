import React, { useState, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Package,
  Plus,
  ArrowRight,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import FilterDropdown from "../components/FilterDropdown.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "In Transit", value: "In Transit" },
  { label: "Out for Delivery", value: "Out for Delivery" },
  { label: "Pending", value: "Pending" },
  { label: "Delivered", value: "Delivered" },
  { label: "Delayed", value: "Delayed" }
];

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "Urgent", value: "Urgent" },
  { label: "Express", value: "Express" },
  { label: "Standard", value: "Standard" }
];

export default function ShipmentsPage() {
  const { shipments, showToast } = useLogistics();
  const outletContext = useOutletContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredShipments = useMemo(() => {
    return shipments.filter((shp) => {
      const matchesStatus =
        selectedStatus === "all" ? true : shp.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" ? true : shp.priority === selectedPriority;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        shp.id.toLowerCase().includes(term) ||
        shp.trackingNumber.toLowerCase().includes(term) ||
        shp.customer.toLowerCase().includes(term) ||
        shp.pickupLocation.toLowerCase().includes(term) ||
        shp.deliveryLocation.toLowerCase().includes(term) ||
        shp.assignedDriverName.toLowerCase().includes(term);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [shipments, searchTerm, selectedStatus, selectedPriority]);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage]);

  const totalCount = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === "In Transit").length;
  const pendingCount = shipments.filter((s) => s.status === "Pending").length;
  const deliveredCount = shipments.filter((s) => s.status === "Delivered").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipment Operations & Freight Registry"
        description="Comprehensive management of commercial freight manifests, tracking numbers, and live delivery updates."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast("Export manifest functionality will be activated with backend report generator.")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export Manifest</span>
            </button>
            <button
              type="button"
              onClick={outletContext?.openAddShipment}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Shipment</span>
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Manifests
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {totalCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
            In Transit
          </span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">
            {inTransitCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
            Pending Dispatch
          </span>
          <span className="text-xl font-bold text-amber-700 mt-1 block">
            {pendingCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Delivered Loads
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {deliveredCount}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by ID, tracking number, customer, city..."
          className="w-full sm:w-80"
        />

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <FilterDropdown
            label="Status"
            value={selectedStatus}
            onChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            options={statusOptions}
          />
          <FilterDropdown
            label="Priority"
            value={selectedPriority}
            onChange={(val) => {
              setSelectedPriority(val);
              setCurrentPage(1);
            }}
            options={priorityOptions}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
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
                  <span>Register New Shipment</span>
                </button>
              }
            />
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Package}
              title="No shipments match your criteria"
              description="Check your spelling or reset filters to see results."
              action={
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                    setSelectedPriority("all");
                  }}
                  type="button"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Shipment / Tracking</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Route Corridor</th>
                    <th className="px-5 py-3">Assigned Unit</th>
                    <th className="px-5 py-3">Cargo Spec</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">ETA</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedShipments.map((shp) => (
                    <tr key={shp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Link
                          to={`/shipments/${shp.id}`}
                          className="font-bold text-blue-600 hover:underline block"
                        >
                          {shp.id}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {shp.trackingNumber}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">
                          {shp.customer}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Priority: {shp.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs truncate text-slate-600">
                        <div className="truncate">
                          <span className="font-medium text-slate-800">
                            {shp.pickupLocation?.split(",")[0] || "Origin"}
                          </span>
                          <span className="text-slate-400 mx-1">→</span>
                          <span className="font-medium text-slate-800">
                            {shp.deliveryLocation?.split(",")[0] || "Destination"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          Dest: {shp.deliveryLocation}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            shp.assignedDriverName === "Unassigned"
                              ? "text-slate-400 italic"
                              : "text-slate-900"
                          }`}
                        >
                          {shp.assignedDriverName}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {shp.vehiclePlate}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                        <span>{shp.cargoWeight}</span>
                        <span className="text-slate-400 block text-[10px]">
                          {shp.cargoType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={shp.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">
                        {shp.eta}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Link
                          to={`/shipments/${shp.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredShipments.length)} of{" "}
                  {filteredShipments.length} manifests
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-medium text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
