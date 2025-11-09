import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import Toast from "../components/ui/Toast";

interface ToastState {
  show: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
  description?: string;
}

interface ToastContextType {
  showToast: (
    type: "success" | "error" | "warning" | "info",
    message: string,
    description?: string
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "info",
    message: "",
    description: "",
  });

  const showToast = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      message: string,
      description?: string
    ) => {
      console.log("🔔 Global Toast triggered:", { type, message, description });
      setToast({
        show: true,
        type,
        message,
        description,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    console.log("🔕 Hiding global toast");
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          description={toast.description}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
}
