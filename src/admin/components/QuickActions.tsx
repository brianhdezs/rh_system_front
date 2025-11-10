import React from "react";
import { UserPlus, Clock, BarChart3, Plane } from "lucide-react";

interface QuickActionsProps {
  onNavigateToEmployees?: () => void;
  onNavigateToLeave?: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToPerformance?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigateToEmployees,
  onNavigateToLeave,
  onNavigateToAttendance,
  onNavigateToPerformance,
}) => {
  const actions = [
    {
      icon: UserPlus,
      label: "Gestionar Empleados",
      color: "bg-indigo-500 hover:bg-indigo-600",
      onClick: onNavigateToEmployees,
    },
    {
      icon: Plane,
      label: "Solicitudes de Permisos",
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: onNavigateToLeave,
    },
    {
      icon: Clock,
      label: "Control de Asistencias",
      color: "bg-green-500 hover:bg-green-600",
      onClick: onNavigateToAttendance,
    },
    {
      icon: BarChart3,
      label: "Evaluaciones",
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: onNavigateToPerformance,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${action.color}`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
