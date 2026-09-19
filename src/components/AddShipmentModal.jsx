import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function AddShipmentModal({ isOpen, onClose }) {
  const { addShipment, drivers, vehicles } = useLogistics();

  const [formData, setFormData] = useState({
    customer: "",
    pickupLocation: "Kolkata Central Hub, Taratala Logistics Park, Kolkata",
    deliveryLocation: "",
    priority: "Standard",
    cargoType: "General Commercial Cargo",
    cargoWeight: "350 kg",
    packageCount: "8",
    recipientContact: "+91 98300-",
    assignedDriverId: "",
    notes: ""
  });

  const availableDrivers = drivers.filter((d) => d.status !== "Off Duty");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.deliveryLocation) {
      alert("Please fill in Customer and Delivery Location");
      return;
    }

    let assignedDriverName = "Unassigned";
    let assignedVehicleId = "";
    let vehiclePlate = "Unassigned";

    if (formData.assignedDriverId) {
      const selectedDrv = drivers.find((d) => d.id === formData.assignedDriverId);
      if (selectedDrv) {
        assignedDriverName = selectedDrv.name;
        assignedVehicleId = selectedDrv.assignedVehicleId || "";
        const veh = vehicles.find((v) => v.id === selectedDrv.assignedVehicleId);
        if (veh) vehiclePlate = veh.regNumber;
      }
    }

    addShipment({
      ...formData,
      assignedDriverName,
      assignedVehicleId,
      vehiclePlate,
      eta: "Today, 18:30"
    });

    onClose();
    // Reset form
    setFormData({
      customer: "",
      pickupLocation: "Kolkata Central Hub, Taratala Logistics Park, Kolkata",
      deliveryLocation: "",
      priority: "Standard",
      cargoType: "General Commercial Cargo",
      cargoWeight: "350 kg",
      packageCount: "8",
      recipientContact: "+91 98300-",
      assignedDriverId: "",
      notes: ""
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      subtitle="Register an order manifest into Nexus Logistics OS"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer / Consignee *
            </label>
            <input
              type="text"
              name="customer"
              required
              placeholder="e.g., Summit Logistics Corp"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Standard">Standard (Within 24h)</option>
              <option value="Express">Express (Same Day)</option>
              <option value="Urgent">Urgent (Immediate Dispatch)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pickup Origin
          </label>
          <input
            type="text"
            name="pickupLocation"
            required
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Delivery Destination *
          </label>
          <input
            type="text"
            name="deliveryLocation"
            required
            placeholder="e.g., Sector V, Salt Lake, Kolkata or Cyber City, Gurugram, Delhi NCR"
            value={formData.deliveryLocation}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cargo Type
            </label>
            <input
              type="text"
              name="cargoType"
              value={formData.cargoType}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="text"
              name="cargoWeight"
              value={formData.cargoWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Package Units
            </label>
            <input
              type="number"
              name="packageCount"
              min="1"
              value={formData.packageCount}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient Contact
            </label>
            <input
              type="text"
              name="recipientContact"
              value={formData.recipientContact}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Driver Assignment (Optional)
            </label>
            <select
              name="assignedDriverId"
              value={formData.assignedDriverId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Leave Unassigned (Queue for Dispatch)</option>
              {availableDrivers.map((drv) => (
                <option key={drv.id} value={drv.id}>
                  {drv.name} ({drv.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dispatch Instructions / Handling Notes
          </label>
          <textarea
            name="notes"
            rows="2"
            placeholder="Special delivery gate instructions, temperature, or loading dock requirements..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Create Manifest & Add
          </button>
        </div>
      </form>
    </Modal>
  );
}
