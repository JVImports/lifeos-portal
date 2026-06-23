"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-xl backdrop-blur-xl animate-fade-in transition-all ${
              t.type === "success"
                ? "bg-[#4edea3]/10 border-[#4edea3]/20 text-[#4edea3]"
                : t.type === "error"
                ? "bg-error/10 border-error/20 text-error"
                : "bg-primary/10 border-primary/20 text-[#adc6ff]"
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" && <CheckCircle className="w-5 h-5 shrink-0" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
              {t.type === "info" && <Info className="w-5 h-5 shrink-0" />}
              <span className="text-xs font-semibold leading-relaxed text-on-surface">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-on-surface/60 hover:text-on-surface p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
