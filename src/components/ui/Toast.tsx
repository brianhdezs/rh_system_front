import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  description?: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  type,
  message,
  description,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    console.log("✅ Toast mounted:", { type, message, description });

    if (duration) {
      const timer = setTimeout(() => {
        console.log("⏰ Toast auto-closing");
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type, message, description]);

  const config = {
    success: {
      icon: <CheckCircle2 className="shrink-0 size-4 mt-0.5" />,
      iconColor: "text-teal-500",
      bgColor: "bg-white",
    },
    error: {
      icon: <XCircle className="shrink-0 size-4 mt-0.5" />,
      iconColor: "text-red-500",
      bgColor: "bg-white",
    },
    warning: {
      icon: <AlertCircle className="shrink-0 size-4 mt-0.5" />,
      iconColor: "text-yellow-500",
      bgColor: "bg-white",
    },
    info: {
      icon: <Info className="shrink-0 size-4 mt-0.5" />,
      iconColor: "text-blue-500",
      bgColor: "bg-white",
    },
  };

  const { icon, iconColor, bgColor } = config[type];

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-xs ${bgColor} border border-gray-200 rounded-xl shadow-lg`}
      role="alert"
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div className="flex p-4">
        <div className={`shrink-0 ${iconColor}`}>{icon}</div>
        <div className="ms-3 flex-1">
          <p className="text-sm font-semibold text-gray-800">{message}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ms-auto inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="shrink-0 size-4" />
        </button>
      </div>
    </div>
  );
}
