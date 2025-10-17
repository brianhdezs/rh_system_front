import React from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Calendar, Briefcase, FileText, Clock } from "lucide-react";
import StatCard from "../admin/components/StatCard";
import QuickActions from "../admin/components/QuickActions";
import ActivityFeed from "../admin/components/ActivityFeed";
import ChartComponent from "../admin/components/Chart";
const Chart = ChartComponent as React.ComponentType<{
  title: string;
  data: any[];
}>;

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Datos temporales - reemplazar con datos de tu API
  const quickStats = [
    {
      title: "Empleados Activos",
      value: "0",
      icon: Users,
      color: "bg-blue-500",
      description: "Total de empleados",
    },
    {
      title: "Asistencias Hoy",
      value: "0",
      icon: Clock,
      color: "bg-green-500",
      description: "Registros del día",
    },
    {
      title: "Departamentos",
      value: "0",
      icon: Briefcase,
      color: "bg-purple-500",
      description: "Áreas activas",
    },
    {
      title: "Documentos",
      value: "0",
      icon: FileText,
      color: "bg-orange-500",
      description: "Pendientes",
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Chart title="Asistencias por Departamento" data={[]} />
          <Chart title="Empleados por Área" data={[]} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions />
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
            Próximos Pasos
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Agregar empleados
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Comienza registrando a tu equipo
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Crear departamentos
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Organiza las áreas de tu empresa
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Configurar asistencias
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Define horarios y políticas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
