import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LogisticsProvider } from "./context/LogisticsContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <LogisticsProvider>
        <AppRoutes />
      </LogisticsProvider>
    </BrowserRouter>
  );
}
