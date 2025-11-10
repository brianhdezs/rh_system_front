import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Clock, Loader } from "lucide-react";
import { leaveService } from "../../services/LeaveService";

interface NotificationsPanelProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  type: "leave_request" | "info" | "success";
  title: string;
  message: string;
  time: string;
  actionable: boolean;
  requestId?: number;
}

export default function NotificationsPanel({
  onClose,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notifs: Notification[] = [];

      try {
        const leaveRequests = await leaveService.getEmployeeRequests(1);
        const pendingRequests = leaveRequests.data.filter(
          (r) => r.status === "Pending"
        );

        pendingRequests.forEach((request) => {
          notifs.push({
            id: request.requestId,
            type: "leave_request",
            title: "Nueva Solicitud de Permiso",
            message: `Solicitud de ${request.leaveTypeName} - ${request.totalDays} días`,
            time: new Date(request.requestedDate).toLocaleDateString("es-MX"),
            actionable: true,
            requestId: request.requestId,
          });
        });
      } catch (err) {
        console.error("Error loading leave requests:", err);
      }

      if (notifs.length === 0) {
        notifs.push({
          id: 0,
          type: "info",
          title: "Sistema HRMS",
          message: "Bienvenido al sistema de gestión de recursos humanos",
          time: "Hoy",
          actionable: false,
        });
      }

      setNotifications(notifs);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "leave_request":
        return <AlertCircle className="text-yellow-600" size={20} />;
      case "success":
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <Clock className="text-blue-600" size={20} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "leave_request":
        return "bg-yellow-50";
      case "success":
        return "bg-green-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <>
      {/* Overlay con backdrop blur */}
      <div
        className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
            <p className="text-sm text-gray-600 mt-1">
              {notifications.length}{" "}
              {notifications.length === 1 ? "notificación" : "notificaciones"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-indigo-600 mb-3" size={48} />
              <p className="text-sm text-gray-600">
                Cargando notificaciones...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CheckCircle size={64} className="mb-4 opacity-50" />
              <p className="text-sm font-medium">No hay notificaciones</p>
              <p className="text-xs mt-1 text-center">
                Estás al día con todas tus tareas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${getBackgroundColor(
                    notification.type
                  )} rounded-lg p-4 border border-gray-200`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                      {notification.actionable && (
                        <div className="flex space-x-2 mt-3">
                          <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                            Aprobar
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors">
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium">
              Marcar todas como leídas
            </button>
          </div>
        )}
      </div>
    </>
  );
}
