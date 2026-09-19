import React, { useState, useMemo } from "react";
import {
  Users,
  Phone,
  Mail,
  Award,
  Truck,
  CheckCircle,
  MapPin,
  Star,
  Clock
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import FilterDropdown from "../components/FilterDropdown.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

const statusOptions = [
  { label: "All Drivers", value: "all" },
  { label: "Available", value: "Available" },
  { label: "On Route", value: "On Route" },
  { label: "Off Duty", value: "Off Duty" }
];

export default function DriversPage() {
  const { drivers, shipments } = useLogistics();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeDriverModal, setActiveDriverModal] = useState(null);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((drv) => {
      const matchesStatus =
        selectedStatus === "all" ? true : drv.status === selectedStatus;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        drv.name?.toLowerCase().includes(term) ||
        drv.phone?.toLowerCase().includes(term) ||
        drv.email?.toLowerCase().includes(term) ||
        drv.assignedVehicle?.toLowerCase().includes(term) ||
        drv.location?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [drivers, searchTerm, selectedStatus]);

  const totalDrivers = drivers.length;
  const availableCount = drivers.filter((d) => d.status === "Available").length;
  const onRouteCount = drivers.filter((d) => d.status === "On Route").length;
  const avgRating =
    totalDrivers > 0
      ? (drivers.reduce((acc, d) => acc + (d.rating || 5.0), 0) / totalDrivers).toFixed(2)
      : "--";

  const driverActiveShipments = activeDriverModal
    ? shipments.filter((s) => s.assignedDriverId === activeDriverModal.id)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Personnel Management"
        description="Oversee certified commercial carrier staff, active route allocations, and safety compliance ratings."
      />

      {/* Driver Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Registered Drivers
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {totalDrivers}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Available Now
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {availableCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
            Currently on Route
          </span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">
            {onRouteCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Average Safety Rating
          </span>
          <span className="text-xl font-bold text-slate-800 mt-1 block flex items-center gap-1">
            <span>{avgRating}</span>
            {avgRating !== "--" && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by driver name, phone, license, or route..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <FilterDropdown
            label="Driver Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {drivers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No drivers available"
              description="There are currently no carrier drivers registered in the personnel directory."
            />
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No drivers match your criteria"
              description="Check your spelling or reset the status filter."
              action={
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Driver Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Assigned Vehicle</th>
                  <th className="px-5 py-3">Active Deliveries</th>
                  <th className="px-5 py-3">Completed Total</th>
                  <th className="px-5 py-3">Safety Rating</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDrivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-[11px]">
                          {drv.name ? drv.name.slice(0, 2).toUpperCase() : "DR"}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{drv.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{drv.license || drv.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{drv.phone || "--"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-800">
                      {drv.assignedVehicle || "None"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          (drv.activeDeliveries || 0) > 0 ? "text-blue-600" : "text-slate-500"
                        }`}
                      >
                        {drv.activeDeliveries || 0} in progress
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {drv.completedDeliveries || 0} loads
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <span>{drv.rating || 5.0}</span>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={drv.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setActiveDriverModal(drv)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      {activeDriverModal && (
        <Modal
          isOpen={Boolean(activeDriverModal)}
          onClose={() => setActiveDriverModal(null)}
          title={`Driver Dossier: ${activeDriverModal.name}`}
          subtitle={`Commercial Carrier Certification · ID: ${activeDriverModal.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-0.5">Contact Phone</span>
                <span className="font-semibold text-slate-800">{activeDriverModal.phone || "--"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">License / Permit</span>
                <span className="font-mono font-semibold text-slate-800">
                  {activeDriverModal.license || "--"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Experience</span>
                <span className="font-semibold text-slate-800">
                  {activeDriverModal.experience || "--"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Operational Status</span>
                <StatusBadge status={activeDriverModal.status} size="sm" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">
                Active Assigned Deliveries ({driverActiveShipments.length})
              </h4>
              {driverActiveShipments.length === 0 ? (
                <p className="text-slate-400 italic">No manifests currently assigned to this driver.</p>
              ) : (
                <div className="space-y-1.5">
                  {driverActiveShipments.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-blue-600">{s.id}</span>
                        <span className="text-slate-600 block">{s.customer}</span>
                      </div>
                      <StatusBadge status={s.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveDriverModal(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
