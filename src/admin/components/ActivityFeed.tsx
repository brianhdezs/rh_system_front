import React, { useState, useEffect } from "react";
import { Clock, Loader, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { employeeService } from "../../services/EmployeeService";
import { leaveService } from "../../services/LeaveService";

interface Activity {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const recentActivities: Activity[] = [];

      // Obtener últimos empleados creados
      try {
        const employees = await employeeService.getAll();
        const recentEmployees = employees.slice(-3); // Últimos 3

        recentEmployees.forEach((emp) => {
          recentActivities.push({
            icon: UserPlus,
            title: "Nuevo Empleado",
            description: `${emp.firstName} ${emp.lastName} fue agregado al sistema`,
            time: "Recientemente",
            color: "bg-blue-500",
          });
        });
      } catch (err) {
        console.error("Error loading employees for activity feed:", err);
      }

      // Obtener solicitudes de permisos recientes (simulado con empleado 1)
      try {
        const leaveRequests = await leaveService.getEmployeeRequests(1);
        const recentRequests = leaveRequests.data.slice(-2); // Últimas 2

        recentRequests.forEach((request) => {
          const statusConfig = {
            Approved: {
              icon: CheckCircle,
              color: "bg-green-500",
              text: "aprobada",
            },
            Rejected: { icon: XCircle, color: "bg-red-500", text: "rechazada" },
            Pending: { icon: Clock, color: "bg-yellow-500", text: "pendiente" },
          };

          const config =
            statusConfig[request.status as keyof typeof statusConfig] ||
            statusConfig.Pending;

          recentActivities.push({
            icon: config.icon,
            title: "Solicitud de Permiso",
            description: `Solicitud ${config.text}: ${request.leaveTypeName}`,
            time: new Date(request.requestedDate).toLocaleDateString("es-MX"),
            color: config.color,
          });
        });
      } catch (err) {
        console.error("Error loading leave requests for activity feed:", err);
      }

      // Ordenar por más reciente (simulado)
      setActivities(recentActivities.slice(0, 5));
    } catch (err) {
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin text-indigo-600 mb-3" size={48} />
          <p className="text-sm text-gray-600">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Actividad Reciente
      </h3>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Clock size={48} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No hay actividad reciente</p>
          <p className="text-xs mt-1 text-center">
            Las actividades del sistema aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
