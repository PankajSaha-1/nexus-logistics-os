import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function ToastContainer() {
  const { toasts, dismissToast } = useLogistics();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "error"
              ? "bg-rose-900 text-white border-rose-800"
              : toast.type === "info"
              ? "bg-slate-900 text-white border-slate-800"
              : "bg-slate-900 text-white border-slate-800"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : toast.type === "info" ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs font-medium leading-relaxed pr-1">
            {toast.message}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            type="button"
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
