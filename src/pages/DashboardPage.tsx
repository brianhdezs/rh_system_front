import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  Plane,
  Loader,
} from "lucide-react";
import StatCard from "../admin/components/StatCard";
import QuickActions from "../admin/components/QuickActions";
import ActivityFeed from "../admin/components/ActivityFeed";
import Chart from "../admin/components/Chart";
import { useDashboardStats } from "../hooks/useDashboardStats";

interface DashboardPageProps {
  onNavigateToEmployees: () => void;
  onNavigateToLeave?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToEmployees,
  onNavigateToLeave,
}) => {
  const { user } = useAuth();
  const {
    totalEmployees,
    attendanceToday,
    pendingLeaveRequests,
    loading,
    error,
  } = useDashboardStats();

  const quickStats = [
    {
      title: "Empleados Activos",
      value: loading ? "..." : totalEmployees.toString(),
      icon: Users,
      color: "bg-blue-500",
      description: "Total de empleados",
    },
    {
      title: "Asistencias Hoy",
      value: loading ? "..." : attendanceToday.toString(),
      icon: Clock,
      color: "bg-green-500",
      description: "Registros del día",
    },
    {
      title: "Solicitudes Pendientes",
      value: loading ? "..." : pendingLeaveRequests.toString(),
      icon: Plane,
      color: "bg-purple-500",
      description: "Permisos por aprobar",
    },
    {
      title: "Evaluaciones",
      value: "0",
      icon: FileText,
      color: "bg-orange-500",
      description: "En revisión",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.fullName}! 👋
        </h1>
        <p className="text-indigo-100">
          Aquí está el resumen de tu sistema de recursos humanos
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>
              {new Date().toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-white/20 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">⚠️ {error}</p>
          <p className="text-sm text-red-600 mt-1">
            Algunas estadísticas pueden no estar disponibles
          </p>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            onClick={index === 0 ? onNavigateToEmployees : undefined}
            className={index === 0 ? "cursor-pointer" : ""}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
          <Loader className="animate-spin text-blue-600" size={20} />
          <p className="text-blue-800">
            Cargando estadísticas en tiempo real...
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Chart title="Asistencias por Departamento" />
          <Chart title="Empleados por Área" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions
            onNavigateToEmployees={onNavigateToEmployees}
            onNavigateToLeave={onNavigateToLeave}
          />
          <ActivityFeed />
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Usuario
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Nombre Completo</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.fullName}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.email}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Rol</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">ID de Usuario</span>
              <span className="text-sm font-medium text-gray-900">
                #{user?.userId}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acceso Rápido
          </h2>
          <div className="space-y-3">
            <button
              onClick={onNavigateToEmployees}
              className="w-full flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left"
            >
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                <Users size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Gestionar Empleados
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {totalEmployees} empleados activos
                </p>
              </div>
              <ArrowRight size={20} className="text-indigo-600 mt-1" />
            </button>

            <button
              onClick={onNavigateToLeave}
              className="w-full flex items-start space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                <Plane size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Solicitudes de Permisos
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {pendingLeaveRequests} solicitudes pendientes
                </p>
              </div>
              <ArrowRight size={20} className="text-purple-600 mt-1" />
            </button>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                <Clock size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Asistencias de Hoy
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {attendanceToday} registros del día
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
