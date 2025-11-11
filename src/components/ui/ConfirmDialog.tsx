import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  type = "danger",
}: ConfirmDialogProps) {
  const colors = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const colorScheme = colors[type];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl max-w-md w-full shadow-2xl pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className={`${colorScheme.bg} p-2 rounded-lg`}>
                <AlertTriangle className={colorScheme.icon} size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${colorScheme.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
