import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Radio,
  User,
  Truck,
  Package,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function DispatchBoardPage() {
  const { shipments, drivers, vehicles, assignShipment } = useLogistics();

  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Unassigned shipments
  const unassignedShipments = shipments.filter(
    (s) => s.status === "Pending" || s.assignedDriverName === "Unassigned"
  );

  // Available resources
  const availableDrivers = drivers.filter((d) => d.status === "Available");
  const availableVehicles = vehicles.filter((v) => v.status === "Available");

  const openDispatchModal = (shipment) => {
    setSelectedShipment(shipment);
    setSelectedDriverId(availableDrivers[0]?.id || "");
    setSelectedVehicleId(availableVehicles[0]?.id || "");
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!selectedShipment || !selectedDriverId || !selectedVehicleId) {
      alert("Please select both a driver and a vehicle.");
      return;
    }

    assignShipment(selectedShipment.id, selectedDriverId, selectedVehicleId);
    setIsAssignModalOpen(false);
    setSelectedShipment(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch Operations Board"
        description="Allocate pending freight manifests to available fleet drivers and transport vehicles."
        badge={
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            {unassignedShipments.length} Unassigned Manifests
          </span>
        }
      />

      {/* Resource Availability Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Drivers */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Drivers ({availableDrivers.length})
              </h3>
            </div>
            <Link to="/drivers" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Manage Drivers →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableDrivers.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">No drivers available</p>
            ) : (
              availableDrivers.map((d) => (
                <div
                  key={d.id}
                  className="px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">{d.name}</span>
                  <span className="text-slate-400 text-[10px]">({d.experience || "Available"})</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Vehicles */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Vehicles ({availableVehicles.length})
              </h3>
            </div>
            <Link to="/fleet" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Manage Fleet →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableVehicles.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">No vehicles available</p>
            ) : (
              availableVehicles.map((v) => (
                <div
                  key={v.id}
                  className="px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800 font-mono">{v.id}</span>
                  <span className="text-slate-500 text-[11px]">{v.type?.split(" ")[0] || "Carrier"}</span>
                  <span className="text-slate-400 text-[10px]">Cap: {v.capacity}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Unassigned Shipments Queue */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Staged Shipments Awaiting Dispatch
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a manifest to assign an available carrier and transport vehicle.
            </p>
          </div>
        </div>

        {unassignedShipments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={CheckCircle2}
              title="No unassigned shipments"
              description="There are currently no manifests awaiting carrier allocation. Newly created orders will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Shipment ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Pickup Location</th>
                  <th className="px-5 py-3">Delivery Destination</th>
                  <th className="px-5 py-3">Cargo Spec</th>
                  <th className="px-5 py-3">Target ETA</th>
                  <th className="px-5 py-3 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {unassignedShipments.map((shp) => (
                  <tr key={shp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-blue-600 block">{shp.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{shp.trackingNumber}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {shp.customer}
                      <span className="block text-[10px] text-amber-600 font-semibold">
                        Priority: {shp.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate text-slate-600">
                      {shp.pickupLocation}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate font-medium text-slate-800">
                      {shp.deliveryLocation}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                      <span>{shp.cargoWeight}</span>
                      <span className="text-slate-400 block text-[10px]">{shp.cargoType}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {shp.eta}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openDispatchModal(shp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-2xs transition-colors"
                      >
                        <span>Assign Carrier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch Assignment Modal */}
      {selectedShipment && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Dispatch Manifest: ${selectedShipment.id}`}
          subtitle={`Assign driver & fleet transport for ${selectedShipment.customer}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleConfirmAssignment} className="space-y-4">
            {/* Manifest Summary Box */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Destination:</span>
                <strong className="text-slate-800">{selectedShipment.deliveryLocation}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cargo Weight:</span>
                <strong className="text-slate-800">{selectedShipment.cargoWeight}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target ETA:</span>
                <strong className="text-slate-800">{selectedShipment.eta}</strong>
              </div>
            </div>

            {/* Select Driver */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Available Driver *
              </label>
              <select
                required
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {availableDrivers.length === 0 ? (
                  <option value="">No drivers available</option>
                ) : (
                  availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.experience || "Certified"}) · Active Loads: {d.activeDeliveries || 0}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Select Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Available Fleet Vehicle *
              </label>
              <select
                required
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {availableVehicles.length === 0 ? (
                  <option value="">No vehicles available</option>
                ) : (
                  availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.regNumber} ({v.type}) · Cap: {v.capacity}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedDriverId || !selectedVehicleId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Confirm Dispatch & Allocate
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
