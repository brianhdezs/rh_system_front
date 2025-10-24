import {
  Calendar,
  History,
  TrendingUp,
  CheckSquare,
  ArrowRight,
} from "lucide-react";

interface LeaveMainPageProps {
  onNavigateToRequest: () => void;
  onNavigateToHistory: () => void;
  onNavigateToBalance: () => void;
  onNavigateToApproval: () => void;
}

export default function LeaveMainPage({
  onNavigateToRequest,
  onNavigateToHistory,
  onNavigateToBalance,
  onNavigateToApproval,
}: LeaveMainPageProps) {
  const options = [
    {
      icon: Calendar,
      title: "Solicitar Permiso",
      description: "Crea una nueva solicitud de vacaciones o permiso",
      color: "from-blue-500 to-indigo-600",
      onClick: onNavigateToRequest,
    },
    {
      icon: History,
      title: "Historial de Solicitudes",
      description: "Consulta el historial completo de solicitudes",
      color: "from-purple-500 to-pink-600",
      onClick: onNavigateToHistory,
    },
    {
      icon: TrendingUp,
      title: "Balance de Vacaciones",
      description: "Verifica los días disponibles y utilizados",
      color: "from-green-500 to-emerald-600",
      onClick: onNavigateToBalance,
    },
    {
      icon: CheckSquare,
      title: "Aprobar/Rechazar",
      description: "Gestiona solicitudes pendientes de aprobación",
      color: "from-orange-500 to-red-600",
      onClick: onNavigateToApproval,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Vacaciones y Permisos
        </h1>
        <p className="text-gray-600 mt-2">
          Administra solicitudes, consulta balances y gestiona aprobaciones
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              onClick={option.onClick}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all transform hover:-translate-y-1 text-left"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{option.description}</p>
              <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                Acceder
                <ArrowRight size={20} className="ml-2" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🏖️ Tipos de Permisos
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Vacaciones anuales</li>
            <li>• Permisos por enfermedad</li>
            <li>• Permisos personales</li>
            <li>• Licencias especiales</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            ✅ Proceso de Aprobación
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Solicitud del empleado</li>
            <li>• Revisión del supervisor</li>
            <li>• Aprobación o rechazo</li>
            <li>• Notificación automática</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            📋 Recomendaciones
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Solicita con anticipación</li>
            <li>• Verifica tu balance</li>
            <li>• Justifica tu solicitud</li>
            <li>• Consulta políticas</li>
          </ul>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Sistema de Gestión de Permisos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">365</div>
            <div className="text-sm text-indigo-100 mt-1">Días del año</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm text-indigo-100 mt-1">
              Días de vacaciones
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10</div>
            <div className="text-sm text-indigo-100 mt-1">
              Días por enfermedad
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm text-indigo-100 mt-1">Días personales</div>
          </div>
        </div>
      </div>
    </div>
  );
}
