import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  User,
  Truck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  Phone,
  RefreshCw
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function ShipmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shipments, updateShipmentStatus, drivers, vehicles } = useLogistics();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("In Transit");
  const [statusNote, setStatusNote] = useState("");

  const shipment = shipments.find((s) => s.id === id);

  if (!shipment) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8">
        <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Shipment Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          No manifest record exists with ID "{id}".
        </p>
        <Link
          to="/shipments"
          className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shipments</span>
        </Link>
      </div>
    );
  }

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateShipmentStatus(shipment.id, newStatus, statusNote);
    setIsUpdateModalOpen(false);
    setStatusNote("");
  };

  const assignedDriver = drivers.find((d) => d.id === shipment.assignedDriverId);
  const assignedVehicle = vehicles.find((v) => v.id === shipment.assignedVehicleId);

  return (
    <div className="space-y-6">
      {/* Back navigation & Header */}
      <div>
        <Link
          to="/shipments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shipments</span>
        </Link>

        <PageHeader
          title={`Manifest: ${shipment.id}`}
          description={`Tracking Reference: ${shipment.trackingNumber} · Registered: ${shipment.createdAt}`}
          badge={<StatusBadge status={shipment.status} />}
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewStatus(shipment.status);
                  setIsUpdateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Main Grid: Details & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Corridor & Locations */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Transit Route & Corridor
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Origin Pickup Facility
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {shipment.pickupLocation}
                  </p>
                </div>
              </div>

              <div className="ml-4 pl-4 border-l-2 border-dashed border-slate-200 py-1">
                <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scheduled Arrival Window: <strong className="text-slate-800">{shipment.eta}</strong></span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                    Delivery Destination
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {shipment.deliveryLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Cargo Specifications */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Cargo & Consignee Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Consignee Customer</span>
                <span className="font-semibold text-slate-800 text-sm">{shipment.customer}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Recipient Direct Contact</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {shipment.recipientContact}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Cargo Description</span>
                <span className="font-medium text-slate-800">{shipment.cargoType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Manifest Weight & Volume</span>
                <span className="font-medium text-slate-800">
                  {shipment.cargoWeight} ({shipment.packageCount} units)
                </span>
              </div>
            </div>

            {shipment.notes && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                  Handling Notes
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                  {shipment.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Assigned Resource & Simple Timeline */}
        <div className="space-y-6">
          {/* Assigned Driver & Vehicle Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Assigned Operational Unit
            </h3>

            {shipment.assignedDriverName === "Unassigned" ? (
              <div className="text-center py-4 bg-amber-50/50 rounded-lg border border-amber-200/60 p-4">
                <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-amber-800">Awaiting Carrier Assignment</p>
                <p className="text-[11px] text-amber-700 mt-1 mb-3">
                  This shipment has not been allocated to a driver yet.
                </p>
                <Link
                  to="/dispatch"
                  className="inline-block px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md shadow-2xs"
                >
                  Go to Dispatch Board
                </Link>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Driver
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {shipment.assignedDriverName}
                    </span>
                    {assignedDriver && (
                      <span className="text-slate-500 block text-[11px]">
                        {assignedDriver.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Vehicle & Registration
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {shipment.vehiclePlate}
                    </span>
                    {assignedVehicle && (
                      <span className="text-slate-500 block text-[11px]">
                        {assignedVehicle.type} (Cap: {assignedVehicle.capacity})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simple Delivery Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Operational Timeline
            </h3>

            <div className="relative pl-6 space-y-4">
              <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-slate-200" />

              {(shipment.timeline || []).map((event, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      event.completed
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    {event.completed ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {event.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {event.time}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Shipment Status (${shipment.id})`}
        subtitle="Log an event transition into the manifest timeline"
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Pending">Pending (Awaiting Dispatch)</option>
              <option value="In Transit">In Transit (On Corridor)</option>
              <option value="Out for Delivery">Out for Delivery (Final Mile)</option>
              <option value="Delivered">Delivered (Completed)</option>
              <option value="Delayed">Delayed (Route Interruption)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Log / Checkpoint Note (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g., Arrived at local distribution hub or delay reason..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Confirm Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
