import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialShipments,
  initialDrivers,
  initialVehicles,
  initialAIInsights
} from "../data/mockData.js";

const LogisticsContext = createContext();

const STORAGE_KEYS = {
  shipments: "nexus_os_shipments",
  drivers: "nexus_os_drivers",
  vehicles: "nexus_os_vehicles",
  aiInsights: "nexus_os_ai_insights",
  user: "nexus_os_user"
};

// Clear legacy dummy cache keys from previous versions
const clearLegacyStorage = () => {
  try {
    const legacyKeys = [
      "nexus_shipments", "nexus_drivers", "nexus_vehicles", "nexus_ai_insights", "nexus_user",
      "nexus_v2_shipments", "nexus_v2_drivers", "nexus_v2_vehicles", "nexus_v2_ai_insights", "nexus_v2_user"
    ];
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    // ignore
  }
};

export function LogisticsProvider({ children }) {
  // Clear legacy mock data once on load
  useEffect(() => {
    clearLegacyStorage();
  }, []);

  const [shipments, setShipments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.shipments);
      if (saved) return JSON.parse(saved);
      return initialShipments;
    } catch {
      return initialShipments;
    }
  });

  const [drivers, setDrivers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.drivers);
      if (saved) return JSON.parse(saved);
      return initialDrivers;
    } catch {
      return initialDrivers;
    }
  });

  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.vehicles);
      if (saved) return JSON.parse(saved);
      return initialVehicles;
    } catch {
      return initialVehicles;
    }
  });

  const [aiInsights, setAiInsights] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.aiInsights);
      if (saved) return JSON.parse(saved);
      return initialAIInsights;
    } catch {
      return initialAIInsights;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.user);
      if (saved) return JSON.parse(saved);
      return {
        name: "Pankaj Saha",
        email: "pankaj.saha@nexuslogistics.in",
        role: "Fleet Operations Manager",
        isAuthenticated: true
      };
    } catch {
      return {
        name: "Pankaj Saha",
        email: "pankaj.saha@nexuslogistics.in",
        role: "Fleet Operations Manager",
        isAuthenticated: true
      };
    }
  });

  const [toasts, setToasts] = useState([]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.shipments, JSON.stringify(shipments));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [shipments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.drivers, JSON.stringify(drivers));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.aiInsights, JSON.stringify(aiInsights));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [aiInsights]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [currentUser]);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new shipment
  const addShipment = (newShipmentData) => {
    const newId = `SHP-${1000 + shipments.length + 1}`;
    const tracking = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newShipment = {
      id: newId,
      trackingNumber: tracking,
      customer: newShipmentData.customer || "General Consignee",
      pickupLocation: newShipmentData.pickupLocation || "",
      deliveryLocation: newShipmentData.deliveryLocation || "",
      assignedDriverId: newShipmentData.assignedDriverId || "",
      assignedDriverName: newShipmentData.assignedDriverName || "Unassigned",
      assignedVehicleId: newShipmentData.assignedVehicleId || "",
      vehiclePlate: newShipmentData.vehiclePlate || "Unassigned",
      status: newShipmentData.assignedDriverId ? "In Transit" : "Pending",
      priority: newShipmentData.priority || "Standard",
      eta: newShipmentData.eta || "Scheduled",
      createdAt: now.toISOString().slice(0, 16).replace("T", " "),
      cargoWeight: newShipmentData.cargoWeight || "0 kg",
      packageCount: Number(newShipmentData.packageCount) || 1,
      cargoType: newShipmentData.cargoType || "General Cargo",
      recipientContact: newShipmentData.recipientContact || "",
      notes: newShipmentData.notes || "",
      timeline: [
        {
          time: formattedTime,
          title: "Order Booked",
          description: "Registered into operations system",
          completed: true
        }
      ]
    };

    setShipments((prev) => [newShipment, ...prev]);

    // If assigned to a driver immediately, increment driver's active deliveries
    if (newShipmentData.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((drv) =>
          drv.id === newShipmentData.assignedDriverId
            ? { ...drv, activeDeliveries: (drv.activeDeliveries || 0) + 1, status: "On Route" }
            : drv
        )
      );
    }

    showToast(`Shipment ${newId} created successfully`);
    return newShipment;
  };

  // Update shipment status
  const updateShipmentStatus = (shipmentId, newStatus, note = "") => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let targetShipment = null;

    setShipments((prev) =>
      prev.map((shp) => {
        if (shp.id === shipmentId) {
          targetShipment = shp;
          const currentTimeline = shp.timeline || [];
          const updatedTimeline = [
            ...currentTimeline,
            {
              time: formattedTime,
              title: `Status Updated: ${newStatus}`,
              description: note || `Shipment marked as ${newStatus}`,
              completed: true
            }
          ];
          return {
            ...shp,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return shp;
      })
    );

    // If delivered, update driver stats and vehicle availability
    if (newStatus === "Delivered" && targetShipment && targetShipment.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((drv) => {
          if (drv.id === targetShipment.assignedDriverId) {
            const newActive = Math.max(0, (drv.activeDeliveries || 1) - 1);
            return {
              ...drv,
              activeDeliveries: newActive,
              completedDeliveries: (drv.completedDeliveries || 0) + 1,
              status: newActive === 0 ? "Available" : "On Route"
            };
          }
          return drv;
        })
      );

      if (targetShipment.assignedVehicleId) {
        setVehicles((prev) =>
          prev.map((veh) =>
            veh.id === targetShipment.assignedVehicleId
              ? { ...veh, status: "Available" }
              : veh
          )
        );
      }
    }

    showToast(`Shipment ${shipmentId} updated to "${newStatus}"`);
  };

  // Assign shipment (Dispatch operation)
  const assignShipment = (shipmentId, driverId, vehicleId) => {
    const driver = drivers.find((d) => d.id === driverId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!driver || !vehicle) {
      showToast("Invalid driver or vehicle selected", "error");
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setShipments((prev) =>
      prev.map((shp) => {
        if (shp.id === shipmentId) {
          const currentTimeline = shp.timeline || [];
          return {
            ...shp,
            assignedDriverId: driver.id,
            assignedDriverName: driver.name,
            assignedVehicleId: vehicle.id,
            vehiclePlate: vehicle.regNumber,
            status: "In Transit",
            timeline: [
              ...currentTimeline,
              {
                time: formattedTime,
                title: "Dispatched & Carrier Assigned",
                description: `Assigned to driver ${driver.name} with vehicle ${vehicle.regNumber} (${vehicle.type})`,
                completed: true
              }
            ]
          };
        }
        return shp;
      })
    );

    // Update driver state
    setDrivers((prev) =>
      prev.map((drv) =>
        drv.id === driverId
          ? {
              ...drv,
              status: "On Route",
              activeDeliveries: (drv.activeDeliveries || 0) + 1,
              assignedVehicle: `${vehicle.id} (${vehicle.type})`,
              assignedVehicleId: vehicle.id
            }
          : drv
      )
    );

    // Update vehicle state
    setVehicles((prev) =>
      prev.map((veh) =>
        veh.id === vehicleId
          ? {
              ...veh,
              status: "On Route",
              assignedDriver: driver.name,
              assignedDriverId: driver.id
            }
          : veh
      )
    );

    showToast(`Shipment ${shipmentId} dispatched to ${driver.name}`);
  };

  // AI Insight Actions
  const applyAIAction = (insightId) => {
    const insight = aiInsights.find((i) => i.id === insightId);
    if (!insight) return;

    setAiInsights((prev) =>
      prev.map((i) =>
        i.id === insightId
          ? { ...i, status: "Applied", suggestedAction: `[APPLIED]: ${i.suggestedAction}` }
          : i
      )
    );

    if (insight.shipmentId) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setShipments((prev) =>
        prev.map((shp) => {
          if (shp.id === insight.shipmentId) {
            const currentTimeline = shp.timeline || [];
            return {
              ...shp,
              notes: `${shp.notes ? shp.notes + " | " : ""}AI Optimization Applied: ${insight.suggestedAction}`,
              timeline: [
                ...currentTimeline,
                {
                  time: formattedTime,
                  title: "AI Route Optimization Executed",
                  description: insight.suggestedAction,
                  completed: true
                }
              ]
            };
          }
          return shp;
        })
      );
    }

    showToast(`AI Optimization applied for ${insight.shipmentId}`);
  };

  const dismissAIAction = (insightId) => {
    setAiInsights((prev) =>
      prev.map((i) => (i.id === insightId ? { ...i, status: "Dismissed" } : i))
    );
    showToast(`AI insight acknowledged`);
  };

  // Clear all local records
  const clearAllData = () => {
    setShipments([]);
    setDrivers([]);
    setVehicles([]);
    setAiInsights([]);
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    clearLegacyStorage();
    showToast("Local data store cleared");
  };

  // Provide alias for backwards compatibility
  const resetToDemoData = clearAllData;

  // Auth functions
  const login = (email) => {
    setCurrentUser({
      name: email ? email.split("@")[0].replace(".", " ").toUpperCase() : "Pankaj Saha",
      email: email || "pankaj.saha@nexuslogistics.in",
      role: "Fleet Operations Manager",
      isAuthenticated: true
    });
    showToast("Signed in successfully to Nexus Logistics OS");
  };

  const logout = () => {
    setCurrentUser({
      name: "Guest",
      email: "",
      role: "Guest",
      isAuthenticated: false
    });
    showToast("Signed out of session", "info");
  };

  return (
    <LogisticsContext.Provider
      value={{
        shipments,
        setShipments,
        drivers,
        setDrivers,
        vehicles,
        setVehicles,
        aiInsights,
        setAiInsights,
        currentUser,
        toasts,
        showToast,
        dismissToast,
        addShipment,
        updateShipmentStatus,
        assignShipment,
        applyAIAction,
        dismissAIAction,
        clearAllData,
        resetToDemoData,
        login,
        logout
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error("useLogistics must be used within a LogisticsProvider");
  }
  return context;
}
