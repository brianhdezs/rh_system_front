import React from "react";
import { Clock } from "lucide-react";

const ActivityFeed: React.FC = () => {
  // Aquí conectarás con tu API para obtener actividades reales
  const activities: any[] = [];

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
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
