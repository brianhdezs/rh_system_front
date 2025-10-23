import { Clock, History, Calendar, ArrowRight } from "lucide-react";

interface AttendanceMainPageProps {
  onNavigateToClock: () => void;
  onNavigateToHistory: () => void;
  onNavigateToDaily: () => void;
}

export default function AttendanceMainPage({
  onNavigateToClock,
  onNavigateToHistory,
  onNavigateToDaily,
}: AttendanceMainPageProps) {
  const options = [
    {
      icon: Clock,
      title: "Control de Asistencia",
      description: "Registra tu entrada y salida del trabajo",
      color: "from-green-500 to-emerald-600",
      onClick: onNavigateToClock,
    },
    {
      icon: History,
      title: "Historial de Asistencias",
      description: "Consulta el historial completo de un empleado",
      color: "from-blue-500 to-indigo-600",
      onClick: onNavigateToHistory,
    },
    {
      icon: Calendar,
      title: "Asistencias del Día",
      description: "Ver todas las asistencias de una fecha específica",
      color: "from-purple-500 to-pink-600",
      onClick: onNavigateToDaily,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Sistema de Asistencias
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona y consulta los registros de asistencia de tu equipo
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              onClick={option.onClick}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all transform hover:-translate-y-1"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Consejos de Uso
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Registra tu entrada al comenzar tu jornada</li>
            <li>• No olvides registrar tu salida al terminar</li>
            <li>• Consulta tu historial regularmente</li>
            <li>• Reporta cualquier inconsistencia</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ Beneficios
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• Control preciso de horas trabajadas</li>
            <li>• Historial completo y detallado</li>
            <li>• Reportes exportables en CSV</li>
            <li>• Acceso en tiempo real</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
