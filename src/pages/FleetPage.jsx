import React, { useState, useMemo } from "react";
import {
  Truck,
  BatteryCharging,
  Gauge,
  MapPin,
  Wrench,
  CheckCircle2,
  Plus,
  ArrowRight
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import FilterDropdown from "../components/FilterDropdown.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

const statusOptions = [
  { label: "All Vehicles", value: "all" },
  { label: "Available", value: "Available" },
  { label: "On Route", value: "On Route" },
  { label: "Maintenance", value: "Maintenance" }
];

export default function FleetPage() {
  const { vehicles, showToast } = useLogistics();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesStatus =
        selectedStatus === "all" ? true : v.status === selectedStatus;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        v.id?.toLowerCase().includes(term) ||
        v.regNumber?.toLowerCase().includes(term) ||
        v.type?.toLowerCase().includes(term) ||
        v.assignedDriver?.toLowerCase().includes(term) ||
        v.currentLocation?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [vehicles, searchTerm, selectedStatus]);

  const totalVehicles = vehicles.length;
  const onRouteCount = vehicles.filter((v) => v.status === "On Route").length;
  const availableCount = vehicles.filter((v) => v.status === "Available").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "Maintenance").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Vehicle Management"
        description="Monitor vehicle telemetry, payload capacity, maintenance schedules, and assigned driver allocations."
        actions={
          <button
            type="button"
            onClick={() => showToast("Vehicle telematics synchronized.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Gauge className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Telematics</span>
          </button>
        }
      />

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Fleet Units
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {totalVehicles}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
            On Route Active
          </span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">
            {onRouteCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Available for Dispatch
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {availableCount}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
            In Maintenance
          </span>
          <span className="text-xl font-bold text-rose-700 mt-1 block">
            {maintenanceCount}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by ID, plate, model, driver, or location..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <FilterDropdown
            label="Vehicle Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {vehicles.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Truck}
              title="No vehicles available"
              description="There are currently no vehicles registered in the fleet registry."
            />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Truck}
              title="No vehicles match your criteria"
              description="Try adjusting your search term or filter status."
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
                  <th className="px-5 py-3">Vehicle ID</th>
                  <th className="px-5 py-3">Registration Plate</th>
                  <th className="px-5 py-3">Vehicle Type</th>
                  <th className="px-5 py-3">Payload Capacity</th>
                  <th className="px-5 py-3">Assigned Driver</th>
                  <th className="px-5 py-3">Current Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVehicles.map((veh) => (
                  <tr key={veh.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900 font-mono">
                      {veh.id}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-blue-600 font-mono">
                      {veh.regNumber}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-800">
                      {veh.type}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Fuel: {veh.fuelLevel || "--"} · {veh.odometer || "--"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {veh.capacity}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          veh.assignedDriver === "Unassigned"
                            ? "text-slate-400 italic"
                            : "text-slate-900"
                        }`}
                      >
                        {veh.assignedDriver || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{veh.currentLocation || "Depot"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={veh.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle(veh)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Inspection Modal */}
      {selectedVehicle && (
        <Modal
          isOpen={Boolean(selectedVehicle)}
          onClose={() => setSelectedVehicle(null)}
          title={`Vehicle Telematics: ${selectedVehicle.id} (${selectedVehicle.regNumber})`}
          subtitle={`${selectedVehicle.type} · Nexus Fleet Registry`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-0.5">Registration</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {selectedVehicle.regNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Status</span>
                <StatusBadge status={selectedVehicle.status} size="sm" />
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Operator</span>
                <span className="font-semibold text-slate-800">
                  {selectedVehicle.assignedDriver || "Unassigned"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Max Gross Payload</span>
                <span className="font-semibold text-slate-800">
                  {selectedVehicle.capacity}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700 font-medium">Odometer Reading:</span>
              </div>
              <strong className="text-slate-900 font-mono">
                {selectedVehicle.odometer || "--"}
              </strong>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
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
