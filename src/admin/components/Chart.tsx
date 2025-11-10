import React from "react";
import { BarChart3, Loader } from "lucide-react";

interface ChartData {
  label: string;
  value: number;
}

interface ChartProps {
  title: string;
  data?: ChartData[];
  loading?: boolean;
}

const Chart: React.FC<ChartProps> = ({ title, data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin text-indigo-600 mb-3" size={48} />
          <p className="text-sm text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <BarChart3 size={48} className="mb-3 opacity-50" />
          <p className="text-sm">No hay datos disponibles</p>
          <p className="text-xs mt-1">
            Los datos aparecerán aquí cuando estén disponibles
          </p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500">
          Total: {data.reduce((sum, item) => sum + item.value, 0)}
        </span>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-24 text-sm text-gray-600 font-medium truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-16 text-sm font-medium text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
