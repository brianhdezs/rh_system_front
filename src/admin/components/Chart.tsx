import React from "react";
import {
  UserPlus,
  Clock,
  Briefcase,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Nuevo Empleado",
      color: "bg-indigo-500 hover:bg-indigo-600",
      onClick: () => console.log("Nuevo empleado"),
    },
    {
      icon: Clock,
      label: "Registrar Asistencia",
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => console.log("Registrar asistencia"),
    },
    {
      icon: Briefcase,
      label: "Nuevo Departamento",
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Nuevo departamento"),
    },
    {
      icon: FileText,
      label: "Generar Reporte",
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => console.log("Generar reporte"),
    },
    {
      icon: Calendar,
      label: "Ver Calendario",
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Ver calendario"),
    },
    {
      icon: Settings,
      label: "Configuración",
      color: "bg-gray-500 hover:bg-gray-600",
      onClick: () => console.log("Configuración"),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center space-x-2 p-3 rounded-lg text-white transition-colors ${action.color}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
